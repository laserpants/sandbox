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

var campaigns =
[
  {
    id: 1,
    name: 'Campaign #1',
    description: 'This is a campaign'
  },
  {
    id: 2,
    name: 'Campaign #2',
    description: 'This is a campaign'
  },
  {
    id: 3,
    name: 'Campaign #3',
    description: 'This is a campaign'
  },
  {
    id: 4,
    name: 'Campaign #4',
    description: 'This is a campaign'
  },
  {
    id: 5,
    name: 'Campaign #5',
    description: 'This is a campaign'
  },
  {
    id: 6,
    name: 'Campaign #6',
    description: 'This is a campaign'
  }
];

var projects =
[
  {
    id: 1,
    name: 'Fall Armyworm Awareness',
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

var audioContent =
[
  {
    id: 1,
    title: 'Fall Armyworm Awareness'
  },
  {
    id: 2,
    title: 'Aquaculture 101'
  },
  {
    id: 3,
    title: 'The apocalypse'
  },
  {
    id: 4,
    title: 'Project Apollo'
  }
];

var textContent =
[
  {
    id: 1,
    title: 'Fall Armyworm Awareness'
  },
  {
    id: 2,
    title: 'Aquaculture 101'
  },
  {
    id: 3,
    title: 'The apocalypse'
  },
  {
    id: 4,
    title: 'Project Apollo'
  }
];

var audience =
[
  {
    id: 1,
    name: 'Listener #1'
  },
  {
    id: 2,
    name: 'Listener #2'
  },
  {
    id: 3,
    name: 'Listener #3'
  },
  {
    id: 4,
    name: 'Listener #4'
  }
];

var listenerAudio =
[
  {
    id: 1,
    phoneNumber: '25682827645' 
  },
  {
    id: 2,
    phoneNumber: '25676458282' 
  },
  {
    id: 3,
    phoneNumber: '46727358682' 
  },
  {
    id: 4,
    phoneNumber: '25407333777' 
  }
];

var delay = 600; // 800; //2300;

function pagedRequest(collection, key, request, callback) {
  var search = request.url.split('?')[1] || '',
    params = new URLSearchParams(search),
    offset = Number(params.get('offset') || 0),
    limit = Number(params.get('limit') || 20),
    data = { 
      total: collection.length 
    };
  data[key] = collection.slice(offset, offset + limit);
  callback({
    status: 200,
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
}

xhook.before(function(request, callback) {

  console.log(request.url);

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
              notifications: [],
              locale: 'en-us'
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
  } else if (/listener-audio/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      pagedRequest(listenerAudio, 'listenerAudio', request, callback);
    }, delay);
  } else if (/content\/text/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      pagedRequest(textContent, 'text', request, callback);
    }, delay);
  } else if (/content\/audio/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      pagedRequest(audioContent, 'audio', request, callback);
    }, delay);
  } else if (/campaigns/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      pagedRequest(campaigns, 'campaigns', request, callback);
    }, delay);
  } else if (/audience/.test(request.url) && 'GET' === request.method) {
    setTimeout(function() {
      pagedRequest(audience, 'audience', request, callback);
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
module.exports.campaigns = campaigns;
module.exports.audience = audience;
module.exports.audioContent = audioContent;
module.exports.textContent = textContent;
module.exports.listenerAudio = listenerAudio;
