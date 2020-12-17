'use strict';
var AWS = require('aws-sdk');
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
var docClient = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: 'us-east-1' });
module.exports.hello = async event => {
  const itens = {
    TableName: "socket-lambda"
  }

  const document = await docClient.scan(itens).promise()
  const { Count } = document
  console.log("itens", Count)
  
  const params = {
    MessageAttributes: {
      "numberItens": {
        DataType: "String",
        StringValue: String(Count)
      }
    },
    MessageBody: 'dynamodb event',
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/149239330696/socket-fila"
  }

  let body;
  try {
    const data = await sqs.sendMessage(params).promise()
    body = data.MessageId;
  } catch (error) {
    console.log(error)
    body = error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(body)
    ,
  };

};
