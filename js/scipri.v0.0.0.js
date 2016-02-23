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

	lib.pF = {}; // container for pym functions (I don't know why I named it pF. Maybe the f is associated with the f in iFrame?)

	/**
	 * For resizing a div element based on a pym resize - kind of weirdly written. As written dim[0] and max have to be the same thing. 
	 *  The starting point is the size of the element at max size so it should never exceed that. of the cW parameter exceedes max it will 
	 *  be set to max. 
	 *
	 * 	@param {String} id the id of the div (needs an id (#) or class (.) prefix
	 *	@param {Array} dim width and height of element at full size in the form of [w,h]
	 *	@param {Number} cW the current width of the container will be used to scale to element appropriatly  
	 *	@param {Number} aR the aspect ratio of full size main div width/height 
	 *	@param {Number} max Max width of the containing div - div won't get any bigger than this should dim[0]
	 *	@param {Number} min Min width of the containing div - div won't get any smaller than this
	 *
	 *	No return side effect is using jQuery to resize the element. 
	 *
	 */
	lib.pF.setFrame = function(id, dim, cW, aR, max, min) {

		var w = dim[0],
			h = dim[1];

		cW = cW < max ? cW : max;
		cW = cW > min ? cW : min;

		var width = (w * cW / max) + "px",
			height = (h * cW / max) + "px";
	
		// don't want to use jQuery 

		var el = document.getElementById(id);

		el.style.width = width;
		el.style.height = height;

		//$(id).css("width", width);

		//$(id).css("height", height);
		

	
	}; // end lib.pF.setFrame() method
	/**
	 * 	Returns the scaled value of a number passed in with the new and old Widths/Heights
	 *
	 * 	@param {Number} v the value to adjust
	 * 	@param {Number} n newWidth or height
	 * 	@param {Number} o original width or height 
	 * 	@param {Number} aR aspect ratio if height change is needed. will default to 1 if nothing entered. 
	 *
	 */
	lib.pF.scEl = function(v,n,o, aR) {

		aR = aR || 1;

		return (v * n / o) * aR;
	}; // end lib.pF.scEl() method.

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

	/**
	 * 
	 * 	A set of methods to draw  scalable, responsive selector switchs as svg using d3js and pymjs.
	 *	
	 *	Page must have d3. will work with pymjs on a resize if pym is present and the the adjustment information is passed in.
	 *	If pym is not present don't pass a p argument in and the scaling will default to 1. 
	 *
	 *	This is a fairly fragile and opinionated set of methods but used properly will save time in adding svg switch elements to illustrations.
	 *
	 *
	 *
	 */

	lib.swtch = {
	
		/**
		 * Takes an object with the switch information and makes the switch using d3
		 *
		 *	@param {Array} d3 array/object - the d3 svg element the switch is to be installed into 
		 *	@param {Object} o - an object created with Object.create(swtchObjProto)... 
		 *
		 */
		renderSwtch: function(svg, o) {
	
			var i, iMax,
				tmpEl,
				atr,
				sty,
				txt,
				swtchEl = svg.append("g")
					.attr("id", o.id)
					.attr("class", o["class"])
					.attr("swpos", o.swpos)
					.attr("transform", "translate(" + o.gtX + "," + o.gtY + ")");


			iMax = o.elements.length;
	
			for (i = 0; i < iMax; i += 1) {
				tmpEl = o.elements[i];

				if (tmpEl.type === "text") {
					swtchEl
						.append(tmpEl.type)
						.attr(tmpEl.attr)
						.style(tmpEl.style)
						.text(tmpEl.text);
				} else { // not a text element
					swtchEl
						.append(tmpEl.type)
						.attr(tmpEl.attr)
						.style(tmpEl.style);
				}
	
			}
	
		},
		/**
		 * Uses an Object.create call to make a switch object using the swtchObjProto as the prototype
		 *
		 *	@param {Object} o an object that contains information about the Switch
		 *	@param {Object} p an object that contains svg size information for scaling. If noting is passed in it has a default that does no scaling. 
		 *
		 */
		newSwtch: function(o,p) {

			var p = p || {oW: 1, aR: 1, oH: 1, nW: 1, nH: 1}; // default will not scale
	
			var switchPosAdjust = o.swpos === "left" ? 0 : 45 * p.nW / p.oW; 
	
			var newObj = {
				"class": "noselect",
				"elements": [
				{
					"name": "bkgrnd",
					"type": "rect",
					"id": o.id + "bkgrnd",

					"attr": {
						"x": 0,
						"y": 0, 
						"ry": p.nH * 6/p.oH,
						"height": p.nH * 30/p.oH, 
						"width": p.nW * 90/p.oW
					},
					"style": {
						"fill": "#ffffff",
						"stroke": "#232323",
						"stroke-width": p.nW * 1.5/ p.oW
					}
				},
				{
					"name": "txtleft",
					"type": "text",
					"id": o.id + "txtleft",
					"attr": {
						"x": p.nW * 80/p.oW,
						"y": p.nH * 17.5/p.oH,
						"text-anchor": "end",
						"alignment-baseline": "middle",
						"font-size": (p.nW * 20/p.oW) + "px"	
					},
					"style": {},
					"text": o.rightTxt
				},
				{
					"name": "txtRight",
					"type": "text",
					"id": o.id + "txtRight",
					"attr": {
						"x": p.nW * 10/p.oW,
						"y": p.nH * 17.5/p.oH,
						"text-anchor": "start",
						"alignment-baseline": "middle",
						"font-size": (p.nW * 20/p.oW) + "px"	
					},
					"style": {},
					"text":	o.leftTxt 
				},	
				{
					"name": "tglswtch",
					"type": "rect",
					"id": o.id + "tglswtch",
					"attr": {
						"id": o.id + "swtgl",
						"x": switchPosAdjust,
						"y": 0,
						"ry": p.nH * 6/p.oH,
						"height": p.nH * 30/p.oH,
						"width": p.nW * 45/p.oW
					},
					"style": {
						"fill": "#3bb084",
						"stroke": "#232323",
						"stroke-width":  p.nW * 1.5/ p.oW
					}
				},
				{
					"name": "label",
					"type": "text",
					"id":  o.id + "label", 			
					"attr": {
						"x": 0,
						"y": p.nH * -7/p.oH,
						"text-anchor": "start",
						"alignment-baseline": "middle",
						"font-size": (p.nW * 14/p.oW) + "px"
					},
					"style": {},
					"text": o.label

				}
					], // end elements array
				gtX: p.nW * o.gtX/p.oW,
				gtY: p.nH * o.gtY/p.oH,
				id: o.id,
				swpos: "left"	
			}; // end object


			return newObj;
	
		}, // end switchObjectProto function; 
		toggleSwitch: function(svg, o, p) {
			var adjst = 0,
			p = p || {oW: 1, aR: 1, oH: 1, nW: 1, nH: 1}; // default will not scale

			if (o.swpos === "left") {
				o.swpos = "right";
				adjst = 45;
			} else {
				o.swpos = "left";
				adjst = 0;
			}

		
			var moveSwitch = svg.select("#" + o.id + "swtgl")
				.attr("x", p.nW * adjst / p.oW);

			var pauseVar;
		}
	}; // end lib.swtch object 


	// Private methods and variables:
	


	return lib;
}());

