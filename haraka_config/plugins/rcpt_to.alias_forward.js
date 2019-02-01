var
  Address = require('address-rfc2821').Address,
  util = require('util');

const axios = require('axios');

exports.register = function () {
  this.register_hook('rcpt', 'alias_forward');
};

exports.alias_forward = async function(next, connection, params) {
  var
    plugin = this,
    rcpt = params[0],
    list;
var email = rcpt.user + "@" + rcpt.host;

let axiosConfig = {headers: {
  "Content-Type" : "application/json",
  "Access-Control-Allow-Origin": "*",
  "X-Hasura-Access-Key" : "mysupersecretkeyinyourservicesir"
  }
};
connection.loginfo(plugin,`email = ${email}`);
var postData = {"query":"query {main_table(where:{from:{_eq:\""+email+"\"}}){from,to}}","variables":null};

try{
  var result = await axios.post('http://localhost:8080/v1alpha1/graphql', postData, axiosConfig);

  var obj = result.data.data.main_table[0];
    // res == true
    if(obj){
      var address = obj.to;
      connection.loginfo(plugin,`address = ${address}`);
      connection.transaction.rcpt_to.pop();
      connection.relaying = true;
      plugin.loginfo('Relaying to: ' + address);
      connection.transaction.rcpt_to.push(new Address('<' + address + '>'));
      return next(OK);
    } else {
      next(DENY);
    }
  }catch(err){
   console.log("AXIOS ERROR: ", err);
   next(DENY);
  }
 
};
