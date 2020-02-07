const EightyApp = require('eighty-app');
const app = new EightyApp();

app.processDocument = function(html, url, headers, status, cheerio, extras) {
    return { html }
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
