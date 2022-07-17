import { injectable } from "inversify";
import { Logger } from "tslog";
import "reflect-metadata";
import { ILoggerService } from "./logger.service.interface";

@injectable()
export class LoggerService implements ILoggerService {
  logger: Logger;

  constructor() {
    this.logger = new Logger({
      displayDateTime: false,
      displayFilePath: "hidden",
      displayInstanceName: true,
    });
  }

  info(...args: unknown[]): void {
    this.logger.info(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }
}
