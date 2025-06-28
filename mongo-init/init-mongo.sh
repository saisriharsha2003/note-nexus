#!/bin/bash

echo "Initializing MongoDB user..."

# Use the same env vars that Docker Compose passed in
MONGO_USER="${MONGO_INITDB_ROOT_USERNAME}"
MONGO_PASSWORD="${MONGO_INITDB_ROOT_PASSWORD}"
MONGO_DB="${MONGO_INITDB_DATABASE}"

# Escape values for use in JS
q_MONGO_USER=$(jq --arg v "$MONGO_USER" -n '$v')
q_MONGO_PASSWORD=$(jq --arg v "$MONGO_PASSWORD" -n '$v')
q_MONGO_DB=$(jq --arg v "$MONGO_DB" -n '$v')

# Create the user with readWrite on the desired DB
mongosh -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase "admin" <<EOF
use $MONGO_DB;
db.createUser({
    user: $q_MONGO_USER,
    pwd: $q_MONGO_PASSWORD,
    roles: [{ role: "readWrite", db: $q_MONGO_DB }]
});
EOF
