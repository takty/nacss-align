/**
 *
 * Alignment
 *
 * @author Takuto Yanagida
 * @version 2021-11-17
 *
 */


window['NACSS'] = window['NACSS'] || {};


(function (NS) {

	(function () {
		// @include _float.js
		NS.alignmentFloat = initialize;
	})();

	(function () {
		// @include _sel-attr.js
		NS.alignmentSelectorAttribute = initialize;
	})();

	// @include _style-class.js
	// @include _utilities.js

})(window['NACSS']);
