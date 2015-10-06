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

	$_ls and $_ss - localStorage and sessionStorage functions

	$_win.size(), $_win.h([%]), $_win.w([%]) - returns window viewport dimensions, optional percentages in h and w

	$_resp(func) - run on initial, and any time the window reloads

	$_toUni(str) - converts string to unicode

	isArray() compatability: makes isArray() a valid function, even in old browsers.

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

	$(selector).hdata(attr[, value]) - data-attribute assign/return
		shortcut to pull/assign data to the 'data-'+attr attribute from the selector element.

		$(selector).data() assigns it to a backend data, rather than to the html5 data attribute.

	$(selector).class([obj]): returns an array of classes of an object, or assigns them if passed an array.

	$(selector).hasAttr(attr) - return true if element has the attr specified


****************************** */

var $_jsDir = 'js/'

/* GLOBAL FUNCTIONS */

/*GET URL parameters*/
function $_GET (p) {
  var url = window.location.search.substring(1)
  var queryParams = url.split('&')
  for (var x = 0; x < queryParams.length; x++) {
    var paramSplit = queryParams[x].split('=')
    if (paramSplit[0] == p) {
      var value = paramSplit[1]
      if (value.indexOf('#') > -1) {
        value = value.split('#')
        value = value[0]
      }
      return value
    }
    return false
  }
  return false
}

/*Conditional Console Log*/
function $_ (log, user, type) {
  var which = $_GET('debug')
  if (which) {
    /*ie fix*/
    $_MSIE.console()
    function logThis (logger, typer) {
      switch (typer) {
        case 'log':
          console.log(logger)
          break
        case 'error':
          console.error(logger)
          break
        case 'warn':
          console.warn(logger)
          break
        case 'info':
          console.info(logger)
          break
      }
    }
    if (user == 'error' || user == 'warn' || user == 'info' || user == 'log') {
      type = user
      user = false /*if only a log and a type*/
    }
    if (!type || (type != 'error' || type != 'warn' || type != 'info' || type != 'log')) {
      type = 'log' /*if no type or type is wrong*/
    }
    if (!user) {
      logThis(log, type) /*return anytime a console log requested*/
    } else {
      if (which == 'all') {
        logThis(log, type) /*return anytime all console logs are requested*/
      }
      else if (which === user) {
        logThis(log, type) /*return anytime a console log requested for user*/
      } else {
        /*
        	when console log requested, but not for this user, all logs, or anytime.
        	*/
      }
    }
  }
}

/*IE8 Fixes*/
var $_MSIE = {
  fixAll: function () {
    $_MSIE.console()
    $_MSIE.bg()
    $_MSIE.opacity()
    $_MSIE.pie()
  },
  isUsed: function () {
    var thisUser = window.navigator.userAgent
    if (thisUser.indexOf('MSIE 8') > -1 || thisUser.indexOf('MSIE 7') > -1 || thisUser.indexOf('MSIE 6') > -1) {
      return true
    }
    return false
  },
  bg: function () {
    if ($_MSIE.isUsed()) {
      /*include rrt-lib/jquery.backgroundSize.js*/
      $('body').append('<script type="text/javascript" src="' + $_jsDir + '"rrt-lib/jquery.backgroundSize.js"></script>').promise().done(function () {
        $('*').each(function () {
          $(this).css($(this).getStyleObject())
        }).promise().done(function () {
          $('*:not([style*="background-image: none"])').filter(':not([style*="background-size: auto"])').each(function () {
            if ($(this).css('background-size') == 'cover' || $(this).css('background-size') == 'contain') {
              var b = $(this).css('background-size')
              $(this).css({backgroundSize: b})
            }
            else if ($(this).css('background-size') == '100%') {
              $(this).css({backgroundSize: 'contain'})
            }
            else if ($(this).css('background-size') == '100% 100%') {
              $(this).css({backgroundSize: 'contain'})
              var thisH = $(this).height()
              var thisW = $(this).width()
              $(this).find('div:first > img').css({'height': thisH, 'width': thisW})
            }
          })
        })
      })
    }
  },
  opacity: function () {
    if ($_MSIE.isUsed()) {
      /*include rrt-lib/ieOp.css*/
      $('head').append('<link rel="stylesheet" type="text/css" href="' + $_jsDir + '"rrt-lib/ieOp.css" />').promise().done(function () {
        $('*').each(function () {
          $(this).css($(this).getStyleObject())
        }).promise().done(function () {
          $('*:not([style*="opacity: 1"])').each(function () {
            $(this).attr('data-ieopacity', (parseFloat($(this).css('opacity')) * 100))
          })
        })
      })
    }
  },
  pie: function () {
    if ($_MSIE.isUsed()) {
      /*include rrt-lib/ieOp.css*/
      $('head').append('<link rel="stylesheet" type="text/css" href="' + $_jsDir + '"rrt-lib/pie.css" />')
    }
  },
  console: function () {
    if (!window.console) {
      console = {
        log: function () {},
        error: function () {},
        warn: function () {},
        info: function () {},
        debug: function () {},
        clear: function () {}
      }
    }
  }
}

/*LocalStorage functions*/
$_ls = {
  comp: function () {
    if (!window.localStorage) {
      window.localStorage = {
        getItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
          return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'))
        },
        key: function (nKeyId) {
          return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, '').split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId])
        },
        setItem: function (sKey, sValue) {
          if (!sKey) { return; }
          document.cookie = escape(sKey) + '=' + escape(sValue) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/'
          this.length = document.cookie.match(/\=/g).length
        },
        length: 0,
        removeItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return; }
          document.cookie = escape(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
          this.length--
        },
        hasOwnProperty: function (sKey) {
          return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
        }
      }
      window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length
    }
  },
  getAll: function () {
    var allKeys = Object.keys(localStorage)
    return allKeys
  },
  exists: function (key) {
    var allKeys = $_ls.getAll()
    if (allKeys.indexOf(key) > -1) {
      return true
    } else {
      return false
    }
  },
  retrieve: function (key) {
    if ($_ls.exists(key)) {
      var results = localStorage.getItem(key)

      $_('SUCCESS: ', key, ' retrieved from localStorage', 'ls')

      return results
    } else {
      $_('FAILED: ', key, ' does not exist in localStorage', 'ls')

      return false
    }
  },
  write: function (key, str) {
    if (!$_ls.exists(key)) {
      localStorage.setItem(key, str)

      $_('SUCCESS: stored ', key, ' in localStorage', 'ls')

    } else {
      $_('FAILED: ', key, ' already exists. Please remove before continuing', 'ls')

      return false
    }
  },
  remove: function (key) {
    if ($_ls.exists(key)) {
      localStorage.removeItem(key)

      $_('SUCCESS: ', key, ' removed from localStorage', 'ls')

      return true
    } else {
      $_('FAILED: ', key, ' does not exist in localStorage', 'ls')

      return false
    }
  }
}

/*SessionStorage functions*/
$_ss = {
  getAll: function () {
    var allKeys = Object.keys(sessionStorage)
    return allKeys
  },
  exists: function (key) {
    var allKeys = $_ss.getAll()
    if (allKeys.indexOf(key) > -1) {
      return true
    } else {
      return false
    }
  },
  retrieve: function (key) {
    if ($_ss.exists(key)) {
      var results = sessionStorage.getItem(key)

      $_('SUCCESS: ', key, ' retrieved from sessionStorage', 'ss')

      return results
    } else {
      $_('FAILED: ', key, ' does not exist in sessionStorage', 'ss')

      return false
    }
  },
  write: function (key, str) {
    if (!$_ss.exists(key)) {
      sessionStorage.setItem(key, str)

      $_('SUCCESS: stored ', key, ' in sessionStorage', 'ss')

    } else {
      $_('FAILED: ', key, ' already exists. Please remove before continuing', 'ss')

      return false
    }
  },
  remove: function (key) {
    if ($_ss.exists(key)) {
      sessionStorage.removeItem(key)

      $_('SUCCESS: ', key, ' removed from sessionStorage', 'ss')

      return true
    } else {
      $_('FAILED: ', key, ' does not exist in sessionStorage', 'ss')

      return false
    }
  }
}

/*Window size functions*/
var $_win = {
  size: function () {
    var dim = {
      h: $_win.h(),
      w: $_win.w()
    }
    return dim
  },
  h: function (perc) {
    var body = document.body,
      html = document.documentElement

    var ph = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

    if (!perc) {
      return ph
    } else {
      var h = ph
      h = (h / 100) * perc
      return h
    }
  },
  w: function (perc) {
    var body = document.body,
      html = document.documentElement

    var pw = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
    if (!perc) {
      return pw
    } else {
      var w = pw
      w = (w / 100) * perc
      return w
    }
  }
}

/*Responsive function*/
var $_resp = function (func) {
  func()
  $(window).resize(function () {
    func()
  })
}
/*toUni string conversion*/
function $_toUni (theString) {
  var unicodeString = ''
  for (var i = 0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase()
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode
    }
    theUnicode = '\\u' + theUnicode
    unicodeString += theUnicode
  }
  return unicodeString
}

/*isArray compatability*/
if (!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === '[object Array]'
  }
}

/* JQUERY FUNCTIONS */

/* getStyleObject Plugin for jQuery
 *
 * Copyright: Unknown, see source link
 * From: http://upshots.org/?p=112
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */
(function ($) {
  $.fn.getStyleObject = function () {
    var dom = this.get(0)
    var style
    var returns = {}
    if (window.getComputedStyle) {
      var camelize = function (a, b) {
        return b.toUpperCase()
      }
      style = window.getComputedStyle(dom, null)
      for (var i = 0;i < style.length;i++) {
        var prop = style[i]
        var camel = prop.replace(/\-([a-z])/g, camelize)
        var val = style.getPropertyValue(prop)
        returns[camel] = val
      }
      return returns
    }
    if (dom.currentStyle) {
      style = dom.currentStyle
      for (var prop in style) {
        returns[prop] = style[prop]
      }
      return returns
    }
    return this.css()
  }
})(jQuery)
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
(function ( jQuery, window, undefined ) {
  'use strict'

  var matched, browser

  jQuery.uaMatch = function ( ua ) {
    ua = ua.toLowerCase()

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
      []

    var platform_match = /(ipad)/.exec(ua) ||
      /(iphone)/.exec(ua) ||
      /(android)/.exec(ua) ||
      []

    return {
      browser: match[ 1 ] || '',
      version: match[ 2 ] || '0',
      platform: platform_match[0] || ''
    }
  }

  matched = jQuery.uaMatch(window.navigator.userAgent)
  browser = {}

  if ( matched.browser) {
    browser[ matched.browser ] = true
    browser.version = matched.version
  }

  if ( matched.platform) {
    browser[ matched.platform ] = true
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if ( browser.chrome) {
    browser.webkit = true
  } else if ( browser.webkit) {
    browser.safari = true
  }

  jQuery.browser = browser
})( jQuery, window)

/*html5 data attribute plugin*/
(function ($) {
  $.fn.hdata = function (one, two) {
    if (two) {
      return this.each(function () {
        $(this).attr('data-' + one, two)
      })
    } else {
      return this.each(function () {
        $(this).attr('data-' + one)
      })
    }

  }
}(jQuery))

/*class function plugin*/
(function ($) {
  $.fn.class = function (obj) {
    if (obj) {
      if (Array.isArray(obj)) {
        obj = obj.join()
      }
      return this.each(function () {
        $(this).attr('class', obj)
      })
    } else {
      return this.each(function () {
        var classes = $(this).attr('class')
        classes = classes.split(' ')
        return classes
      })
    }

  }
}(jQuery))

/*hasAttr function plugin*/
(function ($) {
  $.fn.hasAttr = function (attr) {
    return this.each(function () {
      var att = $(this).attr(attr)
      if (typeof att != 'undefined') {
        return true
      }
      return false
    })
  }
}(jQuery))
