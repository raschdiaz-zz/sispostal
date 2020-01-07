import { Router, Request, Response } from "express";
import * as log from "../../log/logger";
import { notificarEstadoMapping, notificarReliquidacionMapping } from "../../middlewares/mapping";
//import ModelLogic from "../../business-logic/model";

const sispostalRoutes = Router();
const logger = log.logger(__filename);

sispostalRoutes.post('/notificarCambioEstado', notificarEstadoMapping, (req: Request, res: Response) => {
    let body: object = req.body;
    /*
    * { 
	*   "NumeroGuia": "ASQ123",
	*   "IdEstado": 123,
	*   "hora": "2020-01-07T13:51:16+00:00"
    * }
    */
    logger.debug("notificarCambioEstado request body: " + JSON.stringify(body));
    res.status(200).json({
        ok: true,
        IdCodigo: 456,
        IdDescripcion: "2020-01-07T15:00:19+00:00"
    })
});

sispostalRoutes.post('/notificarReliquidacion', notificarReliquidacionMapping, (req: Request, res: Response) => {
    let body: object = req.body;
    /*
    * { 
	*   "idTransaccion": 123456,
	*   "idCliente": 123,
    *   "numeroGuia": "323-234",
    *   "hora": "2020-01-07T13:51:16+00:00",
    *   "DetalleReliquidacion": [
    *       {
    *           "Item": 1,
    *           "IdConcepto": "456765",
    *           "valorAPagar" 100000
    *       }
    *   ]
    * }
    */
    logger.debug("notificarReliquidacion request body: " + JSON.stringify(body));
    res.status(200).json({
        ok: true,
        IdCodigo: 456,
        IdDescripcion: "2020-01-07T15:00:19+00:00"
    })
});

export default sispostalRoutes;