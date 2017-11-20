/**
 * File Metadata Microservice
 * Return uploaded file metadata
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

const metadata = require('./metadata');
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

http.createServer((request, response) => {

  const pURL = url.parse(request.url);

  // index
  if (/^\/$/.test(pURL.pathname)) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(response);
    return;
  }

  // file upload route
  if (/^\/upload$/.test(pURL.pathname) && /POST/.test(request.method)) {
    metadata(request, (error, metadata) => {
      metadata
        ? (response.writeHead(200, {'Content-Type': 'application/json'}), response.end(JSON.stringify(metadata)))
        : (response.writeHead(400, {'Content-Type': 'text/plain'}), response.end(response.statusMessage));
    });
    return;
  }

  // favicon
  if (/^\/favicon\.ico$/.test(pURL.pathname)) {
    response.writeHead(404);
    response.end(null);
    return;
  }

  // redirect any exceptions to webroot
  response.writeHead(301, {'Location': '/'});
  response.end(null);

}).listen(process.env.PORT || 8080);
