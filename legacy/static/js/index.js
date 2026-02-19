// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const nav = body.querySelector('nav');
    const footer = body.querySelector('#footer');

    // Toggle the theme
    if (body.classList.contains('bg-light')) {
        body.classList.replace('bg-light', 'bg-dark');
        body.classList.replace('text-dark', 'text-light');
        nav.classList.replace('bg-dark', 'bg-black');
        footer.classList.replace('bg-dark', 'bg-black');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('bg-dark', 'bg-light');
        body.classList.replace('text-light', 'text-dark');
        nav.classList.replace('bg-black', 'bg-dark');
        footer.classList.replace('bg-black', 'bg-dark');
        localStorage.setItem('theme', 'light');
    }
}

// Apply saved theme when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        toggleDarkMode();
    }
});

// Add click event listener to the dark mode toggle button
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);


document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;

    let isScrolling = false;

    window.addEventListener("scroll", () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
    
                if (currentScrollY > lastScrollY) {
                    navbar.classList.remove("nav-visible");
                    navbar.classList.add("nav-hidden");
                } else {
                    navbar.classList.remove("nav-hidden");
                    navbar.classList.add("nav-visible");
                }
    
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
    
            isScrolling = true;
        }
    });
    
});
