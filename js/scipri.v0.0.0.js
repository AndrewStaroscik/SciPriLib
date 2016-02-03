/** Andrew Staroscik 2011-2016 
  * SciencePrimer.com
  *
  * Main script for sPLib v0.1
  * Desc: JS and CSS files for performing common tasks in SciencePrimer illustrations. js functions live in the sP name space
  *
  **/

/**
  *
  * notes:
  * 	Will use the module pattern so things have to be declared in the body of the sP object and then returend at the end. 
  *
  **/


var sP = (function() {
	// delcare the object to be returned: 
	var lib = {};  // this can and will be returned in a way that will allow desired functions to be called as methods of sP (ie sp.myMethodName)


	/**
	 * Function to deal with the desire to format exponents with ###x10^# rather than with e notation
	 * 		See readNiceExp to use the object
	 *
	 * @method niceExp
	 * @param {number} n the number to base the formated number on
	 * @param {len} n the number of decimal places to leave on the number
	 *
	 * @returns {object} and object containing:
	 * 		raw: {number} the raw number  
	 * 		rawShort: {number} raw number rounded to len
	 * 		nForExp: {number} the number side of the number (raw with decimal moved) 
	 * 		nForExpShort: {number} the number side of the number rounded to len as it will appear in the exponents
	 * 		exp: {number} the exponent based on the number decimals moved for nForExp
	 * 		nNice: {string} the html formated number in the format of ##x10<sup>#</sup>
	 */
	lib.niceExp = function(n,len) {
		var returnObj = {},
		len = len || 3;

		returnObj.raw = n*1;
		returnObj.rawShort = parseFloat(returnObj.raw.toFixed(len));

		returnObj.exp = Math.floor(Math.log(n)/Math.log(10));
		returnObj.nForExp = n/Math.pow(10,returnObj.exp);
		returnObj.nForExpShort = parseFloat(returnObj.nForExp.toFixed(len)); // parseFloat used to remove trailing zeros as described here: http://stackoverflow.com/a/19623253/1112097
		returnObj.nNice = returnObj.nForExpShort + "&#215;10<sup>" + returnObj.exp + "</sup>";

		return returnObj;
	}

	/**
	 * Function returns a number rounded to the sepcified number of decimal points. 
	 * Similar to the internal function toFixed but returns a number not a string. 
	 *
	 * @method rndToX
	 * @param {number} n the number to round
	 * @param {number} x the number of places after the decimal to leave
	 *
	 * returns {number} number (n) rounded to x places
	 *
	 */
	lib.rndToX = function(n,x) {
		return Math.round(n * Math.pow(10,x))/Math.pow(10,x);
	};


	// Private methods and variables:
	


	return lib;
}());

