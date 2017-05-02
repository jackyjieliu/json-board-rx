npm run build && cd ../heroku-json-board-rx && rm -rf node_modules package.json public index.js && cp -R ../json-board-rx/build/ public && cp ../json-board-rx/server/index.js index.js
cp ../json-board-rx/server/package.json package.json && git add .
