const express = require('express');
const index = express();
const port = 80;
index.get('/', (request, response) => {
  response.send('Hello from Express!');
});
index.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
