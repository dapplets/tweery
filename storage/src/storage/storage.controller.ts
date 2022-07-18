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

    if (value === null) {
      return next(new HTTPError(422, "There is no such field", "STORAGE"));
    }

    res.status(200).send(value);
  }

  async set(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const value = await this.repository.get(body.key);

    if (value !== null && body.value === value) {
      return next(
        new HTTPError(422, "The field and value already exist", "STORAGE"),
      );
    }

    this.repository.set(body.key, body.value);
    res.status(200).send(body);
  }
}
