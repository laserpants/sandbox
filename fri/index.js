'use strict';

require('./index.html');
var api = require('./api.js');

var Elm = require('./src/Main.elm').Elm;

var storageKey = 'farm-radio-interactive-session';

var session = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);

var app = Elm.Main.init({
  node: document.getElementById('elm-code'),
  flags: {
    api: process.env.API_URL || 'http://localhost:4000',
    session: session || ''
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

if (app.ports && app.ports.websocketOut && app.ports.websocketIn) {
  app.ports.websocketOut.subscribe(function(data) {
    var message = JSON.parse(data);
    if ('search_projects' === message.type) {
      var filtered = api.projects.filter(function(project) {
        return -1 !== project.name.toLowerCase().indexOf(message.query.toLowerCase());
      });
      console.log(filtered);
      app.ports.websocketIn.send(JSON.stringify({
        type: 'search_projects_results',
        query: message.query,
        results: filtered
      }));
    }
  });
}
