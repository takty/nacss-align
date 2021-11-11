/**
 *
 * Selector Attributes
 *
 * @author Takuto Yanagida
 * @version 2021-11-11
 *
 */


function addHasOnlyChild(es, styleHasOnlyChild) {
	for (const e of es) _addHasOnlyChild(e, styleHasOnlyChild);
}

function _addHasOnlyChild(e, styleHasOnlyChild) {
	for (const c of Array.from(e.parentElement.childNodes)) {
		if (c.nodeType === 3 /*TEXT_NODE*/ && c.textContent.trim() !== '') {
			return;
		} else if (c.nodeType === 1 /*ELEMENT_NODE*/ && c !== e) {
			return;
		}
	}
	setClass(e.parentElement, styleHasOnlyChild);
}

function addNextTo(es, stylePrefixNextTo) {
	for (const e of es) {
		const prev = e.previousElementSibling;
		if (prev && prev.className === '') {
			const tn = prev.tagName.toLowerCase();
			const cc = tn.charAt(0).toUpperCase() + tn.slice(1);
			setClass(e, stylePrefixNextTo + cc);
		}
	}
}
