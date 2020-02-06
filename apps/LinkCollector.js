const EightyApp = require('eighty-app');
const app = new EightyApp();


app.processDocument = function(html, url, headers, status, cheerio, extras) {
        const $ = cheerio;
        const $html = app.parseHtml(html, cheerio);
		const data = {};
         // gets all links in the html document
        var links = [];
        $html.find('a').each(function(i, obj) {
            var link = app.makeLink(url, $(this).attr('href'));
    		var text = $(this).text();
    		var linkObject = {};
    		linkObject.link = link;
    		linkObject.text = text;
                if (link != null) {
    			    links.push(linkObject);
                }
        });
    data.links = links;
    return JSON.stringify(data);
};

app.parseLinks = function(html, url, headers, status, cheerio, extras) {
		const $ = cheerio;
		const $html = app.parseHtml(html, $);
		const links = [];
		// gets all links in the html document
		$html.find('a').each(function(i, obj) {
			const link = app.makeLink(url, $(this).attr('href'));
			if(link != null) {
				links.push(link);
			}
		});
		return links;
}
module.exports = function() { 
    return app;
};
