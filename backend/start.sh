#!/bin/sh

echo "Running Laravel initialization..."

php artisan storage:link || true

php artisan migrate --force || true

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

php-fpm -D

echo "Starting Nginx..."

nginx -g "daemon off;"