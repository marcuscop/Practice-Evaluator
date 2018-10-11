const express = require('express');
const pg = require('pg');
const fs = require('fs');
var path = require("path");

const app = express();

/*const {Pool, Client} = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "marcreardon",
  password: "password",
  database: "marcreardon"
});

const client = new Client({
  host: "localhost",
  user: "marcreardon",
  password: "password",
  database: "marcreardon"
});*/


const {Pool, Client} = require('pg');
const connectionString = 'postgres://jhacbvffxqqwuo:5e9d8d18bfdf5959ab3816d53cc8ea0a8a1b3476176436796e501381a1886e66@ec2-23-21-147-71.compute-1.amazonaws.com:5432/d8c8488319jh8q';

const pool = new Pool({
  connectionString: connectionString
});

const client = new Client({
  connectionString: connectionString
});

/*
var query_string = "CREATE TABLE gpx (id SERIAL PRIMARY KEY, lon VARCHAR(100) NOT NULL, lat VARCHAR(100) NOT NULL, timeOfDay VARCHAR(100) NOT NULL);"
+ "CREATE TABLE csv ( id  SERIAL PRIMARY KEY, distance VARCHAR(100) NOT NULL, elapsed VARCHAR(100) NOT NULL, strcount VARCHAR(100) NOT NULL, rate VARCHAR(100) NOT NULL, checkf VARCHAR(100) NOT NULL, splspeed VARCHAR(100) NOT NULL, speed VARCHAR(100) NOT NULL, dispstr VARCHAR(100) NOT NULL);"
+ "CREATE TABLE name (id  SERIAL PRIMARY KEY, pathname VARCHAR(100) NOT NULL);";
pool.connect(function(err, client, done){
  if(err){
    return console.error('error fetching client from pool', err);
  }
  client.query(query_string, function(err, result){
    done();

    if(err){
      return console.error('error running query', err);
    }
  });
});
*/

app.use(express.static(path.join(__dirname, './fp-marcuscop/fp-marcuscop/build/')));


app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: path.join(__dirname, './fp-marcuscop/fp-marcuscop/build/') });
});

app.get('/get_gpx', (req, res) => {
  var query_string = "select * from gpx";
    pool.connect(function(err, client, done){
      if(err){
        return console.error('error fetching client from pool', err);
      }
      client.query(query_string, function(err, result){
        done();

        if(err){
          return console.error('error running query', err);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        //console.log(JSON.stringify(result.rows));
        res.end(JSON.stringify(result.rows));
      });
    });
});

app.get('/get_csv', (req, res) => {
  var query_string = "select * from csv";
    pool.connect(function(err, client, done){
      if(err){
        return console.error('error fetching client from pool', err);
      }
      client.query(query_string, function(err, result){
        done();

        if(err){
          return console.error('error running query', err);
        }
        res.writeHead(200, {"Content-Type": "application/json"});

        res.end(JSON.stringify(result.rows));
      });
    });
});

app.post('/clear', (req, res) => {
  var query_string = "delete from gpx; delete from csv; delete from name;";
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query(query_string, function(err, result){
      done();

      if(err){
        return console.error('error running query', err);
      }
    });
  });
  res.end();
});

app.post('/uploadgpx', (req, res) => {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function(){
    upload_gpx(res, body);
    console.log('end');
  });
});

app.post('/uploadcsv', (req, res) => {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function(){
    upload_csv(res, body);
    console.log('end');
  });
});

app.get('/name', (req, res) => {
  var query_string = "select * from name";
    pool.connect(function(err, client, done){
      if(err){
        return console.error('error fetching client from pool', err);
      }
      client.query(query_string, function(err, result){
        done();

        if(err){
          return console.error('error running query', err);
        }
        res.writeHead(200, {"Content-Type": "application/json"});

        res.end(JSON.stringify(result.rows));
      });
    });
});

app.post ('/name', (req, res) => {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function(){
    var query_string = "insert into name (pathname) values ('" + body + "');";
    pool.connect(function(err, client, done){
      if(err){
        return console.error('error fetching client from pool', err);
      }
      client.query(query_string, function(err, result){
        done();

        if(err){
          return console.error('error running query', err);
        }
      });
    });

    res.end();
    console.log('end');
  });

});

app.listen(process.env.PORT || 5432, () => {
  console.log('server running');
});

function upload_csv(res, CSVstring){
  var data = CSVstring.split("\r");

  var statPoint = {
    distance: "sample",
    time: "sample",
    strcount: "sample",
    rate: "sample",
    check: "sample",
    splspeed: "sample",
    speed: "sample",
    dispstr: "sample",
  };

  var i, j;
  var dataPoint = [];
  var query_string = "";
  for(i=3;i<data.length-1;i++){
    dataPoint = data[i].split(",");
    statPoint.distance = dataPoint[0];
    statPoint.time = dataPoint[1];
    statPoint.strcount = dataPoint[2];
    statPoint.rate = dataPoint[3];
    statPoint.check = dataPoint[4];
    statPoint.splspeed = dataPoint[5];
    statPoint.speed = dataPoint[6];
    statPoint.dispstr = dataPoint[7];

    // DB the stats
    query_string +="INSERT INTO csv (distance, elapsed, strcount, rate, checkf, splspeed, speed, dispstr) values ('"
    + statPoint.distance + "','"
    + statPoint.time + "','"
    + statPoint.strcount + "','"
    + statPoint.rate + "','"
    + statPoint.check + "','"
    + statPoint.splspeed + "','"
    + statPoint.speed + "','"
    + statPoint.dispstr + "');";

  } // for

  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query(query_string, function(err, result){
      done();

      if(err){
        return console.error('error running query', err);
      }
    });
  });

  res.end();

}

function upload_gpx(res, GPXstring){
  var trackPoints = GPXstring.split("</trkpt>");
  var regex = /[0-9 +-]/;
  var i;
  var offset;
  var query_string = "";
  var GPSpoint = {
    time: "sample",
    lon: "sample",
    lat: "sample"
  };

  for(i=0;i<trackPoints.length-1; i++){
    var string = trackPoints[i];

    // Get the time
    var index = string.indexOf("T");
    offset = string.substring(index).search(regex);
    GPSpoint.time = string.substring(index+offset, index+offset+8);

    // Get the Longitude
    var index = string.indexOf("lon");
    offset = string.substring(index).search(regex);
    GPSpoint.lon = string.substring(index+offset, index+offset+10);

    // Get the Latitude
    var index = string.indexOf("lat");
    offset = string.substring(index).search(regex);
    GPSpoint.lat = string.substring(index+offset, index+offset+9);

    // DB the stats

    query_string+=("INSERT INTO gpx (lon, lat, timeOfDay) values ('"
    + GPSpoint.lon + "','"
    + GPSpoint.lat + "','"
    + GPSpoint.time + "'); ");

  }//for


  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query(query_string, function(err, result){
      done();

      if(err){
        return console.error('error running query', err);
      }
    });
  });

  res.end();
}
