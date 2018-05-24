/* ************************************************************************
 * This 80app's parseLinks only returns URLs that have the same domain as *
 * the current URL being crawled.                                         *
 **************************************************************************
 */

const EightyApp = require('eighty-app');
const app = new EightyApp();

app.processDocument = function (html, url, headers, status, $) {
	return { html };
}

app.parseLinks = function (html, url, headers, status, $) {
	const $html = this.parseHtml(html, $);
	const links = [];

	const r = /:\/\/(.[^/]+)/;
	const urlDomain = url.match(r)[1];
	const normalizedUrlDomain = urlDomain.toLowerCase();

	// gets all links in the html document
	$html.find('a').each(function (i, obj) {
		const link = app.makeLink(url, $(this).attr('href'));

		if (link) {
			const linkDomain = link.match(r)[1];

			if (linkDomain.toLowerCase() === normalizedUrlDomain) {
				links.push(link);
			}
		}
	});

	return links;
}

module.exports = function () {
	return app;
}