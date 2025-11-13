const SANITY_PROJECT_ID = 'owkl9cwl';
const SANITY_DATASET = 'production';

function buildImageUrl(ref, width) {
    if (!ref) {
        return '';
    }
    const parts = ref.split('-');
    if (parts[0] !== 'image' || parts.length < 3) {
        console.warn('Referência de imagem Sanity mal formatada:', ref);
        return '';
    }
    const assetId = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    const filename = `${assetId}-${dimensions}.${format}`;
    let imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${filename}`;
    if (width) {
        imageUrl += `?w=${width}&auto=format`;
    } else {
        imageUrl += `?auto=format`;
    }
    return imageUrl;
}

document.addEventListener('DOMContentLoaded', () => {

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

    function setupCarrossel(carrosselId, options = {}) {
        const carrosselElemento = document.getElementById(carrosselId);
        if (!carrosselElemento) return;

        const trilha = carrosselElemento.querySelector('.trilha-heroi, .trilha-depoimentos');
        const slides = Array.from(trilha.children);
        const pontosContainer = carrosselElemento.querySelector('.pontos-carrossel');

        if (slides.length === 0) return;
        let larguraSlide = slides.length > 0 ? slides[0].getBoundingClientRect().width : window.innerWidth;
        if (larguraSlide === 0) larguraSlide = window.innerWidth;

        let indiceAtual = 0;
        let idIntervalo = null;

        if (pontosContainer) {
            pontosContainer.innerHTML = '';
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
            if (!trilha || indiceAlvo < 0 || indiceAlvo >= slides.length) return;

            larguraSlide = slides[0].getBoundingClientRect().width;

            trilha.style.transform = `translateX(-${larguraSlide * indiceAlvo}px)`;

            if (pontos.length > 0) {
                if (pontos[indiceAtual]) pontos[indiceAtual].classList.remove('active');
                if (pontos[indiceAlvo]) pontos[indiceAlvo].classList.add('active');
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
            larguraSlide = slides[0].getBoundingClientRect().width;
            trilha.style.transition = 'none';
            trilha.style.transform = `translateX(-${larguraSlide * indiceAtual}px)`;
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
    const anoSpan = document.getElementById('ano');
    if (anoSpan) {
        anoSpan.textContent = new Date().getFullYear();
    }

    async function carregarConteudoSanity() {
        console.log("Iniciando busca no Sanity...");

        const url = 'https://owkl9cwl.api.sanity.io/v2025-11-04/data/query/production?query=%7B%0A++++%22carrossel%22%3A+*%5B_type+%3D%3D+%22carrossel%22%5D%5B0%5D+%7B+%0A++++++++%22imagem1Ref%22%3A+imagem1.asset._ref%2C+%0A++++++++%22imagem2Ref%22%3A+imagem2.asset._ref%2C+%0A++++++++%22imagem3Ref%22%3A+imagem3.asset._ref+%0A++++%7D%2C%0A++++%22cursos%22%3A+*%5B_type+%3D%3D+%22curso%22%5D+%7C+order%28nome+asc%29+%7B%0A++++++nome%2C+%0A++++++duracao%2C+%0A++++++nivel%2C+%0A++++++%22imagemRef%22%3A+imagem.asset._ref%0A++++%7D%2C%0A++++%22metodologia%22%3A+*%5B_type+%3D%3D+%22metodologia%22%5D%5B0%5D+%7B%0A++++++%22metodologiaImagem1Ref%22%3A+metodologiaImagem1.asset._ref%2C+%0A++++++%22metodologiaImagem2Ref%22%3A+metodologiaImagem2.asset._ref%0A++++%7D%2C%0A++++%22feedbacks%22%3A+*%5B_type+%3D%3D+%22feedback%22%5D+%7B%0A++++++depoimento%2C+%0A++++++autor%2C+%0A++++++%22imagemAutorRef%22%3A+FotoAluno.asset._ref%0A++++%7D%2C%0A++++%22faq%22%3A+*%5B_type+%3D%3D+%22faq%22%5D%5B0%5D+%7B%0A++++++pergunta1%2C+%0A++++++resposta1%2C+%0A++++++pergunta2%2C+%0A++++++resposta2%2C+%0A++++++pergunta3%2C+%0A++++++resposta3%0A++++%7D%2C%0A++++%22clientes%22%3A+*%5B_type+%3D%3D+%22cliente%22%5D+%7B%0A++++++Nome%2C+%0A++++++Telefone%2C+%0A++++++Email%2C+%0A++++++Nivel%2C+%0A++++++Idade+%0A++++%7D%0A%7D&perspective=published';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.result) {
                console.log('Dados recebidos do Sanity:', data.result);

                popularCarrossel(data.result.carrossel);
                popularCursos(data.result.cursos);
                popularMetodologia(data.result.metodologia);
                popularFeedbacks(data.result.feedbacks);
                popularFaq(data.result.faq);
                setupCarrossel('carrossel-depoimentos');
            }

        } catch (error) {
            console.error('Erro ao buscar dados do Sanity:', error);
        }
    }

    function popularCursos(cursos) {
        if (!cursos || cursos.length === 0) {
            console.warn("PopularCursos: Nenhum curso recebido do Sanity.");
            return;
        }
        console.log("PopularCursos: Dados dos cursos recebidos:", cursos);

        const mapaCursosHtml = {
            'KIDS':'img-curso1',
            'TEENS':'img-curso2',
            'ADULTS': 'img-curso3'
        };

        cursos.forEach(curso => {
            const nomeCurso = curso.nome;
            const idElementoHtml = mapaCursosHtml[nomeCurso];

            if (idElementoHtml && curso.imagemRef) {
                const imgElement = document.getElementById(idElementoHtml);

                if (imgElement) {
                    imgElement.src = buildImageUrl(curso.imagemRef, 400);
                    console.log(`PopularCursos: Imagem para '${nomeCurso}' definida no elemento '#${idElementoHtml}'`);
                } else {
                    console.warn(`PopularCursos: O ID '#${idElementoHtml}' (para o curso '${nomeCurso}') não foi encontrado no seu HTML.`);
                }
            }
        });
    }

    function popularCarrossel(carrossel) {
        if (!carrossel) {
            console.warn("Nenhum dado de 'carrossel' recebido. Verifique se publicou no Sanity.");
            return;
        }
        const slides = document.querySelectorAll('.slide-heroi');
        if (slides.length >= 3) {
            if (carrossel.imagem1Ref) slides[0].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem1Ref, 1920)}')`;
            if (carrossel.imagem2Ref) slides[1].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem2Ref, 1920)}')`;
            if (carrossel.imagem3Ref) slides[2].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem3Ref, 1920)}')`;
        }
    }

    function popularMetodologia(metodologia) {
        if (!metodologia) return;

        if (metodologia.metodologiaImagem1Ref) {
            const imgElement1 = document.getElementById('metodologia-img-1');
            if (imgElement1) imgElement1.src = buildImageUrl(metodologia.metodologiaImagem1Ref, 600);
        }
        if (metodologia.metodologiaImagem2Ref) {
            const imgElement2 = document.getElementById('metodologia-img-2');
            if (imgElement2) imgElement2.src = buildImageUrl(metodologia.metodologiaImagem2Ref, 600);
        }
    }

    function popularFeedbacks(feedbacks) {
        if (!feedbacks || feedbacks.length === 0) {
            console.warn("Nenhum feedback recebido do Sanity.");
            return;
        }
        const cartoes = document.querySelectorAll('#depoimentos .cartao-depoimento');
        if (cartoes.length === 0) {
            console.warn("Nenhum elemento .cartao-depoimento encontrado no HTML.");
            return;
        }
        const maxItems = Math.min(cartoes.length, feedbacks.length);

        for (let i = 0; i < maxItems; i++) {
            const cartao = cartoes[i];
            const feedback = feedbacks[i];

            const p = cartao.querySelector('p');
            const img = cartao.querySelector('.autor-depoimento img');
            const strong = cartao.querySelector('.autor-depoimento strong');
            const span = cartao.querySelector('.autor-depoimento span');

            if (p && feedback.depoimento) p.textContent = feedback.depoimento;
            if (strong && feedback.autor) strong.textContent = feedback.autor;
            if (span && feedback.cargo) span.textContent = feedback.cargo;
            if (img && feedback.imagemAutorRef) {
                img.src = buildImageUrl(feedback.imagemAutorRef, 60);
                if (feedback.autor) img.alt = `Foto de ${feedback.autor}`;
            }
        }
    }

    function popularFaq(faq) {
        if (!faq) {
            console.warn("Nenhum dado de 'faq' recebido. Verifique se publicou no Sanity.");
            return;
        }

        const itensFaqHtml = document.querySelectorAll('.item-faq');

        if (itensFaqHtml.length > 0 && faq.pergunta1 && faq.resposta1) {
            itensFaqHtml[0].querySelector('.pergunta-faq span').textContent = faq.pergunta1;
            itensFaqHtml[0].querySelector('.resposta-faq p').textContent = faq.resposta1;
        }

        if (itensFaqHtml.length > 1 && faq.pergunta2 && faq.resposta2) {
            itensFaqHtml[1].querySelector('.pergunta-faq span').textContent = faq.pergunta2;
            itensFaqHtml[1].querySelector('.resposta-faq p').textContent = faq.resposta2;
        }

        if (itensFaqHtml.length > 2 && faq.pergunta3 && faq.resposta3) {
            itensFaqHtml[2].querySelector('.pergunta-faq span').textContent = faq.pergunta3;
            itensFaqHtml[2].querySelector('.resposta-faq p').textContent = faq.resposta3;
        }
    }

    carregarConteudoSanity();
});