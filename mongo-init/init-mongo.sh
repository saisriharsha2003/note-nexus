#!/bin/bash

mongosh <<EOF
use ${MONGO_INITDB_DATABASE}

const user = db.getUser("${MONGO_INITDB_ROOT_USERNAME}");
if (!user) {
  db.createUser({
    user: "${MONGO_INITDB_ROOT_USERNAME}",
    pwd: "${MONGO_INITDB_ROOT_PASSWORD}",
    roles: [{ role: "readWrite", db: "${MONGO_INITDB_DATABASE}" }]
  });
}

db.init.insertOne({ initializedAt: new Date() });
EOF
