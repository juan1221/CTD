
/* ==========================
   ANIMACION DE ESCRITURA DEL HERO
========================== */

const typingHeadline = document.querySelector(".hero-title-typing");

if (typingHeadline && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const headlineText = typingHeadline.textContent.trim();
    let visibleCharacters = 0;

    typingHeadline.textContent = "";

    function typeHeadlineCharacter() {
        visibleCharacters += 1;
        typingHeadline.textContent = headlineText.slice(0, visibleCharacters);

        if (visibleCharacters < headlineText.length) {
            window.setTimeout(typeHeadlineCharacter, 40);
        }
    }

    window.setTimeout(typeHeadlineCharacter, 250);
}


/* ==========================
   MENU MOBILE
========================== */
const menuBtn = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("active");

        menuBtn.style.transform =
            navbar.classList.contains("active")
                ? "translateY(-50%) rotate(90deg)"
                : "translateY(-50%) rotate(0deg)";

        menuBtn.innerHTML =
            navbar.classList.contains("active")
                ? "✕"
                : "☰";
    });

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("active");

            menuBtn.innerHTML = "☰";

            menuBtn.style.transform =
                "translateY(-50%) rotate(0deg)";
        });

    });

}

/* ==========================
   HEADER SCROLL EFFECT
========================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (header) {

        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

});

/* ==========================
   SCROLL REVEAL
========================== */

const revealElements = document.querySelectorAll(
    ".practice-card, .solution-card, .leader-card, .why-card, .process-card, .experience-card, .insight-card"
);

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {

            element.classList.add("show");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ==========================
   SMOOTH SCROLL
========================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target =
            document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});

/* ==========================
   CONTACT FORM
========================== */

const form = document.querySelector(".contact-form");

if (form) {

    form.addEventListener("submit", (e) => {

        const fields =
            form.querySelectorAll(
                "input[required], textarea[required]"
            );

        let valid = true;

        fields.forEach(field => {

            if (!field.value.trim()) {

                valid = false;
                field.style.border = "2px solid red";

            } else {

                field.style.border = "";

            }

        });

        if (!valid) {

            e.preventDefault();

            alert(
                "Please complete all required fields."
            );

        }

    });

}

/* ==========================
   COUNTERS
========================== */

const counters =
    document.querySelectorAll(".counter");

function startCounters() {

    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        let current = 0;

        function updateCounter() {

            const increment =
                target / 100;

            if (current < target) {

                current += increment;

                counter.textContent =
                    Math.ceil(current);

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target;

            }

        }

        updateCounter();

    });

}

window.addEventListener("load", startCounters);

/* ==========================
   ACTIVE MENU LINK
========================== */

const sections =
    document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        if (window.scrollY >= sectionTop - 150) {

            currentSection =
                section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {
            link.classList.add("active");
        }

    });

});

/* ==========================
   FADE IN PAGE
========================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* ==========================
   BACK TO TOP
========================== */

const backToTop =
    document.createElement("button");

backToTop.innerHTML = "↑";

backToTop.classList.add("back-to-top");

document.body.appendChild(backToTop);

backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});

/* ==========================
   GLOBAL OVERLAY
========================== */

const solutionOverlay =
    document.createElement("div");

solutionOverlay.className = "card-overlay";

document.body.appendChild(solutionOverlay);

/* ==========================
   LEADER CARDS
========================== */

const leaderCards =
    document.querySelectorAll(".leader-card");

const leaderButtons =
    document.querySelectorAll(".see-more-btn");

leaderButtons.forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        const currentCard =
            this.closest(".leader-card");

        const isOpen =
            currentCard.classList.contains("active");

        leaderCards.forEach(card => {

            card.classList.remove("active");
            card.classList.remove("behind");

            const btn =
                card.querySelector(".see-more-btn");

            if (btn) {

                btn.textContent = "See More";

            }

        });

        solutionOverlay.classList.remove("active");

        if (isOpen) return;

        currentCard.classList.add("active");

        leaderCards.forEach(card => {

            if (card !== currentCard) {

                card.classList.add("behind");

            }

        });

        this.textContent = "Show Less";

        solutionOverlay.classList.add("active");

        currentCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});

/* ==========================
   SOLUTION CARDS
========================== */

const solutionCards =
    document.querySelectorAll(".solution-card");

const solutionButtons =
    document.querySelectorAll(".solution-more-btn");

solutionButtons.forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        const currentCard =
            this.closest(".solution-card");

        const isOpen =
            currentCard.classList.contains("active");

        solutionCards.forEach(card => {

            card.classList.remove("active");
            card.classList.remove("behind");

            const btn =
                card.querySelector(".solution-more-btn");

            if (btn) {

                btn.textContent = "See More";

            }

        });

        solutionOverlay.classList.remove("active");

        if (isOpen) return;

        currentCard.classList.add("active");

        solutionCards.forEach(card => {

            if (card !== currentCard) {

                card.classList.add("behind");

            }

        });

        this.textContent = "Show Less";

        solutionOverlay.classList.add("active");

        currentCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});

/* ==========================
   CERRAR OVERLAY
========================== */

solutionOverlay.addEventListener("click", () => {

    solutionCards.forEach(card => {

        card.classList.remove("active");
        card.classList.remove("behind");

        const btn =
            card.querySelector(".solution-more-btn");

        if (btn) {
            btn.textContent = "See More";
        }

    });

    leaderCards.forEach(card => {

        card.classList.remove("active");
        card.classList.remove("behind");

        const btn =
            card.querySelector(".see-more-btn");

        if (btn) {
            btn.textContent = "See More";
        }

    });

    solutionOverlay.classList.remove("active");

});

/* ==========================
   EVITAR CERRAR
========================== */

solutionCards.forEach(card => {

    card.addEventListener("click", e => {

        if (card.classList.contains("active")) {

            e.stopPropagation();

        }

    });

});

leaderCards.forEach(card => {

    card.addEventListener("click", e => {

        if (card.classList.contains("active")) {

            e.stopPropagation();

        }

    });

});