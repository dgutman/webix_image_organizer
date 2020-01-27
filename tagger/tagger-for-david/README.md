# David Gutman/Tagger

-To Start:
-npm install
-npm run build (for the first start)
-npm start
-npm run server



# Tagger deploy guide:
1. Before deploying tagger app on testing server make sure you have MongoDB, Node.js, pm2 and NGINX instances on it;
2. Download your project folder to the server;
3. Go to this folder;
4. Then change TAGGER_API_PATH and SECRET_KEY variables in .env file to your own. TAGGER_API_PATH should be like: “http://<your_server_name>:<your_port>/api”;
5. npm install;
6. npm run build;
7. pm2 start sources/server/tagger (To initialize tagger API);
8. Go to “etc/nginx/nginx.conf” and make sure you have
9. “include etc/nginx/sites-enabled/*” line in http module;
10. Go to “etc/nginx/sites-enabled” and add tagger.conf file with this configuration:
    server {
        listen 80;
        server_name <your_server_name>;

            access_log on;
            access_log /var/log/nginx/tagger-access.log;
            error_log /var/log/nginx/tagger-error.log;

        location / {
                root <path/to/project/directory>/codebase;
        }


        location /api {
                    proxy_pass http://127.0.0.1:4000;
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
    }

11. service nginx start.
