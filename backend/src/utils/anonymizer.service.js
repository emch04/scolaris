/**
 * Service Scolaris Shield - Anonymiseur Universel
 * Protège l'identité des élèves et des écoles avant l'envoi vers des IA externes.
 */
class AnonymizerService {
  constructor() {
    this.maskMap = new Map(); // Stocke { ID_MASK: RealValue }
    this.reverseMap = new Map(); // Stocke { RealValue: ID_MASK }
  }

  /**
   * Masque les données sensibles dans un texte
   * @param {string} text 
   * @param {Array} entities - Liste d'entités réelles à masquer (Noms d'élèves, écoles)
   */
  mask(text, entities = []) {
    let maskedText = text;

    entities.forEach((entity, index) => {
      if (!entity) return;
      
      let maskId;
      if (this.reverseMap.has(entity)) {
        maskId = this.reverseMap.get(entity);
      } else {
        const type = this._guessEntityType(entity);
        maskId = `#${type}_${Math.floor(1000 + Math.random() * 9000)}`;
        this.maskMap.set(maskId, entity);
        this.reverseMap.set(entity, maskId);
      }

      // Remplacement global (insensible à la casse si besoin)
      const regex = new RegExp(this._escapeRegExp(entity), 'gi');
      maskedText = maskedText.replace(regex, maskId);
    });

    return maskedText;
  }

  /**
   * Remet les vraies valeurs dans la réponse de l'IA
   * @param {string} maskedText 
   */
  unmask(maskedText) {
    let text = maskedText;
    this.maskMap.forEach((realValue, maskId) => {
      const regex = new RegExp(maskId, 'g');
      text = text.replace(regex, realValue);
    });
    return text;
  }

  /**
   * Devine le type d'entité pour un masque plus clair
   */
  _guessEntityType(value) {
    if (value.toLowerCase().includes('école') || value.toLowerCase().includes('lycée') || value.toLowerCase().includes('complexe')) return 'ETABLISSEMENT';
    if (value.length > 15) return 'DATA';
    return 'INDIVIDU';
  }

  _escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Vide la mémoire de session (à appeler après une conversation)
   */
  clear() {
    this.maskMap.clear();
    this.reverseMap.clear();
  }
}

module.exports = new AnonymizerService();
