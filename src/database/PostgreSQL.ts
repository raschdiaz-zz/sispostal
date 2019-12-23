import pg, { PoolClient } from "pg";
import * as log from "../log/logger";
import { DATA_BASE_CONFIG_TEST } from "../config/config";
const logger = log.logger(__filename);

export default class PostgreSQL {
    private static _instance: PostgreSQL;
    public static INSERT: string = "I";
    public static UPDATE: string = "U";
    public static DELETE: string = "D";

    poolConnection: pg.Pool;
    isConnected: boolean = false;

    public static getInstance() {
        logger.debug("Instancia:  (" + this._instance + ")");
        return this._instance || (this._instance = new this());
    }

    public getDataBase(): pg.Pool {
        return this.poolConnection;
    }

    /**
     * Clase Inicializada con el patron Singleton, para solo mantener un solo pool de conexiones desde la aplicacion !
     */
    constructor() {
        logger.debug("Clase de conexion a la base de datos Inicializada !");
        this.poolConnection = new pg.Pool(DATA_BASE_CONFIG_TEST).on("error", err => {
            logger.error(":::::Error en la conexion:::::");
            logger.error(err);
        });
    }

    /**
     * Conexion a la base de datos, solo se debe hacer al momento de iniciar el servidor (index.ts)
     * este metodo NO debe ser llamado nuevamente.
     */
    async conectarDBAxpress() {
        if (this.isConnected) {
            logger.warn("La conexion a la base de datos AXPRESS ya existe, por favor NO intente crear otra conexion, utilice la que ya existe !");
        }
        await this.poolConnection.connect();
        this.isConnected = true;
        logger.info("La conexion a la base de datos AXPRESS fue exitosa !");
    }

    /**
     * Close all active connections in the pool.
     */

    public cerrarPoolConnectionTopaz() {
        this.isConnected = false;
        this.poolConnection.end();
    }

    /**
     * Este metodo ejecuta un query pasado como parametro
     * @param query
     */
    static ejecutarQueryWithPoolParameter(query: string, params: any[], pool: pg.Pool): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            pool
                .query(query, params)
                .then(res => {
                    let result: any[] = res.rows;
                    console.log("Cantidad de registros:  " + result.length);
                    resolve(result);
                })
                .catch(err => {
                    console.log("Error:  " + err);
                    reject(err);
                });
        });
    }

    /**
     * Este metodo ejecuta un query pasado como parametro
     * @param query
     */
    static ejecutarQuery(query: string, params: any[]): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            this._instance
                .getDataBase()
                .query(query, params)
                .then(res => {
                    let result: any[] = res.rows;
                    console.log("Cantidad de registros:  " + result.length);
                    resolve(result);
                })
                .catch(err => {
                    console.log("Error:  " + err);
                    reject(err);
                });
        });
    }

    static async ejecutarSqlQuery({ tablename, columns = ["*"], whereColumns }: { tablename: string; columns?: any[]; whereColumns: any }) {
        let sqlQuery = this.createSqlQuery(tablename, columns, whereColumns);
        logger.info("sqlQuery: " + JSON.stringify(sqlQuery));
        return await this.ejecutarQuery(sqlQuery.query, sqlQuery.params);
    }

    private static createSqlQuery = (tablename: string, columns: any[], whereColumns: any) => {
        // Setup static beginning of query
        var query = ["SELECT"];

        // Set columns
        var set: any = [];
        Object.keys(columns).forEach(function (key, i) {
            set.push(columns[i]);
        });
        query.push(set.join(", "));

        query.push("FROM");
        query.push(tablename);
        //esto no se puede hacer, porque cuando se cruzan dos tablas en el json que se envia de los where no se puede repetir, y cuando se cruzan tablas esto es necesario :(
        // var setTable: any = [];
        // Object.keys(tablename).forEach(function(key, i) {
        //   setTable.push(tablename[i]);
        // });
        // query.push(setTable.join(", "));

        // where condition
        query.push("WHERE");
        var where: any = [];
        Object.keys(whereColumns).forEach(function (key, index) {
            // where.push(key + " = " + whereColumns[key]);
            where.push(key + " = " + "$" + (index + 1));
        });
        query.push(where.join(" and "));

        let values = Object.keys(whereColumns).map(function (k) {
            return whereColumns[k];
        });

        return {
            query: query.join(" "),
            params: values
        };
    };

    /**
     * funcion que sirve para insertar en la base de datos de postgres
     * @param tablename
     * @param obj
     * @param pool
     */
    static async insert({ tablename, columns, columnNameReturn = "*" }: { tablename: string; columns: any; columnNameReturn?: any }) {
        let insertQuery = this.createInsertQuery(tablename, columns, columnNameReturn);
        logger.info("insertQuery: " + JSON.stringify(insertQuery));
        return await this.ejecutarQuery(insertQuery.query, insertQuery.params);
    }

    /**
     * funcion que crea el string de un insert para postgres
     * devuelve el query del insert y un vector de los respectivos valores
     */
    public static createInsertQuery = (tablename: string, columns: any, columnNameReturn: any = "*") => {
        let insert = "insert into " + tablename;
        let columnsList = Object.keys(columns);
        let dollar = columnsList.map(function (item, idx) {
            return "$" + (idx + 1);
        });
        let values = Object.keys(columns).map(function (k) {
            return columns[k];
        });
        return {
            query: insert + "(" + columnsList + ")" + " values(" + dollar + ") RETURNING " + columnNameReturn,
            params: values
        };
    };

    /**
     * funcion que sirve para actualizar en la base de datos de postgres
     * @param tablename
     * @param setColumns
     * @param whereColumns
     * @param pool
     */
    static async update(tablename: string, setColumns: any, whereColumns: any) {
        let updateQuery = this.createUpdateQuery(tablename, setColumns, whereColumns);
        logger.info("updateQuery: " + JSON.stringify(updateQuery));
        return await this.ejecutarQuery(updateQuery.query, updateQuery.params);
    }

    /**
     * funcion que crea el string de un update para postgres
     * devuelve el query del update y un vector de los respectivos valores
     */
    public static createUpdateQuery = (tablename: string, setColumns: any, whereColumns: any) => {
        // Setup static beginning of query
        var query = ["UPDATE"];
        query.push(tablename);
        query.push("SET");

        // Set columns
        var set: any = [];
        Object.keys(setColumns).forEach(function (key, i) {
            set.push(key + " = ($" + (i + 1) + ")");
        });
        query.push(set.join(", "));
        let values = Object.keys(setColumns).map(function (k) {
            return setColumns[k];
        });

        // where condition
        query.push("WHERE");
        var where: any = [];
        Object.keys(whereColumns).forEach(function (key) {
            where.push(key + " = " + whereColumns[key]);
        });
        query.push(where.join(" and "));

        return {
            query: query.join(" "),
            params: values
        };
    };

    /**
     * funcion que sirve para actualizar en la base de datos de postgres
     * @param tablename
     * @param setColumns
     * @param whereColumns
     * @param pool
     */
    static async delete(tablename: string, whereColumns: any) {
        let deleteQuery = this.createDeleteQuery(tablename, whereColumns);
        logger.info("deleteQuery: " + JSON.stringify(deleteQuery));
        return await this.ejecutarQuery(deleteQuery.query, deleteQuery.params);
    }

    /**
     * funcion que crea el string de un delete para postgres
     * devuelve el query del update
     */
    public static createDeleteQuery = (tablename: string, whereColumns: any) => {
        // Setup static beginning of query
        var query = ["DELETE"];
        query.push("FROM");
        query.push(tablename);

        // where condition
        query.push("WHERE");
        var where: any = [];
        Object.keys(whereColumns).forEach(function (key, index) {
            // where.push(key + " = " + whereColumns[key]);
            where.push(key + " = " + "$" + (index + 1));
        });
        query.push(where.join(" and "));

        // array values, para ser reeplazados por $
        let values = Object.keys(whereColumns).map(function (k) {
            return whereColumns[k];
        });

        return {
            query: query.join(" "),
            params: values
        };
    };

    public static ejecutarTransaccion = (callback: (client: PoolClient) => any) => {
        return new Promise(async (resolve, reject) => {
            const client = await PostgreSQL.getInstance()
                .getDataBase()
                .connect();
            try {
                await client.query("BEGIN");

                let response = await callback(client);

                await client.query("COMMIT");
                resolve(response);
            } catch (e) {
                logger.info(JSON.stringify(e));
                logger.info(JSON.stringify(e.stack));
                await client.query("ROLLBACK");
                reject(
                    e
                );
            } finally {
                client.release();
            }
        });
    };

    public static async operacionTransaccion({
        tablename,
        columns,
        columnNameReturn = "*",
        client,
        whereColumns,
        tipoTransaccion
    }: {
        tablename: string;
        columns: any;
        columnNameReturn?: any;
        client: any;
        whereColumns?: any;
        tipoTransaccion: string;
    }) {
        let operationsRows: any = undefined;
        let sqlOperation: any = undefined;
        if (tipoTransaccion === this.INSERT) {
            sqlOperation = PostgreSQL.createInsertQuery(tablename, columns, columnNameReturn);
            logger.info(JSON.stringify(sqlOperation));
            operationsRows = await client.query(sqlOperation.query, sqlOperation.params);
        } else if (tipoTransaccion === this.UPDATE) {
            sqlOperation = PostgreSQL.createUpdateQuery(tablename, columns, whereColumns);
            logger.info(JSON.stringify(sqlOperation));
            operationsRows = await client.query(sqlOperation.query, sqlOperation.params);
        } else if (tipoTransaccion === this.DELETE) {
            sqlOperation = PostgreSQL.createDeleteQuery(tablename, whereColumns);
            operationsRows = await client.query(sqlOperation.query, sqlOperation.params);
        } else {
            operationsRows = { error: `El tipo de transaccion ${tipoTransaccion} no existe.` };
        }
        return operationsRows;
    }
}
