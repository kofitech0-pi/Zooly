// Abre um modal pelo ID
function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

// Fecha um modal pelo ID
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Fechar modal clicando fora dele
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});
const menuToggle = document.getElementById("menuToggle");
const navbar = document.querySelector(".navbar");
const overlay = document.getElementById("sidebarOverlay");

function fecharSidebar() {
    navbar?.classList.remove("is-open");
    overlay?.classList.remove("is-open");
}

if (menuToggle && navbar && overlay) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("is-open");
        overlay.classList.toggle("is-open");
    });

    overlay.addEventListener("click", fecharSidebar);
}