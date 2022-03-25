const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();



async function queryItems(tabla, valor){
  var params = {
    TableName: tabla,
    KeyConditionExpression: '#name = :value',
    ExpressionAttributeValues: { ':value': valor },
    ExpressionAttributeNames: { '#name': 'id' }
  }
  
  try {
    const data = await dynamo.query(params).promise()
    return data.Items[0]
  } catch (err) {
    return err
  }
  
}


exports.handler = async (event, context) => {
  var presupuesto = 0;
  
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  let data = event.item;
  
  for(let casa of data.Casas){
      let presupuestoAux = 0;
      
      for(let id in casa.materiales){
        id = parseInt(id);
        let material = await queryItems("Materiales",id);
        presupuestoAux += material.precio * casa.materiales[id];
      }
      console.log('Materiales: ' + presupuestoAux);
      
      for(let i in casa.pinturas){
        let pinturaBD = await queryItems("Pinturas",casa.pinturas[i].id);
        
        presupuestoAux += ( casa.pinturas[i].superficie / pinturaBD.rendimiento ) * pinturaBD.precio;
      }
      console.log('Pinturas: ' + presupuestoAux);
        
      presupuestoAux *= casa.numeroCasas;
        
      presupuesto += presupuestoAux;
      
      presupuesto = Math.round(presupuesto * 100) / 100

      
  }
  
  
  return {
    statusCode,
    presupuesto,
    headers
  };

};
