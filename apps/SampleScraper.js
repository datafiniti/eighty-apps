// This is sample code for building a web scraper.
//
// For this sample, we use http://www.houzz.com/pro/jeff-halper/exterior-worlds-landscaping-and-design
// as a sample listing we want to scrape.
// 
// For the full crawler, we will assume the crawl starts from http://www.houzz.com/professionals/

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {

		// We only want to collect data from listing pages
		if (url.match("/pro/") {

			// First we construct an HTML object so we can use Jquery
			var app = this;
			$ = jQuery;
			var $html = app.parseHtml(html, $);
			var object = {};
		
			// Then we use JQuery to find all the attributes we want
			object.name = $html.find('h1').text();
			object.address = $html.find('span[itemprop="streetAddress"]').text();
	                object.city = $html.find('span[itemprop="addressLocality"]').text();
        	        object.state = $html.find('span[itemprop="addressRegion"]').text();
                	object.postalcode = $html.find('span[itemprop="postalCode"]').text();
	                object.contact = $html.find('dt:contains("Contact:")').next().text();

			// Finally, we return the object as a string
			return JSON.stringify(object);
		}
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {

		// We construct the HTML object for Jquery again
		var app = this;
		var $ = jQuery;
		var $html = app.parseHtml(html, $);
		var links = [];

		// We add all the pages in the directory
		$html.find('a.pageNumber').each(function(i, obj) {
			var link = app.makeLink(url, $(this).attr('href'));
			if(link != null) {
				links.push(link);
			}
		});

		// We add all the listings in the directory
                $html.find('a.pro-title').each(function(i, obj) {
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
