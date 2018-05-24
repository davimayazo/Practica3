const application_root=__dirname,
    express = require("express"),
    path = require("path"),
    bodyparser=require("body-parser");

const ctrl = require('./controllers');
const db = require('./myStorage');

var app = express();
app.use(express.static(path.join(application_root,"public")));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//Cross-domain headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var DB = new db.myDB('./data');

app.get('/',ctrl.sendStatic);

app.get('/streams',ctrl.sendDatasets);

//app.get('/stream/:name',ctrl.sendLastPosts);

app.get('/stream/:name/polarity',ctrl.sendTweetPolarity);

app.get('/stream/:name/words',ctrl.sendWords);

app.get('/stream/:name/geo',ctrl.sendCoordinates);

app.get('/stream/:name',ctrl.sendTweets);

app.post('/stream/', ctrl.sendStream);

app.get('/stream/graph', ctrl.sendGraph);

ctrl.warmup.once("warmup", _ => {
	app.listen(8080, function() {
		console.log("The server is running!");
	});
});

