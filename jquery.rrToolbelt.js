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



 jQuery Functions:
	$(selector).getStyleObject() - returns all styles of an element in an object
					from http://upshots.org/?p=112 & Dakota Schneider (http://hackthetruth.org)
	$.browser - Browser detection
		https://github.com/gabceb/jquery-browser-plugin
			$.browser.msie - bool
			$.browser.webkit - bool
			$.browser.mozilla - bool

			$.browser.ipad - bool
			$.browser.iphone - bool
			$.browser.android - bool
			
			$.browser.version - string

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
				if ($_MSIE.isUsed()){
					/*include rrt-lib/jquery.backgroundSize.js*/
					$('body').append('<script type="text/javascript" src="'+$_rootDir+'"rrt-lib/jquery.backgroundSize.js"></script>').promise().done(function(){
						$('*').each(function(){
						   $(this).css($(this).getStyleObject()); 
						}).promise().done(function(){
						  $('*:not([style*="background-image: none"])').filter(':not([style*="background-size: auto"])').each(function(){
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
						  });
						});
					});
				}
			},
			opacity:function(){
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
	/* jquery.browser plugin 
	 *		https://github.com/gabceb/jquery-browser-plugin
	 *		$.browser.msie - bool
	 *		$.browser.webkit - bool
	 *		$.browser.mozilla - bool
	 *
	 *		$.browser.ipad - bool
	 *		$.browser.iphone - bool
	 *		$.browser.android - bool
	 *		
	 *		$.browser.version - string
	 */
		(function( jQuery, window, undefined ) {
			"use strict";
			 
			var matched, browser;
			 
			jQuery.uaMatch = function( ua ) {
			  ua = ua.toLowerCase();
			 
				var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
					/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
					/(msie) ([\w.]+)/.exec( ua ) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
					[];

				var platform_match = /(ipad)/.exec( ua ) ||
					/(iphone)/.exec( ua ) ||
					/(android)/.exec( ua ) ||
					[];
			 
				return {
					browser: match[ 1 ] || "",
					version: match[ 2 ] || "0",
					platform: platform_match[0] || ""
				};
			};
			 
			matched = jQuery.uaMatch( window.navigator.userAgent );
			browser = {};
			 
			if ( matched.browser ) {
				browser[ matched.browser ] = true;
				browser.version = matched.version;
			}

			if ( matched.platform) {
				browser[ matched.platform ] = true
			}
			 
			// Chrome is Webkit, but Webkit is also Safari.
			if ( browser.chrome ) {
				browser.webkit = true;
			} else if ( browser.webkit ) {
				browser.safari = true;
			}
			 
			jQuery.browser = browser;
		})( jQuery, window );


