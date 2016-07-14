// Loader for the Postnord widget
var PostnordWidget = {
    /* jshint shadow:true */
    baseUrl: null, // Optional. Base Url to use for loading files. Set this if you want it to be static
    element: null, // Required. The container where the Postnord widget should be loaded
    apiKey: null, // Required. Consumer Id to use
    language: null, // Optional. language to use

    // Load css file
    // rel = rel type to use
    // type = type of link object to use
    // href = Url to CSS file that should be loaded
    // callback = Callback method to run
    loadCss: function (rel, type, href, callback) {
        var linkElement = document.createElement('link');
        linkElement.setAttribute('rel', rel);
        linkElement.setAttribute("type", type);
        linkElement.setAttribute('href', href);

        var nua = navigator.userAgent.toLowerCase(),
        is_android = ((nua.indexOf('mozilla/5.0') > -1 && nua.indexOf('android ') > -1 && nua.indexOf('applewebkit') > -1) && (nua.indexOf('chrome') < 0));

        // Fix for Android browser pre Chrome
        if (!is_android) {
            linkElement.onload = function () {
                callback('success');
            };

            linkElement.onerror = function () {
                callback('Postnord: Could not load css file');
            };
        } else {
            callback('success');
        }

        var head = document.head || document.getElementsByTagName('head')[0];

        head.appendChild(linkElement);
    },

    // Load javascript file
    // src = The Javascript src file that should be loaded
    // type = Whether script element should be placed in the head of body part of the page
    // elementToCheck = r checking if the library has already been loaded
    // callback = Callback method to run
    loadJavascript: function (src, type, elementToCheck, callback) {
        // ElementToCheck is not null and not undefined it means that the library has already been loaded
        if (elementToCheck !== null && elementToCheck !== 'undefined') {
            console.log('Info: Library in ' + src + ' already registered');
            callback('success');
            return;
        }

        // Create script element, and specify its attributes
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', src);

        // Run callback after script has been loaded
        if (typeof (scriptElement.onload) !== 'undefined') {
            scriptElement.onload = function () {
                callback('success');
            };
        } else { // Fix for IE8
            scriptElement.onreadystatechange = function () {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    callback('success');
                }
            };
        }

        scriptElement.onerror = function () {
            callback('Postnord: could not load Javascript file');
        };

        // Write script element in head or body, depending on the type specified
        switch (type) {
            default:
            document.body.appendChild(scriptElement);
            break;
            case 'head':
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
            break;
        }
    },

    // Tries to load every Javascript library recursively
    // javascriptFiles = array with all javascript files that should be loaded
    // callback = Callback method to run
    loadJavascripts: function (javascriptFiles, callback) {

        // Load the first object in the javascriptFiles array
        PostnordWidget.loadJavascript(javascriptFiles[0][0], javascriptFiles[0][1], javascriptFiles[0][2], function (response) {
            // If successful then continue
            if (response == 'success') {
                // Remove first item in array, since it has now been loaded
                javascriptFiles.shift();

                // If there are still items in the array then continue
                if (javascriptFiles.length > 0) {
                    PostnordWidget.loadJavascripts(javascriptFiles, callback);
                }
                else { // Otherwise run the callback method
                    callback('success');
                }
            }
            else { // Return the error
                callback(response);
            }
        });
    },



    // Inits PostnordWidget
    init: function (options) {

        // If options is null then return false
        if (options === null) {
            alert('Postnord: Options not specified');
            return false;
        }

        // TODO - Change baseUrl to https?
        if(options.baseUrl === undefined || options.baseUrl === null){
            options.baseUrl = 'http://app.postnord.com/';
        }

        // Iterate through each property in options and try to set properties
        for (var propertyName in options) {
            switch (propertyName) {
                default:
                break;
                case 'baseUrl': // Try set base url
                if (PostnordWidget.baseUrl === null) {
                    PostnordWidget.baseUrl = options[propertyName];
                }
                break;
                case 'element': // Try set element
                PostnordWidget.element = options[propertyName];
                break;
                case 'language':
                    if(options[propertyName].length > 0 && options[propertyName].indexOf('language=') >= 0){

                        lang = options[propertyName].replace('?', '');
                        lang = lang.split('&');
                        language = 'en';
                        for(i = 0; i < lang.length; i++) {
                            tmp = lang[i].split('=');
                            if(tmp[0] === 'language' && tmp[1].length === 2){
                                language = tmp[1];
                            }
                        }
                        PostnordWidget.language = language;           
                    }
                    break;
            }
        }

        // If baseUrl is not specified in options then set current host (including protocol and port, if available)
        if (PostnordWidget.baseUrl === null) {
            PostnordWidget.baseUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
        }

        // if language is not specified in options then retrieve language from the browser's language.


        // If element is not specified in options then display error and cancel
        if (PostnordWidget.element === null) {
            console.log('Postnord: Element not specified');
            return false;
        }

        
        var postnordWidgetCssPath = 'css/postnord-widget.css';

        if (PostnordWidget.width !== null) {
            postnordWidgetCssPath = 'css/postnord-widget.no-queries.css';
        }

        // Load css file
        PostnordWidget.loadCss('stylesheet', 'text/css', PostnordWidget.baseUrl + postnordWidgetCssPath, function (response) {
            // If response was successful then continue
            if (response === 'success') {
                // List of Javascript files that should be loaded
                var javascriptFiles = [
                [PostnordWidget.baseUrl + 'js/modernizr.js', 'head', typeof (Modernizr)],
                [PostnordWidget.baseUrl + 'js/libs.js', 'body', null],
                [PostnordWidget.baseUrl + 'js/jquery.qrcode.min.js', 'body', null],
                [PostnordWidget.baseUrl + 'js/app.js', 'body', null]
                ];

                // Try load all Javascript files
                PostnordWidget.loadJavascripts(javascriptFiles, function (response) {
                    // If successful then initialize widget
                    if (response === 'success') {
                        // Get the widget container, as specified by the element property
                        var widgetContainer = document.querySelector(PostnordWidget.element);

                        // Widget container exists then c
                        if (widgetContainer !== null) {

                            App.init(PostnordWidget.baseUrl, PostnordWidget.language);
                            return;            
                        } else {
                            console.log('Postnord: Could not find widget container element');
                            return false;
                        }
                    }
                    else { // Otherwise display error and cancel
                        alert(response);
                        return false;
                    }
                });
            } else {
                alert(response);
                return false;
            }
        });

        return true;
    }
};