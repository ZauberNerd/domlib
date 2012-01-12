YAHOO.env.classMap = {"dom.xhr": "dom", "dom.FormData": "dom", "dom": "dom", "dom.classList": "dom", "dom.helper": "dom", "dom.event": "dom"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};