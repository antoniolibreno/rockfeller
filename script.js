// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Menu responsivo
    const botaoMenu = document.getElementById('botao-menu');
    const navegacaoCabecalho = document.querySelector('.cabecalho-navegacao');
    const linksNavegacao = document.querySelectorAll('.cabecalho-link-navegacao');

    if (botaoMenu && navegacaoCabecalho) {
        botaoMenu.addEventListener('click', () => {
            navegacaoCabecalho.classList.toggle('aberto');
        });

        linksNavegacao.forEach(link => {
            link.addEventListener('click', () => {
                if (navegacaoCabecalho.classList.contains('aberto')) {
                    navegacaoCabecalho.classList.remove('aberto');
                }
            });
        });
    }

    // Modal
    const abrirModalBotoes = document.querySelectorAll('.js-abrir-modal');
    const fecharModalBotoes = document.querySelectorAll('.js-fechar-modal');
    const modal = document.getElementById('modal-matricula');

    if (modal) {
        abrirModalBotoes.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('aberto');
            });
        });

        fecharModalBotoes.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('aberto');
            });
        });
    }

    // Função para carrossel
    function setupCarrossel(carrosselId, options = {}) {
        const carrosselElemento = document.getElementById(carrosselId);
        if (!carrosselElemento) return;

        const trilha = carrosselElemento.querySelector('.trilha-heroi, .trilha-depoimentos');
        const slides = Array.from(trilha.children);
        const pontosContainer = carrosselElemento.querySelector('.pontos-carrossel');
        const larguraSlide = slides[0].getBoundingClientRect().width;
        let indiceAtual = 0;
        let idIntervalo = null;

        if (pontosContainer) {
            slides.forEach((_, indice) => {
                const botao = document.createElement('button');
                botao.setAttribute('aria-label', `Ir para slide ${indice + 1}`);
                if (indice === 0) botao.classList.add('active');
                botao.addEventListener('click', () => {
                    moverParaSlide(indice);
                    if (options.autoplay) resetAutoplay();
                });
                pontosContainer.appendChild(botao);
            });
        }
        const pontos = pontosContainer ? Array.from(pontosContainer.children) : [];

        slides.forEach((slide, indice) => {
            slide.style.left = larguraSlide * indice + 'px';
        });

        function moverParaSlide(indiceAlvo) {
            trilha.style.transform = `translateX(-${larguraSlide * indiceAlvo}px)`;

            if (pontos.length > 0) {
                pontos[indiceAtual].classList.remove('active');
                pontos[indiceAlvo].classList.add('active');
            }

            indiceAtual = indiceAlvo;
        }

        function resetAutoplay() {
            clearInterval(idIntervalo);
            if (options.autoplay) {
                idIntervalo = setInterval(() => {
                    const proximoIndice = (indiceAtual + 1) % slides.length;
                    moverParaSlide(proximoIndice);
                }, options.atrasoAutoplay || 5000);
            }
        }

        window.addEventListener('resize', () => {
            const novaLarguraSlide = slides[0].getBoundingClientRect().width;
            trilha.style.transition = 'none';
            trilha.style.transform = `translateX(-${novaLarguraSlide * indiceAtual}px)`;
            setTimeout(() => {
                trilha.style.transition = '';
            }, 10);
        });

        if (options.autoplay) {
            resetAutoplay();
        }
    }

    setupCarrossel('carrossel-heroi', {
        autoplay: true,
        atrasoAutoplay: 4000
    });
    setupCarrossel('carrossel-depoimentos');

    // FAQ accordion
    const itensFaq = document.querySelectorAll('.item-faq');

    itensFaq.forEach(item => {
        const pergunta = item.querySelector('.pergunta-faq');
        const resposta = item.querySelector('.resposta-faq');

        pergunta.addEventListener('click', () => {
            const estavaAtivo = item.classList.contains('active');

            itensFaq.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.resposta-faq').style.maxHeight = null;
            });

            if (!estavaAtivo) {
                item.classList.add('active');
                resposta.style.maxHeight = resposta.scrollHeight + 'px';
            }
        });
    });

    // Revelar ao scroll
    const elementosRevelar = document.querySelectorAll('.revelar');

    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementosRevelar.forEach(el => {
        observador.observe(el);
    });

    // Ano no rodapé
    const anoSpan = document.getElementById('ano');
    if (anoSpan) {
        anoSpan.textContent = new Date().getFullYear();
    }
});



async function carregarCursos() {
    const url = "https://owkl9cwl.api.sanity.io/v2025-11-04/data/query/production?query=*%0A%5B_type+%3D%3D+%27curso%27%5D%0A%7B%0A++nome%2C%0A++descricao%2C%0A++%22imagemRef%22%3Aimagem.asset._ref%0A%7D&perspective=drafts"; // substitua pela URL da sua API Sanity
    const response = await fetch(url, {
        method: "GET",
    });

    const json = await response.json();
    const result = json.result;

    const gradeCartoes = document.querySelector(".grade-cartoes");
    // gradeCartoes.innerHTML = ""; // limpa os cards existentes

    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);

        // Monta a URL da imagem do Sanity
        const imagemUrl = `https://cdn.sanity.io/images/owkl9cwl/production/${element.imagemRef.split('-')[1]}-${element.imagemRef.split('-')[2]}.${element.imagemRef.split('-')[3]}`;

        // Cria os elementos
        const divCartao = document.createElement("div");
        divCartao.classList.add("cartao");

        const img = document.createElement("img");
        img.classList.add("imagens");
        img.src = imagemUrl;
        img.alt = element.nome;

        const divCorpo = document.createElement("div");
        divCorpo.classList.add("corpo-cartao");

        const h3 = document.createElement("h3");
        h3.innerText = element.nome;

        const p = document.createElement("p");
        p.innerText = element.descricao || "Descrição indisponível.";

        // Monta o card
        divCorpo.append(h3, p);
        divCartao.append(img, divCorpo);
        gradeCartoes.append(divCartao);
    }
}

carregarCursos();
