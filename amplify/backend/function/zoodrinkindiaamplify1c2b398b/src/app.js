/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	STORAGE_S3EB0F72D9_BUCKETNAME
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// rekog client
var AWS = require('aws-sdk');
const rekogClient = new AWS.Rekognition()

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Amz-Date ,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent")
  next()
});

// app.get('/compare', function(req,res) {
//   const applicationID = req.query.applicationID;
//   console.log("application ID", applicationID);

//   let sourceKey = "public/"+applicationID + "_aadhaar_front.jpg";
//   let targetKey = "public/"+applicationID + "_selfie.jpg";
//   let bucket = process.env.STORAGE_S3EB0F72D9_BUCKETNAME;
//   console.log('bucket', bucket);
//   let params = {
//     SourceImage: {
//       S3Object: {
//         Bucket: bucket,
//         Name: sourceKey
//       },
//     },
//     TargetImage: {
//       S3Object: {
//         Bucket: bucket,
//         Name: targetKey
//       },
//     },
//     SimilarityThreshold: 70
//   };

//   rekogClient.compareFaces(params, function(error, response) {
//     if (error) {
//         res.json({error, message: 'Error Occured While fetching, Please try again'});
//     } else {
//       console.log("RekogResponse",response)
//       let faceMatch = false
//       let faceMatchPercent = 0
//       if (response.data.FaceMatches && response.data.FaceMatches.length > 0) {
//         faceMatch = true;
//         faceMatchPercent = response.data.FaceMatches[0].Similarity.toFixed(2);
//         }
//         let newResponse = {
//           "faceMatch" : faceMatch,
//           "faceMatchPercent" : faceMatchPercent,
//           "dob" : ""
//         }
//       res.json({success: 'post compare call succeed!', data: newResponse,url: req.url, body: req.body});
//     }

//   res.json({success: 'get call succeed!', url: req.url});
// });

app.get('/verify', function (req, res) {
  const applicationID = req.query.applicationID;
  console.log("application ID", applicationID);

  let sourceKey = "public/" + applicationID + "_aadhaar_front.jpg";
  let targetKey = "public/" + applicationID + "_selfie.jpg";
  let bucket = process.env.STORAGE_S3EB0F72D9_BUCKETNAME;
  console.log("bucket:", bucket)

  let params = {
    SourceImage: {
      S3Object: {
        Bucket: bucket,
        Name: sourceKey
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucket,
        Name: targetKey
      },
    },
    SimilarityThreshold: 70
  };

  rekogClient.compareFaces(params, function (error, response) {
    if (error) {
      res.json({ error, message: 'get call failed' });
    } else {
      let faceMatch = false
      let faceMatchPercent = 0
      if (response.FaceMatches && response.FaceMatches.length > 0) {
        faceMatch = true;
        faceMatchPercent = response.FaceMatches[0].Similarity.toFixed(2);
      }
      let updatedResponse = {
        'faceMatch': faceMatch,
        'faceMatchPercent': faceMatchPercent,
        'dob': "17/11/1985"
      };
      // let newResponse = {
      //   "faceMatch": faceMatch,
      //   "faceMatchPercent": faceMatchPercent,
      //   "dob": ""
      // }
      res.json({ success: 'post compare call succeed!', data: updatedResponse, url: req.url, body: req.body });
    }
  });

  // res.json({success: 'get verify call succeed!', url: req.url});
});

/**********************
 * Example get method *
 **********************/

app.get('/verifyCustomer', function (req, res) {
  const applicationID = req.query.applicationID;
  const orderID = req.query.orderID;
  console.log("application ID", applicationID);
  console.log("application ID", orderID);

  let sourceKey = "public/" + orderID + ".jpg";
  let targetKey = "public/" + applicationID + "_selfie.jpg";
  let bucket = process.env.STORAGE_S3EB0F72D9_BUCKETNAME;
  console.log("bucket:", bucket)

  let params = {
    SourceImage: {
      S3Object: {
        Bucket: bucket,
        Name: sourceKey
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucket,
        Name: targetKey
      },
    },
    SimilarityThreshold: 70
  };

  rekogClient.compareFaces(params, function (error, response) {
    if (error) {
      res.json({ error, message: 'get call failed' });
    } else {
      let faceMatch = false
      let faceMatchPercent = 0
      if (response.FaceMatches && response.FaceMatches.length > 0) {
        faceMatch = true;
        faceMatchPercent = response.FaceMatches[0].Similarity.toFixed(2);
      }
      let updatedResponse = {
        'faceMatch': faceMatch,
        'faceMatchPercent': faceMatchPercent
      };
      // let newResponse = {
      //   "faceMatch": faceMatch,
      //   "faceMatchPercent": faceMatchPercent,
      //   "dob": ""
      // }
      res.json({ success: 'post compare call succeed!', data: updatedResponse, url: req.url, body: req.body });
    }
  });

  // res.json({success: 'get verify call succeed!', url: req.url});
});



app.get('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

app.get('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

app.post('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
