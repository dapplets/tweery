import { NextFunction, Request, Response } from "express";
import { RouterController } from "../router/router.controller";

export interface IStorageController extends RouterController {
  set(req: Request, res: Response, next: NextFunction): Promise<void>;
  get(req: Request, res: Response, next: NextFunction): Promise<void>;
}
