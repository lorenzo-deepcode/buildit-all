const AWS = require('aws-sdk');

export class DynamoWritePager {
  constructor(private readonly client: DynamoClient) {}

  async putAll(tableName: string, items: Array<any>): Promise<any[]> {
    const results: any[] = [];
    for (let i = 0; i < items.length; i += 25) {
      const result = await this.client.putAll(tableName, items.slice(i, Math.min(items.length, i + 25)));
      results.push(result);
    }
    return results;
  }
}

export class DynamoClient {

  static dynamo = new AWS.DynamoDB.DocumentClient();

  constructor(private readonly tablePrefix: string) {}

  put(tableName: string, item: any): Promise<any> {
    return this.doOp({
      TableName: `${this.tablePrefix}${tableName}`,
      Item: item
    }, (p, cb) => DynamoClient.dynamo.put(p, cb));
  }

  get(tableName: string, key: any): Promise<any> {
    return this.doOp({
      TableName: `${this.tablePrefix}${tableName}`,
      Key: key
    }, (p, cb) => DynamoClient.dynamo.get(p, cb))
      .then(result => result && result.Item || undefined);
  }

  delete(tableName: string, key: any): Promise<any> {
    return this.doOp({
      TableName: `${this.tablePrefix}${tableName}`,
      Key: key
    }, (p, cb) => DynamoClient.dynamo.delete(p, cb));    
  }

  putAll(tableName: string, items: Array<any>): Promise<any> {
    const params = {
      RequestItems: {}
    };

    params.RequestItems[`${this.tablePrefix}${tableName}`] = items.map(item => ({
      PutRequest: {
        Item: item
      }
    }));

    return this.doOp(params, (p, cb) => DynamoClient.dynamo.batchWrite(p, cb));
  }

  query(tableName: string, otherParams: any): Promise<any[]> {
    // This modifies the otherParams object passed by ref...
    otherParams.TableName = `${this.tablePrefix}${tableName}`

    return this.doOp(otherParams, (p, cb) => DynamoClient.dynamo.query(p, cb))
      .then(data => data.Items);
  }

  private doOp(params: any, op: (params: any, cb: (err: any, res: any) => void) => void): Promise<any> {
    return new Promise<any>((respond, reject) => {
      op(params, (err, res) => {
        if (err) {
          reject(err);
        } else {
          respond(res);
        }
      });
    });
  }
}
