const SANITY_PROJECT_ID = 'owkl9cwl';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = 'v2025-11-04';

export const ALL_CONTENT_QUERY = `{
    "carrossel": *[_type == "carrossel"][0] { 
        "imagem1Ref": imagem1.asset._ref, 
        "imagem2Ref": imagem2.asset._ref, 
        "imagem3Ref": imagem3.asset._ref 
    },
    "cursos": *[_type == "curso"] | order(nome asc) {
      nome, 
      duracao, 
      nivel, 
      "imagemRef": imagem.asset._ref
    },
    "metodologia": *[_type == "metodologia"][0] {
      "metodologiaImagem1Ref": metodologiaImagem1.asset._ref, 
      "metodologiaImagem2Ref": metodologiaImagem2.asset._ref
    },
    "feedbacks": *[_type == "feedback"] {
      depoimento,
      autor,
      "imagemAutorRef": FotoAluno.asset._ref
    },
    "faq": *[_type == "faq"][0] {
      pergunta1,
      resposta1,
      pergunta2,
      resposta2,
      pergunta3,
      resposta3
    },
    "clientes": *[_type == "cliente"] {
      Nome, 
      Telefone, 
      Email, 
      Nivel, 
      Idade 
    }
}`;

export function buildQueryUrl(groqQuery) {
    const encodedQuery = encodeURIComponent(groqQuery);
    return `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;
}

export function buildImageUrl(assetRef, width = 800) {
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