var EightyAppBase = function() {
  var authStatus;

  var initialize = function() {
    authStatus = false;
  };

  this.processDocument = function(html, url, headers, status, jQuery) {};

  this.parseLinks = function(html, url, headers, status, jQuery) {};

  this.parseJSON = function(text) {
    return JSON.parse(text);
  };

  this.parseHtml = function(text, $) {
    text = text.replace(/(<img)\+*?/g, "<img80");
    return $(text);
  };

  this.getPlainText = function(text) {
    text = text
      .replace(/[^a-z0-9\s.'-:]/gi, '') // remove all characters not a-z, 0-9, and certain punctuation, ignoring case
    .replace(/\s{2,}/g, ' ') // replace any two whitespace characters next to each other with a single space
    .replace(/\s/g, ' '); // replace all whitespace characters (\t,\n,\r, ) with space

    // trim
    return text.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  };

  // decode unicode by inputting a selective regex and a string
  // make sure to use a global regex to replace all instances of unicode in the input string
  // code adapted from: http://stackoverflow.com/questions/7885096/how-do-i-decode-a-string-with-escaped-unicode
  this.decodeUnicode = function(regex, str) {
    var regex = regex;
    var str = str;
    if (str !== undefined) {
      var decodedString = str.replace(regex, function(match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
      });
      return decodedString;
    }
  };

  this.formatDate = function(date) {
    // yyyy-MM-ddTHH:mm:ssZ
    date = new Date(date);
    return date.getUTCFullYear() + '-' +
      (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : '' + (date.getUTCMonth() + 1)) + '-' +
      (date.getUTCDate() < 10 ? '0' + date.getUTCDate() : '' + date.getUTCDate()) +
      'T' +
      (date.getUTCHours() < 10 ? '0' + date.getUTCHours() : '' + date.getUTCHours()) + ':' +
      (date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : '' + date.getUTCMinutes()) + ':' +
      (date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : '' + date.getUTCSeconds()) +
      'Z';
  };

  this.removeTag = function(text) {
    return text.replace(/<.*?>/g, "");
  };

  this.getFirstMatch = function(text, regexp) {
    regexp = regexp
    var matchedGroup = regexp.exec(text);
    if (matchedGroup !== null && matchedGroup !== undefined) {
      return matchedGroup[1].trim();
    }
  };

  this.append80FlagToLink = function(eightyvalue, link) {

    var returnLink = link;
    if (link.indexOf("?") >= 0 && !/\?$/.test(link)) {
        returnLink = link + "&80flag=" + eightyvalue;
    } else if (/\?$/.test(link)) {
        returnLink = link + "80flag=" + eightyvalue;
    } else {
      returnLink = link + "?80flag=" + eightyvalue;
    }

    return returnLink;
  };

  this.get80Value = function(link) {

    if (link !== null) {
      if (link.indexOf("?") >= 0) {
        var query = link.split("?")[1];
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == "80flag") {
            return pair[1];
          }
        }
      }
    }
    return null;
  };

  // IMPORTANT Usage Note: Use makeLink on a url BEFORE appending an 80flag for review URLs. Otherwise
  // it will match on the sourceURL rather than the actual url
  this.makeLink = function(url, link) {
    try {
    	// Checks link for http or https first and returns it if it is already a valid link
    	if (link.match(/^http:\/\//) || link.match(/^https:\/\//)) {
    		return link;
      // checks if link has domain with characters, numbers, hyphens and no / or quotes (i.e. domain.com, www.domain-101.com; search.domain101.com; www.domain.edu.eu)
    	} else if (!link.match(/^[\w.\-][^\"]*\./i)) {
        var host = url.match(/^http[s]?:\/\/[^/]+/);
        host = host ? host[0] : "http://" + url;
        // checks if link starts with backslash.
        // link.match(/^\//g)
        if (link[0] == "/" && host[host.length -1] == "/") {
          host = host.substring(0, host.length - 1);
          return host + link;
        // Adds backslash when needed
        } else if (!(link[0] == "/") && !(host[host.length -1] == "/"))  {
          return host + '/' + link;
        } else {
          return host + link;
        }
      // adds http:// to link if determines it already has a domain
      } else {
      	return "http://" + link;
    	}
    // returns original link if nothing needs to be added to it
    } catch (e) {
      // returns the original link
      return link;
    }
  };

  // eliminateDuplicates code borrowed from: http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
  this.eliminateDuplicates = function(arr) {
    var i;
    var len = arr.length;
    var out = [];
    var obj = {};

    for (i = 0; i < len; i++) {
      if (!obj[arr[i]]) {
        obj[arr[i]] = {};
        out.push(arr[i]);
      }
    }
    return out;
  };

  //$= under $25
  //$$= $25-$40
  //$$$= $50-$55
  //$$$$= above $55
  //£ = under £15
  //££ = £15-£25
  //£££ = £30-£35
  //££££ = above £35

  //replaces dollar sign notation into dollar amounts to capture price range details
  this.getPriceRangeReplace = function(text, currency) {
    if (text != undefined && currency == "USD") {
      var priceRange = text.replace("$$$$", "Above USD 55.00").replace("$$$", "USD 50.00-55.00").replace("$$", "USD 25.00-40.00").replace("$", "USD 0.00-25.00");
      return priceRange;
    } else if (text != undefined && currency == "GBP") {
      var priceRange = text.replace("££££", "Above GBP 35.00").replace("£££", "GBP 30.00-35.00").replace("££", "GBP 115.00-25.00").replace("£", "GBP 0.00-15.00");
      return priceRange;
    }

  };

  // Replace special characters
  this.replaceSpecialCharacters = function(string) {
    var stringWithSpecialCharacters = string;

    var translate = {
      "Ä": "A",
      "ä": "a",
      "Ç": "C",
      "ç": "c",
      "Ğ": "G",
      "ğ": "g",
      "İ": "I",
      "ı": "i",
      "Ö": "O",
      "ö": "o",
      "Ş": "S",
      "ş": "s",
      "Ü": "U",
      "ü": "u",
      "ß": "ss",
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "ñ": "n",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ý": "y",
      "ÿ": "y",
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "Ñ": "N",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ý": "Y"
    };

    var replacementRegEx = new RegExp(Object.keys(translate).join("|"), "g");

    var replacedString = stringWithSpecialCharacters.replace(replacementRegEx, function(letter) {
      return translate[letter];
    });

    return replacedString;
  };

  this.countryCodeConverter = {
    "Australia"     :"AU",
    "Austria"       :"AT",
    "Brazil"        :"BR",
    "Canada"        :"CA",
    "Czech Republic":"CZ",
    "China"         :"CN",
    "Croatia"       :"HR",
    "Egypt"         :"EG",
    "France"        :"FR",
    "Germany"       :"DE",
    "Greece"        :"GR",
    "India"         :"IN",
    "Indonesia"     :"ID",
    "Italy"         :"IT",
    "Kuwait"        :"KW",
    "Malaysia"      :"MY",
    "Mexico"        :"MX",
    "Philippines"   :"PH",
    "Portugal"      :"PT",
    "Saint Lucia"   :"LC",
    "Singapore"     :"SG",
    "South Africa"  :"ZA",
    "Spain"         :"ES",
    "Switzerland"   :"CH",
    "Thailand"      :"TH",
    "United Kingdom":"GB",
    "United States" :"US",
    "AFG"           :"AF",
    "ALB"           :"AL",
    "DZA"           :"DZ",
    "ASM"           :"AS",
    "AND"           :"AD",
    "AGO"           :"AO",
    "AIA"           :"AI",
    "ATA"           :"AQ",
    "ATG"           :"AG",
    "ARG"           :"AR",
    "ARM"           :"AM",
    "ABW"           :"AW",
    "AUS"           :"AU",
    "AUT"           :"AT",
    "AZE"           :"AZ",
    "BHS"           :"BS",
    "BHR"           :"BH",
    "BGD"           :"BD",
    "BRB"           :"BB",
    "BLR"           :"BY",
    "BEL"           :"BE",
    "BLZ"           :"BZ",
    "BEN"           :"BJ",
    "BMU"           :"BM",
    "BTN"           :"BT",
    "BOL"           :"BO",
    "BIH"           :"BA",
    "BWA"           :"BW",
    "BVT"           :"BV",
    "BRA"           :"BR",
    "IOT"           :"IO",
    "BRN"           :"BN",
    "BGR"           :"BG",
    "BFA"           :"BF",
    "BDI"           :"BI",
    "KHM"           :"KH",
    "CMR"           :"CM",
    "CAN"           :"CA",
    "CPV"           :"CV",
    "CYM"           :"KY",
    "CAF"           :"CF",
    "TCD"           :"TD",
    "CHL"           :"CL",
    "CHN"           :"CN",
    "CXR"           :"CX",
    "CCK"           :"CC",
    "COL"           :"CO",
    "COM"           :"KM",
    "COG"           :"CG",
    "COD"           :"CD",
    "COK"           :"CK",
    "CRI"           :"CR",
    "CIV"           :"CI",
    "HRV"           :"HR",
    "CUB"           :"CU",
    "CYP"           :"CY",
    "CZE"           :"CZ",
    "DNK"           :"DK",
    "DJI"           :"DJ",
    "DMA"           :"DM",
    "DOM"           :"DO",
    "TMP"           :"TP",
    "ECU"           :"EC",
    "EGY"           :"EG",
    "SLV"           :"SV",
    "GNQ"           :"GQ",
    "ERI"           :"ER",
    "EST"           :"EE",
    "ETH"           :"ET",
    "FLK"           :"FK",
    "FRO"           :"FO",
    "FJI"           :"FJ",
    "FIN"           :"FI",
    "FRA"           :"FR",
    "FXX"           :"FX",
    "GUF"           :"GF",
    "PYF"           :"PF",
    "ATF"           :"TF",
    "GAB"           :"GA",
    "GMB"           :"GM",
    "GEO"           :"GE",
    "DEU"           :"DE",
    "GHA"           :"GH",
    "GIB"           :"GI",
    "GRC"           :"GR",
    "GRL"           :"GL",
    "GRD"           :"GD",
    "GLP"           :"GP",
    "GUM"           :"GU",
    "GTM"           :"GT",
    "GIN"           :"GN",
    "GNB"           :"GW",
    "GUY"           :"GY",
    "HTI"           :"HT",
    "HMD"           :"HM",
    "VAT"           :"VA",
    "HND"           :"HN",
    "HKG"           :"HK",
    "HUN"           :"HU",
    "ISL"           :"IS",
    "IND"           :"IN",
    "IDN"           :"ID",
    "IRN"           :"IR",
    "IRQ"           :"IQ",
    "IRL"           :"IE",
    "ISR"           :"IL",
    "ITA"           :"IT",
    "JAM"           :"JM",
    "JPN"           :"JP",
    "JOR"           :"JO",
    "KAZ"           :"KZ",
    "KEN"           :"KE",
    "KIR"           :"KI",
    "PRK"           :"KP",
    "KOR"           :"KR",
    "KWT"           :"KW",
    "KGZ"           :"KG",
    "LAO"           :"LA",
    "LVA"           :"LV",
    "LBN"           :"LB",
    "LSO"           :"LS",
    "LBR"           :"LR",
    "LBY"           :"LY",
    "LIE"           :"LI",
    "LTU"           :"LT",
    "LUX"           :"LU",
    "MAC"           :"MO",
    "MKD"           :"MK",
    "MDG"           :"MG",
    "MWI"           :"MW",
    "MYS"           :"MY",
    "MDV"           :"MV",
    "MLI"           :"ML",
    "MLT"           :"MT",
    "MHL"           :"MH",
    "MTQ"           :"MQ",
    "MRT"           :"MR",
    "MUS"           :"MU",
    "MYT"           :"YT",
    "MEX"           :"MX",
    "FSM"           :"FM",
    "MDA"           :"MD",
    "MCO"           :"MC",
    "MNG"           :"MN",
    "MNE"           :"ME",
    "MSR"           :"MS",
    "MAR"           :"MA",
    "MOZ"           :"MZ",
    "MMR"           :"MM",
    "NAM"           :"NA",
    "NRU"           :"NR",
    "NPL"           :"NP",
    "NLD"           :"NL",
    "ANT"           :"AN",
    "NCL"           :"NC",
    "NZL"           :"NZ",
    "NIC"           :"NI",
    "NER"           :"NE",
    "NGA"           :"NG",
    "NIU"           :"NU",
    "NFK"           :"NF",
    "MNP"           :"MP",
    "NOR"           :"NO",
    "OMN"           :"OM",
    "PAK"           :"PK",
    "PLW"           :"PW",
    "PAN"           :"PA",
    "PNG"           :"PG",
    "PRY"           :"PY",
    "PER"           :"PE",
    "PHL"           :"PH",
    "PCN"           :"PN",
    "POL"           :"PL",
    "PRT"           :"PT",
    "PRI"           :"PR",
    "QAT"           :"QA",
    "REU"           :"RE",
    "ROM"           :"RO",
    "RUS"           :"RU",
    "RWA"           :"RW",
    "KNA"           :"KN",
    "LCA"           :"LC",
    "VCT"           :"VC",
    "WSM"           :"WS",
    "SMR"           :"SM",
    "STP"           :"ST",
    "SAU"           :"SA",
    "SEN"           :"SN",
    "SRB"           :"RS",
    "SYC"           :"SC",
    "SLE"           :"SL",
    "SGP"           :"SG",
    "SVK"           :"SK",
    "SVN"           :"SI",
    "SLB"           :"SB",
    "SOM"           :"SO",
    "ZAF"           :"ZA",
    "SSD"           :"SS",
    "SGS"           :"GS",
    "ESP"           :"ES",
    "LKA"           :"LK",
    "SHN"           :"SH",
    "SPM"           :"PM",
    "SDN"           :"SD",
    "SUR"           :"SR",
    "SJM"           :"SJ",
    "SWZ"           :"SZ",
    "SWE"           :"SE",
    "CHE"           :"CH",
    "SYR"           :"SY",
    "TWN"           :"TW",
    "TJK"           :"TJ",
    "TZA"           :"TZ",
    "THA"           :"TH",
    "TGO"           :"TG",
    "TKL"           :"TK",
    "TON"           :"TO",
    "TTO"           :"TT",
    "TUN"           :"TN",
    "TUR"           :"TR",
    "TKM"           :"TM",
    "TCA"           :"TC",
    "TUV"           :"TV",
    "UGA"           :"UG",
    "UKR"           :"UA",
    "ARE"           :"AE",
    "GBR"           :"GB",
    "USA"           :"US",
    "UMI"           :"UM",
    "URY"           :"UY",
    "UZB"           :"UZ",
    "VUT"           :"VU",
    "VEN"           :"VE",
    "VNM"           :"VN",
    "VGB"           :"VG",
    "VIR"           :"VI",
    "WLF"           :"WF",
    "ESH"           :"EH",
    "YEM"           :"YE",
    "ZMB"           :"ZM",
    "ZWE"           :"ZW",

  };

  this.convertMonthToEnglish = function(month) {
    month = month.toLowerCase();

    var translate = {
      "xaneiro": "January",
      "febreiro": "February",
      "marzo": "March",
      "abril": "April",
      "maio": "May",
      "xuño": "June",
      "xullo": "July",
      "agosto": "August",
      "setembro": "September",
      "outubro": "October",
      "novembro": "November",
      "decembro": "December",
      "luty": "February",
      "marzec": "March",
      "maj": "May",
      "czerwiec": "June",
      "lipiec": "July",
      "listopad": "November",
      "january": "January",
      "february": "February",
      "march": "March",
      "april": "April",
      "may": "May",
      "june": "June",
      "july": "July",
      "august": "August",
      "september": "September",
      "october": "October",
      "november": "November",
      "december": "December",
      "gennaio": "January",
      "febbraio": "February",
      "marzo": "March",
      "aprile": "April",
      "maggio": "May",
      "giugno": "June",
      "luglio": "July",
      "agosto": "August",
      "settembre": "September",
      "ottobre": "October",
      "novembre": "November",
      "dicembre": "December",
      "janvier": "January",
      "février": "February",
      "mars": "March",
      "avril": "April",
      "mai": "May",
      "juin": "June",
      "juillet": "July",
      "aoû": "August",
      "septembre": "September",
      "octobre": "October",
      "novembre": "November",
      "décembre": "December",
      "januari": "January",
      "februari": "February",
      "maret": "March",
      "april": "April",
      "mei": "May",
      "juni": "June",
      "juli": "July",
      "agustus": "August",
      "september": "September",
      "oktober": "October",
      "november": "November",
      "desember": "December",
      "enero": "January",
      "febrero": "February",
      "marzo": "March",
      "abril": "April",
      "mayo": "May",
      "junio": "June",
      "julio": "July",
      "agosto": "August",
      "septiembre": "September",
      "octubre": "October",
      "noviembre": "November",
      "diciembre": "December",
      "ocak": "January",
      "mart": "March",
      "nisan": "April",
      "mayis": "May",
      "haziran": "June",
      "temmuz": "July",
      "ekim": "October",
      "kasım": "November",
      "aralık": "Decembe",
      "januar": "January",
      "februar": "February",
      "märz": "March",
      "april": "April",
      "mai": "May",
      "juni": "June",
      "juli": "July",
      "august": "August",
      "september": "September",
      "oktober": "October",
      "november": "November",
      "dezember": "December",
      "1": "January",
      "2": "February",
      "3": "March",
      "4": "April",
      "5": "May",
      "6": "June",
      "7": "July",
      "8": "August",
      "9": "September",
      "10": "October",
      "11": "November",
      "12": "December"
    };

    return translate[month];
  };

  // converts a given relative timeframe from the current date (when crawled) to unix
  // ex: 9 weeks ago where 9 is the timeNumber and weeks is the timeMeasurement
  // output would be a unix timestamp that can be easily imported
  this.getRelativeUnixTime = function(timeNumber, timeMeasurement) {
    var timeNumber = timeNumber;
    var timeMeasurement = timeMeasurement;
    var today = new Date();
    var currentDay = today.getDate();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();

    if (timeMeasurement == "days" || timeMeasurement == "day") {
      var commentDate = new Date(currentYear, currentMonth, currentDay);
      // the number of days before todays date in day of the week Month day year format which is then converted to milliseconds
      dateNumber = -(timeNumber);
      commentDate.setDate(timeNumber);
      // divide by 1000 to get the unix timestamp in seconds
      var unixCommentDate = (commentDate / 1000);
      return unixCommentDate;
    } else if (timeMeasurement == "weeks" || timeMeasurement == "week") {
      // convert number of weeks into number of hours for calculation
      timeNumber = -(timeNumber * 7 * 24);
      var commentDate = new Date(currentYear, currentMonth, currentDay);
      // the number of days before todays date in day of the week Month day year format which is then converted to milliseconds
      commentDate.setHours(timeNumber);
      // console.log("COMMENT DATE: " + commentDate.toDateString);
      // divide by 1000 to get the unix timestamp in seconds
      var unixCommentDate = (commentDate / 1000);
      // console.log("COMMENT UNIX DATE: " + unixCommentDate);
      return unixCommentDate;
    } else if (timeMeasurement == "months" || timeMeasurement == "month") {
      // convert number of weeks into number of hours for calculation
      timeNumber = -(timeNumber * 30 * 24);
      var commentDate = new Date(currentYear, currentMonth, currentDay);
      // the number of days before todays date in day of the week Month day year format which is then converted to milliseconds
      commentDate.setHours(timeNumber);
      // console.log("COMMENT DATE: " + commentDate.toDateString);
      // divide by 1000 to get the unix timestamp in seconds
      var unixCommentDate = (commentDate / 1000);
      // console.log("COMMENT UNIX DATE: " + unixCommentDate);
      return unixCommentDate;
    } else if (timeMeasurement == "years" || timeMeasurement == "year") {
      // convert the number of years into the number of days for calculation
      timeNumber = -(timeNumber * 365);
      var commentDate = new Date(currentYear, currentMonth, currentDay);
      // the number of days before todays date in day of the week Month day year format which is then converted to milliseconds
      commentDate.setDate(timeNumber);
      // divide by 1000 to get unix
      var unixCommentDate = (commentDate / 1000);
      return unixCommentDate;
    }
  };
  // converts text formatting to camel case
  // EX: string input => EXAMPLE string output => Example
  // code borrorwed from: http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
  this.getProperCase = function(string) {
    var string = string;
    return string.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
};

// The following is included to make this testable with node.js
try {
  if (module != null) {
    var $ = this.$ = "";
  }
} catch (e) {}
this.processTest = function(html, url, headers, status) {
  var app = this;
  var env = require('jsdom').env;
  env(html, function(errors, window) {
    $ = this.$ = require('jquery')(window);
    var result = app.processDocument(html, url, headers, status, $);
    console.log(result);
    var links = app.parseLinks(html, url, headers, status, $);
    console.log(links);
  });
}

try {
  // Testing
  module.exports = EightyAppBase;
} catch (e) {
  // Production
}
