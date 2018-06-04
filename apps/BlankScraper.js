const EightyApp = require('eighty-app');
const app = new EightyApp();

app.processDocument = function(html, url, headers, status, $) {
	const $html = this.parseHtml(html, $);
	const data = {};

	return data;
}

app.parseLinks = function (html, url, headers, status, $) {
	const $html = this.parseHtml(html, $);
	const links = [];

	return links;
}

module.exports = function () {
	return app;
}