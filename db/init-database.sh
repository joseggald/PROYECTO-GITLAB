#!/bin/bash
echo "Esperando a que PostgreSQL esté listo..."
until psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT 1" &>/dev/null; do
  sleep 2
done
echo "PostgreSQL está listo, ejecutando script..."
psql -U ${DB_USER} -d ${DB_NAME} -f /docker-entrypoint-initdb.d/migrations/01_init.sql