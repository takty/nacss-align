/**
 *
 * Alignment Classes (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-10-27
 *
 */


function initialize(tars = [], opts = {}) {
	// if (tars.length === 0) return;

	opts = Object.assign({
		styleAlign            : ':ncAlign',
		styleHasOnlyChild     : ':ncHasOnlyChild',
		stylePrefixNextTo     : ':ncNextTo',
		classLeft             : 'alignleft',
		classRight            : 'alignright',
		classCenter           : 'aligncenter',
		minWidth              : 240,  // px
		doAddSelectorAttribute: true,
		doReplaceAlignClass   : true,

		allowedClassesForImage: [
			'alignleft',
			'aligncenter',
			'alignright',
			'size-thumbnail',
			'size-small',
			'size-medium-small',
			'size-medium',
			'size-medium-large',
			'size-medium_large',
			'size-large',
			'size-full'
		]
	}, opts);

	const als = Array.from(document.getElementsByClassName(opts.classLeft));
	const ars = Array.from(document.getElementsByClassName(opts.classRight));
	const acs = Array.from(document.getElementsByClassName(opts.classCenter));

	if (opts.doAddSelectorAttribute) {
		addHasOnlyChild(als, opts.styleHasOnlyChild);
		addHasOnlyChild(ars, opts.styleHasOnlyChild);
		addHasOnlyChild(acs, opts.styleHasOnlyChild);
		addNextTo(als, opts.stylePrefixNextTo);
		addNextTo(ars, opts.stylePrefixNextTo);
	}
	// if (opts.doReplaceAlignClass) {
	// 	replaceAlignClass(als, opts);
	// 	replaceAlignClass(ars, opts);
	// 	replaceAlignClass(acs, opts);
	// }
	setTimeout(() => {
		modifyAlign(als, opts.classLeft, opts);
		modifyAlign(ars, opts.classRight, opts);
	}, 0);  // Delay
}


// -------------------------------------------------------------------------


function modifyAlign(as, cls, opts) {
	const aws = as.map(e => [e, 0]);
	onScroll(() => assignWidths(aws, cls, opts), true);  // For lazy image loading
	onResize(() => {
		updateApplicableWidths(aws, opts);
		switchFloat(aws, cls, opts);
	}, true);
}

function assignWidths(aws, style, opts) {
	for (const aw of aws) {
		const [a, w] = aw;
		if (10 < w) continue;
		switchFloatOne(a, false, style, opts);
		aw[1] = a.getBoundingClientRect().width;
		switchFloatOne(a, true, style, opts);
	}
}

function updateApplicableWidths(aws, opts) {
	for (const aw of aws) {
		const [a, w] = aw;
		const pw = contentWidth(a.parentElement);
		const nw = a.getBoundingClientRect().width;
		if (nw < pw * 0.9 && w < nw) aw[1] = nw;

		a.dataset['w'] = nw;
	}
}

function switchFloat(asw, cls, opts) {
	for (const [a, w] of asw) {
		const pw = contentWidth(a.parentElement, true);
		switchFloatOne(a, pw - w < opts.minWidth, cls, opts);
	}
}

function switchFloatOne(a, enabled, origCls, opts) {
	if (enabled && !a.dataset[opts.styleAlign]) {
		a.dataset[opts.styleAlign] = origCls;
		a.classList.remove(origCls);
		a.classList.add(opts.classCenter);
	}
	if (!enabled && a.dataset[opts.styleAlign]) {
		a.classList.remove(opts.classCenter);
		a.classList.add(a.dataset[opts.styleAlign]);
		delete a.dataset[opts.styleAlign];
	}
}

function contentWidth(elm, checkDisplay = false) {
	if (elm === null) return window.innerWidth;
	const s = getComputedStyle(elm);
	if (checkDisplay && s.display === 'inline') {
		return contentWidth(elm.parentElement);
	}
	const ph = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
	return elm.clientWidth - ph;
}


// -------------------------------------------------------------------------


function replaceAlignClass(ts, opts) {
	for (let i = 0; i < ts.length; i += 1) {
		const t = ts[i];
		const p = t.parentNode;
		let replace = false;
		if (p.tagName === 'A' && isImageLink(p, opts.allowedClassesForImage)) {
			if (moveClass(t, p, opts.classLeft)) replace = true;
			if (moveClass(t, p, opts.classRight)) replace = true;
			if (moveClass(t, p, opts.aligncenter)) replace = true;
		}
		if (replace) ts[i] = p;
	}
}

function moveClass(c, p, cls) {
	if (c.classList.contains(cls)) {
		c.classList.remove(cls);
		p.classList.add(cls);
		return true;
	}
	return false;
}
