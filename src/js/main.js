if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength, padString) {
		targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));
		if (this.length > targetLength) {
			return String(this);
		}
		else {
			targetLength = targetLength - this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength) + String(this);
		}
	};
}
(function (ELEMENT) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
	ELEMENT.closest = ELEMENT.closest || function closest(selector) {
		if (!this) return null;
		if (this.matches(selector)) return this;
		if (!this.parentElement) {return null}
		else return this.parentElement.closest(selector)
	};
}(Element.prototype));

(function () {

	// проверяем поддержку
	if (!Element.prototype.closest) {

		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}

})();

$(function () {
	// Buttton Ripple Effect
	function createRipple(event) {
		const button = event.currentTarget;

		const circle = document.createElement("span");
		const diameter = Math.max(button.clientWidth, button.clientHeight);
		const radius = diameter / 2;

		const buttonCoords = button.getBoundingClientRect();
		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - buttonCoords.left - radius}px`;
		circle.style.top = `${event.clientY - buttonCoords.top - radius}px`;
		circle.classList.add("ripple");

		const ripple = button.getElementsByClassName("ripple")[0];
		const disabled = button.classList.contains('disabled');
		if (ripple) {
			button.removeChild(ripple);
		}
		if (disabled) {
			return
		}

		button.appendChild(circle);
	}

	const $buttons = document.querySelectorAll("button:not(.btn__light)");
	const buttons = [];
	for (var i = 0; i < $buttons.length; i++) buttons.push($buttons[i]);
	buttons.forEach(elem => {
		elem.addEventListener("click", createRipple);
	})

	// Highliters

	function highlight(event) {
		let highlighterNum = event.target.dataset.highlighter

		if (highlighterNum.indexOf(",") !== -1) {
			highlighterNum = highlighterNum.split(",").map(function (item) {
				return item.trim();
			});
		} else {
			highlighterNum = [highlighterNum]
		}

		const highlighterSelect = highlightersList.filter(function (item) {
			let itemHighlights = item.dataset.highlighter

			if (itemHighlights.indexOf(",") !== -1) {
				itemHighlights = itemHighlights.split(",").map(function (item) {
					return item.trim();
				});;
			} else {
				itemHighlights = [itemHighlights]
			}

			return highlighterNum.some(function (elem) {
				return itemHighlights.some(function (num) {
					return elem === num
				})
			});
		});

		highlighterSelect.forEach(function (elem) {
			elem.classList.toggle('active')
		});
	}

	const $highlightText = document.getElementsByClassName("highlighter");
	const highlightText = [];
	for (var i = 0; i < $highlightText.length; i++) highlightText.push($highlightText[i]);

	const $highlightElem = document.getElementsByClassName("highlight-elem");
	const highlightElem = [];
	for (var i = 0; i < $highlightElem.length; i++) highlightElem.push($highlightElem[i]);

	const highlightersList = highlightElem.concat(highlightText)
	highlightersList.forEach(elem => {
		elem.addEventListener("mouseover", highlight);
		elem.addEventListener("mouseout", highlight);
	})
	// Tabs
	$('.tabs').tabs();

	// Fixed  menu
	const hideMenu = () => {
		let menu = document.querySelector(".header"),
			scrollPrev = 0,
			scrolled = 0;
		window.addEventListener("scroll", onScroll);

		function onScroll() {
			let scrolled = window.pageYOffset;
			showNav();
			if (scrolled > scrollPrev && scrolled > 75) {
				hideNav();
			} else {
				if (scrollPrev !== scrolled) {
					showNav();
				}
			}
			scrollPrev = scrolled;
		}

		function hideNav() {
			document.querySelector("header").classList.remove("is-visible");
			document.querySelector("header").classList.add("is-hidden");
		}

		function showNav() {
			document.querySelector("header").classList.remove("is-hidden");
			document.querySelector("header").classList.add("is-visible");
			document.querySelector("header").classList.add("scrolling");
		}
	};

	hideMenu();

		// Swiper

	let $swipers = document.querySelectorAll('.swiper-container');
	let swipers = [];

	for (var i = 0; i < $swipers.length; i++) swipers.push($swipers[i]);
	swipers.forEach(function (slider, index) {
		new Swiper(slider, {
			nextButton: slider.querySelector('.swiper-button-next'),
			prevButton: slider.querySelector('.swiper-button-prev'),
			pagination: slider.querySelector('.swiper-pagination'),
			slidesPerView: 1,
			centeredSlides: true,
			paginationClickable: true,
			keyboardControl: true,
			mousewheelControl: true,
			mousewheelForceToAxis: true,
			initialSlide: 0,
			grabCursor: true,
			loop: true,
		});
	});

	// Open nav menu
	const openMenu = () => {
		const open = document.querySelector('.header-icon-menu');
		const fader = document.querySelector('.fader');

		document.body.style.overflow = "hidden";
		fader.classList.add('show');
		open.classList.add('show');
		document.querySelector('.nav').classList.add('show');
	}

	document.querySelector('.header-icon-menu').addEventListener("click", openMenu);

	document.querySelector('.fader').addEventListener("click", function () {
		document.body.style.overflow = "";
		document.querySelector('.fader').classList.remove('show');
		document.querySelector('.nav').classList.remove('show');
	});

	// Open url and files
	let windowObjectReference = null;

	const openRequestedPopup = (url, windowName) => {
		if (windowObjectReference == null || windowObjectReference.closed) {
			windowObjectReference = window.open(
				url,
				windowName,
				"resizable,scrollbars,status"
			);
		} else {
			windowObjectReference.focus();
		}
	};
});

