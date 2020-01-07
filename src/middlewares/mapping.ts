import * as log from "../log/logger";

//import { ModelName } from "../models/modelName";

const logger = log.logger(__filename);
/* Ejemplo de mapeo
export const modelMapping = (req: any, res, next) => {

    let body: any = req.body;

    let model = new ModelName({
        field_one: body.fieldOne,
        field_two: body.fieldTwo
    });

    req.body = model;

    next();

};
*/

export const notificarEstadoMapping = (req: any, res, next) => {
    let body: any = req.body;
    next();
}

export const notificarReliquidacionMapping = (req: any, res, next) => {
    let body: any = req.body;
    next();
}