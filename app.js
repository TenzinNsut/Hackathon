const express = require('express');
const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

// static folder
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname+"/index.html");
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server is listening on ${port}`);
});

