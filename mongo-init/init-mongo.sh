#!/bin/bash

mongosh <<'EOF'
use note-nexus

const user = db.getUser("arjunsai2035");
if (!user) {
  db.createUser({
    user: "arjunsai2035",
    pwd: "ArjunSai@2035",
    roles: [{ role: "readWrite", db: "note-nexus" }]
  });
}

db.init.insertOne({ initializedAt: new Date() });
EOF
