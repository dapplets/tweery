import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INVERSIFY_TYPES } from "../config/inversify.types";
import { HTTPError } from "../errors/http.error";
import { ILoggerService } from "../logger/logger.service.interface";
import { RouterController } from "../router/router.controller";
import { IStorageController } from "./storage.controller.interface";
import { IStorageRepository } from "./storage.repository.interface";

@injectable()
export class StorageController
  extends RouterController
  implements IStorageController
{
  constructor(
    @inject(INVERSIFY_TYPES.StorageRepository)
    private repository: IStorageRepository,
    @inject(INVERSIFY_TYPES.Logger) logger: ILoggerService,
  ) {
    super(logger);

    this.bindRoutes([{ path: "/", method: "get", func: this.get }]);
    this.bindRoutes([{ path: "/", method: "post", func: this.set }]);
  }

  async get(
    { query }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const value = await this.repository.get(query.key as string);
    res.status(200).json(value);
  }

  async set(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.repository.set(body.key, body.value);
    res.status(200).send();
  }
}
