function observeMutations(callback) {
    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    return observer;
}

function observeProgressBars(appearOnScroll) {
    const progressBars = document.querySelectorAll('.progress-animate');
    progressBars.forEach(progressBar => {
        appearOnScroll.observe(progressBar);
    });
}

function animateProgressBars() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const progressBar = entry.target;
            const progressValue = progressBar.getAttribute('data-progress');
            progressBar.style.transition = "width 1.5s ease-in-out";
            progressBar.style.width = progressValue;
            appearOnScroll.unobserve(progressBar);
        });
    }, appearOptions);

    observeProgressBars(appearOnScroll);
    observeMutations(() => observeProgressBars(appearOnScroll));
}

function observeCounters(appearOnScroll) {
    const counters = document.querySelectorAll('.count-animate:not(.observed)');
    counters.forEach(counter => {
        counter.classList.add('observed');
        appearOnScroll.observe(counter);
    });
}

function animateCounters() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const countLimit = parseInt(counter.getAttribute('data-count-limit'), 10);
            let currentCount = 0;
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                currentCount = Math.floor(progress * countLimit);
                counter.textContent = `${currentCount}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = countLimit;
                }
            }

            requestAnimationFrame(updateCounter);
            appearOnScroll.unobserve(counter);
        });
    }, appearOptions);

    observeCounters(appearOnScroll);
    observeMutations(() => observeCounters(appearOnScroll));
}

function observeFades(appearOnScroll) {
    const top_faders = document.querySelectorAll(".fade-in-top");
    const bottom_faders = document.querySelectorAll(".fade-in-bottom");
    [...top_faders, ...bottom_faders].forEach(item => {
        appearOnScroll.observe(item);
    });
}

function animateFade() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 0px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add("show");
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    observeFades(appearOnScroll);
    observeMutations(() => observeFades(appearOnScroll));
}

function observePushers(appearOnScroll) {
    const pushers_r = document.querySelectorAll(".push-in-right");
    const pushers_l = document.querySelectorAll(".push-in-left");
    [...pushers_l, ...pushers_r].forEach(item => {
        appearOnScroll.observe(item);
    });
}

function animatePush() {
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "50px 50px 50px 50px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    observePushers(appearOnScroll);
    observeMutations(() => observePushers(appearOnScroll));
}


export { animateProgressBars, animateFade, animatePush, animateCounters };
