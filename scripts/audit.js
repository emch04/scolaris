/**
 * @file audit.js
 * @description Script de détection d'erreurs potentielles dans le projet Scolaris.
 * Usage: node scripts/audit.js
 */

const fs = require('fs');
const path = require('path');

const BACKEND_PATH = path.join(__dirname, '../backend/src');
const FRONTEND_PATH = path.join(__dirname, '../frontend/src');
const IA_PATH = path.join(__dirname, '../scolaris-ia-repo/src');

console.log("\x1b[34m%s\x1b[0m", "🔍 Démarrage de l'audit Scolaris...");

/**
 * Audit de Synchronisation des Modèles (Backend vs IA)
 */
function auditModelSync() {
  console.log("\n\x1b[33m%s\x1b[0m", "--- Audit Sync Modèles (Backend <=> IA) ---");
  
  const modelMapping = [
    { backend: 'modules/students/student.model.js', ia: 'models/student.model.js' },
    { backend: 'modules/schools/school.model.js', ia: 'models/school.model.js' },
    { backend: 'modules/results/result.model.js', ia: 'models/result.model.js' },
    { backend: 'modules/logs/log.model.js', ia: 'models/log.model.js' },
    { backend: 'modules/teachers/teacher.model.js', ia: 'models/teacher.model.js' },
    { backend: 'modules/attendance/attendance.model.js', ia: 'models/attendance.model.js' },
    { backend: 'modules/classrooms/classroom.model.js', ia: 'models/classroom.model.js' },
    { backend: 'modules/logs/snapshot.model.js', ia: 'models/snapshot.model.js' },
    { backend: 'modules/logs/chat.model.js', ia: 'models/chat.model.js' }
  ];

  modelMapping.forEach(pair => {
    const bPath = path.join(BACKEND_PATH, pair.backend);
    const iPath = path.join(IA_PATH, pair.ia);

    if (fs.existsSync(bPath) && fs.existsSync(iPath)) {
      // On compare le contenu en ignorant les chemins de require qui peuvent varier
      const cleanContent = (str) => str.replace(/\s/g, '').replace(/require\(["']\.\.?\/.*?["']\)/g, 'require("normalized")');
      
      const bContent = cleanContent(fs.readFileSync(bPath, 'utf8'));
      const iContent = cleanContent(fs.readFileSync(iPath, 'utf8'));

      if (bContent !== iContent) {
        console.warn(`\x1b[31m[SYNC ERROR]\x1b[0m Le modèle ${pair.ia} est désynchronisé du backend !`);
        console.log(`   - Backend: ${pair.backend}`);
        console.log(`   - IA: ${pair.ia}`);
      } else {
        console.log(`\x1b[32m[OK]\x1b[0m ${pair.ia} est bien synchronisé.`);
      }
    } else {
      if (!fs.existsSync(bPath)) console.error(`\x1b[31m[FILE MISSING]\x1b[0m Fichier backend introuvable: ${pair.backend}`);
      if (!fs.existsSync(iPath)) console.error(`\x1b[31m[FILE MISSING]\x1b[0m Fichier IA introuvable: ${pair.ia}`);
    }
  });
}

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

auditModelSync();
auditBackend();
auditFrontend();

console.log("\n\x1b[32m%s\x1b[0m", "✅ Audit terminé.");
