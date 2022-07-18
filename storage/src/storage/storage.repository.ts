import { inject, injectable } from "inversify";
import kfs from "key-file-storage";

import "reflect-metadata";
import { IConfigService } from "../config/config.service.interface";
import { INVERSIFY_TYPES } from "../config/inversify.types";
import { ILoggerService } from "../logger/logger.service.interface";
import { IStorageRepository } from "./storage.repository.interface";

@injectable()
export class StorageRepository implements IStorageRepository {
  private storage: any;

  constructor(
    @inject(INVERSIFY_TYPES.Logger) private logger: ILoggerService,
    @inject(INVERSIFY_TYPES.ConfigService) private config: IConfigService,
  ) {
    this.storage = kfs("DB/path");
  }

  async get(key: string): Promise<string> {
    return this.storage(key);
  }

  async set(key: string, value: string): Promise<void> {
    return this.storage(key, value);
  }
}
