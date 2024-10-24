function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-animate');
    let progressValue = 0;

    const appearOptions = {
        threshold: 0.1, // Adjust this if needed (how much of the element must be visible)
        rootMargin: "50px 50px 50px 50px" // Adjust this if needed
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                const progressBar = entry.target;
                const progressValue = progressBar.getAttribute('data-progress');
                progressBar.style.transition = "width 1.5s ease-in-out";
                progressBar.style.width = progressValue;
                appearOnScroll.unobserve(progressBar);
                
            }
        });
    }, appearOptions);

    progressBars.forEach(progressBar => {
        appearOnScroll.observe(progressBar)
    });
};

function animateCounters() {
    // Select all elements with the class 'count-animate'
    const counters = document.querySelectorAll('.count-animate');

    const appearOptions = {
        threshold: 0.1, // Adjust this if needed (how much of the element must be visible)
        rootMargin: "50px 50px 50px 50px" // Adjust this if needed
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {

                const counter = entry.target;
                const countLimit = parseInt(counter.getAttribute('data-count-limit'), 10);
                let currentCount = 0;
                const increment = Math.ceil(countLimit / 100); // Adjust the increment value for speed
                const duration = 1500; // Total duration for the animation in milliseconds
                const intervalTime = duration / (countLimit / increment); // Time between increments

                const updateCounter = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= countLimit) {
                        currentCount = countLimit;
                        clearInterval(updateCounter);
                    }
                    counter.textContent = currentCount;
                }, intervalTime);

                appearOnScroll.unobserve(counter);
                
            }
        });
    }, appearOptions);

    counters.forEach(counter => {
        appearOnScroll.observe(counter);
    });
};

function animateFade() {
    const top_faders = document.querySelectorAll(".fade-in-top");
    const bottom_faders = document.querySelectorAll(".fade-in-bottom");

    const appearOptions = {
        threshold: 0.1, // Adjust this if needed (how much of the element must be visible)
        rootMargin: "0px 0px -50px 0px" // Adjust this if needed
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("show");
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    [...top_faders, ...bottom_faders].forEach(item => {
        appearOnScroll.observe(item);
    });
};

function animatePush() {
    const pushers_r = document.querySelectorAll(".push-in-right");
    const pushers_l = document.querySelectorAll(".push-in-left");

    const appearOptions = {
        threshold: 0.1, // Adjust this if needed (how much of the element must be visible)
        rootMargin: "50px 50px 50px 50px" // Adjust this if needed
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("show");
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    [...pushers_l,...pushers_r].forEach(item => {
        appearOnScroll.observe(item);
    });
};

document.addEventListener('DOMContentLoaded', animateProgressBars);
document.addEventListener('DOMContentLoaded',animateFade);
document.addEventListener('DOMContentLoaded',animatePush);
document.addEventListener('DOMContentLoaded',animateCounters);
