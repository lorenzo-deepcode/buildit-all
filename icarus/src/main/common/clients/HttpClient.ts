const request = require('request');

import { host, uri, lambdaStage } from "../Api";

export function pathToLambda(host: host, stage:lambdaStage, path: string): uri {
  return `https://${host}/${stage}/${path}`;
}

export class HttpClient {

  doHttp(options: any): Promise<any> {
    return new Promise<any>((respond, reject) => {
      request(options, (err, res, body) => {
        if (res && res.statusCode == 200) {
          respond(body);
        } else {
          console.log("Failure: " + body);
          if (err) {
            reject(err);
          } else {
            reject(body);
          }
        }
      });
    });
  }

}
