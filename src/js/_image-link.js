/**
 *
 * Image Link
 *
 * @author Takuto Yanagida
 * @version 2021-10-27
 *
 */


function isImageLink(a, allowedClasses) {
	if (a.className) {
		const cs = a.className.split(' ');
		for (const c of cs) {
			if (allowedClasses.indexOf(c) === -1) return false;
		}
	}
	const cs = Array.from(a.childNodes);
	if (cs.length === 0) return false;
	let success = false;
	for (const c of cs) {
		const tn = c.tagName;
		if (success === false && tn === 'IMG') {
			success = true;
			continue;
		}
		if (tn) return false;
	}
	return success;
}
