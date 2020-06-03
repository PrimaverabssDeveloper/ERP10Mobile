// https://github.com/angular/angular-cli/issues/1548#issuecomment-409086413

const fs = require('fs');

// add crypto lib to node
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true, fs: \'empty\', net: \'empty\', tls: \'empty\'}');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});


// fix oauth request token endpoint
const auth0LibPath = 'node_modules/auth0-js/dist/auth0.min.esm.js';
fs.readFile(auth0LibPath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/,"oauth"/g, '');

  fs.writeFile(auth0LibPath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});