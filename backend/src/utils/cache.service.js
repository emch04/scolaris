/**
 * @file cache.service.js
 * @description Service de mise en cache hybride (Redis ou Mémoire locale).
 */

const { createClient } = require('redis');

let redisClient = null;
const localCache = new Map();
const MAX_CACHE_SIZE = 100; // Limite le nombre d'objets pour économiser la RAM

// Nettoyage automatique du cache expiré toutes les 60 secondes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of localCache.entries()) {
    if (now > value.expireAt) localCache.delete(key);
  }
  // Si le cache est trop gros, on vide les plus vieux
  if (localCache.size > MAX_CACHE_SIZE) {
    const oldestKey = localCache.keys().next().value;
    localCache.delete(oldestKey);
  }
}, 60000);

/**
 * Initialise la connexion Redis si possible.
 */
const initCache = async () => {
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err) => console.warn('Erreur Redis Cache:', err));
      await redisClient.connect();
      console.log('⚡ Redis Cache Connecté');
    } catch (err) {
      console.warn('Impossible de connecter Redis, passage en mode cache local.');
      redisClient = null;
    }
  }
};

/**
 * Enregistre une valeur dans le cache.
 * @param {string} key - Clé unique.
 * @param {any} value - Donnée à stocker.
 * @param {number} ttl - Durée de vie en secondes (défaut 300s / 5min).
 */
const setCache = async (key, value, ttl = 300) => {
  const data = JSON.stringify(value);
  
  if (redisClient?.isOpen) {
    await redisClient.set(key, data, { EX: ttl });
  } else {
    localCache.set(key, {
      data,
      expireAt: Date.now() + (ttl * 1000)
    });
  }
};

/**
 * Récupère une valeur depuis le cache.
 * @param {string} key - Clé unique.
 */
const getCache = async (key) => {
  if (redisClient?.isOpen) {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } else {
    const cached = localCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expireAt) {
      localCache.delete(key);
      return null;
    }
    return JSON.parse(cached.data);
  }
};

/**
 * Supprime une clé du cache.
 */
const deleteCache = async (key) => {
  if (redisClient?.isOpen) {
    await redisClient.del(key);
  } else {
    localCache.delete(key);
  }
};

/**
 * Vide tout le cache.
 */
const clearCache = async () => {
  if (redisClient?.isOpen) {
    await redisClient.flushAll();
  } else {
    localCache.clear();
  }
};

module.exports = {
  initCache,
  setCache,
  getCache,
  deleteCache,
  clearCache
};
