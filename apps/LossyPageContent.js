/* ************************************************************************
 * The processDocument for this 80app returns the HTML with all style,    *
 * blocks, script blocks, and HTML tags stripped out.                     * 
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

		return app.replaceSpecialCharacters(JSON.stringify(object));
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

module.exports = function (EightyAppBase) {
	EightyApp.prototype = new EightyAppBase();
	return new EightyApp();
}
