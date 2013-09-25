require.config({
    baseUrl : "/Oskari/", // the base is set to requirejs lib to help requiring 3rd party libs
    paths : { // some path shortcuts to ease declarations
        oskari: "bundles/oskari/oskari",
        "oskari-with-loader": "bundles/oskari/oskari-with-loader",
        jquery: "http://code.jquery.com/jquery-1.9.1",
        "jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
        css: "libraries/requirejs/lib/css",
        json: "libraries/requirejs/lib/json",
        domReady: "libraries/requirejs/lib/domReady",
        text: "libraries/requirejs/lib/text",
        normalize: "libraries/requirejs/lib/normalize"
    },
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-migrate' },

      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-migrate': { 'jquery': 'jquery' }
    },
    shim: {
      'oskari' : {
        exports: 'Oskari'
      }
    },
    config : {
        i18n : {
            locale : language
        }
    },
    waitSeconds: 30
});