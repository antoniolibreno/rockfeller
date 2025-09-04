// Ano automático
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const hamb = document.getElementById("hamb");
const mobileMenu = document.getElementById("mobileMenu");
hamb.addEventListener("click", () => {
  mobileMenu.style.display = mobileMenu.style.display === "flex" ? "none" : "flex";
});
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.style.display = "none");
});

// Carrossel depoimentos
const track = document.getElementById("tsTrack");
const dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(i) {
  index = i;
  track.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach(d => d.classList.remove("active"));
  dots[i].classList.add("active");
}
dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

// Auto-play depoimentos
setInterval(() => {
  index = (index + 1) % dots.length;
  showSlide(index);
}, 5000);

// FAQ acordeão
document.querySelectorAll(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    const ans = q.nextElementSibling;
    ans.style.display = ans.style.display === "block" ? "none" : "block";
  });
});

// Scroll Reveal Animation
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
