const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  body = await dynamo.scan({ TableName: event.tabla }).promise();
  body = body["Items"];
  
    return {
    statusCode,
    body,
    headers
  };

}