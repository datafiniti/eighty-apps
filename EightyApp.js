var EightyAppBase = function() {
    var authStatus;

    var initialize = function() {
        authStatus = false;
    };

    this.processDocument = function(html, url, headers, status, jQuery) {};

    this.parseLinks = function(html, url, headers, status, jQuery) {};

    this.parseJSON = function(text) {
        return JSON.parse(text);
    }

    this.parseHtml = function(text, $) {
        text = text.replace(/(<img)\+*?/g, "<img80");
        return $(text);
    }

    this.getPlainText = function(text) {
        text = text
            .replace(/[^a-z0-9\s.'-:]/gi, '') // remove all characters not a-z, 0-9, and certain punctuation, ignoring case
        .replace(/\s{2,}/g, ' ') // replace any two whitespace characters next to each other with a single space
        .replace(/\s/g, ' '); // replace all whitespace characters (\t,\n,\r, ) with space

        // trim
        return text.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    };

    this.formatDate = function(date) {
        // yyyy-MM-ddTHH:mm:ssZ
        date = new Date(date);
        return date.getUTCFullYear() + '-' +
            (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : '' + (date.getUTCMonth() + 1)) + '-' +
            (date.getUTCDate() < 10 ? '0' + date.getUTCDate() : '' + date.getUTCDate()) +
            'T' +
            (date.getUTCHours() < 10 ? '0' + date.getUTCHours() : '' + date.getUTCHours()) + ':' +
            (date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : '' + date.getUTCMinutes()) + ':' +
            (date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : '' + date.getUTCSeconds()) +
            'Z';
    }

    this.removeTag = function(text) {
        return text.replace(/<.*?>/g, "");
    }

    this.getFirstMatch = function(text, regexp) {
        regexp = regexp
        var matchedGroup = regexp.exec(text);
        if (matchedGroup !== null && matchedGroup !== undefined) {
            return matchedGroup[1].trim();
        }
    }

    this.makeLink = function(url, link) {

        try {
            // gets the host from the url
            var host = url.match(/^http[s]?:\/\/[^/]+/);
            host = host ? host[0] : null;

            // checks if the link already has a host
            var linkHost = link.match(/^http[s]?:\/\/[^/]+/);
            if (linkHost == null) {
                // returns the link with the host added
                if (link.match(/^\//g)) {
                    return host + link;
                } else {
                    return host + '/' + link;
                }
            }
        } catch (e) {
            // returns the original link
            return link;
        }
    }

    // eliminateDuplicates code borrowed from: http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
    this.eliminateDuplicates = function(arr) {
        var i;
        var len = arr.length;
        var out = [];
        var obj = {};

        for (i = 0; i < len; i++) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = {};
                out.push(arr[i]);
            }
        }
        return out;
    }

    //$= under $25
    //$$= $25-$40
    //$$$= $50-$55
    //$$$$= above $55
    //£ = under £15
    //££ = £15-£25
    //£££ = £30-£35
    //££££ = above £35

    //replaces dollar sign notation into dollar amounts to capture price range details
    this.getPriceRangeReplace = function(text, currency) {
        if (text != undefined && currency == "USD") {
            var priceRange = text.replace("$$$$", "Above USD 55.00").replace("$$$", "USD 50.00-55.00").replace("$$", "USD 25.00-40.00").replace("$", "USD 0.00-25.00");
            return priceRange;
        } else if (text != undefined && currency == "GBP") {
            var priceRange = text.replace("££££", "Above GBP 35.00").replace("£££", "GBP 30.00-35.00").replace("££", "GBP 115.00-25.00").replace("£", "GBP 0.00-15.00");
            return priceRange;
        }

    };

    // The following is included to make this testable with node.js
    try {
        if (module != null) {
            var $ = this.$ = "";
        }
    } catch (e) {}
    this.processTest = function(html, url, headers, status) {
        var app = this;
        var env = require('jsdom').env;
        env(html, function(errors, window) {
            $ = this.$ = require('jquery')(window);
            var result = app.processDocument(html, url, headers, status, $);
            console.log(result);
            var links = app.parseLinks(html, url, headers, status, $);
            console.log(links);
        });
    }
};

try {
    // Testing
    module.exports = EightyAppBase;
} catch (e) {
    // Production
}