import { HTTPError } from "./http.error";
import { NextFunction, Request, Response } from "express";

export interface IExeptionFilter {
  catch(
    error: Error | HTTPError,
    _: Request,
    res: Response,
    __: NextFunction,
  ): void;
}
