// This 80app collects document data and images

var EightyApp = function() {

    this.processDocument = function(html, url, headers, status, jQuery) {
        // Create empty object for storing image information.
        var object = {};

        // Check for 80flag that will indicate that the url is an image.
        if (url.match("80flag=type:image")) {

            // Append the correct prefix  based on image type.
            var encodedString = "";
            if (url.match(".jpg")) {
                encodedString = "data:image/jpg;base64," + html;
            } else if (url.match(".png")) {
                encodedString = "data:image/png;base64," + html;
            } else if (url.match(".gif")) {
                encodedString = "data:image/gif;base64," + html;
            }

            // Generate a new image object, set source as the base64 encoded string.
            var image = new Image();
            image.src = encodedString;

            // Convert the encoded string to binary.
            var binary = atob(encodedString.split(",")[1]);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);

            // Get turn the binary into a blog to get the image size in bytes.
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            var myBlob = new Blob([view]);

            // Add information to object to be returned.
            object.byteSize = myBlob.size;
            object.width = image.width;
            object.height = image.height;
            object.binary = binary;
            object.source_url = url.replace("?80flag=type:image", "");

        }
	// Collect document data
	else {
	    object.title = $html.filter('title').text();
            object.meta_description = $html.filter('meta[name="description"]').attr('content');
            object.meta_keywords= $html.filter('meta[name="keywords"]').attr('content');
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
	}

        return JSON.stringify(object);
    };

    this.parseLinks = function(html, url, headers, status, $) {
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
                links = app.eliminateDuplicates(links);
            });
            return links;
        }

    };
};

try {
    // Testing
    module.exports = function(EightyAppBase) {
        EightyApp.prototype = new EightyAppBase();
        return new EightyApp();
    };

} catch (e) {
    // Production
    console.log("Eighty app exists.");
    EightyApp.prototype = new EightyAppBase();
}
