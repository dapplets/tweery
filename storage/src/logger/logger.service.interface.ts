import { Logger } from "tslog";

export interface ILoggerService {
  logger: Logger;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}
