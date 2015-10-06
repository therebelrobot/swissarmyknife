/* ******************************

jquery.rrToolbelt.js

https://github.com/therebelrobot/jquery.rrToolbelt

- Global (and generic) functions for use anywhere in the js code

Dependencies:
  jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js

Available functions:

 Global Functions:
  $_GET(p) - retrieves GET information from the URL, where p is the desired parameter (same as PHP: $_GET[p])

  win.size(), win.h([%]), win.w([%]) - returns window viewport dimensions, optional percentages in h and w

  $_resp(func) - run on initial, and any time the window reloads

  $_toUni(str) - converts string to unicode

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

/*GET URL parameters*/
function params (p) {
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

/*Window size functions*/
var win = {
  size: function () {
    var dim = {
      h: win.h(),
      w: win.w()
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
var resp = function (func) {
  func()
  $(window).resize(function () {
    func()
  })
}
/*string to unicode conversion*/
function toUni (theString) {
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

/* JQUERY FUNCTIONS - Only run if window.jQuery is present*/
if(window.jQuery){
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
  })(window.jQuery)
  /* jquery.browser plugin
   *    https://github.com/gabceb/jquery-browser-plugin
   *    $.browser.msie - bool
   *    $.browser.webkit - bool
   *    $.browser.mozilla - bool
   *
   *    $.browser.ipad - bool
   *    $.browser.iphone - bool
   *    $.browser.android - bool
   *
   *    $.browser.version - string
   */
  (function ($) {
    'use strict'

    var matched, browser

    $.uaMatch = function ( ua ) {
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

    matched = $.uaMatch(window.navigator.userAgent)
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

    $.browser = browser
  })(window.jQuery)

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
  }(window.jQuery))

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
  }(window.jQuery))

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
  }(window.jQuery))
}

module.exports = {
  params: params,
  win: win,
  resp: resp,
  toUni: toUni
}
