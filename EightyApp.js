/****************************
STANDARDS FOR ADDING NEW FUNCTIONS
1. Consult with the Data Quality Manager before beginning modification of base 80app.
2. Write tests. Tests should cover handling all bad input (undefined/null/""), handling an expected pattern of input, and predictable edge cases.
    Help for writing tests can be found in the 'test' directory
3. Consult with a member of the Ops team after method and test completion. They will approve/deny pushing your changes to live.

STANDARDS FOR WRITING NEW FUNCTIONS
1. Functions should have simple, meaningful names. Preferably without abbreviations.
2. Functions should not be domain specific. Functions should be applicable to common concepts, not one specific website.
3. Make sure your code is legible and consistently formatted. It is preferred to have code with better readability than fast, but illegible, code.
4. When false input is received (undefined/null/"") functions should usually return null, except for functions that explicitly return text.
   Functions that return text should instead return an empty string upon receiving bad input.
****************************/

var EightyAppBase = function() {
    var authStatus;

    var initialize = function() {
        authStatus = false;
    };

    /*
     * Outputs a String to the 80appTester's console box
     * @param {String} msg The string to output
     */
    this.say = function(msg) {
        process.send({
            message: msg.toString()
        })
    }

    /**
     * For each value in an array, removes any trailing whitespace
     * @param {Array} array array of strings to trim
     * @return {Array} retruns the input array with each item being trimed
     */
     this.trimAll = function(array) {
    if (array !== null && array instanceof Array && array.length > 0)
        for (var i = 0; i < array.length; i++) {
        if (typeof array[i] === 'string' || array[i] instanceof String) {
                    var tmp = this.removeExtraWhitespace(array[i]);
                    if(tmp.length>0)
                        array[i] = tmp;
                } else
            return null;
        }
         else
             return null;
        return array;
    }

    this.processDocument = function(html, url, headers, status, jQuery) {};

    this.parseLinks = function(html, url, headers, status, jQuery) {};

    this.parseJSON = function(text) {
        return JSON.parse(text);
    };

    this.parseHtml = function(text, $) {
        text = text.replace(/(<img)\+*?/g, "<img80");
        return $(text);
    };

    this.parseXml = function(text, $) {
        text = text.replace(/(<img)\+*?/g, "<img80");
        return $(text);
    };

    /*
     * Removes any special characters from a string
     * @param {String} text the string to remove special characters from
     * @return {String} the input string with any special characters removed
     */
    this.getPlainText = function(text) {
        if (!text) {
            return "";
        }

        text = text
                .replace(/[^a-z0-9\s.'-:!]/gi, '') // remove all characters not a-z, 0-9, and certain punctuation, ignoring case
                .replace(/\s{2,}/g, ' ') // replace any two whitespace characters next to each other with a single space
                .replace(/\s/g, ' '); // replace all whitespace characters (\t,\n,\r, ) with space

        // trim
        return text.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    };

    /**
     * Removes any trailing whitespace characters and any instance of \t, \n, \r, \v, or \f 
     * @param {String} text the string from which to remove extra whitespace
     * @return {String} the input string with excess whitespace removed
     */
    this.removeExtraWhitespace = function(text) {
        if (!text) {
            return "";
        }
        else {
            return text.replace(/\s{2,}/g, ' ').replace(/\s/g, ' ').replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        }
    }

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

    /** 
     * Given an object capable of generating a Date object, formats it into the format
     * yyyy-MM-ddTHH:mm:ssZ
     * @param {Object} date an object used to construct a Date object
     * @return {String} a date String formatted yyyy-MM-ddTHH:mm:ssZ
     */
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

    /**
     * Removs HTML tags from a string
     * @param {String} text the text to process
     * @param {String} input string with any HTML tags removed
     */
    this.removeTag = function(text) {
        if(!text){
            return "";
        }//if: input is false, return empty string

        return text.replace(/<.*?>/g, "");
    };

    /**
     * Gets the first match from a group of regex matches
     * @param {String} text String to execute regex on
     * @param {RegExp} regexp RegExp object to run text against
     * @return {String} first match
     */ 
    this.getFirstMatch = function(text, regexp) {
        regexp = regexp
        var matchedGroup = regexp.exec(text);
        if (matchedGroup !== null && matchedGroup !== undefined) {
            return matchedGroup[1].trim();
        }
    };

    /**
     * Appends an EightyFlag value to a link
     * @param {String} eightyValue the EightyFlag to add
     * @param {String} link the link upon which to append eightyValue
     * @return {String} the link with the EightyFlag
     */
    this.append80FlagToLink = function(eightyValue, link) {
        if(!eightyValue && !link){
            return null;
        }
        else if(!eightyValue){
            return link;
        }
        else if(!link){
            return eightyValue;
        }

        var returnLink = link;
        if (link.indexOf("?") >= 0 && !/[\?\&]$/.test(link)) {
            returnLink = link + "&80flag=" + eightyValue;
        }
        else if (/[\?\&]$/.test(link)) {
            returnLink = link + "80flag=" + eightyValue;
        }
        else {
            returnLink = link + "?80flag=" + eightyValue;
        }

        return returnLink;
    };

    /**
     * Extracts the value of an EightyFlag from a link
     * @param {String} link a link with an EightyFlag
     * @return {String} the value contained in the EightyFlag on the link
     */ 
    this.get80Value = function(link) {

        if (link) {
            var eightyFlagIndex = link.indexOf("80flag=");
            if(eightyFlagIndex === -1){
                return null;
            }//if: no index of 80flag=

            var trimmedURL = link.substring(eightyFlagIndex);
            var endIndex = trimmedURL.indexOf("&");
            if(endIndex === -1){
                endIndex = link.length;
            }//if: endIndex was not found on an ampersand

            var eightyValue = trimmedURL.substring("80flag=".length, endIndex);
            return eightyValue;
        }
        return null;
    };

    // IMPORTANT Usage Note: Use makeLink on a url BEFORE appending an 80flag for review URLs. Otherwise
    // it will match on the sourceURL rather than the actual url
    this.makeLink = function(domain, href) {
        if (!domain && !href) {
            return null;
        }
        else if (!domain) {
            return href;
        }
        else if (!href) {
            return domain;
        }

        if (domain.indexOf("http://") == -1 && domain.indexOf("https://") == -1) {
            domain = "http://" + domain;
        }

        var prefix;
        prefix = domain.indexOf("https://") !== -1 ? "https" : "http";
        var base = prefix == "https" ? domain.slice(8) : domain.slice(7);


        if (base.indexOf("/") !== -1) {
            domain = prefix + "://" + base.slice(0, base.indexOf("/"));
        } else if (base.indexOf("?") !== -1) {
            domain = prefix + "://" + base.slice(0, base.indexOf("?"));
        }

        if (href.indexOf("http://") !== -1 || href.indexOf("https://") !== -1) {
            return href;
        }
        var domainCheck = prefix == "https" ? domain.slice(8) : domain.slice(7);
        domainCheck = domainCheck.indexOf("www.") !== -1 ? domainCheck.slice(4) : domainCheck;

        if (href.indexOf(domainCheck) !== -1) {
            if (href.indexOf("http://") == -1 && href.indexOf("https://") == -1) {
                return "http://" + href;
            } else {
                return href;
            }
        } else {
            if (domain[domain.length - 1] == "/" && href[0] == "/") {
                domain = domain.slice(0, -1);
            } else if (domain[domain.length - 1] !== "/" && href[0] !== "/") {
                domain += "/";
            }

            return domain + href;
        }
    };

    /**                                                                         
     * Converts an alphanumeric phone number to a purely numeric one
     * May be used before or after removing special characters            
     * @param {String} alphanumericPhone an alphanumeric phone number           
     * @return {String} the alphanumeric phone number converted to numeric form 
     */                                                                         
    this.convertAlphanumericPhone = function(rawPhone) {                                   
        // If there are no alphabetic characters in the phone, don't change it  
        if (!/\D/.test(rawPhone))                                               
            return rawPhone;                                                    
                                                                                
        // There must be no alphabetic characters in the phone, convert them    
        var convertedPhone = rawPhone.toUpperCase().split("");                                          
        for (var i = 0; i < convertedPhone.length; i++)                         
            switch (convertedPhone[i]) {                                 
                case 'A':                                                       
                case 'B':                                                       
                case 'C':                                                       
                    convertedPhone.splice(i, 1, '2');
                    break;                                                      
                case 'D':                                                       
                case 'E':                                                       
                case 'F':                                                       
                    convertedPhone.splice(i, 1, '3');
                    break;                                                      
                case 'G':                                                       
                case 'H':                                                       
                case 'I':                                                       
                    convertedPhone.splice(i, 1, '4');
                    break;                                                      
                case 'J':                                                       
                case 'K':                                                       
                case 'L':                                                       
                    convertedPhone.splice(i, 1, '5');
                    break;                                                      
                case 'M':                                                       
                case 'N':                                                       
                case 'O':                                                       
                    convertedPhone.splice(i, 1, '6');
                    break;                                                      
                case 'P':                                                       
                case 'Q':                                                       
                case 'R':                                                       
                case 'S':                                                       
                    convertedPhone.splice(i, 1, '7');
                    break;                                                      
                case 'T':                                                       
                case 'U':                                                       
                case 'V':                                                       
                    convertedPhone.splice(i, 1, '8');
                    break;                                                      
                case 'W':                                                       
                case 'X':                                                       
                case 'Y':                                                       
                case 'Z':                                                       
                    convertedPhone.splice(i, 1, '9');
                    break;                                                      
            }                                                                   
        return convertedPhone.join("");                                                  
    }  

    // eliminateDuplicates code borrowed from: http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
    this.eliminateDuplicates = function(arr) {
        if(!arr){
            return null;
        }//if: arr is falsey

        var i;
        var len = arr.length;
        var out = [];
        var obj = {};

        for (i = 0; i < len; i++) {
            if (!obj[arr[i]] && arr[i].toString().length>0) {
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
        if(!text || !currency){
            return "";
        }

        if (currency == "USD") {
            var priceRange = text.replace("$$$$", "Above USD 55.00").replace("$$$", "USD 50.00-55.00").replace("$$", "USD 25.00-40.00").replace("$", "USD 0.00-25.00");
            return priceRange;
        } else if (currency == "GBP") {
            var priceRange = text.replace("££££", "Above GBP 35.00").replace("£££", "GBP 30.00-35.00").replace("££", "GBP 15.00-25.00").replace("£", "GBP 0.00-15.00");
            return priceRange;
        }
        else{
            return text;
        }

    };

    // converts a price string into ####.##
    this.normalizePrice = function(numberString) {
        if(!numberString){
            return null;
        }//if: input numberString is falsey

        numberString = numberString.trim();
        var numberStringLength = numberString.length;

        //Check if it is using the comma as a decimal separator and change it to the dot separator
        if(numberString.substr(numberString.length-3, 3).match(/,/)){
            var last3OriginalChars = numberString.substr(numberString.length-3, 3)
            var last3NewChars = numberString.substr(numberString.length-3, 3).replace(/,/,'.')
            var re = new RegExp(last3OriginalChars+"$")
            numberString = numberString.replace(re, last3NewChars)
        }

        var numberMatch = numberString.match(/(\d+(?:[,|.]\d+)*)+/)
        if(!numberMatch)
            return null;

        if(numberMatch.length>=2){
            var number = parseFloat(numberMatch[1].replace(/,/g,''));
            if(!isNaN(number)) {
                number = number.toFixed(2)
                return numberString.replace(/(\d+(?:,|.\d+)*)+/, number)
            }
        }
        return null;
    };//function: normalizePrice


    /**
     * Converts special characters into ASCII
     * @param {String} string the string to convert to ASCII
     * @return {String} string converted to ASCII
     */ 
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
            "ě": "e",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ï": "i",
            "ñ": "n",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ř": "r",
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
    
    this.stateCodeConverter = {
        "Alabama": "AL",
        "Alaska": "AK",
        "American Samoa": "AS",
        "Arizona": "AZ",
        "Arkansas": "AR",
        "California": "CA",
        "Colorado": "CO",
        "Connecticut": "CT",
        "Delaware": "DE",
        "District Of Columbia": "DC",
        "Federated States Of Micronesia": "FM",
        "Florida": "FL",
        "Georgia": "GA",
        "Guam": "GU",
        "Hawaii": "HI",
        "Idaho": "ID",
        "Illinois": "IL",
        "Indiana": "IN",
        "Iowa": "IA",
        "Kansas": "KS",
        "Kentucky": "KY",
        "Louisiana": "LA",
        "Maine": "ME",
        "Marshall Islands": "MH",
        "Maryland": "MD",
        "Massachusetts": "MA",
        "Michigan": "MI",
        "Minnesota": "MN",
        "Mississippi": "MS",
        "Missouri": "MO",
        "Montana": "MT",
        "Nebraska": "NE",
        "Nevada": "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        "Northern Mariana Islands": "MP",
        "Ohio": "OH",
        "Oklahoma": "OK",
        "Oregon": "OR",
        "Palau": "PW",
        "Pennsylvania": "PA",
        "Puerto Rico": "PR",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        "Tennessee": "TN",
        "Texas": "TX",
        "Utah": "UT",
        "Vermont": "VT",
        "Virgin Islands": "VI",
        "Virginia": "VA",
        "Washington": "WA",
        "West Virginia": "WV",
        "Wisconsin": "WI",
        "Wyoming": "WY",
        "Slberta": "AB",
        "British Columbia": "BC",
        "Manitoba": "MB",
        "New Brunswick": "NB",
        "Newfoundland Snd Labrador": "NL",
        "Nova Scotia": "NS",
        "Nunavut": "NU",
        "Ontario": "ON",
        "Prince Edward Island": "PE",
        "Quebec": "QC",
        "Saskatchewan": "SK",
        "Yukon": "YT"
    }

    this.countryCodeConverter = {
        "Albania": "AL",
        "Afghanistan": "AF",
        "Andorra": "AD",
        "Anguilla": "AI",
        "Algeria": "DZ",
        "American Samoa": "AS",
        "Angola": "AO",
        "Antigua and Barbuda": "AG",
        "Argentina": "AR",
        "Armenia": "AM",
        "Aruba": "AW",
        "Australia": "AU",
        "Austria": "AT",
        "Azerbaijan": "AZ",
        "Bahamas": "BS",
        "Bahrain": "BH",
        "Bangladesh": "BD",
        "Barbados": "BB",
        "Bay Islands Honduras": "HN",
        "Belarus": "BY",
        "Belize": "BZ",
        "Belgium": "BE",
        "Benin": "BJ",
        "Bermuda": "BM",
        "Bhutan": "BT",
        "Bosnia and Herzegovina": "BA",
        "Bolivia": "BO",
        "Bonaire": "BQ",
        "Botswana": "BW",
        "Brazil": "BR",
        "British Virgin Islands": "VG",
        "UK Virgin Islands": "VG",
        "Brunei": "BX",
        "Bulgaria": "BG",
        "Burundi": "BI",
        "Cambodia": "KH",
        "Cameroon": "CM",
        "Canada": "CA",
        "Cape Verde": "CV",
        "Cayman Islands": "KY",
        "Costa Rica": "CR",
        "Czech Republic": "CZ",
        "China": "CN",
        "Chile": "CL",
        "Colombia": "CO",
        "Cook Islands": "CK",
        "Cote d'Ivoire": "CI",
        "Croatia": "HR",
        "Cuba": "CU",
        "Curacao": "CW",
        "Cyprus": "CY",
        "Denmark": "DK",
        "Djibouti": "DJ",
        "Dominica": "DM",
        "Dominican Republic": "DO",
        "Ecuador": "EC",
        "Egypt": "EG",
        "El Salvador": "SV",
        "England": "GB",
        "Eritrea": "ER",
        "Estonia": "EE",
        "Ethiopia": "ET",
        "Faroe Islands": "FO",
        "Federated States of Micronesia": "FM",
        "Figi": "FJ",
        "Finland": "FI",
        "France": "FR",
        "French Guiana": "GF",
        "French Polynesia": "PF",
        "Gambia": "GM",
        "Georgia": "GE",
        "Germany": "DE",
        "Ghana": "GH",
        "Greece": "GR",
        "Grenada": "GD",
        "Greenland": "GL",
        "Guadeloupe": "GP",
        "Guam": "GU",
        "Guatemala": "GT",
        "Guernsey": "GG",
        "Guyana": "GY",
        "Haiti": "HT",
        "Hong Kong": "HK",
        "Hungary": "HU",
        "Honduras": "HN",
        "Iceland": "IS",
        "Ireland": "IE",
        "India": "IN",
        "Indonesia": "ID",
        "Iran": "IR",
        "Iraq": "IQ",
        "Israel": "IL",
        "Italy": "IT",
        "Jamaica": "JM",
        "Japan": "JP",
        "Jordan": "JO",
        "Kazakhstan": "KZ",
        "Kenya": "KE",
        "Kiribati": "KI",
        "Kosovo": "XK",
        "Kuwait": "KW",
        "Kyrgyzstan": "KG",
        "Laos": "LA",
        "Latvia": "LV",
        "Lebanon": "LB",
        "Lesotho": "LS",
        "Libyia": "LY",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "Macao": "MO",
        "Macau": "MO",
        "Madagascar": "MG",
        "Malawi": "MW",
        "Malaysia": "MY",
        "Maldives": "MV",
        "Malta": "MT",
        "Marshall Islands": "MH",
        "Martinique": "MQ",
        "Mauritania": "MR",
        "Mauritius": "MU",
        "Mexico": "MX",
        "Moldova": "MD",
        "Monaco": "MC",
        "Mongolia": "MN",
        "Montserrat": "MS",
        "Montenegro": "ME",
        "Morocco": "MA",
        "Mozambique": "MZ",
        "Myanmar": "MM",
        "Nambia": "NA",
        "Namibia": "NA",
        "Nauru": "NR",
        "Nepal": "NP",
        "Netherlands": "NL",
        "New Caledonia": "NC",
        "New Zealand": "NZ",
        "Nicaragua": "NI",
        "Nigeria": "NG",
        "Niue": "NU",
        "Norfolk Island": "NF",
        "North Korea": "KP",
        "Northern Ireland": "GB",
        "Northern Mariana Islands": "MP",
        "Norway": "NO",
        "Oman": "OM",
        "Pakistan": "PK",
        "Panama": "PA",
        "Papua New Guinea": "PG",
        "Palau": "PW",
        "Paraguay": "PY",
        "Peru": "PE",
        "Pitcairn": "PN",
        "Philippines": "PH",
        "Poland": "PL",
        "Portugal": "PT",
        "Puerto Rico": "PR",
        "Qatar": "QA",
        "Republic of Macedonia": "MK",
        "Reunion Island": "RE",
        "Romania": "RO",
        "Russia": "RU",
        "Saba": "BQ",
        "Saint Barthelemy": "BL",
        "Saint Eustacius": "BQ",
        "Saint Kitts and Nevis": "KN",
        "Saint Lucia": "LC",
        "Saint Martin-Sint Maarten": "MF",
        "Saint Vincent and the Grenadines": "VC",
        "San Marino": "SM",
        "Samoa": "WS",
        "Saudi Arabia": "SA",
        "Scotland": "GB",
        "Senegal": "SN",
        "Serbia": "RS",
        "Seychelles": "SC",
        "Singapore": "SG",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Solomon Islands": "SB",
        "South Africa": "ZA",
        "South Korea": "KR",
        "Spain": "ES",
        "Sri Lanka": "LK",
        "Suriname": "SR",
        "Swaziland": "SZ",
        "Sweden": "SE",
        "Switzerland": "CH",
        "Syria": "SY",
        "Taiwan": "TW",
        "Tajikistan": "TJ",
        "Tanzania": "TZ",
        "Thailand": "TH",
        "Timor-Leste": "TL",
        "Timor Leste": "TL",
        "Tokelau": "TK",
        "Tonga": "TO",
        "Trinidad and Tobago": "TT",
        "Tunisia": "TN",
        "Turkey": "TR",
        "Turkmenistan": "TM",
        "Turks and Caicos": "TC",
        "Tuvalu": "TV",
        "Uganda": "UG",
        "Ukraine": "UA",
        "United Arab Emirates": "AE",
        "United Kingdom": "GB",
        "United States": "US",
        "United States of America": "US",
        "Uruguay": "UY",
        "Uzbekistan": "UZ",
        "U.S. Virgin Islands": "VI",
        "Vanuatu": "VU",
        "Vatican City": "VA",
        "Venezuela": "VE",
        "Vietnam": "VN",
        "Wales": "GB",
        "Wallis and Futuna": "WF",
        "West Bank and Gaza": "PS",
        "Yemen": "YE",
        "Zambia": "ZM",
        "Zimbabwe": "ZW",
        "AFG": "AF",
        "ALB": "AL",
        "DZA": "DZ",
        "ASM": "AS",
        "AND": "AD",
        "AGO": "AO",
        "AIA": "AI",
        "ATA": "AQ",
        "ATG": "AG",
        "ARG": "AR",
        "ARM": "AM",
        "ABW": "AW",
        "AUS": "AU",
        "AUT": "AT",
        "AZE": "AZ",
        "BHS": "BS",
        "BHR": "BH",
        "BGD": "BD",
        "BRB": "BB",
        "BLR": "BY",
        "BEL": "BE",
        "BLZ": "BZ",
        "BEN": "BJ",
        "BMU": "BM",
        "BTN": "BT",
        "BOL": "BO",
        "BIH": "BA",
        "BWA": "BW",
        "BVT": "BV",
        "BRA": "BR",
        "IOT": "IO",
        "BRN": "BN",
        "BGR": "BG",
        "BFA": "BF",
        "BDI": "BI",
        "KHM": "KH",
        "CMR": "CM",
        "CAN": "CA",
        "CPV": "CV",
        "CYM": "KY",
        "CAF": "CF",
        "TCD": "TD",
        "CHL": "CL",
        "CHN": "CN",
        "CXR": "CX",
        "CCK": "CC",
        "COL": "CO",
        "COM": "KM",
        "COG": "CG",
        "COD": "CD",
        "COK": "CK",
        "CRI": "CR",
        "CIV": "CI",
        "HRV": "HR",
        "CUB": "CU",
        "CYP": "CY",
        "CZE": "CZ",
        "DNK": "DK",
        "DJI": "DJ",
        "DMA": "DM",
        "DOM": "DO",
        "TMP": "TP",
        "ECU": "EC",
        "EGY": "EG",
        "SLV": "SV",
        "GNQ": "GQ",
        "ERI": "ER",
        "EST": "EE",
        "ETH": "ET",
        "FLK": "FK",
        "FRO": "FO",
        "FJI": "FJ",
        "FIN": "FI",
        "FRA": "FR",
        "FXX": "FX",
        "GUF": "GF",
        "PYF": "PF",
        "ATF": "TF",
        "GAB": "GA",
        "GMB": "GM",
        "GEO": "GE",
        "DEU": "DE",
        "GHA": "GH",
        "GIB": "GI",
        "GRC": "GR",
        "GRL": "GL",
        "GRD": "GD",
        "GLP": "GP",
        "GUM": "GU",
        "GTM": "GT",
        "GIN": "GN",
        "GNB": "GW",
        "GUY": "GY",
        "HTI": "HT",
        "HMD": "HM",
        "VAT": "VA",
        "HND": "HN",
        "HKG": "HK",
        "HUN": "HU",
        "ISL": "IS",
        "IND": "IN",
        "IDN": "ID",
        "IRN": "IR",
        "IRQ": "IQ",
        "IRL": "IE",
        "ISR": "IL",
        "ITA": "IT",
        "JAM": "JM",
        "JPN": "JP",
        "JOR": "JO",
        "KAZ": "KZ",
        "KEN": "KE",
        "KIR": "KI",
        "PRK": "KP",
        "KOR": "KR",
        "KWT": "KW",
        "KGZ": "KG",
        "LAO": "LA",
        "LVA": "LV",
        "LBN": "LB",
        "LSO": "LS",
        "LBR": "LR",
        "LBY": "LY",
        "LIE": "LI",
        "LTU": "LT",
        "LUX": "LU",
        "MAC": "MO",
        "MKD": "MK",
        "MDG": "MG",
        "MWI": "MW",
        "MYS": "MY",
        "MDV": "MV",
        "MLI": "ML",
        "MLT": "MT",
        "MHL": "MH",
        "MTQ": "MQ",
        "MRT": "MR",
        "MUS": "MU",
        "MYT": "YT",
        "MEX": "MX",
        "FSM": "FM",
        "MDA": "MD",
        "MCO": "MC",
        "MNG": "MN",
        "MNE": "ME",
        "MSR": "MS",
        "MAR": "MA",
        "MOZ": "MZ",
        "MMR": "MM",
        "NAM": "NA",
        "NRU": "NR",
        "NPL": "NP",
        "NLD": "NL",
        "ANT": "AN",
        "NCL": "NC",
        "NZL": "NZ",
        "NIC": "NI",
        "NER": "NE",
        "NGA": "NG",
        "NIU": "NU",
        "NFK": "NF",
        "MNP": "MP",
        "NOR": "NO",
        "OMN": "OM",
        "PAK": "PK",
        "PLW": "PW",
        "PAN": "PA",
        "PNG": "PG",
        "PRY": "PY",
        "PER": "PE",
        "PHL": "PH",
        "PCN": "PN",
        "POL": "PL",
        "PRT": "PT",
        "PRI": "PR",
        "QAT": "QA",
        "REU": "RE",
        "ROM": "RO",
        "RUS": "RU",
        "RWA": "RW",
        "KNA": "KN",
        "LCA": "LC",
        "VCT": "VC",
        "WSM": "WS",
        "SMR": "SM",
        "STP": "ST",
        "SAU": "SA",
        "SEN": "SN",
        "SRB": "RS",
        "SYC": "SC",
        "SLE": "SL",
        "SGP": "SG",
        "SVK": "SK",
        "SVN": "SI",
        "SLB": "SB",
        "SOM": "SO",
        "ZAF": "ZA",
        "SSD": "SS",
        "SGS": "GS",
        "ESP": "ES",
        "LKA": "LK",
        "SHN": "SH",
        "SPM": "PM",
        "SDN": "SD",
        "SUR": "SR",
        "SJM": "SJ",
        "SWZ": "SZ",
        "SWE": "SE",
        "CHE": "CH",
        "SYR": "SY",
        "TWN": "TW",
        "TJK": "TJ",
        "TZA": "TZ",
        "THA": "TH",
        "TGO": "TG",
        "TKL": "TK",
        "TON": "TO",
        "TTO": "TT",
        "TUN": "TN",
        "TUR": "TR",
        "TKM": "TM",
        "TCA": "TC",
        "TUV": "TV",
        "UGA": "UG",
        "UKR": "UA",
        "ARE": "AE",
        "GBR": "GB",
        "USA": "US",
        "UMI": "UM",
        "URY": "UY",
        "UZB": "UZ",
        "VUT": "VU",
        "VEN": "VE",
        "VNM": "VN",
        "VGB": "VG",
        "VIR": "VI",
        "WLF": "WF",
        "ESH": "EH",
        "YEM": "YE",
        "ZMB": "ZM",
        "ZWE": "ZW",
        "Chad": "TD",
        "São Tomé and Príncipe": "ST",
        "Sao Tome and Principe": "ST",
        "Mali": "ML",
        "Niger": "NE",
        "Guinea": "GN",
        "Guinea-Bissau": "GW"
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

    //***************************
    // AMAZON SPECIFIC FUNCTIONS
    // **************************

    // get ASIN Helper Function
    // returns a string ASIN
    this.getASIN = function(html, url) {
        var $html = html;
        var url = url;
        var parentASIN = this.getFirstMatch(html, /"parent_asin":"(.*?)",/);
        var asinCheck = $html.find('#averageCustomerReviews').attr('data-asin');
        var asinCheck2 = this.getFirstMatch(url, /\/dp\/(.*?)\/ref/);
        var asinCheck3 = this.getFirstMatch(url, /\/gp\/product\/(.*?)\/ref/);
        var ASIN = "";
        if (parentASIN !== "" && parentASIN !== undefined) {
            ASIN = parentASIN;
        } else if (asinCheck !== "" && asinCheck !== undefined) {
            ASIN = asinCheck;
        } else if (asinCheck2 !== "" && asinCheck2 !== undefined) {
            ASIN = asinCheck2;
        } else if (asinCheck3 !== "" && asinCheck3 !== undefined) {
            ASIN = asinCheck3;
        } else {
            ASIN = this.getFirstMatch(url, /(?:gp\/product\/|dp\/)(.*?)(?:\/|$)/);
        }
        return ASIN;
    };
    
    // Encodes Spanish characters
    this.encodeSpanish = function(text) {
        var specialChars = ["á", "é", "í", "ó", "ú", "ñ", "ü",
            "Á", "É", "Í", "Ó", "Ú", "Ñ", "Ü"];
        var encodedChars = new Array();
            
        for (var i = 0; i < specialChars.length; i++)
            encodedChars.push(encodeURI(specialChars[i]));
                
        for (var i = 0; i < specialChars.length; i++) 
            text = text.replace(new RegExp(specialChars[i], 'g'), encodedChars[i]);
        
        return text;
    }

    // getAttribute Helper Function
    // accepts an array of attributes to check
    // returns a string for the attribute desired
    this.getAttribute = function(html, attr) {
        var $html = html;
        var attribute = "";
        for (i = 0; i < attr.length; i++) {
            if (attribute === "" || attribute === undefined) {
                attribute += $html.find('td.label:contains(' + attr[i] + ')').next('td.value').text().trim();
            }
            if (attribute === "" || attribute === undefined) {
                attribute += $html.find('tr:contains(' + attr[i] + ')').first().next('td').text().trim();
            }
            if (attribute === "" || attribute === undefined) {
                attribute += $html.find('li.content b:contains(' + attr[i] + ')').first().parent().find('b').remove().end().text().trim();
            }
            if (attribute === "" || attribute === undefined) {
                attribute += $html.find('li b:contains(' + attr[i] + ')').first().parent().find('b').remove().end().text().trim();
            }
            if (/Product Dimensions|UPC|Item model number/.test(attr[i]) && (attribute === "" || attribute === undefined)) {
                attribute += $html.find('span:contains(' + attr[i] + ')').first().find('span').last().text().trim();
            }
            if (attr[i] === "Product Dimensions" && attribute !== "" && attribute !== undefined) {
                attribute = this.getFirstMatch(attribute, /(.*?)(?:\;|$)/);
            }
            if (/Material|Size|dimensions/.test(attr[i]) && (attribute === "" || attribute === undefined)) {
                attribute += this.getFirstMatch($html.find('span:contains(' + attr[i] + ')').text().trim(), /attr[i]\s*?\:\s*?(.*?)(?:,|$)/);
            }
            if (/Brand/.test(attr[i]) && (attribute.length === 0 || attribute === undefined)) {
                attribute += $html.find('a#brand').text().trim();
            }

        }
        return attribute.replace(/\bundefined\b/g, "");
    };

    // Setting Price Attributes Based on Domain Helper Function
    // returns an array containing price, shipping, and store information
    this.setPriceAttributes = function(domain, price, shipping) {
        var domain = domain;
        var domainPrice = price;
        var domainShipping = shipping;
        var domainStore = "";
        if (domain === "http://www.amazon.in") {
            domainPrice = this.getPlainText(domainPrice.replace(/Rs./g, "").replace(/₹/g, ""));
            if (!/^INR /.test(domainPrice)) {
                domainPrice = domainPrice.replace(/^/, "INR ");
            }
            domainStore = "Amazon.in";
            domainShipping = this.getPlainText(domainShipping.replace(/\+/, ""));

        } else if (domain === "http://www.amazon.com") {
            domainPrice = this.getPlainText(domainPrice.replace(/\$/g, "USD ").replace(/,/g, ""));
            domainStore = "Amazon.com";
            if (domainShipping !== "" && domainShipping !== undefined) {
                domainShipping = this.getPlainText(domainShipping.replace(/\$/, "USD ").replace(/\+/, "").replace(/Details/, ""));
                if (/\d+\.(?: |$)/.test(domainShipping)) {
                    domainShipping = domainShipping.replace(/\./, ".00");
                }
            } else {
                domainShipping = "";
            }
        }
        return [domainPrice, domainShipping, domainStore];
    };//function: setPriceAttributes


    // Helper function that fixes the day value for hours attribute that are in the form Mon/Mon - Fri/Mon-Sat
    // Expected values:
    //      Mon
    //      Mon - Fri
    // Param:
    //      value: string
    //      A string containing a Day or days range
    // Return:
    //      A string in the correct format Monday - Friday or Monday/Friday
    //      Else it will return the same value
    this.processDay = function(value){
        var weekdays = {
            'mon': 'Monday',
            'tue': 'Tuesday',
            'wed': 'Wednesday',
            'thu': 'Thursday',
            'fri': 'Friday',
            'sat': 'Saturday',
            'sun': 'Sunday'
        }

        var new_value = value
        for(day in weekdays) {
            var re = new RegExp(day, "i" )
            new_value = new_value.replace(re, weekdays[day])
        }
        return new_value
    }

    // Helper function that fixes the hour range values
    // Expected values:
    //  9 am - 5 pm
    //  09am - 4pm
    //  24 hours
    //  08:30am - 04:00pm
    //  08am - 04pm
    //  6:00 am - 7:00 pm
    //  6:00am - 7:00pm
    // Param:
    //      value: string
    // Returns:
    //      If valid hour range, returns it, else tries to fix it, or report that a fix is needed
    this.processHour = function(value){
        if(value.match(/(\d{1,2})(:\d{2})* *([a|p]m) *(?:to|-|through) *(\d{1,2})(:\d{2})* *([a|p]m)/i)){
            function replacer(match, m1, m2, m3, m4, m5, m6){
                return m1+(m2===undefined? ':00' : m2)+' '+m3+' - '+m4+(m5===undefined? ':00' : m5)+' '+m6
            }
            return value.replace(/(\d{1,2})(:\d{2})* *([a|p]m) *(?:to|-|through) *(\d{1,2})(:\d{2})* *([a|p]m)/i, replacer).toLowerCase()
        } else if(value.match(/24 hour/i)){
            return '12:00 am - 11:59 pm'
        } else {
            return 'manual check required'
        }
    }

    // Helper function that validates the payment type, returns true if valid payment type or false otherwise.
    // Param:
    //      type: string
    //      Value to check if it is in the valid types
    // Returns:
    //      True if valid, false otherwise.
    this.processPaymentTypes = function(type){
        var valid = ['Amex', 'American Express', 'Visa',
            'Mastercard', 'master card','Diners Club',
            'PayPal','Bitcoin', 'Cash','Check', 'Debit',
            'Debit Card','ACH','JBC','Access','Discover',
            'Carte Blanch','Novus','Gift Card','egift',
            'layaway','euromastercard','ATM']

        var re = new RegExp(type, 'i')
        for(var elem in valid){
            if(valid[elem].match(re))
                return true
        }

        return false
    }

  // Return an object where object.key = value and object.sourceURL = url
  this.convertStringToObjectWithSourceURL = function (key, value, url) {

    var newObject = {};
    newObject[key] = value;
    newObject.sourceURL = this.strip80flagFromURL(url);
    
    return newObject;
  };
    
  this.addSourceURLToObject = function (obj, url) {
      
    obj.sourceURL = this.strip80flagFromURL(url);
    return obj;
  };
    
  // Return a list of objects, with each object containing a sourceURL attribute.
  // If old value is a string, it will set the key of the new object to the name of the old key.
  this.finalizeFieldAsListOfObjects = function(oldFieldName, oldField, url) {

    var app = this;
    var newFieldList = [];
    var newField = {};
    var newFieldValueName; // the value field for the object. E.g., prices.amount

    // Option 1: The field is a single-valued string. We need to create an object, add a sourceURL for the field, and push it to an array.
    if (typeof oldField === "string") {
      newFieldList.push(app.convertStringToObjectWithSourceURL(oldFieldName,oldField,url));

    } else if (typeof oldField === "object") {
      // Option 2: The field is already an array. We need to check if it's an array of objects or strings. We need to add sourceURLs and push the new objects to an array.
      if (oldField.constructor === Array) {

      var oldFieldArrayLength = oldField.length;
      for (var i = 0; i < oldFieldArrayLength; i++) {

        var oldFieldElement = oldField[i];

        if (typeof oldFieldElement === "string") {
          newFieldList.push(app.convertStringToObjectWithSourceURL(oldFieldName,oldFieldElement,url));
        } else if (typeof oldFieldElement === "object") {
          newFieldList.push(app.addSourceURLToObject(oldFieldElement,url));
        }
      }

      // Option 3: The field is a single object. We need to add sourceURL if needed. Then we push to an array.
      } else {
        newFieldList.push(app.addSourceURLToObject(oldField,url));
      }

    // Option 4: The field type is undefined.. this shouldn't happen.
    } else {

    }
        
    return newFieldList;
  };

  // Maps key names to new key names in a list of objects
  this.finalizeObjectList = function(objectList, oldKeyName, newKeyName) {

    var newObjectList = [];

    for (var i = 0; i < objectList.length; i++) {
      var objectElement = objectList[i];
      if (oldKeyName in objectElement) {
        objectElement[newKeyName] = objectElement[oldKeyName];
        delete objectElement[oldKeyName];
      }

      newObjectList.push(objectElement);
    }

    return newObjectList;
  }

  // Splits price value strings into currency and amount attributes.  Returns an object.
  this.finalizePrice = function(priceString) {
    
    var priceObject = {};
    var priceStringREOne = new RegExp('[A-Z]{3} [0-9,\.]{1,}');
    var priceStringRETwo = new RegExp('[A-Z]{3} [0-9,\.]{1,} - [A-Z]{3} [0-9,\.]{1,}');

    // Option 1: priceString is like "USD ###"
    if (priceStringREOne.test(priceString)) {

      var priceStringArr = priceString.split(' ');
      var priceCurrency = priceStringArr[0];
      var priceAmount = parseFloat(priceStringArr[1]).toFixed(2);

      priceObject.currency = priceCurrency;
      priceObject.amountMin = priceAmount;
      priceObject.amountMax = priceAmount;
      
    // Option 2: priceString is like "USD ### - USD ###"
    } else if (priceStringRETwo.test(priceString)) {

      var priceStringArr = priceString.split(' - ');
      var priceRangeMin = priceStringArr[0];
      var priceRangeMax = priceStringArr[1];

      var priceRangeMinArr = priceRangeMin.split(' ');
      var priceRangeMaxArr = priceRangeMax.split(' ');

      var priceCurrency = priceRangeMinArr[0];
      var priceAmountMin = parseFloat(priceRangeMinArr[1]).toFixed(2);
      var priceAmountMax = parseFloat(priceRangeMaxArr[1]).toFixed(2);

      priceObject.currency = priceCurrency;
      priceObject.amountMin = priceAmountMin;
      priceObject.amountMax = priceAmountMax;

    }

    return priceObject;
  }

  // Maps legacy price objects to new price object format.
  this.finalizePriceObject = function(priceObject) {

    var newPriceObject = priceObject;

    if ('price' in priceObject) {
      var newPriceObjFromString = this.finalizePrice(priceObject.price);

      newPriceObject.currency = newPriceObjFromString.currency;
      newPriceObject.amountMin = newPriceObjFromString.amountMin;
      newPriceObject.amountMax = newPriceObjFromString.amountMax;
      delete newPriceObject.price;

    } else if ('salePrice' in priceObject) {
      var newPriceObjFromString = this.finalizePrice(priceObject.salePrice);

      newPriceObject.currency = newPriceObjFromString.currency;
      newPriceObject.amountMin = newPriceObjFromString.amountMin;
      newPriceObject.amountMax = newPriceObjFromString.amountMax;
      newPriceObject.isSale = true;
      delete newPriceObject.salePrice;

    } else if ('priceRange' in priceObject) {
      var newPriceObjFromString = this.finalizePrice(priceObject.priceRange);

      newPriceObject.currency = newPriceObjFromString.currency;
      newPriceObject.amountMin = newPriceObjFromString.amountMin;
      newPriceObject.amountMax = newPriceObjFromString.amountMax;
      delete newPriceObject.priceRange;

    }

    return newPriceObject;
  }

  // Map any legacy data type values to new/current data type values
  this.finalizeDataType = function(dataType) {
    
    var newDataType = dataType;
    
    if (dataType === 'product') { // This isn't changing, just keeping as a placeholder
        
    } else if (dataType === 'products') {
      newDataType = 'product';
    } else if (dataType === 'business') { // Placeholder

    } else if (dataType === 'location') {
      newDataType = 'business';     
    } else if (dataType === 'locations') {
      newDataType = 'business';
    } else if (dataType === 'property') { // This isn't changing, just keeping as a placeholder

    } else if (dataType === 'properties') {
      newDataType = 'property';
    } else {
      return newDataType = null;
    }
    
    return newDataType;
  };
    
  // A generic method for removing any paramter from a URL, taken from http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
  this.removeURLParameter = function(url, parameter) {

    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');

    if (urlparts.length >= 2) {

      var prefix = encodeURIComponent(parameter) + '=';
      var pars = urlparts[1].split(/[&;]/g);
    
      //reverse iteration as may be destructive
      for (var i= pars.length; i-- > 0;) {    
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
          pars.splice(i, 1);
        }
      }
    
      url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
      return url;
    } else {
      return url;
    }
  };
    
  // Remove the 80flag parameter from a URL
  this.strip80flagFromURL = function (url) {
    
    var urlWithout80flag = url;
    if ((url.indexOf("?80flag=") == -1) || (url.indexOf("&80flag=") == -1))
      urlWithout80flag = this.removeURLParameter(url,"80flag");
    return urlWithout80flag;
  };

  // A method for finalizing a crawl record.  This method prepares a record for import into Datafiniti.  It updates it from any legacy settings.
  this.finalizeRecord = function(result, url) {
 
    // check if result is an array of records
    if (result.constructor === Array) {

      var finalizedResultList = [];
      for (i = 0; i < result.length; i++) {
        finalizedResultList.push(this.finalizeRecord(result[i],url));
      }

      return finalizedResultList;

    } else {

      var app = this;
      var finalizedResult = result;

      // Modify specific fields that were changed during DSE>ES migration
      // Add more fields here as needed
      if ('description' in result)  {
        finalizedResult.descriptions    = app.finalizeFieldAsListOfObjects('description', result.description, url);
	finalizedResult.descriptions	= app.finalizeObjectList(finalizedResult.descriptions, 'description', 'value');
        delete finalizedResult.description;
      }
      if ('descriptions' in result)  {
        finalizedResult.descriptions    = app.finalizeFieldAsListOfObjects('description', result.descriptions, url);
        finalizedResult.descriptions    = app.finalizeObjectList(finalizedResult.descriptions, 'description', 'value');
      }

      if ('prices' in result) {
        finalizedResult.prices          = app.finalizeFieldAsListOfObjects('prices', result.prices, url);
        var newFinalizedPriceList = [];
        for (i = 0; i < finalizedResult.prices.length; i++) {
          var newPriceObject = app.finalizePriceObject(finalizedResult.prices[i]);
          newFinalizedPriceList.push(newPriceObject);
        }
        finalizedResult.prices = newFinalizedPriceList;
      }
      if ('reviews' in result) {
        finalizedResult.reviews         = app.finalizeFieldAsListOfObjects('reviews', result.reviews, url);
      }
      if ('sku' in result) {
        finalizedResult.skus            = app.finalizeFieldAsListOfObjects('sku', result.sku, url);
        finalizedResult.skus		= app.finalizeObjectList(finalizedResult.skus, 'sku', 'value');
        delete finalizedResult.sku;
      }
      
      // Add a dateSeen to descriptions
      if ('descriptions' in finalizedResult)
        for (var i = 0; i < finalizedResult.descriptions.length; i++)
            finalizedResult.descriptions[i].dateSeen = new Date();
      
      // Make sure data type is correct
      if ('data_type' in result) {
        finalizedResult.dataType = result.data_type;
        delete finalizedResult.data_type;
      }
      finalizedResult.dataType = app.finalizeDataType(result.dataType);
      
      // add sourceURL to record, strip out 80flags
      var sourceURLs = [];
      sourceURLs.push(app.strip80flagFromURL(url));
      finalizedResult.sourceURLs = sourceURLs;
      
    }

    return finalizedResult;
  };

};//function: EightyAppBase

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
