/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./api.js":
/*!****************!*\
  !*** ./api.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar xhook = __webpack_require__(/*! ./js/xhook.min.js */ \"./js/xhook.min.js\");\n\nvar users =\n[\n  {\n    id: 1,\n    name: 'Uliza Minelli',\n    password: 'test',\n    email: 'uliza@uliza.fm',\n    login: 'test',\n    phoneNumber: null,\n    organization: null,\n    country: 'UG',\n    rememberMe: false\n  }\n];\n\nvar projects =\n[\n  {\n    id: 1,\n    name: 'Bee’s knees',\n    country: 'UG'\n  },\n  {\n    id: 2,\n    name: 'Aquaculture 101',\n    country: 'UG'\n  },\n  {\n    id: 3,\n    name: 'The apocalypse',\n    country: 'ET'\n  },\n  {\n    id: 4,\n    name: 'Project Apollo',\n    country: 'GH'\n  }\n];\n\nvar delay = 600; // 800; //2300;\n\nxhook.before(function(request, callback) {\n  if (request.url.endsWith('auth/login') && 'POST' === request.method) {\n    setTimeout(function() {\n      var params = JSON.parse(request.body);\n      var filtered = users.filter(function(user) {\n        return user.login === params.login && user.password === params.password;\n      });\n      if (filtered.length > 0) {\n        var user = filtered[0];\n        user.token = 'fake-jwt-token';\n        user.rememberMe = params.rememberMe;\n        callback({\n          status: 200,\n          data: JSON.stringify({ \n            session: {\n              user: user,\n              project: null,\n              notifications: []\n            }\n          }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      } else {\n        console.log('401 Unauthorized');\n        callback({\n          status: 401,\n          data: JSON.stringify({ error: 'Unauthorized' }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      }\n    }, delay);\n  } else if (request.url.endsWith('notifications') && 'GET' === request.method) {\n    setTimeout(function() {\n      callback({\n        status: 201,\n        data: JSON.stringify({  \n          notifications: [{\n            id: 1,\n            message: 'Welcome to Farm Radio Interactive. This is a prototype, so don’t get too excited!',\n            time: (new Date()).getTime()\n          }]\n        }), headers: { 'Content-Type': 'application/json' }\n      });\n    }, (delay/2));\n  } else if (request.url.endsWith('auth/reset_password') && 'POST' === request.method) {\n    setTimeout(function() {\n      console.log('error 501');\n      callback({\n        status: 501,\n        data: JSON.stringify({ error: 'Not Implemented' }), headers: { 'Content-Type': 'application/json' }\n      });\n    }, delay);\n  } else if (request.url.endsWith('users') && 'POST' === request.method) {\n    setTimeout(function() {\n      console.log('error 501');\n      callback({\n        status: 501,\n        data: JSON.stringify({ error: 'Not Implemented' }), headers: { 'Content-Type': 'application/json' }\n      });\n    }, delay);\n  } else if (/users\\/\\d+$/.test(request.url) && 'PUT' === request.method) {\n    var id = request.url.match(/users\\/(\\d+)$/)[1];\n    setTimeout(function() {\n      var body = JSON.parse(request.body);\n      console.log(body);\n      var filtered = users.filter(function(item) { return item.id == id; });\n      if (filtered.length > 0) {\n        var user = filtered[0];\n        user.name = body.name;\n        user.organization = body.organization;\n        user.phoneNumber = body.phoneNumber;\n        user.country = body.country;\n        console.log(users);\n        callback({\n          status: 200,\n          data: JSON.stringify({ user: user }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      } else {\n        callback({\n          status: 404,\n          data: JSON.stringify({ error: 'Not Found' }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      }\n    }, delay);\n  } else if (request.url.endsWith('projects') && 'GET' === request.method) {\n    setTimeout(function() {\n      callback({\n        status: 200,\n        data: JSON.stringify({ projects: projects }),\n        headers: { 'Content-Type': 'application/json' }\n      });\n    }, delay);\n  } else if (request.url.endsWith('projects') && 'POST' === request.method) {\n    setTimeout(function() {\n      var project = JSON.parse(request.body);\n      project.id = projects.length + 1;\n      projects.push(project);\n      callback({\n        status: 200,\n        data: JSON.stringify({ project: project }),\n        headers: { 'Content-Type': 'application/json' }\n      });\n    }, delay);\n  } else if (/projects\\/\\d+$/.test(request.url) && 'GET' === request.method) {\n    setTimeout(function() {\n      var id = request.url.match(/projects\\/(\\d+)$/)[1];\n      var filtered = projects.filter(function(item) { return item.id == id; });\n      if (filtered.length > 0) {\n        callback({\n          status: 200,\n          data: JSON.stringify({ project: filtered[0] }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      } else {\n        console.log('Not Found');\n        callback({\n          status: 404,\n          data: JSON.stringify({ error: 'Not Found' }),\n          headers: { 'Content-Type': 'application/json' }\n        });\n      }\n    }, delay);\n  }\n});\n\nmodule.exports.projects = projects;\n\n\n//# sourceURL=webpack:///./api.js?");

/***/ }),

/***/ "./index.html":
/*!********************!*\
  !*** ./index.html ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"index.html\";\n\n//# sourceURL=webpack:///./index.html?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(process) {\n\n__webpack_require__(/*! ./index.html */ \"./index.html\");\n__webpack_require__(/*! ./api.js */ \"./api.js\");\n\nvar Elm = __webpack_require__(/*! ./src/Main.elm */ \"./src/Main.elm\").Elm;\n\nvar storageKey = 'farm-radio-interactive-session';\n\nvar session = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);\n\nvar app = Elm.Main.init({\n  node: document.getElementById('elm-code'),\n  flags: {\n    session: session || '',\n    basePath: process.env.BASE_PATH || '',\n    api: process.env.API_URL || 'http://localhost:4000'\n  }\n});\n\nif (app.ports && app.ports.setSession) {\n  app.ports.setSession.subscribe(function(data) {\n    var api = data.user.rememberMe ? localStorage : sessionStorage;\n    api.setItem(storageKey, JSON.stringify(data));\n  });\n}\n\nif (app.ports && app.ports.clearSession) {\n  app.ports.clearSession.subscribe(function(data) {\n    localStorage.removeItem(storageKey);\n    sessionStorage.removeItem(storageKey);\n  });\n}\n\nif (app.ports && app.ports.websocketOut && app.ports.websocketIn) {\n  app.ports.websocketOut.subscribe(function(data) {\n    var message = JSON.parse(data);\n    if ('username_available_query' === message.type) {\n      setTimeout(function() {\n        var usernames = ['bob', 'laserpants', 'neo', 'neonpants', 'admin', 'speedo'];\n        var response = {\n          type: 'username_available_response',\n          username: message.username,\n          available: (-1 === usernames.indexOf(message.username))\n        };\n        app.ports.websocketIn.send(JSON.stringify(response));\n      }, 300);\n    } else if ('projects_search_query' === message.type) {\n      var filtered = api.projects.filter(function(project) {\n        return -1 !== project.name.toLowerCase().indexOf(message.query.toLowerCase());\n      });\n      console.log(filtered);\n      app.ports.websocketIn.send(JSON.stringify({\n        type: 'projects_search_response',\n        query: message.query,\n        results: filtered\n      }));\n    }\n  });\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/process/browser.js */ \"./node_modules/process/browser.js\")))\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./js/xhook.min.js":
/*!*************************!*\
  !*** ./js/xhook.min.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// XHook - v1.4.9 - https://github.com/jpillora/xhook\n// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2018\n(function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H=[].indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};q=null,q=\"undefined\"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:\"undefined\"!=typeof global?global:a,x=q.document,d=\"before\",c=\"after\",o=\"readyState\",n=\"addEventListener\",m=\"removeEventListener\",h=\"dispatchEvent\",u=\"XMLHttpRequest\",g=\"fetch\",i=\"FormData\",p=[\"load\",\"loadend\",\"loadstart\"],e=[\"progress\",\"abort\",\"error\",\"timeout\"],E=\"undefined\"!=typeof navigator&&navigator.useragent?navigator.userAgent:\"\",A=parseInt((/msie (\\d+)/.exec(E.toLowerCase())||[])[1]),isNaN(A)&&(A=parseInt((/trident\\/.*; rv:(\\d+)/.exec(E.toLowerCase())||[])[1])),(G=Array.prototype).indexOf||(G.indexOf=function(a){var b,c,d,e;for(b=d=0,e=this.length;d<e;b=++d)if(c=this[b],c===a)return b;return-1}),D=function(a,b){return Array.prototype.slice.call(a,b)},w=function(a){return\"returnValue\"===a||\"totalSize\"===a||\"position\"===a},z=function(a,b){var c;for(c in a)if(a[c],!w(c))try{b[c]=a[c]}catch(a){}return b},B=function(a){return void 0===a?null:a},C=function(a,b,c){var d,e,f,g;for(e=function(a){return function(d){var e,f,g;e={};for(f in d)w(f)||(g=d[f],e[f]=g===b?c:g);return c[h](a,e)}},f=0,g=a.length;f<g;f++)d=a[f],c._has(d)&&(b[\"on\"+d]=e(d))},y=function(a){var b;if(x&&null!=x.createEventObject)return b=x.createEventObject(),b.type=a,b;try{return new Event(a)}catch(b){return{type:a}}},f=function(a){var c,d,e;return d={},e=function(a){return d[a]||[]},c={},c[n]=function(a,c,f){d[a]=e(a),d[a].indexOf(c)>=0||(f=f===b?d[a].length:f,d[a].splice(f,0,c))},c[m]=function(a,c){var f;if(a===b)return void(d={});c===b&&(d[a]=[]),f=e(a).indexOf(c),f!==-1&&e(a).splice(f,1)},c[h]=function(){var b,d,f,g,h,i,j,k;for(b=D(arguments),d=b.shift(),a||(b[0]=z(b[0],y(d))),g=c[\"on\"+d],g&&g.apply(c,b),k=e(d).concat(e(\"*\")),f=i=0,j=k.length;i<j;f=++i)h=k[f],h.apply(c,b)},c._has=function(a){return!(!d[a]&&!c[\"on\"+a])},a&&(c.listeners=function(a){return D(e(a))},c.on=c[n],c.off=c[m],c.fire=c[h],c.once=function(a,b){var d;return d=function(){return c.off(a,d),b.apply(null,arguments)},c.on(a,d)},c.destroy=function(){return d={}}),c},F=f(!0),F.EventEmitter=f,F[d]=function(a,b){if(a.length<1||a.length>2)throw\"invalid hook\";return F[n](d,a,b)},F[c]=function(a,b){if(a.length<2||a.length>3)throw\"invalid hook\";return F[n](c,a,b)},F.enable=function(){q[u]=t,\"function\"==typeof r&&(q[g]=r),k&&(q[i]=s)},F.disable=function(){q[u]=F[u],q[g]=F[g],k&&(q[i]=k)},v=F.headers=function(a,b){var c,d,e,f,g,h,i,j,k;switch(null==b&&(b={}),typeof a){case\"object\":d=[];for(e in a)g=a[e],f=e.toLowerCase(),d.push(f+\":\\t\"+g);return d.join(\"\\n\")+\"\\n\";case\"string\":for(d=a.split(\"\\n\"),i=0,j=d.length;i<j;i++)c=d[i],/([^:]+):\\s*(.+)/.test(c)&&(f=null!=(k=RegExp.$1)?k.toLowerCase():void 0,h=RegExp.$2,null==b[f]&&(b[f]=h));return b}},k=q[i],s=function(a){var b;this.fd=a?new k(a):new k,this.form=a,b=[],Object.defineProperty(this,\"entries\",{get:function(){var c;return c=a?D(a.querySelectorAll(\"input,select\")).filter(function(a){var b;return\"checkbox\"!==(b=a.type)&&\"radio\"!==b||a.checked}).map(function(a){return[a.name,\"file\"===a.type?a.files:a.value]}):[],c.concat(b)}}),this.append=function(a){return function(){var c;return c=D(arguments),b.push(c),a.fd.append.apply(a.fd,c)}}(this)},k&&(F[i]=k,q[i]=s),l=q[u],F[u]=l,t=q[u]=function(){var a,b,g,i,j,k,l,m,q,r,t,w,x,y,D,E,G,I,J,K,L;a=-1,I=new F[u],t={},y=null,l=void 0,D=void 0,w=void 0,r=function(){var b,c,d,e;if(w.status=y||I.status,y===a&&A<10||(w.statusText=I.statusText),y!==a){e=v(I.getAllResponseHeaders());for(b in e)d=e[b],w.headers[b]||(c=b.toLowerCase(),w.headers[c]=d)}},q=function(){if(I.responseType&&\"text\"!==I.responseType)\"document\"===I.responseType?(w.xml=I.responseXML,w.data=I.responseXML):w.data=I.response;else{w.text=I.responseText,w.data=I.responseText;try{w.xml=I.responseXML}catch(a){}}\"responseURL\"in I&&(w.finalUrl=I.responseURL)},G=function(){k.status=w.status,k.statusText=w.statusText},E=function(){\"text\"in w&&(k.responseText=w.text),\"xml\"in w&&(k.responseXML=w.xml),\"data\"in w&&(k.response=w.data),\"finalUrl\"in w&&(k.responseURL=w.finalUrl)},i=function(a){for(;a>b&&b<4;)k[o]=++b,1===b&&k[h](\"loadstart\",{}),2===b&&G(),4===b&&(G(),E()),k[h](\"readystatechange\",{}),4===b&&(t.async===!1?g():setTimeout(g,0))},g=function(){l||k[h](\"load\",{}),k[h](\"loadend\",{}),l&&(k[o]=0)},b=0,x=function(a){var b,d;if(4!==a)return void i(a);b=F.listeners(c),(d=function(){var a;return b.length?(a=b.shift(),2===a.length?(a(t,w),d()):3===a.length&&t.async?a(t,w,d):d()):i(4)})()},k=t.xhr=f(),I.onreadystatechange=function(a){try{2===I[o]&&r()}catch(a){}4===I[o]&&(D=!1,r(),q()),x(I[o])},m=function(){l=!0},k[n](\"error\",m),k[n](\"timeout\",m),k[n](\"abort\",m),k[n](\"progress\",function(){b<3?x(3):k[h](\"readystatechange\",{})}),(\"withCredentials\"in I||F.addWithCredentials)&&(k.withCredentials=!1),k.status=0,L=e.concat(p);for(J=0,K=L.length;J<K;J++)j=L[J],k[\"on\"+j]=null;return k.open=function(a,c,d,e,f){b=0,l=!1,D=!1,t.headers={},t.headerNames={},t.status=0,w={},w.headers={},t.method=a,t.url=c,t.async=d!==!1,t.user=e,t.pass=f,x(1)},k.send=function(a){var b,c,f,g,h,i,j,l;for(l=[\"type\",\"timeout\",\"withCredentials\"],i=0,j=l.length;i<j;i++)c=l[i],f=\"type\"===c?\"responseType\":c,f in k&&(t[c]=k[f]);t.body=a,h=function(){var a,b,d,g,h,i;for(C(e,I,k),k.upload&&C(e.concat(p),I.upload,k.upload),D=!0,I.open(t.method,t.url,t.async,t.user,t.pass),h=[\"type\",\"timeout\",\"withCredentials\"],d=0,g=h.length;d<g;d++)c=h[d],f=\"type\"===c?\"responseType\":c,c in t&&(I[f]=t[c]);i=t.headers;for(a in i)b=i[a],a&&I.setRequestHeader(a,b);t.body instanceof s&&(t.body=t.body.fd),I.send(t.body)},b=F.listeners(d),(g=function(){var a,c;return b.length?(a=function(a){if(\"object\"==typeof a&&(\"number\"==typeof a.status||\"number\"==typeof w.status))return z(a,w),H.call(a,\"data\")<0&&(a.data=a.response||a.text),void x(4);g()},a.head=function(a){return z(a,w),x(2)},a.progress=function(a){return z(a,w),x(3)},c=b.shift(),1===c.length?a(c(t)):2===c.length&&t.async?c(t,a):a()):h()})()},k.abort=function(){y=a,D?I.abort():k[h](\"abort\",{})},k.setRequestHeader=function(a,b){var c,d;c=null!=a?a.toLowerCase():void 0,d=t.headerNames[c]=t.headerNames[c]||a,t.headers[d]&&(b=t.headers[d]+\", \"+b),t.headers[d]=b},k.getResponseHeader=function(a){var b;return b=null!=a?a.toLowerCase():void 0,B(w.headers[b])},k.getAllResponseHeaders=function(){return B(v(w.headers))},I.overrideMimeType&&(k.overrideMimeType=function(){return I.overrideMimeType.apply(I,arguments)}),I.upload&&(k.upload=t.upload=f()),k.UNSENT=0,k.OPENED=1,k.HEADERS_RECEIVED=2,k.LOADING=3,k.DONE=4,k.response=\"\",k.responseText=\"\",k.responseXML=null,k.readyState=0,k.statusText=\"\",k},\"function\"==typeof q[g]&&(j=q[g],F[g]=j,r=q[g]=function(a,b){var e,f,g;return null==b&&(b={headers:{}}),b.url=a,g=null,f=F.listeners(d),e=F.listeners(c),new Promise(function(a,c){var d,h,i,k,l;h=function(){return b.body instanceof s&&(b.body=b.body.fd),b.headers&&(b.headers=new Headers(b.headers)),g||(g=new Request(b.url,b)),z(b,g)},i=function(b){var c;return e.length?(c=e.shift(),2===c.length?(c(h(),b),i(b)):3===c.length?c(h(),b,i):i(b)):a(b)},d=function(b){var c;if(void 0!==b)return c=new Response(b.body||b.text,b),a(c),void i(c);k()},k=function(){var a;return f.length?(a=f.shift(),1===a.length?d(a(b)):2===a.length?a(h(),d):void 0):void l()},l=function(){return j(h()).then(function(a){return i(a)}).catch(function(a){return i(a),c(a)})},k()})}),t.UNSENT=0,t.OPENED=1,t.HEADERS_RECEIVED=2,t.LOADING=3,t.DONE=4, true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return F}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined}).call(this,window);\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./js/xhook.min.js?");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack:///./node_modules/process/browser.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/Main.elm":
/*!**********************!*\
  !*** ./src/Main.elm ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/elm-webpack-loader/index.js):\\nError: Compiler process exited with error Compilation failed\\nDependencies loaded from local cache.\\nVerifying dependencies...\\rBuilding dependencies (1/20)\\rBuilding dependencies (2/20)\\rBuilding dependencies (3/20)\\rBuilding dependencies (4/20)\\rBuilding dependencies (5/20)\\rBuilding dependencies (6/20)\\rBuilding dependencies (7/20)\\rBuilding dependencies (8/20)\\rBuilding dependencies (9/20)\\rBuilding dependencies (10/20)\\rBuilding dependencies (11/20)\\rBuilding dependencies (12/20)\\rBuilding dependencies (13/20)\\rBuilding dependencies (14/20)\\rBuilding dependencies (15/20)\\rBuilding dependencies (16/20)\\rBuilding dependencies (17/20)\\rBuilding dependencies (18/20)\\rBuilding dependencies (19/20)\\rBuilding dependencies (20/20)-- UNKNOWN IMPORT -------------------- /home/laserpants/work/friapp/src/Main.elm\\n\\nThe Main module has a bad import:\\n\\n    import App\\n\\nI cannot find that module! Is there a typo in the module name?\\n\\nThe \\\"source-directories\\\" field of your elm.json tells me to only look in the src\\ndirectory, but it is not there. Maybe it is in a package that is not installed\\nyet?\\n\\n\\rDependencies ready!                \\n\\n    at ChildProcess.<anonymous> (/home/laserpants/work/friapp/node_modules/node-elm-compiler/dist/index.js:131:35)\\n    at emitTwo (events.js:126:13)\\n    at ChildProcess.emit (events.js:214:7)\\n    at maybeClose (internal/child_process.js:915:16)\\n    at Process.ChildProcess._handle.onexit (internal/child_process.js:209:5)\");\n\n//# sourceURL=webpack:///./src/Main.elm?");

/***/ })

/******/ });