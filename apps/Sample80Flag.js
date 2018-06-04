// An exampe for passing an 80flag value around through the parseLinks method

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
		return html;
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
				// append 80flag
				link = app.append80FlagToLink("your_value_here", link);
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
