#!/bin/bash
# Script de déploiement automatique vers Oracle Cloud

IP="130.61.178.59"
KEY="oracle_key.key"
ARCHIVE="scolaris.tar.gz"

echo "📤 Envoi du projet vers Oracle Cloud ($IP)..."
scp -i $KEY $ARCHIVE ubuntu@$IP:~/

if [ $? -eq 0 ]; then
    echo "✅ Envoi réussi !"
    echo "👉 Maintenant, connecte-toi avec : ssh -i $KEY ubuntu@$IP"
    echo "👉 Puis tape : tar -xzf $ARCHIVE && chmod +x setup_oracle.sh && ./setup_oracle.sh"
else
    echo "❌ L'envoi a échoué. Vérifie que tu es bien connecté à Internet."
fi
