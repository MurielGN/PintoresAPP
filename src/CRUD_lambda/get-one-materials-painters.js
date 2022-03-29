const AWS = require("aws-sdk");

const DYNAMO = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "paints";


async function queryItems(filterStarWith){
  var params = {
    TableName: TABLE_DYNAMODB,
    
    KeyConditionExpression: '#partitionKeyName = :partitionkeyval',
    FilterExpression: 'begins_with (#starWith, :substr)',
    ExpressionAttributeValues: { ':partitionkeyval': 'paint', ':substr': filterStarWith},
    ExpressionAttributeNames: { '#partitionKeyName': 'element', '#starWith': 'type' },
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

  let filterStarWith = event.expression;
  body = await queryItems(filterStarWith);
  
    return {
    statusCode,
    body,
  };

}
