const logo = document.getElementById("main-logo");

window.addEventListener("scroll", () => {
	if (!logo) return;

	const scroll = window.scrollY;
	const progress = Math.min(scroll / 100, 1);

	const scale = 1 - (0.5 * progress);
	const translateX = -50 * progress;
	const clip = 100 - (80 * progress);

	logo.style.transform = `translateX(${translateX}%) scale(${scale})`;
	logo.style.clipPath = `circle(${clip}% at 35% 30%)`;
})
