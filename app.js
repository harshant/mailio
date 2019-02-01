var express = require("express");
var bodyParser = require("body-parser");
const axios = require('axios');
var path = require('path');


var app = express();
// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())

create = (req, resmain) => {
    
    if(req.body.from && req.body.to ){
        // Store hash in your password DB.
     
        var postData = {"query":"mutation{insert_main_table(objects:[{from:\""+req.body.from+"\",to:\""+req.body.to+"\"}]){returning{from}}}"};
        
        let axiosConfig = {headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Hasura-Access-Key" : "mysupersecretkeyinyourservicesir"
            }
          };

        axios.post('http://localhost:8080/v1alpha1/graphql', postData, axiosConfig)
    
        .then((res) => {
          if(res.status == 200){
              obj = res.data.data.insert_main_table.returning[0].from;
              resmain.json({message: "forwarding rule created for", from: obj});
            } else {
              resmain.status(401).json({message:"Cant signup , something went wrong"});
            }
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
         })
      
      }else{
        resmain.json({message:" problem with creating entry"});
      }
    
    }

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.post("/create", function(req, res) {
    create(req,res);
    res.json({message : "successfully created"});
});

app.use(express.static(path.join(__dirname)));


app.listen(3000, function() {
  console.log("Express running");
});


