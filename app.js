

var vision = require('node-cloud-vision-api');
vision.init({ auth: 'AIzaSyCbDDuE_7XnbPTfJtMhgWWETzQTcnpKRlY' });

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require("fs"),
  http = require("http"),
  url = require("url"),
  path = require("path"),
  imdb = require("imdb-api"),
  trailer = require("movie-trailer"),
  Showtimes = require('showtimes');

var visual_recognition = new VisualRecognitionV3({
  api_key: '513bbcd9cbce91d28ba03fd2492cde32f3b66f9a'/*'37745a59c469e745974eac39b50a52752a803887'*/,
  version_date: '2016-05-19'
});

http.createServer(function (request, response) {
  if (request.method == 'POST' && request.url.indexOf('/index') > -1) {
    var body = '';
    request.on('data', function (data) {
      body += data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function () {
      var postTemp = JSON.parse(body);
      //console.log('post.imageData:',postTemp.imageData);
      callGoogleAPI(postTemp.imageData,response);
    });
  }
}).listen(process.env.PORT || 8888);


function callGoogleAPI(imageData, response) {
  console.log('Inside callGoogleAPI');
  var req = new vision.Request({
    image: new vision.Image({
      base64: imageData
    }),
    features: [
      new vision.Feature('TEXT_DETECTION', 10),
      new vision.Feature('LOGO_DETECTION', 10),
      new vision.Feature('LABEL_DETECTION', 10),
    ]
  })

  // send single request
  vision.annotate(req).then((res) => {
    // handling response
    var responseObject = {};
    console.log(JSON.stringify(res.responses))
    var resultObject = res.responses[0];
    if (resultObject.logoAnnotations) {
      var logoAnnotation = resultObject.logoAnnotations;
      console.log('logoAnnotation', logoAnnotation);
    }
    if (resultObject.textAnnotations) {
      var textAnnotation = resultObject.textAnnotations[0].description;
      console.log('textAnnotation Result', textAnnotation.split('\n'));
      textAnnotation.split('\n').forEach(function (val) {
        imdb.getReq({ name: val, year: 2016 }, function (err, data) {
          if (!err) {
            console.log(data);

            responseObject.title = data.title;
            responseObject.runtime = data.runtime;
            responseObject.year = data.year;

            responseObject.genres = data.genres;
            if(data.rated === 'PG-13')
              responseObject.rated = 'Parents Strongly Cautioned – some material may be inappropriate for children under 13';
            else if(data.rated === 'PG')
              responseObject.rated = 'Parental Guidance Suggested – some material may not be suitable for children';
            else if(data.rated === 'R')
              responseObject.rated = 'Restricted – under 17 requires accompanying parent or adult guardian';
            else if(data.rated === 'NC-17')
              responseObject.rated = 'No children under 17 admitted [1990–1996] / No one 17 and under admitted';
            else
              responseObject.rated = 'General Audiences – all ages admitted';

            responseObject.director = data.director;
            responseObject.writer = data.writer;

            responseObject.actors = data.actors;

            responseObject.plot = data.plot;

            responseObject.languages = data.languages;
            responseObject.country = data.country;
            responseObject.awards = data.awards;

            responseObject.rating = data.rating;
            responseObject.metascore = data.metascore;
            responseObject.votes = data.votes;

            api = new Showtimes(77004);
            api.getMovies(function(error, movieList){
              movieList.forEach(function(item,index){
                if(item.name.toLowerCase().indexOf(data.title.toLowerCase()) > -1){
                  console.log('item found',item);
                  responseObject.trailer = item.trailer;
                  responseObject.theaters = item.theaters;
                }
                if(movieList.length == (index+1)){
                  response.writeHead(200,  {"Content-Type": "application/json"});
                  console.log('responseObject ',responseObject);
                  response.end(JSON.stringify(responseObject));                  
                }
              });
            });
          }
        });
      });
    }
  }, (e) => {
    console.log('Error: ', e)
  })
}