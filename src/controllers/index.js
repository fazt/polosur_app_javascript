const fs = require('fs');
const path = require('path');

var files = fs.readdirSync(__dirname);

files.forEach((file)=>{
  var filename = path.basename(file, '.js');
  if (filename !== 'index') {
    exports[filename] = require('./' + filename);
  }
});
