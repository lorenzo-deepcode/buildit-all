export const toPromise = (op: (cb, evt) => void, evt): Promise<any> =>
  new Promise<any>((respond, reject) => {
    op((err, res) => {
      if (err) {
        reject(err);
      } else {
        respond(res);
      }
    }, evt);
  });
