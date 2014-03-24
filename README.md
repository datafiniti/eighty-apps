EightyApps
==========

###Basic 80app format

```javascript
var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, jQuery) {
		var app = this;
		$ = jQuery;
		var $html = app.parseHtml(html, $);
		var object = new Object();

		// populate the object

		return JSON.stringify(object);
	}

	this.parseLinks = function(html, url, headers, status, jQuery) {
		var app = this;
		$ = jQuery;
		var $html = app.parseHtml(html, $);
		var links = [];

		// get all the links

		return links;
	}
}

try {
	// Testing
	module.exports = function(EightyAppBase) {
		EightyApp.prototype = new EightyAppBase();
		return new EightyApp();
	}
} catch(e) {
	// Production
	EightyApp.prototype = new EightyAppBase();
}
```

### Testing
To test using the 80AppTester, you must have node.js installed.
You must also run the following commands to install the required node packages:
```shell
$ npm install jquery
$ npm install jsdom
```
These commands will install libraries that provide the same functionality that will be available in the crawler.

You can test using a specific 80app and url with the command:
```shell
$ nodejs 80AppTester.js [80app_filename] [url]
```

(Note: in order for this to work, the base 80app class (EightyApp.js) must be in the same directory)

### Note about "img" tags
Note that when you parse the input html, "img" tags will be changed to "img80" tags. This is so the crawlers do not load the images when using the EightyApp to parse the html response (strangely "img" tags seem to be the only html elements affected by this). If you need to reference an "img" tag by its tag type explicitly (i.e. not by its class, id, or some other attribute) in some html, it will instead be an "img80" tag, but everything else should be the same.
