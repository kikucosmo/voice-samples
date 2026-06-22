/* Voice samples: tile click = play (exclusive), with progress bar. */
(function () {
	var audio = new Audio();
	audio.preload = 'none';
	var tiles = Array.prototype.slice.call(document.querySelectorAll('.tiles article[data-file]'));
	var active = null;

	function clearActive() {
		if (active) {
			active.classList.remove('playing');
			var p = active.querySelector('.vprog');
			if (p) p.style.width = '0';
		}
		active = null;
	}

	function playTile(el) {
		var file = el.getAttribute('data-file');
		if (active === el) {
			if (audio.paused) { audio.play(); el.classList.add('playing'); }
			else { audio.pause(); el.classList.remove('playing'); }
			return;
		}
		clearActive();
		active = el;
		el.classList.add('playing');
		audio.src = file;
		audio.currentTime = 0;
		audio.play().catch(function () { /* ignore */ });
	}

	tiles.forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			playTile(el);
		});
		// キーボード操作（Enter/Space）
		var link = el.querySelector('a');
		if (link) {
			link.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					playTile(el);
				}
			});
		}
	});

	audio.addEventListener('timeupdate', function () {
		if (!active || !audio.duration) return;
		var p = active.querySelector('.vprog');
		if (p) p.style.width = (audio.currentTime / audio.duration * 100) + '%';
	});

	audio.addEventListener('ended', function () { clearActive(); });
})();
