cd frontend
npm run build
mv build ../build

cd ..
rm -rf ./backend/flask/templates
rm -rf ./backend/flask/static

mkdir backend/flask/templates
cp -rT ./build ./backend/flask/templates/build
cp -rT ./build/static ./backend/flask/static
