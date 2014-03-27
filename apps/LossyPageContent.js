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

		// Get lossy content by removing html tags and javascript
                var lossyHTML = html;
                lossyHTML = lossyHTML.replace(/<script[\s\S]*?<\/script>/gi,"");
                lossyHTML = lossyHTML.replace(/<style[\s\S]*?<\/style>/gi,"");
                lossyHTML = lossyHTML.replace(/<[\s\S]*?>/g,"");
                object.lossyHTML = lossyHTML;

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
