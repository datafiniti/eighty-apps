/**
 * This 80app can be used to crawl images. The following properties of an image will be returned:
 *  - base64: the image encoded using base64
 *  - byteSize: the size of the image
 *  - width: the width of the image in pixels
 *  - height: the height of the image in pixels
 *  - type: the true type of the image i.e. jpg, png etc. This goes off the metadata of the
 *          image itself as opposed to the extension in the url
 * 
 * If the content of the url cannot be identified as an image, the 80app will return an
 * empty object.
 *
 *  Note: This 80app will ONLY work against urls that have ?80flag=type:image tacked onto the
 *       end of the url
 */

const EightyApp = require('eighty-app');
const sizeOf = require('image-size');

const app = new EightyApp();

app.processDocument = function (arrayBuffer, url, headers, status) {
    if (status > 299) {
        return {};
    }

    const base64 = arrayBufferToBase64(arrayBuffer);

    if (!base64) {
        return {};
    }

    const dimensions = sizeOf(arrayBuffer);

    const data = {
        ...dimensions,
        byteSize: arrayBuffer.length,
        base64,
        sourceURL: url.replace("?80flag=type:image", "")
    };


    return JSON.stringify(data);
}

app.parseLinks = function (html, url, headers, status, cheerio) {
    if (status > 299) {
        return [];
    }

    url = url.replace("?80flag=type:image", "");
    if (url.match(/\.(bmp|cur|dds|gif|icns|ico|jpg|png|psd|svg|tiff|webp)$/)) {
        return [];
    }

    const links = [];
    const $html = app.parseHtml(html, cheerio);

    $html.find('img').each(function () {
        // Add the 80flag to the image url to let the crawler know to base 64 encode the image.
        // The 80flag is also the filter used in the processDocument section
        const link = app.append80FlagToLink("type:image", cheerio(this).attr("src"));
        links.push(link);
    });

    // gets all links in the html document
    $html.find('a').each(function () {
        const link = app.makeLink(url, cheerio(this).attr('href'));

        if (link != null) {
            links.push(link);
        }
    });

    return app.eliminateDuplicates(links);;
}

function arrayBufferToBase64(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

module.exports = function () {
    return app;
}