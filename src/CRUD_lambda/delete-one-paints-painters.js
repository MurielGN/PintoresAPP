const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "paints";

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
          element: 'paint',
          id: verify(event.id)
        }
      }).promise();
      
      if(body.Attributes == undefined){
        statusCode = 404;
        throw new Error("Paint with id: " + event.id + " not found");
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
