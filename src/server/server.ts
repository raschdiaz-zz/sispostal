import express from "express";
import { TOKEN } from "../constants/Constantes";
import bodyParser from "body-parser";
import path = require("path");
import { PATH_DOCUMENT_COMPANY } from "../config/config";

export default class Server {

    public app: express.Application;
    public hostName: string;
    public port: number;

    constructor(hostName: string, port: number) {
        this.hostName = hostName;
        this.port = port;
        this.app = express();

        this.setCors();
        this.bodyParser();
    }

    private setCors() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, " + TOKEN);
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            next();
        });
    }

    private bodyParser() {
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // parse application/json
        //Se añade el atributo limit, por que el valor por defecto es de 100kb según su documentación https://www.npmjs.com/package/body-parser, y en proceso necesitaba guardar mas información
        this.app.use(bodyParser.json({ limit: '500kb' }));
    }

    static init(hostName: string, port: number) {
        return new Server(hostName, port);
    }

    start(callback: Function) {
        this.app.listen(this.port, this.hostName, callback());
        this.publicFolder();
    }

    private publicFolder() {
        const publicPath = path.resolve(__dirname, "../public");
        this.app.use(express.static(publicPath));

        const documentPath = path.resolve(__dirname, PATH_DOCUMENT_COMPANY);
        // this.app.use('/documents', verificaToken, express.static(documentPath));
        this.app.use('/documents', express.static(documentPath));
    }

}