// This 80app returns the following attributes from each URL crawled:
// * title
// * meta tags
// * links (everything in an 'a' tag)

var EightyApp = function() {
        this.processDocument = function(html, url, headers, status, jQuery) {
                var app = this;
                var $ = jQuery;
                var $html = app.parseHtml(html, $);
                var object = {};

		object.date_crawled = app.formatDate(Date.now());
                object.title = $html.filter('title').text();
                object.meta_description = $html.filter('meta[name="description"]').attr('content');
                object.meta_keywords = $html.filter('meta[name="keywords"]').attr('content');
                object.meta_subject = $html.filter('meta[name="subject"]').attr('content');

		// Get lossy content by removing html tags and javascript
                var lossyHTML = html;
                lossyHTML = lossyHTML.replace(/<script[\s\S]*?<\/script>/gi,"");
                lossyHTML = lossyHTML.replace(/<style[\s\S]*?<\/style>/gi,"");
                lossyHTML = lossyHTML.replace(/<[\s\S]*?>/g,"");
                object.lossyHTML = lossyHTML;

                var meta_tags = [];
                $html.filter('meta').each(function(i, obj) {
                        var meta_obj = {};
                        meta_obj.name = $(this).attr('name');
                        meta_obj.content = $(this).attr('content');
                        meta_tags.push(meta_obj);
                });
                object.meta_tags = meta_tags;

                // gets all links in the html document
                var links = [];
                $html.find('a').each(function(i, obj) {
                        var link = app.makeLink(url, $(this).attr('href'));
                        if(link != null) {
                                links.push(link);
                        }
                });
                object.links = links;

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
