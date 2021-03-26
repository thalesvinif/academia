var currentPage = location.pathname;
var menuItems = document.querySelectorAll("header nav a");

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    };
};