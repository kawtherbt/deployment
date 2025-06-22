#!/bin/bash
 # Stop on error
$ErrorActionPreference = "Stop"

$env:PGPASSWORD = 'password1'

# 1. Dump de la base locale au format custom
pg_dump --clean --if-exists -h localhost -U admin1 -d planit-kawther -p 5432 -F c -f db.dump

# 2. Restore dans la base Aurora avec logs
pg_restore -h planit-cluster.cluster-cktquqcaasvx.us-east-1.rds.amazonaws.com `
  -U admin1 `
  -d dbplanit `
  -p 5432 `       
  -v db.dump
  

# Write-Host "📤 Dumping local PostgreSQL..."
# $env:PGPASSWORD='password1'
# pg_dump -h localhost -U admin1 -d planit-kawther -p 5432 | `
# psql -h planit-cluster.cluster-cktquqcaasvx.us-east-1.rds.amazonaws.com -U admin1 -d planit -p 5432
# # psql -h localhost -U admin1 -d planit-kawther -p 5432
# # pg_dump -h localhost -U admin1 -d planit-kawther -p 5432 -f "$PWD\db.sql"

# # Write-Host "📥 Restoring to Aurora via Airbyte (host.docker.internal)..."
# # $env:PGPASSWORD='password1'
# # psql -h planit-cluster.cluster-cktquqcaasvx.us-east-1.rds.amazonaws.com -U admin1 -d planit -p 5432 -f "$PWD\db.sql"
# #pg_restore -h planit-cluster.cluster-cktquqcaasvx.us-east-1.rds.amazonaws.com -U admin1 -d planit -p 5432 -f db.sql

Write-Host "✅ Sync terminé avec succès."
