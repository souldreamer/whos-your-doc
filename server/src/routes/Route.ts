import * as express from 'express';
export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;

export interface RouteRenderFunction {
	(req: Request, res: Response, next: NextFunction): void;
}
