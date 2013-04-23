/* ******************************

jquery.rrToolbelt.js

https://github.com/therebelrobot/jquery.rrToolbelt

- Global (and generic) functions for use anywhere in the js code

Dependencies:
	jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
	jquery.backGroundSize.js - - https://github.com/louisremi/jquery.backgroundSize.js
	jquery.rrToolbelt.ua.xml - Normally included with this file

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

	/*bg size*/

	/*opacity*/
		/*.transparent_class {
		  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; // ie8

		  filter: alpha(opacity=50); // ie5-7

		  -moz-opacity: 0.5; // netscape

		  -khtml-opacity: 0.5; // safari 1.x

		  opacity: 0.5; // everyone else
		}*/

/*device functions*/
	function $_device(){
			var profile = {
				type: false, // phone, tablet, desktop
				OS: false, // windows, mac, android, linux, iPad
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
