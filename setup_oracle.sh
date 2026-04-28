#!/bin/bash

echo "🚀 Préparation de Scolaris sur Oracle Cloud..."

# Mise à jour du système
sudo apt-get update && sudo apt-get upgrade -y

# Installation de Docker si absent
if ! [ -x "$(command -v docker)" ]; then
  echo "📦 Installation de Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
fi

# Installation de Docker Compose si absent
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "📦 Installation de Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# ... (installations précédentes) ...

# Ouverture automatique des ports dans le pare-feu Linux (iptables)
echo "🛡️  Configuration du pare-feu local..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5001 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5002 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5003 -j ACCEPT

# Tentative de sauvegarde (si l'outil est présent)
if command -v netfilter-persistent &> /dev/null; then
    sudo netfilter-persistent save
fi

# Préparation du .env
if [ ! -f .env ]; then
  cp .env.production .env
  echo "⚠️  Fichier .env créé à partir de .env.production."
  echo "⚠️  Veuillez éditer le fichier .env avec vos vraies informations avant de continuer."
  exit 1
fi

# Lancement des conteneurs
echo "🏗️  Construction et lancement de Scolaris..."
sudo docker-compose up -d --build

echo "✅ Scolaris est maintenant en ligne sur Oracle Cloud !"
echo "🌐 Frontend : http://localhost"
echo "📡 Backend  : http://localhost:5001"
