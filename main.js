const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Kustomize from Prod!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
