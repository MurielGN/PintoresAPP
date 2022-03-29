const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "materials";

var statusCode;


function verify(value) {
  if (value <= 0 || isNaN(value)) {
    statusCode = 400;
    throw new Error("The id " + value + " is invalid");
  }
  return value;
}

exports.handler = async (event, context) => {
  let body;
  statusCode = 200;
  
  
  try {

    body = await dynamo.delete({ 
      TableName: TABLE_DYNAMODB,
      ReturnValues: "ALL_OLD",
      Key: {
        element: 'material',
        id: verify(event.id)
      }
    }).promise();
    
    console.log("Status: "+ statusCode);
    
    if(body.Attributes == undefined){
      statusCode = 404;
      throw new Error("Material with id: " + event.id + " not found");
    }
    
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
