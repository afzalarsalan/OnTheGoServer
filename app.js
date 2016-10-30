var vision = require('node-cloud-vision-api');
vision.init({auth: 'AIzaSyCbDDuE_7XnbPTfJtMhgWWETzQTcnpKRlY'});

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    qs = require('querystring'),
    path = require("path");

var visual_recognition = new VisualRecognitionV3({
  api_key: '513bbcd9cbce91d28ba03fd2492cde32f3b66f9a'/*'37745a59c469e745974eac39b50a52752a803887'*/,
  version_date: '2016-05-19'
});

http.createServer(function (request, response) {
  console.log('request.url :',request.url);
   if (request.method == 'POST') {
      var body = '';

      request.on('data', function (data) {
          body += data;

          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (body.length > 1e6)
              request.connection.destroy();
      });

      request.on('end', function () {
          var post = qs.parse(body);
          console.log('post 123:',post);
      });
  } 
  /*
  if(req.url.indexOf('/index') >= -1){
    console.log('query.imageData_zxc :'+query.imageData);
    res.writeHead(200, {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With"});
    res.write('Hello');
    res.end();      
  }
  */

}).listen(process.env.PORT||8888);