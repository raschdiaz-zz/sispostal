import { Router, Request, Response } from "express";
import * as log from "../../log/logger";
//import { modelMapping } from "../../middlewares/mapping";
//import ModelLogic from "../../business-logic/model";

const sispostalRoutes = Router();
const logger = log.logger(__filename);

sispostalRoutes.get('/sispostal-one'/*, modelMapping */, (req: Request, res: Response) => {
    logger.info("End-point sispostal-one");
    //let lista = ModelLogic.instance;
    res.status(200).json({
        ok: true,
        sispostalOne: true
    })
});

sispostalRoutes.get('/sispostal-two', (req: Request, res: Response) => {
    logger.info("End-point sispostal-two");
    res.status(200).json({
        ok: true,
        sispostalTwo: true
    })
});

export default sispostalRoutes;