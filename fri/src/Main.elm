module Main exposing (..)

import Bootstrap.Alert as Alert
import Bootstrap.Button as Button
import Bootstrap.ButtonGroup as ButtonGroup
import Bootstrap.Table as Table
import Bootstrap.Form
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Form.Input
import Bootstrap.Form.Checkbox
import Bootstrap.Form.Textarea
import Bootstrap.Form.Select
import Bootstrap.Utilities.Flex exposing (..)
import Bootstrap.Utilities.Spacing as Spacing
import Bootstrap.Modal as Modal
import Browser
import Browser exposing (Document, UrlRequest)
import Browser.Events
import Form.Error exposing (ErrorValue(..))
import Browser.Navigation as Navigation
import Data.Project exposing (Project)
import Data.User exposing (User)
import Data.Session exposing (Session)
import Data.Notification exposing (Notification)
import Form exposing (Form)
import Form.Input as Input
import Form.Field as Field exposing (Field, FieldValue(..))
import Form.Validate as Validate exposing (Validation, andMap, succeed, field)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy exposing (lazy)
import Http exposing (emptyBody)
import Json.Decode as Json
import Json.Encode exposing (Value, object)
import Json.Encode.Extra as Encode
import Ports
import Update.Deep exposing (..)
import Update.Deep.Browser
import Url exposing (Url)
import Url.Parser as Parser exposing (Parser, parse, oneOf, (</>))
import Maybe.Extra as Maybe
import Time

--

errorMessage error =
  case error of
    Http.BadStatus 401 ->
      "Authentication failed."
    Http.BadStatus 500 ->
      "Application error (500 Internal Server Error)"
    Http.BadStatus 501 ->
      "This feature is not implemented"
    _ ->
      "Something went wrong!"

--

bootstrapTextarea : Form.FieldState a String -> List (Bootstrap.Form.Textarea.Option Form.Msg) -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapTextarea state options attrs
  = Bootstrap.Form.Textarea.textarea
      ( [ Bootstrap.Form.Textarea.value (state.value |> Maybe.withDefault "")
        , Bootstrap.Form.Textarea.onInput (String >> Form.Input state.path Form.Textarea)
        , Bootstrap.Form.Textarea.attrs
          ( [ onFocus (Form.Focus state.path)
            , onBlur (Form.Blur state.path)
            ] ++ attrs ) ] ++ options )

bootstrapSelect : List ( String, String ) -> Form.FieldState a String -> List (Bootstrap.Form.Select.Option Form.Msg) -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapSelect items state options attrs
  = let build ( k, v ) = Bootstrap.Form.Select.item [ value k, selected (state.value == Just k) ] [ text v ]
     in Bootstrap.Form.Select.select
          ( [ Bootstrap.Form.Select.onChange (String >> Form.Input state.path Form.Select)
            , Bootstrap.Form.Select.attrs
            ( [ onFocus (Form.Focus state.path)
              , onBlur (Form.Blur state.path)
              ] ++ attrs ) ] ++ options ) (List.map build items)

bootstrapCheckbox : String -> String -> Form.FieldState a Bool -> List (Bootstrap.Form.Checkbox.Option Form.Msg) -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapCheckbox id label state options attrs
  = Bootstrap.Form.Checkbox.custom
      ( [ Bootstrap.Form.Checkbox.id id
        , Bootstrap.Form.Checkbox.onCheck (Bool >> Form.Input state.path Form.Checkbox)
        , Bootstrap.Form.Checkbox.checked (state.value |> Maybe.withDefault False)
        , Bootstrap.Form.Checkbox.attrs
          ( [ onFocus (Form.Focus state.path)
            , onBlur (Form.Blur state.path) ] ++ attrs )
        ] ++ options ) label

bootstrapInputOptions : Form.FieldState a String -> List (Bootstrap.Form.Input.Option Form.Msg) -> List (Attribute Form.Msg) -> List (Bootstrap.Form.Input.Option Form.Msg)
bootstrapInputOptions state options attrs =
    ( [ Bootstrap.Form.Input.value (state.value |> Maybe.withDefault "")
      , Bootstrap.Form.Input.onInput (String >> Form.Input state.path Form.Text)
      , Bootstrap.Form.Input.attrs
        ( [ onFocus (Form.Focus state.path)
          , onBlur (Form.Blur state.path) ] ++ attrs )
      ] ++ options )

bootstrapInputText : Form.FieldState a String -> List (Bootstrap.Form.Input.Option Form.Msg) -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapInputText state options attrs =
  Bootstrap.Form.Input.text (bootstrapInputOptions state options attrs)

bootstrapInputPassword : Form.FieldState a String -> List (Bootstrap.Form.Input.Option Form.Msg) -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapInputPassword state options attrs =
  Bootstrap.Form.Input.password (bootstrapInputOptions state options attrs)

bootstrapInvalidFeedback : (ErrorValue b -> String) -> Form.FieldState b a -> List (Attribute Form.Msg) -> Html Form.Msg
bootstrapInvalidFeedback toString state attrs =
  case state.liveError of
    Nothing ->
      text ""
    Just error ->
      Bootstrap.Form.invalidFeedback attrs [ text (toString error) ]

--

type ApiMsg a
  = Request String (Maybe Http.Body)
  | Response (Result Http.Error a)
  | Reset

type ApiResource a
  = NotRequested
  | Requested
  | Error Http.Error
  | Available a

type alias Request a = String -> Maybe Http.Body -> Cmd (ApiMsg a)

type alias ApiModel a =
  { resource : ApiResource a
  , request  : Request a }

setResource : ApiResource a -> ApiModel a -> Update (ApiModel a) (ApiMsg a) b
setResource resource state = save { state | resource = resource }

type HttpMethod
  = HttpGet
  | HttpPost
  | HttpPut

type alias RequestConfig a =
  { endpoint : String
  , method   : HttpMethod
  , decoder  : Json.Decoder a }

apiInit : RequestConfig a -> Update (ApiModel a) (ApiMsg a) b
apiInit { endpoint, method, decoder } =
  let expect = Http.expectJson Response decoder
      request suffix body =
        Http.request
          { method  = case method of
                        HttpGet  -> "GET"
                        HttpPost -> "POST"
                        HttpPut  -> "PUT"
          , headers = []
          , url     = endpoint ++ suffix
          , expect  = expect
          , body    = Maybe.withDefault emptyBody body
          , timeout = Nothing
          , tracker = Nothing }
   in save
    { resource = NotRequested
    , request  = request }

type alias ApiEventHandlers a b =
  { onSuccess : a -> b
  , onError   : Http.Error -> b }

apiDefaultEventHandlers : ApiEventHandlers a (b -> Update b c e)
apiDefaultEventHandlers = { onSuccess = always save, onError = always save }

apiUpdate : ApiEventHandlers a b -> ApiMsg a -> ApiModel a -> Update (ApiModel a) (ApiMsg a) b
apiUpdate { onSuccess, onError } msg model =
  case msg of
    Request url maybeBody ->
      model
        |> setResource Requested
        |> andRunCmd (model.request url maybeBody)
    Response (Ok resource) ->
      model
        |> setResource (Available resource)
        |> andInvokeHandler (onSuccess resource)
    Response (Err error) ->
      model
        |> setResource (Error error)
        |> andInvokeHandler (onError error)
    Reset ->
      model
        |> setResource NotRequested

apiJsonRequest : String -> Value -> ApiMsg a
apiJsonRequest url = Request url << Just << Http.jsonBody

--

type alias NewProjectForm =
  { name        : String
  , country     : String
  , description : Maybe String }

newProjectFormValidate : Validation () NewProjectForm
newProjectFormValidate =
  succeed NewProjectForm
    |> Validate.andMap (field "name" Validate.string)
    |> Validate.andMap (field "country" Validate.string)
    |> Validate.andMap (Validate.maybe (field "description" Validate.string))

newProjectFormToJson : NewProjectForm -> Value
newProjectFormToJson { name, country, description } =
  object [ ( "name"        , Json.Encode.string name )
         , ( "country"     , Json.Encode.string country )
         , ( "description" , Encode.maybe Json.Encode.string description ) ]

errorToString : ErrorValue a -> String
errorToString error =
  case error of
    Empty ->
      "This field is required"
    InvalidString ->
      "This field is required"
    InvalidEmail ->
      "Please enter a valid email address"
    InvalidFormat ->
      "Invalid format"
    InvalidInt ->
      "The value must be an integer"
    InvalidFloat ->
      "The value must be a number"
    InvalidBool ->
      "Error"
    SmallerIntThan int ->
      "Error"
    GreaterIntThan int ->
      "Error"
    SmallerFloatThan float ->
      "Error"
    GreaterFloatThan float ->
      "Error"
    ShorterStringThan int ->
      "Must be at least " ++ String.fromInt int ++ " characters"
    LongerStringThan int ->
      "Must be no more than " ++ String.fromInt int ++ " characters"
    NotIncludedIn ->
      "Error"
    CustomError e ->
      Debug.toString e -- TODO

newProjectFormView : Form () NewProjectForm -> Bool -> (Form.Msg -> msg) -> Html msg
newProjectFormView form sent msg =
    let
        name        = form |> Form.getFieldAsString "name"
        country     = form |> Form.getFieldAsString "country"
        description = form |> Form.getFieldAsString "description"

        nameOptions =
          let opts = []
           in if Nothing == name.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        countryOptions =
          let opts = []
           in if Nothing == country.liveError then opts else (Bootstrap.Form.Select.danger :: opts)

        descriptionOptions =
          let opts = []
           in if Nothing == description.liveError then opts else (Bootstrap.Form.Textarea.danger :: opts)

    in Bootstrap.Form.form []
       [ Fieldset.config
         |> Fieldset.disabled sent
         |> Fieldset.children
            [ Bootstrap.Form.group []
              [ Bootstrap.Form.label [] [ text "Name" ]
              , bootstrapInputText name nameOptions []
              , bootstrapInvalidFeedback errorToString name [] ]
            , Bootstrap.Form.group []
              [ Bootstrap.Form.label [] [ text "Country" ]
              , bootstrapSelect [ ( "", "" ), ( "FI", "Finland" ), ( "MW", "Malawi" ), ( "GH", "Ghana" ), ( "UG", "Uganda" ) ] country countryOptions []
              , bootstrapInvalidFeedback errorToString country [] ]
            , Bootstrap.Form.group []
              [ Bootstrap.Form.label [] [ text "Description" ]
              , bootstrapTextarea description descriptionOptions []
              , bootstrapInvalidFeedback errorToString description [] ] ]
         |> Fieldset.view ]
         |> Html.map msg

----

type alias ProfileForm =
  { name : String }

profileFormValidate : Validation () ProfileForm
profileFormValidate =
  succeed ProfileForm
    |> Validate.andMap (field "name" Validate.string)

profileFormToJson : ProfileForm -> Value
profileFormToJson { name } =
  object [ ( "name" , Json.Encode.string name ) ]

profileFormView : Form () ProfileForm -> Bool -> (Form.Msg -> msg) -> Html msg
profileFormView form sent msg =
    let
        name = form |> Form.getFieldAsString "name"

        nameOptions =
          let opts = []
           in if Nothing == name.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

    in
        Bootstrap.Form.form []
          [ Fieldset.config
            |> Fieldset.disabled sent
            |> Fieldset.children
               [ Bootstrap.Form.group []
                 [ Bootstrap.Form.label [] [ text "Name" ]
                 , bootstrapInputText name nameOptions []
                 , bootstrapInvalidFeedback errorToString name [] ] ]
            |> Fieldset.view ]
            |> Html.map msg

----

type alias ResetPasswordForm =
  { login : String }

resetPasswordFormValidate : Validation () ResetPasswordForm
resetPasswordFormValidate =
  succeed ResetPasswordForm
    |> Validate.andMap (field "login" Validate.string)

resetPasswordFormToJson : ResetPasswordForm -> Value
resetPasswordFormToJson { login } =
  object [ ( "login" , Json.Encode.string login ) ]

resetPasswordFormView : Form () ResetPasswordForm -> Bool -> (Form.Msg -> msg) -> Html msg
resetPasswordFormView form sent msg =

    let
        login = form |> Form.getFieldAsString "login"

        loginOptions =
          let opts = []
           in if Nothing == login.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

    in
        Bootstrap.Form.form []
         [ Fieldset.config
           |> Fieldset.disabled sent
           |> Fieldset.children
              [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Login" ]
                , bootstrapInputText login loginOptions []
                , bootstrapInvalidFeedback errorToString login []
                , if Nothing == login.liveError then Bootstrap.Form.help [] [ text "This is your login or email address" ] else text "" ]
                , Button.button [ Button.block
                                , Button.primary
                                , Button.onClick Form.Submit
                                , Button.disabled sent ]
                                  [ text (if sent then "Please wait" else "Request") ] ]
           |> Fieldset.view ]
           |> Html.map msg

----

type alias LoginForm =
  { login      : String
  , password   : String
  , rememberMe : Bool }

loginFormValidate : Validation () LoginForm
loginFormValidate =
  succeed LoginForm
    |> Validate.andMap (field "login" Validate.string)
    |> Validate.andMap (field "password" Validate.string)
    |> Validate.andMap (field "rememberMe" Validate.bool)

loginFormToJson : LoginForm -> Value
loginFormToJson { login, password, rememberMe } =
  object [ ( "login"      , Json.Encode.string login )
         , ( "password"   , Json.Encode.string password )
         , ( "rememberMe" , Json.Encode.bool rememberMe ) ]

loginFormView : Form () LoginForm -> Bool -> (Form.Msg -> msg) -> Html msg
loginFormView form sent msg =

    let
        login    = form   |> Form.getFieldAsString "login"
        password = form   |> Form.getFieldAsString "password"
        rememberMe = form |> Form.getFieldAsBool "rememberMe"

        loginOptions =
          let opts = []
           in if Nothing == login.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        passwordOptions =
          let opts = []
           in if Nothing == password.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

    in

        Bootstrap.Form.form []
          [ Fieldset.config
            |> Fieldset.disabled sent
            |> Fieldset.children
              [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Login" ]
                , bootstrapInputText login loginOptions []
                , bootstrapInvalidFeedback errorToString login [] ]
              , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Password" ]
                , bootstrapInputPassword password passwordOptions []
                , bootstrapInvalidFeedback errorToString password [] ]
              , Bootstrap.Form.group []
                [ bootstrapCheckbox "login-remember-me" "Remember me" rememberMe [] []
                , bootstrapInvalidFeedback errorToString rememberMe [] ]
                , Button.button [ Button.block
                                , Button.primary
                                , Button.onClick Form.Submit
                                , Button.disabled sent ]
                                [ text (if sent then "Please wait" else "Log in") ] ]
            |> Fieldset.view ]
          |> Html.map msg

--

type alias RegisterForm =
  { name            : String
  , email           : String
  , useEmailAsLogin : Bool
  , login           : String
  , organization    : Maybe String
  , phoneNumber     : Maybe String
  , password        : String
  , confirmPassword : String
  , agreeWithTerms  : Bool }

type RegisterFormCustomError
  = DoesNotMatchPassword
  | MustAgreeWithTerms

registerFormValidate : Validation RegisterFormCustomError RegisterForm
registerFormValidate =
  succeed RegisterForm
    |> Validate.andMap (field "name" (Validate.string |> Validate.andThen Validate.nonEmpty))
    |> Validate.andMap (field "email" Validate.email)
    |> Validate.andMap (field "useEmailAsLogin" Validate.bool)
    |> Validate.andMap validateLogin -- field "login" (Validate.string |> Validate.andThen Validate.nonEmpty))
    |> Validate.andMap (Validate.maybe (field "organization" Validate.string |> Validate.andThen Validate.nonEmpty))
    |> Validate.andMap (Validate.maybe (field "phoneNumber" Validate.string |> Validate.andThen Validate.nonEmpty))
    |> Validate.andMap (field "password" (Validate.string |> Validate.andThen (Validate.minLength 8)))
    |> Validate.andMap (
                    Validate.oneOf
                      [ (field "password" Validate.string) |> Validate.andThen validateConfirmation
                      , Validate.emptyString |> Validate.andThen validateConfirmation ] )
    |> Validate.andMap (field "agreeWithTerms" (Validate.bool |> Validate.andThen mustBeChecked)) --mustBeChecked

mustBeChecked checked =
  if checked
      then Validate.succeed True
      else Validate.fail (Validate.customError MustAgreeWithTerms)

validateLogin =
  field "useEmailAsLogin" Validate.bool
    |> Validate.andThen (\useEmail ->
          if useEmail
              then Validate.succeed ""
              else field "login" (Validate.string |> Validate.andThen Validate.nonEmpty))

validateConfirmation password =
  field "confirmPassword"
    (Validate.string
      |> Validate.andThen
        (\confirmation ->
          if password == confirmation
              then Validate.succeed confirmation
              else Validate.fail (Validate.customError DoesNotMatchPassword)))

-- TODO
registerFormToJson : RegisterForm -> Value
registerFormToJson { name, email, useEmailAsLogin, login, password } =
  object [ ( "name"     , Json.Encode.string name )
         , ( "email"    , Json.Encode.string email )
         , ( "login"    , Json.Encode.string (if useEmailAsLogin then email else login) )
         , ( "password" , Json.Encode.string password ) ]

registerFormView : Form RegisterFormCustomError RegisterForm -> Bool -> (Form.Msg -> msg) -> Html msg
registerFormView form sent msg =

    let
        name            = form |> Form.getFieldAsString "name"
        email           = form |> Form.getFieldAsString "email"
        useEmailAsLogin = form |> Form.getFieldAsBool   "useEmailAsLogin"
        login           = form |> Form.getFieldAsString "login"
        organization    = form |> Form.getFieldAsString "organization"
        phoneNumber     = form |> Form.getFieldAsString "phoneNumber"
        password        = form |> Form.getFieldAsString "password"
        confirmPassword = form |> Form.getFieldAsString "confirmPassword"
        agreeWithTerms  = form |> Form.getFieldAsBool   "agreeWithTerms"

        nameOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Name" ]
           in if Nothing == name.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        emailOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Email" ]
           in if Nothing == email.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        useEmailAsLoginOptions =
          let opts = []
           in if Nothing == useEmailAsLogin.liveError then opts else (Bootstrap.Form.Checkbox.danger :: opts)

        loginOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Login" ]
           in if Nothing == login.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        organizationOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Organization" ]
           in if Nothing == organization.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        phoneNumberOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Phone number" ]
           in if Nothing == phoneNumber.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        passwordOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Password" ]
           in if Nothing == password.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        confirmPasswordOptions =
          let opts = [ Bootstrap.Form.Input.placeholder "Confirm password" ]
           in if Nothing == confirmPassword.liveError then opts else (Bootstrap.Form.Input.danger :: opts)

        agreeWithTermsOptions =
          let opts = []
           in if Nothing == agreeWithTerms.liveError then opts else (Bootstrap.Form.Checkbox.danger :: opts)

        loginField =
          case useEmailAsLogin.value of
            Just False ->
                  Bootstrap.Form.group []
                  [ -- Bootstrap.Form.label [] [ text "Login" ]
                    bootstrapInputText login loginOptions []
                  , bootstrapInvalidFeedback errorToString login []
                  ]
            _ ->
              text ""

    in

        Bootstrap.Form.form []
          [ Fieldset.config
            |> Fieldset.disabled sent
            |> Fieldset.children
              [ Bootstrap.Form.group []
                [ --Bootstrap.Form.label [] [ text "Name" ]
                  bootstrapInputText name nameOptions []
                , bootstrapInvalidFeedback errorToString name []
                , if not name.isChanged && Maybe.isNothing name.liveError then Bootstrap.Form.help [] [ text "This field is required" ] else text ""
                ]
              , Bootstrap.Form.group []
                [ -- Bootstrap.Form.label [] [ text "Email" ]
                  bootstrapInputText email emailOptions []
                , bootstrapInvalidFeedback errorToString email []
                , if not email.isChanged && Maybe.isNothing email.liveError then Bootstrap.Form.help [] [ text "This field is required" ] else text ""
                ]
              , loginField 

              , Bootstrap.Form.group []
                [ bootstrapCheckbox "register-form-use-email-login" "Use email as login?" useEmailAsLogin useEmailAsLoginOptions []
                , bootstrapInvalidFeedback errorToString useEmailAsLogin []
                ]
              , hr [] []

              , Bootstrap.Form.group []
                [ --Bootstrap.Form.label [] [ text "Password" ]
                  bootstrapInputText organization organizationOptions []
                --, bootstrapInvalidFeedback errorToString organization
                ]

              , Bootstrap.Form.group []
                [ --Bootstrap.Form.label [] [ text "Password" ]
                  bootstrapInputText phoneNumber phoneNumberOptions []
                --, bootstrapInvalidFeedback errorToString organization
                ]

              , hr [] []

              , Bootstrap.Form.group []
                [ --Bootstrap.Form.label [] [ text "Password" ]
                  bootstrapInputPassword password passwordOptions []
                --, bootstrapInvalidFeedback errorToString password
                , bootstrapInvalidFeedback errorToString password []
                , if not password.isChanged && Maybe.isNothing password.liveError then Bootstrap.Form.help [] [ text "This field is required" ] else text ""
                ]
              , Bootstrap.Form.group []
                [ --Bootstrap.Form.label [] [ text "Confirm password" ]
                  bootstrapInputPassword confirmPassword confirmPasswordOptions []
                , bootstrapInvalidFeedback errorToString confirmPassword []
                , if not confirmPassword.isChanged && Maybe.isNothing confirmPassword.liveError then Bootstrap.Form.help [] [ text "This field is required" ] else text ""
                ]

              , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ b [] [ text "Terms and conditions" ] ]
                , Bootstrap.Form.Textarea.textarea [ Bootstrap.Form.Textarea.attrs [ style "height" "97px", style "font-size" "11pt", readonly True ], Bootstrap.Form.Textarea.value "Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account." ]
                ]

              , Bootstrap.Form.group []
                [ bootstrapCheckbox "register-agree-with-terms" "I agree with the terms of this service" agreeWithTerms agreeWithTermsOptions []
                , bootstrapInvalidFeedback errorToString agreeWithTerms [ style "display" "block" ]
                --, div [ style "display" "block", class "invalid-feedback" ] [ text "xxx" ]
                ]

                , Button.button [ Button.block
                                , Button.primary
                                , Button.onClick Form.Submit
                                , Button.disabled sent ]
                                [ text (if sent then "Please wait" else "Submit") ]
                ]

            |> Fieldset.view ]
          |> Html.map msg

--

type ProjectSettingsPageMsg
  = NoProjectSettingsPageMsg

type alias ProjectSettingsPageState =
  {}

projectSettingsPageInit : Update ProjectSettingsPageState ProjectSettingsPageMsg a
projectSettingsPageInit =
  save {}

projectSettingsPageUpdate : ProjectSettingsPageMsg -> ProjectSettingsPageState -> Update ProjectSettingsPageState ProjectSettingsPageMsg a
projectSettingsPageUpdate msg state =
  case msg of
    _ ->
      save state

projectSettingsPageSubscriptions : ProjectSettingsPageState -> (ProjectSettingsPageMsg -> msg) -> Sub msg
projectSettingsPageSubscriptions state msg = Sub.none

--projectSettingsPageView : ProjectSettingsPageState -> (ProjectSettingsPageMsg -> msg) -> Html msg
--projectSettingsPageView state msg =
--  div [] []

--

type ProjectHomePageMsg
  = ProjectHomePageApiMsg (ApiMsg Project)

projectHomePageFetchProject : ProjectHomePageMsg
projectHomePageFetchProject = ProjectHomePageApiMsg (Request "" Nothing)

type alias ProjectHomePageState =
  { project : ApiModel Project }

projectHomePageInsertAsProjectIn : ProjectHomePageState -> ApiModel Project -> Update ProjectHomePageState ProjectHomePageMsg a
projectHomePageInsertAsProjectIn state project = save { state | project = project }

projectHomePageInit : Int -> Update ProjectHomePageState ProjectHomePageMsg a
projectHomePageInit projectId =
  let project = apiInit { endpoint = "/projects/" ++ (String.fromInt projectId)
                        , method   = HttpGet
                        , decoder  = Json.field "project" Data.Project.decoder }
   in Update.Deep.map ProjectHomePageState
        (project |> mapCmd ProjectHomePageApiMsg)

projectHomePageUpdate : ProjectHomePageMsg -> ProjectHomePageState -> Update ProjectHomePageState ProjectHomePageMsg a
projectHomePageUpdate msg state =
  case msg of
    ProjectHomePageApiMsg apiMsg ->
      state.project
        |> apiUpdate { onSuccess = always save, onError = always save } apiMsg
        |> mapCmd ProjectHomePageApiMsg
        |> andFinally (projectHomePageInsertAsProjectIn state)

projectHomePageSubscriptions : ProjectHomePageState -> (ProjectHomePageMsg -> msg) -> Sub msg
projectHomePageSubscriptions state msg = Sub.none

projectHomePageView : ProjectHomePageState -> (ProjectHomePageMsg -> msg) -> Html msg
projectHomePageView { project } msg =

  case project.resource of
    NotRequested ->
      text "not requested"
    Requested ->
      div [ style "margin" "8em" ]
        [
          div [ class "d-flex justify-content-center" ]
            [
              div [ style "border-width" "6px", style "width" "4rem", style "height" "4rem", class "spinner-border text-success", attribute "role" "status" ] [ span [ class "sr-only" ] [ text "Loading" ] ]
            ]
        ]
        --[ div [ class "loader" ] [] ]
    Error httpError ->
      text (Debug.toString httpError)
    Available project_ ->
      div [ style "max-width" "640px" ]
        [ text "info" ]

--

type NewProjectPageMsg
  = NewProjectApiMsg (ApiMsg Project)
  | NewProjectFormMsg Form.Msg
  | NewProjectPageFormCancel

type alias NewProjectPageState =
  { project : ApiModel Project
  , form    : Form () NewProjectForm
  , key     : Navigation.Key
  , sent    : Bool }

newProjectPageInsertAsProjectIn : NewProjectPageState -> ApiModel Project -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageInsertAsProjectIn state project = save { state | project = project }

newProjectPageInsertAsFormIn : NewProjectPageState -> Form () NewProjectForm -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageInsertAsFormIn state form = save { state | form = form }

--newProjectPageSetSent : NewProjectForm -> NewProjectPageState -> Update NewProjectPageState NewProjectPageMsg a
--newProjectPageSetSent form state = save { state | sent = Just form }
--
--newProjectPageResetSent : NewProjectPageState -> Update NewProjectPageState NewProjectPageMsg a
--newProjectPageResetSent state = save { state | sent = Nothing }

newProjectPageSetSent : Bool -> NewProjectPageState -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageSetSent sent state = save { state | sent = sent }

newProjectPageInit : Navigation.Key -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageInit key =
  let project = apiInit { endpoint = "/projects"
                        , method   = HttpPost
                        , decoder  = Json.field "project" Data.Project.decoder }
      form = Form.initial [] newProjectFormValidate
   in Update.Deep.map4 NewProjectPageState
       (project |> mapCmd NewProjectApiMsg)
       (save form)
       (save key)
       (save False)

newProjectPageHandleSubmit : { onNewProject : Project -> a } -> Value -> NewProjectPageState -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageHandleSubmit { onNewProject } json state =
  state
    |> newProjectPageUpdate { onNewProject = onNewProject } (NewProjectApiMsg (apiJsonRequest "" json))

newProjectPageUpdate : { onNewProject : Project -> a } -> NewProjectPageMsg -> NewProjectPageState -> Update NewProjectPageState NewProjectPageMsg a
newProjectPageUpdate { onNewProject } msg state =
  let resetForm =
        newProjectPageSetSent False
          >> andThen (newProjectPageUpdate { onNewProject = onNewProject } (NewProjectFormMsg <| Form.Reset []))
      responseHandler project = invokeHandler (onNewProject project) >> andThen resetForm
   in case msg of
    NewProjectApiMsg apiMsg ->
      state.project
        |> apiUpdate { onSuccess = responseHandler, onError = always (newProjectPageSetSent False) } apiMsg
        |> mapCmd NewProjectApiMsg
        |> andFinally (newProjectPageInsertAsProjectIn state)
    NewProjectPageFormCancel ->
      state
        |> runCmd (Navigation.replaceUrl state.key "/")
    NewProjectFormMsg formMsg ->
      case ( formMsg, Form.getOutput state.form ) of
        ( Form.Submit, Just form ) ->
          state
            |> newProjectPageHandleSubmit { onNewProject = onNewProject } (newProjectFormToJson form)
            |> andThen (newProjectPageSetSent True)
        _ ->
          state.form
            |> Form.update newProjectFormValidate formMsg
            |> newProjectPageInsertAsFormIn state

newProjectPageSubscriptions : NewProjectPageState -> (NewProjectPageMsg -> msg) -> Sub msg
newProjectPageSubscriptions state msg = Sub.none

newProjectPageError : ApiResource Project -> Html msg
newProjectPageError projectResource =
  case projectResource of
    Error error ->
      Alert.simpleDanger [] [ text (errorMessage error) ]
    _ ->
      text ""

newProjectPageView : NewProjectPageState -> (NewProjectPageMsg -> msg) -> Html msg
newProjectPageView { project, form, sent } msg =
  div [ class "text-center" ]
    [ i [ style "font-size" "64px", class "fas fa-rocket mb-3" ] []
    , h2 [ class "text-gray-900 mb-4" ] [ text "New project" ]
    , div [ class "text-left" ]
    [
      newProjectPageError project.resource
    , newProjectFormView form sent (msg << NewProjectFormMsg)
    ,
      ButtonGroup.toolbar [ ]
        [

          ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.mlAuto ] ]
          [ ButtonGroup.button [ Button.secondary
                               , Button.onClick (msg NewProjectPageFormCancel)
                               , Button.disabled sent ]
                               [ text "Cancel" ]
          ]
        , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
          [ ButtonGroup.button [ Button.primary
                               , Button.onClick (msg (NewProjectFormMsg Form.Submit))
                               , Button.disabled sent ]
                               [ text (if sent then "Please wait" else "Save") ]
          ]
        ]

--    , Button.button [ Button.primary
--                      , Button.onClick (NewProjectFormMsg Form.Submit)
--                      , Button.disabled isSent ]
--                      [ text (if isSent then "Please wait" else "Save") ]
--
--        Button.button [ Button.primary
--                      , Button.onClick (NewProjectFormMsg Form.Submit)
--                      , Button.disabled isSent ]
--                      [ text (if isSent then "Please wait" else "Save") ]
--      , Button.button [ Button.secondary
--                      -- , Button.onClick (Redirect "/")
--                      , Button.disabled isSent ]
--                      [ text "Cancel" ]


     ]
     ]

--    , Button.button [ Button.primary
--                    , Button.attrs [ onClick (NewProjectFormMsg Form.Submit) ] ]
--                    [ text "Save" ]
--    , Button.button [ Button.secondary
--                    , Button.attrs [ onClick NewProjectPageFormCancel ] ]
--                    [ text "Cancel" ] ]

--

type ProfilePageMsg
  = ProfileApiMsg (ApiMsg User)
  | ProfileFormMsg Form.Msg
  | ProfilePageFormCancel

type alias ProfilePageState =
  { user : ApiModel User
  , form : Form () ProfileForm
  , key  : Navigation.Key
  , sent : Bool }
  --, sent : Maybe ProfileForm }

profilePageInsertAsUserIn : ProfilePageState -> ApiModel User -> Update ProfilePageState ProfilePageMsg a
profilePageInsertAsUserIn state user = save { state | user = user }

profilePageInsertAsFormIn : ProfilePageState -> Form () ProfileForm -> Update ProfilePageState ProfilePageMsg a
profilePageInsertAsFormIn state form = save { state | form = form }

profilePageSetSent : Bool -> ProfilePageState -> Update ProfilePageState ProfilePageMsg a
profilePageSetSent sent state = save { state | sent = sent }

profilePageInit : Navigation.Key -> User -> Update ProfilePageState ProfilePageMsg a
profilePageInit key user =
  let apiUser = apiInit { endpoint = "/users/" ++ String.fromInt user.id
                        , method   = HttpPut
                        , decoder  = Json.field "user" Data.User.decoder }
      form = Form.initial
        [ ( "name", Field.value (String (user.name)) )
     -- ,
        ] profileFormValidate
   in Update.Deep.save ProfilePageState
        |> Update.Deep.andMap (apiUser |> mapCmd ProfileApiMsg)
        |> Update.Deep.andMap (save form)
        |> Update.Deep.andMap (save key)
        |> Update.Deep.andMap (save False)

profilePageHandleSubmit : { onProfileUpdated : User -> a } -> Value -> ProfilePageState -> Update ProfilePageState ProfilePageMsg a
profilePageHandleSubmit { onProfileUpdated } json state =
  state
    |> profilePageUpdate { onProfileUpdated = onProfileUpdated } (ProfileApiMsg (apiJsonRequest "" json))

profilePageUpdate : { onProfileUpdated : User -> a } -> ProfilePageMsg -> ProfilePageState -> Update ProfilePageState ProfilePageMsg a
profilePageUpdate { onProfileUpdated } msg state =
  let resetForm =
        profilePageSetSent False
          >> andThen (profilePageUpdate { onProfileUpdated = onProfileUpdated } (ProfileFormMsg <| Form.Reset []))
      responseHandler user = invokeHandler (onProfileUpdated user)
   in case msg of
    ProfileApiMsg apiMsg ->
      state.user
        |> apiUpdate { onSuccess = responseHandler, onError = always (profilePageSetSent False) } apiMsg
        |> mapCmd ProfileApiMsg
        |> andFinally (profilePageInsertAsUserIn state)
    ProfilePageFormCancel ->
      state
        |> runCmd (Navigation.replaceUrl state.key "/")
    ProfileFormMsg formMsg ->
      case ( formMsg, Form.getOutput state.form ) of
        ( Form.Submit, Just form ) ->
          state
            |> profilePageHandleSubmit { onProfileUpdated = onProfileUpdated } (profileFormToJson form)
            |> andThen (profilePageSetSent True)
        _ ->
          state.form
            |> Form.update profileFormValidate formMsg
            |> profilePageInsertAsFormIn state

profilePageSubscriptions : ProfilePageState -> (ProfilePageMsg -> msg) -> Sub msg
profilePageSubscriptions state msg = Sub.none

profilePageError : ApiResource User -> Html msg
profilePageError userResource =
  case userResource of
    Error error ->
      Alert.simpleDanger [] [ text (errorMessage error) ]
    _ ->
      text ""

profilePageView : ProfilePageState -> (ProfilePageMsg -> msg) -> Html msg
profilePageView { user, form, sent } msg =
  div [ class "text-center" ]
    [ i [ style "font-size" "64px", class "fas fa-user-edit mb-3" ] []
    , h2 [ class "text-gray-900 mb-4" ] [ text "User profile" ]
    , profilePageError user.resource
    , div [ class "text-left" ]
    [ profileFormView form sent (msg << ProfileFormMsg)

    , ButtonGroup.toolbar [ ]
        [

          ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.mlAuto ] ]
          [ ButtonGroup.button [ Button.secondary
                               , Button.onClick (msg ProfilePageFormCancel)
                               , Button.disabled sent ]
                               [ text "Cancel" ]
          ]
        , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
          [ ButtonGroup.button [ Button.primary
                               , Button.onClick (msg (ProfileFormMsg Form.Submit))
                               , Button.disabled sent ]
                               [ text (if sent then "Please wait" else "Save") ]
          ]
        ]
      ]
    ]

--

type ResetPasswordPageMsg
  = ResetPasswordApiMsg (ApiMsg { status : Int })
  | ResetPasswordFormMsg Form.Msg

type alias ResetPasswordPageState =
  { response : ApiModel { status : Int }
  , form     : Form () ResetPasswordForm
  , sent     : Bool }
  --, sent : Maybe ResetPasswordForm }

resetPasswordPageInsertAsResponseIn : ResetPasswordPageState -> ApiModel { status : Int } -> Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageInsertAsResponseIn state response = save { state | response = response }

resetPasswordPageInsertAsFormIn : ResetPasswordPageState -> Form () ResetPasswordForm -> Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageInsertAsFormIn state form = save { state | form = form }

--resetPasswordPageSetSent : ResetPasswordForm -> ResetPasswordPageState -> Update ResetPasswordPageState ResetPasswordPageMsg a
--resetPasswordPageSetSent form state = save { state | sent = Just form }

--resetPasswordPageResetSent : ResetPasswordPageState -> Update ResetPasswordPageState ResetPasswordPageMsg a
--resetPasswordPageResetSent state = save { state | sent = Nothing }

resetPasswordPageSetSent : Bool -> ResetPasswordPageState -> Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageSetSent sent state = save { state | sent = sent }

resetPasswordPageInit : Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageInit =
  let response = apiInit { endpoint = "/auth/reset_password"
                         , method   = HttpPost
                         , decoder  = Json.map (\status -> { status = status }) Json.int }
      form = Form.initial [] resetPasswordFormValidate
   in Update.Deep.map3 ResetPasswordPageState
       (response |> mapCmd ResetPasswordApiMsg)
       (save form)
       (save False)

resetPasswordPageHandleSubmit : Value -> ResetPasswordPageState -> Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageHandleSubmit json state =
  state
    |> resetPasswordPageUpdate (ResetPasswordApiMsg (apiJsonRequest "" json))

resetPasswordPageUpdate : ResetPasswordPageMsg -> ResetPasswordPageState -> Update ResetPasswordPageState ResetPasswordPageMsg a
resetPasswordPageUpdate msg state =
  case msg of
    ResetPasswordApiMsg apiMsg ->
      state.response
        |> apiUpdate { onSuccess = always save, onError = always (resetPasswordPageSetSent False) } apiMsg
        |> mapCmd ResetPasswordApiMsg
        |> andFinally (resetPasswordPageInsertAsResponseIn state)
    ResetPasswordFormMsg formMsg ->
      case ( formMsg, Form.getOutput state.form ) of
        ( Form.Submit, Just form ) ->
          state
            |> resetPasswordPageHandleSubmit (resetPasswordFormToJson form)
            |> andThen (resetPasswordPageSetSent True)
        _ ->
          state.form
            |> Form.update resetPasswordFormValidate formMsg
            |> resetPasswordPageInsertAsFormIn state

resetPasswordPageSubscriptions : ResetPasswordPageState -> (ResetPasswordPageMsg -> msg) -> Sub msg
resetPasswordPageSubscriptions state msg = Sub.none

resetPasswordError : ApiResource { status : Int } -> Html msg
resetPasswordError resource =
  case resource of
    Error error ->
      Alert.simpleDanger [] [ text (errorMessage error) ]
    _ ->
      text ""

resetPasswordPageView : ResetPasswordPageState -> (ResetPasswordPageMsg -> msg) -> Html msg
resetPasswordPageView { response, form, sent } msg =
  div []
    [ div [ class "text-center" ]
      [ i [ style "font-size" "64px", class "fas fa-meh-rolling-eyes mb-3" ] []
      , h2 [ class "text-gray-900 mb-4" ] [ text "Lost your password?" ]
      ]
    , p [] [ text "It happens! Enter your login or email address in the field below and press the ‘Request’ button. If we find a matching account, an email will be sent with further instructions." ]
    , div [ class "text-left" ]
      [ resetPasswordError response.resource
      , resetPasswordFormView form sent (msg << ResetPasswordFormMsg) ]
    , hr [] []
    , div [ class "text-center" ]
        [ a [ href "/login" ] [ text "Return to login" ] ]
    ]

--

type alias WebSocketSearchProjectsResultsPayload =
  { query   : String
  , results : List Project }

webSocketSearchProjectsResultsDecoder : Json.Decoder WebSocketSearchProjectsResultsPayload
webSocketSearchProjectsResultsDecoder =
  Json.map2 WebSocketSearchProjectsResultsPayload
    (Json.field "query"   Json.string)
    (Json.field "results" (Json.list Data.Project.decoder))

type WebSocketMessage
  = WebSocketSearchProjectsResults WebSocketSearchProjectsResultsPayload

websocketMessageDecoder : Json.Decoder WebSocketMessage
websocketMessageDecoder =
  let payloadDecoder type_ =
        case type_ of
          "search_projects_results" ->
            Json.map WebSocketSearchProjectsResults webSocketSearchProjectsResultsDecoder
          _ ->
            Json.fail "Unrecognized message type"
   in Json.field "type" Json.string |> Json.andThen payloadDecoder

websocketProjectEncodeSearchQuery : String -> Value
websocketProjectEncodeSearchQuery query =
  Json.Encode.object
    [ ( "type"  , Json.Encode.string "search_projects" )
    , ( "query" , Json.Encode.string query ) ]

type SelectProjectPageMsg
  = ProjectsListApiMsg (ApiMsg (List Project))
  | SelectProject Project
  | SelectProjectQuery String
  | SelectProjectWebsocketMsg String

selectProjectFetchProjects : SelectProjectPageMsg
selectProjectFetchProjects = ProjectsListApiMsg (Request "" Nothing)

type alias SelectProjectPageState =
  { projects : ApiModel (List Project)
  , query    : String
  , results  : List Project }

selectProjectPageInsertAsProjectsIn : SelectProjectPageState -> ApiModel (List Project) -> Update SelectProjectPageState SelectProjectPageMsg a
selectProjectPageInsertAsProjectsIn state projects = save { state | projects = projects }

selectProjectPageInit : Update SelectProjectPageState SelectProjectPageMsg a
selectProjectPageInit =
  let projects = apiInit { endpoint = "/projects"
                         , method   = HttpGet
                         , decoder  = Json.field "projects" (Json.list Data.Project.decoder) }
   in save SelectProjectPageState
        |> Update.Deep.andMap (projects |> mapCmd ProjectsListApiMsg)
        |> Update.Deep.andMap (save "")
        |> Update.Deep.andMap (save [])

selectProjectPageUpdate : { onProjectSelected : Project -> a } -> SelectProjectPageMsg -> SelectProjectPageState -> Update SelectProjectPageState SelectProjectPageMsg a
selectProjectPageUpdate { onProjectSelected } msg state =
  case msg of
    SelectProjectQuery query ->
      save { state | query = query }
        |> andRunCmd (Ports.websocketOut (Json.Encode.encode 0 (websocketProjectEncodeSearchQuery query)))
    ProjectsListApiMsg apiMsg ->
      state.projects
        |> apiUpdate { onSuccess = always save, onError = always save } apiMsg
        |> mapCmd ProjectsListApiMsg
        |> andFinally (selectProjectPageInsertAsProjectsIn state)
    SelectProject project ->
      state
        |> invokeHandler (onProjectSelected project)
    SelectProjectWebsocketMsg websocketMsg ->
      case Json.decodeString websocketMessageDecoder websocketMsg of
        Ok (WebSocketSearchProjectsResults searchProjectsResults) ->
          if (searchProjectsResults.query == state.query)
              then
                save { state | results = searchProjectsResults.results}
              else
                save state
        _ ->
          save state

selectProjectPageSubscriptions : SelectProjectPageState -> (SelectProjectPageMsg -> msg) -> Sub msg
selectProjectPageSubscriptions state msg = Ports.websocketIn (msg << SelectProjectWebsocketMsg)

highlightQuery : String -> String -> Html msg
highlightQuery input query =
  let queryLength = String.length query
      indexes     = String.indexes (String.toLower query) (String.toLower input)
      fun ix (str, strs, prev) =
        let wordLength  = ix - prev
            tokenLength = wordLength + queryLength
            strs_ = String.slice wordLength tokenLength str :: String.left wordLength str :: strs
         in ( String.dropLeft tokenLength str, strs_, ix + queryLength )
      ( head, tail, _ ) =
        List.foldl fun ( input, [], 0 ) indexes
      pairs xs =
        case xs of
          fst :: snd :: rest -> ( fst, snd ) :: pairs rest
          fst :: [] -> [ ( fst, "" ) ]
          _ -> []
      htmlPairs ( slice, query_ ) = [ text slice, b [] [ text query_ ] ]
   in span [] (head :: tail |> List.reverse |> pairs |> List.concatMap htmlPairs)

selectProjectProjectsListItem : (SelectProjectPageMsg -> msg) -> Maybe String -> Project -> Table.Row msg
selectProjectProjectsListItem msg maybeQuery project =
  Table.tr []
    [ Table.td [] [ Button.button [ Button.roleLink, Button.attrs [ onClick (msg (SelectProject project)), Spacing.p0 ] ]
      [ Maybe.unpack (always <| text project.name) (highlightQuery project.name) maybeQuery ] ]
    , Table.td [] [ text "Today" ]
    , Table.td [] [ text project.country ] ]

selectProjectProjectsTable : Maybe String -> List Project -> (SelectProjectPageMsg -> msg) -> Html msg
selectProjectProjectsTable maybeQuery projects msg =
  if List.isEmpty projects
      then
        p [ class "p-1" ] [ text "No projects found." ]
      else
        Table.table
          { options = [ Table.small ]
          , thead = Table.simpleThead
            [ Table.th [ Table.cellAttr (class "w-50") ] [ text "Project name" ]
            , Table.th [ Table.cellAttr (class "w-40") ] [ text "Last accessed" ]
            , Table.th [ Table.cellAttr (class "w-10") ] [ text "Country" ] ]
          , tbody = Table.tbody [] (List.map (selectProjectProjectsListItem msg maybeQuery) projects )
          }

selectProjectProjectsListView : SelectProjectPageState -> (SelectProjectPageMsg -> msg) -> Html msg
selectProjectProjectsListView { projects, query, results } msg =
  case projects.resource of
    NotRequested ->
      text "not requested"
    Requested ->
      div [ style "margin" "2.5em" ]
        [
          div [ class "d-flex justify-content-center" ]
            [
              div [ style "border-width" "6px", style "width" "3.5rem", style "height" "3.5rem", class "spinner-border text-primary", attribute "role" "status" ] [ span [ class "sr-only" ] [ text "Loading" ] ]
            ]
        ]
    Error httpError ->
      text "error!"
    Available projects_ ->
      div []
        [ div [ style "min-height" "180px" ]
          [ if String.isEmpty query
                  then selectProjectProjectsTable Nothing projects_ msg
                  else selectProjectProjectsTable (Just query) results msg ] ]

selectProjectPageView : SelectProjectPageState -> (SelectProjectPageMsg -> msg) -> Html msg
selectProjectPageView state msg =
  div [ class "text-center" ]
    [ -- i [ style "font-size" "64px", class "fas fa-comments mb-3" ] []
    -- , h2 [ class "text-gray-900 mb-4" ] [ text "Choose your project" ]
      p [ class "text-left" ] [ text "Type the name of the project you’d like to access in the input field below, or select a recently used project." ]
    , div [ Spacing.mb4 ]
      [ Bootstrap.Form.Input.text
        [ Bootstrap.Form.Input.placeholder "Type the name of a project here"
        , Bootstrap.Form.Input.value state.query
        , Bootstrap.Form.Input.onInput (msg << SelectProjectQuery)
        ] ]
    , div [ class "text-left" ]
      [ Alert.simpleInfo [ class "mb-4" ]
          [ text "If you can’t find the project you’re looking for, ask an administrator for access." ]
      , selectProjectProjectsListView state msg
      ]
    ]
--    , Button.linkButton [ Button.small, Button.block, Button.primary, Button.attrs [ href "/projects/new" ] ] [ text "Create a new project" ]
--    ]
--    , hr [] []
--    , div [ class "text-center" ]
--      [ a [ href "/profile" ] [ text "Profile" ]
--      , span [ class "mx-2" ] [ text "|" ]
--      , a [ href "/logout" ] [ text "Log out" ]
--      ] ]

--

type LoginPageMsg
  = LoginApiMsg (ApiMsg Session)
  | LoginFormMsg Form.Msg

type alias LoginPageState =
  { session : ApiModel Session
  , form    : Form () LoginForm
  --, sent : Maybe LoginForm }
  , sent    : Bool }

loginPageInsertAsFormIn : LoginPageState -> Form () LoginForm -> Update LoginPageState LoginPageMsg a
loginPageInsertAsFormIn state form = save { state | form = form }

loginPageInsertAsSessionIn : LoginPageState -> ApiModel Session -> Update LoginPageState LoginPageMsg a
loginPageInsertAsSessionIn state session = save { state | session = session }

--loginPageSetSent : LoginForm -> LoginPageState -> Update LoginPageState LoginPageMsg a
--loginPageSetSent form state = save { state | sent = Just form }
--
--loginPageResetSent : LoginPageState -> Update LoginPageState LoginPageMsg a
--loginPageResetSent state = save { state | sent = Nothing }

loginPageSetSent : Bool -> LoginPageState -> Update LoginPageState LoginPageMsg a
loginPageSetSent sent state = save { state | sent = sent }

loginPageInit : Update LoginPageState LoginPageMsg a
loginPageInit =
  let session = apiInit { endpoint = "/auth/login"
                        , method   = HttpPost
                        , decoder  = Json.field "session" Data.Session.decoder }
      form = Form.initial [] loginFormValidate
   in Update.Deep.map3 LoginPageState
        (session |> mapCmd LoginApiMsg)
        (save form)
        (save False)
        --(save Nothing)

loginPageHandleSubmit : { onAuthResponse : Maybe Session -> a } -> Value -> LoginPageState -> Update LoginPageState LoginPageMsg a
loginPageHandleSubmit { onAuthResponse } json state =
  state
    |> loginPageUpdate { onAuthResponse = onAuthResponse } (LoginApiMsg (apiJsonRequest "" json))

loginPageUpdate : { onAuthResponse : Maybe Session -> a } -> LoginPageMsg -> LoginPageState -> Update LoginPageState LoginPageMsg a
loginPageUpdate { onAuthResponse } msg state =
  let responseHandler session =
        invokeHandler (onAuthResponse session)
          >> andThen (loginPageSetSent False)
          >> andThen (loginPageUpdate { onAuthResponse = onAuthResponse } (LoginFormMsg <| Form.Reset []))
   in case msg of
    LoginApiMsg apiMsg ->
      state.session
        |> apiUpdate { onSuccess = responseHandler << Just, onError = always (responseHandler Nothing) } apiMsg
        |> mapCmd LoginApiMsg
        |> andFinally (loginPageInsertAsSessionIn state)
    LoginFormMsg formMsg ->
      case ( formMsg, Form.getOutput state.form ) of
        ( Form.Submit, Just form ) ->
          state
            |> loginPageHandleSubmit { onAuthResponse = onAuthResponse } (loginFormToJson form)
            |> andThen (loginPageSetSent True)
        _ ->
          state.form
            |> Form.update loginFormValidate formMsg
            |> loginPageInsertAsFormIn state

loginPageSubscriptions : LoginPageState -> (LoginPageMsg -> msg) -> Sub msg
loginPageSubscriptions state msg = Sub.none

loginPageError : ApiResource Session -> Html msg
loginPageError sessionResource =
  case sessionResource of
    Error error ->
      Alert.simpleDanger [] [ text (errorMessage error) ]
    _ ->
      text ""

loginPageView : LoginPageState -> (LoginPageMsg -> msg) -> Html msg
loginPageView { form, session, sent } msg =
  div []
    [ div [ class "text-center" ]
      [ h2 [ class "text-gray-900 mb-4" ]
        [ text "Log in" ] ]
    , p [] [ Alert.simplePrimary [] [ text "This is a demo. Log in using 'test' and password 'test'." ] ]
    , p [] [ loginPageError session.resource ]
    , loginFormView form sent (msg << LoginFormMsg)
    , hr [] []
    , div [ class "text-center" ]
        [ a [ href "/reset-password" ] [ text "Forgot password?" ]
        , span [ class "mx-2" ] [ text "|" ]
        , a [ href "/register" ] [ text "Create an account" ] ]
    ]

--

type RegisterPageMsg
  = RegisterApiMsg (ApiMsg User)
  | RegisterFormMsg Form.Msg

type alias RegisterPageState =
  { user : ApiModel User
  , form : Form RegisterFormCustomError RegisterForm
  , sent : Bool }
  --, sent : Maybe RegisterForm }

registerPageInsertAsUserIn : RegisterPageState -> ApiModel User -> Update RegisterPageState RegisterPageMsg a
registerPageInsertAsUserIn state user = save { state | user = user }

registerPageInsertAsFormIn : RegisterPageState -> Form RegisterFormCustomError RegisterForm -> Update RegisterPageState RegisterPageMsg a
registerPageInsertAsFormIn state form = save { state | form = form }

--registerPageSetSent : RegisterForm -> RegisterPageState -> Update RegisterPageState RegisterPageMsg a
--registerPageSetSent form state = save { state | sent = Just form }

--registerPageResetSent : RegisterPageState -> Update RegisterPageState RegisterPageMsg a
--registerPageResetSent state = save { state | sent = Nothing }

registerPageSetSent : Bool -> RegisterPageState -> Update RegisterPageState RegisterPageMsg a
registerPageSetSent sent state = save { state | sent = sent }

registerPageInit : Update RegisterPageState RegisterPageMsg a
registerPageInit =
  let apiUser = apiInit { endpoint = "/users"
                        , method   = HttpPost
                        , decoder  = Json.field "user" Data.User.decoder }
      form = Form.initial [ ( "useEmailAsLogin", Field.value (Bool True) ) ] registerFormValidate
   in Update.Deep.map3 RegisterPageState
       (apiUser |> mapCmd RegisterApiMsg)
       (save form)
       (save False)

registerPageHandleSubmit : Value -> RegisterPageState -> Update RegisterPageState RegisterPageMsg a
registerPageHandleSubmit json state =
  state
    |> registerPageUpdate (RegisterApiMsg (apiJsonRequest "" json))

registerPageUpdate : RegisterPageMsg -> RegisterPageState -> Update RegisterPageState RegisterPageMsg a
registerPageUpdate msg state =
  case msg of
    RegisterApiMsg apiMsg ->
      state.user
        |> apiUpdate { onSuccess = always save, onError = always (registerPageSetSent False) } apiMsg
        |> mapCmd RegisterApiMsg
        |> andFinally (registerPageInsertAsUserIn state)
    RegisterFormMsg formMsg ->
      case ( formMsg, Form.getOutput state.form ) of
        ( Form.Submit, Just form ) ->
          state
            |> registerPageHandleSubmit (registerFormToJson form)
            |> andThen (registerPageSetSent True)
        _ ->
          state.form
            |> Form.update registerFormValidate formMsg
            |> registerPageInsertAsFormIn state

registerPageSubscriptions : RegisterPageState -> (RegisterPageMsg -> msg) -> Sub msg
registerPageSubscriptions state msg = Sub.none

registerPageError : ApiResource User -> Html msg
registerPageError userResource =
  case userResource of
    Error error ->
      Alert.simpleDanger [] [ text (errorMessage error) ]
    _ ->
      text ""

registerPageView : RegisterPageState -> (RegisterPageMsg -> msg) -> Html msg
registerPageView { user, form, sent } msg =
  div []
    [ div [ class "text-center" ]
      [ h2 [ class "text-gray-900 mb-4" ] [ text "Create an account" ] ]
    , registerPageError user.resource
    , p [] [ text "Please fill out and submit the form below to apply for a user account." ]
    , registerFormView form sent (msg << RegisterFormMsg)
    , hr [] []
    , div [ class "text-center" ]
        [ span [] [ text "Or " ]
        , a [ href "/login" ] [ text "log in" ]
        , span [] [ text " if you already have an account." ]
        ]
    ]

--

type Route
 = Home
 | Login
 | Logout
 | ResetPassword
 | Register
 | Profile
 | Projects
 | NewProject
 | Settings
 | Notifications

parser : Parser (Route -> a) a
parser =
  oneOf
    [ Parser.map Home          (Parser.top)
    , Parser.map Login         (Parser.s "login")
    , Parser.map Logout        (Parser.s "logout")
    , Parser.map ResetPassword (Parser.s "reset-password")
    , Parser.map Register      (Parser.s "register")
    , Parser.map Profile       (Parser.s "profile")
    , Parser.map Settings      (Parser.s "settings")
    , Parser.map Projects      (Parser.s "projects")
    , Parser.map NewProject    (Parser.s "projects" </> Parser.s "new")
    , Parser.map Notifications (Parser.s "notifications") ]

fromUrl : Url -> Maybe Route
fromUrl = parse parser

--

type NotificationsModalMsg
  = NotificationsModalOpen Notification
  | NotificationsModalClose
--  | NotificationsModalSubmitForm
  | NotificationsModalAnimate Modal.Visibility
--  | NotificationsModalFormMsg Form.Msg
  | NotificationsModalDismiss

type alias NotificationsModalState =
  { modal : Modal.Visibility 
  , notification : Maybe Notification }
--  , form  : Form () ProfileForm
--  , sent  : Bool }

setNotificationsModalVisibility : Modal.Visibility -> NotificationsModalState -> Update NotificationsModalState NotificationsModalMsg a
setNotificationsModalVisibility visibility state = save { state | modal = visibility }

--notificationsModalSetForm : Form () ProfileForm -> NotificationsModalState -> Update NotificationsModalState NotificationsModalMsg a
--notificationsModalSetForm form state = save { state | form = form }

--notificationsModalInsertAsFormIn : NotificationsModalState -> Form () ProfileForm -> Update NotificationsModalState NotificationsModalMsg a
--notificationsModalInsertAsFormIn state form = save { state | form = form }

--notificationsModalFormSetSent : Bool -> NotificationsModalState -> Update NotificationsModalState NotificationsModalMsg a
--notificationsModalFormSetSent sent state = save { state | sent = sent }

notificationsModalInit : Update NotificationsModalState NotificationsModalMsg a
notificationsModalInit = 
  save 
    { modal = Modal.hidden 
    , notification = Nothing }

--   in Update.Deep.map3 NotificationsModalState
--        (save Modal.hidden)
--        (save form)
--        (save False)

notificationsModalUpdate : { onDismiss : Int -> a } -> NotificationsModalMsg -> NotificationsModalState -> Update NotificationsModalState NotificationsModalMsg a
notificationsModalUpdate { onDismiss } msg state =
  case msg of
    NotificationsModalOpen notification ->
      { state | notification = Just notification }
        |> setNotificationsModalVisibility Modal.shown

      --let form = Form.initial [ ( "name", Field.value (String (user.name)) ) ] profileFormValidate
      -- in notificationsModalInit
      --  |> andThen (setNotificationsModalVisibility Modal.shown)
      --  |> andThen (notificationsModalSetForm form)
    NotificationsModalClose ->
      state
        |> setNotificationsModalVisibility Modal.hidden
--      if not state.sent
--          then state
--                 --|> setNotificationsModalVisibility Modal.hidden
--                 |> setNotificationsModalVisibility Modal.hidden
--          else save state
--    NotificationsModalSubmitForm ->
--      state
--        |> notificationsModalUpdate (NotificationsModalFormMsg Form.Submit)
----        |> notificationsModalUpdate (NotificationsModalAnimate Modal.hiddenAnimated)
--        --|> setNotificationsModalVisibility Modal.hiddenAnimated
    NotificationsModalAnimate visibility ->
      state
        |> setNotificationsModalVisibility visibility
    NotificationsModalDismiss ->
      state |> case state.notification of
        Nothing ->
          save 
        Just { id } ->
          invokeHandler (onDismiss id)
            >> andThen (setNotificationsModalVisibility Modal.hidden)

--      if not state.sent
--          then state
--                 |> setNotificationsModalVisibility visibility
--          else save state
--    NotificationsModalFormMsg formMsg ->
--      case ( formMsg, Form.getOutput state.form ) of
--        ( Form.Submit, Just form ) ->
--          state
--            |> save
--            --|> handleSubmit (profileFormToJson form)
--            |> andThen (notificationsModalFormSetSent True)
--        _ ->
--          state.form
--            |> Form.update profileFormValidate formMsg
--            |> notificationsModalInsertAsFormIn state
--
----      setNotificationsModalVisibility Modal.hidden
----    ShowNotificationsModal ->
----      showNotificationsModal maybeUser
----    AnimateNotificationsModal visibility ->
----      setNotificationsModalVisibility visibility
----    UiProfileFormMsg formMsg ->
----      updateProfileForm formMsg

notificationsModalSubscriptions : NotificationsModalState -> (NotificationsModalMsg -> msg) -> Sub msg
notificationsModalSubscriptions state msg = Modal.subscriptions state.modal (msg << NotificationsModalAnimate)

notificationsModalView : NotificationsModalState -> (NotificationsModalMsg -> msg) -> Html msg
notificationsModalView (state) msg =
  case state.notification of
    Nothing ->
      text ""
    Just notification ->

      Modal.config NotificationsModalClose
        |> Modal.withAnimation NotificationsModalAnimate
    --    |> Modal.h6 [] [ text "User profile" ]
        |> Modal.body []
           [ div [ Spacing.m2 ]
             [ text notification.message

--          if sent
--              then
--                    div [ class "d-flex justify-content-center" ]
--                      [
--
--                        div [ style "border-width" "6px", style "width" "3rem", style "height" "3rem", class "spinner-border", attribute "role" "status" ] [ span [ class "sr-only" ] [ text "Loading" ] ]
--
--                    ]
--
----         div [ class "text-center" ] [
----
----           i [ style "font-size" "64px", class "fas fa-user-edit mb-3" ] []
------         , h2 [ class "text-gray-900 mb-4" ] [ text "User profile" ]
----         ]
--
--              else
--
--           profileFormView state.form sent NotificationsModalFormMsg
--
----          , ButtonGroup.toolbar [ ]
----              [
----
----                ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.mlAuto ] ]
----                [ ButtonGroup.button [ Button.secondary
----                                     --, Button.onClick ProfilePageFormCancel
----                                     --, Button.disabled isSent
----                                     ]
----                                     [ text "Cancel" ]
----                ]
----              , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
----                [ ButtonGroup.button [ Button.primary
----                                     --, Button.onClick (ProfileFormMsg Form.Submit)
----                                     --, Button.disabled isSent
----                                     ]
----                                     --[ text (if isSent then "Please wait" else "Save") ]
----                                     [ text "Save" ]
----                ]
----              ]

            ]

             --p [] [ text "This is a modal for you !"]
           ]
        |> Modal.footer []
           [ Button.button
             [ Button.primary
             , Button.block
             , Button.attrs [ onClick NotificationsModalDismiss ] ]
             --, Button.attrs [ onClick <| NotificationsModalAnimate Modal.hiddenAnimated ] ]
               [ text "Dismiss" ] ]
        |> Modal.view state.modal
        |> Html.map msg

--

type UiMsg
  = ToggleSidebar
  | ToggleUserDropdown
  | ToggleEventsDropdown
  | UserDropdownStatus DropdownStatus
  | EventsDropdownStatus DropdownStatus
  | NotificationsModalMsg NotificationsModalMsg
  | FetchNotifications
  | NotificationsApiMsg (ApiMsg (List Notification))
--  | CloseNotificationsModal
--  | ShowNotificationsModal
--  | AnimateNotificationsModal Modal.Visibility
--  | UiProfileFormMsg Form.Msg

type DropdownStatus
  = Open
  | Listen
  | Closed

toggleDropdownStatus : DropdownStatus -> DropdownStatus
toggleDropdownStatus status =
  case status of
    Open ->
      Closed
    Listen ->
      Closed
    Closed ->
      Open

type alias UiState =
  { sidebarVisible       : Bool
  , userDropdownStatus   : DropdownStatus
  , notifsDropdownStatus : DropdownStatus
  , notificationsModal   : NotificationsModalState
  , notifications        : ApiModel (List Notification)
  }
--  , notificationsModal         : Modal.Visibility
--  , profileForm          : Form () ProfileForm
--  , profileFormSent      : Maybe ProfileForm }

toggleSidebar : UiState -> Update UiState UiMsg a
toggleSidebar state = save { state | sidebarVisible = not state.sidebarVisible }

setUserDropdownStatus : DropdownStatus -> UiState -> Update UiState UiMsg a
setUserDropdownStatus status state = save { state | userDropdownStatus = status }

setEventsDropdownStatus : DropdownStatus -> UiState -> Update UiState UiMsg a
setEventsDropdownStatus status state = save { state | notifsDropdownStatus = status }

insertAsNotificationsModalIn : UiState -> NotificationsModalState -> Update UiState UiMsg a
insertAsNotificationsModalIn state notificationsModal = save { state | notificationsModal = notificationsModal }

uiStateSetNotifications : ApiModel (List Notification) -> UiState -> Update UiState UiMsg a
uiStateSetNotifications notifications state = save { state | notifications = notifications }

insertAsNotificationsIn : UiState -> ApiModel (List Notification) -> Update UiState UiMsg a
insertAsNotificationsIn state notifications = save { state | notifications = notifications }

--setNotificationsModalVisibility : Modal.Visibility -> UiState -> Update UiState UiMsg a
--setNotificationsModalVisibility visibility state = save { state | notificationsModal = visibility }
--
--uiInsertAsProfileFormIn : UiState -> Form () ProfileForm -> Update UiState UiMsg a
--uiInsertAsProfileFormIn state form = save { state | profileForm = form }
--
--uiProfileFormSetSent : ProfileForm -> UiState -> Update UiState UiMsg a
--uiProfileFormSetSent form state = save { state | profileFormSent = Just form }

uiInit : Update UiState UiMsg a
uiInit =
  let notifications = apiInit { endpoint = "/notifications"
                              , method   = HttpGet
                              , decoder  = Json.field "notifications" (Json.list Data.Notification.decoder) }
   in save UiState
    |> Update.Deep.andMap (save True)
    |> Update.Deep.andMap (save Closed)
    |> Update.Deep.andMap (save Closed)
    |> Update.Deep.andMap (notificationsModalInit |> mapCmd NotificationsModalMsg)
    |> Update.Deep.andMap (notifications          |> mapCmd NotificationsApiMsg)
--  save
--    { sidebarVisible       = True
--    , userDropdownStatus   = Closed
--    , notifsDropdownStatus = Closed
--    , notificationsModal         = notificationsModalInit
--    }
--    , notificationsModal         = Modal.hidden
--    , profileForm          = Form.initial [] profileFormValidate
--    , profileFormSent      = Nothing }

--updateProfileForm msg state =
--  case ( msg, Form.getOutput state.profileForm ) of
--    ( Form.Submit, Just form ) ->
--      state
--        |> save
--        --|> handleSubmit (profileFormToJson form)
--        |> andThen (uiProfileFormSetSent form)
--    _ ->
--      state.profileForm
--        |> Form.update profileFormValidate msg
--        |> uiInsertAsProfileFormIn state
--
--showNotificationsModal maybeUser state =
--  case maybeUser of
--    Nothing ->
--      save state
--    Just user_ ->
--      { state | profileForm = Form.initial [ ( "name", Field.value (String (user_.name)) ) ] profileFormValidate }
--        |> setNotificationsModalVisibility Modal.shown

dismissNotification : Int -> UiState -> Update UiState UiMsg a
dismissNotification id ({ notifications } as state) =
  state |> case notifications.resource of
    Available availableNotifications ->
      let resource = availableNotifications |> List.filter (\notif -> notif.id /= id)
       in uiStateSetNotifications { notifications | resource = Available resource }
    _ ->
      save

uiUpdate : { onNotificationsFetched : List Notification -> a } -> UiMsg -> UiState -> Update UiState UiMsg a
uiUpdate { onNotificationsFetched } msg state =
  case msg of
    ToggleSidebar ->
      state
        |> toggleSidebar
    ToggleUserDropdown ->
      state
        |> setUserDropdownStatus (toggleDropdownStatus state.userDropdownStatus)
    ToggleEventsDropdown ->
      state
        |> setEventsDropdownStatus (toggleDropdownStatus state.notifsDropdownStatus)
    UserDropdownStatus dropdownStatus ->
      state
        |> setUserDropdownStatus dropdownStatus
    EventsDropdownStatus dropdownStatus ->
      state
        |> setEventsDropdownStatus dropdownStatus
    NotificationsModalMsg notificationsModalMsg ->
      state.notificationsModal
        |> notificationsModalUpdate { onDismiss = dismissNotification } notificationsModalMsg
        |> mapCmd NotificationsModalMsg
        |> andFinally (insertAsNotificationsModalIn state)
    NotificationsApiMsg apiMsg ->
      state.notifications
        |> apiUpdate { onSuccess = invokeHandler << onNotificationsFetched, onError = always (invokeHandler <| onNotificationsFetched []) } apiMsg
        |> mapCmd NotificationsApiMsg
        |> andFinally (insertAsNotificationsIn state)
    FetchNotifications ->
      state
        |> uiUpdate { onNotificationsFetched = onNotificationsFetched } (NotificationsApiMsg (Request "" Nothing))


           --, Button.attrs [ onClick <| AnimateNotificationsModal Modal.hiddenAnimated ] ]

dropdownSubscriptions : DropdownStatus -> (DropdownStatus -> msg) -> Sub msg
dropdownSubscriptions status msg =
  case status of
    Open ->
      Browser.Events.onAnimationFrame (always (msg Listen))
    Listen ->
      Browser.Events.onClick (Json.succeed (msg Closed))
    Closed ->
      Sub.none

uiSubscriptions : UiState -> (UiMsg -> msg) -> Sub msg
uiSubscriptions state msg =
  Sub.batch
    [ dropdownSubscriptions state.userDropdownStatus (msg << UserDropdownStatus)
    , dropdownSubscriptions state.notifsDropdownStatus (msg << EventsDropdownStatus)
    , notificationsModalSubscriptions state.notificationsModal (msg << NotificationsModalMsg) ]

--uiNotificationsModalView : UiState -> Html UiMsg
--uiNotificationsModalView state =
--  div [] []
----   Modal.config CloseNotificationsModal
----     |> Modal.withAnimation AnimateNotificationsModal
---- --    |> Modal.h4 [] [ text "User profile" ]
----     |> Modal.h3 [] [ text "User profile" ]
----     |> Modal.body [ ]
----        [
----          div [ Spacing.m2 ] [
----
---- --         div [ class "text-center" ] [
---- --
---- --           i [ style "font-size" "64px", class "fas fa-user-edit mb-3" ] []
---- ----         , h2 [ class "text-gray-900 mb-4" ] [ text "User profile" ]
---- --         ]
----
----          Html.map UiProfileFormMsg (profileFormView state.profileForm (Nothing /= state.profileFormSent))
----
---- --          , ButtonGroup.toolbar [ ]
---- --              [
---- --
---- --                ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.mlAuto ] ]
---- --                [ ButtonGroup.button [ Button.secondary
---- --                                     --, Button.onClick ProfilePageFormCancel
---- --                                     --, Button.disabled isSent
---- --                                     ]
---- --                                     [ text "Cancel" ]
---- --                ]
---- --              , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
---- --                [ ButtonGroup.button [ Button.primary
---- --                                     --, Button.onClick (ProfileFormMsg Form.Submit)
---- --                                     --, Button.disabled isSent
---- --                                     ]
---- --                                     --[ text (if isSent then "Please wait" else "Save") ]
---- --                                     [ text "Save" ]
---- --                ]
---- --              ]
----
----         ]
----
----          --p [] [ text "This is a modal for you !"]
----        ]
----     |> Modal.footer []
----        [ Button.button
----            [ Button.primary
----            , Button.block
----            , Button.disabled (Nothing /= state.profileFormSent)
----            , Button.attrs [ onClick (UiProfileFormMsg Form.Submit) ] ]
----            --, Button.attrs [ onClick <| AnimateNotificationsModal Modal.hiddenAnimated ] ]
----            [ text "Update" ] ]
----     |> Modal.view state.notificationsModal

uiSidebarView : UiState -> (UiMsg -> msg) -> Html msg
uiSidebarView state msg =
  let toggled = if state.sidebarVisible then "" else "toggled "
   in ul [ class (toggled ++ "navbar-nav bg-secondary sidebar sidebar-dark accordion") ] 
        [
          li [ class "nav-item" ] 
          [ a [ href "#", class "nav-link" ] [ span [] [ text "Dashboard" ] ] ]
        , li [ class "nav-item" ] 
          [ a [ href "#", class "nav-link" ] [ span [] [ text "Results" ] ] ]
        ]

uiNotificationsDropdown : UiState -> (UiMsg -> msg) -> Html msg
uiNotificationsDropdown state msg =
  
  let icon =

        case state.notifications.resource of
          NotRequested ->
            text ""
          Error httpError ->
            text ""
          Requested ->
            div [ style "min-width" "59px" ]
              [ Button.button [ Button.small, Button.roleLink, Button.attrs [ style "font-size" "1.4em", class "nav-link dropdown-toggle", onClick (msg ToggleEventsDropdown) ] ]
                [ div [ class "d-flex justify-content-center", style "height" "100%", style "align-items" "center" ]
                  [ div [ style "opacity" "0.65", style "border-width" "5px", style "width" "2rem", style "height" "2rem", class "spinner-border text-white", attribute "role" "status" ] [ span [ class "sr-only" ] [ text "Loading" ] ] ] ] ]
          Available notifications ->
            let count = List.length notifications 
             in if 0 == count
                    then text ""
                    else 
                      div [ style "min-width" "59px" ]
                        [ Button.button
                          [ Button.small, Button.roleLink, Button.attrs [ style "font-size" "1.4em", class "nav-link dropdown-toggle", onClick (msg ToggleEventsDropdown) ] ]
                          [ i [ class "fas fa-bell fa-fw" ] []
                          , span [ style "margin-top" "1.1rem"
                                 , style "margin-right" "0.1rem"
                                 , class "badge badge-danger badge-counter"
                                 ] [ text (String.fromInt count) ] ] ]

      menuItem notification = 
        span [ onClick (msg (NotificationsModalMsg (NotificationsModalOpen notification))), style "cursor" "pointer", class "dropdown-item d-flex align-items-center" ]
          [ div [ class "mr-3" ] [
                  div [ class "icon-circle bg-success", style "width" "2.8rem", style "height" "2.8rem" ]
                    [ i [ style "font-size" "1.85em", class "fas fa-smile text-white" ] [] ]
                ]
              , div [] [
                  --div [ class "small text-gray-500" ] [ text "December 12, 2019" ] ,
                  span [ ] [ text notification.message ]
                ] ]

      menu = 
        case state.notifications.resource of
          Available notifications ->
              div [ class ((if Closed /= state.notifsDropdownStatus then "show " else "") ++ "dropdown-list dropdown-menu dropdown-menu-right shadow-sm animated--grow-in") ]
                ( [ h6 [ class "bg-success border-success dropdown-header" ] [ text "Notifications" ] ] 
               ++ List.map menuItem notifications 
               ++ [ a [ href "/notifications", class "dropdown-item text-center text-gray-500" ] [ text "Show all notifications" ] ] )
          _ ->
            text ""

   in

     li [ class "mr-2 nav-item dropdown no-arrow" ] 
       [ icon
       , menu

--        Button.button [ Button.small, Button.roleLink, Button.attrs [ style "font-size" "1.4em", class "nav-link dropdown-toggle", onClick (msg ToggleEventsDropdown) ] ]

--        [ i [ class "fas fa-bell fa-fw" ] []
--        , span [ style "margin-top" "1.1rem", style "margin-right" "0.1rem", class "badge badge-danger badge-counter" ] [ text "3" ]
--        ]

--        , span [ onClick (msg (NotificationsModalMsg NotificationsModalOpen)), style "cursor" "pointer", class "dropdown-item d-flex align-items-center" ]
--              [ div [ class "mr-3" ] [
--                  div [ class "icon-circle bg-success" ]
--                    [ i [ class "fas fa-file-alt text-white" ] [] ]
--                ]
--              , div [] [
--                  --div [ class "small text-gray-500" ] [ text "December 12, 2019" ] ,
--                  span [ ] [ text "A campaign report is ready to download." ]
--                ]
--
--              ]
--
--        , span [ onClick (msg (NotificationsModalMsg NotificationsModalOpen)), style "cursor" "pointer", class "dropdown-item d-flex align-items-center" ]
--              [ div [ class "mr-3" ] [
--                  div [ class "icon-circle bg-success" ]
--                    [ i [ class "fas fa-chart-bar text-white" ] [] ]
--                ]
--              , div [] [
--                  --div [ class "small text-gray-500" ] [ text "December 7, 2019" ] ,
--                  span [] [ text "A total of 998 listeners have participated in this campaign." ]
--                ]
--
--              ]
--
--        , span [ onClick (msg (NotificationsModalMsg NotificationsModalOpen)), style "cursor" "pointer", class "dropdown-item d-flex align-items-center" ]
--              [ div [ class "mr-3" ] [
--                  div [ class "icon-circle bg-danger" ]
--                    [ i [ class "fas fa-exclamation-triangle text-white" ] [] ]
--                ]
--              , div [] [
--                  --div [ class "text-gray-500" ] [ text "December 7, 2019" ] ,
--                  span [] [ text "Spending alert: This campaign has used 83% of budgeted calls and SMS." ]
--                ]
--
--              ]
--
--        , a [ href "/notifications", class "dropdown-item text-center text-gray-500" ] [ text "Show all notifications" ]
--
--        ]
      ]



uiNavbarView : UiState -> User -> (UiMsg -> msg) -> Html msg
uiNavbarView state user msg =
  nav [ class "navbar navbar-expand navbar-dark bg-success topbar static-top" ]
    [ button [ onClick (msg ToggleSidebar), class "text-white btn btn-link d-md-none rounded-circle mr-3" ] [ i [ class "fa fa-bars" ] [] ]
    , a [ href "/", class "navbar-brand" ] [ text "Farm Radio Interactive" ]

--    , text (Debug.toString state.notifications)

    , ul [ class "navbar-nav ml-auto" ]
      [

        li [ class "nav-item dropdown" ]
        [ 
          Button.button
            [ Button.small, Button.roleLink, Button.attrs [ style "font-size" "1em", class "nav-link dropdown-toggle" ] ]
            [ b [ class "d-none d-sm-block" ] [ text "English" ] ] -- i [ class "fas fa-bell fa-fw" ] []
        
        ]

      , uiNotificationsDropdown state msg

--        li [ class "mr-2 nav-item dropdown no-arrow mx-1" ]
--        [
--            a [ style "font-size" "1.4em", href "#", onClick ToggleEventsDropdown, class "nav-link dropdown-toggle" ]
--
--            [ i [ class "fas fa-bell fa-fw" ] []
--            , span [ style "border-radius" "50%", class "badge badge-danger badge-counter" ] [ text "3" ]
--            ]
--
--          ]


      , li [ class "nav-item dropdown no-arrow" ]
        [

          Button.button [ Button.roleLink, Button.attrs [ class "nav-link dropdown-toggle", onClick (msg ToggleUserDropdown) ] ]

          --a [ class "nav-link dropdown-toggle"
          --  , onClick ToggleUserDropdown
          --  , href "#"
          --  ]
            [ span [ style "font-size" "1em"
                   , class "mr-3 d-none d-lg-inline text-white small"
                   ]
              [ text user.name ]
            , img
              [ class "img-profile rounded-circle"
              , style "width" "2.4rem"
              , style "height" "2.4rem"
              , src "/tmp/photo-1518822275865-16eec4d3023d.jpeg" ] []
            ]
          , div
            [ class ((if Closed /= state.userDropdownStatus then "show " else "") ++ "dropdown-menu dropdown-menu-right shadow-sm animated--grow-in") ]
            [

              div [ class "dropdown-header" ] [ text "Account" ]


            , a [ href "/profile", class "dropdown-item" ] [ text "Profile" ]

--            , span [ style "cursor" "pointer", class "dropdown-item", onClick (msg (NotificationsModalMsg (NotificationsModalOpen user))) ]
--                [ text "Profile" ]

--            , Button.button [ Button.roleLink, Button.attrs [ class "dropdown-item", onClick (msg (NotificationsModalMsg (NotificationsModalOpen user))) ] ]
--                [ text "Profile" ]

            , div [ class "dropdown-divider" ] []

            , div [ class "dropdown-header" ] [ text "Project" ]

            , a
              [ class "dropdown-item"
              , href "/settings"
              ]
              [ text "Settings" ]

            , a
              [ class "dropdown-item"
              , href "/projects"
              ]
              [ text "Change project" ]

            , a
              [ class "dropdown-item"
              , href "/projects/new"
              --, onClick ShowNewProjectModal
              ]
              [ text "New project" ]

            , div [ class "dropdown-divider" ] []

            , a
              [ class "dropdown-item"
              , href "/logout"
              ]
              [ text "Log out" ]

              ]
          ]
      ]
    ]

--

projectLayout : User -> UiState -> Html Msg -> Html Msg
projectLayout user ui page =
  div []
    [ uiNavbarView ui user UiMsg
    , div [ id "wrapper" ]
      [ uiSidebarView ui UiMsg
      , div [ id "content-wrapper", class "d-flex flex-column" ]
        [ div [ id "content" ]
          [ div [ class "container-fluid mt-4" ]
            [ page ]
          ]
        ]
      ]
    , notificationsModalView ui.notificationsModal (UiMsg << NotificationsModalMsg) ]

--

container : Attribute msg
container = class "container"

--publicLayout : String -> State -> List (Html Msg) -> Html Msg
--publicLayout class_ { ui } html =
--  div
--    [ bgSuccess, style "min-height" "100vh" ]
--    [ div [ container ]
--      [ div [ justifyCenter, row ]
--        [ div [ class class_ ]
--          [ div [ Spacing.my5, card ]
--            [ div [ Spacing.p0, cardBody ]
--              [ div [ row ] html ]
--            ]
--          ]
--        ]
--      ]
--    ]
--
--    Just Login ->
--      div [] []
----      layout ( -- "primary"
----        div [ class "row justify-content-center" ]
----          [ div [ class "col-md-8" ]
----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
----              [ div [ class "card-body p-0" ]
----                [ div [ class "row" ]
----                  [ div [ class "col-lg-12" ]
----                    [ div [ class "p-5" ]
----                      [ Html.map LoginPageMsg (loginPageView (state.loginPage)) ]
----                    ] ] ] ] ] ] )
--    Just Register ->
--      div [] []
----      layout ( -- "success"
----        div [ class "row justify-content-center" ]
----          [ div [ class "col-md-12" ]
----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
----              [ div [ class "card-body p-0" ]
----                [ div [ class "row" ]
----                  [ div [ style "min-height" "600px", style "background-image" "url(/img/bg-register.jpg)", class "col-lg-5 d-none d-lg-block bg-register-image" ] []
----                  , div [ class "col-lg-7" ]
----                    [ div [ class "p-5" ]
----                      [ Html.map RegisterPageMsg (registerPageView (state.registerPage)) ]
----                    ] ] ] ] ] ] )
--    Just ResetPassword ->
--      div [] []
----      layout ( -- "primary"
----        div [ class "row justify-content-center" ]
----          [ div [ class "col-md-8" ]
----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
----              [ div [ class "card-body p-0" ]
----                [ div [ class "row" ]
----                  [ div [ class "col-lg-12" ]
----                    [ div [ class "p-5" ]
----                      [ text "ResetPassword" ]
----                    ] ] ] ] ] ] )
--    Just Projects ->
--      div [] []
----      publicLayout state ( -- "success"
----        div [ class "row justify-content-center" ]
----          [ div [ class "col-md-8" ]
----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
----              [ div [ class "card-body p-0" ]
----                [ div [ class "row" ]
----                  [ div [ class "col-lg-12" ]
----                    [ div [ class "p-5" ]
----                      [ Html.map SelectProjectPageMsg (selectProjectPageView state.selectProjectPage) ] ] ] ] ] ] ] )

-- layout : (Page -> Html Msg) -> State -> Html Msg
-- layout html ({ page } as state) =
--   case state.session of
--     Nothing ->
--       --div [] [ html page ]
--
--       publicLayout "col-md-8 col-lg-5" state
--         [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
--
--     Just session ->
--       case session.project of
--         Nothing ->
--
--           publicLayout "col-md-8 col-lg-5" state
--             [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
--
--           --div [] [ html page ]
--         Just project ->
--           projectLayout session.user state.ui (html page)
-- --  case page of
-- --    LoginPage _ ->
-- --      publicLayout "col-md-8 col-lg-5" state
-- --        [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    RegisterPage _ ->
-- --      publicLayout "col-md-11" state
-- --        [ div [ style "min-height" "600px"
-- --              , style "background-image" "url(/img/bg-register.jpg)"
-- --              , class "col-lg-6 d-none d-lg-block bg-register-image" ] []
-- --        , div [ class "col-lg-6" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    SelectProjectPage _ ->
-- --      publicLayout "col-md-8" state
-- --        [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    ResetPasswordPage _ ->
-- --      publicLayout "col-md-8 col-lg-6" state
-- --        [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    ProfilePage _ ->
-- --      publicLayout "col-md-8 col-lg-6" state
-- --        [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    NewProjectPage _ ->
-- --      publicLayout "col-md-8 col-lg-6" state
-- --        [ div [ class "col-lg-12" ] [ div [ class "p-5" ] [ html page ] ] ]
-- --    _ ->
-- --      projectLayout state (html page)
--
-- --dashboardView : Project -> Html Msg
-- --dashboardView project =
-- --  div []
-- --    [ h1 [ class "h3 mb-0 text-gray-800" ] [ text project.name ]
-- --    , a [ href "/projects" ] [ text "Projects" ]
-- --    , text "..." ]
--
-- --    ( Just Login, LoginPage loginPageState ) ->
-- --      Html.map (PageMsg << LoginPageMsg) (loginPageView loginPageState)
-- --    ( Just Register, RegisterPage registerPageState ) ->
-- --      Html.map (PageMsg << RegisterPageMsg) (registerPageView registerPageState)
-- --    ( Just ResetPassword, ResetPasswordPage resetPasswordPageState ) ->
-- --      Html.map (PageMsg << ResetPasswordPageMsg) (resetPasswordPageView resetPasswordPageState)
-- --    ( Just Profile, ProfilePage profilePageState ) ->
-- --      Html.map (PageMsg << ProfilePageMsg) (profilePageView profilePageState)
-- --    ( Just Projects, SelectProjectPage selectProjectPageState ) ->
-- --      Html.map (PageMsg << SelectProjectPageMsg) (selectProjectPageView selectProjectPageState)
-- --    ( Just NewProject, NewProjectPage newProjectPageState ) ->
-- --      Html.map (PageMsg << NewProjectPageMsg) (newProjectPageView newProjectPageState)
--
-- --  let layout =
-- --        state
-- --          |> if Nothing /= state.user && Nothing /= state.project
-- --                 then projectLayout
-- --                 else publicLayout
-- --
-- --   in case state.router.route of
-- --    Just Home ->
-- --      case state.project of
-- --        Nothing -> div [] [ text "error" ]
-- --        Just justProject -> layout (dashboardView justProject)
-- --    Just Profile ->
-- --      publicLayout state (
-- --        h1 [ ] [ text "Profile" ]
-- --        )
-- --    Just Settings ->
-- --      layout (
-- --        h1 [ ] [ text "Settings" ]
-- --        )
-- --    Just Login ->
-- --    Just Login ->
-- --      div [] []
-- ----      layout ( -- "primary"
-- ----        div [ class "row justify-content-center" ]
-- ----          [ div [ class "col-md-8" ]
-- ----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
-- ----              [ div [ class "card-body p-0" ]
-- ----                [ div [ class "row" ]
-- ----                  [ div [ class "col-lg-12" ]
-- ----                    [ div [ class "p-5" ]
-- ----                      [ Html.map LoginPageMsg (loginPageView (state.loginPage)) ]
-- ----                    ] ] ] ] ] ] )
-- --    Just Register ->
-- --      div [] []
-- ----      layout ( -- "success"
-- ----        div [ class "row justify-content-center" ]
-- ----          [ div [ class "col-md-12" ]
-- ----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
-- ----              [ div [ class "card-body p-0" ]
-- ----                [ div [ class "row" ]
-- ----                  [ div [ style "min-height" "600px", style "background-image" "url(/img/bg-register.jpg)", class "col-lg-5 d-none d-lg-block bg-register-image" ] []
-- ----                  , div [ class "col-lg-7" ]
-- ----                    [ div [ class "p-5" ]
-- ----                      [ Html.map RegisterPageMsg (registerPageView (state.registerPage)) ]
-- ----                    ] ] ] ] ] ] )
-- --    Just ResetPassword ->
-- --      div [] []
-- ----      layout ( -- "primary"
-- ----        div [ class "row justify-content-center" ]
-- ----          [ div [ class "col-md-8" ]
-- ----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
-- ----              [ div [ class "card-body p-0" ]
-- ----                [ div [ class "row" ]
-- ----                  [ div [ class "col-lg-12" ]
-- ----                    [ div [ class "p-5" ]
-- ----                      [ text "ResetPassword" ]
-- ----                    ] ] ] ] ] ] )
-- --    Just Projects ->
-- --      div [] []
-- ----      publicLayout state ( -- "success"
-- ----        div [ class "row justify-content-center" ]
-- ----          [ div [ class "col-md-8" ]
-- ----            [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
-- ----              [ div [ class "card-body p-0" ]
-- ----                [ div [ class "row" ]
-- ----                  [ div [ class "col-lg-12" ]
-- ----                    [ div [ class "p-5" ]
-- ----                      [ Html.map SelectProjectPageMsg (selectProjectPageView state.selectProjectPage) ] ] ] ] ] ] ] )
-- --    _ ->
-- --      publicLayout state (text "Not found") -- "success"
-- --
-- --

type RouterMsg
  = UrlChange Url
  | UrlRequest UrlRequest
  | Redirect String

type alias RouterState =
  { route : Maybe Route
  , key   : Navigation.Key }

setRoute : Maybe Route -> RouterState -> Update RouterState RouterMsg a
setRoute route state = save { state | route = route }

routerInit : Navigation.Key -> Update RouterState RouterMsg a
routerInit key = save { route = Nothing, key = key }

routerRedirect : Navigation.Key -> String -> RouterState -> Update RouterState RouterMsg a
routerRedirect key href = runCmd (Navigation.replaceUrl key href)

routerUpdate : { onRouteChange : Maybe Route -> a } -> RouterMsg -> RouterState -> Update RouterState RouterMsg a
routerUpdate { onRouteChange } msg state =
  state |> case msg of
    UrlChange url ->
      let route = fromUrl url
       in setRoute route >> andInvokeHandler (onRouteChange route)
    UrlRequest (Browser.Internal url) ->
      runCmd (Navigation.pushUrl state.key (Url.toString url))
    UrlRequest (Browser.External href) ->
      runCmd (Navigation.load href)
    Redirect href ->
      routerRedirect state.key href

routerSubscriptions : RouterState -> (RouterMsg -> msg) -> Sub msg
routerSubscriptions state msg = Sub.none

--

type PageMsg
  = LoginPageMsg LoginPageMsg
  | RegisterPageMsg RegisterPageMsg
  | SelectProjectPageMsg SelectProjectPageMsg
  | ResetPasswordPageMsg ResetPasswordPageMsg
  | ProfilePageMsg ProfilePageMsg
  | NewProjectPageMsg NewProjectPageMsg
  | ProjectHomePageMsg ProjectHomePageMsg
  | ProjectSettingsPageMsg ProjectSettingsPageMsg

type Page
  = NoPage
  | LoginPage LoginPageState
  | RegisterPage RegisterPageState
  | SelectProjectPage SelectProjectPageState
  | ResetPasswordPage ResetPasswordPageState
  | ProfilePage ProfilePageState
  | NewProjectPage NewProjectPageState
  | ProjectHomePage ProjectHomePageState
  | ProjectSettingsPage ProjectSettingsPageState

--

type alias Flags =
  { api     : String
  , session : String }

type Msg
  = RouterMsg RouterMsg
  | UiMsg UiMsg
  | PageMsg PageMsg

type alias State =
  { router  : RouterState
  , ui      : UiState
  , session : Maybe Session
  , page    : Page }

insertAsRouterIn : State -> RouterState -> Update State Msg a
insertAsRouterIn state router = save { state | router = router }

insertAsUiIn : State -> UiState -> Update State Msg a
insertAsUiIn state ui = save { state | ui = ui }

setSession : Maybe Session -> State -> Update State Msg a
setSession session state = save { state | session = session }

insertAsPageIn : State -> Page -> Update State Msg a
insertAsPageIn state page = save { state | page = page }

setWorkingProject : Project -> State -> Update State Msg a
setWorkingProject project ({ session } as state) =
  state |> case session of
    Nothing ->
      save
    Just session_ ->
      setSession (Just { session_ | project = Just project })

setNotifications : List Notification -> State -> Update State Msg a
setNotifications notifications ({ session } as state) =
  state |> case session of
    Nothing ->
      save
    Just session_ ->
      setSession (Just { session_ | notifications = notifications })

initSession : Flags -> Maybe Session
initSession { session } =
  case Json.decodeString Data.Session.decoder session of
    Ok result ->
      Just result
    _ ->
      Nothing

init : Flags -> Url -> Navigation.Key -> Update State Msg a
init flags url key =
  save State
    |> Update.Deep.andMap (routerInit key |> mapCmd RouterMsg)
    |> Update.Deep.andMap (uiInit         |> mapCmd UiMsg)
    |> Update.Deep.andMap (save <| initSession flags)
    |> Update.Deep.andMap (save NoPage)
    |> Update.Deep.andThen (updateRouterWith (UrlChange url))
    |> Update.Deep.andThen (updateUiWith FetchNotifications)

--authenticatedRoute : Route -> State -> Update State Msg a
--authenticatedRoute route state =
--  case route of
--    Projects ->
--      save state
--    NewProject ->
--      save state
--    Profile ->
--      save state
--    Settings ->
--      save state
--    -------------------------------------------------
--    -- Other routes need an active working project --
--    -------------------------------------------------
--    _ ->
--      state
--        |> if Nothing == state.session.project
--               then redirect "/projects"
--               else save

-- loadProjectPage : Maybe Route -> State -> Update State Msg a
-- loadProjectPage maybeRoute ({ page } as state) =
--   case ( maybeRoute, page ) of
--     ( Just Home, ProjectHomePage _ ) ->
--       save state
--     ( Just Settings, ProjectSettingsPage _ ) ->
--       save state
--     ( Just Home, _ ) ->
--       save state
--     ( Just Settings, _ ) ->
--       save state
--
-- loadAuthenticatedPage : Maybe Route -> State -> Update State Msg a
-- loadAuthenticatedPage maybeRoute ({ page } as state) =
--   case state.session of
--     Nothing ->
--       save state
--     Just session ->
--       case ( maybeRoute, page ) of
--         ( Just Projects, SelectProjectPage _ ) ->
--           save state
--         ( Just Profile, ProfilePage _ ) ->
--           save state
--         ( Just NewProject, NewProjectPage _ ) ->
--           save state
--         --
--         ( Just Projects, _ ) ->
--           selectProjectPageInit
--             |> mapCmd (PageMsg << SelectProjectPageMsg)
--             |> andFinally (insertAsPageIn state << SelectProjectPage)
--             |> andThen (update (PageMsg <| SelectProjectPageMsg selectProjectFetchProjects))
--         ( Just Profile, _ ) ->
--           save state
--         ( Just NewProject, _ ) ->
--           save state
--     _ ->
--       loadProjectPage maybeRoute state
--
-- loadPage : Maybe Route -> State -> Update State Msg a
-- loadPage maybeRoute ({ page } as state) =
--   case ( maybeRoute, page ) of
--     ( Just Login, LoginPage _ ) ->
--       save state
--     ( Just Register, RegisterPage _ ) ->
--       save state
--     ( Just ResetPassword, ResetPasswordPage _ ) ->
--       save state
--     ( Just Login, _ ) ->
--       loginPageInit
--         |> mapCmd (PageMsg << LoginPageMsg)
--         |> andFinally (insertAsPageIn state << LoginPage)
--     ( Just Register, _ ) ->
--       registerPageInit
--         |> mapCmd (PageMsg << RegisterPageMsg)
--         |> andFinally (insertAsPageIn state << RegisterPage)
--     ( Just ResetPassword, _ ) ->
--       resetPasswordPageInit
--         |> mapCmd (PageMsg << ResetPasswordPageMsg)
--         |> andFinally (insertAsPageIn state << ResetPasswordPage)
--     _ ->
--       loadAuthenticatedPage maybeRoute state
-- --    ( Just Profile, _ ) ->
-- --      case state.session.user of
-- --        Nothing ->
-- --          state
-- --            |> redirect "/login"
-- --        Just user_ ->
-- --          profilePageInit state.router.key user_
-- --            |> mapCmd (PageMsg << ProfilePageMsg)
-- --            |> andFinally (insertAsPageIn state << ProfilePage)
-- --    ( Just NewProject, _ ) ->
-- --      newProjectPageInit state.router.key
-- --        |> mapCmd (PageMsg << NewProjectPageMsg)
-- --        |> andFinally (insertAsPageIn state << NewProjectPage)
-- --    ( Just Home, _ ) ->
-- --      case state.session.project of
-- --        Nothing ->
-- --          state
-- --            |> redirect "/projects"
-- --        Just project_ ->
-- --          projectHomePageInit project_.id
-- --            |> mapCmd (PageMsg << ProjectHomePageMsg)
-- --            |> andFinally (insertAsPageIn state << ProjectHomePage)
-- --            |> andThen (update (PageMsg <| ProjectHomePageMsg projectHomePageFetchProject))
-- --    ( Just Settings, _ ) ->
-- --      projectSettingsPageInit
-- --        |> mapCmd (PageMsg << ProjectSettingsPageMsg)
-- --        |> andFinally (insertAsPageIn state << ProjectSettingsPage)
-- --    _ ->
-- --      save state

redirect : String -> State -> Update State Msg a
redirect = updateRouterWith << Redirect

loadHomePage : Int -> State -> Update State Msg a
loadHomePage projectId state =
  projectHomePageInit projectId
    |> mapCmd (PageMsg << ProjectHomePageMsg)
    |> andFinally (insertAsPageIn state << ProjectHomePage)
    |> andThen (update (PageMsg <| ProjectHomePageMsg projectHomePageFetchProject))

loadSettingsPage : State -> Update State Msg a
loadSettingsPage state =
  projectSettingsPageInit
    |> mapCmd (PageMsg << ProjectSettingsPageMsg)
    |> andFinally (insertAsPageIn state << ProjectSettingsPage)

projectRoute : User -> Project -> Route -> State -> Update State Msg a
projectRoute user project route state =
  state |> case route of
    Home ->
      loadHomePage project.id
    Settings ->
      loadSettingsPage
    _ ->
      save

loadSelectProjectPage : State -> Update State Msg a
loadSelectProjectPage state =
  selectProjectPageInit
    |> mapCmd (PageMsg << SelectProjectPageMsg)
    |> andFinally (insertAsPageIn state << SelectProjectPage)
    |> andThen (update (PageMsg <| SelectProjectPageMsg selectProjectFetchProjects))

loadNewProjectPage : State -> Update State Msg a
loadNewProjectPage state =
  newProjectPageInit state.router.key
    |> mapCmd (PageMsg << NewProjectPageMsg)
    |> andFinally (insertAsPageIn state << NewProjectPage)

loadProfilePage : User -> State -> Update State Msg a
loadProfilePage user state =
  profilePageInit state.router.key user
    |> mapCmd (PageMsg << ProfilePageMsg)
    |> andFinally (insertAsPageIn state << ProfilePage)

authenticatedRoute : Session -> Route -> State -> Update State Msg a
authenticatedRoute { project, user } route state =
  state |> case route of
    Projects ->
      loadSelectProjectPage
    NewProject ->
      loadNewProjectPage
    Profile ->
      loadProfilePage user
    -------------------------------------------------
    -- Other routes need an active working project --
    -------------------------------------------------
    _ ->
      case project of
        Nothing ->
          redirect "/projects"
        Just project_ ->
          projectRoute user project_ route

loadLoginPage : State -> Update State Msg a
loadLoginPage state =
  loginPageInit
    |> mapCmd (PageMsg << LoginPageMsg)
    |> andFinally (insertAsPageIn state << LoginPage)

loadRegisterPage : State -> Update State Msg a
loadRegisterPage state =
  registerPageInit
    |> mapCmd (PageMsg << RegisterPageMsg)
    |> andFinally (insertAsPageIn state << RegisterPage)

loadResetPasswordPage : State -> Update State Msg a
loadResetPasswordPage state =
  resetPasswordPageInit
    |> mapCmd (PageMsg << ResetPasswordPageMsg)
    |> andFinally (insertAsPageIn state << ResetPasswordPage)

handleRouteChange : Maybe Route -> State -> Update State Msg a
handleRouteChange maybeRoute state =
  let authenticated = Maybe.isJust state.session
   in state |> case maybeRoute of
    Just Login ->
      if authenticated then redirect "/" else loadLoginPage
    Just Register ->
      if authenticated then redirect "/" else loadRegisterPage
    Just ResetPassword ->
      if authenticated then redirect "/" else loadResetPasswordPage
    Just Logout ->
      setSession Nothing
        >> andThen updateSessionStorage
        >> andThen (redirect "/")
    Nothing ->
      save
    ---------------------------------
    -- Anything else is restricted --
    ---------------------------------
    Just route ->
      case state.session of
        Nothing ->
          redirect "/login"
        Just session ->
          authenticatedRoute session route

updateRouterWith : RouterMsg -> State -> Update State Msg a
updateRouterWith msg state =
  state.router
    |> routerUpdate { onRouteChange = handleRouteChange } msg
    |> mapCmd RouterMsg
    |> andFinally (insertAsRouterIn state)

handleNotificationsFetched : List Notification -> State -> Update State Msg a
handleNotificationsFetched notifications state =
  state
    |> setNotifications notifications
    |> andThen updateSessionStorage

updateUiWith : UiMsg -> State -> Update State Msg a
updateUiWith msg state =
  state.ui
    |> uiUpdate { onNotificationsFetched = handleNotificationsFetched } msg
    |> mapCmd UiMsg
    |> andFinally (insertAsUiIn state)

updateSessionStorage : State -> Update State Msg a
updateSessionStorage ({ session } as state) =
  state |> case session of
    Nothing ->
      runCmd (Ports.clearSession ())
    Just session_ ->
      runCmd (Ports.setSession session_)

handleAuthResponse : Maybe Session -> State -> Update State Msg a
handleAuthResponse maybeSession state =
  state
    |> setSession maybeSession
    |> andThen updateSessionStorage
    |> andThenIf (Maybe.isJust maybeSession) (redirect "/")

handleProfileUpdated : User -> State -> Update State Msg a
handleProfileUpdated user state =
  state |> case state.session of
    Nothing ->
      save
    Just session ->
      setSession (Just { session | user = user })
        >> andThen updateSessionStorage
        >> andThen (redirect "/")

handleProjectSelected : Project -> State -> Update State Msg a
handleProjectSelected project state =
  state
    |> setWorkingProject project
    |> andThen updateSessionStorage
    |> andThen (updateUiWith FetchNotifications)
    |> andThen (redirect "/")

pageUpdate : PageMsg -> State -> Update State Msg a
pageUpdate msg ({ page } as state) =
  case page of
    LoginPage loginPageState ->
      case msg of
        LoginPageMsg loginPageMsg ->
          loginPageState
            |> loginPageUpdate { onAuthResponse = handleAuthResponse } loginPageMsg
            |> mapCmd (PageMsg << LoginPageMsg)
            |> andFinally (insertAsPageIn state << LoginPage)
        _ ->
          save state
    RegisterPage registerPageState ->
      case msg of
        RegisterPageMsg registerPageMsg ->
          registerPageState
            |> registerPageUpdate registerPageMsg
            |> mapCmd (PageMsg << RegisterPageMsg)
            |> andFinally (insertAsPageIn state << RegisterPage)
        _ ->
          save state
    SelectProjectPage selectProjectPageState ->
      case msg of
        SelectProjectPageMsg selectProjectPageMsg ->
          selectProjectPageState
            |> selectProjectPageUpdate { onProjectSelected = handleProjectSelected } selectProjectPageMsg
            |> mapCmd (PageMsg << SelectProjectPageMsg)
            |> andFinally (insertAsPageIn state << SelectProjectPage)
        _ ->
          save state
    ResetPasswordPage resetPasswordPageState ->
      case msg of
        ResetPasswordPageMsg resetPasswordPageMsg ->
          resetPasswordPageState
            |> resetPasswordPageUpdate resetPasswordPageMsg
            |> mapCmd (PageMsg << ResetPasswordPageMsg)
            |> andFinally (insertAsPageIn state << ResetPasswordPage)
        _ ->
          save state
    ProfilePage profilePageState ->
      case msg of
        ProfilePageMsg profilePageMsg ->
          profilePageState
            |> profilePageUpdate { onProfileUpdated = handleProfileUpdated } profilePageMsg
            |> mapCmd (PageMsg << ProfilePageMsg)
            |> andFinally (insertAsPageIn state << ProfilePage)
        _ ->
          save state
    NewProjectPage newProjectPageState ->
      case msg of
        NewProjectPageMsg newProjectPageMsg ->
          newProjectPageState
            |> newProjectPageUpdate { onNewProject = handleProjectSelected } newProjectPageMsg
            |> mapCmd (PageMsg << NewProjectPageMsg)
            |> andFinally (insertAsPageIn state << NewProjectPage)
        _ ->
          save state
    ProjectHomePage projectHomePageState ->
      case msg of
        ProjectHomePageMsg projectHomePageMsg ->
          projectHomePageState
            |> projectHomePageUpdate projectHomePageMsg
            |> mapCmd (PageMsg << ProjectHomePageMsg)
            |> andFinally (insertAsPageIn state << ProjectHomePage)
        _ ->
          save state
    ProjectSettingsPage projectSettingsPageState ->
      case msg of
        ProjectSettingsPageMsg projectSettingsPageMsg ->
          projectSettingsPageState
            |> projectSettingsPageUpdate projectSettingsPageMsg
            |> mapCmd (PageMsg << ProjectSettingsPageMsg)
            |> andFinally (insertAsPageIn state << ProjectSettingsPage)
        _ ->
          save state
    NoPage ->
      save state

update : Msg -> State -> Update State Msg a
update msg state =
  state |> case msg of
    RouterMsg routerMsg ->
      updateRouterWith routerMsg
    UiMsg uiMsg ->
      updateUiWith uiMsg
    PageMsg pageMsg ->
      pageUpdate pageMsg

pageSubscriptions : Page -> (PageMsg -> msg) -> Sub msg
pageSubscriptions page msg =
  case page of
    NoPage ->
      Sub.none
    LoginPage loginPageState ->
      loginPageSubscriptions loginPageState (msg << LoginPageMsg)
    RegisterPage registerPageState ->
      registerPageSubscriptions registerPageState (msg << RegisterPageMsg)
    SelectProjectPage selectProjectPageState ->
      selectProjectPageSubscriptions selectProjectPageState (msg << SelectProjectPageMsg)
    ResetPasswordPage resetPasswordPageState ->
      resetPasswordPageSubscriptions resetPasswordPageState (msg << ResetPasswordPageMsg)
    ProfilePage profilePageState ->
      profilePageSubscriptions profilePageState (msg << ProfilePageMsg)
    NewProjectPage newProjectPageState ->
      newProjectPageSubscriptions newProjectPageState (msg << NewProjectPageMsg)
    ProjectHomePage projectHomePageState ->
      projectHomePageSubscriptions projectHomePageState (msg << ProjectHomePageMsg)
    ProjectSettingsPage projectSettingsPageState ->
      projectSettingsPageSubscriptions projectSettingsPageState (msg << ProjectSettingsPageMsg)

subscriptions : State -> Sub Msg
subscriptions { ui, router, page } =
  Sub.batch
    [ pageSubscriptions page PageMsg
    , uiSubscriptions ui UiMsg
    , routerSubscriptions router RouterMsg ]

pageView : UiState -> Maybe Session -> Page -> Html Msg
pageView ui session page =
  case session of
    Nothing ->
      case page of
        LoginPage loginPageState ->
          div [ class "bg-primary", style "min-height" "100vh" ]
            [ div [ container ]
              [ div [ class "row justify-content-center" ]
                [ div [ class "col-md-10" ]
                  [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                    [ div [ class "card-body p-0" ]
                      [ div [ class "row" ]
                        [ div [ style "min-height" "600px", style "background-image" "url(/img/bg-register.jpg)"
                              , class "col-lg-6 d-none d-lg-block bg-register-image" ] []
                        , div [ class "col-lg-6" ]
                          [ div [ class "p-5" ]
                            [ loginPageView loginPageState (PageMsg << LoginPageMsg) ] ] ] ] ] ] ] ] ]

        RegisterPage registerPageState ->
          div [ class "bg-success", style "min-height" "100vh" ]
            [ div [ container ]
              [ div [ class "row justify-content-center" ]
                [ div [ class "col-lg-8 col-xl-6" ]
                  [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                    [ div [ class "card-body p-0" ]
                      [ div [ class "row" ]
                        [ div [ class "col-lg-12" ]
                          [ div [ class "p-5" ]
                            [ registerPageView registerPageState (PageMsg << RegisterPageMsg) ] ] ] ] ] ] ] ] ]

        ResetPasswordPage resetPasswordPageState ->
          div [ class "bg-success", style "min-height" "100vh" ]
            [ div [ container ]
              [ div [ class "row justify-content-center" ]
                [ div [ class "col-lg-6 col-xl-5" ]
                  [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                    [ div [ class "card-body p-0" ]
                      [ div [ class "row" ]
                        [ div [ class "col-lg-12" ]
                          [ div [ class "p-5" ]
                            [ resetPasswordPageView resetPasswordPageState (PageMsg << ResetPasswordPageMsg) ] ] ] ] ] ] ] ] ]

        _ ->
          text ""
    Just session_ ->
      case session_.project of
        Nothing ->
          case page of
            NewProjectPage { project, form, sent } ->
              div [ class "bg-success", style "min-height" "100vh" ]
                [ div [ container ]
                  [ div [ class "row justify-content-center" ]
                    [ div [ class "col-lg-6 col-xl-5" ]
                      [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                        [ div [ class "card-body p-0" ]
                          [ div [ class "row" ]
                            [ div [ class "col-lg-12" ]
                              [ div [ class "p-5" ]
                                [ div [ class "text-center" ]
                                  [ i [ style "font-size" "64px", class "fas fa-rocket mb-3" ] []
                                  , h2 [ class "text-gray-900 mb-4" ] [ text "New project" ] ]
                                , newProjectPageError project.resource
                                , newProjectFormView form sent (PageMsg << NewProjectPageMsg << NewProjectFormMsg)
                                , ButtonGroup.toolbar []
                                    [ ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [] ]
                                      [ ButtonGroup.button [ Button.primary
                                                           , Button.onClick (PageMsg (NewProjectPageMsg (NewProjectFormMsg Form.Submit)))
                                                           , Button.disabled sent ]
                                        [ text (if sent then "Please wait" else "Save") ] ]
                                    , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
                                      [ ButtonGroup.button [ Button.secondary
                                                           , Button.onClick (PageMsg (NewProjectPageMsg NewProjectPageFormCancel))
                                                           , Button.disabled sent ]
                                        [ text "Cancel" ] ] ] ]
                              ] ] ] ] ] ] ] ]

            SelectProjectPage selectProjectPageState ->
              div [ class "bg-success", style "min-height" "100vh" ]
                [ div [ container ]
                  [ div [ class "row justify-content-center" ]
                    [ div [ class "col-lg-8" ]
                      [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                        [ div [ class "card-body p-0" ]
                          [ div [ class "row" ]
                            [ div [ class "col-lg-12" ]
                              [ div [ class "p-5" ]
                                [ div [ class "text-center" ]
                                  [ i [ style "font-size" "64px", class "fas fa-comments", class "mb-3" ] []
                                  , h2 [ class "text-gray-900", class "mb-4" ] [ text "Choose your project" ] ]
                                  , selectProjectPageView selectProjectPageState (PageMsg << SelectProjectPageMsg)
                                  , Button.linkButton [ Button.small, Button.block, Button.primary, Button.attrs [ href "/projects/new" ] ] [ text "Create a new project" ]
                                  , hr [] []
                                  , div [ class "text-center" ]
                                      [ a [ href "/profile" ] [ text "Profile" ]
                                      , span [ class "mx-2" ] [ text "|" ]
                                      , a [ href "/logout" ] [ text "Log out" ]
                                          ] ] ] ] ] ] ] ] ] ]

            ProfilePage { user, form, sent } ->
              div [ class "bg-success", style "min-height" "100vh" ]
                [ div [ container ]
                  [ div [ class "row justify-content-center" ]
                    [ div [ class "col-lg-6 col-xl-5" ]
                      [ div [ class "card o-hidden border-0 shadow-sm my-5" ]
                        [ div [ class "card-body p-0" ]
                          [ div [ class "row" ]
                            [ div [ class "col-lg-12" ]
                              [ div [ class "p-5" ]
                                [ div [ class "text-center" ]
                                  [ i [ style "font-size" "64px", class "fas fa-user", class "mb-3" ] []
                                  , h2 [ class "text-gray-900", class "mb-4" ] [ text "User profile" ] ]
                                  , profilePageError user.resource
                                , profileFormView form sent (PageMsg << ProfilePageMsg << ProfileFormMsg)
                                , ButtonGroup.toolbar []
                                  [ ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [] ]
                                    [ ButtonGroup.button [ Button.primary
                                                         , Button.onClick (PageMsg (ProfilePageMsg (ProfileFormMsg Form.Submit)))
                                                         , Button.disabled sent ]
                                      [ text (if sent then "Please wait" else "Save") ] ]
                                  , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
                                    [ ButtonGroup.button [ Button.secondary
                                                         , Button.onClick (PageMsg (ProfilePageMsg ProfilePageFormCancel))
                                                         , Button.disabled sent ]
                                      [ text "Cancel" ] ] ] ] ] ] ] ] ] ] ] ] 

            _ ->
              text ""
        Just project_ ->
          projectLayout session_.user ui <| case page of
            ProjectHomePage projectHomePageState ->
              div []
                [ h2 [ class "text-gray-900", class "mb-4" ] [ text project_.name ]
                , projectHomePageView projectHomePageState (PageMsg << ProjectHomePageMsg) ]
            ProjectSettingsPage projectSettingsPageState ->
              div [ style "max-width" "640px" ]
                [ h2 [ class "text-gray-900", class "mb-4" ] [ text "Settings" ] ]
            NewProjectPage { project, form, sent } ->
              div [ style "max-width" "640px" ]
                [ h2 [ class "text-gray-900", class "mb-4" ] [ text "New project" ]
                , newProjectPageError project.resource
                , newProjectFormView form sent (PageMsg << NewProjectPageMsg << NewProjectFormMsg)
                , ButtonGroup.toolbar []
                    [ ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [] ]
                      [ ButtonGroup.button [ Button.primary
                                           , Button.onClick (PageMsg (NewProjectPageMsg (NewProjectFormMsg Form.Submit)))
                                           , Button.disabled sent ]
                        [ text (if sent then "Please wait" else "Save") ] ]
                    , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
                      [ ButtonGroup.button [ Button.secondary
                                           , Button.onClick (PageMsg (NewProjectPageMsg NewProjectPageFormCancel))
                                           , Button.disabled sent ]
                        [ text "Cancel" ] ] ] ]
            SelectProjectPage selectProjectPageState ->
              div [ style "max-width" "800px" ]
                [ h2 [ class "text-gray-900", class "mb-4" ] [ text "Select a project" ]
                , selectProjectPageView selectProjectPageState (PageMsg << SelectProjectPageMsg) ]
            ProfilePage { user, form, sent } ->
              div [ style "max-width" "640px" ]
                [ h2 [ class "text-gray-900", class "mb-4" ] [ text "User profile" ]
                , profilePageError user.resource
                , profileFormView form sent (PageMsg << ProfilePageMsg << ProfileFormMsg)
                , ButtonGroup.toolbar []
                    [ ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [] ]
                      [ ButtonGroup.button [ Button.primary
                                           , Button.onClick (PageMsg (ProfilePageMsg (ProfileFormMsg Form.Submit)))
                                           , Button.disabled sent ]
                        [ text (if sent then "Please wait" else "Save") ] ]
                    , ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
                      [ ButtonGroup.button [ Button.secondary
                                           , Button.onClick (PageMsg (ProfilePageMsg ProfilePageFormCancel))
                                           , Button.disabled sent ]
                        [ text "Cancel" ] ] ] ]
            _ ->
              text ""

view : State -> Document Msg
view ({ ui, session, page } as state) =
  { title = ""
  , body =
    [ pageView ui session page
    ] }
    --, text (Debug.toString state) ] }

main : Program Flags State Msg
main =
  Update.Deep.Browser.application
    { init          = init
    , update        = update
    , subscriptions = subscriptions
    , view          = view
    , onUrlChange   = RouterMsg << UrlChange
    , onUrlRequest  = RouterMsg << UrlRequest }
