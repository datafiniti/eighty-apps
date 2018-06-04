// This 80app returns all links found on a page

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
		var object = {};

		// Get text
		var text = "";
		$html.find('p,div,h1,h2,h3,h4,h5,li,td').each(function(i) {
			text += " " + $(this).text();
		});

                // gets all keyword matches in the text
		var keywordList = [
			"80legs",
			"web"
		];
		var matches = [];
		for (i = 0; i < keywordList.length; i++) {
			var regex = new RegExp(keywordList[i],"gi");
                	matches.push(text.match(regex));
		}
		object.matches = matches;

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

module.exports = function (EightyAppBase) {
	EightyApp.prototype = new EightyAppBase();
	return new EightyApp();
}
