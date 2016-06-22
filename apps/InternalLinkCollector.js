// This 80app returns all internal links found on a page

var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
		var object = {};

                // gets all intenral links in the html document
		var r = /:\/\/(.[^/]+)/;
		var urlDomain = url.match(r)[1]
                var links = [];
                $html.find('a').each(function(i, obj) {
                    if ($(this).attr('href')) {
                        app.say($(this).attr('href'));
                        var link = app.makeLink(url, $(this).attr('href'));
                        app.say(link);
			            if (link != null) {
                            var linkDomain = link.match(r);
	                        if (linkDomain && linkDomain.length > 1) {
	                            linkDomain = linkDomain[1];
				                if (urlDomain == linkDomain)
				                    links.push(link);
	                       }
			            }
			        }
                });
                
		object.internalLinks = links;

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
			// console.log($(this).attr('href'));
			    var link = app.makeLink(url, $(this).attr('href'));

			    if (link != null) {
                    var linkDomain = link.match(r);
	                if (linkDomain && linkDomain.length > 1) {
	                    linkDomain = linkDomain[1];
				    if (urlDomain == linkDomain)
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
