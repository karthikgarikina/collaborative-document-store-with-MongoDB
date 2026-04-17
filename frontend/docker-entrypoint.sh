#!/bin/sh
set -eu

echo "Frontend UI ready. Nginx is serving the app on container port 80 (host port 4173)."
exec nginx -g "daemon off;"
