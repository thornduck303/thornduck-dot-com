const logo = document.getElementById("main-logo");
const header = document.getElementById("main-header");
const headerButtons = document.getElementById("header-buttons");

window.addEventListener("scroll", () => {
	if (!logo || !header || !headerButtons) return;

	const scroll = window.scrollY;
	const progress = Math.min(scroll / 300, 1);

	const scale = 1 - (0.5 * progress);
	const translateX = -50 * progress;
	const translateY = -25 * progress;
	const clip = 100 - (80 * progress);

	logo.style.transform = `translateX(${translateX}%) translateY(${translateY}%) scale(${scale})`;
	logo.style.clipPath = `circle(${clip}% at 35% 30%)`;

	const height = 430 - 300 * progress;

	header.style.height = `${height}px`;

	const buttonHeight = 340 - 300 * progress;

	headerButtons.style.top = `${buttonHeight}px`;
})
