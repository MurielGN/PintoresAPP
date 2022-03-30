const AWS = require("aws-sdk");

const DYNAMO = new AWS.DynamoDB.DocumentClient();

const TABLE_DYNAMODB = "paints";

var statusCode;


async function queryItems(filterStarWith){
  var params = {
    TableName: TABLE_DYNAMODB,
    
    KeyConditionExpression: '#partitionKeyName = :partitionkeyval',
    FilterExpression: 'begins_with (#starWith, :substr)',
    ExpressionAttributeValues: { ':partitionkeyval': 'paint', ':substr': filterStarWith},
    ExpressionAttributeNames: { '#partitionKeyName': 'element', '#starWith': 'type' },
  }
  
    const data = await DYNAMO.query(params).promise();
    
    if(data.Count == 0){
      statusCode = 404;
      throw new Error("Paints type starting with: " + filterStarWith + " not found");
    }
    
    return data.Items

  
}


exports.handler = async (event, context) => {
  let body;
  statusCode = 200;

  try {
    
    let filterStarWith = event.expression;
    if(typeof filterStarWith !== "string" || !isNaN(filterStarWith)|| filterStarWith === ""){
      statusCode = 400;
      throw new Error("Expression: " + filterStarWith + " is invalid");
    }
    
    body = await queryItems(filterStarWith);
    
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

