// Returns a list of emails for every page on the domains of the URL list
const EightyApp = require('eighty-app');
const app = new EightyApp();

const EMAIL_REGEX = /([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})/ig;

app.processDocument = function(html, url, headers, status, cheerio, extras) {
    let data = {};
    const { isEmail } = extras.validator;

    // Get emails
    const emails = html.match(EMAIL_REGEX);

    if (emails) {

        data.emails = emails.filter(email => isEmail(email));
    }

    // It's possible that one page could contain the same email address multiple times, so we deduplify them.
    return app.removeAllDuplicates(data);
};

app.parseLinks = function(html, url, headers, status, jQuery) {
    let $ = jQuery;
    let $html = app.parseHtml(html, $);
    let links = [];

    let r = /:\/\/(.[^/]+)/;
    let urlDomain = url.match(r)[1];

    // gets all links in the html document
    $html.find('a').each(function(i, obj) {
        // console.log($(this).attr('href'));
        let link = app.makeLink(url, $(this).attr('href'));

        if (link != null) {
            let linkDomain = link.match(r);
            if (linkDomain && linkDomain.length > 1) {
                linkDomain = linkDomain[1];
                if (urlDomain.toLowerCase() == linkDomain.toLowerCase())
                    links.push(link);
            }
        }
    });

    return links;
};

module.exports = () => {
    return app;
};
