/*!
Spot.js: load a CSS files asynchronously and cache it in localStorage
(c) 2015 Andrew Shapel
Licensed MIT
*/

(function(window, document) {
  'use strict';

  function Spot(config) {
    this.config = config || {};
    this.config.stylesheets = this.config.stylesheets || {};
  };

  /*
  * Processes the received configuration and sets the processed
  * information to the config
  * @param {Object} config Object of configureation
  */

  Spot.prototype.configure = function(config) {
    config.baseUrl = (config.baseUrl && config.baseUrl[config.baseUrl.length - 1] != '/')? config.baseUrl + '/': config.baseUrl;
    var stylesheets = {};
    if(config.stylesheets) {
      for(var stylesheet in config.stylesheets) {
        if(config.stylesheets.hasOwnProperty(stylesheet)) {
          stylesheets[stylesheet] = {
            href: (config.baseUrl || String()) + config.stylesheets[stylesheet],
            options: {}
          };
        }
      }
    }
    if(config.options) {
      for(var option in config.options) {
        if(config.options.hasOwnProperty(option) && stylesheets.hasOwnProperty(option)) {
          stylesheets[option].options = config.options[option];
        }
      }
    }

    this.config.baseUrl = config.baseUrl || String();
    this.config.stylesheets = stylesheets || {};
  }

  /*
  * Gets the stylesheet by doing get request to the url
  * @param {String} href Url from which be load a stylesheet
  * @param {String} name Name attribute of link
  * @param {String} media Media attribute of link
  * @param {Object} before DOM element, before which will be inserted a link
  * @param [Callback] callback Will be called after insertion of link into DOM
  */

  Spot.prototype.addStylesheet = function(href, name, media, before, callback) {
    var self = this;
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = function() {
      if(ajaxRequest.status == 200) {
        self.addStylesheetRules(ajaxRequest.responseText, href, name, media, before, callback);
      }
    }
    ajaxRequest.open('GET', href, true);
    ajaxRequest.send();
  }

  /*
  * Create a style and add it to the DOM, then insert a stylesheet into it
  * @param {String} content Content of stylesheet
  * @param {String} href
  * @param {String} name
  * @param {String} media
  * @param {Object} before
  * @param [Callback]
  * @returns {String} content Stylesheet rules
  */

  Spot.prototype.addStylesheetRules = function(content, href, name, media, before, callback) {
    var stylesheet = window.document.createElement('style');
    var script = before || window.document.querySelectorAll('script')[0];

    stylesheet.type = 'text/css';
    stylesheet.title = name;
    // Set media attribute to fetch link withount blocking render
    stylesheet.media = 'only x';
    stylesheet.setAttribute('data-href', href);

    if(stylesheet.styleSheet) {
      stylesheet.styleSheet.cssText = content;
    }
    else {
      stylesheet.appendChild(window.document.createTextNode(content));
    }

    // Article about why insertBefore more safety instead appendChild function
    // http://www.paulirish.com/2011/surefire-dom-element-insertion/
    script.parentNode.insertBefore(stylesheet, script);
    this.setMedia(stylesheet, media);

    if(callback) {
      callback(stylesheet, content);
    }

    return stylesheet;
  }

  /*
  * Gets stylesheet from the localStorage by a name or
  * href, then parse it into object
  * @param {String} name
  * @param {String} href
  * @returns {Object} stylesheet object
  */

  Spot.prototype.findInLocalStorage = function(name, href) {
    var stylesheetContent = window.localStorage.getItem(name) || window.localStorage.getItem(href);
    if(stylesheetContent && stylesheetContent.length > 0) {
      stylesheetContent = JSON.parse(stylesheetContent);
    }

    return stylesheetContent;
  }

  /*
  * Sets media attribute to link
  * @param {Object} link
  * @param {String} media
  */

  Spot.prototype.setMedia = function(link, media) {
    if(link.sheet) {
      link.media = media || 'all';
    }
    else {
      setTimeout(function() {
        setMedia(link, media);
      }, 1);
    }
  }

  Spot.prototype.isLocalStorageSupports = function() {
    if(window.hasOwnProperty('localStorage') && window.localStorage !== null) {
      return true;
    }
    return false;
  }

  /*
  * Save stylesheet to the localStorage by
  * the key, which may be a name or href
  * @param {String} name
  * @param {String} href
  * @param {String} media
  * @param {String} stylesheet
  * @param {Number} expireHours Lifetime of saved stylesheet
  */

  Spot.prototype.saveInLocalStorage = function(name, href, media, stylesheet, expireHours) {
    var hoursStamp = new Date().getHours();
    var expireStamp = new Date();
    expireStamp.setHours(hoursStamp + expireHours);
    var key = name || href;
    var content = {
      name: key,
      href: href,
      media: media,
      stylesheet: stylesheet,
      timeStamp: new Date().getTime().toString(),
      expireStamp: expireStamp.getTime().toString()
    };

    window.localStorage.setItem(key, JSON.stringify(content));
  }

  /*
  * Load a stylesheet and cache it into localStorage
  * @param {String} href
  * @param {Object} options Sets of settings for loadable stylesheet
  * @param [Callback] callback Will be called after stylesheet has been loaded
  */

  Spot.prototype.cssAsyncLoad = function(href, options, callback) {
    var options = options || {};
    var name = options.name || String();
    var before = options.before || null;
    var media = options.media || null;
    var expire = options.expire || 1;

    var self = this;

    var link = document.querySelector('style[data-href="' + href + '"]');
    if(!link && this.isLocalStorageSupports) {
      var cachedStylesheet = this.findInLocalStorage(name, href);
      if(!cachedStylesheet || (cachedStylesheet && (new Date().getTime().toString() > cachedStylesheet.expireStamp))) {
        this.addStylesheet(href, name, media, before, function(stylesheet, content) {
          self.saveInLocalStorage(name, href, media, content, expire);
          if(callback) {
            callback(stylesheet);
          }
        });
      }
      else if(cachedStylesheet && (new Date().getTime().toString() < cachedStylesheet.expireStamp)) {
        this.addStylesheetRules(cachedStylesheet.stylesheet, href, cachedStylesheet.name, cachedStylesheet.media, before, function(stylesheet, content) {
          if(callback) {
            callback(stylesheet);
          }
        });
      }
    }
  }

  /*
  * Load multiple styleseets using config
  * @param {Array} styleseets
  * @param [Callback] callback
  */

  Spot.prototype.load = function(stylesheets, callback) {
    var self = this;
    var callbacksLinks = [];
    stylesheets.forEach(function(stylesheet) {
      if(typeof stylesheet === 'string' && self.config.stylesheets.hasOwnProperty(stylesheet)) {
        self.cssAsyncLoad(self.config.stylesheets[stylesheet].href, self.config.stylesheets[stylesheet].options, function(link) {
          callbacksLinks.push(link);
        })
      }
      else {
        self.cssAsyncLoad(stylesheet.href, stylesheet.options, function(link) {
          callbacksLinks.push(link);
        });
      }
    });

    if(callback && callbacksLinks.length > 0) {
      callback.apply(null, callbacksLinks);
    }
  }

  window.Spot = new Spot();

})(this, document);
