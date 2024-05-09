const fs = require("fs");

 function load(){
    //pull data from the json
   const data = fs.readFileSync('commands.json', 'utf8');
   const jsonData = JSON.parse(data);
   return jsonData //return the data as obj
}

module.exports = { load }