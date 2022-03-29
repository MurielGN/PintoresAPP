const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

var params;

const TABLE_DYNAMODB = "materials";
const NAME_PK_ARROW = "material";
const NUMBER_COLUMNS = 3;
//const NAMES_COLUMSN = ["id","name","price"];
const NAMES_COLUMSN = { "id":"number", "name":"string","price":"number"};

var statusCode;


function verify(value) {
  
  if (Object.keys(value).length != NUMBER_COLUMNS) {
    statusCode = 405;
    throw new Error("The id " + value + " is invalid");
  }
  
  for(let key of Object.keys(value)){
    
    if(Object.keys(NAMES_COLUMSN).indexOf(key) == -1){
      statusCode = 405;
      throw new Error("Item " + JSON.stringify(value) + " is invalid");
    }    
    
    if(typeof value[key] !== NAMES_COLUMSN[key]){
      statusCode = 405;
      throw new Error(key+": " + value[key] + " is not a "+NAMES_COLUMSN[key]);
    }
    
  }
  
  return value;
}


exports.handler = async (event, context) => {
  let body;
  statusCode = 200;
  
  try {
    let data = verify(event.item);
  
    params = {
      TableName: TABLE_DYNAMODB,
      Item: {
           element: NAME_PK_ARROW,
           id:      data.id,
           name:    data.name,
           price:   data.price
      },
    };
    
    body = await dynamo
            .put(params)
            .promise();
    body = `Put item ${data.id}`;
    
    return {
      statusCode,
      body
    };
    
  } catch (err) {
     return {
      statusCode,
      Error: err.toString(),
    };
  }
 
}
