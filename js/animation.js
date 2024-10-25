function observeMutations(callback) {
    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    return observer;
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-animate');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
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

    function observeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-animate');
        progressBars.forEach(progressBar => {
            appearOnScroll.observe(progressBar);
        });
    }

    observeProgressBars();
    observeMutations(observeProgressBars);
}

function animateCounters() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                const counter = entry.target;
                const countLimit = parseInt(counter.getAttribute('data-count-limit'), 10);
                let currentCount = 0;

                // Animation duration in milliseconds
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(timestamp) {
                    const elapsed = timestamp - startTime;
                    // Calculate the progress based on the duration
                    const progress = Math.min(elapsed / duration, 1);
                    // Update the current count based on the progress
                    currentCount = Math.floor(progress * countLimit);
                    counter.textContent = `${currentCount}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = countLimit; // Ensure the final value is correct
                    }
                }

                // Start the animation
                requestAnimationFrame(updateCounter);
                appearOnScroll.unobserve(counter);
            }
        });
    }, appearOptions);

    function observeCounters() {
        // Get counters that are not already observed
        const counters = document.querySelectorAll('.count-animate:not(.observed)');
        counters.forEach(counter => {
            counter.classList.add('observed'); // Mark this counter as observed
            appearOnScroll.observe(counter);
        });
    }

    observeCounters();
    observeMutations(observeCounters);
};


function animateFade() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 0px 0px"
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

    function observeFades() {
        const top_faders = document.querySelectorAll(".fade-in-top");
        const bottom_faders = document.querySelectorAll(".fade-in-bottom");
        [...top_faders, ...bottom_faders].forEach(item => {
            appearOnScroll.observe(item);
        });
    }

    observeFades();
    observeMutations(observeFades);
}

function animatePush() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
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

    function observePushers() {
        const pushers_r = document.querySelectorAll(".push-in-right");
        const pushers_l = document.querySelectorAll(".push-in-left");
        [...pushers_l, ...pushers_r].forEach(item => {
            appearOnScroll.observe(item);
        });
    }

    observePushers();
    observeMutations(observePushers);
}

document.addEventListener('DOMContentLoaded', () => {
    animateProgressBars();
    animateFade();
    animatePush();
    animateCounters();
});
