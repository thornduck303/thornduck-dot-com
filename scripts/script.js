const header = document.getElementById("header");
header.innerHTML = `
	<button class="hamburger" id="hamburgerBtn" aria-label="Toggle menu" aria-expanded="false">
		<span></span>
		<span></span>
		<span></span>
	</button>

	<div class="header-left">
		<a href="index.html">
			<img src="imgs/thornduck_header.png" alt="ThornDuck logo" class="header-logo">
		</a>

		<nav>
			<a href="index.html">GAMES</a>
			<a href="about.html">ABOUT</a>
			<a href="blog.html">BLOG</a>
		</nav>
	</div>

	<div class="header-right">
		<a href="https://www.youtube.com/@thornduck303" target="_blank"><img src="imgs/youtube.webp" alt="YouTube"></a>
		<a href="https://twitter.com/Murilo3031" target="_blank"><img src="imgs/x.webp" alt="X"></a>
		<a href="https://bsky.app/profile/thornduck.bsky.social" target="_blank"><img src="imgs/bluesky.webp" alt="Bluesky"></a>
		<a href="https://github.com/thornduck303" target="_blank"><img src="imgs/github.webp" alt="Github"></a>
		<a href="https://store.steampowered.com/curator/45712863-ThornDuck/" target="_blank"><img src="imgs/steam.webp" alt="Steam"></a>
	</div>

	<div class="mobile-menu" id="mobileMenu"></div>
`;

const footer = document.getElementById("footer");
footer.innerHTML = `
	<p>contact@thornduck.com</p>
	<p>© 2026 ThornDuck</p>
`;

function slugify(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseFrontmatter(text) {
	var match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
	if (!match) return { meta: {}, body: text };

	var meta = {};
	match[1].split('\n').forEach(function (line) {
		var idx = line.indexOf(':');
		if (idx === -1) return;
		var key = line.slice(0, idx).trim();
		var value = line.slice(idx + 1).trim();
		meta[key] = value;
	});

	return { meta: meta, body: match[2].trim() };
}

function bindCapsuleVideos() {
	document.querySelectorAll('.game-capsule').forEach(function (capsule) {
		var video = capsule.querySelector('.capsule-video');
		if (!video || capsule.dataset.videoBound) return;
		capsule.dataset.videoBound = 'true';

		capsule.addEventListener('mouseenter', function () {
			video.currentTime = 0;
			video.play().catch(function () {});
		});

		capsule.addEventListener('mouseleave', function () {
			video.pause();
		});
	});
}

bindCapsuleVideos();

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

(function () {
	var titleEl = document.getElementById('post-title');
	if (!titleEl) return;

	var dateEl = document.getElementById('post-date');
	var bodyEl = document.getElementById('post-body');
	var slug = new URLSearchParams(window.location.search).get('post');

	function showNotFound() {
		titleEl.textContent = 'POST NOT FOUND';
		dateEl.textContent = '';
		bodyEl.innerHTML = '<p>Sorry, we couldn\'t find this post.</p>';
	}

	if (!slug) {
		showNotFound();
		return;
	}

	fetch('posts/' + slug + '.md')
		.then(function (res) {
			if (!res.ok) throw new Error('Not found');
			return res.text();
		})
		.then(function (text) {
			var parsed = parseFrontmatter(text);
			var meta = parsed.meta;

			document.title = 'ThornDuck - ' + meta.title;
			titleEl.textContent = meta.title;
			dateEl.textContent = meta.date;

			bodyEl.innerHTML = marked.parse(parsed.body);

			if (meta.author) {
				bodyEl.insertAdjacentHTML('beforeend', '<p class="muted-text">- ' + meta.author + '</p>');
			}
		})
		.catch(showNotFound);
})();

(function () {
	var officialContainer = document.getElementById('official-games-grid');
	var jamContainer = document.getElementById('jam-games-grid');
	if (!officialContainer && !jamContainer) return;

	var PLATFORM_ICONS = {
		windows: { icon: 'imgs/windows.webp', alt: 'Available on Windows' },
		mac: { icon: 'imgs/mac.webp', alt: 'Available on Mac' },
		linux: { icon: 'imgs/linux.webp', alt: 'Available on Linux' },
		browser: { icon: 'imgs/html.webp', alt: 'Available on Browser' }
	};

	function renderGame(game) {
		var slug = slugify(game.name);
		var image = 'imgs/' + slug + '_capsule.png';
		var video = 'imgs/' + slug + '_trailer.mp4';

		var videoTag = '<video class="capsule-video" src="' + video + '" muted loop playsinline preload="none"></video>';

		var platformsHtml = (game.platforms || []).map(function (key) {
			var platform = PLATFORM_ICONS[key];
			if (!platform) return '';
			return '<img src="' + platform.icon + '" alt="' + platform.alt + '">';
		}).join('');

		return '' +
			'<div class="game">' +
				'<a class="game-capsule" href="' + game.url + '" target="_blank">' +
					'<div class="capsule-image-wrapper">' +
						'<img src="' + image + '" alt="' + game.name + ' game cover">' +
						videoTag +
					'</div>' +
				'</a>' +
				'<div class="game-info">' +
					'<p class="game-name">' + game.name + '</p>' +
					'<div class="game-meta">' +
						'<span class="game-year">' + game.year + '</span>' +
						'<div class="game-platforms">' + platformsHtml + '</div>' +
					'</div>' +
				'</div>' +
			'</div>';
	}

	fetch('data/games.json')
		.then(function (res) {
			if (!res.ok) throw new Error('Not found');
			return res.json();
		})
		.then(function (data) {
			if (officialContainer) {
				officialContainer.innerHTML = (data.official || []).map(renderGame).join('');
			}
			if (jamContainer) {
				jamContainer.innerHTML = (data.jam || []).map(renderGame).join('');
			}
			bindCapsuleVideos();
		})
		.catch(function (err) {
			console.error('Failed to load games:', err);
		});
})();

(function () {
	var membersContainer = document.getElementById('members-wrapper');
	if (!membersContainer) return;

	function renderMember(member) {
		var slug = slugify(member.name);
		var image = 'imgs/' + slug + '.jpg';
		var headerImage = '/imgs/' + slug + '_header.jpg';

		return '' +
			'<div class="member" style="--header-img: url(\'' + headerImage + '\')">' +
				'<div class="member-header">' +
					'<a class="profile-pic-link" href="' + member.linkedin + '" target="_blank">' +
						'<div class="profile-pic-wrapper">' +
							'<img class="profile-pic" src="' + image + '" alt="' + member.name + '">' +
						'</div>' +
					'</a>' +
					'<a class="member-linkedin" href="' + member.linkedin + '" target="_blank">' +
						'<img src="imgs/linkedin.webp" alt="LinkedIn">' +
					'</a>' +
				'</div>' +
				'<p class="member-name">' + member.name + '</p>' +
				'<p class="member-role">' + member.role + '</p>' +
				'<p class="member-description">' + member.description + '</p>' +
			'</div>';
	}

	fetch('data/members.json')
		.then(function (res) {
			if (!res.ok) throw new Error('Not found');
			return res.json();
		})
		.then(function (data) {
			membersContainer.innerHTML = (data.members || []).map(renderMember).join('');
		})
		.catch(function (err) {
			console.error('Failed to load team:', err);
		});
})();

(function () {
	var btn = document.querySelector('.newsletter-btn');
	if (!btn) return;

	var input = document.getElementById('email');

	// If you routed the worker on your own domain (recommended, see
	// worker/README.md), use a relative path like '/api/subscribe'.
	// If you're using the workers.dev URL directly, put the full URL here.
	var WORKER_URL = '/api/subscribe';

	btn.addEventListener('click', function () {
		var email = (input.value || '').trim();
		if (!email) return;

		btn.disabled = true;
		var originalText = btn.textContent;
		btn.textContent = 'SENDING...';

		fetch(WORKER_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email })
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.error) {
					btn.textContent = 'INVALID EMAIL';
				} else {
					btn.textContent = 'SUBSCRIBED!';
					input.value = '';
				}
			})
			.catch(function () {
				btn.textContent = 'ERROR, TRY AGAIN';
			})
			.finally(function () {
				setTimeout(function () {
					btn.disabled = false;
					btn.textContent = originalText;
				}, 3000);
			});
	});
})();

(function () {
	var blogContainer = document.getElementById('blog-posts');
	if (!blogContainer) return;

	function stripHtml(html) {
		var div = document.createElement('div');
		div.innerHTML = html;
		return div.textContent || div.innerText || '';
	}

	function renderPost(post, slug) {
		var link = 'post.html?post=' + slug;
		var image = 'imgs/' + slugify(post.title) + '_post.jpg';
		var fallback = 'imgs/default_post.jpg';

		return '' +
			'<article class="blog-post">' +
				'<a class="post-image-link" href="' + link + '">' +
					'<div class="post-image-wrapper">' +
						'<img src="' + image + '" alt="' + post.title + '" onerror="this.onerror=null;this.src=\'' + fallback + '\';">' +
					'</div>' +
				'</a>' +
				'<div class="post-info">' +
					'<p class="post-title">' + post.title + '</p>' +
					'<p class="post-date">' + post.date + '</p>' +
					'<p class="post-description">' + post.description + '</p>' +
					'<a class="read-more" href="' + link + '">READ</a>' +
				'</div>' +
			'</article>';
	}

	fetch('data/blog.json')
		.then(function (res) {
			if (!res.ok) throw new Error('Not found');
			return res.json();
		})
		.then(function (slugs) {
			return Promise.all(slugs.map(function (slug) {
				return fetch('posts/' + slug + '.md')
					.then(function (res) {
						if (!res.ok) throw new Error('Not found');
						return res.text();
					})
					.then(function (text) {
						var parsed = parseFrontmatter(text);
						var description = stripHtml(marked.parse(parsed.body)).trim().slice(0, 300);

						return renderPost({
							title: parsed.meta.title,
							date: parsed.meta.date,
							description: description
						}, slug);
					})
					.catch(function () {
						return '';
					});
			}));
		})
		.then(function (cards) {
			blogContainer.innerHTML = cards.join('');
		})
		.catch(function (err) {
			console.error('Failed to load blog posts:', err);
		});
})();