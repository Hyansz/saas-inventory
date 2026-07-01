#!/bin/sh

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

php artisan storage:link || true

php artisan migrate --force || true

php-fpm -D

nginx -g "daemon off;"