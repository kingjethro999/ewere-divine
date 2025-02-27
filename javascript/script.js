// Renamed to be more specific for the main sidebar (not chat sidebar)
const mainSidebarToggle = document.querySelector('.main-content .mobile-toggle');
const closeMainSidebar = document.querySelector('.sidebar .close-sidebar');
const mainSidebar = document.querySelector('.sidebar');
const mainOverlay = document.querySelector('.sidebar-overlay');

function toggleMainSidebar() {
    mainSidebar.classList.toggle('active');
    mainOverlay.classList.toggle('active');
}

// Only add the event listeners if the elements exist
if (mainSidebarToggle) {
    mainSidebarToggle.addEventListener('click', toggleMainSidebar);
}

if (closeMainSidebar) {
    closeMainSidebar.addEventListener('click', toggleMainSidebar);
}

if (mainOverlay) {
    mainOverlay.addEventListener('click', toggleMainSidebar);
}