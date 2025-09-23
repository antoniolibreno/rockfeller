document.getElementById("year").textContent = new Date().getFullYear();


const hamb = document.getElementById("hamb");
const mobileMenu = document.getElementById("mobileMenu");

hamb.addEventListener("click", () => {
  // Alterna a classe 'active' no menu para exibi-lo/escondê-lo via CSS
  mobileMenu.classList.toggle("active");
  
  // Adiciona/remove a classe no body para travar a rolagem da página
  document.body.classList.toggle("no-scroll");
});

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

setInterval(() => {
  index = (index + 1) % dots.length;
  showSlide(index);
}, 5000);

document.querySelectorAll(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    const ans = q.nextElementSibling;
    ans.style.display = ans.style.display === "block" ? "none" : "block";
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
