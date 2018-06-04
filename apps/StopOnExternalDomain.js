// Keeps crawling until it hits an external domain and then stops.
// Returns status code for every URL crawled.

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
		var app = this;
		$ = jQuery;
		var $html = app.parseHtml(html, $);
		var object = {};

		// Get crawl date
		object.dateCrawled = app.formatDate(Date.now());

		// Get HTML
		object.status = status;

		return JSON.stringify(object);
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {
		var app = this;
		var $ = jQuery;
		var $html = app.parseHtml(html, $);
		var links = [];

		var r = /:\/\/(.[^/]+)/;
		var urlDomain = url.match(r)[1];

                var eightyvalue = app.get80Value(url);
                if (eightyvalue == null) eightyvalue = url;

		var startingURLDomain = eightyvalue.match(r)[1];

		if (startingURLDomain == urlDomain) {
			// gets all links in the html document
			$html.find('a').each(function(i, obj) {
				var link = app.makeLink(url, $(this).attr('href'));

				if (link != null) {
					link = app.append80FlagToLink(eightyvalue, link);
					links.push(link);
				}
			});
		} else {
			// do nothing (return empty set) if on external domain
		}

		return links;
	}
}

module.exports = function (EightyAppBase) {
	EightyApp.prototype = new EightyAppBase();
	return new EightyApp();
}
