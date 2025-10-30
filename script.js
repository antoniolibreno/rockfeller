document.addEventListener('DOMContentLoaded', () => {


    lucide.createIcons();


    const menuToggle = document.getElementById('menu-toggle');
    const headerNav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__nav-link');

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', () => {
            headerNav.classList.toggle('is-open');

            const icon = menuToggle.querySelector('i');
            icon.setAttribute('data-lucide', headerNav.classList.contains('is-open') ? 'x' : 'menu');
            lucide.createIcons();
        });


        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (headerNav.classList.contains('is-open')) {
                    headerNav.classList.remove('is-open');
                    const icon = menuToggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }



    const openModalButtons = document.querySelectorAll('.js-open-modal');
    const closeModalButtons = document.querySelectorAll('.js-close-modal');
    const modal = document.getElementById('enroll-modal');

    if (modal) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('is-open');
            });
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('is-open');
            });
        });
    }



    function setupCarousel(carouselId, options = {}) {
        const carouselElement = document.getElementById(carouselId);
        if (!carouselElement) return;

        const track = carouselElement.querySelector('.hero__track, .testimonial__track');
        const slides = Array.from(track.children);
        const dotsContainer = carouselElement.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        let intervalId = null;


        if (dotsContainer) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Go to slide ${index + 1}`);
                if (index === 0) button.classList.add('active');
                button.addEventListener('click', () => {
                    moveToSlide(index);
                    if (options.autoplay) resetAutoplay();
                });
                dotsContainer.appendChild(button);
            });
        }
        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];


        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });

        function moveToSlide(targetIndex) {
            track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
            
            if(dots.length > 0) {
                dots[currentIndex].classList.remove('active');
                dots[targetIndex].classList.add('active');
            }

            currentIndex = targetIndex;
        }
        
        function resetAutoplay() {
            clearInterval(intervalId);
            if (options.autoplay) {
                 intervalId = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                }, options.autoplayDelay || 5000);
            }
        }
        

        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none'; // Disable transition during resize
            track.style.transform = `translateX(-${newSlideWidth * currentIndex}px)`;
            setTimeout(() => {
              track.style.transition = ''; // Re-enable after resize
            }, 10);
        });

        if (options.autoplay) {
            resetAutoplay();
        }
    }
    

    setupCarousel('hero-carousel', { autoplay: true, autoplayDelay: 6000 });
    setupCarousel('testimonial-carousel');



    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');

        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');


            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq__answer').style.maxHeight = null;
            });
            

            if (!wasActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });



    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after it's visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });



    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
