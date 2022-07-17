import { Container, ContainerModule } from "inversify";
import { App } from "./app";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";
import { INVERSIFY_TYPES } from "./config/inversify.types";
import { StorageRepository } from "./storage/storage.repository";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { LoggerService } from "./logger/logger.service";
import { ILoggerService } from "./logger/logger.service.interface";
import { StorageController } from "./storage/storage.controller";
import { IStorageRepository } from "./storage/storage.repository.interface";
import { IStorageController } from "./storage/storage.controller.interface";

const appBinding = new ContainerModule((bind) => {
  bind<ILoggerService>(INVERSIFY_TYPES.Logger).to(LoggerService);
  bind<IConfigService>(INVERSIFY_TYPES.ConfigService).to(ConfigService);
  bind<IStorageRepository>(INVERSIFY_TYPES.StorageRepository).to(
    StorageRepository,
  );
  bind<IExeptionFilter>(INVERSIFY_TYPES.ExeptionFilter).to(ExeptionFilter);
  bind<IStorageController>(INVERSIFY_TYPES.StorageController).to(
    StorageController,
  );

  bind<App>(INVERSIFY_TYPES.App).to(App);
});

function bootstrap(): void {
  const appContainer = new Container();
  appContainer.load(appBinding);

  const app = appContainer.get<App>(INVERSIFY_TYPES.App);
  app.init();
}

bootstrap();
