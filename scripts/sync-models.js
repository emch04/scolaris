/**
 * @file sync-models.js
 * @description Script d'automatisation pour synchroniser les modèles Mongoose 
 * du Backend vers le service IA.
 * Usage: node scripts/sync-models.js
 */

const fs = require('fs');
const path = require('path');

const BACKEND_BASE = path.join(__dirname, '../backend/src');
const IA_BASE = path.join(__dirname, '../scolaris-ia-repo/src');

const mapping = [
  { from: 'modules/students/student.model.js', to: 'models/student.model.js' },
  { from: 'modules/schools/school.model.js', to: 'models/school.model.js' },
  { from: 'modules/results/result.model.js', to: 'models/result.model.js' },
  { from: 'modules/logs/log.model.js', to: 'models/log.model.js' },
  { from: 'modules/teachers/teacher.model.js', to: 'models/teacher.model.js' },
  { from: 'modules/attendance/attendance.model.js', to: 'models/attendance.model.js' },
  { from: 'modules/classrooms/classroom.model.js', to: 'models/classroom.model.js' },
  { from: 'modules/logs/snapshot.model.js', to: 'models/snapshot.model.js' },
  { from: 'modules/logs/chat.model.js', to: 'models/chat.model.js' }
];

console.log("\x1b[34m%s\x1b[0m", "🔄 Synchronisation des modèles Backend -> IA...");

mapping.forEach(pair => {
  const srcPath = path.join(BACKEND_BASE, pair.from);
  const destPath = path.join(IA_BASE, pair.to);

  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');

    // Ajustement des chemins d'importation (on remonte d'un niveau de moins dans l'IA)
    // "../../utils/" devient "../utils/"
    // "../../constants/" devient "../constants/"
    content = content.replace(/\.\.\/\.\.\/utils\//g, '../utils/');
    content = content.replace(/\.\.\/\.\.\/constants\//g, '../constants/');

    fs.writeFileSync(destPath, content);
    console.log(`\x1b[32m[OK]\x1b[0m ${pair.to} mis à jour.`);
  } else {
    console.error(`\x1b[31m[ERROR]\x1b[0m Source introuvable : ${pair.from}`);
  }
});

console.log("\x1b[32m%s\x1b[0m", "✨ Synchronisation terminée avec succès.");
