const Twitter = require('twitter')
const myCreds = require('./credentials/my-credential.json');

const client = new Twitter(myCreds);
const sentiment = require('sentiment-spanish');

const db=require('./myStorage')
const DB=new db.myDB('./data')
const util=require('util')


class StreamManager{
	constructor(){
		this.streams={};
	}
    
        createStream(name,jsonld){
		let stream = client.stream('statuses/filter', {track: jsonld.query });
		
		this.streams[name] = stream;			

		DB.createDataset(name,jsonld);

		stream.on('data', tweet => {
  		
		if (tweet.lang=="es" || tweet.user.lang=="es"){
			DB.insertObject(name,{id:tweet.id_str,coordinates:tweet.coordinates,text:tweet.text,polarity:sentiment(tweet.text).score});
		}
	});

	stream.on('error', err => console.log(err));

	}

	destroyStream(name){
		//setTimeout(()=>{name.destroy()},20000);
        }

        listStream(){
        }
      
}

exports.StreamManager = StreamManager;

let SM = new StreamManager();
SM.createStream("pet","perro, gato, conejo");
setTimeout(_ => SM.destroyStream("pet"), 20000);
