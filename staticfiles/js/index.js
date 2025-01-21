// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const nav = body.querySelector('nav');

    // Toggle the theme
    if (body.classList.contains('bg-light')) {
        body.classList.replace('bg-light', 'bg-dark');
        body.classList.replace('text-dark', 'text-light');
        nav.classList.replace('navbar-light', 'navbar-dark');
        nav.classList.replace('bg-light', 'bg-dark');
        nav.classList.replace('text-dark', 'text-light');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('bg-dark', 'bg-light');
        body.classList.replace('text-light', 'text-dark');
        nav.classList.replace('navbar-dark', 'navbar-light');
        nav.classList.replace('bg-dark', 'bg-light');
        nav.classList.replace('text-light', 'text-dark');
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
