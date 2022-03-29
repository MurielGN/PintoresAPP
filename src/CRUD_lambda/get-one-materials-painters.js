const AWS = require("aws-sdk");

const DYNAMO = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "materials";


async function queryItems(id){
  var params = {
    TableName: TABLE_DYNAMODB,
    
    KeyConditionExpression: '#partitionKeyName = :partitionkeyval AND #sortKeyName = :sortkeyval',
    ExpressionAttributeValues: { ':partitionkeyval': 'paint', ':sortkeyval': id},
    ExpressionAttributeNames: { '#partitionKeyName': 'element', '#sortKeyName': 'id'},
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
  
  let id = event.id;
  body = await queryItems(id);
  
    return {
    statusCode,
    body
  };

}
