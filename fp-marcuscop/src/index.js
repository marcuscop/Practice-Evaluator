import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
var options;
var google;

function initMap(){
  options = {
    zoom:8,
    center:{lat:42.3601, lng:-71.0589}
  }
  google = window.google;
  window.map = new google.maps.Map(document.getElementById("map"), options);

}

ReactDOM.render(<App />, document.getElementById('root'));

function displayDBPath(){
  var csv = [];
  var gpx = [];

  // get
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(this.readyState != 4){ console.log(this.readyState); return;}
    gpx = JSON.parse(this.responseText);
    //console.log(this.responseText);
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = handle_res
    xhr2.open("GET", "/get_csv", true);
    xhr2.send();

    function handle_res(){
      if(this.readyState != 4) return;
      csv = JSON.parse(this.responseText);
      //console.log(this.responseText);
      // display
      // cut out the decimals
      var i;
      var newdata;
      for(i=0;i<csv.length;i++){
        newdata = csv[i].elapsed.slice(0,7);
        csv[i].elapsed = newdata;
      }

      var date;
      var date_string;
      var hours, minutes, seconds;
      for(i=0;i<csv.length;i++){
        hours = csv[i].elapsed.slice(0, 1);
        minutes = csv[i].elapsed.slice(2, 4);
        seconds = csv[i].elapsed.slice(5, 7);
        date_string = "August 19, 2018 " + hours + ":" + minutes + ":" + seconds;
        date = new Date(date_string);

        csv[i].elapsed = date.getHours().toString()
        + ":" + date.getMinutes().toString()
        + ":" + date.getSeconds().toString();
      }

      // adjust the gpx time to be elapsed time
      var date2;
      var date_string2;

      //console.log(gpx[0]);
      var base_hours = parseFloat(gpx[0].timeofday.slice(0, 2));
      var base_minutes = parseFloat(gpx[0].timeofday.slice(3, 5));
      var base_seconds = parseFloat(gpx[0].timeofday.slice(6, 8));

      var hours2, minutes2, seconds2;
      for(i=0;i<gpx.length;i++){
        hours2 = gpx[i].timeofday.slice(0, 2);
        minutes2 = gpx[i].timeofday.slice(3, 5);
        seconds2 = gpx[i].timeofday.slice(6, 8);
        date_string2 = "August 19, 2018 " + hours2 + ":" + minutes2 + ":" + seconds2;
        date2 = new Date(date_string2);

        date2.setHours(date2.getHours() - base_hours);
        date2.setMinutes(date2.getMinutes() - base_minutes);
        date2.setSeconds(date2.getSeconds() - base_seconds);

        gpx[i].timeofday = date2.getHours().toString()
        + ":" + date2.getMinutes().toString()
        + ":" + date2.getSeconds().toString();

      }

      var lilyPath = new window.google.maps.Polyline({
        //geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      var i, j;
      var path = lilyPath.getPath();
      var myLatLng;
      var infowindow;
      var split;

      for(i=0;i<gpx.length;i++){
        myLatLng = new window.google.maps.LatLng({lat: parseFloat(gpx[i].lat), lng: parseFloat(gpx[i].lon)});
        path.push(myLatLng);
        if(i==0){window.map.setCenter(myLatLng); window.map.setZoom(13);}

        for(j=0;j<csv.length;j++){
          if(csv[j].time == gpx[i].time){
            split = csv[j].splspeed;
            infowindow = new window.google.maps.InfoWindow({
                content: split,
                position: myLatLng,
                map: window.map
            });

          }// if
        }// csv


      }// gpx

      lilyPath.strokeColor = "darkblue";
      lilyPath.setMap(window.map);
      console.log(lilyPath.getPath());


      if(this.status != 200){
        console.log("ERROR: State 4 of request");
      }
    }

    if(this.status != 200){
      console.log("ERROR: State 4 of request");
    }
  };
  xhr.open("GET", "/get_gpx", true);
  xhr.send();

  console.log("displayDBPath over");
}

window.onload = function (){
  var name = '';
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(this.readyState != 4){ console.log(this.readyState); return;}
    console.log(this.responseText);
    if(this.responseText != "[]"){
      name = this.responseText;
      document.getElementById('savedpath').innerHTML = name.split('"')[5];
      /*document.getElementById('savedpath').addEventListener('click', function(event){
        displayDBPath();
      });*/
      //console.log("event displayDBPath() set for db path");
    }
    if(this.status != 200){
      console.log("ERROR: State 4 of request");
    }
  };
  xhr.open("GET", "/name", true);
  xhr.send();
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
