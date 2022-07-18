import { inject, injectable } from "inversify";
import "reflect-metadata";
import { INVERSIFY_TYPES } from "./config/inversify.types";
import express, { Express } from "express";
import { json } from "body-parser";
import { ILoggerService } from "./logger/logger.service.interface";
import { IConfigService } from "./config/config.service.interface";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { IStorageController } from "./storage/storage.controller.interface";
import cors from "cors";

@injectable()
export class App {
  app: Express;
  port: number;
  constructor(
    @inject(INVERSIFY_TYPES.Logger) private logger: ILoggerService,
    @inject(INVERSIFY_TYPES.ConfigService) private config: IConfigService,
    @inject(INVERSIFY_TYPES.ExeptionFilter) private exeption: IExeptionFilter,
    @inject(INVERSIFY_TYPES.StorageController)
    private storage: IStorageController,
  ) {
    this.app = express();
    this.port = Number(this.config.get("PORT")) || 8000;
  }

  useRoutes(): void {
    this.app.use(this.storage.router);
  }

  useMiddleware(): void {
    this.app.use(json());
  }

  useExeptionFilter(): void {
    this.app.use(this.exeption.catch.bind(this.exeption));
  }

  useCors(): void {
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      }),
    );
  }

  public async init(): Promise<void> {
    this.useCors();

    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilter();

    this.app.listen(this.port);
    this.logger.info(`The server is running on http://localhost:${this.port}`);
  }
}
