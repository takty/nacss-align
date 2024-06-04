/**
 *
 * Float
 *
 * @author Takuto Yanagida
 * @version 2024-06-04
 *
 */


function apply(tars = {}, opts = {}) {
	tars = Object.assign({ left: [], right: [] }, tars);
	if (tars['left'].length + tars['right'].length === 0 ) return;

	opts = Object.assign({
		styleAlign : ':ncAlign',
		classLeft  : 'alignleft',
		classRight : 'alignright',
		classCenter: 'aligncenter',
		minWidth   : 240,  // px
	}, opts);

	setTimeout(() => {
		assignEventListener(tars['left'], opts['classLeft'], opts);
		assignEventListener(tars['right'], opts['classRight'], opts);
	}, 0);  // Delay
}

async function assignEventListener(as, cls, opts) {
	const aws = as.map(e => [e, 0]);
	storeWidth(aws, cls, opts);
	onResize(() => update(aws, cls, opts), true);
}


// -------------------------------------------------------------------------


async function storeWidth(aws, cls, opts) {
	while (true) {
		let doUpdate = false;
		let count    = 0;
		for (const aw of aws) {
			const [a, w] = aw;
			if (10 < w) {
				count += 1;
				continue;
			}
			aw[1] = a.getBoundingClientRect().width;
			doUpdate = true;
		}
		if (doUpdate) {
			update(aws, cls, opts)
		}
		if (count === aws.length) {
			break;
		}
		await new Promise(r => setTimeout(r, 100));
	}
}

function update(aws, cls, opts) {
	for (const aw of aws) {
		const [a, w] = aw;
		const cw = contentWidth(a.parentElement);
		const wn = a.getBoundingClientRect().width;
		if (wn < cw * 0.9 && w < wn) {
			aw[1] = wn;
		}
	}
	for (const [a, w] of aws) {
		const cw = contentWidth(a.parentElement, true);
		switchFloatOne(a, cw - w < opts.minWidth, cls, opts);
	}
}

function switchFloatOne(a, enabled, origCls, opts) {
	if (enabled && !hasClass(a, opts.styleAlign)) {
		setClass(a, opts.styleAlign, true, origCls);
		a.classList.remove(origCls);
		a.classList.add(opts.classCenter);
	}
	if (!enabled && hasClass(a, opts.styleAlign)) {
		a.classList.remove(opts.classCenter);
		a.classList.add(origCls);
		setClass(a, opts.styleAlign, false);
	}
}

function contentWidth(e, checkDisplay = false) {
	if (e === null) {
		return window.innerWidth;
	}
	const s = getComputedStyle(e);
	if (checkDisplay && s.display === 'inline') {
		return contentWidth(e.parentElement);
	}
	const ph = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
	return e.clientWidth - ph;
}
