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

        object.spouseDetails = [];
        $html.find('table[id="tableSpouses"] tr').each(function(i, obj) {
          var spouseDetail = {};
          spouseDetail.label = $(this).find('td').first().text().trim();
          spouseDetail.value = $(this).find('td').first().next().text().trim();
          object.spouseDetails.push(spouseDetail);
        });

        object.miniBioDetails = [];
        $html.find('a[name="mini_bio"]').next().nextUntil('a').each(function(i, obj) {
          var miniBioDetail = {};
          miniBioDetail.value = $(this).text().trim();
          object.miniBioDetails.push(miniBioDetail);
        });

        object.spouseDetails = [];
        $html.find('table[id="tableSpouses"] tr').each(function(i, obj) {
          var spouseDetail = {};
	  spouseDetail.name = $(this).find('td').first().text().trim();
          spouseDetail.value = $(this).find('td').first().next().text().trim();
          object.spouseDetails.push(spouseDetail);
        });

        object.trademarkDetails = [];
        $html.find('a[name="trademark"]').next().nextUntil('a').each(function(i, obj) {
          var trademarkDetail = {};
          trademarkDetail.value = $(this).text().trim();
          object.trademarkDetails.push(trademarkDetail);
        });

        object.personalQuotes = [];
        $html.find('a[name="quotes"]').next().nextUntil('a').each(function(i, obj) {
          var personalQuote = {};
          personalQuote.value = $(this).text().trim();
          object.personalQuotes.push(personalQuote);
        });

        object.triviaDetails = [];
        $html.find('a[name="trivia"]').next().nextUntil('a').each(function(i, obj) {
          var triviaDetail = {};
          triviaDetail.value = $(this).text().trim();
          object.triviaDetails.push(triviaDetail);
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

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

	object.cast = [];
	$html.find('tr.odd').each(function(i, obj) {
	  var castmember = {};
	  castmember.name = $(this).find('td[itemprop="actor"] span[itemprop="name"]').text().trim();
          castmember.role = $(this).find('td.character div').text().trim();
	  object.cast.push(castmember);
	});
        $html.find('tr.even').each(function(i, obj) {
          var castmember = {};
          castmember.name = $(this).find('td[itemprop="actor"] span[itemprop="name"]').text().trim();
          castmember.role = $(this).find('td.character div').text().trim();
          object.cast.push(castmember);
        });

      } else if (url.match("/trivia?ref_=tt_ql_trv_1")){

	object.data_type = "movie";
	object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.trivia = [];
        $html.find('div[class="sodatext"]').each(function(i, obj) {
          object.trivia.push($(this).text().trim());
        });

      } else if (url.match("/quotes")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.quotes = [];
        $html.find('div[class="sodatext"]').each(function(i, obj) {
          object.quotes.push($(this).text().trim());
        });

      } else if (url.match("/plotsummary")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.plots = [];
        $html.find('p[class="plotSummary"]').each(function(i, obj) {
          object.plots.push($(this).text().trim());
        });

      } else if (url.match("/releaseinfo")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.releasedates = [];
        $html.find('table[id="release_dates"] tr').each(function(i, obj) {
	  var releasedate = {};
	  releasedate.location = $(this).find('td').first().text().trim();
	  releasedate.date = $(this).find('td').next().text().trim();
          object.releasedates.push(releasedate);
        });

      } else if (url.match("/companycredits")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.companycredits = [];
        $html.find('ul.simpleList li').each(function(i, obj) {
          object.companycredits.push($(this).text().trim());
        });

      } else if (url.match("/parentalguide")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.certifications = [];
        $html.find('div.info div.info-content a').each(function(i, obj) {
	  if ($(this).attr('href').match("certificates")) {
            object.certifications.push($(this).text().trim());
	  }
        });

      } else if (url.match("/locations")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.locations = [];
        $html.find('div[class="soda sodavote even"]').each(function(i, obj) {
          object.locations.push($(this).find('dt').text().trim());
        });
        $html.find('div[class="soda sodavote odd"]').each(function(i, obj) {
          object.locations.push($(this).find('dt').text().trim());
        });

      } else if (url.match("/awards")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.awards = [];
        $html.find('td.award_description').each(function(i, obj) {
          var award = {};
          award.value = $(this).text().trim();
          award.status = $(this).parent().find('td.title_award_outcome').text().trim();
          object.awards.push(award);
        });

      } else if (url.match("/technical")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.technicalspecs = [];
        $html.find('table[class="dataTable labelValueTable"] tr').each(function(i, obj) {
          var technicalspec = {};
          technicalspec.key = $(this).find('td.label').text().trim();
          technicalspec.value = $(this).find('td').next().text().trim();
          object.technicalspecs.push(technicalspec);
        });

      } else if (url.match("/soundtrack")){

        object.data_type = "movie";
        object.title = $html.find('h3[itemprop="name"] a').text().trim();

        object.soundtrack = [];
        $html.find('div[class="soundTrack soda odd"]').each(function(i, obj) {
          object.soundtrack.push($(this).text().trim());
        });
        $html.find('div[class="soundTrack soda odd"]').each(function(i, obj) {
          object.soundtrack.push($(this).text().trim());
        });

      } else {
      
        object.data_type = "movie";
        object.title = $html.find('h1.header span[itemprop="name"]').text().trim();
        object.date = $html.find('meta[itemprop="datePublished"]').attr('content').trim();
        object.runningtime = $html.find('time[itemprop="duration"]').text().trim();

        object.categories = [];
        $html.find('div[itemprop="genre"] a').each(function(i, obj) {
          object.categories.push($(this).text());
        });

        object.description = $html.find('p[itemprop="description"]').text().trim();
        object.director = $html.find('div[itemprop="director"] span.itemprop').text().trim();

	object.writers = [];
	$html.find('div[itemprop="creator"] a').each(function(i, obj) {
	  object.writers.push($(this).find('span').text().trim());
	});

        object.rating = $html.find('span[itemprop="ratingValue"]').text().trim();

	object.details = [];
	$html.find('div[id="titleDetails"] div.txt-block').each(function(i, obj) {
	  var detail = {};
	  detail.key = $(this).find('h4').text().trim().replace(":","");
	  detail.value = $(this).text().trim().replace(/^.*?:/,"");
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
        links.push(link);
      });

      $html.find('ul[class="quicklinks"] a').each(function(i, obj) {
        var link = app.makeLink(url, $(this).attr('href'));
        links.push(link);
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

      $html.find('div[class="filmo-row odd"] a').each(function(i, obj) {
	var link = app.makeLink(url, $(this).attr('href'));
        if (!link.match("/character")) {
  	  links.push(link);
        }
      });
      $html.find('div[class="filmo-row even"] a').each(function(i, obj) {
        var link = app.makeLink(url, $(this).attr('href'));
        if (!link.match("/character")) {
  	  links.push(link);
        }
      });

    }

    for (var i = 0; i < links.length; i++) {
      links[i] = links[i].substring(0,links[i].indexOf('?ref_='));
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
