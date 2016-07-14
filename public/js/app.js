var BankIdController = (function() {
	
	var pageroot;

	function init() {
		pageroot = $('#bankid');

		pageroot.on('click', '.js-to-start', function() {
			$state.go('start');
		});

		
	}

	return {
		init : init
	};
})();
var BarcodeController = (function() {

	function drawCard(pageroot) {
		
		var orientation = window.orientation;
		if(orientation === undefined) {
			orientation = screen.orientation | screen.msOrientation | screen.mozOrientation;
		}
		var portrait = (orientation !== 0) ? false : true;
		
		if(orientation !== undefined && orientation !== null ){
			if(portrait) {
				_w = pageroot.height();
				_w = _w - ($('.head').height() + $('.close').height() + 50);

				_h = pageroot.width();

				$('.card').width(_w);
				$('.card').css('top', _w/2);
				$('.card').css('left', _h/2);					
			} else {
				_w = pageroot.width() - 60;

				_h = pageroot.height();
				_h = _h - ($('.head').height() + $('.close').height() + 10);

				$('.card').css('max-width', _w + 'px');
				//$('.card').height(_h);
				$('.card').css('top', $('.head').height() - 50);
				_l = (pageroot.width()-$('.card').width());
				$('.card').css('left', _l/2 + 'px');					
			}

		}
	}

	function init(params, config) {
		var pageroot = $('#barcode');

		pageroot.on('click', '.js-to-identity', function() {
			$state.go('identity');
		});

		$('#postnord-barcode').removeClass('hide');
		$('.no-code').addClass('hide');
		
			var supportsOrientationChange = "onorientationchange" in window,
			orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

			window.addEventListener(orientationEvent, function() {
				setTimeout( function() { 
					drawCard(pageroot); 
				}, 300);
			}, false);

	


		var code = params === undefined ? 'CODEMISSING' : params;

		if(code !== undefined) {
			codeList = code.split('');
			codeHtml = "";
			for(var i = 0; i < codeList.length; i++){
				codeHtml += '<span class="cell">'+codeList[i]+'</span>';
			}

			$('.code').html(codeHtml);

			drawCard(pageroot);


			App.barcodeService = new BarcodeService('postnord-barcode');
			if (App.barcodeService.supportsBarcode()) {
				App.barcodeService.initializeBarcode(code);
			}
		} else {
			$('#postnord-barcode').addClass('hide');
			$('.no-code').removeClass('hide');
		}
	}

	return {init:init};
})();
var BarcodeService = (function() {
	var self;

    // The DOM element that will render the Bar code
    var barcodeCanvas = null;

    var supportsBarcode = false;

    // Constructor
    // elementId = The DOM element that will render the Bar code
    function BarcodeService(elementId) {
    	self = this;

        // If element attribute is specified then set the barcodeCanvas property
        if (elementId !== null) {
        	barcodeCanvas = document.getElementById(elementId);
        }

        if (!!document.createElement('canvas').getContext) {
        	supportsBarcode = true;
        }
    }

    // Create barcode. Returns whether initialization was successful or not.
    // value = The value that should be converted into a CODE128 barcode
    BarcodeService.prototype.initializeBarcode = function(value) {
        // Return false if browser does not support bar code
        if (!supportsBarcode) {
        	return false;
        }

        // JsBarcode doesn't exist then return false
        if (typeof(JsBarcode) === 'undefined' || JsBarcode === null || barcodeCanvas === null) {
        	return false;
        }

        // Create barcode
        if(value.length === 14){
        	value = '00000000' + value + '000000';
        }

        $('#postnord-barcode').JsBarcode(value);

        // Show barcode
        BarcodeService.showBarcode();

        return true;
    };

    // Show barcode
    BarcodeService.showBarcode = function() {
    	barcodeCanvas.parentElement.style.display = 'block';
    };

    // Hide barcode
    BarcodeService.prototype.hideBarcode = function() {
    	barcodeCanvas.parentElement.style.display = 'none';
    };

    // Returns whether browser supports barcode or not
    BarcodeService.prototype.supportsBarcode = function() {
    	return supportsBarcode;
    };

    return BarcodeService;
})();

var ErrorController = (function() {
	function init(params, config) {

		var pageroot = $('#error');

		pageroot.on('click', '.js-to-handoff', function() {
			$state.go('handoff');
		});


		pageroot.on('click', '.js-to-start', function() {
			App.clearCookie();
			$state.go('start');
		});

		setTimeout(function() {
			$('#animation').addClass('animate');
			$('.plate').addClass('error');
			$('.plate').removeClass('pn');
			setTimeout(function(){
				$('.container').addClass('show');
				setTimeout(function(){
					$('#animation').addClass('hide');
				}, 150);
			}, 300);
		}, 600);
	}

	return {
		init: init
	};
})();

var HandoffController = (function() {

	function init(params, config) {
		var pageroot = $('#handoff');
		

		var validCheck = $cookie.get('expires_in');
		
		if(validCheck === undefined || validCheck < new Date()) {
			setTimeout(function(){
				window.location.href = config.bankid;
			},1000);
		} else {
			requestPablo();	
		}
	}

	function requestPablo(callback) {

		if(App.isLocal()) {
			$.ajax({
				url: '/rewrite',
				type: 'POST',
				data: {
					itemid: $cookie.get('id'),
					apikey: 'a3bca1b94db6f279c63b1f3eb40ae836',
					token: $cookie.get('access_token')
				},
				success: function(data) {
					$state.go('identity', data);
				},
				error: function() {
					$state.go('error');
				}
			});
		} else {
			$.ajax({
				url: 'https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=' + $cookie.get('id') + '&apikey=a3bca1b94db6f279c63b1f3eb40ae836',
				type: 'PUT',
				crossDomain: true,
				headers: {
					Authorization: 'Bearer ' + $cookie.get('access_token')
				},
				dataType: 'json',
					success: function(data) {
					$state.go('identity', data);
				},
				error: function() {
					$state.go('error');
				}
			});
		}


		

		if( typeof callback === 'function') {
			callback();
		}
	}

	return {
		init: init
	};
})();
var IdentityController = (function() {

	var cookie = '';

	function verifyOpenIDConnect(callback) {

		if(!$id.hasToken()) {

		}

		if(typeof callback === 'function') {
			callback();
		}
	}

	function pabloSuccess(itemId) {
		var pageroot = $('#identity');
		var kolli = null;

		if(itemId !== undefined) {
			itemId = JSON.parse(itemId);
			kolli = itemId.collectioncode.code;
		} else {
			kolli = $cookie.get('collectioncode');
		}

		if(kolli === null || kolli === undefined) {
			$state.go('error');
			return;
		}

		$cookie.set('collectioncode', kolli);
		codeArray = kolli.split('');			
		
		codeSelector = pageroot.find('#code');
		codeSelector.html('');
		for(var i = 0; i < codeArray.length; i++){
			codeSelector.append('<span class="cell">' + codeArray[i] + '</span>');
		}		

		var mailHref = $('#mail').attr('href');
		mailHref = mailHref.replace('|CODE|', kolli);
		$('#mail').attr('href', mailHref);

		var smsHref = $('#sms').attr('href');
		smsHref = smsHref.replace('|CODE|', kolli);
		$('#sms').attr('href', smsHref);

		
		pageroot.on('click', '.js-to-clear', function() {
			$cookie.clear();
			$state.go('start');
		});

		pageroot.on('click', '.js-to-barcode', function() {
			$state.go('barcode', kolli);
		});

		//Fix for iOS sms
		if(App.getOS().name === 'iOS'){
			if(App.getOS().version > 8){
				smsHref = $('#sms').attr('href');
				smsHref = smsHref.replace('?', ';');
				$('#sms').attr('href', smsHref);
			} else {
				smsHref = $('#sms').attr('href');
				smsHref = smsHref.replace('?', '&');
				$('#sms').attr('href', smsHref);
			}
		}

		$('#qrcode').qrcode(kolli);

		setTimeout(function() {
			$('#animation').addClass('animate');
			$('.plate').removeClass('pn');
			$('.plate').addClass('success');
			setTimeout(function(){
				$('.container').addClass('show');
				setTimeout(function(){
					$('#animation').addClass('hide');
				}, 200);
			}, 300);
		}, 600);
	}


	function init(params, config) {

		pabloSuccess(params);

		/*
		$pablo.request(cookie.id,  cookie.access_token, false, false, function() {
			console.log('Callback');
		});
		*/
		
	}

	return {init:init};
})();
var $store = (function() {
    var user = null;

    function verify() {
        try {
            window.localStorage.setItem('mod', 'mod');
            if (localStorage.getItem('mod') !== null){
                this.isAvailable = true;
                window.localStorage.removeItem('mod');
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    
    
    function save(id, object, callback) {
        if(this.verify()){
            if(typeof(object) === "object"){
                object = JSON.stringify(object);
            }
            window.localStorage.setItem(id, object);
        }
        callback();
    }

    function get(id, callback){
        if(this.verify()){
            var object = JSON.parse(window.localStorage.getItem(id));
            try {
                if( typeof callback === 'function') {
                    callback(object);
                } else {
                    return JSON.parse(object);
                }
            } catch(e){
                return object;
            }
        }
    }


    return {
        save: save,
        get: get,
        verify: verify
    };
})();


var StartController = (function() {
	function init(params, config) {
		var pageroot = $('#start');
		var kolli  = '';

		var search = window.location.search.replace('?', '').split('&');
		$.each(search, function(index, data){
			var set = data.split('=');
			$cookie.set(set[0], set[1]); 
			if(set[0] === 'id') {
				kolli = set[1];
			}
		});
		
		pageroot.on('click', '.js-to-bankid', function() {
			$state.go('bankid');
		});

		pageroot.on('click', '.js-to-handoff', function(){
			if(kolli === '') {
				$cookie.set('id', $('#itemid').val());
			}
			$state.go('handoff');
		});

		var loader = $('.loader');

		setTimeout(function() {
			loader.addClass('animate--up');
			loader.addClass('animate--spinner');
			loader.addClass('animate--check');
			setTimeout(function(){
				$('.container').addClass('show');
			}, 300);
		}, 600);
	}

	return {
		init: init
	};
})();

var $state = (function(){

	var internalRoutes = [];
	var internalRoot = {};
	var hash = '';
	var baseUrl = '';

	function init(base) {
		baseUrl = base;
		$(window).on('hashchange', function(){
			if(hash !== window.location.hash) {
				$state.go(window.location.hash.replace('#', ''));
			}
		});


		return this;
	}

	function go(route, params) {
		var _route, _index;
		for(var i = 0; i < internalRoutes.length; i++){
			if(internalRoutes[i].route === route) {
				_index = i;
				_route = internalRoutes[i];
			}
		}

		if(_route === undefined) {
			return;
			//throw new Error('Unknown route');
		}

		if(_route.data === undefined) {
			preload(_route, _index, function() {
				apply(_route, params);
			});
		} else {
			apply(_route, params);
		}	
	}

	function apply(_route, params) {
		if(_route === undefined) {
			return;
			//throw new Error('Route is undefined');
		}
		hash = _route.url;
		window.location.hash = _route.url;
		$translator.translatePage(_route.data, function(page){
			internalRoot.html(page);
			_route.controller.init(params, _route.config);
		});
	}

	function preload(route, index, callback) {
		$.ajax({
			method: 'GET',
			url: baseUrl + 'html/' + route.view,
			success: function(html) {
				internalRoutes[index].data = html;
				if(typeof callback === "function") {
					callback();
				}
			}
		});
	}

	function register(route) {
		internalRoutes.push(route);
		return this;
	}

	function setinternalRoot(root) {
		internalRoot = root;
	}

	return {
		go : go,
		init: init,
		preload : preload,
		register: register,
		setInternalRoot: setinternalRoot
	};
})();

var $cookie = (function(){

	var config = {};
	var cookie = null;

	function loadFromDocument(callback) {
		if(config.cookie === undefined) {
			return;
			//throw new Error('Config not loaded correctly');
		}
		cookie = Cookies.get(config.cookie);
		if(cookie !== undefined) {
			cookie = JSON.parse(cookie);
		} else {
			cookie = {};
		}

		if(typeof callback === 'function'){
			callback();
		}
	}

	function init(_config) {
		config = _config;
		loadFromDocument();
	}

	function get(key) {
		if(cookie === null) {
			loadFromDocument(function() {
				return cookie[key];
			});
		}
		return cookie[key];
	}

	function set(key, value) {
		if(cookie === null) {
			loadFromDocument();
		}

		cookie[key] = value;
		if(config.cookie === undefined) {
			return;
			//throw new Error('Config not loaded correctly');
		}

		Cookies.set(config.cookie, cookie);
	}

	function clear() {
			Cookies.remove(config.cookie, cookie);
			cookie = {};
	}

	function hasData() {
		if(cookie === null || cookie === undefined) {
			return false;
		}

		return !!(Object.getOwnPropertyNames(cookie).length);
	}

	function toString() {
		console.log(cookie);
	}

	return {
		init: init,
		get: get,
		set: set,
		clear: clear,
		hasData: hasData,
		toString: toString
	};

})();
var $translator = (function() {

	var language = 'en';
	var regex = /{[^{}]+}/;

	var languages = {
		sv: {
			dictionary: {},
			loaded: false
		},
		en: {
			dictionary: {},
			loaded: false
		}
	};

	function loadLanguageFiles() {
		$.getJSON('/lang/sv/identification.json')
		.done(function(translations) {
			languages.sv.dictionary = translations;
			languages.sv.loaded = true;
		})
		.error(function(e) {
			console.log(e);
		});


		$.getJSON('/lang/en/identification.json')
		.done(function(translations) {
			languages.en.dictionary = translations;
			languages.en.loaded = true;
		})
		.error(function(e) {
			console.log(e);
		});
	}

	function loadLanguage(language, callback) {
		$.getJSON('/lang/' + language + '/identification.json')
		.done(function(translations) {
			languages[language].dictionary = translations;
			languages[language].loaded = true;

			if(typeof callback === "function") {
				callback();
			}
		})
		.error(function(e) {
			console.log(e);
		});
	}

	function setLanguage(_language) {
		language = _language;
	}

	function getLanguage() {
		return language !== null ? language : 'sv';
	}

	function getTranslationForWordInLanguage(word, language) {
		return (languages[language].dictionary[word] !== undefined && languages[language].dictionary[word].length > 0 )? languages[language].dictionary[word] : '>>> TRANSLATION MISSING FOR: ' + language +':' + word + ' <<<'; 
	}

	function translatePage(text, callback) {

		if(languages[getLanguage()].loaded) {
			var translation = translateLines(text);
			
			if(typeof callback === "function") {
				callback(translation);
			} else {
				return translation;
			}

		} else {
			loadLanguage(getLanguage(), function(){
				var translation = translateLines(text);
				if(typeof callback === "function") {
					callback(translation);
				} else {
					return translation;
				}
			});
		}
	}

	function translateLines(text) {
		var match = text.match(regex);
		if(match !== null) {
			word = match[0];
			word = word.replace('{', '');
			word = word.replace('}', '');
			text = text.replace(match[0], getTranslationForWordInLanguage(word, getLanguage()));

			return translateLines(text);
		}
		return text;
	}

	return {
		loadLanguageFiles: loadLanguageFiles,
		setLanguage: setLanguage,
		getLanguage: getLanguage,
		translatePage: translatePage,
		translateLines: translateLines
	};
})();
var $pablo = (function() {

	function request(itemid, auth, token, api, callback) {
		if(!api) {
			api = 'a3bca1b94db6f279c63b1f3eb40ae836';
		}

		if(!itemid) {
			return;
			//throw new Error('No itemid found');
		}

		if(!auth) {
			return;
			//throw new Error('No auth found');
		}


		//curl -v -H "authorization: Bearer base64headerxxx.base64bodyyyy.base64signzzz" -X PUT "https://atapi2.postnord.com/rest/shipment/v1/collectcode?itemid=91252077822SE&apikey=aaae9d346b52583ad73ee29a39c65d8f"
		

		$.ajax({
			type: 'PUT',
			url: 'https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=' + itemid + '&apikey=' + api,
			headers: {
				'Accept': 'application/json',
				'Accept-Language': 'en_US',
				'content-type': 'application/x-ww-form-urlencoded',
				'Authentication': 'Bearer' +  auth
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);

				if(typeof callback === 'function') {
					callback();
				}
			},
			error: function() {
				$state.go('error');
			}
		});
	}

	return {
		request : request
	};
})();



/*
curl -v -H 'Authorization: Bearer l79ghhHf2gyjSD1mYQXa' -X PUT 'https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=69861915572SE&apikey=a3bca1b94db6f279c63b1f3eb40ae836'
																																https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=69861737259SE&apikey=a3bca1b94db6f279c63b1f3eb40ae836 
																																https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=69861915572SE&apikey=a3bca1b94db6f279c63b1f3eb40ae836 
curl -v -H "authorization: Bearer dFyKiapwwgd0Ma6j1nhw" -X PUT 'https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=69861915572SE&apikey=3e99fca5934f1ee68f253eb66c85ff49'
curl -v -H 'Authorization: Bearer 2RIU2CzmUlehyjhRv3yN' -X PUT 'https://api2.postnord.com/rest/shipment/v1/collectcode?itemid=69861915572SE&apikey=f43ddb9345968dcd0f73bc162c4e41b7'



 curl -is --header 'Authorization: Bearer l77HojUpN8jfa5UEEqOG' https://api2.postnord.com/oauth

l79ghhHf2gyjSD1mYQXa


*/
var $id = (function(){

	var token = '';

	function request() {
		//curl --insecure -X POST -H "Accept: application/json" -H "Accept-Language: en_US" -H "content-type: application/x-www-form-urlencoded" -d "client_id=amended-disposal" -d "client_secret=8kkI7Qr7XiF8YoILZmwJ" -d "grant_type=client_credentials&scope=all" https://t-gate.ess.postnord.com/mga/sps/oauth/oauth20/token
		$.ajax({
			url: 'https://t-gate.ess.postnord.com/mga/sps/oauth/oauth20/token',
			type: 'POST',
			headers: {
				'Accept': 'application/json',
				'Accept-Language': 'en_US',
				'content-type': 'application/x-ww-form-urlencoded'
			},
			data: {
				client_id: 'amended-disposal',
				client_secret: '8kkI7Qr7XiF8YoILZmwJ',
				grant_type: 'client_credentials',
				scope: 'all'
			},
			dataType: 'json',
			success: function (data) {
				console.info(data);
			}
		});
		
	}

	function getToken() {
		return token;
	}

	return {
		getToken: getToken
	};
})();

var App = (function(){
	var hash = '';
	var userToken = {};
	var htmlRoot;
	var config = {};
	var OS = {
		name: '',
		version: 0
	};

	function isMobile() {

		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
		{
			OS.name = 'iOS';

			var deviceAgent = navigator.userAgent.toLowerCase();
			if(/(iphone|ipod|ipad).* os 8_/.test(deviceAgent)) {
				version = 8;
			} else {
				version = 9;
			}
		}
		else if( userAgent.match( /Android/i ) )
		{
			OS.name ='Android';
		}
		else
		{
			OS.name ='unknown';
		}

	}


	function callback() {
		hash = window.location.hash;
		hash = hash.replace('#', '');
		hash = hash.split('&');
		store = {};
		for(var i = 0; i < hash.length; i++){
			tmp = hash[i].split('=');
			store[tmp[0]] = tmp[1];
		}

		$store.save('postnord-id', store, function(){
			window.location.href = 'http://localhost/#pablo';
		});
		
	}

	function init(baseUrl, language) {
		if(typeof qwerty !== 'undefined'){
			qwerty(function(data){
				config = data;
				$('#config').remove();
				qwerty = undefined;
			});
		}

		$cookie.init(config);

		baseUrl = baseUrl;
		language = !!language ? language : 'en';
		isMobile();
		htmlRoot = $('#postnord-widget-container');
		$translator.setLanguage(language);
		$translator.loadLanguageFiles();
		$state.setInternalRoot(htmlRoot);

		$state
		.init(baseUrl)
		.register({
			route: 'start',
			url: '#start',
			controller: StartController,
			config: config,
			view: '_start.html'
		})
		.register({
			route: 'handoff',
			url: '#handoff',
			controller: HandoffController,
			config: config,
			view: '_handoff.html'
		})
		.register({
			route: 'identity',
			url: '#identity',
			controller: IdentityController,
			config: config,
			view: '_identity.html'
		})
		.register({
			route: 'error',
			url: '#error',
			controller: ErrorController,
			view: '_error.html'
		})
		.register({
			route: 'bankid',
			url: '#bankid',
			controller: BankIdController,
			view: '_bankid.html'
		})
		.register({
			route: 'barcode',
			url: '#barcode',
			controller: BarcodeController,
			view: '_barcode.html'
		});



		if(window.location.hash.indexOf('access_token') >= 0) {
				var hash = window.location.hash.replace('#', '').split('&');
				$.each(hash, function(index ,pair) {
					split = pair.split('=');
					if(split[0] === 'expires_in') {
						var date = new Date();
						split[1] = new Date(date.setSeconds(date.getSeconds()+parseInt(split[1])));
					}
					$cookie.set(split[0], split[1]);
				});
				
			$state.go('handoff');
		} else if(window.location.hash.length > 0){ 
			$state.go(window.location.hash.replace('#', ''));
		} else {
			$state.go('start');
		}
	}

	function loadData(data) {
		data = data.replace('#','');
		options = data.split('&');
		localStore = {};
		for(var i = 0; i < options.length; i++){
			tmp = options[i].split('=');
			localStore[tmp[0]] = tmp[1];
		}
	}

	function getRoot() {
		return htmlRoot;
	}

	function getOS() {
		return OS;
	}

	function clearCookie() {
			$cookie.clear();
	}

	function isLocal() {
		return config.localhost;
	}

	return {
		callback: callback,
		init: init,
		isMobile: isMobile,
		loadData: loadData,
		getRoot: getRoot,
		getOS: getOS,
		clearCookie: clearCookie,
		isLocal: isLocal
	};
})();


