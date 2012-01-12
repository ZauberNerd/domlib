
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
	}
};


module('Dom');

test('base requirements', 11, function () {
	equal(typeof dom, 'object', 'dom is an object');
	equal(typeof dom.byId, 'function', 'dom.byId is a function');
	equal(typeof dom.byName, 'function', 'dom.byName is a function');
	equal(typeof dom.byTagName, 'function', 'dom.byTagName is a function');
	equal(typeof dom.query, 'function', 'dom.query is a function');
	equal(typeof dom.byClass, 'function', 'dom.byClass is a function');
	equal(typeof dom.data, 'function', 'dom.data is a function');
	equal(typeof dom.classList, 'function', 'dom.classList is a function');
	equal(typeof dom.event, 'object', 'dom.event is an object');
	equal(typeof dom.helper, 'object', 'dom.helper is an object');
	equal(typeof dom.xhr, 'object', 'dom.xhr is an object');
});

test('id selectors', 3, function () {
	var el = document.createElement('div');
	el.id = 'testid-1';
	document.body.appendChild(el);
	strictEqual(dom.byId('testid-1'), el, "dom.byId('testid-1')");
	strictEqual(dom.byId('testid-1', document.body), el, "dom.byId('testid-1', document.body)");
	strictEqual(dom.byId(undefined), null, "dom.byId(undefined) should result in null");
	document.body.removeChild(el);
});

test('name selectors', 3, function () {
	equal(dom.byName('dom-testname-1').length, 1, "dom.byName('testname-1').length == 1");
	equal(dom.byName('dom-testname-2').length, 2, "dom.byName('testname-2').length == 2");
	equal(dom.byName(null).length, 0, 'expect length to be 0 when passing null as value');
});

test('tagname selectors', 3, function () {
	var div = document.createElement('div');
	div.id = 'testdiv-1';
	var test1 = document.createElement('p');
	var test2 = document.createElement('p');
	var time = document.createElement('time');
	div.appendChild(test1);
	div.appendChild(test2);
	div.appendChild(time);
	document.body.appendChild(div);
	equal(dom.byTagName('html').length, 1, 'expect length of html element to be 1');
	equal(dom.byTagName('p', dom.byId('testdiv-1')).length, 2, 'expect 2 paragraphs in div#testdiv-1');
	strictEqual(dom.byTagName('time', dom.byId('testdiv-1'))[0], time, 'expect time element to be found in div#testdiv-1');
	document.body.removeChild(div);
});

test('query selectors', 41, function () {
	// TODO: rewrite tests
	var test = dom.byId('querytestfixture');
	equal(dom.query('*', test).length, 13, '(*) any element');
	equal(dom.query('header', test).length, 1, '(E) an element of type E');
	equal(dom.query('.firstchild', test)[0].nodeName, 'P', '(.firstchild) an E element whose class is "firstchild"');
	equal(dom.query('#testheader', test).length, 1, '(#testheader) an E element with ID equal to "testheader".');
	equal(dom.query('header h1', test)[0].nodeName, 'H1', '(E F) an F element descendant of an E element');
	equal(dom.query('header > h1 > span', test)[0].innerText || dom.query('header > h1 > span', test)[0].textContent, 'test', '(E > F) an F element child of an E element');
	equal(dom.query('header + article', test).length, 1, '(E + F) an F element immediately preceded by an E element');
	equal(dom.query('header ~ article', test).length, 1, '(E ~ F) an F element preceded by an E element');
	equal(dom.query('[type]', test).length, 3, '(E[type]) an E element with a "foo" type');
	equal(dom.query('[type="checkbox"]', test).length, 1, '(E[type=checkbox]) an E element whose "type" attribute value is exactly equal to "checkbox"');
	equal(dom.query('[class~="second"]', test).length, 1, '(E[class~=second])an E element whose "class" attribute value is a list of whitespace-separated values, one of which is exactly equal to "second"');
	equal(dom.query('[data-test|="bar"]', test).length, 1, '(E[data-test|=bar]) an E element whose "data-test" attribute has a hyphen-separated list of values beginning (from the left) with "bar"');
	equal(dom.query('p[class^="first"]', test).length, 1, '(E[class^=first]) an E element whose "class" attribute value begins exactly with the string "first"');
	equal(dom.query('input[type$="xt"]', test).length, 1, '(E[attribute$=value]) an E element whose "foo" attribute value ends exactly with the string "bar"');
	equal(dom.query('input[class*="con"]', test).length, 1, '(E[attribute*=value]) an E element whose "foo" attribute value contains the substring "bar"');
	equal(dom.query('p:first-child', test).length, 1, '(:first-child) an E element, first child of its parent');
	equal(dom.query('p:lang(en)', test).length, 1, '(:lang()) an element of type E in language "fr" (the document language specifies how language is determined)');
	equal(dom.query(':before', test).length, 0, '(:before) generated content before an E element');
	equal(dom.query('::before', test).length, 0, '(::before) generated content before an E element');
	equal(dom.query(':after', test).length, 0, '(:after) generated content after an E element');
	equal(dom.query('::after', test).length, 0, '(::after) generated content after an E element');
	equal(dom.query('.firstchild:first-letter', test).length, 0, '(:first-letter) the first formatted letter of an E element');
	equal(dom.query('h1 > span::first-letter', test).length, 0, '(::first-letter) the first formatted letter of an E element');
	equal(dom.query(':first-line', test).length, 0, '(:first-line) the first formatted line of an E element');
	equal(dom.query('::first-line', test).length, 0, '(::first-line) the first formatted line of an E element');
	equal(dom.query(':root')[0].nodeName, 'HTML', '(:root) an E element, root of the document');
	equal(dom.query(':last-child', test)[0].innerText || dom.query(':last-child', test)[0].textContent, 'test', '(:last-child) an E element, last child of its parent');
	equal(dom.query(':only-child', test).length, 2, '(:only-child) an E element, only child of its parent');
	equal(dom.query(':nth-child(1)', test).length, 5, '(:nth-child()) an E element, the n-th child of its parent');
	equal(dom.query(':nth-last-child(1)', test).length, 5, '(:nth-last-child()) an E element, the n-th child of its parent, counting from the last one');
	equal(dom.query(':first-of-type', test).length, 8, '(:first-of-type) an E element, first sibling of its type');
	equal(dom.query(':last-of-type', test).length, 8, '(:last-of-type) an E element, last sibling of its type');
	equal(dom.query(':only-of-type', test).length, 6, '(:only-of-type) an E element, only sibling of its type');
	equal(dom.query(':nth-of-type(1)', test).length, 8, '(:nth-of-type()) an E element, the n-th sibling of its type');
	equal(dom.query(':nth-last-of-type(1)', test).length, 8, '(:nth-last-of-type()) an E element, the n-th sibling of its type, counting from the last one');
	equal(dom.query(':empty', test).length, 4, '(:empty) an E element that has no children (including text nodes)');
	equal(dom.query(':not(p)', test).length, 9, '(:not()) an E element that does not match simple selector s');
	equal(dom.query(':target', test).length, 0, '(:target) an E element being the target of the referring URI');
	equal(dom.query(':enabled', test).length, 2, '(:enabled) a user interface element E which is enabled or disabled');
	equal(dom.query(':disabled', test)[0].type, 'text', '(:disabled) a user interface element E which is enabled or disabled');
	equal(dom.query(':checked', test)[0].nodeName, 'INPUT', '(:checked) a user interface element E which is checked (for instance a radio-button or checkbox)');
});

test('class selectors', function () {
	
});

test('data wrapper', function () {
	var datatest = dom.byId('datatest'),
		datatest1 = document.createElement('div'),
		testdata = {
			simple: 'test',
			hyphenSplitted: 'result',
			reallyLongName: 'longresult',
			src: 'foo',
			foo: 'bar'
		};
	datatest1.id = 'datatest1';
	document.body.appendChild(datatest1);
	datatest1 = dom.byId('datatest1');
	for (var i in testdata) {
		dom.data(datatest1, i, testdata[i]);
	}
	equal(dom.data(datatest, 'simple'), 'test', 'reading a simple single word data attribute');
	equal(dom.data(datatest, 'hyphenSplitted'), 'result', 'reading a camelCased property separated by multiple hyphens');
	equal(dom.data(datatest, 'src'), 'foo', 'reading a simple property');
	equal(dom.data(datatest, 'reallyLongName'), 'longresult', 'reading a camelCased property separated by multiple hyphens');
	equal(dom.data(datatest, 'foo', 'bar'), 'bar', 'setting a simple single word attribute should return the value that was just setted');
	equal(dom.data(datatest, 'foo'), 'bar', 'reading the just setted value');
	ok(utils.compareObjects(dom.data(datatest), testdata), 'compare the entire dataset by Object.keys');
	ok(utils.compareObjects(dom.data(datatest1), testdata), 'compare the entire dataset with the returning dataset from an on-the-fly created element');
});

test('classList wrapper', 16, function () {
	var cltest = dom.byId('classlisttest');
	var classes = ['baz', 'foo', 'bar', 'foobar'];
	equal(cltest.className, 'foo bar baz');
	ok(dom.classList(cltest).contains('foo'), '');
	ok(dom.classList(cltest).contains('bar'), '');
	ok(dom.classList(cltest).contains('baz'), '');
	equal(dom.classList(cltest).toString(), 'foo bar baz', '');
	ok(!dom.classList(cltest).toggle('foo'));
	ok(!dom.classList(cltest).contains('foo'), '');
	ok(dom.classList(cltest).toggle('foo'));
	dom.classList(cltest).remove('bar');
	ok(!dom.classList(cltest).contains('bar'), '');
	equal(cltest.className, 'baz foo', '');
	dom.classList(cltest).add('foobar');
	ok(dom.classList(cltest).contains('foobar'), '');
	equal(dom.classList(cltest).length, 3, '');
	equal(dom.classList(cltest)[0], 'baz', '');
	Array.prototype.slice.call(dom.classList(cltest)).forEach(function (classname) {
		ok(classes.indexOf(classname) !== -1, classname);
	});
});

test('dom events', function () {
	
});

test('helper methods', 3, function () {
	var returnval = { called: true };
	var testfn = function () { ok(true, 'this function should only be executed once although it is called twice'); return returnval; };
	var once = dom.helper.once(testfn);
	strictEqual(once(), returnval, 'the function should return the returnval object ({ called: true })');
	strictEqual(once(), null, 'for the second call the function should return the value null');
});

test('xhr', function () {
	
});