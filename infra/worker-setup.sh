#!/bin/bash

SUBDOMAIN=$1
DOMAIN="lexobot-ai.com"
FULL_DOMAIN="www.${SUBDOMAIN}.${DOMAIN}"
EMAIL="alejandro.grajal.s@gmail.com"


sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

NGINX_CONF="/etc/nginx/sites-available/${FULL_DOMAIN}"

sudo bash -c "cat > ${NGINX_CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SUBDOMAIN}.${DOMAIN};

    return 301 https://${FULL_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${SUBDOMAIN}.${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${FULL_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${FULL_DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://${FULL_DOMAIN}\$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${FULL_DOMAIN};

    return 301 https://${FULL_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${FULL_DOMAIN};

    client_max_body_size 10M;

    ssl_certificate /etc/letsencrypt/live/${FULL_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${FULL_DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -s ${NGINX_CONF} /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d ${FULL_DOMAIN} -d ${SUBDOMAIN}.${DOMAIN} --agree-tos --no-eff-email -m ${EMAIL} --redirect --non-interactive

echo "✅ Configuración completada para https://${FULL_DOMAIN}"