// ============================================
// CONFIGURAÇÃO DA API EXTERNA
// ============================================
// Substitua esta URL pela sua API que retorna os dados
const API_URL = 'https://owkl9cwl.api.sanity.io/v2025-11-14/data/query/production?query=%7B%0A++++%22carrossel%22%3A+*%5B_type+%3D%3D+%22carrossel%22%5D%5B0%5D+%7B+%0A++++++++%22imagem1Ref%22%3A+imagem1.asset._ref%2C+%0A++++++++%22imagem2Ref%22%3A+imagem2.asset._ref%2C+%0A++++++++%22imagem3Ref%22%3A+imagem3.asset._ref+%0A++++%7D%2C%0A++++%22cursos%22%3A+*%5B_type+%3D%3D+%22curso%22%5D+%7C+order%28nome+asc%29+%7B%0A++++++nome%2C+%0A++++++descricao%2C%0A++++++%22imagemRef%22%3A+imagem.asset._ref%0A++++%7D%2C%0A++++%22metodologia%22%3A+*%5B_type+%3D%3D+%22metodologia%22%5D%5B0%5D+%7B%0A++++++%22metodologiaImagem1Ref%22%3A+metodologiaImagem1.asset._ref%2C+%0A++++++%22metodologiaImagem2Ref%22%3A+metodologiaImagem2.asset._ref%2C%0A++++++titulo1%2C%0A++++++descricao1%2C%0A++++++titulo2%2C%0A++++++descricao2%2C%0A++++++titulo3%2C%0A++++++descricao3%2C%0A++++%7D%2C%0A++++%22feedbacks%22%3A+*%5B_type+%3D%3D+%22feedback%22%5D+%7B%0A++++++depoimento%2C%0A++++++autor%2C%0A++++++%22FotoAluno%22%3A+FotoAluno.asset._ref%0A++++%7D%2C%0A++++%22faq%22%3A+*%5B_type+%3D%3D+%22faq%22%5D+%7B%0A++++++pergunta1%2C%0A++++++resposta1%2C%0A++++++pergunta2%2C%0A++++++resposta2%2C%0A++++++pergunta3%2C%0A++++++resposta3%2C%0A++++%7D%0A%7D&perspective=drafts';
// Se sua API precisar de autenticação, configure aqui
const API_HEADERS = {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer seu-token-aqui'
};

// ============================================
// FUNÇÕES AUXILIARES PARA IMAGENS
// ============================================
const SANITY_PROJECT_ID = 'owkl9cwl';
const SANITY_DATASET = 'production';

/**
 * Constrói a URL pública de uma imagem da CDN do Sanity
 */
function buildImageUrl(assetRef, width = 800) {
    if (!assetRef || typeof assetRef !== 'string' || !assetRef.startsWith('image-')) {
        console.warn('Asset reference inválido:', assetRef);
        return '';
    }
    const imageIdAndFormat = assetRef.substring(6);
    const lastDashIndex = imageIdAndFormat.lastIndexOf('-');
    if (lastDashIndex === -1) {
        console.warn('Formato de asset reference inválido:', assetRef);
        return '';
    }
    const filename = imageIdAndFormat.substring(0, lastDashIndex) + '.' + imageIdAndFormat.substring(lastDashIndex + 1);
    return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${filename}?w=${width}&auto=format&fit=crop`;
}

// ============================================
// INICIALIZAÇÃO DO DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
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

    // Modal de Matrícula
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

    // Setup do carrossel hero
    setupCarrossel('carrossel-heroi', { autoplay: true, atrasoAutoplay: 4000 });

    // FAQ Accordion
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

    // Scroll Reveal
    const elementosRevelar = document.querySelectorAll('.revelar');
    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });
    elementosRevelar.forEach(el => observador.observe(el));

    // Ano no rodapé
    const anoSpan = document.getElementById('ano');
    if (anoSpan) anoSpan.textContent = new Date().getFullYear();

    // Carrega conteúdo da API
    carregarConteudoAPI();
});

// ============================================
// FUNÇÃO PRINCIPAL - BUSCA NA API
// ============================================
async function carregarConteudoAPI() {
    console.log("Iniciando busca na API...");

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: API_HEADERS
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Dados recebidos da API:', data);

        // A API do Sanity retorna os dados dentro de data.result
        if (data && data.result) {
            popularCarrossel(data.result.carrossel);
            popularCursos(data.result.cursos);
            popularMetodologia(data.result.metodologia);
            popularFeedbacks(data.result.feedbacks);
            popularFaq(data.result.faq);
            setupCarrossel('carrossel-depoimentos');
        } else {
            console.warn('Estrutura de dados inesperada:', data);
        }
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

// ============================================
// FUNÇÃO DE CARROSSEL
// ============================================
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

    if (options.autoplay) resetAutoplay();
}

// ============================================
// FUNÇÕES DE POPULAÇÃO DE CONTEÚDO
// ============================================
function popularCursos(cursos) {
    if (!cursos || cursos.length === 0) {
        console.warn("Nenhum curso recebido.");
        return;
    }

    const gradeCartoes = document.querySelector('#cursos .grade-cartoes');
    if (!gradeCartoes) {
        console.warn("Container de cursos não encontrado.");
        return;
    }

    // Limpa o conteúdo atual
    gradeCartoes.innerHTML = '';

    // Cria um card para cada curso
    cursos.forEach(curso => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao';

        const img = document.createElement('img');
        img.className = 'img-cartao';
        img.alt = `Imagem do curso ${curso.nome}`;
        if (curso.imagemRef) {
            img.src = buildImageUrl(curso.imagemRef, 400);
        }

        const corpoCartao = document.createElement('div');
        corpoCartao.className = 'corpo-cartao';

        const titulo = document.createElement('h3');
        titulo.textContent = curso.nome;

        const descricao = document.createElement('p');
        // Se a API fornecer descrição, use-a; caso contrário, use uma descrição padrão
        descricao.textContent = curso.descricao || `Conheça nosso curso de ${curso.nome}.`;

        corpoCartao.appendChild(titulo);
        corpoCartao.appendChild(descricao);

        cartao.appendChild(img);
        cartao.appendChild(corpoCartao);

        gradeCartoes.appendChild(cartao);
    });
}

function popularCarrossel(carrossel) {
    if (!carrossel) {
        console.warn("Nenhum dado de 'carrossel' recebido.");
        return;
    }

    const slides = document.querySelectorAll('.slide-heroi');
    if (slides.length >= 3) {
        if (carrossel.imagem1Ref) {
            slides[0].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem1Ref, 1920)}')`;
        }
        if (carrossel.imagem2Ref) {
            slides[1].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem2Ref, 1920)}')`;
        }
        if (carrossel.imagem3Ref) {
            slides[2].style.backgroundImage = `url('${buildImageUrl(carrossel.imagem3Ref, 1920)}')`;
        }
    }
}

function popularFeedbacks(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) {
        console.warn("Nenhum feedback recebido.");
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
        if (img && feedback.FotoAluno) {
            img.src = buildImageUrl(feedback.FotoAluno, 60);
            if (feedback.autor) img.alt = `Foto de ${feedback.autor}`;
        }
    }
}

function popularFaq(faqList) {
    if (!faqList || faqList.length === 0) {
        console.warn("Nenhum FAQ recebido.");
        return;
    }

    const containerFaq = document.querySelector('#faq .lista-faq');

    if (!containerFaq) {
        console.warn("Container FAQ não encontrado no HTML.");
        return;
    }

    containerFaq.innerHTML = '';

    faqList.forEach(faq => {
        for (let i = 1; i <= 3; i++) {
            const pergunta = faq[`pergunta${i}`];
            const resposta = faq[`resposta${i}`];

            if (pergunta && resposta) {
                const item = document.createElement('div');
                item.className = 'item-faq';

                const perguntaBtn = document.createElement('button');
                perguntaBtn.className = 'pergunta-faq';
                perguntaBtn.innerHTML = `
                    <span>${pergunta}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-faq">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                `;

                const respostaDiv = document.createElement('div');
                respostaDiv.className = 'resposta-faq';
                respostaDiv.innerHTML = `<p>${resposta}</p>`;

                item.appendChild(perguntaBtn);
                item.appendChild(respostaDiv);
                containerFaq.appendChild(item);

                // Comportamento de acordeão
                perguntaBtn.addEventListener('click', () => {
                    const ativo = item.classList.contains('active');

                    document.querySelectorAll('.item-faq').forEach(i => {
                        i.classList.remove('active');
                        i.querySelector('.resposta-faq').style.maxHeight = null;
                    });

                    if (!ativo) {
                        item.classList.add('active');
                        respostaDiv.style.maxHeight = respostaDiv.scrollHeight + 'px';
                    }
                });
            }
        }
    });
}

function popularMetodologia(metodologia) {
    if (!metodologia) {
        console.warn("Nenhum dado de 'metodologia' recebido.");
        return;
    }

    // Atualiza as imagens
    if (metodologia.metodologiaImagem1Ref) {
        const imgElement1 = document.getElementById('metodologia-img-1');
        if (imgElement1) {
            imgElement1.src = buildImageUrl(metodologia.metodologiaImagem1Ref, 600);
            imgElement1.style.display = 'block';
        }
    }

    if (metodologia.metodologiaImagem2Ref) {
        const imgElement2 = document.getElementById('metodologia-img-2');
        if (imgElement2) {
            imgElement2.src = buildImageUrl(metodologia.metodologiaImagem2Ref, 600);
            imgElement2.style.display = 'block';
        }
    }

    // Atualiza os textos dos itens de destaque
    const itensDestaque = document.querySelectorAll('.item-destaque');

    if (itensDestaque.length >= 3) {
        // Item 1 - Conversação
        const h3_1 = itensDestaque[0].querySelector('h3');
        const p_1 = itensDestaque[0].querySelector('p');
        if (h3_1 && metodologia.titulo1) h3_1.textContent = metodologia.titulo1;
        if (p_1 && metodologia.descricao1) p_1.textContent = metodologia.descricao1;

        // Item 2 - Turmas Reduzidas
        const h3_2 = itensDestaque[1].querySelector('h3');
        const p_2 = itensDestaque[1].querySelector('p');
        if (h3_2 && metodologia.titulo2) h3_2.textContent = metodologia.titulo2;
        if (p_2 && metodologia.descricao2) p_2.textContent = metodologia.descricao2;

        // Item 3 - Material Didático
        const h3_3 = itensDestaque[2].querySelector('h3');
        const p_3 = itensDestaque[2].querySelector('p');
        if (h3_3 && metodologia.titulo3) h3_3.textContent = metodologia.titulo3;
        if (p_3 && metodologia.descricao3) p_3.textContent = metodologia.descricao3;
    } else {
        console.warn(`Esperado 3 itens de destaque, mas encontrado ${itensDestaque.length}`);
    }
}