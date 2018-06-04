// This 80app returns all links and keywords, with their counts, found on a page

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
		var object = {};

                // gets all links in the html document
                var links = [];
                $html.find('a').each(function(i, obj) {
                        // console.log($(this).attr('href'));
                        var link = app.makeLink(url, $(this).attr('href'));

                        if(link != null) {
				links.push(link);
                        }
                });
		object.links = links;

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
