# Swiss Army Knife

Work in Progress. I'm converting this old lib of mine from jQuery to native/browserify standards.

The original readme is as follows:

jquery.rrToolbelt.js
=================

- Global (and generic) functions for use anywhere in the js code

Dependencies:
- jQuery - //cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
- jquery.rrToolbelt.ua.xml - Normally included with this file

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
