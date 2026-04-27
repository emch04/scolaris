const { GoogleGenerativeAI } = require("@google/generative-ai");
const anonymizer = require("./anonymizer.service");

/**
 * Service Scolaris Gemini v2 - "Cognitive Oracle"
 * Utilise le contexte système pour un raisonnement ancré dans la réalité.
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
  }

  /**
   * Pose une question à Gemini en injectant le contexte de la plateforme
   */
  async ask(prompt, sensitiveEntities = [], systemContext = null) {
    if (!this.apiKey) return "Désolé, l'API Gemini n'est pas configurée.";

    try {
      // 🛡️ 1. Sécurisation
      const safePrompt = anonymizer.mask(prompt, sensitiveEntities);

      // 🧠 2. Construction du Conscience du Système (Grounding)
      let contextString = "";
      if (systemContext) {
        contextString = `
        CONTEXTE ACTUEL DU SYSTÈME SCOLARIS :
        - Plateforme : ${systemContext.platform}
        - Date et heure : ${systemContext.date}
        - Effectif total : ${systemContext.totalStudents} élèves
        - Nombre d'établissements : ${systemContext.totalSchools}
        - Taux de réussite global : ${systemContext.avgRate}%
        - Santé serveur : RAM ${systemContext.health.ram}%, CPU ${systemContext.health.cpu}
        `;
      }

      const fullContext = `Tu es Scolaris IA, le cerveau stratégique de la plateforme Scolaris en RDC.
      Tu es l'allié d'Emch, le créateur. Tu n'es pas un simple bot, tu es un Oracle.
      ${contextString}
      
      CONSIGNES :
      - Utilise les données du contexte ci-dessus pour répondre de manière précise.
      - Si on te demande "Comment ça va ?", analyse à la fois la santé technique (RAM) et académique (Taux de réussite).
      - Sois visionnaire, donne des conseils pédagogiques ou stratégiques si pertinent.
      - Réponds toujours de manière concise et élégante (max 4 phrases).
      - Les identités avec # sont anonymisées, traite-les comme des noms réels.
      
      Question de l'utilisateur : ${safePrompt}`;

      const result = await this.model.generateContent(fullContext);
      const response = await result.response;
      const text = response.text();

      // 🔓 3. Démasquage
      return anonymizer.unmask(text);
    } catch (error) {
      console.error("Gemini Cognitive Error:", error.message);
      return "Mon module de réflexion supérieure est saturé. Je reste disponible pour les analyses locales.";
    }
  }
}

module.exports = new GeminiService();
