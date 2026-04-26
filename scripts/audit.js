/**
 * @file audit.js
 * @description Script de détection d'erreurs potentielles dans le projet Scolaris.
 * Usage: node scripts/audit.js
 */

const fs = require('fs');
const path = require('path');

const BACKEND_PATH = path.join(__dirname, '../backend/src');
const FRONTEND_PATH = path.join(__dirname, '../frontend/src');

console.log("\x1b[34m%s\x1b[0m", "🔍 Démarrage de l'audit Scolaris...");

/**
 * Audit du Backend
 */
function auditBackend() {
  console.log("\n\x1b[33m%s\x1b[0m", "--- Audit Backend ---");
  const modulesDir = path.join(BACKEND_PATH, 'modules');
  
  if (!fs.existsSync(modulesDir)) return;

  const modules = fs.readdirSync(modulesDir);
  
  modules.forEach(mod => {
    const servicePath = path.join(modulesDir, mod, `${mod.slice(0, -1)}.service.js`);
    if (fs.existsSync(servicePath)) {
      const content = fs.readFileSync(servicePath, 'utf8');
      
      // 1. Vérifier si les fonctions "count" sont bien exportées
      const countFunctions = content.match(/const (count\w+) = async/g);
      if (countFunctions) {
        countFunctions.forEach(funcLine => {
          const funcName = funcLine.split(' ')[1];
          if (!content.includes(`${funcName},`) && !content.includes(`${funcName} `)) {
            console.warn(`\x1b[31m[BACKEND ERROR]\x1b[0m La fonction ${funcName} dans ${mod} semble ne pas être exportée !`);
          }
        });
      }
    }
  });
}

/**
 * Audit du Frontend
 */
function auditFrontend() {
  console.log("\n\x1b[33m%s\x1b[0m", "--- Audit Frontend ---");
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Détecter les .map() risqués sur res.data (potentiellement paginé)
        if (content.includes('res.data.map') || content.includes('response.data.map')) {
          console.warn(`\x1b[31m[FRONTEND RISK]\x1b[0m ${file}: Utilisation directe de res.data.map(). Risque d'erreur avec la pagination (utilisez res.data.students ou res.data.classrooms).`);
        }

        // 2. Détecter les alert() oubliés (préférer Toast)
        if (content.includes('alert(')) {
          console.log(`\x1b[36m[FRONTEND INFO]\x1b[0m ${file}: Contient des alert(). Pensez à utiliser useToast() pour une meilleure UI.`);
        }

        // 3. Détecter les console.error sans traitement
        if (content.includes('console.error(') && !content.includes('showToast')) {
          console.log(`\x1b[36m[FRONTEND INFO]\x1b[0m ${file}: Contient console.error() sans notification utilisateur (Toast).`);
        }
      }
    });
  }

  if (fs.existsSync(FRONTEND_PATH)) {
    walk(FRONTEND_PATH);
  }
}

auditBackend();
auditFrontend();

console.log("\n\x1b[32m%s\x1b[0m", "✅ Audit terminé.");
