var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {

		// First we construct an HTML object so we can use Jquery
		var app = this;
		$ = jQuery;
		var $html = app.parseHtml(html, $);
		var object = {};
		
		// Finally, we return the object as a string
		return JSON.stringify(object);
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {

		// We construct the HTML object for Jquery again
		var app = this;
		var $ = jQuery;
		var $html = app.parseHtml(html, $);
		var links = [];

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
