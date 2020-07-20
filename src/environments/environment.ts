// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  news_apiUrl: 'http://newsapi.org/v2',
  news_apiKey: '3dc14bae5256481a8836948584b8a9fa',
  map_apiKey: 'xhSLlv6eLXVggB5hbMeTK87voMmu2LV3',
  map_adminKey: '2dhUQXB09HvX7UlNWZ8M41NHyGwIiV5mGcmGFPQ0TvWcvUkJ',
  map_projectID: 'c669e2a6-bb95-4986-8341-b8f4312adb51',
  map_apiUrl: 'https://api.tomtom.com',
  firebaseConfig : {
    apiKey: "AIzaSyA5wtUfH6F5rxpIu0peQFmiYZZdSF18T50",
    authDomain: "go-vid.firebaseapp.com",
    databaseURL: "https://go-vid.firebaseio.com",
    projectId: "go-vid",
    storageBucket: "go-vid.appspot.com",
    messagingSenderId: "919038768999",
    appId: "1:919038768999:web:19e087cec989467b3ce1c2",
    measurementId: "G-H735LR0QMM"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
