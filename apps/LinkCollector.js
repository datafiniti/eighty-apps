// This 80app returns all links found on a page

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
		var object = {};

                // gets all links in the html document
                var links = [];
                $html.find('a').each(function(i, obj) {
                        var link = app.makeLink(url, $(this).attr('href'));
			var text = $(this).text();
			var linkObject = {};
			linkObject.link = link;
			linkObject.text = text;

                        if (link != null) {
				links.push(linkObject);
                        }
                });
		object.links = links;

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
