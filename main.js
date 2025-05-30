const express = require('express')
require('dotenv').config() 

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(`Hello World!`)
})

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {app, server};