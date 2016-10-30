var vision = require('node-cloud-vision-api');
vision.init({ auth: 'AIzaSyCbDDuE_7XnbPTfJtMhgWWETzQTcnpKRlY' });

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require("fs"),
  http = require("http"),
  url = require("url"),
  path = require("path"),
  imdb = require("imdb-api"),
  trailer = require("movie-trailer");

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
      callGoogleAPI(postTemp.imageData);
      response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With" });
      response.write('Hello');
      response.end();
    });
  }
}).listen(process.env.PORT || 8888);


function callGoogleAPI(imageData) {
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
            var vidlink = trailer(data.name, function (err, url) {
              if (!err) {
                console.log("Trailer Link" + vidlink);
              }
              else {
                console.log(err);
              }
            })
          }
        });
      });
    }
  }, (e) => {
    console.log('Error: ', e)
  })
}