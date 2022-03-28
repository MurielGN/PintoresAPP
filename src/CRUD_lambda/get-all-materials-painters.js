const AWS = require("aws-sdk");

const DYNAMO = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "materials2";


async function queryItems(){
  var params = {
    TableName: TABLE_DYNAMODB,
    KeyConditionExpression: '#partitionKeyName = :partitionkeyval AND begins_with ( #sortKeyName, :sortkeyval )',
    ExpressionAttributeValues: { ':partitionkeyval': 1, ':sortkeyval': 'l',},
    ExpressionAttributeNames: { '#partitionKeyName': 'id', '#sortKeyName': 'name' }
  }
  
  try {
    const data = await DYNAMO.query(params).promise()
    return data.Items
  } catch (err) {
    return err
  }
  
}


exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  body = await queryItems();
  
    return {
    statusCode,
    body,
    //headers
  };

}
