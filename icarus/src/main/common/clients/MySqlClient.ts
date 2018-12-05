const mysql = require('mysql');

const queryTimeout = 1000; // 1 sec

export class MySqlClient {

    constructor(private readonly connectionOptions:any) {}

    private connect(): any {
        // console.log('Opening MySQL connection: %j', this.connectionOptions)
        return mysql.createConnection(this.connectionOptions)
    }

    private async closeConnection(connection): Promise<void> {
        return new Promise<void>((resolve,reject) => 
            connection.end( (err) => {
                if(err) {
                    console.error('Error closing the connection: ' + err)
                    reject(err)
                } else {
                    resolve()
                }
            })
        )
    }

    // Promosify MySQL query in the form query(options, cb)
    private async toPromise(connection, options:any):Promise<any> {
        // console.log('Executing MySQL query: %j', options)

        const toPromise = (mySqlOp: (options, cb) => void, options ): Promise<any> =>
        new Promise<any>((respond, reject) => {
            mySqlOp(options, (err, results, fields) => {
                if(err) {
                    console.error('Error executing MySQL query: ' + err)
                    reject(err)
                } else {
                    // console.log('MySQL query results: %j', results)
                    respond(results)
                }
            })
        })

        const _q = (options, cb) => connection.query(options, cb)
        return toPromise(_q, options)
    }

    // Execute a query with parameters
    async query(sql:string, params:any[]):Promise<any> {
        const connection = this.connect()

        const queryOptions = {
            sql: sql,
            timeout: queryTimeout,
            values: params
        }

        return this.toPromise(connection, queryOptions)
            // This eventually close the connection, but the returned Promise doesn't wait for that. Any potential issue?
            .then( result => {
                this.closeConnection(connection)
                return result
            })
            .catch(err => {
                this.closeConnection(connection)
                throw err
            })
    }

    // Execute a query without parameters
    async execute(sql:string):Promise<any> {
        return this.query(sql,[])
    }
}

