// ASIS ui.js 함수 요청 추가
function bottomPopOpen(obj) {
	if (obj.selector) obj = obj[0];
	let target = document.querySelectorAll(obj.getAttribute("href"));
	if (target.length == 0) {
		target = document.querySelectorAll(obj.getAttribute("data-href"));
	}
	if (target.length == 0) {
		console.log("대상이 없습니다");
	} else if (target.length > 1) {
		console.log("대상이 2개 이상입니다.");
	} else {
		uiModalBottomOpen(target[0]);
	}
	return false;
}

function bottomPopClose(obj) {
	if (obj.selector) obj = obj[0];
	uiModalBottomClose(obj);
	return false;
}

function layerOpen(id) {
	let target = document.querySelectorAll(id);
	if (target.length == 0) {
		console.log("대상이 없습니다");
	} else if (target.length > 1) {
		console.log("대상이 2개 이상입니다.");
	} else {
		uiModalBottomOpen(target[0]);
	}
	return false;
}

function layerClose(id) {
	let target = document.querySelectorAll(id);
	if (target.length == 0) {
		console.log("대상이 없습니다");
	} else if (target.length > 1) {
		console.log("대상이 2개 이상입니다.");
	} else {
		uiModalBottomClose(target[0]);
	}
	return false;
}

function uiModalBottomOpen(obj) {
	let id = obj.getAttribute("id");
	if (obj.classList.contains("bottom-sheet")) {
		UI.bottomSheetShow(id);
	} else if (obj.classList.contains("modal-popup")) {
		UI.modalPopupShow(id);
	}
}

function uiModalBottomClose(obj) {
	let id = obj.getAttribute("id");
	if (obj.classList.contains("bottom-sheet")) {
		UI.bottomSheetHide(id);
	} else if (obj.classList.contains("modal-popup")) {
		UI.modalPopupHide(id);
	} else if (UI.getParentsByClassName(obj, "bottom-sheet") !== null) {
		id = UI.getParentsByClassName(obj, "bottom-sheet").getAttribute("id");
		UI.bottomSheetHide(id);
	} else if (UI.getParentsByClassName(obj, "modal-popup") !== null) {
		id = UI.getParentsByClassName(obj, "modal-popup").getAttribute("id");
		UI.modalPopupHide(id);
	}
}

function scrollDown() {
	const getViewAreaHeight = window.innerHeight - document.querySelector(".container > .step-wrap").clientHeight - document.querySelector(".sticky-button.button-group").clientHeight;
	const changeScrollY = window.scrollY + getViewAreaHeight;
	window.scrollTo(0, changeScrollY);
}

function initScrollDownCheckPage(cb) {
	if (document.body.scrollHeight == window.innerHeight) {
		cb();
	} else {
		window.addEventListener("scroll", function () {
			if (document.body.scrollHeight - window.scrollY - 30 <= window.innerHeight) {
				cb();
			}
		});
	}
}

function getItemScrollPosition(selector, id) {
	// 상품상세 탭 스크롤 이동 관련
	selector = selector || ".product-detail ~ .tab-content";
	id = id || "#product-detail";

	if (!!document.querySelector("[class*='type-'].pr-common")) {
		const contents = document.querySelectorAll(selector);
		let itemTop = [];
		for (let i = 0; i < contents.length; i++) {
			itemTop.push(contents[i].offsetTop - 70);
		}
		let scrollY = window.pageYOffset;

		if (!!UI.Tabs.getInstance(id)) {
			for (let j = 0; j < contents.length; j++) {
				if (scrollY >= itemTop[j]) {
					UI.Tabs.getInstance(id).activateTabIndex(j);
				}
				if (!!document.querySelector(".news-step")) {
					// 상품상세 카드뉴스 존재 시
					if (scrollY === itemTop[0]) {
						UI.Tabs.getInstance(id).activateTabIndex(0);
					}
				} else {
					// 그 외 일반
					if (scrollY <= itemTop[0]) {
						UI.Tabs.getInstance(id).activateTabIndex(0);
					}
				}
			}
		}
	}
}
/**
 * 상품 배너 모션
 * selector : 선택자 , time : 딜레이
 */
async function visualMotion(selector, time) {
	let motionContList = document.querySelectorAll(selector);
	for (let i = 0; i < motionContList.length; i++) {
		await delay(time);
		motionContList[i].classList.add("active");
	}
	function delay() {
		// 모션 delay
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve("");
			}, time);
		});
	}
}

/**
 * 키패드 열린 경우 타겟 element가 보이도록 스크롤 제어
 * @param {number} height 키패드 높이
 * @param {object} obj 타겟 element. 타겟 위치에 따라 동작 제어
 */
function keypadToggleScroll(height, obj) {
	// window.devicePixelRatio
	let elem = null;
	let ttl = 20;
	let tick = 0;
	let progress = 0;
	let windowScrollY, viewareaHeight, viewareaElemTop, viewareaElemBottom, centerElemTop, targetScrollY;
	let isBottomSheetElem = false;
	let bottomSheetContainer, bottomSheetContents;
	let offsetTop = 0;
	const stickyBtn = document.querySelector(".sticky-button");

	if (typeof obj === "object") {
		elem = obj;
		if (typeof jQuery !== "undefined") {
			if (obj instanceof jQuery) elem = obj[0];
		}
		if (getParentsByClassName(elem, "bottom-sheet") !== null) {
			isBottomSheetElem = getParentsByClassName(elem, "bottom-sheet").classList.contains("show");
		}
	}

	if (height > 0) {
		if (!isBottomSheetElem) {
			// 일반
			if (document.getElementById("wrap") !== null) {
				document.getElementById("wrap").style.paddingBottom = height + "px";
			}

			offsetTop = getOffsetTop(elem, false);

			// 현재 페이지 스크롤 위치
			windowScrollY = window.scrollY;
			// 키패드 오픈 후 보이는 영역 높이 값
			viewareaHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - height;
		} else {
			// 바텀시트
			bottomSheetContainer = getParentsByClassName(elem, "bottom-sheet-container");
			bottomSheetContents = getParentsByClassName(elem, "bottom-sheet-contents");

			if (bottomSheetContainer !== null) {
				bottomSheetContainer.style.paddingBottom = height + "px";
			}

			offsetTop = getOffsetTop(elem, true);

			// 현재 페이지 스크롤 위치
			windowScrollY = bottomSheetContents.scrollTop;
			// 키패드 오픈 후 보이는 영역 높이 값
			viewareaHeight = bottomSheetContents.clientHeight;
		}
		// Elem 상단의 뷰영역에서의 top 위치
		viewareaElemTop = offsetTop - windowScrollY;
		// Elem 하단의 뷰영역에서의 top 위치
		viewareaElemBottom = viewareaElemTop + elem.clientHeight;
		// 키패드 오픈 후 Elem 중앙 정렬을 위한 Elem 상단의 top 위치
		centerElemTop = viewareaHeight / 2 - elem.clientHeight / 2;

		targetScrollY = windowScrollY + viewareaElemTop - centerElemTop;
		loop();

		// 하단 sticky 버튼
		if (stickyBtn !== null && !stickyBtn.classList.contains("no-floating")) {
			stickyBtn.classList.add("no-floating");
			stickyBtn.classList.add("no-floating-kp");
		}

		// 테스트 확인용 커스텀 키패드 영역 표시(삭제예정)
		if (document.getElementById("keypad") !== null) {
			document.getElementById("keypad").style.height = height + "px";
			document.getElementById("keypad").style.display = "block";
		}
	} else {
		if (document.getElementById("wrap") !== null) {
			document.getElementById("wrap").style.paddingBottom = "";
		}

		document.querySelectorAll(".bottom-sheet-container").forEach(function (bsc) {
			bsc.style.paddingBottom = "";
		});

		// 하단 sticky 버튼
		if (stickyBtn !== null && stickyBtn.classList.contains("no-floating-kp")) {
			stickyBtn.classList.remove("no-floating");
			stickyBtn.classList.remove("no-floating-kp");
		}

		// 테스트 확인용 커스텀 키패드 영역 표시(삭제예정)
		if (document.getElementById("keypad") !== null) {
			document.getElementById("keypad").style.height = 0;
			document.getElementById("keypad").style.display = "none";
		}
	}

	function loop() {
		tick++;
		progress = 1 - (ttl - tick) / ttl;
		let y = windowScrollY - (windowScrollY - targetScrollY) * easeInOutQuad(progress);
		if (!isBottomSheetElem) {
			window.scroll(0, y);
		} else {
			bottomSheetContents.scroll(0, y);
		}

		if (tick < ttl) {
			requestAnimationFrame(loop);
		}
	}

	function getOffsetTop(elem, isBS) {
		let offsetTop = 0;
		if (elem !== null) {
			do {
				if (isBS && elem.classList.contains("bottom-sheet-contents")) break;
				if (!isNaN(elem.offsetTop)) {
					offsetTop += elem.offsetTop;
				}
			} while ((elem = elem.offsetParent));
		}
		return offsetTop;
	}

	function easeInOutQuad(x) {
		return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
	}

	function getParentsByClassName(el, className) {
		let p, o;
		if (className === undefined) return null;
		p = el.parentNode;
		while (!p.classList.contains(className)) {
			o = p;
			p = o.parentNode;
			if (p.tagName === undefined) return null;
		}
		return p;
	}
}
(function (global, factory) {
	(global = typeof globalThis !== "undefined" ? globalThis : global || self), (global.UI = factory(global.Popper));
})(this, function (Popper) {
	"use strict";

	/**
	 * --------------------------------------------------
	 * Base
	 * --------------------------------------------------
	 */

	const isElement = (obj) => {
		if (!obj || typeof obj !== "object") {
			return false;
		}

		if (typeof obj.jquery !== "undefined") {
			obj = obj[0];
		}

		return typeof obj.nodeType !== "undefined";
	};

	const getElement = (obj) => {
		if (isElement(obj)) {
			return obj.jquery ? obj[0] : obj;
		}

		if (typeof obj === "string" && obj.length > 0) {
			return document.querySelector(obj);
		}

		return null;
	};

	const getParentsByTagName = (el, tagName) => {
		let p, o;
		if (tagName === undefined) return null;
		p = el.parentNode;
		while (p.tagName.toUpperCase() !== tagName.toUpperCase()) {
			o = p;
			p = o.parentNode;
		}
		return p;
	};

	const getParentsByClassName = (el, className) => {
		let p, o;
		if (className === undefined) return null;
		p = el.parentNode;
		while (!p.classList.contains(className)) {
			o = p;
			p = o.parentNode;
			if (p.tagName === undefined) return null;
		}
		return p;
	};

	const appendHtml = (el, str) => {
		const div = document.createElement("div");
		div.innerHTML = str;
		while (div.children.length > 0) {
			el.appendChild(div.children[0]);
		}
	};

	const prependHtml = (el, str) => {
		const div = document.createElement("div");
		div.innerHTML = str;
		const length = div.children.length;
		for (let i = 1; i <= length; i++) {
			el.prepend(div.children[div.children.length - 1]);
		}
	};

	const getDataAttribute = (el, key) => {
		if (el !== null) {
			if (el.getAttribute(`data-${key}`) === null) {
				return null;
			} else {
				return el.getAttribute(`data-${key}`);
			}
		}
	};

	const setDataAttribute = (el, key, val) => {
		el.setAttribute(`data-${key}`, val);
	};

	const getAriaAttribute = (el, key) => {
		if (el.getAttribute(`aria-${key}`) === null) {
			return null;
		} else {
			return el.getAttribute(`aria-${key}`);
		}
	};

	const setAriaAttribute = (el, key, val) => {
		el.setAttribute(`aria-${key}`, val);
	};

	class BaseComponent {
		constructor(element) {
			element = getElement(element);
			if (!element) return;
			this._element = element;

			this.NAME = this.constructor.NAME;
			this.DATA_KEY = this.constructor.DATA_KEY;
			this.EVENT_KEY = this.constructor.EVENT_KEY;

			Data.set(this._element, this.DATA_KEY, this);
			this._element.classList.add("initiated");
		}

		dispose() {
			Data.remove(this._element, this.constructor.DATA_KEY);
			this._element.classList.remove("initiated");
			// EventHandler.off(this._element, this.constructor.EVENT_KEY)

			// Object.getOwnPropertyNames(this).forEach(propertyName => {
			// 	this[propertyName] = null
			// })
		}

		static getInstance(element) {
			return Data.get(getElement(element), this.DATA_KEY);
		}

		static get NAME() {
			throw new Error('각 구성 요소에 대해 정적 메서드 "NAME"을 구현해야 합니다!');
		}

		static get DATA_KEY() {
			return `ui.${this.NAME}`;
		}

		static get EVENT_KEY() {
			return `.${this.DATA_KEY}`;
		}
	}

	/**
	 * --------------------------------------------------
	 * Data
	 * --------------------------------------------------
	 */
	const getElementMap = () => {
		return elementMap;
	};
	const elementMap = new Map();
	const Data = {
		set(element, key, instance) {
			if (!elementMap.has(element)) {
				elementMap.set(element, new Map());
			}

			const instanceMap = elementMap.get(element);

			if (!instanceMap.has(key) && instanceMap.size !== 0) {
				return;
			}

			instanceMap.set(key, instance);
		},

		get(element, key) {
			if (elementMap.has(element)) {
				return elementMap.get(element).get(key) || null;
			}

			return null;
		},

		remove(element, key) {
			if (!elementMap.has(element)) {
				return;
			}

			const instanceMap = elementMap.get(element);
			instanceMap.delete(key);

			if (instanceMap.size === 0) {
				elementMap.delete(element);
			}
		},
	};

	/**
	 * --------------------------------------------------
	 * Event handler
	 * --------------------------------------------------
	 */

	function addHandler(element, event, handler, once) {
		element.addEventListener(event, handler, { once: once });
	}

	const EventHandler = {
		on(element, event, handler) {
			addHandler(element, event, handler, false);
		},

		one(element, event, handler) {
			addHandler(element, event, handler, true);
		},
	};

	/**
	 * --------------------------------------------------
	 * KeyCode
	 * --------------------------------------------------
	 */

	const keys = {
		pgup: 33,
		pgdn: 34,
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
	};
	/**
	 * --------------------------------------------------
	 * Modal Popup, Bottom Sheet 등이 열린 경우 페이지 스크롤이
	 * 되지 않도록 처리할때 사용됩니다.
	 *
	 * @method bodyHold
	 * @param {boolean} enable <body> 스크롤 고정 여부
	 * --------------------------------------------------
	 */

	const bodyHold = function (enable) {
		enable = enable === undefined ? true : enable;
		const body = document.querySelector("body");
		if (enable) {
			body.classList.add("is-hold");
		} else {
			body.classList.remove("is-hold");
		}
	};

	/**
	 * --------------------------------------------------
	 * 페이지(body 기준)에서 Element의 위치 값을 반환
	 *
	 * @method getCoords
	 * @param {object} elem Element 객체
	 * @returns {object} 위치값 객체 반환 left, top
	 * --------------------------------------------------
	 */
	const getCoords = function (elem) {
		let offsetLeft = 0;
		let offsetTop = 0;
		do {
			if (!isNaN(elem.offsetLeft)) {
				offsetLeft += elem.offsetLeft;
			}
			if (!isNaN(elem.offsetTop)) {
				offsetTop += elem.offsetTop;
			}
		} while ((elem = elem.offsetParent));
		return {
			left: offsetLeft,
			top: offsetTop,
		};
	};

	/**
	 * --------------------------------------------------
	 * 랜덤 숫자 코드를 생성
	 *
	 * @method generateRandomCode
	 * @param {number} n 코드 길이
	 * @return {string} 생성된 랜덤 코드 반환
	 * --------------------------------------------------
	 */
	const generateRandomCode = function (n) {
		let str = "";
		for (let i = 0; i < n; i++) {
			str += Math.floor(Math.random() * 10);
		}
		return str;
	};

	/**
	 * --------------------------------------------------
	 * 대상 element의 부모 노드 안에서의 순서(index) 반환
	 *
	 * @method getIndex
	 * @param {object} elem Element 객체
	 * @returns {number} index 반환
	 * --------------------------------------------------
	 */
	const getIndex = function (elem) {
		const parentElement = elem.parentElement;
		const nodes = Array.prototype.slice.call(parentElement.children);
		return nodes.indexOf(elem);
	};

	/**
	 * --------------------------------------------------
	 * 대상 element의 자식노드를 모두 제거
	 *
	 * @method removeAllChildNodes
	 * @param {object} elem Element 객체
	 * --------------------------------------------------
	 */
	const removeAllChildNodes = function (elem) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	};

	/**
	 * --------------------------------------------------
	 * 숫차 천단위 , 표기
	 *
	 * @method amountFormat
	 * @param {number} amount 변환할 숫자
	 * @returns {string} 변환된 문자
	 * --------------------------------------------------
	 */
	const amountFormat = function (amount) {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	/**
	 * --------------------------------------------------
	 * 문자열 치환
	 *
	 * @method replaceAll
	 * @param {string} str 원본 문자
	 * @param {string} searchStr 치환할 문자
	 * @param {string} replaceStr 치환될 문자
	 * @returns {string} 변환된 문자
	 * --------------------------------------------------
	 */
	const replaceAll = function (str, searchStr, replaceStr) {
		return str.split(searchStr).join(replaceStr);
	};

	/**
	 * --------------------------------------------------
	 * 페이지 스크롤 이동
	 *
	 * @method pageScrollTo
	 * @param {string | object} selector querySelector 선택자 또는 Element 객체
	 * @param {number} space 기준 위치 조절
	 * --------------------------------------------------
	 */
	const pageScrollTo = function (selector, space) {
		const target = getElement(selector);
		const header = document.querySelector("#header");
		const stepWrap = document.querySelector(".step-wrap");
		const stickyWrap = document.querySelector(".sticky-tit-wrap");
		space = space || 0;

		let startY = window.scrollY;
		let endY = getCoords(target).top + space;
		let ttl = 30;
		let tick = 0;
		let progress = 0;

		if (header !== null) {
			if (!header.classList.contains("no-sticky")) {
				endY -= header.clientHeight;
				if (header.classList.contains("header-interaction-activate") && startY < endY) {
					// 헤더가 숨는 방향이면...
					endY += header.clientHeight;
				}
			}
		}

		if (stepWrap !== null) {
			endY -= stepWrap.clientHeight;
		}

		if (stickyWrap !== null) {
			endY -= stickyWrap.clientHeight - ttl;
		}

		loop();

		function loop() {
			tick++;
			progress = 1 - (ttl - tick) / ttl;
			let y = startY - (startY - endY) * easeInOutCirc(progress);
			window.scroll(0, y);

			if (tick < ttl) {
				requestAnimationFrame(loop);
			}
		}
	};

	/**
	 * --------------------------------------------------
	 * 대상 외 요소들 aria-hidden="true" 처리 활성화
	 *
	 * @method ariaHiddenActivate
	 * @param {object} obj Element 객체
	 * --------------------------------------------------
	 */
	const ariaHiddenActivate = function (obj) {
		for (let sibling of obj.parentNode.children) {
			if (sibling !== obj) {
				if (sibling.tagName.toUpperCase() !== "SCRIPT" && sibling.tagName.toUpperCase() !== "STYLE") {
					sibling.setAttribute("aria-hidden", "true");
					sibling.setAttribute("data-aria-hidden", "true");
				}
			}
		}
		if (obj.parentNode.tagName.toUpperCase() !== "BODY") {
			ariaHiddenActivate(obj.parentNode);
		}
	};

	/**
	 * --------------------------------------------------
	 * 대상 외 요소들 aria-hidden="true" 처리 비활성화
	 *
	 * @method ariaHiddenDeactivate
	 * --------------------------------------------------
	 */
	const ariaHiddenDeactivate = function () {
		let ariaHiddenObj = document.querySelectorAll('[data-aria-hidden="true"]');
		Object.values(ariaHiddenObj).map((obj) => {
			obj.removeAttribute("aria-hidden");
			obj.removeAttribute("data-aria-hidden");
		});
	};

	/**
	 * 페이지 전체를 밀어 올리는 함수
	 * @param {number} height 페이지가 밀려 올라갈 높이 값
	 */
	const pagePushUp = function (height) {
		// const pushHeight = height / window.devicePixelRatio;
		const pushHeight = height;
		const stickyBtn = document.querySelector(".sticky-button");

		if (height === 0) {
			document.body.style.transform = "";
		} else {
			document.body.style.transform = "translateY(-" + pushHeight + "px)";
		}

		if (stickyBtn !== null && !stickyBtn.classList.contains("no-floating")) {
			stickyBtn.classList.add("no-floating");
		}
	};

	/**
	 * --------------------------------------------------
	 * Easing 함수
	 * --------------------------------------------------
	 */
	function easeInSine(x) {
		return 1 - Math.cos((x * Math.PI) / 2);
	}

	function easeOutSine(x) {
		return Math.sin((x * Math.PI) / 2);
	}

	function easeInOutSine(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	}

	function easeInQuad(x) {
		return x * x;
	}

	function easeOutQuad(x) {
		return 1 - (1 - x) * (1 - x);
	}

	function easeInOutQuad(x) {
		return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
	}

	function easeInCubic(x) {
		return x * x * x;
	}

	function easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	}

	function easeInOutCubic(x) {
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	function easeInQuart(x) {
		return x * x * x * x;
	}

	function easeOutQuart(x) {
		return 1 - Math.pow(1 - x, 4);
	}

	function easeInOutQuart(x) {
		return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
	}

	function easeInQuint(x) {
		return x * x * x * x * x;
	}

	function easeOutQuint(x) {
		return 1 - Math.pow(1 - x, 5);
	}

	function easeInOutQuint(x) {
		return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
	}

	function easeInExpo(x) {
		return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
	}

	function easeOutExpo(x) {
		return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
	}

	function easeInOutExpo(x) {
		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
	}

	function easeInCirc(x) {
		return 1 - Math.sqrt(1 - Math.pow(x, 2));
	}

	function easeOutCirc(x) {
		return Math.sqrt(1 - Math.pow(x - 1, 2));
	}

	function easeInOutCirc(x) {
		return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
	}

	function easeInBack(x) {
		const c1 = 1.70158;
		const c3 = c1 + 1;

		return c3 * x * x * x - c1 * x * x;
	}

	function easeOutBack(x) {
		const c1 = 1.70158;
		const c3 = c1 + 1;

		return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
	}

	function easeInOutBack(x) {
		const c1 = 1.70158;
		const c2 = c1 * 1.525;

		return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	}

	function easeInElastic(x) {
		const c4 = (2 * Math.PI) / 3;

		return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
	}

	function easeOutElastic(x) {
		const c4 = (2 * Math.PI) / 3;

		return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	}

	function easeInOutElastic(x) {
		const c5 = (2 * Math.PI) / 4.5;

		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
	}

	function easeInBounce(x) {
		return 1 - easeOutBounce(1 - x);
	}

	function easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	}

	function easeInOutBounce(x) {
		return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
	}
	/**
	 * --------------------------------------------------
	 * Accordion
	 * --------------------------------------------------
	 */

	class Accordion extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.className = {
				focus: "focus",
			};

			// [Default] allow-multiple : true, allow-Toggle : true
			// this.allowMultiple = (getDataAttribute(this._element, 'allow-multiple') === 'true');
			this.allowMultiple = getDataAttribute(this._element, "allow-multiple") !== "false";
			this.allowToggle = getDataAttribute(this._element, "allow-toggle") === "true" || this.allowMultiple === true;

			this.findElement();
			this.eventBind();
		}

		static get NAME() {
			return "accordion";
		}

		findElement() {
			let accordionItem = this._element.children;
			let triggerArray = [];
			let panelArray = [];

			Object.values(accordionItem).map((item) => {
				triggerArray.push(item.querySelector(".accordion-trigger"));
				panelArray.push(item.querySelector(".accordion-panel"));
				item.querySelector(".accordion-trigger").setAttribute("role", "button");
			});

			this._triggers = triggerArray;
			this._panels = panelArray;

			// this._triggers = this._element.querySelectorAll('.accordion-item > .accordion-trigger');
			// this._panels = this._element.querySelectorAll('.accordion-item > .accordion-panel');
		}

		eventBind() {
			Object.values(this._triggers).map((trigger) => {
				EventHandler.on(trigger, "click", this.triggerClick.bind(this));
				EventHandler.on(trigger, "keydown", this.triggerKeydown.bind(this));
				EventHandler.on(trigger, "focus", this.triggerFocus.bind(this));
				EventHandler.on(trigger, "blur", this.triggerBlur.bind(this));
			});
		}

		triggerClick(e) {
			let trigger;
			if (e.target.tagName == "BUTTON") {
				trigger = e.target;
			} else {
				trigger = getParentsByTagName(e.target, "button");
			}

			const expanded = getAriaAttribute(trigger, "expanded") == "true";

			if (!this.allowMultiple) {
				this.deactivateTriggers();
			}
			if (expanded && this.allowToggle) {
				this.deactivateTrigger(trigger);
			} else {
				this.activateTrigger(trigger);
			}
		}

		triggerKeydown(e) {
			const key = e.keyCode;

			switch (key) {
				case keys.end:
					e.preventDefault();
					this.focusLastTrigger();
					break;
				case keys.home:
					e.preventDefault();
					this.focusFirstTrigger();
					break;
				case keys.up:
					e.preventDefault();
					this.focusPrevTrigger();
					break;
				case keys.down:
					e.preventDefault();
					this.focusNextTrigger();
					break;
			}
		}

		triggerFocus(e) {
			this._element.classList.add(this.className.focus);
		}

		triggerBlur(e) {
			this._element.classList.remove(this.className.focus);
		}

		activateTrigger(trigger) {
			const controls = getAriaAttribute(trigger, "controls");
			setAriaAttribute(trigger, "expanded", "true");
			if (this._element.querySelector(`#${controls}`)) {
				this._element.querySelector(`#${controls}`).removeAttribute("hidden");
			}
		}

		deactivateTrigger(trigger) {
			const controls = getAriaAttribute(trigger, "controls");
			setAriaAttribute(trigger, "expanded", "false");
			if (this._element.querySelector(`#${controls}`)) {
				this._element.querySelector(`#${controls}`).setAttribute("hidden", "");
			}
		}

		deactivateTriggers() {
			Object.values(this._triggers).map((trigger) => {
				setAriaAttribute(trigger, "expanded", "false");
			});
			Object.values(this._panels).map((panel) => {
				if (panel != null) {
					panel.setAttribute("hidden", "");
				}
			});
		}

		focusPrevTrigger() {
			const prev = document.activeElement.parentElement.previousElementSibling;
			if (prev === null) {
				this.focusLastTrigger();
			} else {
				prev.querySelector(".accordion-trigger").focus();
			}
		}

		focusNextTrigger() {
			const next = document.activeElement.parentElement.nextElementSibling;
			if (next === null) {
				this.focusFirstTrigger();
			} else {
				next.querySelector(".accordion-trigger").focus();
			}
		}

		focusFirstTrigger() {
			this._triggers[0].focus();
		}

		focusLastTrigger() {
			this._triggers[this._triggers.length - 1].focus();
		}

		dispose() {
			super.dispose();
		}
	}

	function AccordionApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".accordion");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.Accordion(element);
		});
	}

	window.addEventListener("load", () => {
		AccordionApply();
	});
	/**
	 * --------------------------------------------------
	 * Bottom Sheet
	 * --------------------------------------------------
	 */

	class BottomSheet extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					autoDestroy: false,
				},
				...(typeof config === "object" ? config : {}),
			};

			this.EVENT_SHOW = `show${this.EVENT_KEY}`;
			this.EVENT_SHOWN = `shown${this.EVENT_KEY}`;
			this.EVENT_HIDE = `hide${this.EVENT_KEY}`;
			this.EVENT_HIDDEN = `hidden${this.EVENT_KEY}`;

			this._isShown = false;
			this._focusReturnElement = null;
			this._dimm = this._element.querySelector(".bottom-sheet-dimm");
			this._container = this._element.querySelector(".bottom-sheet-container");
			this._header = this._element.querySelector(".bottom-sheet-header");
			this._contents = this._element.querySelector(".bottom-sheet-contents");
			this._btnClose = this._element.querySelectorAll('[data-action="sheet-close"]');
			this._scrollHide = getDataAttribute(this._element, "scroll-hide") === "true";
			this._disableClose = getDataAttribute(this._element, "disable-close") === "true";

			if (this._contents === null) {
				super.dispose();
				return;
			}

			this.handleHeight = 0;

			if (this.isStandardSheet()) {
				// if (this._element.classList.contains("page-in-sheet")) {
				// 	prependHtml(this._container, '<div class="page-in-sheet-handle"></div>');
				// 	this._handle = this._element.querySelector(".page-in-sheet-handle");
				// 	this.handleHeight = 132;
				// }
				// 접근성수정
				if (this._element.classList.contains("more-height")) {
					prependHtml(this._container, '<button class="standard-sheet-handle" aria-expanded="false"></button>');
					this._handle = this._element.querySelector(".standard-sheet-handle");
					this.handleHeight = 160;

					let tmp = document.createElement("div");
					tmp.style.width = "10px";
					tmp.style.height = "var(--safeAreaInsetBottom)";
					document.body.appendChild(tmp);
					this.handleHeight += tmp.clientHeight;
					tmp.remove();
				} else {
					prependHtml(this._container, '<button class="standard-sheet-handle" aria-expanded="false"></button>');
					this._handle = this._element.querySelector(".standard-sheet-handle");
					this.handleHeight = 70;
				}
				this.checkHandle();
			}

			if (getDataAttribute(this._container, "size") == "max") {
				this._container.classList.add("max");
			}

			setTimeout(() => {
				this.heightUpdate();
			}, 500);

			this._eventBind();

			if (getDataAttribute(this._element, "show") == "true") {
				this.show();
			}
			window.requestAnimationFrame(() => {
				this.checkHeight();
			});

			// 접근성 수정
			if(!this._element.classList.contains("standard-sheet")){
				this._element.setAttribute("aria-hidden", "true"); //숨김상태 접근불가
			}
			this._dimm.innerText = "딤드영역. 클릭하시면 레이어가 닫힙니다.";
			this._dimm.setAttribute("tabindex", -1);
			// this._dimm.removeAttribute("aria-hidden");
			this._dimm.setAttribute("aria-hidden", "true");
			this._firstElement = this.findFirstElement();
			if (this._firstElement !== null) {
				this._firstElement.setAttribute("tabindex", -1);
			}
		}

		static get NAME() {
			return "bottomSheet";
		}

		_eventBind() {
			Object.values(this._btnClose).map((obj) => {
				EventHandler.on(obj, "click", this._clickClose.bind(this));
			});

			if (this._dimm.classList.contains("dimm-click-hide-none")) {
				//0629 추가 - 김윤정(if문만 추가)
				return;
			} else {
				EventHandler.on(this._dimm, "click", this._clickClose.bind(this));
				EventHandler.on(this._dimm, "keyup", (e) => {
					if (e.keyCode == 13 || e.keyCode == 32) {
						this._clickClose();
					}
				});
			}

			EventHandler.on(this._contents, "scroll", () => {
				if (this._contents.scrollTop > 100 && !this._container.classList.contains("max")) {
					this._container.classList.add("max");
				}
			});
			if (this.isStandardSheet()) {
				EventHandler.on(this._handle, "click", () => {
					if (this._isShown) {
						this.hide();
					} else {
						this.show();
					}
				});
			}
		}

		_clickClose() {
			if (!this._disableClose) this.hide();
		}

		checkHandle() {
			if (this._handle !== undefined) {
				this._handle.innerText = this._isShown ? "축소 버튼" : "확장 버튼";
				//접근성 수정
				if (this._handle.classList.contains("active")) {
					this._handle.classList.remove("active");
					this._handle.setAttribute("aria-expanded","true");
				} else {
					this._handle.classList.add("active");
					this._handle.setAttribute("aria-expanded","false");
				}
			}
		}

		show() {
			if (this._isShown) {
				return;
			}

			// 하드웨어 백버튼 처리 - 2022.06.17 TaeHeun Lee
			sessionStorage.setItem("UI.BOTTOMSHEET", "SHOW");

			// 바텀시트 안에 input 폼이 있는 경우 max 처리
			if (this._contents.querySelectorAll(".ui-form input").length !== 0) {
				this._container.classList.add("max");
				setDataAttribute(this._container, "size", "max");
			}

			this._element.dispatchEvent(new CustomEvent(this.EVENT_SHOW));
			this._element.removeAttribute("aria-hidden");
			if (typeof jQuery !== "undefined") $(this._element).trigger(this.EVENT_SHOW);
			this._isShown = true;
			this._container.style.display = "flex";
			this._dimm.style.display = "block";
			setTimeout(() => {
				this._element.classList.add("show");
				this._dimm.style.opacity = 1;
			}, 10);
			setTimeout(() => {
				this._element.dispatchEvent(new CustomEvent(this.EVENT_SHOWN));
				if (typeof jQuery !== "undefined") $(this._element).trigger(this.EVENT_SHOWN);
			}, 300);
			this.bodyHold(true);
			this.checkHandle();

			if (this._scrollHide) {
				EventHandler.one(window, "scroll", () => {
					this.hide();
				});
			}

			// 접근성 수정
			setTimeout(() => {
				if (this._firstElement !== null) {
					this._firstElement.focus();
				}
				ariaHiddenActivate(this._element);
				if (window.lastClickElement !== undefined) {
					this._focusReturnElement = window.lastClickElement;
				} else {
					this._focusReturnElement = null;
				}
			}, 100);
		}

		hide() {
			if (!this._isShown) {
				return;
			}

			// 하드웨어 백버튼 처리 - 2022.06.14 TaeHeun Lee
			sessionStorage.removeItem("UI.BOTTOMSHEET");

			this._element.dispatchEvent(new CustomEvent(this.EVENT_HIDE));
			if(!this._element.classList.contains("standard-sheet")){
				this._element.setAttribute("aria-hidden",true);
			}
			if (typeof jQuery !== "undefined") $(this._element).trigger(this.EVENT_HIDE);
			this._isShown = false;
			this._element.classList.remove("show");
			if (getDataAttribute(this._container, "size") != "max") {
				this._container.classList.remove("max");
			}
			this._dimm.style.opacity = 0;
			setTimeout(() => {
				this._contents.scrollTop = 0;
				if (!this.isStandardSheet()) {
					this._container.style.display = "none";
				}
				this._dimm.style.display = "none";
				this._element.dispatchEvent(new CustomEvent(this.EVENT_HIDDEN));
				if (typeof jQuery !== "undefined") $(this._element).trigger(this.EVENT_HIDDEN);
			}, 300);
			this.bodyHold(false);
			this.checkHandle();
			if (this.config.autoDestroy) {
				this.dispose();
			}
			// 접근성 수정
			ariaHiddenDeactivate();
			if (this._focusReturnElement !== null) {
				this._focusReturnElement.focus();
			}
		}

		bodyHold(tf) {
			if (!this.isStandardSheet()) {
				bodyHold(tf);
			}
		}

		isStandardSheet() {
			return this._element.classList.contains("standard-sheet");
		}

		heightUpdate() {
			this._element.classList.add("no-transition");
			setDataAttribute(this._container, "bottom", 0 - this._container.clientHeight + this.handleHeight);
			this._container.style.bottom = 0 - this._container.clientHeight + this.handleHeight + "px";
			if (!this._isShown && !this.isStandardSheet()) {
				this._container.style.display = "none";
			}
			setTimeout(() => {
				this._element.classList.remove("no-transition");
			}, 100);
		}

		checkHeight() {
			let a = parseInt(getDataAttribute(this._container, "bottom"));
			let b = 0 - this._container.clientHeight + this.handleHeight;
			if (getDataAttribute(this._container, "bottom") != null && (this.isStandardSheet() || this._isShown)) {
				if (a !== b) {
					this.heightUpdate();
				}
			}
			window.requestAnimationFrame(() => {
				this.checkHeight();
			});
		}

		findFirstElement() {
			if (this._container.querySelector(".bottom-sheet-header > .title") !== null) {
				return this._container.querySelector(".bottom-sheet-header > .title");
			} else if (this._container.querySelector(".bottom-sheet-contents") !== null) {
				return this._container.querySelector(".bottom-sheet-contents");
			} else {
				return null;
			}
		}

		dispose() {
			this._element.remove();
			super.dispose();
		}
	}

	function BottomSheetApply(elements, callback) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".bottom-sheet");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		if (targetElements.length === 0 && elements !== undefined) {
			console.log("%cBottomSheet targetElements 가 없습니다. [" + elements + "]", "color:red;");
		} else {
			Object.values(targetElements).map((element) => {
				new UI.BottomSheet(element);
				if (element.classList.contains("initiated")) {
					if (callback) {
						callback(element.id);
					}
				}
				// else {
				// 	console.log("%cBottomSheet가 initiated 되지 않았습니다. id: " + element.id, "color:red;");
				// }
			});
		}
	}

	window.addEventListener("load", () => {
		BottomSheetApply();
	});

	function bottomSheetShow(id) {
		// 하드웨어 백버튼 처리 - 2022.06.14 TaeHeun Lee
		if (typeof commonBsDivId !== "undefined") {
			commonBsDivId = id;
		}

		if (UI.BottomSheet.getInstance(`#${id}`) === null) {
			UI.BottomSheetApply(`#${id}`, (id) => UI.BottomSheet.getInstance(`#${id}`).show());
		} else {
			UI.BottomSheet.getInstance(`#${id}`).show();
		}
	}

	function bottomSheetHide(id) {
		if (UI.BottomSheet.getInstance(`#${id}`) === null) {
			console.log("%cBottomSheet 대상이 없습니다.", "color:red;");
		} else {
			UI.BottomSheet.getInstance(`#${id}`).hide();
		}
	}

	/**
	 * --------------------------------------------------
	 * Button
	 * --------------------------------------------------
	 */

	class ButtonRipple extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.appendRipple();
			this._eventBind();
		}

		static get NAME() {
			return "buttonRipple";
		}

		_eventBind() {
			this._element.addEventListener("click", this._click.bind(this));
		}

		_click(e) {
			clearTimeout(this.timeout);
			this._element.classList.remove("ripple-effect-activate");

			let rippleX = e.offsetX;
			let rippleY = e.offsetY;
			if (e.path[0] !== this._element) {
				rippleX += e.path[0].offsetLeft;
				rippleY += e.path[0].offsetTop;
			}
			this._element.style.setProperty("--ripple-x", rippleX + "px");
			this._element.style.setProperty("--ripple-y", rippleY + "px");
			this._element.style.setProperty("--ripple-w", this._element.clientWidth * 2 + "px");

			this._element.classList.add("ripple-effect-activate");
			this.timeout = setTimeout(() => {
				this._element.classList.remove("ripple-effect-activate");
			}, 500);
		}

		appendRipple() {
			appendHtml(this._element, '<span class="ripple"></span>');
		}

		dispose() {
			super.dispose();
		}
	}

	function ButtonRippleApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".btn");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.ButtonRipple(element);
		});
	}

	window.addEventListener("load", () => {
		// ButtonRippleApply();
	});
	/**
	 * --------------------------------------------------
	 * Calendar
	 * --------------------------------------------------
	 */

	class Calendar extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					minDate: "1900-01-01",
					maxDate: "2100-12-31",
					setDate: null,
					year: null,
					month: null,
					date: null,
					linkedInputID: null,
					on: {
						apply: function () {},
					},
				},
				...(typeof config === "object" ? config : {}),
			};

			this.regex = RegExp(/^\d{4}.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$/);

			this.minDate = dayjs(this.config.minDate);
			this.maxDate = dayjs(this.config.maxDate);

			this.isTypeA = getDataAttribute(this._element, "type").toUpperCase() == "A";

			this.today = dayjs().format("YYYY-MM-DD");

			this.setDate = this.config.setDate || this.today;

			this.selectedYear = parseInt(this.setDate.split("-")[0]);
			this.selectedMonth = parseInt(this.setDate.split("-")[1]);
			this.selectedDate = parseInt(this.setDate.split("-")[2]);
			this.currentYear = null;

			this._linkedInput = document.querySelector(`#${this.config.linkedInputID}`);
			if (this._linkedInput != null) {
				if (this.config.setDate !== null) {
					this._linkedInput.value = this.formattedValue();
				}
			}

			if (this.isTypeA) {
				this._element.classList.add("type-a");
				this.currentYear = this.selectedYear;
				this.createHtmlTypeA();
				this.setTypeA();
				this.eventBindTypeA(true);
			} else {
				this._element.classList.add("type-b");
				this.currentYear = this.selectedYear;
				this.currentMonth = this.selectedMonth;
				this.createHtmlTypeB();
				this.setTypeB();
				this.eventBindTypeB(true);
			}

			if (this._linkedInput !== null) {
				this._linkedUiForm = getParentsByClassName(this._linkedInput, "ui-form");
				EventHandler.on(this._linkedInput, "blur", () => {
					if (this.regex.test(this._linkedInput.value)) {
						this.setValue(this._linkedInput.value);
					} else if (this._linkedInput.value == "") {
						this.setValue(dayjs().format("YYYY-MM-DD"));
					}
				});
			}
		}

		static get NAME() {
			return "calendar";
		}

		update() {
			if (this.isTypeA) {
				this.setTypeA();
				this.eventBindTypeA();
			} else {
				this.setTypeB();
				this.eventBindTypeB();
			}
		}

		createHtmlTypeA() {
			let html = ``;
			html += `<div class="area-year">`;
			html += `	<button class="down" type="button">이전년</button>`;
			html += `	<span class="current"></span>`;
			html += `	<button class="up" type="button">다음년</button>`;
			html += `</div>`;
			html += `<div class="area-month"></div>`;
			appendHtml(this._element, html);
			this._areaYear = this._element.querySelector(".area-year");
			this._areaYearCurrent = this._areaYear.querySelector(".current");
			this._areaYearUp = this._areaYear.querySelector("button.up");
			this._areaYearDown = this._areaYear.querySelector("button.down");
			this._areaMonth = this._element.querySelector(".area-month");
		}

		setTypeA() {
			let btnDate;

			this._areaYearCurrent.innerText = this.currentYear;
			this._areaMonth.innerHTML = "";

			for (let i = 1; i <= 12; i++) {
				const button = document.createElement("button");

				btnDate = dayjs(`${this.currentYear}-${i}`);

				button.innerText = i + "월";

				if (btnDate < this.minDate || btnDate > this.maxDate) {
					button.setAttribute("disabled", "");
				}

				if (this.currentYear == this.selectedYear && i == this.selectedMonth) {
					button.classList.add("selected");
					button.setAttribute("title", "선택됨");
				}

				setDataAttribute(button, "year", this.currentYear);
				setDataAttribute(button, "month", i);

				this._areaMonth.appendChild(button);
			}
			this._areaMonthButtons = this._areaMonth.querySelectorAll("button");
		}

		eventBindTypeA(isFirst) {
			if (isFirst) {
				EventHandler.on(this._areaYearUp, "click", this.clickYearUp.bind(this));
				EventHandler.on(this._areaYearDown, "click", this.clickYearDown.bind(this));
			}
			Object.values(this._areaMonthButtons).map((btn) => {
				EventHandler.on(btn, "click", (e) => {
					this.clickMonthButton(e, btn);
				});
			});
		}

		createHtmlTypeB() {
			let html = ``;
			html += `<div class="area-controller">`;
			html += `	<div class="control year">`;
			html += `		<button class="down" type="button">이전년</button>`;
			html += `		<span class="current"></span>`;
			html += `		<button class="up" type="button">다음년</button>`;
			html += `	</div>`;
			html += `	<div class="control month">`;
			html += `		<button class="down" type="button">이전달</button>`;
			html += `		<span class="current"></span>`;
			html += `		<button class="up" type="button">다음달</button>`;
			html += `	</div>`;
			html += `</div>`;
			html += `<div class="area-calendar">`;
			html += `	<div class="calendar-week">`;
			html += `		<span class="day sun">일</span>`;
			html += `		<span class="day">월</span>`;
			html += `		<span class="day">화</span>`;
			html += `		<span class="day">수</span>`;
			html += `		<span class="day">목</span>`;
			html += `		<span class="day">금</span>`;
			html += `		<span class="day sat">토</span>`;
			html += `	</div>`;
			html += `	<div class="calendar-date"></div>`;
			html += `</div>`;
			appendHtml(this._element, html);
			this._areaController = this._element.querySelector(".area-controller");
			this._areaYear = this._areaController.querySelector(".control.year");
			this._areaYearCurrent = this._areaYear.querySelector(".current");
			this._areaYearUp = this._areaYear.querySelector("button.up");
			this._areaYearDown = this._areaYear.querySelector("button.down");
			this._areaMonth = this._areaController.querySelector(".control.month");
			this._areaMonthCurrent = this._areaMonth.querySelector(".current");
			this._areaMonthUp = this._areaMonth.querySelector("button.up");
			this._areaMonthDown = this._areaMonth.querySelector("button.down");
			this._areaCalendar = this._element.querySelector(".area-calendar");
			this._areaCalendarDate = this._areaCalendar.querySelector(".calendar-date");
		}

		setTypeB() {
			let btnDate;

			this._areaYearCurrent.innerText = this.currentYear;
			this._areaMonthCurrent.innerText = this.currentMonth < 10 ? "0" + this.currentMonth : this.currentMonth;
			this._areaCalendarDate.innerHTML = "";

			let lastDay = dayjs(`${this.currentYear}-${this.currentMonth}`).daysInMonth();

			for (let i = 1; i <= lastDay; i++) {
				const button = document.createElement("button");
				const date = `${this.currentYear}-${this.currentMonth}-${i}`;
				btnDate = dayjs(date);

				button.innerHTML = `<span>${i}</span>`;

				if (i == 1) {
					button.style.marginLeft = `calc(14.28% * ${this.getDay(date)})`;
				} else if (i == lastDay) {
					button.style.marginRight = `calc(14.28% * ${6 - this.getDay(date)})`;
				}

				if (btnDate < this.minDate || btnDate > this.maxDate) {
					button.setAttribute("disabled", "");
				}

				if (this.currentYear == this.selectedYear && this.currentMonth == this.selectedMonth && i == this.selectedDate) {
					button.classList.add("selected");
					button.setAttribute("title", "선택됨");
				}

				if (dayjs(date).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) {
					button.classList.add("today");
					button.setAttribute("title", "오늘날짜");
					// 20240307 수정
					if (this.currentYear == this.selectedYear && this.currentMonth == this.selectedMonth && i == this.selectedDate) {
						button.classList.add("selected");
						button.setAttribute("title", "오늘날짜 선택됨");
					}
				}

				if (this.getDay(date) == 0) {
					button.classList.add("sun");
				}
				if (this.getDay(date) == 6) {
					button.classList.add("sat");
				}

				setDataAttribute(button, "year", this.currentYear);
				setDataAttribute(button, "month", this.currentMonth);
				setDataAttribute(button, "date", i);

				this._areaCalendarDate.appendChild(button);
			}
			this._areaDateButtons = this._areaCalendarDate.querySelectorAll("button");
		}

		eventBindTypeB(isFirst) {
			if (isFirst) {
				EventHandler.on(this._areaYearUp, "click", this.clickYearUp.bind(this));
				EventHandler.on(this._areaYearDown, "click", this.clickYearDown.bind(this));
				EventHandler.on(this._areaMonthUp, "click", this.clickMonthUp.bind(this));
				EventHandler.on(this._areaMonthDown, "click", this.clickMonthDown.bind(this));
			}
			Object.values(this._areaDateButtons).map((btn) => {
				EventHandler.on(btn, "click", (e) => {
					this.clickDateButton(e, btn);
				});
			});
		}

		clickYearUp() {
			if (dayjs(this.currentYear + 1) > dayjs(this.getYear(this.maxDate))) return;
			this.currentYear++;
			this.update();
		}

		clickYearDown() {
			if (dayjs(this.currentYear - 1) < dayjs(this.getYear(this.minDate))) return;
			this.currentYear--;
			this.update();
		}

		clickMonthUp() {
			if (dayjs(`${this.currentYear}-${this.currentMonth + 1}`) > dayjs(`${this.getYear(this.maxDate)}-${this.getMonth(this.maxDate)}`)) return;
			if (this.currentMonth == 12) {
				this.currentMonth = 1;
				this.clickYearUp();
			} else {
				this.currentMonth++;
				this.update();
			}
		}

		clickMonthDown() {
			if (dayjs(`${this.currentYear}-${this.currentMonth - 1}`) < dayjs(`${this.getYear(this.minDate)}-${this.getMonth(this.minDate)}`)) return;
			if (this.currentMonth == 1) {
				this.currentMonth = 12;
				this.clickYearDown();
			} else {
				this.currentMonth--;
				this.update();
			}
		}

		clickMonthButton(e, btn) {
			this.selectedYear = parseInt(getDataAttribute(btn, "year"));
			this.selectedMonth = parseInt(getDataAttribute(btn, "month"));
			this.update();
		}

		clickDateButton(e, btn) {
			this.selectedYear = parseInt(getDataAttribute(btn, "year"));
			this.selectedMonth = parseInt(getDataAttribute(btn, "month"));
			this.selectedDate = parseInt(getDataAttribute(btn, "date"));
			this.update();
		}

		getYear(date) {
			return dayjs(date).get("year");
		}

		getMonth(date) {
			return dayjs(date).get("month") + 1;
		}

		getDate(date) {
			return dayjs(date).get("date");
		}

		getDay(date) {
			return dayjs(date).get("day");
		}

		value() {
			if (this.isTypeA) {
				return {
					year: this.selectedYear,
					month: this.selectedMonth,
				};
			} else {
				return {
					year: this.selectedYear,
					month: this.selectedMonth,
					date: this.selectedDate,
				};
			}
		}

		setValue(str) {
			const setDate = replaceAll(str, ".", "-");

			if (this.isTypeA) {
				this.selectedYear = this.currentYear = parseInt(setDate.split("-")[0]);
				this.selectedMonth = parseInt(setDate.split("-")[1]);
			} else {
				this.selectedYear = this.currentYear = parseInt(setDate.split("-")[0]);
				this.selectedMonth = this.currentMonth = parseInt(setDate.split("-")[1]);
				this.selectedDate = parseInt(setDate.split("-")[2]);
			}

			this.update();
		}

		setMinDate(str) {
			this.minDate = dayjs(replaceAll(str, ".", "-"));
			this.update();
		}

		setMaxDate(str) {
			this.maxDate = dayjs(replaceAll(str, ".", "-"));
			this.update();
		}

		formattedValue() {
			if (this.isTypeA) {
				return `${this.selectedYear}.${this.zerofill(this.selectedMonth)}`;
			} else {
				return `${this.selectedYear}.${this.zerofill(this.selectedMonth)}.${this.zerofill(this.selectedDate)}`;
			}
		}

		zerofill(v) {
			return ("00" + v).slice(-2);
		}

		apply() {
			if (this._linkedInput !== null) {
				this._linkedInput.value = this.formattedValue();
				this._linkedUiForm.classList.add("filled");
			}
			this.config.on.apply(this.formattedValue());
		}

		dispose() {
			super.dispose();
		}
	}

	function CalendarApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".ui-calendar");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.Calendar(element);
		});
	}

	window.addEventListener("load", () => {
		// CalendarApply();
	});
	/**
	 * --------------------------------------------------
	 * Form
	 * --------------------------------------------------
	 */

	class UIForm extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.CLASS_FOCUSED = "focused";
			this.CLASS_FILLED = "filled";
			this.CLASS_DISABLED = "disabled";
			this.CLASS_READONLY = "readonly";
			this.CLASS_ERROR = "error";
			this.CLASS_RIGHT = "align-right";

			this.type = this._element.classList.contains("line-type") ? "line" : "box";
			this.mode = this.getMode();

			this._formSet = this._element.querySelector(".form-set");
			if (this._formSet === null) {
				this.dispose();
				return;
			}

			this.createHtml = {
				clearButton: this.clearButton.bind(this),
				suffix: this.suffix.bind(this),
				prefix: this.prefix.bind(this),
				hiddenSpan: this.hiddenSpan.bind(this),
				lengthCount: this.lengthCount.bind(this),
				selectLabel: this.selectLabel.bind(this),
				bottomSheetSelect: this.bottomSheetSelect.bind(this),
			};

			this.setMode();
			this.eventBind();
			this.update();
		}

		static get NAME() {
			return "uiForm";
		}

		update() {
			this.checkDisabled();
			this.checkReadonly();
			this.checkFilled();
			this.autoSeparator();
			this.dateFormatter();
			this.checkSuffix();
			this.checkPrefix();
			this.checkLengthCount();
			this.checkSelectOptions();
			this.checkBtnClear();
			if (this.mode === "TEXTAREA") {
				this.autoResizeTextarea();
			}
		}

		clearButton() {
			let focusOutHidden = "";
			if (getParentsByClassName(this._element, "header-search") == null) {
				focusOutHidden = ' tabindex="-1"';
			}
			// [접근성수정] 스크린리더 초첨이동 순서
			const rightSection = this._formSet.querySelector(".right-section");
			if (rightSection === null) {
				appendHtml(this._formSet, '<button type="button" class="btn-clear"' + focusOutHidden + ">내용삭제</button>");
			} else {
				rightSection.insertAdjacentHTML("beforebegin", '<button type="button" class="btn-clear"' + focusOutHidden + ">내용삭제</button>");
			}
		}
		suffix() {
			//appendHtml(this._formSet, '<span class="suffix"></span>'); 접근성순서 변경
			this._formSet.querySelector("input").insertAdjacentHTML("afterend","<span class='suffix'></span>");
		}
		prefix() {
			appendHtml(this._formSet, '<span class="prefix"></span>');
		}
		hiddenSpan() {
			appendHtml(this._formSet, '<span class="hidden-span" aria-hidden="true"></span>');
		}
		lengthCount() {
			let lengthCount = document.createElement("div");
			lengthCount.classList.add("length-count");

			let html = "";
			html += `<span class="current"><span class="num"></span>자</span>`;
			html += `<span class="max"><span class="num"></span>자</span>`;

			lengthCount.innerHTML = html;

			this._element.insertBefore(lengthCount, this._formSet.nextSibling);
		}
		selectLabel(id) {
			let selectLableElem = document.createElement("label");
			selectLableElem.classList.add("select-label");
			selectLableElem.setAttribute("for", id);
			selectLableElem.setAttribute("tabindex", -1);

			this._select.parentNode.insertBefore(selectLableElem, this._select.nextSibling);
		}
		bottomSheetSelect(id, title) {
			let html = "";
			html += `<div class="bottom-sheet" id="${id}">`;
			html += `	<div class="bottom-sheet-dimm"></div>`;
			if (getDataAttribute(this._element, "bs-size") == "max") {
				html += `	<div class="bottom-sheet-container" data-size="max">`;
			} else {
				html += `	<div class="bottom-sheet-container">`;
			}
			html += `		<div class="bottom-sheet-header">`;
			if (title != null) {
				html += `			<span class="title">${title}</span>`;
			}
			html += `		</div>`;
			html += `		<div class="bottom-sheet-contents">`;
			html += `			<ul class="select-option-list">`;
			html += `			</ul>`;
			html += `		</div>`;
			// 단건 선택하는 바텀시트의 경우 X 닫기 버튼 없음
			// if (title != null) {
			html += `		<button class="bottom-sheet-close" data-action="sheet-close">닫기</button>`;
			// }
			html += `	</div>`;
			html += `</div>`;

			appendHtml(document.querySelector("body"), html);
		}

		getMode() {
			const mode = getDataAttribute(this._element, "mode");
			return mode ? mode.toUpperCase() : "TEXT-FIELD";
		}

		setMode() {
			if (this.mode === "TEXT-FIELD") {
				this._forms = this._element.querySelectorAll(".form-set input");
				this._form = this._forms[0];

				this.createHtml.clearButton();
				this._btnClear = this._element.querySelector(".btn-clear");
				this._tPrice = this._element.querySelector(".trans-price");  //접근성수정
				this.checkBtnClear();

				if (this.hasSuffix()) {
					if (this._formSet.querySelectorAll(".suffix").length === 0) {
						this.createHtml.suffix();
					}
					this.suffix = getDataAttribute(this._form, "suffix");
					this._suffix = this._formSet.querySelector(".suffix");
					this._suffix.setAttribute("aria-hidden","true");  //접근성수정
					this._suffix.innerText = this.suffix;
				}
				if (this.hasPrefix()) {
					if (this._formSet.querySelectorAll(".prefix").length === 0) {
						this.createHtml.prefix();
					}
					this.prefix = getDataAttribute(this._form, "prefix");
					this._prefix = this._formSet.querySelector(".prefix");
					this._prefix.innerText = this.prefix;
					//접근성2차
					var randomId = "PRE"+ generateRandomCode(4);
					this._form.setAttribute("aria-describedby",randomId);
					this._prefix.setAttribute("id",randomId);
				}
				if (this.hasPrefix() || this.hasSuffix()) {
					if (this._formSet.querySelectorAll(".hidden-span").length === 0) {
						this.createHtml.hiddenSpan();
					}
					this._hiddenSpan = this._formSet.querySelector(".hidden-span");
				}
				if (this.isAlignRight()) {
					this._element.classList.add(this.CLASS_RIGHT);
				}
				if (this.isLengthCount()) {
					if (this._element.querySelectorAll(".length-count").length === 0) {
						this.createHtml.lengthCount();
					}
					this._lengthCount = this._element.querySelector(".length-count");
					this.maxLength = parseInt(this._form.getAttribute("maxlength"));
					this._lengthCount.querySelector(".current > .num").innerText = 0;
					this._lengthCount.querySelector(".max > .num").innerText = this.maxLength;
				}
				if (this._form.getAttribute("type") == "date") {
					this._element.classList.add("type-date");
				}
				//접근성수정
				if(this._tPrice){
					this._tPrice.setAttribute("aria-hidden","true")
				}
			} else if (this.mode === "DROPDOWN") {
				this._forms = this._element.querySelectorAll(".form-set select");
				this._form = this._forms[0];
				this._select = this._forms[0];

				this.bottomSheetID = this._select.id + "-BS";
				this.bottomSheetTitle = this._select.getAttribute("title");

				this.createHtml.selectLabel(this._select.id);
				this._selectLabel = this._element.querySelector(".form-set .select-label");

				this.createHtml.bottomSheetSelect(this.bottomSheetID, this.bottomSheetTitle);
				this._bottomSheet = document.getElementById(this.bottomSheetID);

				this.checkSelectOptions();

				this.bottomSheet = new BottomSheet(`#${this.bottomSheetID}`);
				document.getElementById(this.bottomSheetID).addEventListener("show.ui.bottomSheet", () => {
					this._element.classList.add("dropdown-active");
				});
				document.getElementById(this.bottomSheetID).addEventListener("hide.ui.bottomSheet", () => {
					this._element.classList.remove("dropdown-active");
				});
				//2024 접근성
				this._fset = this._element.querySelector(".form-set");
				this._flabel = this._element.querySelector(".form-label");
				this._fselect = this._element.querySelector("select");
				this._selectLabel.setAttribute("aria-hidden","true");
				this._fselect.setAttribute("aria-hidden","true");
				let btn = document.createElement("button");
				btn.className = "btn-select";
				//.form-label 이 없을경우
				if(this._flabel != null){
					btn.setAttribute("title",this._flabel.textContent + " 선택");
				}else{
					btn.setAttribute("title",this._fselect.getAttribute("title"));
				}
				btn.setAttribute("aria-label",this._selectLabel.textContent);
				this._fset.appendChild(btn);
				btn.addEventListener("click",function(){
					this.parentElement.querySelector(".select-label").click();
				});
				this._btnSelect = this._element.querySelector(".form-set .btn-select");
				this._focusReturnElement = this._btnSelect;

			} else if (this.mode === "PHONE-AUTH") {
				this._forms = this._element.querySelectorAll(".form-set input, .form-set select");
				this._form = this._forms[1];
				this._select = this._forms[0];

				this.bottomSheetID = this._select.id + "-BS";

				this.createHtml.selectLabel(this._select.id);
				this._selectLabel = this._element.querySelector(".form-set .select-label");

				this.createHtml.bottomSheetSelect(this.bottomSheetID, "통신사 선택");
				this.bottomSheet = new BottomSheet(`#${this.bottomSheetID}`);
				this._bottomSheet = document.getElementById(this.bottomSheetID);

				document.getElementById(this.bottomSheetID).addEventListener("show.ui.bottomSheet", () => {
					this._element.classList.add("dropdown-active");
				});
				document.getElementById(this.bottomSheetID).addEventListener("hide.ui.bottomSheet", () => {
					this._element.classList.remove("dropdown-active");
				});
			} else if (this.mode === "WITH-SELECT") {
				this._forms = this._element.querySelectorAll(".form-set input, .form-set select");
				this._form = this._forms[0];
				this._select = this._forms[1];

				this.bottomSheetID = this._select.id + "-BS";

				this.createHtml.selectLabel(this._select.id);
				this._selectLabel = this._element.querySelector(".form-set .select-label");

				this.createHtml.bottomSheetSelect(this.bottomSheetID, "선택");
				this.bottomSheet = new BottomSheet(`#${this.bottomSheetID}`);
				this._bottomSheet = document.getElementById(this.bottomSheetID);

				document.getElementById(this.bottomSheetID).addEventListener("show.ui.bottomSheet", () => {
					this._element.classList.add("dropdown-active");
				});
				document.getElementById(this.bottomSheetID).addEventListener("hide.ui.bottomSheet", () => {
					this._element.classList.remove("dropdown-active");
				});
			} else if (this.mode === "TEXTAREA") {
				this._forms = this._element.querySelectorAll(".form-set textarea");
				this._form = this._forms[0];

				if (this._form.getAttribute("rows") === null) {
					this._form.setAttribute("rows", 1);
				}

				if (this.isLengthCount()) {
					if (this._element.querySelectorAll(".length-count").length === 0) {
						this.createHtml.lengthCount();
					}
					this._lengthCount = this._element.querySelector(".length-count");
					this.maxLength = parseInt(this._form.getAttribute("maxlength"));
					this._lengthCount.querySelector(".current > .num").innerText = 0;
					this._lengthCount.querySelector(".max > .num").innerText = this.maxLength;
				}
			}
		}

		eventBind() {
			Object.values(this._forms).map((form) => {
				form.addEventListener("click", this.formClick.bind(this));
				form.addEventListener("focus", this.formFocus.bind(this));
				form.addEventListener("blur", this.formBlur.bind(this));
				form.addEventListener("keyup", this.formKeyup.bind(this));
				form.addEventListener("keydown", this.formKeydown.bind(this));
				form.addEventListener("change", this.formChange.bind(this));
				form.addEventListener("input", this.formInput.bind(this));
			});
			if (this._btnClear) this._btnClear.addEventListener("click", this.clearClick.bind(this));
			if (this._selectLabel) this._selectLabel.addEventListener("click", this.selectLabelClick.bind(this));
		}

		formClick() {
			// this.focused(true);
			// if (this.mode === 'DROPDOWN') {
			// 	this.bottomSheet.show();
			// }
		}

		formFocus() {
			this.focused(true);
			// if (this.mode === 'DROPDOWN') {
			// 	this.bottomSheet.show();
			// }

			// right section 있는 경우 x 버튼 위치 재조정
			if (this.hasRightSection()) {
				this.update();
			}
		}

		formBlur() {
			this.checkFilled();
			this.focused(false);
			// if (this.mode === 'DROPDOWN') {
			// 	setTimeout(() => {
			// 		this.bottomSheet.hide();
			// 	}, 100);
			// }
			this.checkLengthCount();
		}

		formInput() {
			this.checkLengthCount();
		}

		formKeydown(e) {
			// Dropdown <select>에 Enter키 눌렀을때...
			// if (this.mode === 'DROPDOWN' && e.keyCode === 13) {
			// 	this.bottomSheet.show();
			// }
			if (this.mode === "TEXTAREA") {
				this.autoResizeTextarea(e);
			}
		}

		formKeyup(e) {
			this.checkFilled();
			this.autoSeparator();
			this.dateFormatter();
			this.checkSuffix();
			this.checkPrefix();
			this.checkLengthCount();
			if (this.mode === "TEXTAREA") {
				this.autoResizeTextarea(e);
			}
		}

		formChange(e) {
			if (this.mode === "DROPDOWN" || this.mode === "PHONE-AUTH" || this.mode === "WITH-SELECT") {
				this.update();
				this.bottomSheet.hide();
			}
			if (this._form.getAttribute("type") == "date") {
				this.update();
			}
		}

		clearClick() {
			this.clearValue();
			this.filled(false);
			this.checkSuffix();
			this.checkPrefix();
			this.checkLengthCount();
			this._form.focus();
			// keyup Trigger
			this._form.dispatchEvent(new Event("keyup"));
		}

		selectLabelClick(e) {
			if ((this.mode === "DROPDOWN" || this.mode === "PHONE-AUTH" || this.mode === "WITH-SELECT") && !this._select.disabled) {
				e.preventDefault();
				this.update();
				if (getDataAttribute(this._element, "select-label-click") !== "false") {
					this.bottomSheet.show();
				}
			}
		}

		focused(tf) {
			this._element.classList.toggle(this.CLASS_FOCUSED, tf);
			if (this._btnClear && this._btnClear.getAttribute("tabindex") == "-1") {
				if (tf && !this._form.readOnly) {
					//this._btnClear.removeAttribute("aria-hidden"); 접근성수정
					//this._btnClear.setAttribute("aria-hidden", "true");
				} else {
					//this._btnClear.setAttribute("aria-hidden", "true");
				}
			}
		}

		filled(tf) {
			this._element.classList.toggle(this.CLASS_FILLED, tf);
			if (this._btnClear) {
				if (tf && !this._form.readOnly) {
					this._btnClear.removeAttribute("area-hidden");
				} else {
					this._btnClear.removeAttribute("area-hidden");
					//this._btnClear.setAttribute("aria-hidden", "true");
				}
			}
			//접근성수정
			if(this._tPrice){
				if (tf) {
					this._tPrice.setAttribute("aria-hidden", "false");
				}else{
					this._tPrice.setAttribute("aria-hidden", "true");
				}
			}
			if(this._suffix){
				if (tf) {
					this._suffix.setAttribute("aria-hidden", "false");
				}else{
					this._suffix.setAttribute("aria-hidden", "true");
				}
			}
		}

		hasSuffix() {
			return getDataAttribute(this._form, "suffix") !== null;
		}

		hasPrefix() {
			return getDataAttribute(this._form, "prefix") !== null;
		}

		hasValue() {
			return this._form.value !== "";
		}

		isAlignRight() {
			return getDataAttribute(this._form, "align") !== null && getDataAttribute(this._form, "align").toUpperCase() === "RIGHT";
		}

		isLengthCount() {
			return getDataAttribute(this._form, "length-count") === "true";
		}

		clearValue() {
			this._form.value = "";
		}

		hasRightSection() {
			return this._formSet.querySelector(".right-section") !== null;
		}

		checkDisabled() {
			this._element.classList.toggle(this.CLASS_DISABLED, this._form.disabled);
		}

		checkReadonly() {
			if (this.mode !== "DROPDOWN") {
				this._element.classList.toggle(this.CLASS_READONLY, this._form.readOnly);
			}
		}

		checkFilled() {
			this.filled(this.hasValue());
		}

		checkSuffix() {
			if (this.hasSuffix()) {
				if (this.suffix != getDataAttribute(this._form, "suffix")) {
					this.suffix = getDataAttribute(this._form, "suffix");
					this._suffix = this._formSet.querySelector(".suffix");
					this._suffix.innerText = this.suffix;
				}

				let pd = this.type === "box" ? 16 : 0;
				if (!this.isAlignRight()) {
					this._hiddenSpan.innerText = this._form.value;
					let left = this._hiddenSpan.offsetWidth === 0 ? pd : this._hiddenSpan.offsetWidth + pd + 2;
					if (this._prefix) {
						left -= pd;
					}
					this._suffix.style.left = left + "px";
					if (parseInt(this._form.style.paddingLeft) > 0) {
						this._suffix.style.left = left + parseInt(this._form.style.paddingLeft) + "px";
					}
				} else {
					this._suffix.style.right = pd + "px";
					let right = this._suffix.offsetWidth + pd + 2;
					if (this._element.classList.contains("filled")) {
						this._form.style.paddingRight = right + "px";
					} else {
						this._form.style.paddingRight = pd + "px";
					}
				}
			}
		}

		checkPrefix() {
			if (this.hasPrefix()) {
				if (this.prefix != getDataAttribute(this._form, "prefix")) {
					this.prefix = getDataAttribute(this._form, "prefix");
					this._prefix = this._formSet.querySelector(".prefix");
					this._prefix.innerText = this.prefix;
				}

				let pd = this.type === "box" ? 16 : 0;
				if (!this.isAlignRight()) {
					const left = this._prefix.offsetWidth + pd + 8;
					this._form.style.paddingLeft = left + "px";
				} else {
					this._hiddenSpan.innerText = this._form.value;
					let right = this._hiddenSpan.offsetWidth === 0 ? pd : this._hiddenSpan.offsetWidth + pd + 8;
					if (this._suffix) {
						right += this._suffix.offsetWidth;
					}
					this._prefix.style.right = right + "px";
				}
			}
		}

		checkLengthCount() {
			if (this.isLengthCount()) {
				this._lengthCount.querySelector(".current .num").innerText = this._form.value.length;
				// 안드로이드에서 글자수 제한형태의 input에 포커스가 빠지기 전까지 maxlength를 초과해서 입력이 되는 문제 수정
				if (this._form.value.length > this._form.maxLength) {
					this._form.value = this._form.value.slice(0, this._form.maxLength);
				}
			}
		}

		autoSeparator() {
			if (getDataAttribute(this._form, "action") === "autoSeparator" && this.hasValue()) {
				let result = "";
				let str = this._form.value;
				let arrTemp = str.split(".");

				if (str === "-") {
					result = "-";
				} else {
					result += Number(arrTemp[0].replace(/,/g, "")).toLocaleString();

					if (arrTemp.length > 1) {
						result += "." + arrTemp[1];
					}
				}
				this._form.value = result;
			}
		}

		dateFormatter() {
			if (getDataAttribute(this._form, "action") === "dateFormatter" && this.hasValue()) {
				let result = "";
				let str = this._form.value;
				let num = replaceAll(str, ".", "");

				let y = num.substring(0, 4);
				let m = num.substring(4, 6);
				let d = num.substring(6, 8);

				result += y;
				if (m != "") result += ".";
				result += m;
				if (d != "") result += ".";
				result += d;

				this._form.value = result;
			}
		}

		getSelectedOptionText() {
			if (typeof getDataAttribute(this._selectedOption, "label-text") === "string") {
				return getDataAttribute(this._selectedOption, "label-text");
			} else {
				return this._selectedOption.innerText;
			}
		}

		checkSelectOptions() {
			if (this.mode !== "DROPDOWN" && this.mode !== "PHONE-AUTH" && this.mode !== "WITH-SELECT") return;

			this._options = this._select.querySelectorAll("option");
			this._selectedOption = this._select.querySelector("option:checked");
			if (this._selectedOption === null) {
				this.selectedIdx = 0;
				this._selectLabel.innerText = "";
			} else {
				this.selectedIdx = this._selectedOption.index;
				this._selectLabel.innerText = this.getSelectedOptionText();
			}

			let selectOptionList = this._bottomSheet.querySelector(".select-option-list");

			selectOptionList.innerHTML = "";

			Object.values(this._options).map((option, idx) => {
				if (idx > 0) {
					if (this.selectedIdx === idx) {
						appendHtml(selectOptionList, `<li><button type="button" data-idx="${idx}" class="selected" title="선택됨">${option.innerText}</button></li>`);
					} else {
						appendHtml(selectOptionList, `<li><button type="button" data-idx="${idx}">${option.innerText}</button></li>`);
					}
				}
			});

			this._bottomSheet_buttons = this._bottomSheet.querySelectorAll(".select-option-list button");

			Object.values(this._bottomSheet_buttons).map((b) => {
				b.classList.remove("selected");
				b.removeAttribute("title");
			});
			if (this.selectedIdx !== 0) {
				this._bottomSheet_buttons[this.selectedIdx - 1].classList.add("selected");
				this._bottomSheet_buttons[this.selectedIdx - 1].setAttribute("title", "선택됨");
			}

			Object.values(this._bottomSheet_buttons).map((button) => {
				button.addEventListener("click", () => {
					this._selectLabel.innerText = this.getSelectedOptionText();
					this._options[getDataAttribute(button, "idx")].selected = true;
					this.checkSelectOptions();
					this.checkFilled();
					this.bottomSheet.hide();
					// SELECT Change Trigger
					this._select.dispatchEvent(new Event("change"));
					//2024 접근성추가
					this._btnSelect.setAttribute("aria-label",this.getSelectedOptionText())
				});
			});
		}

		checkBtnClear() {
			if (this.hasRightSection() && this._btnClear !== undefined) {
				// .right-section이 있으면 삭제버튼 위치 조정
				this._btnClear.style.marginRight = `${this._element.querySelector(".right-section").clientWidth + 8}px`;
			}
		}

		autoResizeTextarea(e) {
			if (this._form) {
				this._form.style.height = "auto";
				let height = this._form.scrollHeight;
				this._form.style.height = `${height}px`;
			}
		}

		dispose() {
			super.dispose();
		}
	}

	function UIFormsUpdate(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".ui-form");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((formElement) => {
			let instance = UI.UIForm.getInstance(formElement);
			if (instance !== null) {
				instance.update();
			}
		});
		inputAccessibility(); //접근성수정
	}

	function UIFormsApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".ui-form");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		// has-no-input 클래스 추가시 ui-form 기본동작 제외
		let filteredTarget = [...targetElements].filter((el) => !el.classList.contains("has-no-input"));

		Object.values(filteredTarget).map((element) => {
			new UI.UIForm(element);
		});
		inputAccessibility(); //접근성수정
	}

	window.addEventListener("load", () => {
		UIFormsApply();
	});
	/**
	 * --------------------------------------------------
	 * Modal Popup
	 * --------------------------------------------------
	 */

	let modalPopupIdx = 0;
	const modalPopup = (params) => {
		let defaultSettings = {
			title: "",
			message: "알림 메시지",
			type: "alert", // alert , confirm
			textOkButton: "확인",
			textCancelButton: "취소",
			onOk: function () {},
			onCancel: function () {},
		};

		let settings = typeof params === "object" ? { ...defaultSettings, ...params } : defaultSettings;

		modalPopupIdx++;

		let id = "MD" + modalPopupIdx;
		let html = "";

		html += `<div class="modal-popup" id="${id}">`;
		html += `	<div class="modal-popup-container">`;
		html += `		<div class="popup-wrap">`;
		if (settings.title != "") {
			html += `			<div class="popup-header">`;
			html += `				<span class="title">${settings.title}</span>`;
			html += `			</div>`;
		}
		html += `			<div class="popup-body popup-message">`;
		html += `				<p>${settings.message}</p>`;
		html += `			</div>`;
		html += `			<div class="popup-button button-group">`;
		html += `				<div class="button-row">`;
		if (settings.type === "confirm") {
			html += `					<button type="button" class="cancel btn btn-type-4 btn-size-xl"><span class="label">${settings.textCancelButton}</span></button>`;
		}
		html += `					<button type="button" class="ok btn btn-type-1 btn-size-xl"><span class="label">${settings.textOkButton}</span></button>`;
		html += `				</div>`;
		html += `			</div>`;

		html += `		</div>`;
		html += `	</div>`;
		html += `</div>`;

		appendHtml(document.body, html);

		let idSelector = "#" + id;
		let config = {
			onOk: settings.onOk,
			onCancel: settings.onCancel,
			show: true,
			autoDestroy: true,
		};

		new ModalPopup(idSelector, config);
	};

	class ModalPopup extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					onOk: function () {},
					onCancel: function () {},
					show: false,
					autoDestroy: false,
				},
				...(typeof config === "object" ? config : {}),
			};

			this.EVENT_SHOW = `show${this.EVENT_KEY}`;
			this.EVENT_SHOWN = `shown${this.EVENT_KEY}`;
			this.EVENT_HIDE = `hide${this.EVENT_KEY}`;
			this.EVENT_HIDDEN = `hidden${this.EVENT_KEY}`;

			this._isShown = false;
			this._focusReturnElement = null;

			appendHtml(this._element, '<div class="modal-popup-dimm"></div>');

			this._dimm = this._element.querySelector(".modal-popup-dimm");
			this._container = this._element.querySelector(".modal-popup-container");
			this._modal = this._element.querySelector(".popup-wrap");
			this._btnOk = this._element.querySelector(".popup-button .ok");
			this._btnCancel = this._element.querySelector(".popup-button .cancel");
			this._btnX = this._element.querySelector(".button-x");
			this._header = this._element.querySelector(".popup-wrap .popup-header"); // x 버튼 + 타이틀 겹침현상 이슈 관련 추가

			this._eventBind();

			if (this._btnX) {
				// x 버튼 + 타이틀 겹침현상 이슈 관련 추가
				if (this._header) {
					this._header.style.paddingRight = "34px";
				}
			}
			if (this.config.show) {
				// 하드웨어 백버튼 처리변수 - 2022.06.17 TaeHeun Lee
				sessionStorage.setItem("UI.POPUP", "SHOW");

				this.show();
			}
			if (!this._isShown) {
				this._container.style.display = "none";
			}

			// 접근성 수정
			this._firstElement = this.findFirstElement();
			if (this._firstElement !== null) {
				this._firstElement.setAttribute("tabindex", -1);
			}
		}

		static get NAME() {
			return "modalPopup";
		}

		_eventBind() {
			if (this._btnOk !== null) {
				this._btnOk.addEventListener("click", this._clickOk.bind(this));
			}
			if (this._btnCancel !== null) {
				this._btnCancel.addEventListener("click", this._clickCancel.bind(this));
			}
			if (this._btnX !== null) {
				this._btnX.addEventListener("click", this._clickX.bind(this));
			}
		}

		_clickOk(e) {
			// 하드웨어 백버튼 처리변수 - 2022.06.17 TaeHeun Lee
			sessionStorage.removeItem("UI.POPUP");

			this.config.onOk.call(this);
			this.hide();
		}

		_clickCancel(e) {
			// 하드웨어 백버튼 처리변수 - 2022.06.17 TaeHeun Lee
			sessionStorage.removeItem("UI.POPUP");

			this.config.onCancel.call(this);
			this.hide();
		}

		_clickX(e) {
			// 하드웨어 백버튼 처리변수 - 2022.06.17 TaeHeun Lee
			sessionStorage.removeItem("UI.POPUP");

			this.hide();
		}

		toggle() {
			return this._isShown ? this.hide() : this.show();
		}

		show() {
			if (this._isShown) {
				return;
			}
			this._element.dispatchEvent(new CustomEvent(this.EVENT_SHOW));
			this._isShown = true;
			this._dimm.style.display = "block";
			this._container.style.display = "flex";
			this._element.classList.add("show");
			this._modal.classList.add("modal-in");
			setTimeout(() => {
				this._dimm.style.opacity = 1;
			}, 10);
			setTimeout(() => {
				this._element.dispatchEvent(new CustomEvent(this.EVENT_SHOWN));
			}, 300);
			bodyHold(true);

			// 접근성 수정
			setTimeout(() => {
				if (this._firstElement !== null) {
					this._firstElement.focus();
				}
				ariaHiddenActivate(this._element);
				if (window.lastClickElement !== undefined) {
					this._focusReturnElement = window.lastClickElement;
				} else {
					this._focusReturnElement = null;
				}
			}, 100);
		}

		hide() {
			if (!this._isShown) {
				return;
			}
			this._element.dispatchEvent(new CustomEvent(this.EVENT_HIDE));
			this._isShown = false;
			this._modal.classList.add("modal-out");
			this._dimm.style.opacity = 0;
			setTimeout(() => {
				this._dimm.style.display = "none";
				this._container.style.display = "none";
				this._element.classList.remove("show");
				this._modal.classList.remove("modal-in");
				this._modal.classList.remove("modal-out");
				this._element.dispatchEvent(new CustomEvent(this.EVENT_HIDDEN));
				if (this.config.autoDestroy) {
					this.dispose();
				}
			}, 300);
			bodyHold(false);
			// 접근성 수정
			ariaHiddenDeactivate();
			if (this._focusReturnElement !== null) {
				this._focusReturnElement.focus();
			}
		}

		findFirstElement() {
			if (this._container.querySelector(".popup-header > .title") !== null) {
				return this._container.querySelector(".popup-header > .title");
			} else if (this._container.querySelector(".popup-body") !== null) {
				return this._container.querySelector(".popup-body");
			} else {
				return null;
			}
		}

		dispose() {
			this._element.remove();
			super.dispose();
		}
	}

	function modalPopupShow(id) {
		if (UI.ModalPopup.getInstance(`#${id}`) === null) {
			console.log("%cModalPopup 대상이 없습니다.", "color:red;");
		} else {
			UI.ModalPopup.getInstance(`#${id}`).show();
		}
	}

	function modalPopupHide(id) {
		if (UI.ModalPopup.getInstance(`#${id}`) === null) {
			console.log("%cModalPopup 대상이 없습니다.", "color:red;");
		} else {
			UI.ModalPopup.getInstance(`#${id}`).hide();
		}
	}

	/**
	 * --------------------------------------------------
	 * Overflow Menu
	 * --------------------------------------------------
	 */

	class OverflowMenu extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					posL: false,
				},
				...(typeof config === "object" ? config : {}),
			};

			this.EVENT_SHOW = `show${this.EVENT_KEY}`;
			this.EVENT_SHOWN = `shown${this.EVENT_KEY}`;
			this.EVENT_HIDE = `hide${this.EVENT_KEY}`;
			this.EVENT_HIDDEN = `hidden${this.EVENT_KEY}`;

			this._isShown = this._element.classList.contains("is-active") ? true : false;

			this._btnDot = this._element.querySelector(".btn-dot") || this._element.querySelector(".btn-dot-white");
			this._menu = this._element.querySelector(".menu");
			this._btnClose = this._element.querySelector(".btn-close");

			this._eventBind();
		}

		static get NAME() {
			return "OverflowMenu";
		}

		_eventBind() {
			EventHandler.on(this._btnClose, "click", this._clickClose.bind(this));
			EventHandler.on(this._btnDot, "click", this._clickToggle.bind(this));
			// 이벤트 버블링 막기
			EventHandler.on(this._element, "click", (e) => {
				e.stopPropagation();
			});
		}

		_clickToggle(e) {
			// 이전에 열려있던 메뉴가 있으면 닫기
			if (document.querySelectorAll(".ui-overflow-menu.initiated.is-active") !== null) {
				Object.values(document.querySelectorAll(".ui-overflow-menu.initiated.is-active")).map((obj) => {
					if (obj != this._element) {
						obj.classList.remove("is-active");
					}
				});
			}
			this._element.classList.toggle("is-active");
			// this._menu가 열렸을 때 하단이 가려지는 경우 페이지 스크롤 처리
			if (this._element.classList.contains("is-active")) {
				document.getElementById("wrap").style.overflow = "hidden";
				const a = getCoords(this._menu).top;
				const b = window.scrollY;
				const c = this._menu.clientHeight;
				const d = document.querySelector(".sticky-button.button-group") == null ? 0 : document.querySelector(".sticky-button.button-group").clientHeight;
				const e = document.body.clientHeight;
				const f = document.body.scrollHeight;
				// console.log('a', a, '메뉴의 상단 위치');
				// console.log('b', b, '윈도우 스크롤 위치');
				// console.log('c', c, '메뉴의 높이');
				// console.log('d', d, '스티키버튼 높이');
				// console.log('e', e, '화면 높이');
				// console.log('f', f, '페이지 높이');
				// console.log('f - d', f - d, '페이지 높이 - 스티키버튼 높이');
				// console.log('a + c', a + c, '메뉴의 하단 위치');
				if (f - d < a + c) {
					// console.log('아래 잘린다', (a + c) - (f - d));
					this._menu.style.transform = `translateY(-${a + c - (f - d)}px)`;
				}
				document.getElementById("wrap").style.overflow = "";
				if (e - d < a - b + c) {
					pageScrollTo(this._element);
				}
			}
		}
		_clickClose(e) {
			this._element.classList.remove("is-active");
		}

		checkPos() {
			this.config.posL = this._element.classList.contains("pos-l") ? true : false;
		}

		dispose() {
			super.dispose();
		}
	}

	function OverflowMenuApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".ui-overflow-menu");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.OverflowMenu(element);
		});
	}

	window.addEventListener("load", () => {
		OverflowMenuApply();
	});
	/**
	 * --------------------------------------------------
	 * Propensity Analysis
	 * --------------------------------------------------
	 */

	class PropensityAnalysis extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this._qitems = this._element.querySelectorAll(".q-item");
			this._triggers = this._element.querySelectorAll(".q-trigger");
			this._inputs = this._element.querySelectorAll('.q-content input[type="radio"], .q-content input[type="checkbox"]');
			this._nextBtns = this._element.querySelectorAll('button[data-action="next"]');
			this.buttonId = getDataAttribute(this._element, "button-id");
			this.mode = getDataAttribute(this._element, "mode");

			this.eventBind();
			this.checkAllAnswered();
			this.update();
		}

		static get NAME() {
			return "propensityAnalysis";
		}

		update() {
			Object.values(this._qitems).map((qitem) => {
				if (qitem.classList.contains("closed")) {
					this.qItemClose(qitem);
				} else {
					this.qItemOpen(qitem);
				}
			});
		}

		eventBind() {
			Object.values(this._triggers).map((trigger) => {
				EventHandler.on(trigger, "click", this.triggerClick.bind(this));
			});
			Object.values(this._inputs).map((input) => {
				EventHandler.on(input, "click", this.inputClick.bind(this));
			});
			Object.values(this._nextBtns).map((btn) => {
				EventHandler.on(btn, "click", this.nextClick.bind(this));
			});
		}

		triggerClick(e) {
			const trigger = e.target;
			const qitem = getParentsByClassName(trigger, "q-item");

			this.qItemToggle(qitem);
		}

		inputClick(e) {
			if (this.mode === "readonly") {
				e.preventDefault();
				return;
			}

			const input = e.target;
			const qitem = getParentsByClassName(input, "q-item");
			const inputs = qitem.querySelectorAll('.q-content input[type="radio"], .q-content input[type="checkbox"]');
			const checkedInputs = qitem.querySelectorAll('.q-content input[type="radio"]:checked, .q-content input[type="checkbox"]:checked');
			const nextBtn = qitem.querySelector('button[data-action="next"]');

			if (input.getAttribute("type") == "radio") {
				this.qItemClose(qitem);

				let idx = null;
				Object.values(this._triggers).map((trigger, i) => {
					if (qitem == getParentsByClassName(trigger, "q-item")) {
						idx = i + 1;
					}
				});

				this.qItemNext(idx);
			} else if (input.getAttribute("type") == "checkbox") {
				if (qitem.classList.contains("closed") == true) {
					this.qItemToggle(qitem);
				} else if (nextBtn !== null) {
					if (checkedInputs.length > 0) {
						nextBtn.disabled = false;
					} else {
						nextBtn.disabled = true;
					}
				}
			}
			this.checkAllAnswered();
		}
		nextClick(e) {
			const button = e.target;
			const qitem = getParentsByClassName(button, "q-item");
			const tmp = qitem.querySelectorAll('.q-content input[type="radio"]:checked, .q-content input[type="checkbox"]:checked');

			this.qItemClose(qitem);

			let idx = null;
			Object.values(this._triggers).map((trigger, i) => {
				if (qitem == getParentsByClassName(trigger, "q-item")) {
					idx = i + 1;
				}
			});

			this.qItemNext(idx);
		}

		qItemNext(idx) {
			if (this._qitems.length - 1 >= idx) {
				if (window.getComputedStyle(this._qitems[idx]).display != "none") {
					pageScrollTo(this._qitems[idx]);
					this.qItemOpen(this._qitems[idx]); //220620:다음 질문만 열기
				} else {
					this.qItemNext(idx + 1);
				}
			}
		}

		qItemClose(qitem) {
			let li;
			qitem.classList.add("closed");
			const inputs = this.getInputs(qitem);
			qitem.querySelector(".q-subject").setAttribute("aria-expanded","false");  //접근성추가
			Object.values(inputs).map((input) => {
				if (!input.checked) {
					li = getParentsByTagName(input, "li");
					li.style.display = "none";
				}
			});
		}

		qItemOpen(qitem) {
			let li;
			qitem.classList.remove("closed");
			const inputs = this.getInputs(qitem);
			qitem.querySelector(".q-subject").setAttribute("aria-expanded","true");  //접근성추가
			Object.values(inputs).map((input) => {
				li = getParentsByTagName(input, "li");
				li.style.display = "block";
			});
		}

		qItemToggle(qitem) {
			if (qitem.classList.contains("closed")) {
				this.qItemOpen(qitem);
			} else {
				this.qItemClose(qitem);
			}
		}

		getInputs(elem) {
			return elem.querySelectorAll('.q-content input[type="radio"], .q-content input[type="checkbox"]');
		}

		checkAllAnswered() {
			let unAnsweredCount = 0;
			let button = document.getElementById(this.buttonId);
			Object.values(this._qitems).map((qitem) => {
				let style = window.getComputedStyle(qitem);
				if (style.display != "none") {
					let tmp = qitem.querySelectorAll('.q-content input[type="radio"]:checked, .q-content input[type="checkbox"]:checked');
					if (tmp.length === 0) {
						unAnsweredCount++;
					}
				}
			});
			if (button !== null) {
				if (unAnsweredCount === 0) {
					button.removeAttribute("disabled");
				} else {
					button.setAttribute("disabled", "");
				}
			}
		}

		dispose() {
			super.dispose();
		}
	}

	function PropensityAnalysisApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".propensity-analysis");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.PropensityAnalysis(element);
		});
	}

	window.addEventListener("load", () => {
		PropensityAnalysisApply();
	});
	/**
	 * --------------------------------------------------
	 * ScrollPicker
	 * --------------------------------------------------
	 */

	class ScrollPicker extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					activeIndex: [],
					on: {
						slideChange: function () {},
					},
				},
				...(typeof config === "object" ? config : {}),
			};

			this.init();
		}

		static get NAME() {
			return "scrollPicker";
		}

		init() {
			this.id = this._element.id;
			this.data = this.config.data;
			this.activeIndex = this.config.activeIndex;
			this.pickerCount = this.data.length;
			this.swiper = {
				back: [],
				front: [],
			};

			if (this.activeIndex.length === 0) {
				for (let a = 0; a < this.pickerCount; a++) {
					this.activeIndex.push(0);
				}
			}

			this.createHtml();
			this.data.map((data, idx) => {
				this.createPickers(data, idx);
			});
		}

		createHtml() {
			appendHtml(this._element, '<div class="scroll-picker-container"></div>');
			this._pickerContainer = this._element.querySelector(".scroll-picker-container");
			for (let i = 0; i < this.pickerCount; i++) {
				appendHtml(
					this._pickerContainer,
					'<div class="scroll-picker-panel"><div class="scroll-picker-back"></div><div class="scroll-picker-front"></div><div class="scroll-picker-block"></div></div>'
				);
			}
			this._pickerPanels = this._element.querySelectorAll(".scroll-picker-panel");
		}

		removeHtml() {
			this._element.innerHTML = "";
		}

		createPickers(data, idx) {
			this.createPicker(data, idx, "back", this.activeIndex[idx]);
			this.createPicker(data, idx, "front", this.activeIndex[idx]);
			this.swiper["front"][idx].controller.control = this.swiper["back"][idx];
			this.swiper["back"][idx].controller.control = this.swiper["front"][idx];
		}

		changePickers(data, idx) {
			this.createPicker(data, idx, "back");
			this.createPicker(data, idx, "front");
			this.swiper["front"][idx].controller.control = this.swiper["back"][idx];
			this.swiper["back"][idx].controller.control = this.swiper["front"][idx];
		}

		createPicker(data, idx, bf, activeIndex) {
			let active = activeIndex || 0;
			removeAllChildNodes(this._pickerPanels[idx].querySelector(`.scroll-picker-${bf}`));
			this._pickerPanels[idx].querySelector(`.scroll-picker-${bf}`).appendChild(this.newSwiper(data, idx, bf));

			this.swiper[bf][idx] = new Swiper(`#${this.id}-swiper-${idx}-${bf}`, {
				direction: "vertical",
				freeMode: {
					enabled: true,
					sticky: true,
				},
				slidesPerView: 3,
				centeredSlides: true,
				slideToClickedSlide:true,
				on:{
					init:function(){
						setAria();
					},
					transitionEnd:function(){
						setAria();
					}
				}
			});
			//20240603 접근성추가
			function setAria(){
				var slides = document.querySelectorAll(".swiper-slide");
				slides.forEach(function(slide){
					slide.setAttribute("role","button");
					slide.setAttribute("aria-label", slide.textContent);
					if(slide.classList.contains("swiper-slide-active")){
						slide.removeAttribute("aria-readonly");
						slide.setAttribute("title","선택됨")
					}else{
						slide.setAttribute("aria-readonly",true);
						slide.removeAttribute("title");
					}
				});
			}
			
			this.swiper[bf][idx].activeIndex = active;
			if (bf == "front") {
				this.swiper[bf][idx].on("slideChange", (swiper) => {
					this.config.on.slideChange(idx, swiper.activeIndex, swiper.slides[swiper.activeIndex].innerText, swiper);
				});
			}
		}

		newSwiper(data, idx, bf) {
			const swiper = document.createElement("div");
			const wrapper = document.createElement("div");
			swiper.id = `${this.id}-swiper-${idx}-${bf}`;
			swiper.classList.add("swiper");
			swiper.classList.add(bf);
			wrapper.classList.add("swiper-wrapper");

			data.map((item) => {
				const slide = document.createElement("div");
				slide.classList.add("swiper-slide");
				slide.innerText = item;
				wrapper.appendChild(slide);
			});

			swiper.appendChild(wrapper);

			return swiper;
		}

		getActiveIndex() {
			let returnValue = [];

			for (let i = 0; i < this.pickerCount; i++) {
				returnValue.push(this.swiper.front[i].activeIndex);
			}

			return returnValue;
		}

		getActiveText() {
			let returnValue = [];

			for (let i = 0; i < this.pickerCount; i++) {
				let swiper = this.swiper.front[i];
				returnValue.push(swiper.slides[swiper.activeIndex].innerText);
			}

			return returnValue;
		}

		getActiveValue() {
			let returnValue = [];

			for (let i = 0; i < this.pickerCount; i++) {
				let swiper = this.swiper.front[i];
				returnValue.push({
					index: swiper.activeIndex,
					text: swiper.slides[swiper.activeIndex].innerText,
				});
			}

			return returnValue;
		}

		setActiveIndex(val) {
			let array = [];
			if (typeof val === "number") {
				array.push(val);
			} else if (typeof val === "object") {
				array = val;
			} else {
				console.log("val is invalid");
				return;
			}
			for (let idx = 0; idx < array.length; idx++) {
				this.swiper["front"][idx].slideTo(array[idx], 0);
			}
		}

		changeOption(config) {
			this.config = {
				...{
					activeIndex: [],
					on: {
						slideChange: function () {},
					},
				},
				...(typeof config === "object" ? config : {}),
			};
			this.removeHtml();
			this.init();
		}

		update() {
			for (var b = 0; b < this.swiper["back"].length; b++) {
				this.swiper["back"][b].update();
			}
			for (var f = 0; f < this.swiper["front"].length; f++) {
				this.swiper["front"][f].update();
			}
		}

		dispose() {
			super.dispose();
		}
	}

	function ScrollPickerApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll("#SPBS");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.ScrollPicker(element);
		});
	}

	window.addEventListener("load", () => {
		// ScrollPickerApply();
	});
	/**
	 * --------------------------------------------------
	 * Slider & MultiSlider
	 * --------------------------------------------------
	 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
	 * https://github.com/components/jqueryui/blob/master/ui/widgets/slider.js
	 */

	class Slider extends BaseComponent {
		constructor(element, config) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.config = {
				...{
					orientation: "horizontal", // horizontal, vertical
					min: 0,
					max: 100,
					step: 1,
					value: 0,
					range: false,
					values: null,
					unit: "",
					showMinMax: false,
					showTooltip: false,
					linkedFormID: null,
					valueArray: null,

					// Callbacks
					change: null,
					slide: null,
					start: null,
					stop: null,
				},
				...(typeof config === "object" ? config : {}),
			};

			this.numPages = 10;

			this.init();

			this.EVENT_CHANGE = `change${this.EVENT_KEY}`;

			this.keys = {
				pgup: 33,
				pgdn: 34,
				end: 35,
				home: 36,
				left: 37,
				up: 38,
				right: 39,
				down: 40,
			};
		}

		static get NAME() {
			return "slider";
		}

		init() {
			if (this.hasValueArray()) {
				this.config.step = 1;
				this.config.min = 0;
				this.config.max = this.config.valueArray.length - 1;
			}
			this.detectOrientation();
			this.calculateNewMax();

			if (this.isRange()) {
				if (this.config.values === null) {
					this.config.values = [this.valueMin(), this.valueMax()];
				}
			} else {
				if (this.config.values === null) {
					this.config.values = [this.value()];
				}
			}
			this._linkedForm = document.querySelector(`#${this.config.linkedFormID}`);

			this.createHtml();
			this.eventBind();
			this.update();
		}

		createHtml() {
			// add class
			this._element.classList.add("ui-slider");
			if (this.isRange()) {
				this._element.classList.add("multi-slider");
			}
			if (this.orientation === "vertical") {
				this._element.classList.add("vertical-slider");
			}

			// append container
			appendHtml(this._element, '<div class="slider-container"></div>');
			this._container = this._element.querySelector(".slider-container");

			// append track bar
			appendHtml(this._container, '<div class="slider-track-bar"></div>');

			// append handle
			if (this.isRange()) {
				appendHtml(
					this._container,
					`<div class="slider-handle start" tabindex="0" role="slider" aria-valuemin="${this.valueMin()}" aria-valuemax="${this.config.values[1]}" aria-valuenow="${
						this.config.values[0]
					}"></div>`
				);
				appendHtml(
					this._container,
					`<div class="slider-handle end" tabindex="0" role="slider" aria-valuemin="${this.config.values[0]}" aria-valuemax="${this.valueMax()}" aria-valuenow="${
						this.config.values[1]
					}"></div>`
				);
			} else {
				appendHtml(
					this._container,
					`<div class="slider-handle" tabindex="0" role="slider" aria-valuemin="${this.valueMin()}" aria-valuemax="${this.valueMax()}" aria-valuenow="${this.config.value}"></div>`
				);
			}
			this.handles = this._container.querySelectorAll(".slider-handle");

			// append min max
			if (this.config.showMinMax) {
				if (!this.hasValueArray()) {
					appendHtml(
						this._element,
						`<div class="slider-labels"><span class="min">${amountFormat(this.valueMin()) + this.config.unit}</span><span class="max">${
							amountFormat(this.valueMax()) + this.config.unit
						}</span></div>`
					);
				} else {
					appendHtml(
						this._element,
						`<div class="slider-labels"><span class="min">${this.config.valueArray[this.valueMin()] + this.config.unit}</span><span class="max">${
							this.config.valueArray[this.valueMax()] + this.config.unit
						}</span></div>`
					);
				}
			}

			// append tooltip
			if (this.config.showTooltip) {
				this._element.classList.add("has-tooltip");
				appendHtml(this._element, `<div class="slider-tooltip">${this.value()}</div>`);
				this.tooltip = this._element.querySelector(".slider-tooltip");
			}
		}

		eventBind() {
			EventHandler.on(this._element, "slide", this.eventSlide.bind(this));
			EventHandler.on(this._element, "stop", this.eventStop.bind(this));
			Object.values(this.handles).map((handle) => {
				EventHandler.on(handle, "keydown", this.handleKeydown.bind(this));
				EventHandler.on(handle, "touchstart", this.handleTouchstart.bind(this));
				EventHandler.on(handle, "touchend", this.handleTouchend.bind(this));
				EventHandler.on(handle, "touchmove", this.handleTouchmove.bind(this));
			});
			if (this._linkedForm) {
				EventHandler.on(this._linkedForm, "change", () => {
					let changedValue = parseFloat(replaceAll(this._linkedForm.value, ",", ""));
					this.value(changedValue);
				});
			}
		}

		update() {
			this.updateValue();
		}

		detectOrientation() {
			this.orientation = this.config.orientation;
		}

		calculateNewMax() {
			let max = this.config.max;
			let min = this.valueMin();
			let step = this.config.step;
			let aboveMin = Math.round((max - min) / step) * step;
			max = aboveMin + min;
			if (max > this.config.max) {
				max -= step;
			}
			this.max = parseFloat(max.toFixed(this.precision()));
		}

		precision() {
			let precision = this.precisionOf(this.config.step);
			if (this.valueMin() !== null) {
				precision = Math.max(precision, this.precisionOf(this.valueMin()));
			}
			return precision;
		}

		precisionOf(num) {
			let str = num.toString();
			let decimal = str.indexOf(".");
			return decimal === -1 ? 0 : str.length - decimal - 1;
		}

		eventSlide(e) {
			if (this.config.slide !== null) {
				this.config.slide(e, {
					handle: this.handles[e.detail.index],
					handleIndex: e.detail.index,
					value: e.detail.value,
					values: [e.detail.values[0], e.detail.values[1]],
				});
			}
		}

		eventStop(e) {
			if (this.config.stop !== null) {
				this.config.stop(e, {
					handle: this.handles[e.detail.index],
					handleIndex: e.detail.index,
					value: e.detail.value,
					values: [e.detail.values[0], e.detail.values[1]],
				});
			}
		}

		handleKeydown(e) {
			const key = e.keyCode;
			let curVal,
				newVal,
				step = this.config.step;

			let index = e.target.classList.contains("end") ? 1 : 0;

			if (this.isRange()) {
				curVal = newVal = this.values(index);
			} else {
				curVal = newVal = this.value();
			}

			switch (key) {
				case this.keys.right:
				case this.keys.up:
				case this.keys.left:
				case this.keys.down:
				case this.keys.pgup:
				case this.keys.pgdn:
				case this.keys.home:
				case this.keys.end:
					e.preventDefault();
					break;
			}

			switch (key) {
				case this.keys.right:
				case this.keys.up:
					if (curVal === this.valueMax()) {
						return;
					}
					newVal = this.trimAlignValue(curVal + step);
					break;
				case this.keys.left:
				case this.keys.down:
					if (curVal === this.valueMin()) {
						return;
					}
					newVal = this.trimAlignValue(curVal - step);
					break;
				case this.keys.pgup:
					newVal = this.trimAlignValue(curVal + (this.valueMax() - this.valueMin()) / this.numPages);
					break;
				case this.keys.pgdn:
					newVal = this.trimAlignValue(curVal - (this.valueMax() - this.valueMin()) / this.numPages);
					break;
				case this.keys.home:
					if (curVal === this.valueMin()) {
						return;
					}
					newVal = this.valueMin();
					break;
				case this.keys.end:
					if (curVal === this.valueMax()) {
						return;
					}
					newVal = this.valueMax();
					break;
			}
			this.slide(e, index, newVal);
		}

		handleTouchstart(e) {
			this.elementSize = {
				width: this._element.clientWidth,
				height: this._element.clientHeight,
			};
			this.elementOffset = getCoords(this._element);
			e.target.classList.add("pressed");
			Object.values(this.handles).map((handle) => {
				handle.classList.remove("last");
			});
			e.target.classList.add("last");
			if (e.cancelable) {
				e.preventDefault();
				e.stopPropagation();
			}
		}

		handleTouchend(e) {
			e.target.classList.remove("pressed");
			let index = e.target.classList.contains("start") ? 0 : 1;
			this._element.dispatchEvent(
				new CustomEvent("stop", {
					detail: {
						index: index,
						value: this.values()[index],
						values: this.values(),
					},
				})
			);

			return false;
		}

		handleTouchmove(e) {
			let position = { x: e.touches[0].pageX, y: e.touches[0].pageY };
			let normValue = this.normValueFromTouch(position);
			let index = e.target.classList.contains("end") ? 1 : 0;

			this.slide(e, index, normValue);
			return false;
		}

		normValueFromTouch(position) {
			let pixelTotal, pixelTouch, percentTouch, valueTotal, valueTouch;

			if (this.orientation === "horizontal") {
				pixelTotal = this.elementSize.width;
				pixelTouch = position.x - this.elementOffset.left;
			} else {
				pixelTotal = this.elementSize.height;
				pixelTouch = position.y - this.elementOffset.top;
			}

			percentTouch = pixelTouch / pixelTotal;

			if (percentTouch > 1) percentTouch = 1;
			if (percentTouch < 0) percentTouch = 0;

			if (this.orientation === "vertical") {
				percentTouch = 1 - percentTouch;
			}

			valueTotal = this.valueMax() - this.valueMin();
			valueTouch = this.valueMin() + percentTouch * valueTotal;

			return this.trimAlignValue(valueTouch);
		}

		slide(e, index, newVal) {
			let otherVal;
			let currentValue = this.value();
			let newValues = this.values();

			if (this.isRange()) {
				otherVal = this.values(index ? 0 : 1);
				currentValue = this.values(index);

				if (this.config.values.length === 2 && this.config.range === true) {
					newVal = index === 0 ? Math.min(otherVal, newVal) : Math.max(otherVal, newVal);
				}

				newValues[index] = newVal;
			}

			if (newVal === currentValue) return;

			if (this.isRange()) {
				this.values(index, newVal);
				this._element.dispatchEvent(
					new CustomEvent(this.EVENT_CHANGE, {
						detail: {
							val: newVal,
							vals: this.values(),
						},
					})
				);
			} else {
				this.value(newVal);
				this._element.dispatchEvent(
					new CustomEvent(this.EVENT_CHANGE, {
						detail: {
							val: newVal,
						},
					})
				);
			}

			this._element.dispatchEvent(
				new CustomEvent("slide", {
					detail: {
						index: index,
						value: newVal,
						values: this.values(),
					},
				})
			);
		}

		isRange() {
			return this.config.range === true;
		}

		hasValueArray() {
			return Array.isArray(this.config.valueArray);
		}

		value(newValue) {
			if (arguments.length) {
				this.config.value = this.trimAlignValue(newValue);
				this.updateValue();
				return;
			}

			return this.trimAlignValue(this.config.value);
		}

		values(index, newValue) {
			let vals, newValues, i;

			if (arguments.length > 1) {
				this.config.values[index] = this.trimAlignValue(newValue);
				this.updateValue();
				return;
			}

			if (arguments.length) {
				if (Array.isArray(arguments[0])) {
					vals = this.config.values;
					newValues = arguments[0];
					for (i = 0; i < vals.length; i++) {
						vals[i] = this.trimAlignValue(newValues[i]);
					}
					this.updateValue();
				} else {
					if (this.isRange()) {
						return this.config.values[index];
					} else {
						return this.value();
					}
				}
			} else {
				return this.config.values;
			}
		}

		setValues(values) {
			this.values(0, values[0]);
			this.values(1, values[1]);
		}

		valueMin() {
			return this.config.min;
		}

		valueMax() {
			return this.max;
		}

		updateValue() {
			let valPercent, value, valueMin, valueMax;

			if (this.isRange()) {
				Object.values(this.handles).map((handle, i) => {
					value = this.values(i);
					valPercent = ((value - this.valueMin()) / (this.valueMax() - this.valueMin())) * 100;
					if (i === 0) {
						this._element.style.setProperty("--fill-start-percent", `${valPercent}%`);
						setAriaAttribute(this.handles[1], "valuemin", value);
					}
					if (i === 1) {
						this._element.style.setProperty("--fill-end-percent", `${valPercent}%`);
						setAriaAttribute(this.handles[0], "valuemax", value);
					}
					setAriaAttribute(handle, "valuenow", value);
				});
			} else {
				value = this.value();
				valueMin = this.valueMin();
				valueMax = this.valueMax();
				valPercent = valueMax !== valueMin ? ((value - valueMin) / (valueMax - valueMin)) * 100 : 0;

				this._element.style.setProperty("--fill-percent", `${valPercent}%`);
				setAriaAttribute(this.handles[0], "valuenow", value);

				this._element.style.setProperty("--fill-percent-min", `${(valueMin / valueMax) * 100}%`);
			}

			if (this.config.showTooltip) {
				if (!this.hasValueArray()) {
					this.tooltip.innerText = amountFormat(this.value()) + this.config.unit;
				} else {
					this.tooltip.innerText = this.config.valueArray[this.value()] + this.config.unit;
				}
			}

			if (this._linkedForm !== null) {
				this._linkedForm.value = this.value();
				let uiForm = getParentsByClassName(this._linkedForm, "ui-form");
				let uiFormInstance = null;
				if (uiForm !== null) {
					if (UI.UIForm.getInstance("#testForm") == null) {
						setTimeout(() => {
							uiFormInstance = UI.UIForm.getInstance("#testForm");
							uiFormInstance.update();
						}, 500);
					} else {
						uiFormInstance = UI.UIForm.getInstance("#testForm");
						uiFormInstance.update();
					}
				}
			}
		}

		trimAlignValue(val) {
			if (val <= this.valueMin()) {
				return this.valueMin();
			}
			if (val >= this.valueMax()) {
				return this.valueMax();
			}
			let step = this.config.step > 0 ? this.config.step : 1,
				valModStep = (val - this.valueMin()) % step,
				alignValue = val - valModStep;

			if (Math.abs(valModStep) * 2 >= step) {
				alignValue += valModStep > 0 ? step : -step;
			}

			return parseFloat(alignValue.toFixed(5));
		}
	}

	function SliderApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".ui-slider:not(.multi-slider):not(.ui-widget)");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.Slider(element);
		});
	}

	window.addEventListener("load", () => {
		// SliderApply();
	});

	/**
	 * --------------------------------------------------
	 * Swiper
	 * --------------------------------------------------
	 */

	class UISwiper extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			let options = getDataAttribute(this._element, "swiper-options");
			if (typeof options === "string") {
				options = window[options];
			}

			this.options = {
				...{
					pagination: {
						el: ".swiper-pagination",
						clickable: "true",
					},
					// navigation: {
					// 	nextEl: '.swiper-button-next',
					// 	prevEl: '.swiper-button-prev',
					// },
					scrollbar: {
						el: ".swiper-scrollbar",
					},
					a11y: {
						prevSlideMessage: "이전 슬라이드",
						nextSlideMessage: "다음 슬라이드",
						slideLabelMessage: "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
					},
					on: {
						slideChangeTransitionEnd: function (swiper) {
							let swiperSlide = swiper.$wrapperEl[0].querySelectorAll(".swiper-slide");
							let swiperSlideActive = swiper.$wrapperEl[0].querySelectorAll(".swiper-slide-active");
							if (swiperSlide !== null) {
								swiperSlide.forEach((element) => {
									element.setAttribute("aria-hidden", "true");
								});
							}
							if (swiperSlideActive !== null) {
								swiperSlideActive.forEach((element) => {
									element.removeAttribute("aria-hidden");
								});
							}
						},
						//접근성2차
						init:function(swiper){
							setPageNum(this);
						},
						slideChangeTransitionStart:function(swiper){
							setPageNum(this);
						}
					},
				},
				...(typeof options === "object" ? options : {}),
			};

			if (this._element.querySelectorAll(".swiper-slide").length <= 1 && this._element.querySelector(".autoplay-control-wrap") !== null) {
				delete this.options.loop;
				delete this.options.autoplay;
				this._element.querySelector(".autoplay-control-wrap").setAttribute("hidden", "hidden");
			}

			this.instanceName = getDataAttribute(this._element, "swiper-instance");
			this.id = `swiper-${generateRandomCode(4)}`;
			this._element.id = this.id;

			this.swiperInit();
		}

		static get NAME() {
			return "uiSwiper";
		}

		swiperInit() {
			this.swiper = new Swiper(`#${this.id}`, this.options);

			// 접근성 수정
			Object.values(this._element.querySelectorAll(".swiper-wrapper")).map((obj) => {
				obj.removeAttribute("aria-live");
			});
			Object.values(this._element.querySelectorAll(".swiper-slide")).map((obj) => {
				obj.removeAttribute("role");
			});

			if (typeof this.instanceName === "string") {
				window[this.instanceName] = this.swiper;
			}

			this.swiper.on("destroy", () => {
				this.dispose();
			});

			if (this.options.autoplay) {
				(() => {
					const thisSlide = this;
					const autoPlayBtn = this._element.querySelector(".autoplay-control-wrap > button");
					const pagination = this._element.querySelector(".swiper-pagination");
					const paginationDot = pagination.querySelectorAll(".swiper-pagination .swiper-pagination-bullet");

					if (autoPlayBtn === null) return;

					autoPlayBtn.setAttribute("aria-label", "정지");
					autoPlayBtn.removeAttribute("aria-pressed");
					autoPlayBtn.setAttribute("data-aria-autoplay", "true");

					autoPlayBtn.addEventListener("click", (e) => {
						let autoPlayState = autoPlayBtn.getAttribute("data-aria-autoplay");
						// let autoPlayState = autoPlayBtn.getAttribute('aria-pressed');
						// if (autoPlayState === 'false') {
						if (autoPlayState === "true") {
							// autoPlayBtn.setAttribute("aria-pressed", "true");
							autoPlayBtn.removeAttribute("aria-pressed");
							autoPlayBtn.setAttribute("aria-label", "재생");
							autoPlayBtn.setAttribute("data-aria-autoplay", "false");
							thisSlide.swiper.autoplay.stop();

							// } else if (autoPlayState === 'true') {
						} else if (autoPlayState === "false") {
							//autoPlayBtn.setAttribute("aria-pressed", "false");
							autoPlayBtn.setAttribute("aria-label", "정지");
							autoPlayBtn.setAttribute("data-aria-autoplay", "true");
							thisSlide.swiper.autoplay.start();
						}
						//console.log(autoPlayState)
					});
					if (paginationDot.length > 1) {
						pagination.style.paddingRight = "22px";
						pagination.style.boxSizing = "border-box";
						const temp = (pagination.clientWidth - 24) / 2 + (paginationDot.length * 16 + 14) / 2;
						autoPlayBtn.style.left = temp + "px";
					}
				})();
			}
		}

		dispose() {
			super.dispose();
		}
	}

	//접근성2차 추가
	function setPageNum(swiper){
		const pagination = swiper.el.querySelector(".swiper-pagination");
		if(pagination){
			if(pagination.classList.contains("swiper-pagination-fraction")){
				var nowNum = swiper.realIndex + 1;
				if(swiper.params.loop){
					var loopNum = swiper.loopedSlides * 2;
				}else{
					var loopNum = 0;
				}
				var totalNum = swiper.slides.length - loopNum;
				pagination.setAttribute("role","img");
				pagination.setAttribute("aria-label", "총 "+totalNum+"개중 "+nowNum+"번째");
			}
		}
	}

	function UISwiperApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".js-swiper");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.UISwiper(element);
		});
	}

	window.addEventListener("load", () => {
		UISwiperApply();
	});
	/**
	 * --------------------------------------------------
	 * Tabs
	 * --------------------------------------------------
	 */

	class Tabs extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.keys = {
				end: 35,
				home: 36,
				left: 37,
				up: 38,
				right: 39,
				down: 40,
				enter: 13,
				space: 32,
			};
			this.direction = {
				37: -1,
				38: -1,
				39: 1,
				40: 1,
			};

			this.manualActivation = false; // enter를 눌러야 탭이 선택되는지 여부

			this._tablist = this._element.querySelector(':scope > [role="tablist"]');
			this._tabs = this._tablist.querySelectorAll(':scope > [role="tab"]');
			this._panels = this._element.querySelectorAll(':scope > [role="tabpanel"]');
			this._toggleBtn = this._element.querySelector(".btns .toggle");

			this.update();
			this._eventBind();
		}

		static get NAME() {
			return "tabs";
		}

		update() {
			Object.values(this._tabs).map((tab) => {
				if (!tab.classList.contains("active")) {
					tab.setAttribute("tabindex", "-1");
					setAriaAttribute(tab, "selected", "false");
					tab.removeAttribute("title");
				} else {
					tab.removeAttribute("tabindex");
					setAriaAttribute(tab, "selected", "true");
					tab.setAttribute("title", "선택됨");
					this._element.style.setProperty("--active-x", tab.offsetLeft + "px");
					this._element.style.setProperty("--active-w", tab.clientWidth + "px");

					let text = tab.innerHTML;
					tab.innerHTML = `<span>${text}</span>`;
					let textsize = tab.querySelector("span").offsetWidth;
					let textleft = tab.offsetLeft + tab.clientWidth / 2 - textsize / 2;
					tab.innerHTML = text;
					this._element.style.setProperty("--active-bar-x", textleft + "px");
					this._element.style.setProperty("--active-bar-w", textsize + "px");
				}
			});
			if (this._element.classList.contains("toggle-tabs")) {
				let saveStartX = this._tablist.scrollLeft;
				if (this._toggleBtn !== null) {
					this._element.classList.add("extended-test");
					if (this._tablist.clientHeight < 50) {
						this._toggleBtn.style.display = "none";
					} else {
						this._toggleBtn.style.display = "block";
					}
					this._element.classList.remove("extended-test");
				}
				if (!this._element.classList.contains("extended")) {
					this._activeTab = this.getActiveTab;
					if (this._activeTab !== undefined) {
						this.activeScroll(saveStartX, this._activeTab.offsetLeft);
					}
				}
			}
		}

		activeScroll(sx, ex) {
			let startX = sx;
			let endX = ex;
			let ttl = 30;
			let tick = 0;
			let progress = 0;

			let loop = () => {
				tick++;
				progress = 1 - (ttl - tick) / ttl;
				let x = startX - (startX - endX) * easeInOutCirc(progress);
				this._tablist.scrollLeft = x;
				if (tick < ttl) {
					requestAnimationFrame(loop);
				}
			};
			loop();
		}

		get getActiveTab() {
			let returnValue;
			this._tabs.forEach(function (tab) {
				if (tab.classList.contains("active")) {
					returnValue = tab;
				}
			});
			return returnValue;
		}

		_eventBind() {
			Object.values(this._tabs).map((tab) => {
				EventHandler.on(tab, "click", this._tabClick.bind(this, tab));
				EventHandler.on(tab, "keydown", (e) => {
					this._tabKeydown(e, tab);
				});
				EventHandler.on(tab, "keyup", (e) => {
					this._tabKeyup(e, tab);
				});
			});
			if (this._toggleBtn !== null) {
				EventHandler.on(this._toggleBtn, "click", () => {
					if (this._element.classList.contains("extended")) {
						this._element.classList.remove("extended");
					} else {
						this._element.classList.add("extended");
					}
				});
			}
		}

		_tabClick(tab) {
			this.activateTab(tab, false);
		}

		_tabKeydown(e, tab) {
			const key = e.keyCode;

			switch (key) {
				case this.keys.end:
					e.preventDefault();
					this.focusLastTab();
					break;
				case this.keys.home:
					e.preventDefault();
					this.focusFirstTab();
					break;
				case this.keys.up:
				case this.keys.down:
					this.determineOrientation(e);
					break;
			}
		}

		_tabKeyup(e, tab) {
			const key = e.keyCode;

			switch (key) {
				case this.keys.left:
				case this.keys.right:
					this.determineOrientation(e);
					break;
			}
		}

		_focus(e) {
			const target = e.target;
			if (target === document.activeElement) {
				this.activateTab(target, false);
			}
		}

		determineOrientation(e) {
			const key = e.keyCode;
			const vertical = this._tablist.getAttribute("aria-orientation") === "vertical";
			let proceed = false;

			if (vertical) {
				if (key === this.keys.up || key === this.keys.down) {
					e.preventDefault();
					proceed = true;
				}
			} else {
				if (key === this.keys.left || key === this.keys.right) {
					proceed = true;
				}
			}

			if (proceed) {
				this.switchTabOnArrowPress(e);
			}
		}

		switchTabOnArrowPress(e) {
			const key = e.keyCode;

			if (!this.manualActivation) {
				Object.values(this._tabs).map((tab) => {
					EventHandler.on(tab, "focus", this._focus.bind(this));
				});
			}

			if (this.direction[key]) {
				const idx = getIndex(e.target);

				if (idx !== undefined) {
					if (this._tabs[idx + this.direction[key]]) {
						this._tabs[idx + this.direction[key]].focus();
					} else if (key === this.keys.left || key === this.keys.up) {
						this.focusLastTab();
					} else if (key === this.keys.right || key === this.keys.down) {
						this.focusFirstTab();
					}
				}
			}
		}

		activateTab(tab, setFocus) {
			setFocus = setFocus !== false ? true : false;

			let id = tab.getAttribute("id");
			let controls = tab.getAttribute("aria-controls");
			let tabpanel = this._element.querySelector(`#${controls}`);

			// 7/28일 강영민 추가
			if (tab.classList.contains("deactivate")) {
				// 탭클릭시 deactivate 클래스를 가지고 있으면 이벤트 무효처리
				return false;
			} else {
				this.deactivateTabs();
				tab.classList.add("active");
				tab.removeAttribute("tabindex");
				tab.setAttribute("aria-selected", "true");
				tab.setAttribute("title", "선택됨");
			}

			if (tabpanel !== null) {
				tabpanel.removeAttribute("hidden");
				// Tab 컨텐츠 영역 안에 .ui-form 있으면 업데이트 실행
				UI.UIFormsUpdate(this._element.querySelectorAll(`#${controls} .ui-form`));

				// Tab 컨텐츠 영역 안에 .toggle-tabs 있으면 업데이트 실행
				UI.TabsUpdate(this._element.querySelectorAll(`#${controls} .toggle-tabs`));

				// Tab 컨텐츠 영역 안에 .tabs 있으면 업데이트 실행
				UI.TabsUpdate(this._element.querySelectorAll(`#${controls} .tabs`));
			}

			if (setFocus) {
				tab.focus();
			}

			// settings.onVisible.call($tab, $tab.index(), id, controls);
			this.update();
		}

		activateTabIndex(idx) {
			this.activateTab(this._tabs[idx], false);
		}

		deactivateTabs() {
			Object.values(this._tabs).map((tab) => {
				tab.classList.remove("active");
				tab.setAttribute("tabindex", "-1");
				tab.setAttribute("aria-selected", "false");
				tab.removeAttribute("title");
			});
			Object.values(this._panels).map((panel) => {
				panel.setAttribute("hidden", "hidden");
			});
		}

		focusFirstTab() {
			this.activateTab(this._element.querySelector('[role="tab"]:first-child'));
		}

		focusLastTab() {
			this.activateTab(this._element.querySelector('[role="tab"]:last-child'));
		}

		dispose() {
			super.dispose();
		}
	}

	function TabsUpdate(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".tabs");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((tabElement) => {
			let instance = UI.Tabs.getInstance(tabElement);
			if (instance !== null) {
				instance.update();
			}
		});
	}

	function TabsApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			// targetElements = document.querySelectorAll('.tabs.js-tabs');
			targetElements = document.querySelectorAll(".tabs");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.Tabs(element);
		});
	}

	window.addEventListener("load", () => {
		TabsApply();
	});
	/**
	 * --------------------------------------------------
	 * Toast
	 * --------------------------------------------------
	 */

	// class Toast extends BaseComponent {
	class Toast {
		constructor(config) {
			this.config = {
				...{
					message: "",
					align: "center",
					top: "",
				},
				...(typeof config === "object" ? config : {}),
			};

			if (this.config.message === "") {
				throw new Error("Toast Popup 메시지가 없습니다.");
			}
			if (this.config.message.indexOf("<br>") > -1 || this.config.message.indexOf("<br />") > -1) {
				this.config.align = "left";
			}

			this.createHtml();
			this.show();

			const delay = this.toast.clientHeight < 50 ? 2000 : 3500;

			this.toast.addEventListener(
				"transitionend",
				() => {
					setTimeout(() => {
						this.hide();
					}, delay);
				},
				{ once: true }
			);
		}

		static get NAME() {
			return "toast";
		}

		createHtml() {
			let id = `toast-${generateRandomCode(4)}`;
			let html = "";

			html += `<div class="toast-popup ${this.config.align}" id="${id}">`;  //20240531 접근성수정
			html += `	<div class="inner">${this.config.message}</div>`;
			html += `</div>`;

			appendHtml(document.body, html);

			this.toast = document.getElementById(id);
		}

		show() {
			setTimeout(() => {
				if (`${this.config.top}`) {
					this.toast.style.transform = `translateY(calc(-100% - ${this.config.top}px))`;
				} else {
					this.toast.style.transform = "translateY(calc(-100% - 12px))";
				}
			}, 10);
		}

		hide() {
			this.toast.style.transform = "translateY(0)";
			this.toast.addEventListener(
				"transitionend",
				() => {
					this.toast.remove();
				},
				{ once: true }
			);
		}
	}

	/**
	 * --------------------------------------------------
	 * Toggle Control
	 * --------------------------------------------------
	 */

	class ToggleControl extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this.controls = getAriaAttribute(this._element, "controls");
			this._target = document.querySelector(`#${this.controls}`);
			this.toggleCheck = getAriaAttribute(this._element, "toggle-check");
			this._checkTarget = document.querySelector(`#${this.toggleCheck}`);

			if (this.hasOpenedClosed()) {
				this._element.removeAttribute("aria-expanded");
			}

			this.eventBind();
			this.update();
		}

		static get NAME() {
			return "toggleControl";
		}

		watch() {
			requestAnimationFrame(() => {
				if (this.toggleCheckValue !== this._checkTarget.checked) {
					this.checkTargetChange();
				}
				this.watch();
			});
		}

		eventBind() {
			EventHandler.on(this._element, "click", this.toggle.bind(this));
			if (this._checkTarget !== null) {
				EventHandler.on(this._checkTarget, "change", this.checkTargetChange.bind(this));
			}
		}

		toggle() {
			this.setExpanded(!this.isExpanded());
		}

		checkTargetChange() {
			this.toggleCheckValue = this._checkTarget.checked;
			this.setExpanded(!this.toggleCheckValue);
		}

		update() {
			this.setExpanded(this.isExpanded());

			if (this._checkTarget !== null) {
				this.toggleCheckValue = this._checkTarget.checked;
				this.watch();
			}
		}

		setExpanded(tf) {
			if (tf) {
				if (!this.hasOpenedClosed()) {
					setAriaAttribute(this._element, "expanded", "true");
				}
				this._element.classList.add("is-expanded");
				this._target.removeAttribute("hidden");
			} else {
				if (!this.hasOpenedClosed()) {
					setAriaAttribute(this._element, "expanded", "false");
				}
				this._element.classList.remove("is-expanded");
				this._target.setAttribute("hidden", "");
			}
		}

		isExpanded() {
			// return (getAriaAttribute(this._element, 'expanded') == 'true');
			return this._element.classList.contains("is-expanded") || getAriaAttribute(this._element, "expanded") == "true";
		}

		hasOpenedClosed() {
			return this._element.querySelector(".opened") !== null && this._element.querySelector(".closed") !== null;
		}
	}

	function ToggleControlApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll(".js-toggle-control");
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.ToggleControl(element);
		});
	}

	window.addEventListener("load", () => {
		ToggleControlApply();
	});

	/**
	 * --------------------------------------------------
	 * Tooltip
	 * --------------------------------------------------
	 */

	class Tooltip extends BaseComponent {
		constructor(element) {
			if (getElement(element).classList.contains("initiated")) {
				return {};
			}
			super(element);

			this._isShown = false;

			this.text = this._element.getAttribute("title");
			this._element.setAttribute("aria-expanded","false"); //접근성수정
			this._element.setAttribute("data-text",this.text);
			this._element.removeAttribute("title");

			this.placement = getDataAttribute(this._element, "tooltip-placement") ? getDataAttribute(this._element, "tooltip-placement").toUpperCase() : "TOP";
			this.tooltipStyle = getDataAttribute(this._element, "tooltip-style") ? getDataAttribute(this._element, "tooltip-style") : "basic";
			this.tooltipClose = getDataAttribute(this._element, "tooltip-closebtn") === "true" ? true : false;
			this.tooltipClose = true; //접근성수정
			this.tooltipExCase = getDataAttribute(this._element, "tooltip-exCase") === "true" ? true : false;

			this._eventBind();
		}

		static get NAME() {
			return "tooltip";
		}

		_eventBind() {
			this._element.addEventListener("click", this._clickTooltip.bind(this));
		}

		_clickTooltip() {
			this.show();
		}

		createHtml() {
			let id = `tooltip-${generateRandomCode(4)}`;
			let html = "";

			html += `<div class="tooltip placement-${this.placement.toLowerCase()} style-${this.tooltipStyle.toLowerCase()}" id="${id}" role="tooltip" tabindex="0">`;
			html += `	<div class="tooltip-contents">${this.text}</div>`;
			html += `	<div class="tooltip-arrow"></div>`;
			html += `</div>`;

			appendHtml(document.body, html);
			this.tooltip = document.getElementById(id);

			if (this.tooltipClose) {
				this.tooltip.classList.add("has-button-close");
				appendHtml(this.tooltip.querySelector(".tooltip-contents"), '<button type="button" class="tooltip-close">툴팁 닫기</button>');
				this.tooltipCloseBtn = this.tooltip.querySelector(".tooltip-close");
			}

			this.tooltipArrow = this.tooltip.querySelector(".tooltip-arrow");
			this._element.removeAttribute("title");
			this._element.setAttribute("aria-expanded","true"); //접근성수정
			this.tooltip.focus({preventScroll:true});
		}

		show() {
			if (this._isShown) {
				return;
			}
			this._isShown = true;
			this.createHtml();

			let tooltipWidth = 0,
				tooltipHeight = 0;
			let triggerWidth = 0,
				triggerHeight = 0;
			let left = 0,
				top = 0;
			let _left = 0,
				_top = 0;
			let space = 10;
			let innerPadding = 16;
			let viewportPadding = 20;
			let maxWidth = 0;

			this.coords = getCoords(this._element);
			left = this.coords.left;
			top = this.coords.top;

			// swiper 안에 있는 경우 처리
			if (getParentsByClassName(this._element, "swiper-wrapper") !== null) {
				let swiperWrapper = getParentsByClassName(this._element, "swiper-wrapper");
				let style = window.getComputedStyle(swiperWrapper);
				let matrix = new WebKitCSSMatrix(style.transform);
				left += matrix.m41;
				top += matrix.m42;
			}

			tooltipWidth = this.tooltip.clientWidth;
			tooltipHeight = this.tooltip.clientHeight;
			triggerWidth = this._element.clientWidth;
			triggerHeight = this._element.clientHeight;

			// max-width 처리
			if (this.placement === "TOP" || this.placement === "BOTTOM") {
				maxWidth = window.innerWidth - viewportPadding * 2;
				if (this.tooltipExCase) {
					maxWidth = window.innerWidth - viewportPadding * 2 - innerPadding * 2;
				}
			} else if (this.placement === "RIGHT") {
				maxWidth = window.innerWidth - viewportPadding * 1 - triggerWidth - left - space;
			} else if (this.placement === "LEFT") {
				maxWidth = window.innerWidth - viewportPadding * 1 - (window.innerWidth - left) - space;
			}

			this.tooltip.style.maxWidth = maxWidth + "px";

			// left 처리
			if (this.placement === "TOP" || this.placement === "BOTTOM") {
				left = _left = left - (tooltipWidth - triggerWidth) / 2;
				if (left < viewportPadding) {
					left = viewportPadding;
				}
				if (left + tooltipWidth > window.innerWidth - viewportPadding) {
					left = window.innerWidth - tooltipWidth - viewportPadding;
				}
				this.tooltipArrow.style.marginLeft = _left - left + "px";
				if (this.tooltipExCase) {
					left = window.innerWidth - tooltipWidth - innerPadding / 2;
				}
			} else if (this.placement === "RIGHT") {
				left = left + triggerWidth + space;
			} else if (this.placement === "LEFT") {
				left = left - tooltipWidth - space;
				if (left < viewportPadding) {
					left = viewportPadding;
				}
			}

			this.tooltip.style.left = left + "px";

			// top 처리
			if (this.placement === "TOP") {
				top = top - tooltipHeight - space;
			} else if (this.placement === "BOTTOM") {
				top = top + triggerHeight + space;
			} else if (this.placement === "RIGHT" || this.placement === "LEFT") {
				top = top - (tooltipHeight - triggerHeight) / 2;
			}

			this.tooltip.style.top = top + "px";

			setTimeout(() => {
				document.body.addEventListener(
					"click",
					() => {
						this.hide();
					},
					{ once: true }
				);
				this.tooltip.addEventListener("click", (e) => {
					e.stopPropagation();
				});
				if (this.tooltipClose) {
					EventHandler.one(this.tooltipCloseBtn, "click", () => {
						document.body.dispatchEvent(new Event("click"));
					});
				}
			}, 100);
		}

		hide() {
			if (!this._isShown) {
				return;
			}
			this._isShown = false;
			this._element.focus();
			this.tooltip.remove();
			this._element.setAttribute("aria-expanded","false"); //접근성수정
		}

		changeMessage(msg) {
			this._element.setAttribute("title", msg);
			this.text = this._element.getAttribute("title");
		}

		dispose() {
			super.dispose();
		}
	}

	function TooltipApply(elements) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll('[data-ui-toggle="tooltip"]');
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((element) => {
			new UI.Tooltip(element);
		});
	}

	function TooltipUpdateMessage(elements, message) {
		let targetElements = null;

		if (typeof elements === "undefined") {
			targetElements = document.querySelectorAll('[data-ui-toggle="tooltip"]');
		} else if (typeof elements === "object" && typeof elements.length === "number") {
			targetElements = elements;
		} else if (typeof elements === "string") {
			targetElements = document.querySelectorAll(elements);
		} else {
			return false;
		}

		Object.values(targetElements).map((formElement) => {
			let instance = UI.Tooltip.getInstance(formElement);
			if (instance !== null) {
				instance.changeMessage(message);
			}
		});
	}

	window.addEventListener("load", () => {
		TooltipApply();
	});
	/**
	 * --------------------------------------------------
	 * UI
	 * --------------------------------------------------
	 */

	function parentChecked() {
		const checkboxs = document.querySelectorAll("[data-parent-checked]");

		Object.values(checkboxs).map((checkbox) => {
			const selector = getDataAttribute(checkbox, "parent-checked");
			EventHandler.on(checkbox, "change", () => {
				let target = getParentsByClassName(checkbox, selector);
				if (checkbox.type === "radio") {
					let name = checkbox.name;
					let allInput = document.querySelectorAll(`[name="${name}"]`);
					Object.values(allInput).map((input) => {
						getParentsByClassName(input, selector).classList.remove("checked");
					});
				}
				if (checkbox.checked) {
					target.classList.add("checked");
				} else {
					target.classList.remove("checked");
				}
			});
		});
	}

	function stepperCheck() {
		if (document.querySelector("#contents-area > .container .step-wrap") !== null) {
			document.querySelector("#header").classList.add("no-sticky");
		}
	}

	function headerInit() {
		const wrap = document.querySelector("#wrap");
		const header = document.querySelector("#header");

		if (header === null) return;

		let isHide = false,
			startY,
			moveY;
		let headerHeight = header.offsetHeight;
		let limit = 32;
		// let limit = 0;

		// fullpopup 형태는 해더 고정이 default 요건 반영 (10/07)
		if (header.querySelector(".icon-header-close") !== null) {
			setDataAttribute(wrap, "header-interaction", "false");
		}

		// 스크롤 내려가면 header에 border 추가
		EventHandler.on(window, "scroll", () => {
			headerHeight = header.offsetHeight;
			if (window.scrollY > 0) {
				header.classList.add("border");
			} else {
				header.classList.remove("border");
			}
		});

		if (getDataAttribute(wrap, "header-interaction") == "false") {
			return;
		}

		header.classList.add("header-interaction-activate");

		if (header.classList.contains("no-sticky")) return;

		EventHandler.on(window, "touchstart", () => {
			startY = window.scrollY;
		});

		EventHandler.on(window, "scroll", () => {
			headerHeight = header.offsetHeight;
			if (window.scrollY < limit) {
				startY = window.scrollY;
				// if (isHide) {
				headerTranslateY(0);
				// }
				return;
			}
			moveY = startY - window.scrollY;
			if (moveY < 0 && !isHide) {
				if (Math.abs(moveY) < headerHeight * 2) {
					headerTranslateY(moveY);
				} else {
					headerTranslateY(-headerHeight);
				}
			} else if (moveY > 0 && isHide) {
				if (Math.abs(moveY) < headerHeight) {
					headerTranslateY(-headerHeight + moveY);
				} else {
					headerTranslateY(0);
				}
			}
		});

		EventHandler.on(window, "touchend", () => {
			header.classList.add("transition");
			if (moveY > 0 || window.scrollY < limit) {
				headerTranslateY(0);
				isHide = false;
			} else if (moveY < 0) {
				headerTranslateY(-headerHeight);
				isHide = true;
			}
			setTimeout(() => {
				header.classList.remove("transition");
			}, 300);
		});

		function headerTranslateY(v) {
			header.style.transform = `translateY(${v}px)`;
			// 상품상세 공통 탭 (헤더 + 탭 연동)
			if (document.querySelector(".product-detail") !== null) {
				let pd = document.querySelectorAll('[class*="product-detail"]');
				for (let i = 0; i < pd.length; i++) {
					// pd[i].style.top = `${v + headerHeight}px`;
					// pd[i].style.top = `calc(${v}px + var(--safeAreaInsetTop))`;
					// pd[i].style.transform = `translateY(${v + 49}px)`;
					if (v > -49) {
						pd[i].style.top = `calc(${v + 49}px + var(--safeAreaInsetTop))`;
					} else {
						pd[i].style.top = `var(--safeAreaInsetTop)`;
					}
				}
			}
		}
	}

	function checkDisable() {
		const checkboxs = document.querySelectorAll('[data-action="check-disable"]');

		Object.values(checkboxs).map((checkbox) => {
			const id = getAriaAttribute(checkbox, "controls");
			EventHandler.on(checkbox, "change", () => {
				//let target = getParentsByClassName(checkbox, selector);
				let target = document.getElementById(id);
				if (checkbox.checked) {
					target.disabled = true;
				} else {
					target.disabled = false;
				}
				UIFormsUpdate();
			});
		});
	}

	function anchorInit() {
		const anchorButton = document.querySelectorAll(".js-anchor *[data-anchor]");
		Object.values(anchorButton).map((button) => {
			const id = getDataAttribute(button, "anchor");
			if (!button.classList.contains("event-bind")) {
				EventHandler.on(button, "click", () => {
					let scoh = document.querySelector(".sticky-container") == null ? 0 : document.querySelector(".sticky-container").offsetHeight;
					// 상품상세탭 스크롤 이슈로 분기처리 (0824-현업요청반영)
					if (!!document.querySelector(".sticky-container.product-detail")) {
						pageScrollTo("#" + id, 0 - scoh + 16);
					} else {
						pageScrollTo("#" + id, 0 - scoh);
					}
					// 접근성 포커스 이동 추가
					document.getElementById(id).setAttribute("tabindex", -1);
					document.getElementById(id).style.outline = "none";
					document.getElementById(id).focus();
				});
				button.classList.add("event-bind");
			}
		});
	}

	function fabInit(run) {
		let fab = document.querySelector("#FAB");
		if (run !== true) {
			if (fab === null || fab.classList.contains("fab-disable")) {
				return;
			}
		}
		fab.classList.remove("fab-disable");
		document.body.classList.add("has-fab");

		let fabLabel = fab.querySelector(".label");
		let toggleBtn = fab.querySelector(".btn-toggle");
		let fabDimm = fab.querySelector(".fab-dimm");

		fabLabel.style.width = fabLabel.clientWidth + "px";
		fab.classList.add("hidden");
		fab.classList.add("label-close");

		// .label 이 .blind 이면 aria-hidden="true" 추가
		if (fabLabel.classList.contains("blind")) {
			fabLabel.setAttribute("aria-hidden", "true");
		}

		// 아래에서 위로 나타남
		setTimeout(function () {
			fab.classList.add("show");
		}, 500);

		// 레이블 나타남
		setTimeout(function () {
			fab.classList.remove("label-close");
		}, 800);

		// 2초 후 .label 닫힘
		setTimeout(function () {
			fab.classList.add("label-close");
		}, 3000);

		if (toggleBtn == null) return;

		if (toggleBtn.innerText == "메뉴 열기/닫기") {
			toggleBtn.innerText = "추가메뉴";
		}
		toggleBtn.setAttribute("aria-expanded", "false");

		let fabTransition = false;

		toggleBtn.addEventListener("click", fabMenuToggle);

		function fabMenuToggle() {
			if (fabTransition) {
				return;
			} else {
				fabTransition = true;
				if (document.getElementById("FAB").classList.contains("fab-open")) {
					fabMenuClose();
					toggleBtn.setAttribute("aria-expanded", "false");
				} else {
					fabMenuOpen();
					toggleBtn.setAttribute("aria-expanded", "true");
				}
				setTimeout(function () {
					fabTransition = false;
				}, 1000);
			}
		}

		function fabMenuOpen() {
			let menus = fab.querySelectorAll("li");
			let delay = 0.15;
			let startDelay = 0.15;
			Object.values(menus).map((menu, i) => {
				menu.style.transitionDelay = delay * i + "s";
			});
			UI.bodyHold(true);
			fabDimm.style.display = "block";
			setTimeout(() => {
				document.getElementById("FAB").classList.add("fab-open");
			}, 10);
			setTimeout(function () {
				document.getElementById("FAB").classList.add("menu-open");
			}, startDelay * 1000);
			ariaHiddenActivate(fab);
		}

		function fabMenuClose() {
			let menus = fab.querySelectorAll("li");
			let delay = 0.15;
			let startDelay = 0.15;
			let cnt = menus.length;
			Object.values(menus).map((menu, i) => {
				menu.style.transitionDelay = delay * (cnt - 1 - i) + "s";
			});
			document.getElementById("FAB").classList.remove("menu-open");
			setTimeout(function () {
				document.getElementById("FAB").classList.remove("fab-open");
				setTimeout(function () {
					UI.bodyHold(false);
					fabDimm.style.display = "none";
				}, 500);
			}, (delay * (cnt - 1) + startDelay) * 1000);
			ariaHiddenDeactivate();
		}
	}

	function diagramSvgInit() {
		if (document.querySelector(".diagram-svg-container") === null) return;
		let svgHtml = "";
		svgHtml += '<svg class="line line-left">';
		svgHtml += '	<path d="M 167 0 L 167 293 C 167 298 161 304 155 304 L 33 304 C 27 304 21 310 21 316 L 21 416 C 21 422 27 428 33 428 L 155 428 C 161 428 167 434 167 440 L 167 475" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="line line-right">';
		svgHtml += '	<path d="M 167 0 L 167 293 C 167 298 161 304 155 304 L 33 304 C 27 304 21 310 21 316 L 21 416 C 21 422 27 428 33 428 L 155 428 C 161 428 167 434 167 440 L 167 475" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="arrow-left">';
		svgHtml +=
			'	<path d="M7.86603 10.5C7.48112 11.1667 6.51888 11.1667 6.13397 10.5L0.937822 1.5C0.552922 0.833332 1.03405 -1.22094e-06 1.80385 -1.15364e-06L12.1962 -2.4512e-07C12.966 -1.77822e-07 13.4471 0.833333 13.0622 1.5L7.86603 10.5Z" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="arrow-right">';
		svgHtml +=
			'	<path d="M7.86603 10.5C7.48112 11.1667 6.51888 11.1667 6.13397 10.5L0.937822 1.5C0.552922 0.833332 1.03405 -1.22094e-06 1.80385 -1.15364e-06L12.1962 -2.4512e-07C12.966 -1.77822e-07 13.4471 0.833333 13.0622 1.5L7.86603 10.5Z" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="arrow-finish">';
		svgHtml +=
			'	<path d="M7.86603 10.5C7.48112 11.1667 6.51888 11.1667 6.13397 10.5L0.937822 1.5C0.552922 0.833332 1.03405 -1.22094e-06 1.80385 -1.15364e-06L12.1962 -2.4512e-07C12.966 -1.77822e-07 13.4471 0.833333 13.0622 1.5L7.86603 10.5Z" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="line-active line-left">';
		svgHtml += '	<path d="M 167 0 L 167 293 C 167 298 161 304 155 304 L 33 304 C 27 304 21 310 21 316 L 21 416 C 21 422 27 428 33 428 L 155 428 C 161 428 167 434 167 440 L 167 475" />';
		svgHtml += "</svg>";
		svgHtml += '<svg class="line-active line-right">';
		svgHtml += '	<path d="M 167 0 L 167 293 C 167 298 161 304 155 304 L 33 304 C 27 304 21 310 21 316 L 21 416 C 21 422 27 428 33 428 L 155 428 C 161 428 167 434 167 440 L 167 475" />';
		svgHtml += "</svg>";

		document.querySelector(".diagram-svg-container").innerHTML = svgHtml;
		setTimeout(function () {
			document.querySelector(".goal-design-service .diagram").classList.add("animate");
		}, 1000);
	}

	// Stepper 디자인 가이드 변경으로 추가
	function stepperHtml() {
		const stepWraps = document.querySelectorAll(".step-wrap");
		Object.values(stepWraps).map((stepWrap) => {
			const stepList = stepWrap.querySelector(".step-list");
			if (stepList != null) {
				const total = stepList.querySelector("li:last-child").innerText;
				const now = stepList.querySelector("li.active").innerText;

				stepList.remove();

				let html = "";
				html += '<p class="step-total" role="img" aria-label="총 ' + total + "단계 중 현재 " + now + '단계">';
				html += '	<span class="blind">총</span>';
				html += '	<span class="total">' + total + "</span>";
				html += '	<span class="blind">단계 중</span>';
				html += '	<span class="slash" aria-hidden="true">/</span>';
				html += '	<span class="now">' + now + "</span>";
				html += '	<span class="blind">단계</span>';
				html += "</p>";

				if (stepWrap.querySelector("ul.text") == null) {
					appendHtml(stepWrap, html);
				} else {
					const s = stepWrap.querySelector("ul.text");
					stepWrap.querySelector("ul.text").remove();
					appendHtml(stepWrap, html);
					appendHtml(stepWrap, `<ul class="text">${s.innerHTML}</ul>`);
				}
			}
		});
	}

	// Stepper 접근성 role, aria-label 추가
	function stepperAccessibility() {
		const stepWrap = document.querySelector(".step-wrap");
		if (stepWrap === null) return;
		const stepTotal = stepWrap.querySelector(".step-total");
		if (stepTotal === null) return;
		const stepMax = stepTotal.querySelector(".total").innerText;
		const stepNow = stepTotal.querySelector(".now").innerText;
		const ariaLabel = "총 " + stepMax + "단계 중 현재 " + stepNow + "단계";
		stepTotal.setAttribute("role", "img");
		stepTotal.setAttribute("aria-label", ariaLabel);
	}

	const starAccessibility = () => {
		const starContainers = document.querySelectorAll(".star-area");
		let totalStep = null;
		let status = null;
		function getTotalStar(starContainer) {
			for (let i = 0; i < starContainer.children.length; i++) {
				if (starContainer.children[i].classList.contains("star-icon")) {
					totalStep = totalStep + 1;
					status = starContainer.children[i].classList.contains("active") ? status + 1 : status;
				}
			}
			starContainer.setAttribute("aria-label", `총 별 ${totalStep}개중 ${status}개`);
		}

		for (let item of starContainers) {
			item.setAttribute("role", "img");
			getTotalStar(item);
		}
	};

	function accessibilityFocusInit() {
		const body = document.body;
		// 마지막 click 된 요소를 window.lastClickElement에 저장
		body.addEventListener("click", (e) => {
			window.lastClickElement = e.composedPath()[0];
		});
	}

	function svgAdd() {
		const svgData = [
			{
				selector: ".complete-sec, .content-sec.icon-complete56-blue800",
				html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<g id="checkMark">
							<path d="M 7 15 L 14 22 L 25 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" pathlength="100" />
						</g>
					</svg>`,
			},
			{
				selector: ".content-sec.icon-error56-green",
				html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<g id="exclamationMark">
							<path d="M 16.5 6.5 L 16.5 17.5" stroke="#0471E9" stroke-width="3" stroke-linecap="round" />
							<path d="M 14.5 25.5 A 2.25 2.25 0 0 0 19 25.5 A 2.25 2.25 0 0 0 14.5 25.5" fill="#0471E9" />
						</g>
					</svg>`,
			},
			{
				selector: ".content-sec.icon-add56-blue",
				html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<g id="plusMark">
							<line x1="16" y1="7" x2="16" y2="25" stroke="white" stroke-width="2" stroke-linecap="round"/>
							<line x1="25" y1="16" x2="7" y2="16" stroke="white" stroke-width="2" stroke-linecap="round"/>
						</g>
					</svg>`,
			},
		];

		svgData.map((svg) => {
			const elements = document.querySelectorAll(svg.selector);
			Object.values(elements).map((element) => {
				if (!element.classList.contains("svg-added")) {
					prependHtml(element, svg.html);
					element.classList.add("svg-added");
				}
			});
		});
	}

	function productDetailButton() {
		// 상품상세 하단 버튼 show/hide 관련

		if (!!document.querySelector("[class*='type-'].pr-common")) {
			const headerArea = document.querySelector(".header-wrap");
			const visualArea = document.querySelector(".visual-area");
			const bottomButton = document.querySelector("[class*='type-'].pr-common ~ .sticky-button.button-group");
			const headerHeight = headerArea.offsetHeight;
			const visualHeight = visualArea.offsetHeight;

			if (!!bottomButton) {
				if (window.scrollY >= headerHeight + visualHeight - 70) {
					bottomButton.style.display = "block";
				} else {
					bottomButton.style.display = "none";
				}
			}
		}
	}

	// 알아두세요. 문구 통일 (황이로 프로 8/17 요청)
	function bottomNoticeTrigger() {
		const targets = document.querySelectorAll(".bottom-notice-trigger.js-toggle-control");
		if (targets !== null) {
			targets.forEach((target) => {
				const targetText = target.innerText;
				if (targetText == "알아두세요" || targetText == "알아두세요!") {
					target.innerText = "알아두세요.";
				}
			});
		}
	}

	// sticky 여부 체크
	function stickyChecker(elem) {
		const sc = document.createElement("div");
		sc.classList.add("sticky-checker");
		elem.appendChild(sc);
		const observer = new IntersectionObserver(
			([e]) => {
				e.target.parentElement.classList.toggle("is-pinned", e.intersectionRatio < 1);
			},
			{ threshold: [1] }
		);
		observer.observe(sc);
	}

	function stickyCheckerInit(selector) {
		document.querySelectorAll(selector).forEach((elem) => {
			stickyChecker(elem);
		});
	}

	// input 접근성
	function inputAccessibility() {
		const inputItems = document.querySelectorAll('input[type="checkbox"] , input[type="radio"]');
		Object.values(inputItems).map((input) => {
			const inputItemsLabel = input.nextElementSibling;
			const labelText = inputItemsLabel.innerText;
			if (inputItemsLabel.nodeName == "LABEL") {
				inputItemsLabel.setAttribute("aria-hidden", true);
				input.setAttribute("title", labelText);
			}
		});
		//계좌선택 버튼 title
		/* 20241021 오류있음
		const selectors = document.querySelectorAll(".account-selector");
		Object.values(selectors).map((selectors) => {
			const selector = selectors.previousElementSibling;
			if(selector && (selector.classList.contains("h4") || selector.classList.contains("h5") || selector.classList.contains("account-selector-label"))){
				var h5Text = selector.innerText;
				const button = selectors.querySelector("button")
				if(button){
					if(!h5Text.includes("선택")){
						h5Text = h5Text + " 선택";
					}
					button.setAttribute("title",h5Text);
				}
			}
		});*/
	}

	//중요사항설명 step 접근성
	const stepLinearType = () => {
		const steplinear = document.querySelectorAll(".step-linear-type3.type-prod-step");
		
		Object.values(steplinear).map((steplinear) => {
			const total = steplinear.querySelectorAll("li").length;
			var num = "";
			//active가 없다면 1단계 처리
			if(steplinear.querySelector(".active")){
				num = steplinear.querySelector(".active .step-num").textContent;
			}else{
				num = "1";
			}
			const ul = steplinear.querySelector("ul");
			var text = "";
			var listTexts = steplinear.querySelectorAll("li");
			listTexts.forEach(function(item){
				var listNum = item.querySelector(".step-num").textContent;
				var listText = item.querySelector(".step-text").textContent;
				text += ", "+listNum + "단계 " +listText;
			});
			ul.setAttribute("role","img");
			ul.setAttribute("aria-label","총 "+total+"단계 중 현재 "+num+"단계"+text);
		});
	}

	// 주민등록번호 입력 폼 접근성
	function minbunAccessibility() {
		const elems = document.querySelectorAll(".form-set.minbun-set");

		Object.values(elems).map((elem) => {
			const input1 = elem.querySelector(".minbun-front input");
			const input2 = elem.querySelector(".minbun-back input");

			if (input2.getAttribute("maxlength") == 1) {
				input1.setAttribute("title", "주민등록번호 앞자리");
				input2.setAttribute("title", "주민등록번호 뒤 첫자리");
			} else if (input2.getAttribute("maxlength") == 7) {
				input1.setAttribute("title", "주민등록번호 앞자리");
				input2.setAttribute("title", "주민등록번호 뒷자리");
			}
		});
	}

	document.addEventListener("DOMContentLoaded", () => {
		stepperHtml();
		diagramSvgInit();
		accessibilityFocusInit();
		bottomNoticeTrigger(); // 알아두세요. 문구 통일

		// 노치대응 : 최상단에 .tabs.sticky-tabs.fullsize-layout 있으면 header-interaction 강제 false 설정
		if (document.querySelector(".container > .tabs.sticky-tabs.fullsize-layout:first-child")) {
			document.querySelector("#wrap").setAttribute("data-header-interaction", "false");
		}
	});

	window.addEventListener("load", () => {
		parentChecked();
		stepperCheck();
		headerInit();
		fabInit();
		checkDisable();
		anchorInit();
		starAccessibility();
		svgAdd();
		productDetailButton(); // 상품상세 하단버튼관련
		minbunAccessibility();

		setTimeout(inputAccessibility, 500);
		setTimeout(stepperAccessibility, 500);
		setTimeout(stepLinearType(), 500);

		// sticky-button 이 있는 경우 has-sticky-button 클래스 추가
		if (document.querySelector(".sticky-button") !== null) {
			document.body.classList.add("has-sticky-button");
		}

		// 페이지 로드 완료 loaded 클래스 추가
		document.body.classList.add("loaded");

		// 노치대응 : .sticky 처리
		stickyCheckerInit(".sticky-container");
		setTimeout(function () {
			stickyCheckerInit("#contents-area > .container .step-wrap");
			stickyCheckerInit("#contents-area > .container .step-wrap-temp");
		}, 500);
	});

	window.addEventListener("scroll", () => {
		if (!!document.querySelector("[class*='type-'].pr-common")) {
			productDetailButton(); // 상품 상세 하단버튼관련
		}
	});

	const index = {
		modalPopup,
		ModalPopup,
		UIForm,
		UIFormsUpdate,
		UIFormsApply,
		bodyHold,
		BottomSheet,
		BottomSheetApply,
		Tooltip,
		TooltipApply,
		TooltipUpdateMessage,
		ButtonRipple,
		ButtonRippleApply,
		Toast,
		Tabs,
		TabsUpdate,
		TabsApply,
		Slider,
		SliderApply,
		Accordion,
		AccordionApply,
		OverflowMenu,
		OverflowMenuApply,
		Calendar,
		CalendarApply,
		PropensityAnalysis,
		PropensityAnalysisApply,
		ToggleControl,
		ToggleControlApply,
		pageScrollTo,
		bottomSheetShow,
		bottomSheetHide,
		UISwiper,
		UISwiperApply,
		parentChecked,
		ScrollPicker,
		ScrollPickerApply,
		getParentsByClassName,
		modalPopupShow,
		modalPopupHide,
		getElementMap,
		ariaHiddenActivate,
		ariaHiddenDeactivate,
		starAccessibility,
		stepLinearType,
		fabInit,
		svgAdd,
		productDetailButton,
		pagePushUp,
		anchorInit,
	};

	return index;
});