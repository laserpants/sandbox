'use strict';

require('./index.html');
var api = require('./api.js');

var Elm = require('./src/Main.elm').Elm;

var storageKey = 'farm-radio-interactive-session';

var session = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);

var app = Elm.Main.init({
  node: document.getElementById('elm-code'),
  flags: {
    session: session || '',
    basePath: process.env.BASE_PATH || '',
    apiUrl: process.env.API_URL || 'http://localhost:4000'
  }
});

if (app.ports && app.ports.setSession) {
  app.ports.setSession.subscribe(function(data) {
    var api = data.user.rememberMe ? localStorage : sessionStorage;
    api.setItem(storageKey, JSON.stringify(data));
  });
}

if (app.ports && app.ports.clearSession) {
  app.ports.clearSession.subscribe(function(data) {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  });
}

function wsSearchResponse(collection, resource, prop, message) {
  var filtered = collection.filter(function(item) {
    return -1 !== item[prop].toLowerCase().indexOf(message.query.toLowerCase());
  });
  app.ports.websocketIn.send(JSON.stringify({
    type: resource + '_search_response',
    query: message.query,
    results: filtered
  }));
}

if (app.ports && app.ports.websocketOut && app.ports.websocketIn) {
  app.ports.websocketOut.subscribe(function(data) {
    var message = JSON.parse(data);
    if ('login_available_query' === message.type) {
      setTimeout(function() {
        var logins = ['bob', 'laserpants', 'neo', 'neonpants', 'admin', 'speedo'];
        var response = {
          type: 'login_available_response',
          login: message.login,
          available: (-1 === logins.indexOf(message.login))
        };
        app.ports.websocketIn.send(JSON.stringify(response));
      }, 300);
    } else if ('listener_audio_search_query' === message.type) {
      wsSearchResponse(api.listenerAudio, 'listener_audio', 'phoneNumber', message);
    } else if ('text_content_search_query' === message.type) {
      wsSearchResponse(api.textContent, 'text_content', 'title', message);
    } else if ('audio_content_search_query' === message.type) {
      wsSearchResponse(api.audioContent, 'audio_content', 'title', message);
    } else if ('projects_search_query' === message.type) {
      wsSearchResponse(api.projects, 'projects', 'name', message);
    } else if ('campaigns_search_query' === message.type) {
      wsSearchResponse(api.campaigns, 'campaigns', 'name', message);
    } else if ('audience_search_query' === message.type) {
      wsSearchResponse(api.audience, 'audience', 'name', message);
    }
  });
}
