/* ******************************

jquery.rrToolbelt.js

https://github.com/therebelrobot/jquery.rrToolbelt

- Global (and generic) functions for use anywhere in the js code

Dependencies:
	jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
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
var $_deviceReady = false;
var $_devXml = '';
$.get('global.ua.xml',function(data){
	$_devXml = data;
}).fail(function(){
	console.error('global.js error: Unable to retrieve global.ua.xml. Please ensure it is located in the same directory as global.js');
}).done(function(){
	$_deviceReady = true;
});
function $_device(){
	if ($_deviceReady){
		var profile = {
			type: false,
			name: false,
			OS: false,
			OSv: false,
			browser: false,
			bv: false,
			view:{
				width:false,
				height:false
			},
			standalone:false
		};
		var ua = window.navigator.userAgent;
		if (ua == ''){
			return false;
		}
		if ($_devXml.indexOf(ua) < 0){
			profile = {
				type: 'unknown',
				name: 'unknown',
				OS: 'unknown',
				OSv: 'unknown',
				browser: 'unknown',
				bv: 'unknown',
				standalone:'unknown'
			};
		}
		else{
			var dev = $_devXml.find('useragent[useragent="'+ua+'"]');

		}
		/*return viewport dimensions*/
		var h = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		var w = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
		profile.view.height = h;
		profile.view.width = w;

		/*** return the final results ***/
		return profile;
	}
	else{
		return false;
	}
};
