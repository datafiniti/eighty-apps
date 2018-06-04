/* ************************************************************************
 * This 80app's parseLinks only returns URLs that have the same domain as *
 * the current URL being crawled.                                         *
 *                                                                        *
 * The processDocument returns text from each URL crawled.                *
 **************************************************************************
 */

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
		var app = this,
			$ = jQuery,
			$html = app.parseHtml(html, $),
			object = {};

		// Get crawl date
		object.dateCrawled = app.formatDate(Date.now());

		// Get text
		var text = "";
		$html.find('p,h1,h2,h3,h4,h5,li,td').each(function(i) {
			text += " " + $(this).text();
		});
		object.text = text;

		return JSON.stringify(object);
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {
		var app = this,
			$ = jQuery,
			$html = app.parseHtml(html, $),
			links = [],

			r = /:\/\/(.[^\/]+)/,
			urlDomain = url.match(r)[1];

		// gets all links in the html document
		var link,
			linkDomain;
		$html.find('a').each(function(i, obj) {
			link = app.makeLink(url, $(this).attr('href'));

			if(link != null) {
	            linkDomain = link.match(r)[1]
				if (urlDomain == linkDomain) {
					links.push(link);
				}
			}
		});

		return links;
	}
}

module.exports = function (EightyAppBase) {
	EightyApp.prototype = new EightyAppBase();
	return new EightyApp();
}
