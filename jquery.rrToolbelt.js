/* ******************************

jquery.rrToolbelt.js

https://github.com/therebelrobot/jquery.rrToolbelt

- Global (and generic) functions for use anywhere in the js code

Dependencies:
	jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js

Available functions:

 Global Functions:
	$_GET(p) - retrieves GET information from the URL, where p is the desired parameter (same as PHP: $_GET[p])

	$_(log, user, type) - conditional console.log/error when url has ?debug=user or ?debug=all or ?debug=true

	$_MSIE - runs MSIE specific fixes for various issues (bgSize, opacity, border-radius, etc.
				.isUsed() - returns true if using MSIE 6, 7, or 8

				.bg() - runs background-size fix on all elements needing it
				.opacity() - runs opacity fix on all elements needing it
				.pie() - appends the pie behavior css property to any element needing it
				.console() - runs fix to create console object if none present
				.fixAll() - runs all the above fixes

	$_device() - inspects userAgent, returns object profile of device in use.
				Profile returned:
					type : phone, tablet, desktop, other
					OS : Operating System of device, Mac, Win, Linux, Android, iPad, iPadMini, iPod, iPhone, etc.
					OSv : OS version
					standalone : If the browser is standalone (iPad only)
					browser : common name for browser in use: MSIE, firefox, chrome, safari, opera, etc.
					bv : browser version
					view : object (width, height) with the pixel dimension of the viewport

 jQuery Functions:
	$(selector).getStyleObject() - returns all styles of an element in an object
					from http://upshots.org/?p=112 and Dakota Schneider (http://hackthetruth.org)

****************************** */

var $_rootDir = 'js/';

/* GLOBAL FUNCTIONS */

	/*GET URL parameters*/
		function $_GET(p) {
			var url = window.location.search.substring(1);
			var queryParams = url.split('&');
			for (var x = 0; x < queryParams.length; x++) {
				var paramSplit = queryParams[x].split('=');
				if (paramSplit[0] == p) {
					var value = paramSplit[1];
					if (value.indexOf('#')>-1){
						value = value.split("#");
						value = value[0];
					}
					return value;
				}
				return false;
			}
			return false;
		};

	/*Conditional Console Log*/
		function $_(log, user, type){
  		var which = $_GET('debug');
  		if (which){
  			/*ie fix*/
				$_MSIE.console();
				function logThis(logger, typer){
					switch(typer){
						case 'log':
							console.log(logger);
							break;
						case 'error':
							console.error(logger);
							break;
						case 'warn':
							console.warn(logger);
							break;
						case 'info':
							console.info(logger);
							break;
					};
				}
				if (user == 'error' || user == 'warn' || user == 'info' || user =='log'){
					type = user;
					user = false; /*if only a log and a type*/
				}
				if (!type || (type != 'error' || type != 'warn' || type != 'info' || type !='log')){
					type = 'log'; /*if no type or type is wrong*/
				}
				if (!user){
					logThis(log,type); /*return anytime a console log requested*/
				}
				else{
					if (which == 'all'){
						logThis(log,type); /*return anytime all console logs are requested*/
					}
					else if (which === user){
						logThis(log,type); /*return anytime a console log requested for user*/
					}
					else{
						/*
							when console log requested, but not for this user, all logs, or anytime.
							*/
					};
				}
  		};
		};

	/*IE8 Fixes*/
		var $_MSIE = {
			fixAll:function(){
				$_MSIE.console();
				$_MSIE.bg();
				$_MSIE.opacity();
				$_MSIE.pie();
			},
			isUsed:function(){
				var thisUser = window.navigator.userAgent;
	      if (thisUser.indexOf('MSIE 8') >-1 || thisUser.indexOf('MSIE 7') > -1 || thisUser.indexOf('MSIE 6') > -1){
	        return true;
	      }
	      return false;
			},
			bg:function(){
				var device = $_device();
				if ($_MSIE.isUsed()){
					/*include rrt-lib/jquery.backgroundSize.js*/
					$('head').append('<script type="text/javascript" src="'+$_rootDir+'"rrt-lib/jquery.backgroundSize.js"></script>').promise().done(function(){
						$('*').each(function(){
							if ($(this).css('background-image') != 'none' && $(this).css('background-size') != 'auto'){
								if ($(this).css('background-size') == 'cover' || $(this).css('background-size') == 'contain'){
									var b = $(this).css('background-size');
									$(this).css({backgroundSize:b});
								}
								else if ($(this).css('background-size') == '100%'){
									$(this).css({backgroundSize:'contain'});
								}
								else if ($(this).css('background-size') == '100% 100%'){
									$(this).css({backgroundSize:'contain'});
									var thisH = $(this).height();
									var thisW = $(this).width();
									$(this).find('div:first > img').css({'height':thisH, 'width':thisW});
								}
							};
						});
					});
				}
			},
			opacity:function(){
				var device = $_device();
				if ($_MSIE.isUsed()){
					/*include rrt-lib/ieOp.css*/
					$('head').append('<link rel="stylesheet" type="text/css" href="'+$_rootDir+'"rrt-lib/ieOp.css" />').promise().done(function(){
						$('*').each(function(){
						   $(this).css($(this).getStyleObject()); 
						}).promise().done(function(){
						    $('*:not([style*="opacity: 1"])').each(function(){
									$(this).attr('data-ieopacity',(parseFloat($(this).css('opacity'))*100));
						    });
						});
					});
				}
			},
			pie:function(){
				var device = $_device();
				if ($_MSIE.isUsed()){
					/*include rrt-lib/ieOp.css*/
					$('head').append('<link rel="stylesheet" type="text/css" href="'+$_rootDir+'"rrt-lib/pie.css" />');
				}
			},
			console:function(){
				if(!window.console) {
					console = {
						log: function(){},
						error:function(){},
						warn:function(){},
						info:function(){},
						debug:function(){},
						clear:function(){}
					};
				};
			}
		};

	/*device functions*/
		function $_device(){
				var profile = {
					type: false, // phone, tablet, desktop
					OS: false, // windows, mac, android, linux, iPad, iPod, iPhone
					OSv: false, // return version of above OS
					standalone:false, // true if iPad standalone browser
					browser: false, // MSIE, firefox, chrome, safari, opera, other
					bv: false, // return version of above OS
					view:{ // viewport dimensions
						width:false,
						height:false
					}
				};
				/*Retrieve userAgent*/
					var ua = window.navigator.userAgent;
					if (ua == ''){
						return false;
					}

				/*return viewport dimensions*/
					var h = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
					var w = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
					profile.view.height = h;
					profile.view.width = w;

				/*return OS*/
		      if (ua.indexOf("iPad")>-1){
		        profile.type = 'tablet';
		        profile.OS = 'iPad';
		        if (window.devicePixelRatio >= 2) {
		          profile.OS = 'iPadMini';
		        }
		      }
		     
		      if (ua.indexOf("Android")>-1){
		        profile.type = 'tablet';
		        profile.OS = 'Android';
		      }      /*
		       WXGA (1280×800)
		       WQXGA (2560×1600)
		       */
		    /*return browser and version*/

			    if (ua.indexOf("MSIE 9")>-1){
			      return true;
			    }

				/*** return the final results ***/
				return profile;
		};

/* JQUERY FUNCTIONS */

	/* getStyleObject Plugin for jQuery
	 * 
	 * Copyright: Unknown, see source link
	 * From: http://upshots.org/?p=112
	 * Plugin version by Dakota Schneider (http://hackthetruth.org)
	 */
		(function($){
		    $.fn.getStyleObject = function(){
		        var dom = this.get(0);
		        var style;
		        var returns = {};
		        if(window.getComputedStyle){
		            var camelize = function(a,b){
		                return b.toUpperCase();
		            }
		            style = window.getComputedStyle(dom, null);
		            for(var i=0;i<style.length;i++){
		                var prop = style[i];
		                var camel = prop.replace(/\-([a-z])/g, camelize);
		                var val = style.getPropertyValue(prop);
		                returns[camel] = val;
		            }
		            return returns;
		        }
		        if(dom.currentStyle){
		            style = dom.currentStyle;
		            for(var prop in style){
		                returns[prop] = style[prop];
		            }
		            return returns;
		        }
		        return this.css();
		    }
		})(jQuery);


