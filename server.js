//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/SkyWayAngularVideoChat'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/SkyWayAngularVideoChat/index.html'));
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});