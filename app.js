const Tesseract = require('tesseract.js');
const filename = 'image.png';
const request = require('request');
const fs = require('fs');
const http = require('http');


function downLoadImg(url,callback){
    const filename = 'pic.png';
    let writeFileStream = fs.createWriteStream(filename)
    request(url).pipe(writeFileStream).on('close', function() {
      callback(filename);
    });
}

const url = `http://perltest.my-mobile.org/c/test.cgi?u=itamarmuslvi&p=vrix565`;

request(url, (err,res,body) => {
   
    const imgTagIndex = body.indexOf('/captcha/');

    const pngIndex = body.indexOf('.png"/>');

    const bodySlice = body.slice(imgTagIndex, pngIndex);
    const arraySplit = bodySlice.split('/');
    const imgFile = arraySplit[2] + '.png';
    const imgPath = bodySlice + '.png';
    const imgUrl = 'http://perltest.my-mobile.org' + imgPath;
    
    downLoadImg(imgUrl,(captchaUrl) =>{
        Tesseract.recognize(captchaUrl)
        .catch(err => console.error(err))
        .then(function (result) {
          const options = {
            url: url,
            method: 'POST',
            form: {'file': imgFile ,
                   'text': result.text.replace(/\r?\n|\r/g,'').replace(/\s/g,''),
                   'u' : 'itamarmuslvi',
                   'p' : 'vrix565'}
        };

        
        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body);
                process.exit(0);
            }
            else{
                process.exit(0);
            }
        })

          
        });
    });

 
});


