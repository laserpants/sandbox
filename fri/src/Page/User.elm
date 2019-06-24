module Page.User exposing (Msg(..), Page(..))

import Page.User.Login as Login
import Page.User.Profile as Profile
import Page.User.Register as Register
import Page.User.ResetPassword as ResetPassword


type Msg
    = LoginPageMsg Login.Msg
    | RegisterPageMsg Register.Msg
    | ProfilePageMsg Profile.Msg
    | ResetPasswordPageMsg ResetPassword.Msg


type Page
    = LoginPage Login.State
    | RegisterPage Register.State
    | ProfilePage Profile.State
    | ResetPasswordPage ResetPassword.State
