const clientId = '68ffa021ac954ab6b28022d8f324fe59';
const clientSecret = '675a0c74380745d198b52871eb69acee';

var redirect_uri = "C:\\Users\\ual-laptop\\OneDrive - University of Arizona\\Desktop\\adams versin\\website\\home.html";
console.log(redirect_uri)

var ans = {};
var spot;
var country;
var genre;
var results;

function personalityQuiz() {
  var elem = document.getElementById("quiz");
  var spot = document.getElementById("spot");
  showCountrySelector();
  spot.innerHTML = "";
  elem.innerHTML = "\
  <form id='pqform' method='POST'>\
  <p class='pqtext'>Link your Spotify account here (not required):</p>\
  <button onclick='requestAuthorization()' id='authBttn' f1'>Authorize Spotify</button><br>\
  </form>\
  <button type='submit' onclick='nextQ(0)' id='pqsub' class='submitbtn f1'>Start Quiz</button><br>\
  ";
  $("#countrySelect").fadeIn();
  $("#quiz").fadeIn();
  $("#req").fadeOut(1);

}

function requestAuthorization(){

  let url = "https://accounts.spotify.com/authorize";
  url += "?client_id=" + clientId;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  console.log(url)
  
  window.location.href = url; // Show Spotify's authorization screen
}

function fadeToNext(q) {
  var isValid = document.forms['pqform'].checkValidity();
  if(isValid) {
    $("#quiz").fadeOut();
    $("#quiz").promise().done(function(){nextQ(q)});
  } else {
    promptReq("Question is required!");
  }
}

function validateGenre() {
  genre = document.forms['pqform'].select_genre.value;
  if (genre == "Select...") {
    promptReq("Question is required!");
  } else {
    fadeToNext(2);
  }
}

function promptReq(str) {
  var req = document.getElementById("req");
  req.innerText = str;
  $("#req").fadeIn(250);
  $("#req").delay(1000).fadeOut(250);
}

function displayValue(question) {
  // Excuse my elseifs, I wanted to use switch cases in this function but they just kept bugging out lol
  var slider = document.getElementById(question);
  var output = document.getElementById("sliderVal");
  if (question == 'q2' || question == 'q3' || question == 'q6') {
    output.innerHTML = "Never";
  } else if (question == 'q4') {
    output.innerHTML = "1 minute or less";
  } else if (question == 'q5') {
    output.innerHTML = "All vocals all the time!";
  } else if (question == 'q7') {
    output.innerHTML = "Studio recordings only";
  } else if (question == 'q8') {
    output.innerHTML = "As quiet as possible";
  } else if (question == 'q9') {
    output.innerHTML = "Around 60 BPM or less";
  } else if (question == 'q10') {
    output.innerHTML = "As sad as it goes";
  }
  slider.oninput = function() {
    if (question == 'q2' || question == 'q3' || question == 'q6') {
      if (this.value == 0) {
        output.innerHTML = "Never";
      } else if (this.value > 0 && this.value <= 33) {
        output.innerHTML = "Rarely";
      }else if (this.value > 33 && this.value <= 66) {
        output.innerHTML = "Sometimes";
      } else if (this.value > 66 && this.value < 100) {
        output.innerHTML = "Often";
      } else if (this.value == 100) {
        output.innerHTML = "Always";
      }
    } else if (question == 'q4') {
      // Values are to make it easy to put into spotify API. 
      // Since duration feature is length in ms, just multiply this value by 3000.
      // TODO: covert to 0-100 scale like q8
      if (this.value == 20) {
        output.innerHTML = "1 minute or less";
      }else if (this.value > 20 && this.value <= 40) {
        output.innerHTML = "1 to 2 minutes";
      } else if (this.value > 40 && this.value <= 60) {
        output.innerHTML = "2 to 3 minutes";
      } else if (this.value > 60 && this.value <= 80) {
        output.innerHTML = "3 to 4 minutes";
      } else if (this.value > 80 && this.value < 100) {
        output.innerHTML = "4 to 5 minutes";
      } else if (this.value == 100) {
        output.innerHTML = "Over 5 minutes";
      }
    } else if (question == 'q5') {
      if (this.value == 0) {
        output.innerHTML = "All vocals all the time!";
      } else if (this.value > 0 && this.value <= 33) {
        output.innerHTML = "I'd prefer a focus on the vocals";
      }else if (this.value > 33 && this.value <= 66) {
        output.innerHTML = "I like vocals, but instruments are cool too...";
      } else if (this.value > 66 && this.value < 100) {
        output.innerHTML = "I'd prefer a focus on the instruments";
      } else if (this.value == 100) {
        output.innerHTML = "Only instrumentals for me";
      }
    } else if (question == 'q7') {
      if (this.value == 0) {
        output.innerHTML = "Studio recordings only";
      } else if (this.value > 0 && this.value <= 40) {
        output.innerHTML = "Prefer studio recordings";
      }else if (this.value > 40 && this.value <= 80) {
        output.innerHTML = "Either is fine";
      } else if (this.value > 66 && this.value < 100) {
        output.innerHTML = "Prefer live recordings";
      } else if (this.value == 100) {
        output.innerHTML = "Live recordings only";
      }
    } else if (question == 'q8') {
      // Spotify says loudness typically ranges from -60 to 0
      // So multiply this value by .6 then subtract 100
      // Though maybe the scale should be changed since most modern
      // pop music tends to be on the loud side (I think around -10?)
      if (this.value == 0) {
        output.innerHTML = "As quiet as possible";
      } else if (this.value > 0 && this.value <= 33) {
        output.innerHTML = "I prefer quiet music";
      }else if (this.value > 33 && this.value <= 66) {
        output.innerHTML = "Not too loud, not too quiet";
      } else if (this.value > 66 && this.value < 100) {
        output.innerHTML = 'I prefer louder music';
      } else if (this.value == 100) {
        output.innerHTML = "MAXIMUM LOUDNESS!!!";
      }
    } else if (question == 'q9') {
      // Assuming min BPM of 60 and max of 200
      if (this.value == 60) {
        output.innerHTML = "Around " + Math.round(this.value) + " BPM or less";
      } else if (this.value == 200) {
        output.innerHTML = "Around " + Math.round(this.value) + " BPM or more";
      } else {
        output.innerHTML = "Around " + Math.round(this.value) + " BPM";
      }
    }
    else if (question == 'q10') {
      if (this.value == 0) {
        output.innerHTML = "As sad as it goes";
      } else if (this.value > 0 && this.value <= 33) {
        output.innerHTML = "Prefer sad music";
      }else if (this.value > 33 && this.value <= 66) {
        output.innerHTML = "I like a balance of emotions";
      } else if (this.value > 66 && this.value < 100) {
        output.innerHTML = "Prefer happy music";
      } else if (this.value == 100) {
        output.innerHTML = "As happy as it goes";
      }
    }
  }
}

function nextQ(q) {
  // console.log(country);
  // console.log(spotURL2);
  console.log(ans);
  var elem = document.getElementById("quiz");

  switch (q) {
    case 0:
      country = document.getElementById('country').value;
      spotURL2 = document.getElementById("spotURL2").value;
      $("#countrySelect").fadeOut();
      fadeToNext(1);
      break;

    case 1:
      hideCountrySelector();
      showGenreSelector();
      elem.innerHTML = "\
      <p class='sm'>Question 1 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>What is your favorite genre?</p>\
      <div class='question center'>\
      <input type='hidden' id='q1'>\
      <label for='Genre' class='form-label col-sm-2'>Genre:</label>\
      <select required name='genre' id='select_genre' class='form-control form-control-sm col-sm-10'>\
      <option selected disabled hidden>Select...</option>\
      </select>\
      </div> \
      </form>\
      <br><button type='submit' onclick='validateGenre()' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";;
      $("#quiz").fadeIn();
      displayValue('q1');
      break;

    case 2:
      //addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 2 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>How often do you to listen to music with acoustic instruments?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='100' value='0' class='slider' id='q2'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='fadeToNext(3)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";
      $("#quiz").fadeIn();
      displayValue('q2');
      break;

    case 3:
      addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 3 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>How often do you to listen to music to dance?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='100' value='0' class='slider' id='q3'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='fadeToNext(4)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";
      $("#quiz").fadeIn();
      displayValue('q3');
      break;

    case 4:
      addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 4 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>How long do you like your music to be?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='10' value='0' class='slider' id='q4'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='fadeToNext(5)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";
      $("#quiz").fadeIn();
      displayValue('q4');
      break;

    case 5:
      addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 5 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>Do you prefer vocal or instrumental tracks?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='100' value='0' class='slider' id='q5'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='fadeToNext(6)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";
      $("#quiz").fadeIn();
      displayValue('q5');
      break;

    case 6:
      addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 6 / 10</p>\
      <form id='pqform' method='POST'>\
      <p class='pqtext'>How often do you to listen to music to give you energy?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='100' value='0' class='slider' id='q6'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='fadeToNext(7)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
      ";
      $("#quiz").fadeIn();
      displayValue('q6');
      break;

    case 7:
        addLastAnsToDict(q);
        elem.innerHTML = "\
        <p class='sm'>Question 7 / 10</p>\
        <form id='pqform' method='POST'>\
        <p class='pqtext'>Do you mind if there's audience sounds in your music?</p>\
        <div class='question center'>\
        <input type='range' min='0' max='100' value='0' class='slider' id='q7'>\
        </div> \
        <p id='sliderVal'></p>\
        </form>\
        <br><button type='submit' onclick='fadeToNext(8)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
        ";
        $("#quiz").fadeIn();
        displayValue('q7');
        break;

    case 8:
        addLastAnsToDict(q);
        elem.innerHTML = "\
        <p class='sm'>Question 8 / 10</p>\
        <form id='pqform' method='POST'>\
        <p class='pqtext'>How loud do you like your music?</p>\
        <div class='question center'>\
        <input type='range' min='0' max='100' value='0' class='slider' id='q8'>\
        </div> \
        <p id='sliderVal'></p>\
        </form>\
        <br><button type='submit' onclick='fadeToNext(9)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
        ";
        $("#quiz").fadeIn();
        displayValue('q8');
      break;

    case 9:
        addLastAnsToDict(q);
        elem.innerHTML = "\
        <p class='sm'>Question 9 / 10</p>\
        <form id='pqform' method='POST'>\
        <p class='pqtext'>How fast do you like your music?</p>\
        <div class='question center'>\
        <input type='range' min='60' max='200' value='60' step='5' class='slider' id='q9'>\
        </div> \
        <p id='sliderVal'></p>\
        </form>\
        <br><button type='submit' onclick='fadeToNext(10)' id='pqsub' class='submitbtn f1'>Next Question</button><br>\
        ";
        $("#quiz").fadeIn();
        displayValue('q9');
      break;

    case 10:
      addLastAnsToDict(q);
      elem.innerHTML = "\
      <p class='sm'>Question 10 / 10</p>\
      <form id='pqform' method='POST' action='loading.html'>\
      <p class='pqtext'>Do you prefer happy or sad music?</p>\
      <div class='question center'>\
      <input type='range' min='0' max='100' value='0' class='slider' id='q10'>\
      </div> \
      <p id='sliderVal'></p>\
      </form>\
      <br><button type='submit' onclick='submitQuiz()' id='pqsub' class='submitbtn f1'>Get recommendations</button><br>\
      "
      $("#quiz").fadeIn();
      displayValue('q10');
      break;
  }
}

// function addLastAnsToDict(q) {
//   var isValid = document.forms['pqform'].checkValidity();
//   if (isValid) {
//     var getInputs = document.getElementsByTagName('input');          
//     for(i = 0; i < getInputs.length; i++) {
//       if(getInputs[i].type == "radio") {
//         if(getInputs[i].checked) {
//           ans[getInputs[i].name] = getInputs[i].id.slice(3);
//         }
//       }
//     }
//   }
// }

function addLastAnsToDict(q) {
  var sliderValue = document.getElementById('q' + (q - 1));
  ans['q' + (q - 1)] = sliderValue.value;
}

function submitQuiz() {
  addLastAnsToDict(11);
  $("#quiz").fadeOut();
  showLoader();
  recAlg();
}

function inputSpotifyURL() {
  var elem = document.getElementById("spot");
  var pq = document.getElementById("quiz");
  showCountrySelector();
  pq.innerHTML = "";
  elem.innerHTML = "<p>Link your Spotify account here:</p>\
  <form method='POST' action='loading.html'>\
  <input placeholder='Paste Spotify URL here' required id='spotURL2'><br>\
  </form>\
  <button type='submit' onclick='getRecFromURL()' class='submitbtn f1'>Get recommendations</button>\
  ";
  $("#countrySelect").fadeIn();
  $("#spot").fadeIn();
  $("#req").fadeOut(1);
}

function getRecFromURL() {
  var country = document.getElementById('country').value;
  var spotURL2 = document.getElementById("spotURL2").value;

  if (spotURL2 != '') {
    console.log(country);
    console.log(spotURL2);
    recAlg();
    showLoader();
  } else {
    promptReq("Spotify URL is required!");
  }
}

function showLoader() {
  var body = document.getElementById("body");
  body.innerHTML = "<div class='f1 fc'>\
    <div class='c1 center'>now loading...</div>\
    <div class='loader center'></div></div>";
}

function recAlg(){
  
  const APIController = (function () {

  // private methods
  const _getToken = async () => {

      const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
      });

      const data = await result.json();
      return data.access_token;
  }


  const _getPlaylistByGenre = async (token, genreId) => {


      //MY CODE
      const countries = ["United%20Arab%20Emirates",
      "Albanian",
      "Argentinan",
      "Austrian",
      "Australian",
      "Bosnian",
      "Belgium",
      "Bulgarian",
      "Bahrain",
      "Bolivian",
      "Brazilian",
      "Belarus",
      "Canadian",
      "Switzerland",
      "Chilean",
      "Colombian",
      "Costa%20Rican",
      "Cyprus",
      "Czech%20Republic",
      "German",
      "Denmark",
      "Dominican%20Republic",
      "Algerian",
      "Ecuadorian",
      "Estonian",
      "Egyptian",
      "Spanish",
      "Finland",
      "French",
      "UK",
      "Greek",
      "Guatemalan",
      "Hong%20Kong",
      "Honduras",
      "Croatian",
      "Hungarian",
      "Indonesian",
      "Irish",
      "Israeli",
      "Indian",
      "Icelandic",
      "Italian",
      "Hashemite%20Kingdom%20Of%20Jordan",
      "Japanese",
      "Kuwait",
      "Kazakhstan",
      "Lebanon",
      "Liechtenstein",
      "Lithuanian",
      "Luxembourg",
      "Latvia",
      "Moroccan",
      "Monaco",
      "Moldova",
      "Montenegro",
      "Macedonian",
      "Malta",
      "Mexican",
      "Malaysian",
      "Nicaraguan",
      "Netherlands",
      "Norway",
      "New%20Zealand",
      "Oman",
      "Panama",
      "Peruvian",
      "Philippines",
      "Poland",
      "Palestine",
      "Portugal",
      "Paraguay",
      "Qatar",
      "Romanian",
      "Serbian",
      "Saudi%20Arabia",
      "Swedish",
      "Singapore",
      "Slovenian",
      "Slovakian",
      "El%20Salvador",
      "Thailand",
      "Tunisia",
      "Turkish",
      "Taiwanese",
      "Ukraine",
      "United%20States",
      "Uruguay",
      "Vietnamese",
      "South%20African",      
      ];
      const index = countries.indexOf(country)
      countries.splice(index,1)
      const playlists = [];
      const usedCountries = [];
      const returnDict = {};


      while (Object.keys(returnDict).length <= 4 ) {
          const randomCountry = Math.floor(Math.random() * countries.length);
          const country2 = countries[randomCountry];
          const index = countries.indexOf(country2)
          countries.splice(index,1)
          //console.log(country);
          //console.log(`https://api.spotify.com/v1/search?q=${country2}%20${genreId}&type=playlist&limit=2`)
          const result = await fetch(`https://api.spotify.com/v1/search?q=${country2}%20${genreId}&type=playlist&limit=2&offset=5`, {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + token }
          });


          const data = await result.json();
          if (data.playlists.items.length >= 1) {
              //returnArr.push(data.playlists.items);
              //usedCountries.push(countries[randomCountry]);
              returnDict[country2] = data;
              //console.log(data.playlists.items);
          }
      } 
      console.log(returnDict)
      return returnDict;
  }
  

  const _getTracks = async (token, playlists) => {
      const tracksByCountry = [];

      for(var key in playlists){
          for(let i = 0; i <= playlists[key].playlists.items.length; i++){
              if(playlists[key].playlists.items[i]){
              const link = playlists[key].playlists.items[i].tracks.href
              //console.log(link)
              const result = await fetch(`${link}?limit=${10}`, {
                  method: 'GET',
                  headers: { 'Authorization': 'Bearer ' + token }
              });
      
              const data = await result.json();
              for(j=0;j<=data.items.length;j++){
                  if(data.items[j]){
                  tracksByCountry.push(data.items[j])
                  }
              }
          
          }
      }

  }
      console.log(tracksByCountry)
      return tracksByCountry

  }

  const _getTrack = async (token, trackEndPoint) => {


      const result = await fetch(`${trackEndPoint}`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await result.json();
      return data;
  }

  function cosinesim(A,B){
      var dotproduct=0;
      var mA=0;
      var mB=0;
      for(i = 0; i < A.length; i++){ 
          dotproduct += (A[i] * B[i]);
          mA += (A[i]*A[i]);
          mB += (B[i]*B[i]);
      }
      mA = Math.sqrt(mA);
      mB = Math.sqrt(mB);
      var similarity = (dotproduct)/((mA)*(mB)) 
      return similarity;
  }

  const _getTrackFeatures = async (token, tracksEndPoint) => {

      let idString = '';

      const audioFeatures = [];

      tracksLength = [];

    console.log(tracksEndPoint)
      for(let i = 0; i<=tracksEndPoint.length;i++){
              if(tracksEndPoint[i] != undefined){
                  lengthNumber = tracksEndPoint[i].track.duration_ms
                  tracksLength.push(lengthNumber/60000)
                  idString += tracksEndPoint[i].track.id + ',';     
              }
      }
      idString = idString.slice(0, -1)

      const limit = 10;

      const result = await fetch(`https://api.spotify.com/v1/audio-features?ids=${idString}`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await result.json();


      
      for(let j=0 ; j<=data['audio_features'].length ; j++){
          const song = [];
          if(data['audio_features'][j] != null){
              song.push(data['audio_features'][j].acousticness * 100);
              song.push(data['audio_features'][j].danceability * 100);
              song.push(tracksEndPoint[j].track.duration_ms/60000);
              song.push(data['audio_features'][j].instrumentalness * 100);
              song.push(data['audio_features'][j].energy * 100);
              song.push(data['audio_features'][j].liveness * 100);
              song.push(100 + data['audio_features'][j].loudness);
              song.push(data['audio_features'][j].tempo);
              song.push(data['audio_features'][j].valence * 100);
              audioFeatures.push(song);
          }
      }

      var values = [];
      for(var key in ans){
        values.push(parseInt(ans[key]));
      }
      console.log(values)
      console.log(audioFeatures)

      //console.log("USER INPUT")
      //console.log(values)

      let highestSongs = [];
      let highestScore = 0;
      let highestScoreIndex = 0;


      for(let k=0; k<=audioFeatures.length;k++) {
          let currSong = [];
          if(audioFeatures[k] != undefined){
              //console.log("COMPARED SONGS")
              //console.log(audioFeatures[k])
              let score = cosinesim(values, audioFeatures[k]);
              currSong.push(score);
              currSong.push(tracksEndPoint[k].track.id);
          }
          highestSongs.push(currSong)
      }

      let scoresToMax = [];
      for(let m=0;m<=highestSongs.length;m++){
          if(highestSongs[m] != undefined){
              scoresToMax.push(highestSongs[m][0])
          }
      }

      scoresToMax = [...new Set(scoresToMax)];

      console.log(scoresToMax)

      var topValues = scoresToMax.sort((a,b) => b-a).slice(0,10);

      
      let topSongScore = {};
      for(n=0;n<=highestSongs.length;n++){
          if(highestSongs[n] != undefined){
              if(topValues.includes(highestSongs[n][0])){
                  topSongScore[highestSongs[n][0]] = highestSongs[n][1];
              }
          }
      }
      console.log(topSongScore)
      return topSongScore;
  }

  return {
      getToken() {
          return _getToken();
      },
      getPlaylistByGenre(token, genreId) {
          return _getPlaylistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint) {
          return _getTracks(token, tracksEndPoint);
      },
      getTrack(token, trackEndPoint) {
          return _getTrack(token, trackEndPoint);
      },
      getTrackFeatures(token, id) {
          return _getTrackFeatures(token, id);
      },
  }
})();


const APPController = (function (APICtrl) {

  // get genres on page load
  const loadGenres = async () => {
      //get the token
      const token = await APICtrl.getToken();
      //store the token onto the page
      const genreId = genre;
      // ge the playlist based on a genre
      const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
      const trackArr = await APICtrl.getTracks(token, playlist);
      const scoreDict = await APICtrl.getTrackFeatures(token, trackArr);
      results = scoreDict;
      showResults();
  }

  return {
      init() {
          loadGenres();
      }
  }

})(APIController);

// will need to call a method to load the genres on page load
APPController.init();

}

function hideCountrySelector() {
  var cs = document.getElementById("countrySelect");
  cs.innerHTML = "";
}

async function showGenreSelector(){

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  const thisToken = data.access_token;

  const result2 = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + thisToken }
        });

  const data2 = await result2.json();
  const thisGenres = data2.genres;

  console.log(thisGenres)

  thisGenres.forEach(element => createGenre(element));
}

function createGenre(text) {
  const html = `<option value="${text}">${text}</option>`;
  document.querySelector('#select_genre').insertAdjacentHTML('beforeend', html);
}


async function showResults(){

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  const thisToken = data.access_token;


  var body = document.getElementById("body");
  var bodyHTML = '<header>\
  <a href="home.html" class="homebtn">\
  <div class="title f1 c1 fc center">MusExplore</div>\
  </a>\
  </header>\
  <div class=" f1 fc">\
  <div class="box l"></div>\
  <div class="box r"></div>\
  <div class="content center">\
      <div class="results">\
          <div class="song">'

          for(let i = 0; i < Object.keys(results).length; i ++){
            const result2 = await fetch(`https://api.spotify.com/v1/tracks/${Object.values(results)[i]}`, {
              method: 'GET',
              headers: { 'Authorization': 'Bearer ' + thisToken }
          });
      
          // const trackObject = await result2.json();
          // console.log(trackObject)
          let trackEmbed = "https://open.spotify.com/embed/track/" + Object.values(results)[i] + "?utm_source=generator&theme=0"
          bodyHTML += `<iframe style="border-radius:12px" src=${trackEmbed} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
}
 bodyHTML += '</div>\
  <a href="home.html" class="submitbtn gohome">\
  <button id="gohome">Try Again</button>\
  </a>\
  </div>\
  </div>';
  body.innerHTML = bodyHTML;
}



function showCountrySelector() {
  var cs = document.getElementById("countrySelect");
  cs.innerHTML = '<label for="country" id="ctLab">Select your country of origin:</label><br>\
      <select id="country" name="country" class="form-control" required>\
      <option value="AD">Andorra</option>\
      <option value="AD">Andorra</option>\
      <option value="AE">United Arab Emirates</option>\
      <option value="AL">Albania</option>\
      <option value="AR">Argentina</option>\
      <option value="AT">Austria</option>\
      <option value="AU">Australia</option>\
      <option value="BA">Bosnia And Herzegovina</option>\
      <option value="BE">Belgium</option>\
      <option value="BG">Bulgaria</option>\
      <option value="BH">Bahrain</option>\
      <option value="BO">Bolivia</option>\
      <option value="BR">Brazil</option>\
      <option value="BY">Belarus</option>\
      <option value="CA">Canada</option>\
      <option value="CH">Switzerland</option>\
      <option value="CL">Chile</option>\
      <option value="CO">Colombia</option>\
      <option value="CR">Costa Rica</option>\
      <option value="CY">Cyprus</option>\
      <option value="CZ">Czech Republic</option>\
      <option value="DE">Germany</option>\
      <option value="DK">Denmark</option>\
      <option value="DO">Dominican Republic</option>\
      <option value="DZ">Algeria</option>\
      <option value="EC">Ecuador</option>\
      <option value="EE">Estonia</option>\
      <option value="EG">Egypt</option>\
      <option value="ES">Spain</option>\
      <option value="FI">Finland</option>\
      <option value="FR">France</option>\
      <option value="GB">Great Britain (uk)</option>\
      <option value="GR">Greece</option>\
      <option value="GT">Guatemala</option>\
      <option value="HK">Hong Kong</option>\
      <option value="HN">Honduras</option>\
      <option value="HR">Croatia</option>\
      <option value="HU">Hungary</option>\
      <option value="ID">Indonesia</option>\
      <option value="IE">Ireland</option>\
      <option value="IL">Israel</option>\
      <option value="IN">India</option>\
      <option value="IS">Iceland</option>\
      <option value="IT">Italy</option>\
      <option value="JO">Hashemite Kingdom Of Jordan</option>\
      <option value="JP">Japan</option>\
      <option value="KW">Kuwait</option>\
      <option value="KZ">Kazakhstan</option>\
      <option value="LB">Lebanon</option>\
      <option value="LI">Liechtenstein</option>\
      <option value="LT">Lithuania</option>\
      <option value="LU">Luxembourg</option>\
      <option value="LV">Latvia</option>\
      <option value="MA">Morocco</option>\
      <option value="MC">Monaco</option>\
      <option value="MD">Moldova</option>\
      <option value="ME">Montenegro</option>\
      <option value="MK">Macedonia</option>\
      <option value="MT">Malta</option>\
      <option value="MX">Mexico</option>\
      <option value="MY">Malaysia</option>\
      <option value="NI">Nicaragua</option>\
      <option value="NL">Netherlands</option>\
      <option value="NO">Norway</option>\
      <option value="NZ">New Zealand (aotearoa)</option>\
      <option value="OM">Oman</option>\
      <option value="PA">Panama</option>\
      <option value="PE">Peru</option>\
      <option value="PH">Philippines</option>\
      <option value="PL">Poland</option>\
      <option value="PS">Palestine, State Of</option>\
      <option value="PT">Portugal</option>\
      <option value="PY">Paraguay</option>\
      <option value="QA">Qatar</option>\
      <option value="RO">Romania</option>\
      <option value="RS">Serbia</option>\
      <option value="RU">Russia</option>\
      <option value="SA">Saudi Arabia</option>\
      <option value="SE">Sweden</option>\
      <option value="SG">Singapore</option>\
      <option value="SI">Slovenia</option>\
      <option value="SK">Slovakia</option>\
      <option value="SV">El Salvador</option>\
      <option value="TH">Thailand</option>\
      <option value="TN">Tunisia</option>\
      <option value="TR">Turkey</option>\
      <option value="TW">Taiwan</option>\
      <option value="UA">Ukraine</option>\
      <option value="US">United States</option>\
      <option value="UY">Uruguay</option>\
      <option value="VN">Viet Nam</option>\
      <option value="ZA">South Africa</option>\
      </select>'
}