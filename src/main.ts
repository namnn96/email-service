import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { ApiModule } from '@app/api/api.module';
import { WorkerModule } from '@app/worker/worker.module';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Email Service')
    .setDescription('Abstraction of third party email providers')
    .setVersion('1.0')
    .addTag('email')
    .build();
  const options: SwaggerDocumentOptions =  {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const isApi = process.env.APP === 'api';
  const app = isApi
    ? await NestFactory.create(ApiModule, { logger: ['log', 'error'] })
    : await NestFactory.create(WorkerModule, { logger: ['log', 'error'] });
  app.useGlobalPipes(new ValidationPipe());

  if (isApi) {
    app.enableCors();
    setupSwagger(app);
  }

  await app.listen(+process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
