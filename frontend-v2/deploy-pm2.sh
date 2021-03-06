git pull || exit
yarn install || exit
BUILD_DIR=.temp yarn build || exit
if [ ! -d ".temp" ]; then
  echo '\033[31m temp Directory not exists!\033[0m'  
  exit 1;
fi
rm -rf .next
mv .temp .next
pm2 reload nextjs --update-env