
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

    /* Cerrar al seleccionar opción */

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
   SCROLL HEADER EFFECT
========================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ==========================
   SCROLL REVEAL ANIMATION
========================== */

const revealElements = document.querySelectorAll(
  ".practice-card, .solution-card, .leader-card, .why-card, .process-card, .experience-card, .insight-card"
);

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      element.classList.add("show");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ==========================
   SMOOTH SCROLL
========================== */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
    e.preventDefault();

    const inputs = form.querySelectorAll("input[required]");

    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.style.border = "2px solid red";
      } else {
        input.style.border = "none";
      }
    });

    if (!valid) {
      alert("Please complete all required fields.");
      return;
    }

    alert(
      "Thank you. Your inquiry has been submitted successfully."
    );

    form.reset();
  });
}

/* ==========================
   COUNTER ANIMATION
========================== */

const counters = document.querySelectorAll(".counter");

const startCounters = () => {
  counters.forEach((counter) => {
    const target = +counter.dataset.target;

    let current = 0;

    const updateCounter = () => {
      const increment = target / 100;

      if (current < target) {
        current += increment;

        counter.textContent = Math.ceil(current);

        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
};

window.addEventListener("load", startCounters);

/* ==========================
   ACTIVE MENU LINK
========================== */

const sections = document.querySelectorAll("section");
const navLink = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (pageYOffset >= sectionTop - 150) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (
      link.getAttribute("href") === "#" + currentSection
    ) {
      link.classList.add("active");
    }
  });
});

/* ==========================
   FADE IN HERO
========================== */

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ==========================
   BACK TO TOP BUTTON
========================== */

const backToTop = document.createElement("button");

backToTop.innerHTML = "↑";
backToTop.classList.add("back-to-top");

document.body.appendChild(backToTop);

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
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
   OVERLAY FOR LEADER CARDS
========================== */
document.querySelectorAll('.see-more-btn').forEach(button => {

    button.addEventListener('click', function(){

        const currentCard = this.closest('.leader-card');
        const isOpen = currentCard.classList.contains('active');

        document.querySelectorAll('.leader-card').forEach(card => {
            card.classList.remove('active');
            card.classList.remove('dimmed');

            const btn = card.querySelector('.see-more-btn');

            if(btn){
                btn.textContent = 'See More';
            }
        });

        if(!isOpen){

            currentCard.classList.add('active');

            document.querySelectorAll('.leader-card').forEach(card => {

                if(card !== currentCard){
                    card.classList.add('dimmed');
                }

            });

            this.textContent = 'Show Less';
        }

    });

});
/*
overlay.addEventListener('click', () => {

    overlay.classList.remove('active');

    document.querySelectorAll('.leader-card').forEach(card=>{
        card.classList.remove('active');

        const btn = card.querySelector('.see-more-btn');
        if(btn) btn.textContent = 'See more';
    });

});
*/

/* ==========================
   OVERLAY FOR SOLUTION CARDS
========================== */

/* ==========================
   SOLUTIONS CARDS EXPAND
========================== */

const solutionCards = document.querySelectorAll('.solution-card');
const solutionButtons = document.querySelectorAll('.solution-more-btn');

/* Crear overlay dinámicamente */

const solutionOverlay = document.createElement('div');
solutionOverlay.className = 'card-overlay';
document.body.appendChild(solutionOverlay);

solutionButtons.forEach(button => {

    button.addEventListener('click', function (e) {

        e.stopPropagation();

        const currentCard =
            this.closest('.solution-card');

        const isOpen =
            currentCard.classList.contains('active');

        /* Cerrar todas */

        solutionCards.forEach(card => {

            card.classList.remove('active');
            card.classList.remove('behind');

            const btn =
                card.querySelector('.solution-more-btn');

            if (btn) {
                btn.textContent = 'See More';
            }

        });

        solutionOverlay.classList.remove('active');

        /* Si estaba abierta => cerrar */

        if (isOpen) {
            return;
        }

        /* Abrir actual */

        currentCard.classList.add('active');

        solutionCards.forEach(card => {

            if (card !== currentCard) {
                card.classList.add('behind');
            }

        });

        this.textContent = 'Show Less';

        solutionOverlay.classList.add('active');

        /* Centrar visualmente */

        currentCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    });

});


/* ==========================
   CERRAR AL CLICK EN OVERLAY
========================== */

solutionOverlay.addEventListener('click', () => {

    solutionCards.forEach(card => {

        card.classList.remove('active');
        card.classList.remove('behind');

        const btn =
            card.querySelector('.solution-more-btn');

        if (btn) {
            btn.textContent = 'See More';
        }

    });

    solutionOverlay.classList.remove('active');

});


/* ==========================
   EVITAR CERRAR AL HACER CLICK
   DENTRO DE LA CARD ABIERTA
========================== */

solutionCards.forEach(card => {

    card.addEventListener('click', (e) => {

        if (card.classList.contains('active')) {
            e.stopPropagation();
        }

    });

});