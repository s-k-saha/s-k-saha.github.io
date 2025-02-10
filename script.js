


document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');

    for (const link of links) {
        link.addEventListener('click', smoothScroll);
    }

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
});

function toggleMenu() {
            var menu = document.getElementById("sidebar");
            console.log(menu.style.height);
            // Toggle menu visibility
            if (menu.style.height === "8vh" || menu.style.height === "" ) {
                menu.style.height = "100vh";
            } else {
                 menu.style.height = "8vh";
            }
        }

