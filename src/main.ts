import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/exception.filter';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const i18nService =
    app.get<I18nService<Record<string, unknown>>>(I18nService);
  app.useGlobalFilters(new AllExceptionsFilter(i18nService));
  await app.listen(3000);
}
bootstrap();
