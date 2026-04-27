#!/bin/bash

# Scolaris BlackBox Daemon - Surveillance 24/7 (V2)
# Seuils : RAM > 90% | Disque < 10GB | CPU Load > 80%

LOG_FILE="/Users/emchkongo/scolaris/backend/logs/blackbox.log"
mkdir -p "$(dirname "$LOG_FILE")"

check_health() {
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    
    # 1. ANALYSE RAM
    FREE_PAGES=$(vm_stat | grep "free" | awk '{print $3}' | sed 's/\.//')
    INACTIVE_PAGES=$(vm_stat | grep "inactive" | awk '{print $3}' | sed 's/\.//')
    SPECULATIVE_PAGES=$(vm_stat | grep "speculative" | awk '{print $3}' | sed 's/\.//')
    PAGE_SIZE=$(pagesize)
    AVAILABLE_MEM=$(( (FREE_PAGES + INACTIVE_PAGES + SPECULATIVE_PAGES) * PAGE_SIZE / 1024 / 1024 ))
    TOTAL_MEM=$(sysctl hw.memsize | awk '{print $2 / 1024 / 1024}')
    USED_RAM_PERCENT=$(( 100 - (AVAILABLE_MEM * 100 / TOTAL_MEM) ))

    # 2. ANALYSE DISQUE (Espace sur la partition principale)
    DISK_FREE_GB=$(df -h / | tail -1 | awk '{print $4}' | sed 's/Gi//')
    DISK_PERCENT=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')

    # 3. ANALYSE CPU (Charge sur 1 minute)
    CPU_LOAD=$(sysctl -n vm.loadavg | awk '{print $2}')
    CPU_CORES=$(sysctl -n hw.ncpu)
    # On considère une charge élevée si le load > nombre de coeurs
    CPU_CRITICAL=$(echo "$CPU_LOAD > $CPU_CORES" | bc -l)

    # --- LOGIQUE D'ALERTE ---
    MESSAGE=""
    
    if [ "$USED_RAM_PERCENT" -gt 90 ]; then
        MESSAGE="RAM critique ($USED_RAM_PERCENT%)"
    fi

    if [ "${DISK_FREE_GB%.*}" -lt 10 ]; then
        MESSAGE="${MESSAGE} Espace disque faible (${DISK_FREE_GB}GB)"
    fi

    # Journalisation
    echo "[$TIMESTAMP] STATUS: RAM ${USED_RAM_PERCENT}% | Disk ${DISK_FREE_GB}GB free | Load ${CPU_LOAD}" >> "$LOG_FILE"

    # Notification si problème
    if [ ! -z "$MESSAGE" ]; then
        osascript -e "display notification \"$MESSAGE\" with title \"🤖 Scolaris BlackBox\" subtitle \"Alerte de santé système\""
    fi
}

check_health
