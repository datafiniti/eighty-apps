var EightyApp = function() {

  this.processDocument = function(html, url, headers, status, jQuery) {
    var app = this;
    $ = jQuery;
    var $html = app.parseHtml(html, $);
    var object = {};

    if (url.match("/name/")) {

      if (url.match("/bio")) {

        object.data_type = "actor";
        object.name = $html.find('h3[itemprop="name"]').text().trim();

        object.overviewDetails = [];
        $html.find('table[id="overviewTable"] tr').each(function(i, obj) {
          var overviewDetail = {};
          overviewDetail.label = $(this).find('td.label').text().trim();
          overviewDetail.value = $(this).find('td').first().next().text().trim();
          object.overviewDetails.push(overviewDetail);
        });

        object.bioDetails = [];
        $html.find('div[class="soda odd"]').each(function(i, obj) {
          var bioDetail = {};
          bioDetail.value = $(this).text().trim();
          object.bioDetails.push(bioDetail);
        });
        $html.find('div[class="soda even"]').each(function(i, obj) {
          var bioDetail = {};
          bioDetail.value = $(this).text().trim();
          object.bioDetails.push(bioDetail);
        });

        object.salaries = [];
        $html.find('table[id="salariesTable"] tr').each(function(i, obj) {
          var salary = {};
          salary.project = $(this).find('td').first().text().trim();
          salary.value = $(this).find('td').first().next().text().trim();
          object.salaries.push(salary);
        });

      } else if (url.match("/awards")) {

        object.data_type = "actor";
        object.name = $html.find('h3[itemprop="name"]').text().trim();

        object.awards = [];
        $html.find('table[class="awards"] tr').each(function(i, obj) {
          var award = {};
          award.year = $(this).find('td.award_year').text().trim();
          award.outcome = $(this).find('td.award_outcome').text().trim();
          award.description = $(this).find('td.award_description').text().trim();
          object.awards.push(award);
        });

      } else if (url.match("/externalsites")) {

        object.data_type = "actor";
        object.name = $html.find('h3[itemprop="name"]').text().trim();

        object.externalSites = [];
        $html.find('ul.simpleList li').each(function(i, obj) {
          var externalSite = {};
          externalSite.URL = $(this).find('a').attr('href');
          externalSite.text = $(this).find('a').text().trim();
          object.externalSites.push(externalSite);
        });

      } else {
        object.data_type = "actor";
        object.name = $html.find('span[itemprop="name"]').text().trim();
        object.description = $html.find('div[id="name-bio-text"]').text().trim();
        object.born = $html.find('div[id="name-born-info"]').text().trim();
        object.otherWorks = $html.find('div[id="details-other-works"]').text().trim();
        object.publicityListings = $html.find('div[id="details-publicity-listings"]').text().trim();
        object.alternateNames = $html.find('div[id="details-akas"]').text().trim();
        object.height = $html.find('div[id="details-height"]').text().trim();
//        object. = $html.find('').text().trim();
//        object. = $html.find('').text().trim();

        object.filmography = [];
        $html.find('div[class="filmo-row odd"]').each(function(i, obj) {
          var filmographyCredit = {};
          filmographyCredit.date = $(this).find('span.year_column').text().trim();
          filmographyCredit.title = $(this).find('b').text().trim();
          filmographyCredit.role = $(this).find('a').first().text().trim();
          object.filmography.push(filmographyCredit);
        });
        $html.find('div[class="filmo-row even"]').each(function(i, obj) {
          var filmographyCredit = {};
          filmographyCredit.date = $(this).find('span.year_column').text().trim();
          filmographyCredit.title = $(this).find('b').text().trim();
          filmographyCredit.role = $(this).find('a').first().text().trim();
          object.filmography.push(filmographyCredit);
        });

      }
    } else if (url.match("title/")) {

      if (url.match("fullcredits")) {


      } else if (url.match("plotsummary")) {

      } else if (url.match("certification")) {

      } else if (url.match("locations")) {

      } else if (url.match("/business")) {

      } else if (url.match("/companycredits")) {

      } else if (url.match("/technical")) {

      } else if (url.match("/trivia")) {

      } else if (url.match("/soundtrack")) {

      } else {
      
        object.data_type = "movie";
        object.title = $html.find('span[itemprop="name"]').text().trim();      
        object.date = $html.find('meta[itemprop="datePublished"]').attr('content').trim();
        object.runningtime = $html.find('time[itemprop="duration"]').text().trim();

        object.categories = [];
        $html.find('div[itemprop="genre"] a').each(function(i, obj) {
          object.categories.push($(this).text());
        });

        object.country = $html.find('').text().trim();
        object.description = $html.find('p[itemprop="description"]').text().trim();
        object.director = $html.find('div[itemprop="director"] span.itemprop').text().trim();

	object.writers = [];
	$html.find('div[itemprop="creator"] a').each(function(i, obj) {
	  object.writers.push($(this).find('span').text().trim();
	});

        object.rating = $html.find('span[itemprop="ratingValue"]').text().trim();

	object.details = [];
	$html.find('div[id="titleDetails"] div.txt-block').each(function(i, obj) {
	  var detail = {}
	  detail.key = $(this).find('h4').text().trim();
	  detail.value = $(this).text().trim();
	  object.details.push(detail);
	});
      }
    }

    return JSON.stringify(object);
  };
  this.parseLinks = function(html, url, headers, status, jQuery) {
    var app = this;
    $ = jQuery;
    var $html = app.parseHtml(html, $);
    var links = [];

    if (url.match("/title")) {
      
      $html.find('div.see-more a').each(function(i, obj) {
	var link = app.makeLink(url, $(this).attr('href'));
      });

    } else if (url.match("search/name")) {
      
      if (url.match("start=")) {
        $html.find('td[class="name"] a').each(function(i, obj) {
          if ($(this).attr('href').match("/name/")) {
            var link = app.makeLink(url, $(this).attr('href'));
            links.push(link);
          }
        });

	var link = app.makeLink(url, $html.find('span.pagination a').attr('href'));
	links.push(link);
      }

    } else {

      $html.find('div[id="maindetails_quicklinks"] a').each(function(i, obj) {
        var link = app.makeLink(url, $(this).attr('href'));
        links.push(link);
      });

      $html.find('ul[class="quicklinks"] a').each(function(i, obj) {
        var link = app.makeLink(url, $(this).attr('href'));
        links.push(link);
      });

      $html.find('div[class="filmo-row odd"]').each(function(i, obj) {
	var link = app.makeLink(url, $(this).attr('href'));
	links.push(link);
      });
      $html.find('div[class="filmo-row even"]').each(function(i, obj) {
        var link = app.makeLink(url, $(this).attr('href'));
        links.push(link);
      });

    }

    return links;
  };
};

try {
  // Testing
  module.exports = function(EightyAppBase) {
    EightyApp.prototype = new EightyAppBase();
    return new EightyApp();
  };
} catch(e) {
  // Production
  console.log("Eighty app exists.");
  EightyApp.prototype = new EightyAppBase();
}
