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
      cargo,
      "imagemAutorRef": imagem.asset._ref
    },
    "clientes": *[_type == "cliente"] {
      Nome, 
      Telefone, 
      Email, 
      Nivel, 
      Idade 
    }
}`;

/**
 * Constrói a URL completa para fazer a consulta GROQ no Sanity.
 * @param {string} groqQuery - A consulta GROQ
 * @returns {string} - A URL da API
 */
export function buildQueryUrl(groqQuery) {
    const encodedQuery = encodeURIComponent(groqQuery);
    return `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;
}

/**
 * Constrói a URL pública de uma imagem da CDN do Sanity a partir de uma referência de asset.
 * @param {string} assetRef - A referência do asset (ex: "image-a1b2c3d4-500x300-jpg")
 * @param {number} [width=800] - A largura desejada para a imagem
 * @returns {string} - A URL completa da imagem
 */
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