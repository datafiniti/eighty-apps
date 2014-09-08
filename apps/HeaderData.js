// This 80app returns the header data from each URL crawled

var EightyApp = function() {
        this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
                var object = {};

		var headersArray = headers.split("\r\n");
		for (var i = 0; i < headersArray.length; i++) {
			var keyvalArray = headersArray[i].split(": ");
			var key = keyvalArray[0];
			var value = keyvalArray[1];
			object[key] = value;
		}

                return JSON.stringify(object);
        }

        this.parseLinks = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
                var links = [];

                // gets all links in the html document
                $html.find('a').each(function(i, obj) {
                        var link = app.makeLink(url, $(this).attr('href'));

                        if(link != null) {
                                links.push(link);
                        }
                });

                return links;
        }
}

try {
        // Testing
        module.exports = function(EightyAppBase) {
                EightyApp.prototype = new EightyAppBase();
                return new EightyApp();
        }
} catch(e) {
        // Production
        console.log("Eighty app exists.");
        EightyApp.prototype = new EightyAppBase();
}
