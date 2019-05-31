'use strict';

var xhook = require('./js/xhook.min.js');

var users =
[
  {
    id: 1,
    name: 'Uliza Minelli',
    password: 'test',
    email: 'uliza@uliza.fm',
    login: 'test',
    phoneNumber: null,
    organization: null,
    country: 'UG',
    rememberMe: false
  }
];

var projects =
[
  {
    id: 1,
    name: 'Bee’s knees',
    country: 'UG'
  },
  {
    id: 2,
    name: 'Aquaculture 101',
    country: 'UG'
  },
  {
    id: 3,
    name: 'The apocalypse',
    country: 'ET'
  },
  {
    id: 4,
    name: 'Project Apollo',
    country: 'GH'
  }
];

var delay = 600; // 800; //2300;

xhook.before(function(request, callback) {
  if (request.url.endsWith('auth/login') && 'POST' === request.method) {
    setTimeout(function() {
      var params = JSON.parse(request.body);
      var filtered = users.filter(function(user) {
        return user.login === params.login && user.password === params.password;
      });
      if (filtered.length > 0) {
        var user = filtered[0];
        user.token = 'fake-jwt-token';
        user.rememberMe = params.rememberMe;
        callback({
          status: 200,
          data: JSON.stringify({ 
            session: {
              user: user,
              project: null,
              notifications: []
            }
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.log('401 Unauthorized');
        callback({
          status: 401,
          data: JSON.stringify({ error: 'Unauthorized' }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, delay);
  } else if (request.url.endsWith('notifications') && 'GET' === request.method) {
    setTimeout(function() {
      callback({
        status: 201,
        data: JSON.stringify({  
          notifications: [{
            id: 1,
            message: 'Welcome to Farm Radio Interactive. This is a prototype, so don’t get too excited!',
            time: (new Date()).getTime()
          }]
        }), headers: { 'Content-Type': 'application/json' }
      });
    }, (delay/2));
  } else if (request.url.endsWith('auth/reset_password') && 'POST' === request.method) {
    setTimeout(function() {
      console.log('error 501');
      callback({
        status: 501,
        data: JSON.stringify({ error: 'Not Implemented' }), headers: { 'Content-Type': 'application/json' }
      });
    }, delay);
  } else if (request.url.endsWith('users') && 'POST' === request.method) {
    setTimeout(function() {
      console.log('error 501');
      callback({
        status: 501,
        data: JSON.stringify({ error: 'Not Implemented' }), headers: { 'Content-Type': 'application/json' }
      });
    }, delay);
  } else if (/users\/\d+$/.test(request.url) && 'PUT' === request.method) {
    var id = request.url.match(/users\/(\d+)$/)[1];
    setTimeout(function() {
      var body = JSON.parse(request.body);
      console.log(body);
      var filtered = users.filter(function(item) { return item.id == id; });
      if (filtered.length > 0) {
        var user = filtered[0];
        user.name = body.name;
        user.organization = body.organization;
        user.phoneNumber = body.phoneNumber;
        user.country = body.country;
        console.log(users);
        callback({
          status: 200,
          data: JSON.stringify({ user: user }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        callback({
          status: 404,
          data: JSON.stringify({ error: 'Not Found' }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, delay);
  } else if (request.url.endsWith('projects') && 'GET' === request.method) {
    setTimeout(function() {
      callback({
        status: 200,
        data: JSON.stringify({ projects: projects }),
        headers: { 'Content-Type': 'application/json' }
      });
    }, delay);
  } else if (request.url.endsWith('projects') && 'POST' === request.method) {
    setTimeout(function() {
      var project = JSON.parse(request.body);
      project.id = projects.length + 1;
      projects.push(project);
      callback({
        status: 200,
        data: JSON.stringify({ project: project }),
        headers: { 'Content-Type': 'application/json' }
      });
    }, delay);
  } else if (/projects\/\d+$/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      var id = request.url.match(/projects\/(\d+)$/)[1];
      var filtered = projects.filter(function(item) { return item.id == id; });
      if (filtered.length > 0) {
        callback({
          status: 200,
          data: JSON.stringify({ project: filtered[0] }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.log('Not Found');
        callback({
          status: 404,
          data: JSON.stringify({ error: 'Not Found' }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, delay);
  }
});

module.exports.projects = projects;
