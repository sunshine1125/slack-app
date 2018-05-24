#!/bin/bash

cd /var/www/www.mafeifan.com
git pull > /dev/null
npm install > /dev/null
hexo g > /dev/null

echo 0
