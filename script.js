// ===============================
// Akshaya Hindi Tuition - Script
// ===============================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (event) {

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// ===============================
// Welcome Message
// ===============================

window.addEventListener('load', function () {
    console.log("Welcome to Akshaya Hindi Tuition!");
});


// ===============================
// Contact Button Confirmation
// ===============================

const whatsappButtons = document.querySelectorAll(
    'a[href*="wa.me"]'
);

whatsappButtons.forEach(button => {

    button.addEventListener('click', function () {

        console.log(
            "Opening WhatsApp for Akshaya Hindi Tuition..."
        );

    });

});


// ===============================
// Scroll Animation
// ===============================

const cards = document.querySelectorAll(
    '.card, .benefit, .about-content'
);

const observer = new IntersectionObserver(
    function (entries) {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.15
    }
);


// Initial animation settings
cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.7s ease";

    observer.observe(card);

});
