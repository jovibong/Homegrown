document.addEventListener('DOMContentLoaded', function () {
    // Load the navbar HTML
    axios.get('resources/navbar.html')
        .then(response => { 
            document.getElementById('navbar').innerHTML = response.data;

            // Add Sign In button click listener
            const signInBtn = document.getElementById('sign-in-btn');
            if (signInBtn) {
                signInBtn.addEventListener('click', function () {
                    // Check if login modal already exists
                    if (!document.getElementById('loginModal')) {
                        // Load the login modal HTML
                        axios.get('/resources/login.html')
                            .then(response => {
                                document.body.insertAdjacentHTML('beforeend', response.data);
                                
                                // Dynamically load the CSS for the modal
                                if (!document.getElementById('login-css')) {
                                    const link = document.createElement('link');
                                    link.id = 'login-css';
                                    link.rel = 'stylesheet';
                                    link.href = '/css/login.css';
                                    document.head.appendChild(link);
                                }

                                // Show the modal using Bootstrap's JS functionality
                                const loginModalElement = document.getElementById('loginModal');
                                const loginModal = new bootstrap.Modal(loginModalElement);
                                loginModal.show();

                                // Apply the blur effect to the main content (not body)
                                const mainContent = document.getElementById('main-container'); 

                                if (mainContent) {
                                    mainContent.classList.add('blur-background');
                                }

                                // Remove blur effect when modal is hidden
                                loginModalElement.addEventListener('hidden.bs.modal', function () {
                                    if (mainContent) {
                                        mainContent.classList.remove('blur-background');
                                    }
                                });
                            })
                            .catch(error => console.error('Error loading login modal:', error));
                    } else {
                        // Show the already existing modal
                        const loginModalElement = document.getElementById('loginModal');
                        const loginModal = new bootstrap.Modal(loginModalElement);
                        loginModal.show();

                        // Apply the blur effect to the main content (not body)
                        const mainContent = document.getElementById('main-container');

                        if (mainContent) {
                            mainContent.classList.add('blur-background');
                        }

                        // Remove blur effect when modal is hidden
                        loginModalElement.addEventListener('hidden.bs.modal', function () {
                            if (mainContent) {
                                mainContent.classList.remove('blur-background');
                            }
                        });
                    }
                });
            } else {
                console.error('Sign-in button not found!');
            }

            // Add Sign Up button click listener
            const signUpBtn = document.getElementById('sign-up-btn');
            if (signUpBtn) {
                signUpBtn.addEventListener('click', function () {
                    // Check if sign-up modal already exists
                    if (!document.getElementById('signupModal')) {
                        axios.get('/resources/signup.html')
                            .then(response => {
                                // Inject the sign-up modal into the DOM
                                document.body.insertAdjacentHTML('beforeend', response.data);

                                // Dynamically load the CSS for the modal
                                if (!document.getElementById('signup-css')) {
                                    const link = document.createElement('link');
                                    link.id = 'signup-css';
                                    link.rel = 'stylesheet';
                                    link.href = '/css/signup.css';
                                    document.head.appendChild(link);
                                }

                                // Show the sign-up modal
                                const signUpModalElement = document.getElementById('signupModal');
                                const signUpModal = new bootstrap.Modal(signUpModalElement);
                                signUpModal.show();

                                // Apply the blur effect to the main content
                                const mainContent = document.getElementById('main-container');

                                if (mainContent) {
                                    mainContent.classList.add('blur-background');
                                }

                                // Remove blur effect when modal is hidden
                                signUpModalElement.addEventListener('hidden.bs.modal', function () {
                                    if (mainContent) {
                                        mainContent.classList.remove('blur-background');
                                    }
                                });
                            })
                            .catch(error => console.error('Error loading sign-up modal:', error));
                    } else {
                        // Show the already existing sign-up modal
                        const signUpModalElement = document.getElementById('signupModal');
                        const signUpModal = new bootstrap.Modal(signUpModalElement);
                        signUpModal.show();

                        // Apply the blur effect to the main content
                        const mainContent = document.getElementById('main-container');

                        if (mainContent) {
                            mainContent.classList.add('blur-background');
                        }

                        // Remove blur effect when modal is hidden
                        signUpModalElement.addEventListener('hidden.bs.modal', function () {
                            if (mainContent) {
                                mainContent.classList.remove('blur-background');
                            }
                        });
                    }
                });
            } else {
                console.error('Sign-up button not found!');
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
});
