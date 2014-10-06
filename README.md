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
To test your 80apps, you should use our Google Chrome extension, available [here](https://s3.amazonaws.com/datafiniti-voltron/eightyAppTester/EightyAppTester.crx).  Right-click this link and save it to your local computer.  Then open the Extensions page (go to chrome://extensions) in Google Chrome and drag the extension file into the list.

### Note about "img" tags
Note that if you use the parseHTML method in EightyApp.js, "img" tags will be changed to "img80" tags. This is so the crawlers do not load the images when using the EightyApp to parse the html response (strangely "img" tags seem to be the only html elements affected by this). If you need to reference an "img" tag by its tag type explicitly (i.e. not by its class, id, or some other attribute) in some html, it will instead be an "img80" tag, but everything else should be the same.

### Currently Available Cheerio (i.e. jQuery) Methods
The new version of Voltron - Mauler - uses an extended version of Cheerio, a lighter weight version of jQuery. You will still write functions in the same manner as before (ex: $html.find('selector').parent()); however, in order for Cheerio to obtain its faster speed, it only uses certain core jQuery functions. You can see the list of already implemented Cheerio functions that are available to you here: http://cheeriojs.github.io/cheerio/

Our extended version of Cheerio also includes a number of other functions that are available for your use. These include:

	* .not
	* .makeArray
	* .each
	* .filter
	* .prop

We are currently working on implementing the pseudo selectors :eq and :first (ex: $html.find('div:eq(1)')). Check here or our <a href="https://80legs.groovehq.com/knowledge_base/topics/extended-cheerio-jquery-functionality-for-custom-crawls">knowledge base</a> for updated Cheerio functionality.