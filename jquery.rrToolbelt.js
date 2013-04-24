/* ******************************

jquery.rrToolbelt.js

https://github.com/therebelrobot/jquery.rrToolbelt

- Global (and generic) functions for use anywhere in the js code

Dependencies:
	jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js

Available functions:

	$_GET(p) - retrieves GET information from the URL, where p is the desired parameter

	$_device() - inspects userAgent, returns object profile of device in use.
				userAgent list originally from http://techpatterns.com/forums/about304.html - 04/21/2013 updated
					modified by Trent Oswald, 04/23/2013
				Profile returned:
					type : phone, tablet, desktop, other
					name : shortened common name, where applicable
									iPad, iPadMini, MacOSX, Win, Linux, Android, Nexus, GalaxyTab2-7
					OS : Operating System of device, Mac, Win, Linux, Android, Chrome
					OSv : OS version
					browser : common name for browser in use: MSIE, firefox, chrome, safari, opera, etc.
					bv : browser version
					view : object (width, height) with the pixel dimension of the viewport
					standalone : If the browser is standalone (iPad only)

****************************** */

var $_rootDir = 'js/';

/*GET parameters*/
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
		}
	};

/*IE8 Fixes*/
var $_MSIE = {
	fixAll:function(){
		$_MSIE.bg();
		$_MSIE.opacity();
		$_MSIE.pie();
	},
	bg:function(){
		var device = $_device();
		if ((device.browser == 'MSIE' && device.bv == '6') || (device.browser == 'MSIE' && device.bv == '7') || (device.browser == 'MSIE' && device.bv == '8')){
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
		if ((device.browser == 'MSIE' && device.bv == '6') || (device.browser == 'MSIE' && device.bv == '7') || (device.browser == 'MSIE' && device.bv == '8')){
			/*include rrt-lib/ieOp.css*/
			$('head').append('<link rel="stylesheet" type="text/css" href="'+$_rootDir+'"rrt-lib/ieOp.css" />').promise().done(function(){
				$('*').each(function(){
					if ($(this).css('opacity') != 'auto'){
						$(this).attr('data-ieopacity',(parseInt($(this).css('opacity'))*10));
					};
				});
			});
		}
	},
	pie:function(){
		var device = $_device();
		if ((device.browser == 'MSIE' && device.bv == '6') || (device.browser == 'MSIE' && device.bv == '7') || (device.browser == 'MSIE' && device.bv == '8')){
			/*include rrt-lib/ieOp.css*/
			$('head').append('<link rel="stylesheet" type="text/css" href="'+$_rootDir+'"rrt-lib/pie.css" />');
		}
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

			/*set type*/

			/*set OS and OSv - along with standalone, if iPad*/

			/*set browser and bv*/


			/*** return the final results ***/
			return profile;
	};
