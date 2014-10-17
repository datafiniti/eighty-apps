var EightyApp = function() {
	this.processDocument = function(html, url, headers, status, cheerio) {
	    var app = this;
	    $ = cheerio;
	    var $html = app.parseHtml(html, $);
	    var objects = [];

	    if (/([0-9]+)$/.test(url)) {
	    	var headerGroup = $html.find(".header-group"),
	    		leasingDetails = $html.find(".leasing-details"),
	    		propertyName = $(headerGroup).find("h1[itemprop=name]").first().text().trim(),
	    		address = $(headerGroup).find("span[itemprop=streetAddress]").first().text(),
	    		locality = $(headerGroup).find("span[itemprop=addressLocality]").first().text(),
	    		region = $(headerGroup).find("span[itemprop=addressRegion]").first().text(),
	    		postalCode = $(headerGroup).find("span[itemprop=postalCode]").first().text(),
	    		phone = $html.find('#pdp-leasing-info .tel').first().text(),
	    		managedBy = $html.find(".leasing-info-check-avail").prev().find("p").text(),
	    		petPolicy = $(leasingDetails).find('p').eq(0).text().trim().replace("\n", " ", "gm"),
	    		leasingTerms = $(leasingDetails).find('p').last().prev().text(),
	    		hours = $html.find(".office-hours").text().trim().replace("\n", " ", "gm");
	    		

	    	var images = [];

	    	$html.find(".vert-wrap").each(function() {
				$(this).data("getimg") && images.push( $(this).data("getimg").replace("//", "") ); 
	    	});

	    	var floorPlanDivs = $html.find('div[data-trackgroup=floorPlans]'), 
	    	 	floorPlans = [],
	    		floorPlanBeds = [],
	    		floorPlanBaths = [],
	    		floorPlanRents = [],
	    		floorPlanSqfts = [],
	    		floorPlanDeposits = [],
	    		floorPlanAvailabilities = [],
	    		floorPlan;
	    	
	    	$(floorPlanDivs).find(".fp-bed dd").each(function(){
	    		floorPlanBeds.push( $(this).text() );
	    	});

	    	$(floorPlanDivs).find(".fp-bath dd").each(function(){
	    		floorPlanBaths.push( $(this).text() );
	    	});

	    	$(floorPlanDivs).find(".fp-rent dd").each(function(){
	    		floorPlanRents.push( $(this).text() );
	    	});

	    	$(floorPlanDivs).find(".fp-sqft dd").each(function(){
	    		floorPlanSqfts.push( $(this).text() );
	    	});
	    	$(floorPlanDivs).find(".fp-deposit dd").each(function(){
	    		floorPlanDeposits.push( $(this).text() );
	    	});

	    	var amenities = $html.find(".det-content-list").children(),
	    		features = [],
	    		feature;

	    	for (var i = 0; i < amenities.length; i++) {
	    		if ( amenities[i].name === "dt" ) {
	    			feature = {};
	    			features.push(feature);
	    			features[features.length - 1]["key"] = $(amenities[i]).text();
	    			features[features.length - 1]["value"] = [];
	    		}
	    		else if ( amenities[i].name === "dd" ) {
	    			features[features.length - 1]["value"].push( $(amenities[i]).text() );
	    		}
	    	}

	    		pageReviews = $html.find(".individual-review");
	    	
	    	if ( $(pageReviews).length > 0 ) {
	    		var reviews = [],
	    		review;
		    	
		    	$(pageReviews).each(function(){
		    		review = {};
		    		review.username =  $(this).find(".resident-name").text();
		    		review.rating = $(this).find("meta[itemprop=reviewRating]").attr("content");
		    		review.text = $(this).find(".blurb").text() + $(this).find(".remainder").text();
		    		review.numHelpful = $(this).find(".thumbsUp.count").text();
		    		review.dateSeen = new Date();

		    		reviews.push(review);
		    	});
	    	}

	    	$html.find('div.row[data-trackgroup=floorPlans]').each(function(i){
	    		object = {};
	    		object.propertyType = "apartment";
	    		object.propertyName = propertyName;
	    		object.managedBy = managedBy;
	    		object.address = address;
	    		object.locality = locality;
	    		object.region = region;
	    		object.country = "US";
	    		object.postalcode = postalCode;
	    		object.phone = phone;
	    		object.hours = hours;
	    		object.images = images;
	    		object.petPolicy = petPolicy;
	    		object.leasingTerms = leasingTerms;
	    		object.unitName = $(this).find(".fp-prop-name").text();
	    		object.numBedrooms = floorPlanBeds[i];
	    		object.numBathrooms = floorPlanBaths[i];
	    		object.features = features;
	    		if (reviews) {
	    			object.reviews = reviews;	    			
	    		}

	    		price = {};
	    		price.price = floorPlanRents[i].replace("$", "", "gm") + " USD";
	    		price.dateSeen = new Date();
	    		object.price = price;

	    		object.size = floorPlanSqfts[i] + " sqft";
	    		object.deposit = floorPlanDeposits[i];

	    		objects.push(object);
	    	});

	    }
		return JSON.stringify(objects);
	};

	this.parseLinks = function(html, url, headers, status, cheerio) {
    	var app = this;
	    $ = cheerio;
	    var $html = app.parseHtml(html, $);
	    var links = [];

	    if (/(sitemap)/.test(url)) {
			$html.find("#sitemap-links-cont li a").each(function() {
				if ( $(this).attr("href").charAt(0) == "/" ) {
					links.push( "http://www.rent.com" + $(this).attr("href") );	
				}
				else {
					links.push( "http://www.rent.com/" + $(this).attr("href") );		
				}
			});
	    }

	    console.log("parseLinks");
    	return links;
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