#!/bin/bash
echo "--- Début de l'audit de maintenance ---"

echo "[1/3] Vérification des vulnérabilités (npm audit)..."
cd backend && npm audit
cd ../frontend && npm audit

echo "[2/3] Vérification des mises à jour disponibles..."
cd ../backend && npm outdated
cd ../frontend && npm outdated

echo "[3/3] Vérification de l'état des serveurs..."
lsof -i :5001 && echo "Backend (5001) OK" || echo "Backend (5001) ARRETÉ"
lsof -i :5173 && echo "Frontend (5173) OK" || echo "Frontend (5173) ARRETÉ"

echo "--- Audit terminé ---"
