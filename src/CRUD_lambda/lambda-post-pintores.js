const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

var params;

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  let data = event.item;
  
  if (data.rendimiento == null) {
    params = {
        // Obtengo el nombre de la tabla de la variable de entorno
        TableName: event.tabla,
        Item: {
          id: data.id,
          nombre: data.nombre,
          precio: data.precio,
        },
      };
  }else {
    params = {
        // Obtengo el nombre de la tabla de la variable de entorno
        TableName: event.tabla,
        Item: {
          id: data.id,
          tipo: data.tipo,
          rendimiento: data.rendimiento,
          precio: data.precio,
        },
      };
  }
  
  body = await dynamo
          .put(params)
          .promise();
  body = `Put item ${data.id}`;
  
    return {
    statusCode,
    body,
    headers
  };

}