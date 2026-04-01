const LOGO = document.getElementById("main-logo");
const HEADER = document.getElementById("main-header");

const SCROLL_THRESHOLD = 300;
const LOGO_FINAL_SCALE = 0.5;
const LOGO_FINAL_TRANSLATION_X = 0;
const LOGO_FINAL_TRANSLATION_Y = 0;
const LOGO_FINAL_CLIP_PERCENT = 20;
const LOGO_CLIP_X_PERCENT = 35;
const LOGO_CLIP_Y_PERCENT = 30;

window.addEventListener("scroll", () => {
	if (SCROLL_THRESHOLD == 0) return;
	
	let scroll = window.scrollY;
	let progress = scroll / SCROLL_THRESHOLD;

	progress = Math.min(progress, 1);
	progress = Math.max(progress, 0);

	updateHeader(progress);
	updateLogo(progress);
})

function updateHeader(progress) {
	if (!HEADER) return;

	let heightPercent = 100 - 80 * progress;

	HEADER.style.height = `${heightPercent}%`;
}

function updateLogo(progress) {
	if (!LOGO) return;

	let scale = 1 - (1 - LOGO_FINAL_SCALE) * progress;
	let translateX = -50 + (LOGO_FINAL_TRANSLATION_X + LOGO_CLIP_X_PERCENT/4) * progress;
	let translateY = -50 + (LOGO_FINAL_TRANSLATION_Y + LOGO_CLIP_Y_PERCENT/4) * progress;
	let clip = 100 - (100 - LOGO_FINAL_CLIP_PERCENT) * progress;

	LOGO.style.transform = `translateX(${translateX}%) translateY(${translateY}%) scale(${scale})`;
	LOGO.style.clipPath = `circle(${clip}% at ${LOGO_CLIP_X_PERCENT}% ${LOGO_CLIP_Y_PERCENT}%)`;
}
