
// This 80app returns the count of every domain linked from each URL crawled
// The 80app will only crawl to links on the current domain.

var EightyApp = function() {
    this.processDocument = function(html, url, headers, status, jQuery) {
        var app = this;
        var $ = jQuery;
        var $html = app.parseHtml(html, $);
        var object = {};

        // gets all links in the html document
        var domainCount = {};
        var r = /:\/\/(.[^/]+)/;

        $html.find('a').each(function(i, obj) {
            var link = app.makeLink(url, $(this).attr('href'));

            if (link != null) {
                var linkDomain = link.match(r);
                if (linkDomain && linkDomain.length > 1) {
                    linkDomain = linkDomain[1];
                }

                if (linkDomain in domainCount) {
                    domainCount[linkDomain] = domainCount[linkDomain] + 1;
                } else {
                    domainCount[linkDomain] = 1;
                }
            }
        });
        object.domainCount = domainCount;

        return JSON.stringify(object);
    };

    this.parseLinks = function(html, url, headers, status, jQuery) {
        var app = this;
        var $ = jQuery;
        var $html = app.parseHtml(html, $);
        var links = [];

        var r = /:\/\/(.[^/]+)/;
        var urlDomain = url.match(r)[1];

        // gets all links in the html document
        $html.find('a').each(function(i, obj) {
            // console.log($(this).attr('href'));
            var link = app.makeLink(url, $(this).attr('href'));

            if (link != null) {
                var linkDomain = link.match(r);

                if (linkDomain && linkDomain.length > 1) {
                    linkDomain = linkDomain[1];
                }

                if (urlDomain.toLowerCase() == linkDomain.toLowerCase()) {
                    links.push(link);
                }
            }
        });

        return links;
    };
};

module.exports = function (EightyAppBase) {
    EightyApp.prototype = new EightyAppBase();
    return new EightyApp();
};
