import { Router } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { INVERSIFY_TYPES } from "../config/inversify.types";
import { ILoggerService } from "../logger/logger.service.interface";
import { IRoute } from "./route.interface";

@injectable()
export abstract class RouterController {
  private readonly _router: Router;

  constructor(@inject(INVERSIFY_TYPES.Logger) private logger: ILoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  protected bindRoutes(routes: IRoute[]): void {
    routes.forEach(({ func, method, path }) => {
      this.logger.info(`[${method}] ${path}`);

      const bindFunc = func.bind(this);
      this.router[method](path, bindFunc);
    });
  }
}
