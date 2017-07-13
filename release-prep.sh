npm run build && cd ../heroku-json-board-rx && rm -rf node_modules package.json public index.js newrelic.js && cp -R ../json-board-rx/build/ public && cp ../json-board-rx/server/index.js index.js && cp ../json-board-rx/server/newrelic.js newrelic.js
cp ../json-board-rx/server/package.json package.json && git add .
