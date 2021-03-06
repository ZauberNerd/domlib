/**
 * @preserve
 * Copyright (c) 2012 Bjoern Brauer
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * Module for Dom Manipulations, Traversing and some small helpers
 * @module dom
 * @class dom
 * @static
 */
(function (win, doc, undefined) {
    'use strict';

    var domtools = (function () {
        // noop function which is used as selector engine if your browser doesn't support querySelectorAll and if you didn't set a selectorEngine using dom.setSelectorEngine.
        function selectorEngine() { throw new Error('The CSS Selector Engine isn\'t ready yet!'); }
        return {
            /**
             * Returns an Element by its ID
             * @method byId
             * @param {String} id The ID of the Element you want to reference
             * @return {Element} If there is an Element with the given ID it will be returned - otherwise the returnvalue is undefined
             */
            byId: function (id) { return doc.getElementById(id); },
            /**
             * Returns Elements by their Name
             * @method byName
             * @param {String} name The Name of the Element you want to reference
             * @return {[NodeList]} Returns a NodeList of Elements which match the given Name
             */
            byName: function (name) { return doc.getElementsByName(name); },
            /**
             * Returns Elements by their Tagname
             * @method byTagName
             * @param {String} tag The Tagname of the Element you want to reference
             * @param {Element} scope Optional: You could provide a Scope of an Element to search only inside that Scope for Elements
             * @return {[NodeList]} Returns a NodeList of Elements which match the given Tagname
             */
            byTagName: function (tag, scope) { return (scope || doc).getElementsByTagName(tag); },
            /**
             * Returns Elements by their className
             * @method byClass
             * @param {String} classname The className you want to search for
             * @param {Element} scope Optional: You could provide a Scope of an Element to search only inside that Scope for Elements
             * @return {[NodeList]} Returns a NodeList of Elements which have the given className
             */
            byClass: typeof doc.getElementsByClassName === 'undefined' ?
                    typeof doc.querySelectorAll === 'undefined' ?
                            function (classname, scope) { return selectorEngine('.' + classname, (scope || doc)); } :
                            function (classname, scope) { return (scope || doc).querySelectorAll('.' + classname); } :
                            function (classname, scope) { return (scope || doc).getElementsByClassName(classname); },
            /**
             * Returns Elements using a CSS Selector Query
             * @method query
             * @param {String} selector Any CSS Selector. For Example: a[href="#"] or p > div > .foo.bar ~ span
             * @param {Element} scope Optional: You could provide a Scope of an Element to search only inside that Scope for Elements
             * @return {[NodeList]} Returns a NodeList of Elements which match the given Selector
             */
            query: typeof doc.querySelectorAll === 'undefined' ?
                    function (selector, scope) { return selectorEngine(selector, (scope || doc)); } :
                    function (selector, scope) { return (scope || doc).querySelectorAll(selector); },
            /**
             * If the Browser doesn't support querySelectorAll add the Method setSelectorEngine to domtools which replaces the noop function selectorEngine with i.e. Sizzle or something else.
             * This Method will only be avaialable if the Browser doesn't support querySelectorAll, so you have to test if this method exists and if it's true you must call it and pass a CSS Selector Engine.
             * Otherwise domtools.query and domtools.byClass will throw an Error everytime you call them.
             * The easiest way: Create an init function for your application and check if domtools.setSelectorEngine is a function, if not you could call your init function, otherwise load Sizzle and call then your init function.
             * @method setSelectorEngine
             * @param {Function} engine The Selector Engine you want to use
             */
            setSelectorEngine: typeof doc.querySelectorAll === 'undefined' ? function (engine) { selectorEngine = engine; } : null
        };
    }());

    /**
     * A Wrapper Function for getting and setting custom data-* Attributes on Dom Elements
     * @param {Element} el The Element on which you want operate
     * @param {String} key Optional: If you don't provide a Key and optVal you will return an Object containing all data-* Properties (camelCased). Otherwise you could provide a Key to get or set a specific Attribute.
     * @param {String} optVal Optional: If you don't specify a value, the current data-* Value for the given Key is returned. Otherwise you can set the Value
     * @return {Mixed} Depends on how many Parameters you specify you get either an Object containing all data-* Values or the specific Value you've get/set.
     */
    domtools.data = (function () {
        var fn;
        if (!('dataset' in doc.createElement('a'))) {
            fn = (function () {
                /**
                 * A Helper Function for camelCasing Strings which have hyphens in it (for example: 'foo-bar-baz' would become 'fooBarBaz').
                 * @method camelCase
                 * @private
                 * @param {String} string The String you want to camelcase
                 * @return {String} A String without hypens where every Character directly after a hyphen is camelcased.
                 */
                function camelCase(string) {
                    return string.replace(/-([a-z])/ig, function (all, letter) { return letter.toUpperCase(); });
                }
                /**
                 * A Helper Function for hyphenating Strings which are camelCased (for example: 'fooBarBaz' would become 'foo-bar-baz').
                 * @method hyphenate
                 * @private
                 * @param {String} string The String you want to hyphenate
                 * @return {String} A lowercased String with hyphens before every Character which was before uppercased.
                 */
                function hyphenate(string) {
                    return string.replace(/([A-Z])/g, function (all, letter) { return '-' + letter.toLowerCase(); });
                }
                /**
                 * A Helper Function for getting the Value of an data-* Attribute
                 * @method getData
                 * @private
                 * @param {Element} el The Dom Element on which you operate
                 * @param {String} string The Key of the data-* Attribute you want to read
                 * @return {String} The Value from the custom data-* Attribute
                 */
                function getData(el, key) {
                    return el.getAttribute('data-' + hyphenate(key));
                }
                /**
                 * A Helper Function for setting the Value of an data-* Attribute
                 * @method setData
                 * @private
                 * @param {Element} el The Dom Element on which you operate
                 * @param {String} string The Key of the data-* Attribute you want to set
                 * @param {String} val The Value you want to write in the data-* Attribute
                 * @return {String} The Value from the custom data-* Attribute
                 */
                function setData(el, key, val) {
                    el.setAttribute('data-' + hyphenate(key), val);
                    return val;
                }
                /**
                 * A Helper Function for setting the Value of an data-* Attribute
                 * @method getSetData
                 * @private
                 * @param {Element} el The Element on which you want operate
                 * @param {String} key Optional: If you don't provide a Key and optVal you will return an Object containing all data-* Properties (camelCased). Otherwise you could provide a Key to get or set a specific Attribute.
                 * @param {String} optVal Optional: If you don't specify a value, the current data-* Value for the given Key is returned. Otherwise you can set the Value
                 * @return {Mixed} Depends on how many Parameters you specify you get either an Object containing all data-* Values or the specific Value you've get/set.
                 */
                function getSetData(el, key, optVal) {
                    if (typeof key !== 'undefined') {
                        // if optVal is undefined, return the data-[key], otherwise set data[key] to optVal
                        return typeof optVal === 'undefined' ? getData(el, key) : setData(el, key, optVal);
                    } else {
                        // if optVal and key is undefined iterate over all attributes and return all attribute values which starts with data-
                        var attrs = el.attributes,
                            len = attrs.length,
                            data = {};
                        while (len -= 1) {
                            if (attrs[len].name.indexOf('data-') === 0) {
                                data[camelCase(attrs[len].name.substr(5))] = attrs[len].value;
                            }
                        }
                        return data;
                    }
                }
                return getSetData;
            }());
        } else {
            fn = function (el, key, optVal) {
                return typeof optVal === 'undefined' ? typeof key === 'undefined' ? el.dataset : el.dataset[key] : el.dataset[key] = optVal;
            };
        }
        return fn;
    }());

    /**
     * Element.classList Polyfill / Submodule
     * @module dom
     * @namespace dom
     * @submodule classList
     * @class classList
     * @method classList
     * @constructor
     * @static
     * @param {Element} el
     */
    domtools.classList = (function () {
        var ClassList;
        if (!('classList' in doc.createElement('a'))) {
            ClassList = {};
            /**
             * Returns a Constructor Function whichs prototype is set to Array.prototype
             * @method getRegularConstructor
             * @return {Function} Returns a Constructor Function which can then extended by adding Methods to its Prototype
             * @private
             */
            ClassList.getRegularConstructor = function () {
                /**
                 * Constructor Function for the classList Polyfill
                 * @method Constructor
                 * @param {Element} el The Element from which you want to get / set / toggle the classNames
                 * @private
                 */
                Constructor = function (el) {
                    /**
                     * Internal Array of Classes from the className property of the Element
                     * @private
                     * @type property
                     */
                    var classes = el.className.trim();
                    Array.prototype.push.apply(this, (classes ? classes.split(/\s+/) : []));
                    /**
                     * Method for updating the className Property of the HTML Element
                     * @protected
                     */
                    this._updateClassName = function () { el.className = this.toString(); };
                };
                Constructor.prototype = Array.prototype;
                return Constructor;
            };
            /**
             * Returns a Constructor Function which basically is an Array Object borrowed from an iframe. IE 7 and below can't handle a Constructor Function whichs prototype is set to Array.prototype,
             * so we create an iframe and pass the Array Object from the iframe to its parent Window. We then use this regular Array Object and extending it's prototype.
             * @method getIE7Constructor
             * @return {Function} Returns a Constructor Function which can then extended by adding Methods to its Prototype
             * @private
             */
            ClassList.getIE7Constructor = function () {
                // create an hidden iframe and pass it's Array Object back to our main window to extend it and use it as ClassList Constructor
                var iframe = doc.createElement('iframe');
                iframe.style.display = 'none';
                doc.body.appendChild(iframe);
                // pass the Array Object to the parent window as LTEie7ClassListPolyFill
                iframe.contentWindow.document.write("<script>parent.LTEie7ClassListPolyFill = Array;</script>");
                // Because the iframe doesn't have the Ecmascript5 Polyfills we've included we need to set the prototype manually
                LTEie7ClassListPolyFill.prototype.indexOf = Array.prototype.indexOf;
                // We only extending the Array Object, so we need to create the own Methods and Properties which regulary sits in the Constructor function as prototypes too.
                LTEie7ClassListPolyFill.prototype.init = function (el) {
                    /**
                     * Internal Array of Classes from the className property of the Element
                     * @private
                     * @type property
                     */
                    var classes = el.className.trim();
                    /**
                     * Internal reference to the dom node
                     * @private
                     * @type property
                     */
                    this.__int_dom_el = el;
                    this.push.apply(this, (classes ? classes.split(/\s+/) : []));
                };
                /**
                 * Method for updating the className Property of the HTML Element
                 * @protected
                 */
                LTEie7ClassListPolyFill.prototype._updateClassName = function () {
                    this.__int_dom_el.className = this.toString();
                };
                return LTEie7ClassListPolyFill;
            };
            /**
             * Method that returns a Constructor Function for creating a classList Object
             * @method getConstructor
             * @return {Function} Returns a Constructor Function which can then extended by adding Methods to its Prototype
             * @private
             */
            ClassList.getConstructor = function () {
                var Constr;
                Constr = this.getRegularConstructor();
                // Create a new ClassList Object, pass a small Object containing a className property and test if the length property of the ClassList Object is correct.
                // If not, we are on an IE7 or below who can't subclass the Array Object so we need a workaround.
                if ((new Constr({ className: 'foo bar baz' })).length !== 3) {
                    Constr = this.getIE7Constructor();
                }
                return Constr;
            };
            ClassList = ClassList.getConstructor();
            /**
             * Adds a class to the className of the Element
             * @method add
             * @param {String} token Name of the class which should be added
             */
            ClassList.prototype.add = function (token) {
                if (!this.contains(token)) {
                    this.push(token);
                    this._updateClassName();
                }
            };
            /**
             * Removes a class from the className of the Element
             * @method remove
             * @param {String} token Name of the class which should be removed
             */
            ClassList.prototype.remove = function (token) {
                var index = this.indexOf(token.trim());
                if (index !== -1) {
                    this.splice(index, 1);
                    this._updateClassName();
                }
            };
            /**
             * Toggles a class on the given Element on and off
             * @method toggle
             * @param {String} token Name of the class which you want to toggle
             * @return {Boolean} Returns true if the class was added or false when the class was removed
             */
            ClassList.prototype.toggle = function (token) {
                if (this.contains(token)) {
                    this.remove(token);
                    return false;
                } else {
                    this.add(token);
                    return true;
                }
            };
            /**
             * Checks if the given class already exists on the Element
             * @method contains
             * @param {String} token Name of the class to be checked
             * @return {Boolean} Returns true if the Element already has the given Class
             */
            ClassList.prototype.contains = function (token) { return this.indexOf(token.trim()) !== -1; };
            /**
             * Creates a String of the classes contained in the classList separated by whitespaces to write them into the className property of an Element
             * @method toString
             * @return {String} String of the classes contained in the classList separated by whitespaces
             */
            ClassList.prototype.toString = function () { return this.join(' '); };
            if (!!ClassList.init) {
                // if we are on an IE7 or below return our extended Array ClassList polyfill which needs special initialization
                return function (el) { var cl = new ClassList(); cl.init(el); return cl; };
            }
            // if we are in a Browser which doesn't natively supports el.classList, return our regular ClassList Constructor
            return function (el) {return new ClassList(el); };
        } else {
            // we are on a modern Browser which does have the native classList Implementation, so let's return it
            return function (el) { return el.classList; };
        }
    }());

    /**
     * Submodule for Dom Event handling
     * @module dom
     * @namespace dom
     * @submodule event
     * @class event
     */
    domtools.event = {
        /**
         * Shorthand Function for event.preventDefault and event.stopPropagation.
         * This Method replaces itself on its first invocation with a Method specialized for the current Browser.
         * @param {Event} ev The Eventobject
         * @param {Boolean} stopPropagation Optional: Pass true, if you also want to stop the Event from bubbling up
         */
        preventDefault: function (ev, stopPropagation) {
            var fn;
            if (typeof ev !== 'undefined' && ev.preventDefault) {
                fn = function (e, stopPropagation) {
                    e.preventDefault();
                    stopPropagation && e.stopPropagation();
                };
            } else if (typeof win.event !== 'undefined') {
                fn = function (e, stopPropagation) {
                    win.event.returnValue = false;
                    stopPropagation && (win.event.cancelBubble = true);
                };
            }
            this.preventDefault = fn;
            return fn(ev || win.event, stopPropagation);
        }
    };
    if (typeof win.addEventListener === 'function') {
        // Standard conform Browsers
        /**
         * Method for registering Callback Functions to Dom Events
         * @param {Element} el The Element on which the listener should be bound
         * @param {String} event The Eventtype you want listen for
         * @param {Function} listener The Listener Callback which will be exected when the Event occurs
         */
        domtools.event.connect = function (el, event, listener) { el && el.addEventListener(event, listener, false); };
        /**
         * Method for deregistering Callback Functions to Dom Events
         * @param {Element} el The Element on which the listener is currently bound
         * @param {String} event The Eventtype the listener is registered for
         * @param {Function} listener The Listener Callback which was registred for this event
         */
        domtools.event.disconnect = function (el, event, listener) { el && el.removeEventListener(event, listener, false); };
    } else if (typeof doc.attachEvent !== 'undefined') {
        // old IE Browsers
        domtools.event.connect = function (el, event, listener) { el && el.attachEvent('on' + event, listener); };
        domtools.event.disconnect = function (el, event, listener) { el && el.detachEvent('on' + event, listener); };
    } else {
        // even older Browsers (not sure if it's still needed, since we won't support dinosaur Browsers)
        domtools.event.connect = function (el, event, listener) { el['on' + event] = listener; };
        domtools.event.disconnect = function (el, event, listener) { delete el['on' + event]; };
    }

    /**
     * Submodule for some helper functions
     * @module dom
     * @namespace dom
     * @submodule helper
     * @class helper
     */
    domtools.helper = {
        /**
         * Method that takes a function and returns a function which can only be executed once
         * @method once
         * @param {Function} fn The Function you want to 'protect' for executing more than once
         * @return {Function} Returns a Function which can only be executed once (deletes the reference to the original function and fails silently)
         */
        once: function (fn) {
            return function () {
                var callback = fn;
                fn = null;
                return callback && callback();
            };
        },
        /**
         * Method that takes a DOM NodeList and returns an array
         * @method list2Array
         * @param {NodeList} list the DOM NodeList
         * @return {Array} Returns the DOM NodeList converted to an array
         */
        list2Array: function (list) {
            var arr = [],
                len = list.length,
                i;
            for (i = 0; i < len; i += 1) {
                arr[i] = list[i];
            }
            return arr;
        },
        /**
         * Method for loading Javascript Files asynchronously
         * @method loadScript
         * @param {String} url the Url of the Script that should be loaded
         * @param {String} id A unique Name to prevent loading the same file twice (this ID will be used as a Dom ID)
         * @param {Function} callback Optional: A Callback Function which should be executed when the Script is fully loaded (the callback gets also executed if the file is already loaded)
         * @return {Boolean} Returns false if the Script is already loaded
         */
        loadScript: (function () {
            var queue = {},
                fjs = doc.getElementsByTagName('script')[0],
                scriptLoaded = function (id) {
                    // standard conform browsers fire onload event. IE fires onreadystatechange events and sometimes only 'complete' or 'loaded'
                    if (typeof this.readyState === 'undefined' || this.readyState === 'complete' || this.readyState === 'loaded') {
                        queue[id] && queue[id]();
                        delete queue[id];
                    }
                };
            return function (url, id, callback) {
                if (typeof url === 'undefined' || typeof id === 'undefined') {
                    throw new Error('You must provide an unique id and an url from where the script should be loaded!');
                }
                if (typeof queue[id] === 'undefined') {
                    queue[id] = this.once(callback);
                } else {
                    return;
                }
                var js = doc.createElement('script');
                js.id = id;
                js.src = url;
                js.async = true;
                js.onload = js.onreadystatechange = scriptLoaded.bind(js, id);
                fjs.parentNode.insertBefore(js, fjs);
            };
        }())
    };

    /**
     * Submodule for making Ajax-Calls
     * @module dom
     * @namespace dom
     * @submodule xhr
     * @class xhr
     */
    domtools.xhr = {
        /**
         * Method for making Ajax Requests
         * @method request
         * @param {String} method The Method that should be used for the request ('get' or 'post', will be automatically transformed to uppercase).
         * @param {String} url The Url to which the Ajax call should be made
         * @param {Mixed} data Optional: The data you want to send
         * @param {Function} success The Success Callback will be called if the Request was made Successful (readyState === 4, httpStatus === 200).
         * It gets called with 2 Parameters, first is responseText, second is the xhr Object used for this request.
         * @param {Function} error The Error Callback will be called if the Server responded with a different StatusCode than 200
         * It gets called width 2 Parameters, first is HTTP Status Code, second is the xhr Object used for this request.
         * @return {Object} Returns the XMLHttpRequest Object for that Request.
         */
        request: function (method, url, data, success, error) {
            var headers = [['X-Requested-With', 'XMLHttpRequest']],
                xhr = new win.XMLHttpRequest();
            // adjust parameters
            if (typeof data === 'function') {
                error = success;
                success = data;
                data = null;
            } else if (typeof method === 'object') {
                url = method.url;
                data = method.data || null;
                success = method.success;
                error = method.error;
                headers = headers.concat(method.headers || []);
                method = method.method;
            }
            xhr.open(method.toUpperCase(), url, true);
            headers.forEach(function (header) {
                xhr.setRequestHeader(header[0], header[1]);
            });
            xhr.onreadystatechange = function () {
                var responseText,
                    contentType;
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        responseText = this.responseText;
                        contentType = this.getResponseHeader('Content-Type');
                        if ((contentType || ';').split(';')[0] === 'application/json') {
                            // if response Content-Type is json, parse it and return the Javascript Object
                            try {
                                responseText = JSON.parse(responseText);
                            } catch (e) {
                                responseText = this.responseText;
                            }
                        }
                        success && success(responseText, this);
                    } else {
                        error && error(this.status, this);
                    }
                }
            };
            xhr.send(data);
            return xhr;
        },
        /**
         * Method / Shortcut for making Ajax Get Requestes
         * @method get
         * @param {String} url The Url to which the Ajax call should be made
         * @param {Function} success The Success Callback will be called if the Request was made Successful (readyState === 4, httpStatus === 200).
         * @param {Function} error The Error Callback will be called if the Server responded with a different StatusCode than 200
         * @return {Object} Returns the XMLHttpRequest Object for that Request.
         */
        get: function (url, callback, error) {
            return this.request('GET', url, null, callback, error);
        },
        /**
         * Method / Shortcut for making Ajax Post Requestes
         * @method post
         * @param {String} url The Url to which the Ajax call should be made
         * @param {Mixed} data Optional: The data you want to send
         * @param {Function} success The Success Callback will be called if the Request was made Successful (readyState === 4, httpStatus === 200).
         * @param {Function} error The Error Callback will be called if the Server responded with a different StatusCode than 200
         * @return {Object} Returns the XMLHttpRequest Object for that Request.
         */
        post: function (url, data, callback, error) {
            var headers;
            // if data is an instance of this.FormData and data._boundary is defined it's our polyfill and we need to set the required http headers
            if (data instanceof this.FormData && typeof data._boundary !== 'undefined') {
                headers = [['Content-Type', data._contentType]];
                data = data.toString();
            }
            return this.request({
                method: 'POST',
                url: url,
                data: data,
                success: callback,
                error: error,
                headers: headers
            });
        },
        /**
         * Small FormData polyfill (doesn't work with input type="file" / binary data)
         * @class FormData
         * @module dom
         * @namespace dom
         * @submodule FormData
         * @constructor
         * @param {Element} form Optional: You could pass a Form-Element to the Constructor to create an FormData Object from it
         */
        FormData: (function () {
            var _FormData;
            if (typeof win.FormData === 'undefined') {
                _FormData = function (form) {
                    var inputs = [].concat(
                        domtools.helper.list2Array(domtools.byTagName('input', form)),
                        domtools.helper.list2Array(domtools.byTagName('select', form)),
                        domtools.helper.list2Array(domtools.byTagName('textarea', form))
                    );
                    this._fields = [];
                    this._boundary = '----FormDataBoundary' + Math.random() * 10;
                    this._contentType = 'multipart/form-data; boundary=' + this._boundary;
                    inputs.forEach(function (field) {
                        var val;
                        if (field.type === 'checkbox' || field.type === 'radio') {
                            if (field.checked) {
                                val = field.value || 1;
                            }
                        } else if (field.nodeName === 'SELECT') {
                            field.value && (val = field.value);
                        } else {
                            val = field.value;
                        }
                        if (typeof val !== 'undefined') {
                            this.append(field.name, val);
                        }
                    }, this);
                };
                /**
                 * Method for adding data to the FormData Element
                 * @param {String} key The Key that should be used
                 * @param {Mixed} val The Value
                 */
                _FormData.prototype.append = function (key, val) {
                    this._fields.push([key, val]);
                };
                /**
                 * Creating the multipart/form-data String
                 * @return {String} All Fields concatenated
                 */
                _FormData.prototype.toString = function () {
                    var body = '';
                    this._fields.forEach(function (field) {
                        body += '--' + this._boundary + '\r\n';
                        body += 'Content-Disposition: form-data; name="' + field[0] + '";\r\n\r\n';
                        body += field[1] + '\r\n';
                    }, this);
                    body += '--' + this._boundary + '--';
                    return body;
                };
                return _FormData;
            } else {
                return win.FormData;
            }
        }())
    };
    win.dom = domtools;
}(window, document));