document.querySelectorAll('.game-capsule').forEach(function (capsule) {
	var video = capsule.querySelector('.capsule-video');
	if (!video) return;

	capsule.addEventListener('mouseenter', function () {
		video.currentTime = 0;
		video.play().catch(function () {});
	});

	capsule.addEventListener('mouseleave', function () {
		video.pause();
	});
});

(function () {
	var hamburger = document.getElementById('hamburgerBtn');
	var mobileMenu = document.getElementById('mobileMenu');
	var headerLeft = document.querySelector('.header-left');
	var nav = document.querySelector('header nav');
	var headerRight = document.querySelector('.header-right');
	var header = document.querySelector('header');
	var mq = window.matchMedia('(max-width: 640px)');
	var moved = false;

	function closeMenu() {
		mobileMenu.classList.remove('open');
		hamburger.classList.remove('active');
		hamburger.setAttribute('aria-expanded', 'false');
	}

	function placeForMobile() {
		if (moved) return;
		mobileMenu.appendChild(nav);
		mobileMenu.appendChild(headerRight);
		moved = true;
	}

	function placeForDesktop() {
		if (!moved) return;
		headerLeft.appendChild(nav);
		header.insertBefore(headerRight, mobileMenu);
		moved = false;
		closeMenu();
	}

	function handleChange(e) {
		if (e.matches) {
			placeForMobile();
		} else {
			placeForDesktop();
		}
	}

	handleChange(mq);
	mq.addEventListener('change', handleChange);

	hamburger.addEventListener('click', function () {
		var isOpen = mobileMenu.classList.toggle('open');
		hamburger.classList.toggle('active', isOpen);
		hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	mobileMenu.addEventListener('click', function (e) {
		if (e.target.tagName === 'A') {
			closeMenu();
		}
	});
})();