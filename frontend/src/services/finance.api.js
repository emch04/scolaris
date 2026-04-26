import apiClient from "./apiClient";

/**
 * Récupère les statistiques de trésorerie (Entrées/Sorties).
 */
export const getTreasuryStatsRequest = async () => (await apiClient.get("/finance/treasury")).data;

/**
 * Récupère la liste des paiements.
 */
export const getPaymentsRequest = async () => (await apiClient.get("/finance/payments")).data;

/**
 * Récupère les types de frais configurés pour l'école.
 */
export const getFeesRequest = async () => (await apiClient.get("/finance/fees-list")).data;

/**
 * Crée un nouveau type de frais (Minerval, Inscription).
 */
export const createFeeRequest = async (feeData) => (await apiClient.post("/finance/fees", feeData)).data;

/**
 * Enregistre un paiement reçu d'un élève.
 */
export const recordPaymentRequest = async (paymentData) => (await apiClient.post("/finance/payments", paymentData)).data;

/**
 * Enregistre un paiement de salaire.
 */
export const paySalaryRequest = async (salaryData) => (await apiClient.post("/finance/salaries", salaryData)).data;
