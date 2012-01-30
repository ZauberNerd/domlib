
var utils = {
	compareObjects: function (a, b) {
		var keysA = Object.keys(a);
		var keysB = Object.keys(b);
		if (keysA.length !== keysB.length) {
			return false;
		}
		for (var i = 0; i < keysA.length; i += 1) {
			if (b[keysA[i]] !== a[keysA[i]]) {
				return false;
			}
		}
		return true;
	},
	isArray: function (arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}
};

TestCase('base requirements', {

	testBasics: function () {
		expectAsserts(11);
		assertObject('dom is an object', dom);
		assertFunction('dom.byId is a function', dom.byId);
		assertFunction('dom.byName is a function', dom.byName);
		assertFunction('dom.byTagName is a function', dom.byTagName);
		assertFunction('dom.query is a function', dom.query);
		assertFunction('dom.byClass is a function', dom.byClass);
		assertFunction('dom.data is a function', dom.data);
		assertFunction('dom.classList is a function', dom.classList);
		assertObject('dom.event is an object', dom.event);
		assertObject('dom.helper is an object', dom.helper);
		assertObject('dom.xhr is an object', dom.xhr);
	}

});



TestCase('selectors', {

	testIDSelectors: function () {
		expectAsserts(3);
		/*:DOC += <div id="id-test"></div>*/
		assertElementId("dom.byId('id-test')",  'id-test', dom.byId('id-test'));
		assertElementId("dom.byId(undefined) should result in null" , null, dom.byId(undefined));
		assertElementId("dom.byId('') should result in null", null, dom.byId(''));
	},

	testNameSelectors: function () {
		expectAsserts(4);
		/*:DOC += <div id="name-test"><img name="testname-1"><input name="testname-2"><input name="testname-2"></div> */
		assertEquals("dom.byName('testname-1').length == 1", 1, dom.byName('testname-1').length);
		assertEquals("dom.byName('testname-2').length == 2", 2, dom.byName('testname-2').length);
		assertEquals('expect length to be 0 when passing null as value', 0, dom.byName(null).length);
		assertEquals('expect length to be 0 when passing \'\' as value', 0, dom.byName('').length);
	},

	testTagNameSelectors: function () {
		expectAsserts(3);
		/*:DOC += <div id="tagname-test"><p>test</p><p>lorem ipsum</p><time></time></div> */
		assertEquals('expect length of html element to be 1', 1, dom.byTagName('html').length);
		assertEquals('expect 2 paragraphs in div#testdiv-1', 2, dom.byTagName('p', dom.byId('tagname-test')).length);
		assertEquals('expect time element to be found in div#testdiv-1', 1, dom.byTagName('time', dom.byId('tagname-test')).length);
	},

	testClassNameSelectors: function () {
		expectAsserts(4);
		/*:DOC += <div id="classname-test"><div class="testclass1"></div><img class="testclass2" id="testclass2"><img class="testclass3 testclass4"><p class="testclass3"></p></div> */
		assertClassName('msg', 'testclass1', dom.byClass('testclass1')[0]);
		assertEquals('', dom.byId('testclass2'), dom.byClass('testclass2')[0]);
		assertEquals('', 'testclass3 testclass4', dom.byClass('testclass4')[0].className);
		assertEquals('', 2, dom.byClass('testclass3').length);
	},

	testQuerySelectors: function () {
/*
		var el = dom.byId('query-test');
		strictEqual(dom.query('*', el), dom.byTagName('*', el), 'any element');
		strictEqual(dom.query('E', el), dom.byTagName('E', el), 'an element of type E');
		test(dom.query('E.warning', el), '', 'an E element whose class is "warning" (the document language specifies how class is determined).');
		strictEqual(dom.query('E#myid', el), dom.byId('#myid'), 'an E element with ID equal to "myid".');
		test(dom.query('E F', el), '', 'an F element descendant of an E element');
		test(dom.query('E > F', el), '', 'an F element child of an E element');
		test(dom.query('E + F', el), '', 'an F element immediately preceded by an E element');
		test(dom.query('E ~ F', el), '', 'an F element preceded by an E element');
		test(dom.query('E[foo]', el), '', 'an E element with a "foo" attribute');
		test(dom.query('E[foo="bar"', el), '', 'an E element whose "foo" attribute value is exactly equal to "bar"');
		test(dom.query('E[foo~="bar"]', el), '', 'an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar"');
		test(dom.query('E[foo^="bar"]', el), '', 'an E element whose "foo" attribute value begins exactly with the string "bar"');
		test(dom.query('E[foo$="bar"]', el), '', 'an E element whose "foo" attribute value ends exactly with the string "bar"');
		test(dom.query('E[foo*="bar"]', el), '', 'an E element whose "foo" attribute value contains the substring "bar"');
		test(dom.query('E[foo|="en"]', el), '', 'an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en"');
		test(dom.query('E:root', el), '', 'an E element, root of the document');
		test(dom.query('E:nth-child(n)', el), '', 'an E element, the n-th child of its parent');
		test(dom.query('E:nth-last-child(n)', el), '', 'an E element, the n-th child of its parent, counting from the last one');
		test(dom.query('E:nth-of-type(n)', el), '', 'an E element, the n-th sibling of its type');
		test(dom.query('E:nth-last-of-type(n)', el), '', 'an E element, the n-th sibling of its type, counting from the last one');
		test(dom.query('E:first-child', el), '', 'an E element, first child of its parent');
		test(dom.query('E:last-child', el), '', 'an E element, last child of its parent');
		test(dom.query('E:first-of-type', el), '', 'an E element, first sibling of its type');
		test(dom.query('E:last-of-type', el), '', 'an E element, last sibling of its type');
		test(dom.query('E:only-child', el), '', 'an E element, only child of its parent');
		test(dom.query('E:only-of-type', el), '', 'an E element, only sibling of its type');
		test(dom.query('E:empty', el), '', 'an E element that has no children (including text nodes)');
		test(dom.query('E:link', el), '', 'an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited)');
		test(dom.query('E:visited', el), '', 'an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited)');
		test(dom.query('E:active', el), '', 'an E element during certain user actions');
		test(dom.query('E:hover', el), '', 'an E element during certain user actions');
		test(dom.query('E:focus', el), '', 'an E element during certain user actions');
		test(dom.query('E:target', el), '', 'an E element being the target of the referring URI');
		test(dom.query('E:lang(fr)', el), '', 'an element of type E in language "fr" (the document language specifies how language is determined)');
		test(dom.query('E:enabled', el), '', 'a user interface element E which is enabled or disabled');
		test(dom.query('E:disabled', el), '', 'a user interface element E which is enabled or disabled');
		test(dom.query('E:checked', el), '', 'a user interface element E which is checked (for instance a radio-button or checkbox)');
		test(dom.query('E::first-line', el), '', 'the first formatted line of an E element');
		test(dom.query('E::first-letter', el), '', 'the first formatted letter of an E element');
		test(dom.query('E::before', el), '', 'generated content before an E element');
		test(dom.query('E::after', el), '', 'generated content after an E element');
		test(dom.query('E:not(s)', el), '', 'an E element that does not match simple selector s');
*/
	}

});



TestCase('data wrapper', {
	testDataGet: function () {
		expectAsserts(3);
		/*:DOC el = <div id="data-test" data-simple="simplecontent" data-some-longer-names-and-more-hyphens="1" data-test1="number"></div> */
		assertEquals('', 'simplecontent', dom.data(this.el, 'simple'));
		assertEquals('', '1', dom.data(this.el, 'someLongerNamesAndMoreHyphens'));
		assertEquals('', 'number', dom.data(this.el, 'test1'));
	},
	testDataSet: function () {
		expectAsserts(6);
		/*:DOC el = <div id="data-test-set"></div> */
		assertEquals('', 'simplecontent', dom.data(this.el, 'simple', 'simplecontent'));
		assertEquals('', '1', dom.data(this.el, 'someLongerNamesAndMoreHyphens', '1'));
		assertEquals('', 'number', dom.data(this.el, 'test1', 'number'));
		assertEquals('', 'simplecontent', dom.data(this.el, 'simple'));
		assertEquals('', '1', dom.data(this.el, 'someLongerNamesAndMoreHyphens'));
		assertEquals('', 'number', dom.data(this.el, 'test1'));
	},
	testDataWrapper: function () {
		expectAsserts(2);
		/*:DOC el = <div id="data-test" data-simple="simplecontent" data-some-longer-names-and-more-hyphens="1" data-test1="number"></div> */
		assertTrue('', utils.compareObjects({ simple: 'simplecontent', someLongerNamesAndMoreHyphens: '1', test1: 'number' }, dom.data(this.el)));
		dom.data(this.el, 'test1Test2T3st3', 'correctresult');
		assertTrue('', utils.compareObjects({ simple: 'simplecontent', someLongerNamesAndMoreHyphens: '1', test1: 'number', test1Test2T3st3: 'correctresult' }, dom.data(this.el)));
	}
});



TestCase('classList wrapper', {
	testClassList: function () {
		expectAsserts(3);
		/*:DOC el = <div id="classlist-test" class="testclass1 testclass2"></div> */
		assertEquals('', 2, dom.classList(this.el).length);
		assertEquals('', 'testclass1', dom.classList(this.el)[0]);
		assertEquals('', 'testclass2', dom.classList(this.el)[1]);
	},
	testClassListAdd: function () {
		expectAsserts(3);
		/*:DOC el = <div id="classlist-test"></div> */
		dom.classList(this.el).add('testclass1');
		assertClassName('', 'testclass1', this.el);
		dom.classList(this.el).add('testclass2');
		assertClassName('', 'testclass1 testclass2', this.el);
		dom.classList(this.el).add('testclass2');
		assertClassName('', 'testclass1 testclass2', this.el);
	},
	testClassListRemove: function () {
		expectAsserts(3);
		/*:DOC el = <div id="classlist-test" class="testclass1 testclass2"></div> */
		dom.classList(this.el).remove('testclass1');
		assertClassName('', 'testclass2', this.el);
		dom.classList(this.el).remove('testclass2');
		assertClassName('', '', this.el);
		dom.classList(this.el).add('testclass1');
		assertClassName('', 'testclass1', this.el);
	},
	testClassListToggle: function () {
		expectAsserts(8);
		/*:DOC el = <div id="classlist-test" class="testclass1 testclass2"></div> */
		assertFalse(dom.classList(this.el).toggle('testclass1'));
		assertClassName('', 'testclass2', this.el);
		assertTrue(dom.classList(this.el).toggle('testclass1'));
		assertClassName('', 'testclass2 testclass1', this.el);
		assertFalse(dom.classList(this.el).toggle('testclass1'));
		assertClassName('', 'testclass2', this.el);
		assertFalse(dom.classList(this.el).toggle('testclass2'));
		assertClassName('', '', this.el);
	},
	testClassListContains: function () {
		expectAsserts(3);
		/*:DOC el = <div id="classlist-test" class="testclass1 testclass2"></div> */
		/*:DOC el2 = <div id="classlist-test-3" class="testclass3"></div> */
		assertTrue(dom.classList(this.el).contains('testclass1'));
		assertTrue(dom.classList(this.el).contains('testclass2'));
		assertFalse(dom.classList(this.el2).contains('testclass2'));
	}
});



TestCase('events', {
	eventFire: function(el, etype){
		if (el.fireEvent) {
			(el.fireEvent('on' + etype));
		} else {
			var evObj = document.createEvent('MouseEvents');
			evObj.initMouseEvent(etype, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			el.dispatchEvent(evObj);
		}
	},
	setUp: function () {
		/*:DOC el = <div id="test-event-connect"><a id="test-event-connect-a">test</a><label id="test-event-connect-label" for="test-event-click"><input id="test-event-click"></label></div> */
		var el = this.el;
		this.anchorClick = function (e) {
			var target = e.target || win.srcElement;
			assertEquals('', el.firstChild, target);
		};
		this.anchorClick2 = function (e) {
			var target = e.target || win.srcElement;
			assertEquals('', el.firstChild, target);
		};
		this.inputClick = function (e) {
			var target = e.target || win.srcElement;
			assertEquals('', el.getElementsByTagName('input')[0], target);
		};
		this.labelClick = function (e) {
			var target = e.target || win.srcElement;
			assertEquals('', el.getElementsByTagName('label')[0], target);
		};
	},
	testEventConnect: function () {
		expectAsserts(5);
		var el = this.el;
		dom.event.connect(el.firstChild, 'click', this.anchorClick);
		dom.event.connect(el.firstChild, 'click', this.anchorClick2);
		dom.event.connect(el.getElementsByTagName('label')[0], 'click', this.labelClick);
		dom.event.connect(el.getElementsByTagName('input')[0], 'click', this.inputClick);
		this.eventFire(el.firstChild, 'click');
		this.eventFire(el.getElementsByTagName('label')[0], 'click');
		this.eventFire(el.getElementsByTagName('input')[0], 'click');
		this.eventFire(el.getElementsByTagName('input')[0], 'click');
	},
	testEventDisconnect: function () {
		expectAsserts(1);
		var el = this.el;
		dom.event.connect(el.firstChild, 'click', this.anchorClick);
		dom.event.connect(el.firstChild, 'click', this.anchorClick2);
		dom.event.connect(el.getElementsByTagName('label')[0], 'click', this.labelClick);
		dom.event.connect(el.getElementsByTagName('input')[0], 'click', this.inputClick);
		dom.event.disconnect(el.firstChild, 'click', this.anchorClick);
		dom.event.disconnect(el.getElementsByTagName('label')[0], 'click', this.labelClick);
		dom.event.disconnect(el.getElementsByTagName('input')[0], 'click', this.inputClick);
		this.eventFire(el.firstChild, 'click');
		this.eventFire(el.getElementsByTagName('label')[0], 'click');
		this.eventFire(el.getElementsByTagName('input')[0], 'click');
		this.eventFire(el.getElementsByTagName('input')[0], 'click');
	},
	testEventPreventDefault: function () {
		
	}
});



TestCase('helper', {
	testOnce: function () {
		expectAsserts(3);
		var returnVal = 'once';
		var once = dom.helper.once(function () {
			assertTrue(true);
			return returnVal;
		});
		assertEquals(returnVal, once());
		assertEquals(null, once());
	},
	testList2Array: function () {
		/*:DOC el = <div id="list2array-test"><input><input><input><input></div>  */
		assertFalse('', utils.isArray(this.el.children));
		assertTrue('', utils.isArray(dom.helper.list2Array(this.el.children)));
	}
});



AsyncTestCase('helper.loadScript', {
	testLoadScript: function (queue) {
		expectAsserts(5);
		queue.call('', function () {
			assertUndefined('', window.GLOBALVAR);
		});
		queue.call('', function () {
			assertException('', function () { dom.helper.loadScript(); }, 'Error');
		});
		queue.call('', function () {
			assertException('', function () { dom.helper.loadScript('/test/test/fixtures/test-loadScript.js'); }, 'Error');
		});
		queue.call('', function (callbacks) {
			var loadedCallback = callbacks.add(function () {
				assertNotUndefined('', window.GLOBALVAR);
			});
			dom.helper.loadScript('/test/test/fixtures/test-loadScript.js', 'test-loadScript1', loadedCallback);
		});
		queue.call('', function () {
			assertNotUndefined('', window.GLOBALVAR);
		});
	}
});



AsyncTestCase('xhr', {
	testRequest: function (queue) {
		var response,
			xhrObj;
		queue.call('', function (callbacks) {
			var successCallbackHTML = callbacks.add(function (responseText, xhrObj) {
				assertEquals('', '<h1>success</h1>', responseText);
			});
			var errorCallback = callbacks.addErrback('should not fail');
			dom.xhr.request('GET', '/test/test/fixtures/test-xhr.html', successCallbackHTML, errorCallback);
		});
		queue.call('', function (callbacks) {
			var successCallbackJSON = callbacks.add(function (responseObj, xhrObj) {
				if ((xhrObj.getResponseHeader('Content-Type') || ';').split(';')[0] === 'application/json') {
					assertObject(responseObj);
					assertEquals('success', responseObj.status);
				} else {
					assertEquals('{ "status": "success" }', responseObj);
				}
			});
			var errorCallback = callbacks.addErrback('should not fail');
			dom.xhr.request('GET', '/test/test/fixtures/test-xhr.json', successCallbackJSON, errorCallback);
		});
		queue.call('', function (callbacks) {
			var successCallback = callbacks.addErrback('should not fail');
			var errorCallback = callbacks.add(function (status, xhrObj) {
				assertEquals(404, status);
			});
			dom.xhr.request('GET', '/test/test/fixtures/non-existent', successCallback, errorCallback);
		});
	},
	testGet: function () {
		
	},
	testPost: function () {
		
	},
	testFormData: function () {
		
	}
});
