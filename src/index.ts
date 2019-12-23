import Server from "./server/server";
import { HOST_NAME, PORT } from "./config/config";
import PostgreSQL from "./database/PostgreSQL";
import * as log from "./log/logger";

import Sispostal from "./server/router/sispostal";

const logger = log.logger(__filename);

//inicializando el servidor
const server = Server.init(HOST_NAME, PORT);

server.app.use(Sispostal);

//Conexion a la base de datos, cuando arranca el server
let initialize = PostgreSQL.getInstance();

initialize
    .conectarDBAxpress()
    .then(() => {
        //Corriendo el servidor, solo si se pudo conectar a la base de datos
        server.start(() => {
            logger.info("Servidor corriendo en " + HOST_NAME + ":" + PORT);
        });
    })
    .catch(error => {
        logger.error("###############################");
        logger.error(error.message);
        throw error;
    });