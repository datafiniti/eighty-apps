// This 80app returns all links found on a page

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
		var object = {};

                // gets all external links in the html document
		var r = /:\/\/(.[^/]+)/;
		var urlDomain = url.match(r)[1]
                var links = [];
                $html.find('a').each(function(i, obj) {
                        // console.log($(this).attr('href'));
                        var link = app.makeLink(url, $(this).attr('href'));

                        if(link != null) {
				var linkDomain = link.match(r)[1];
				if (urlDomain != linkDomain) {
					links.push(link);
				}
                        }
                });
		object.externalLinks = links;

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
