const AWS = require("aws-sdk");

const DYNAMO = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "paints";


async function queryItems(){
  var params = {
    TableName: TABLE_DYNAMODB,
    
    KeyConditionExpression: '#partitionKeyName = :partitionkeyval',

    ExpressionAttributeValues: { ':partitionkeyval': 'paint' },
    ExpressionAttributeNames: { '#partitionKeyName': 'element' }
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
  
  body = await queryItems();
  
    return {
    statusCode,
    body,

  };

}
