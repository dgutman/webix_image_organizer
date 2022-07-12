#!/bin/bash
set -e

# dbUser is the userName used from applicatoin code to interact with databases and dbPwd is the password for this user.
# MONGO_INITDB_ROOT_USERNAME & MONGO_INITDB_ROOT_PASSWORD is the config for db admin.
# admin user is expected to be already created when this script executes. We use it here to authenticate as admin to create
# dbUser and databases.

echo ">>>>>>> trying to create database and users"
if [ -n "${MONGO_INITDB_ROOT_USERNAME:-}" ] && [ -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ] && [ -n "${MONGODB_USER:-}" ] && [ -n "${MONGODB_PASSWORD:-}" ]; then
mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD<<EOF



use '$MONGODB_DATABASE';
db['Test'].insertOne({'HELLO':'WORLD'})

db.createUser({
  user:  '$MONGODB_USER',
  pwd: '$MONGODB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGODB_DATABASE'
  }]
});


use admin;
db.createUser({
  user:  '$MONGODB_USER',
  pwd: '$MONGODB_PASSWORD',
  roles: [{
    role: 'admin',
    db: 'admin'
  }]
});

EOF
else
    echo "MONGODB_INITDB_ROOT_USERNAME,MONGODB_INITDB_ROOT_PASSWORD,MONGODB_USER and MONGODB_PASSWORD must be provided. Some of these are missing, hence exiting database and user creatioin"
    exit 403
fi
