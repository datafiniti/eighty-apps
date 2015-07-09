/* ************************************************************************
 * This 80app's parseLinks only returns URLs that have the same domain as *
 * the current URL being crawled.                                         *
 *                                                                        *
 * The processDocument returns a timestamp for when the URL was crawled,  *
 * and a list of words on the page with their frequencies.                *
 **************************************************************************
 */

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
		var app = this;
		$ = jQuery;
		var $html = app.parseHtml(html, $);
		var object = {};

		// Get crawl date
		object.dateCrawled = app.formatDate(Date.now());

		// Get keyword frequency
		var keywordCount = {};
		$html.find('p,h1,h2,h3,h4,h5,td,div').each(function() {
			var textBlockArray = $(this).text().split(/,?\s+/);
			for (var i = 0; i < textBlockArray.length; i++) {
				var keyword = textBlockArray[i].toLowerCase();
				if (keyword in keywordCount) {
					keywordCount[keyword] = keywordCount[keyword] + 1;
				} else {
					keywordCount[keyword] = 1;
				}
			}			
		});
		object.keywordCount = keywordCount;

		return JSON.stringify(object);
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {
		var app = this;
		var $ = jQuery;
		var $html = app.parseHtml(html, $);
		var links = [];

		var r = /:\/\/(.[^/]+)/;
		var urlDomain = url.match(r)[1]

		// gets all links in the html document
		$html.find('a').each(function(i, obj) {
			var link = app.makeLink(url, $(this).attr('href'));

			if(link != null) {
	                        var linkDomain = link.match(r)[1]
				// only crawl link if domain is the same of current URL
				if (urlDomain == linkDomain) {
					// append 80flag
					link = app.append80FlagToLink("your_value_here", link);
					links.push(link);
				}
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
