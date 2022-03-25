const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  body = await dynamo.delete({ 
    TableName: event.tabla,
    Key: {
      id: event.id
    }
  }).promise();
  
    return {
    statusCode,
    body,
    headers
  };

}