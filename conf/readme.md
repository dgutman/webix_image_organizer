Docker configuration to run both apps at the same by dockerized nginx.

To run:
1. change `server_name` properties to your domain names in custom.conf (for https: https.conf);
2. make sure 80 and/or 443 ports are available;
(don't forget to change `.env` file at` tagger/tagger-for-david` directory)
3. `run docker-compose up -d --build`;

To configure https and run:
1. change server_name properties to your domain names in https.conf;
2. in `docker-compose.yml` file for nginx service replace `./conf/nginx/custom.conf` by `./conf/nginx/https.conf volume`;
3. get certbot with additional packages and crontab (or similar);
4. run `certbot --standalone -d your.server.url` command to get the SSL certificate;
5. make sure 80 and 443 ports are available;
(don't forget to change` .env` file at `tagger/tagger-for-david` directory)
6. run `docker-compose up -d --build`;

To renew the cert:
`certbot renew --pre-hook "docker-compose -f path/to/docker-compose.yml down" --post-hook "docker-compose -f path/to/docker-compose.yml up -d"`

To complete the automation simply add the previous command as a cronjob.
Open the cron file with `crontab -e`
In there add a new line with (for example):
`@daily certbot renew --pre-hook "docker-compose -f path/to/docker-compose.yml down" --post-hook "docker-compose -f path/to/docker-compose.yml up -d"`
this will update the cert daily.