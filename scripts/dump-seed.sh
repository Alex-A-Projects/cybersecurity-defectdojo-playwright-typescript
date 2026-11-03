#!/usr/bin/env bash
# scripts/dump-seed.sh
#
# Capture the DefectDojo PostgreSQL schema (and a minimal data slice) into
# tests-db/fixtures/seed/initdb.sql — the file the DB suite expects when
# `npm run db:up && npm run db:wait && npm run test:db` runs.
#
# The public sandbox at demo.defectdojo.org does NOT expose PostgreSQL
# credentials, so this script targets a **self-hosted** DefectDojo instance
# — the easiest being the upstream docker-compose:
#
#   git clone https://github.com/DefectDojo/django-DefectDojo
#   cd django-DefectDojo
#   docker compose build && docker compose up -d
#
# Once that stack is up:
#
#   DD_DB_HOST=localhost \
#   DD_DB_PORT=5432 \
#   DD_DB_NAME=defectdojo \
#   DD_DB_USER=defectdojo \
#   DD_DB_PASSWORD=defectdojo \
#   ./scripts/dump-seed.sh
#
# Then commit the file with `git add -f tests-db/fixtures/seed/initdb.sql`.
# The DB suite's tests then run against your local DefectDojo schema.

set -euo pipefail

: "${DD_DB_HOST:=localhost}"
: "${DD_DB_PORT:=5432}"
: "${DD_DB_NAME:=defectdojo}"
: "${DD_DB_USER:=defectdojo}"
: "${DD_DB_PASSWORD:=defectdojo}"

OUT="$(dirname "$0")/../tests-db/fixtures/seed/initdb.sql"
mkdir -p "$(dirname "$OUT")"

echo "[dump-seed] Checking connectivity to ${DD_DB_USER}@${DD_DB_HOST}:${DD_DB_PORT}/${DD_DB_NAME}..."
if ! PGPASSWORD="$DD_DB_PASSWORD" psql \
    -h "$DD_DB_HOST" -p "$DD_DB_PORT" \
    -U "$DD_DB_USER" -d "$DD_DB_NAME" \
    -c "SELECT 1" >/dev/null 2>&1; then
  echo "[dump-seed] ERROR: cannot connect. Make sure the upstream DefectDojo"
  echo "             docker-compose is up and reachable at ${DD_DB_HOST}:${DD_DB_PORT}."
  exit 1
fi

echo "[dump-seed] Capturing schema (no owner / no privileges, public schema only)..."
PGPASSWORD="$DD_DB_PASSWORD" pg_dump \
  --schema=public \
  --no-owner \
  --no-privileges \
  --no-tablespace \
  --no-security-labels \
  --section=pre-data \
  -h "$DD_DB_HOST" -p "$DD_DB_PORT" \
  -U "$DD_DB_USER" -d "$DD_DB_NAME" \
  > "$OUT"

LINES=$(wc -l < "$OUT")
BYTES=$(wc -c < "$OUT")
echo "[dump-seed] Wrote $OUT — $LINES lines / $BYTES bytes."
echo "[dump-seed] Inspect it, then commit with: git add -f $OUT"
