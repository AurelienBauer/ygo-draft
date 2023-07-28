#!/bin/bash

# install nginx
yum update
yum install nginx -y

# Configure nginx
cat > /etc/nginx/nginx.conf <<-END
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;

        include /etc/nginx/default.d/*.conf;

        location /socket.io {
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://${app-back-ipv4}/socket.io;

                proxy_redirect off;

                proxy_http_version 1.1;
                proxy_set_header Connection "upgrade";
        }

        location /api/ {
                proxy_pass http://${app-back-ipv4}/;
        }

        location / {
                proxy_pass http://${app-front-ipv4};
        }
    }
}
END

# Run nginx
nginx

