var EightyApp = function() {
    this.processDocument = function(html, url, headers, status, jQuery) {
        var object = {},
            sizeOf = require('image-size'),
            imageBuffer = new Buffer(html, "base64"),
            imageDimensions = sizeOf(imageBuffer),
            imageSize = Buffer.byteLength(html, "base64");

        object.byteSize = imageSize;
        object.width = imageDimensions.width;
        object.height = imageDimensions.height;
        object.base64 = html;
        object.source_url = url.replace("?80flag=type:image", "");

        return JSON.stringify(object);
    }

    this.parseLinks = function(html, url, headers, status, jQuery) {
        var links = [];

        // If already on an image url, just return the empty links array.
        if (url.match(/\.(jpg|png|gif)/g)) {
            return links;
        } else {
            // Use jQuery to parse the document
            var app = this;
            $ = jQuery;
            var $html = app.parseHtml(html, $);

            // 80Legs converts <img> tags into <img80> tags, so find the img80 tags.
            $html.find('img80').each(function(i, obj) {
                // Add the 80flag to the image url to let the crawler know to base 64 encode the image.
                // The 80flag is also the filter used in the processDocument section
                var link = app.append80FlagToLink("type:image", $(this).attr("src"));
                links.push(link);
            });

            // gets all links in the html document
            $html.find('a').each(function(i, obj) {
                var link = app.makeLink(url, $(this).attr('href'));

                if(link != null) {
                    links.push(link);
                }
            });

            links = app.eliminateDuplicates(links);

            return links;
        }

    }
}

module.exports = function (EightyAppBase) {
    EightyApp.prototype = new EightyAppBase();
    return new EightyApp();
}