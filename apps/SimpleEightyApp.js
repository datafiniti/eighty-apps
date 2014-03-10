var EightyApp = function() {
	this.processDocument = function(html, url, headers, status) {
		return html;
	}

	this.parseLinks = function(html, url, headers, status) {
		var app = this;
		var $html = app.parseHtml(html);
		var links = [];

		// gets all links from the featured products section
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
