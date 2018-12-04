const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const download = require('download')
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({
  extended: true
}))
const youtubedl = require('youtube-dl')
app.listen(3000)
console.log("App listening on port 3000");

app.get('/', (req, res) => {
  fs.readFile('./index.html', null, (err, data) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    if (err) {
      res.status(404).send('No data')
    }
    res.write(data)
    res.end()
  })
})

app.post('/downloadVideo', (req, res) => {
  const video = youtubedl(req.body.url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })
  const title = {}
  video.on('info', info => {
    title.filename = info._filename
    video.pipe(fs.createWriteStream(info._filename))
  })
  video.on('end', () => {
  res.write('<p>filename:' + title.filename + '  already downloaded.</p>')
  res.end()
  })

})
