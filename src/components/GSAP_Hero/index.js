import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";
import DefaultBlock from "/scripts/default/block";
import { watchPreferredMotion } from "/utils/helpers/watchPreferredMotion";

// Register Plugins
gsap.registerPlugin(DrawSVGPlugin);

export default class HomeHero extends DefaultBlock {
	init() {
		this.DOM = {
			heading1: this.block.querySelector(".home-hero__animate"),
			heading2: this.block.querySelector(".home-hero__anything"),
			button: this.block.querySelector(".home-hero__button"),
			squiggle: this.block.querySelector("#home-hero-squiggle"),
		};

		this.selector = {
			animate: gsap.utils.selector(this.DOM.heading1),
			anything: gsap.utils.selector(this.DOM.heading2),
		};

		this.defaults = {
			ease: "power2.out",
			duration: 0.6,
		};

		this.createTimeline();
		this.initSquiggleMouseMovement();
	}

	initSquiggleMouseMovement() {
		let windowWidth;
		let windowHeight;

		const setWindowSize = () => {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
		};

		setWindowSize();

		const xTo = gsap.quickTo(this.DOM.squiggle, "xPercent", {
			duration: 1,
			ease: "power3",
		});
		const yTo = gsap.quickTo(this.DOM.squiggle, "yPercent", {
			duration: 1,
			ease: "power3",
		});
		const rotateTo = gsap.quickTo(this.DOM.squiggle, "rotation", {
			duration: 1,
			ease: "power3",
		});

		window.addEventListener("resize", () => {
			setWindowSize();
		});

		window.addEventListener("mousemove", (e) => {
			const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, e.x);
			const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, e.y);
			const rotateRange = gsap.utils.clamp(
				-1,
				1,
				gsap.utils.mapRange(windowWidth * 0.25, windowWidth * 0.75, 1, -1, e.x)
			);

			rotateTo(yPercent * 1 * rotateRange);
			xTo(xPercent);
			yTo(yPercent);
		});
	}

	char1() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const wrap = this.selector.animate(".a > span");
		const char = this.selector.animate(".a > span > span");

		tl.set(wrap, { transformOrigin: "50% 100%" });
		tl.from(char, { yPercent: 100 });
		tl.from(
			wrap,
			{ rotationX: -180, ease: "back.out(1.7)", duration: 1 },
			"-=.4"
		);

		return tl;
	}

	char2() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const circles = this.selector.animate(".home-hero__flair--circles");
		const circlesSvg = this.selector.animate(".home-hero__flair--circles svg");
		const windmill = this.selector.animate(".home-hero__flair--windmill");
		const wrap = this.selector.animate(".n > span > span");
		const chars = this.selector.animate(".n > span > span > span");

		tl.set(chars[1], { autoAlpha: 1 });
		tl.set(circles, { autoAlpha: 1, yPercent: 100 });
		tl.from(circlesSvg, { scale: 0, ease: "back.out(1.7)" });
		tl.to(circles, {
			yPercent: -200,
			autoAlpha: 0,
			duration: 1.5,
			ease: "power4.out",
		});
		tl.from(wrap, { yPercent: 100, duration: 0.4 }, "<");
		tl.from(
			windmill,
			{
				x: () => {
					return window.innerWidth / -2;
				},
				rotationZ: -360,
				duration: 1,
			},
			"<"
		);

		tl.from(chars[0], { rotationY: -180, duration: 0.3 }, "+=.4");
		tl.to(chars[1], { rotationY: 180, duration: 0.3 }, "<");
		tl.to(
			windmill,
			{
				rotationZ: 90,
				duration: 0.3,
				repeat: -1,
				repeatDelay: 1,
			},
			"<"
		);

		return tl;
	}

	char3() {
		const char = this.selector.animate(".i > span");
		return gsap.from(char, {
			yPercent: -100,
			ease: "back.out(1.4)",
			duration: 1,
		});
	}

	char4() {
		const char = this.selector.animate(".m > span");
		return gsap.from(char, {
			xPercent: -100,
			...this.defaults,
		});
	}

	char5() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const wrap = this.selector.animate(".a2");
		const star = this.selector.animate(".home-hero__flair--star");
		const starSvg = this.selector.animate(".home-hero__flair--star svg");
		const char = this.selector.animate(".a2 > span > span");

		tl.set(star, { xPercent: -150, autoAlpha: 1 });
		tl.from(starSvg, { scale: 0, duration: 0.4 });
		tl.add(this.char4(), "+=.6");
		tl.to(star, { xPercent: 0 }, "<");
		tl.set(wrap, { overflow: "hidden" });
		tl.to(star, { yPercent: 130, ease: "power2.in" }, "+=.5");
		tl.from(char, { yPercent: 100 }, "-=.3");
		tl.to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);

		return tl;
	}

	char6() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const char = this.selector.animate(".t > span > span")[0];
		const numbersWrap = this.selector.animate(".t > span > span");
		const numbers = this.selector.animate(".t > span > span > span");

		tl.set(numbersWrap, { autoAlpha: 1 });
		tl.from(numbers[0], { yPercent: 100, duration: 0.4 }, "<");
		tl.fromTo(
			[numbers[1], numbers[2]],
			{ yPercent: 100 },
			{ yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" },
			"+=.2"
		);
		tl.to(numbers[0], { yPercent: -100 }, "-=.6");
		tl.from(char, { yPercent: 100, duration: 0.9 }, "<");
		tl.add(this.char7(), "<");

		return tl;
	}

	char7() {
		const char = this.selector.animate(".e > span");
		return gsap.from(char, {
			yPercent: 100,
			duration: 0.9,
		});
	}

	char8to9() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const topChars = this.selector.anything(
			".a span:first-of-type, .n span:first-of-type"
		);
		const bottomChars = this.selector.anything(
			".a span:last-of-type, .n span:last-of-type"
		);

		tl.fromTo(
			bottomChars,
			{ yPercent: 100 },
			{
				keyframes: {
					yPercent: [100, 0, 100, 0],
					ease: "power1.out",
				},
				duration: 3,
				stagger: 0.4,
			}
		);

		tl.fromTo(
			topChars,
			{
				yPercent: -100,
			},
			{
				keyframes: {
					yPercent: [-100, -100, 20, -100],
					ease: "power1.out",
				},
				duration: 3,
				stagger: 0.4,
			},
			"<"
		);

		return tl;
	}

	char10() {
		const char = this.selector.anything(".y > span");
		return gsap.from(char, {
			rotationY: -180,
			duration: 1,
			scale: 0,
		});
	}

	char11() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const bolt = this.selector.anything(".home-hero__flair--bolt");
		const path = this.selector.anything(".home-hero__flair--bolt #bolt-path");
		const rect = this.selector.anything(".home-hero__flair--bolt #bolt-rect");
		const char = this.selector.anything(".t span");

		tl.set(bolt, { autoAlpha: 1 });
		tl.from(path, { drawSVG: "0", duration: 1, ease: "power3.inOut" });
		tl.from(
			rect,
			{
				yPercent: 100,
				transformOrigin: "50% 100%",
				duration: 3.5,
				ease: "power4.out",
			},
			"<.5"
		);
		tl.from(
			bolt,
			{
				keyframes: {
					scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0],
					duration: 2,
				},
			},
			"-=2"
		);
		tl.from(char, { scale: 0, ease: "back.out(1.4)" }, "<.5");

		return tl;
	}

	char12() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const worm = this.selector.anything(".home-hero__flair--worm img");
		const char = this.selector.anything(".h span span");

		tl.from(worm, {
			autoAlpha: 0,
			duration: 1.5,
			yPercent: 100,
			rotationZ: 180,
			ease: "back.out(1.6)",
		});
		tl.from(char, { yPercent: -100 }, "<.2");

		return tl;
	}

	char13() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const char = this.selector.anything(".i > span");

		tl.from(char, { autoAlpha: 0, duration: 0.1 }, "<");
		tl.from(char, { rotationX: -450, duration: 1.3 }, "<.14");
		tl.add(this.char14(), "<+=.5");
		tl.to(
			char,
			{
				rotationX: 540,
				duration: 1.5,
				repeat: -1,
				repeatDelay: 3,
				yoyo: true,
				yoyoEase: "power2.out",
			},
			"+=2"
		);

		return tl;
	}

	char14() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const char = this.selector.anything(".n2 span");

		tl.from(char, { xPercent: -100 });

		return tl;
	}

	char15() {
		const tl = gsap.timeline({ defaults: this.defaults });
		const char = this.selector.anything(".g span");

		tl.from(
			char,
			{
				autoAlpha: 0,
				rotationZ: -120,
				duration: 2,
				ease: "elastic.out(1, 0.4)",
			},
			"<.6"
		);

		return tl;
	}

	buttonIn() {
		return gsap.from(this.DOM.button, {
			autoAlpha: 0,
			yPercent: 30,
			...this.defaults,
		});
	}

	createTimeline() {
		const tl = gsap.timeline({
			id: "home-hero",
			defaults: this.defaults,
		});

		tl.set([this.DOM.heading1, this.DOM.heading2], { autoAlpha: 1 });

		watchPreferredMotion(() => {
			/* Animate */
			tl.add(this.char1());
			tl.add(this.char2(), 0.4);
			tl.add(this.char3(), 1);
			// Character 4 called inside 5
			tl.add(this.char5(), 0.8);
			tl.add(this.char6(), 1.1);
			// Character 7 called inside 6

			/* Anything */
			tl.add(this.char8to9(), 1.5); // 3
			tl.add(this.char10(), 1.7); // 3.2
			tl.add(this.char11(), 2); // 3.5
			tl.add(this.char12(), 1.9); // 3.4
			tl.add(this.char13(), 2.4); // 4
			// Character 14 called inside 13
			tl.add(this.char15(), 2.2); // 5
			tl.add(this.buttonIn(), 1);
		});
	}
}
