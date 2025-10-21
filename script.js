document.getElementById("year").textContent = new Date().getFullYear();

const hamb = document.getElementById("hamb");
const mobileMenu = document.getElementById("mobileMenu");

hamb.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  
  document.body.classList.toggle("no-scroll");
});

// Fecha o menu mobile ao clicar em um link
document.querySelectorAll(".mobile-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});

/**
 * Função genérica para inicializar um carrossel com reinício do timer.
 * @param {string} trackId - O ID do elemento 'track' do carrossel.
 * @param {string} slideSelector - O seletor CSS para os slides dentro do track.
 * @param {string} controlsContainerSelector - O seletor CSS para o contêiner dos botões.
 * @param {string} dotClass - A classe CSS para os botões de navegação (dots).
 */
function initializeCarousel(trackId, slideSelector, controlsContainerSelector, dotClass) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const slides = track.querySelectorAll(slideSelector);
  const controlsContainer = document.querySelector(controlsContainerSelector);
  let currentIndex = 0;
  let intervalId = null;

  if (slides.length <= 1) return; // Não inicializa o carrossel se tiver 1 ou 0 slides

  // Cria os dots dinamicamente
  if (controlsContainer) {
    controlsContainer.innerHTML = ''; // Limpa para evitar duplicatas
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("button");
      dot.classList.add(dotClass);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        showSlide(i);
        resetInterval(); // Reinicia o timer ao clicar
      });
      controlsContainer.appendChild(dot);
    }
  }

  const dots = controlsContainer ? controlsContainer.querySelectorAll(`.${dotClass}`) : [];

  function showSlide(i) {
    currentIndex = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    if (dots.length > 0) {
      dots.forEach(d => d.classList.remove("active"));
      dots[i].classList.add("active");
    }
  }

  function startInterval() {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 5000);
  }

  function resetInterval() {
    clearInterval(intervalId);
    startInterval();
  }

  startInterval(); // Inicia o carrossel automático
}

// Inicializa todos os carrosséis do site
initializeCarousel("heroTrack", ".hero-slide", ".hero-controls", "dot");
initializeCarousel("metodologiaTrack", ".metodologia-slide", ".metodologia-controls", "metodologia-dot");
initializeCarousel("tsTrack", ".ts-item", ".ts-controls", "dot");

document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => observer.observe(r));

// Lógica do Modal de Matrícula
const openModalBtns = document.querySelectorAll(".js-open-matricula");
const closeModalBtn = document.getElementById("closeModalBtn");
const matriculaOverlay = document.getElementById("matriculaOverlay");

function openModal(e) {
  e.preventDefault();
  matriculaOverlay.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeModal() {
  matriculaOverlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

openModalBtns.forEach(btn => btn.addEventListener("click", openModal));
closeModalBtn.addEventListener("click", closeModal);
// Fecha o modal se clicar fora da área do formulário
matriculaOverlay.addEventListener("click", (e) => { if (e.target === matriculaOverlay) closeModal(); });