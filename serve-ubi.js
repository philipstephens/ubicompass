const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3001;

const server = http.createServer((req, res) => {
  // Serve the UBI Compass HTML file
  const filePath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`UBI Compass server running at http://localhost:${port}`);
  console.log(`Access your UBI Compass at: http://localhost:${port}/`);
});
