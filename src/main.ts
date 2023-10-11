import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';

class Application {
  private readonly server: INestApplication;
  constructor(server: INestApplication) {
    this.server = server;
  }

  private setupOpenAPI() {
    const config = new DocumentBuilder()
      .setTitle('Daily day')
      .setDescription('Daily day API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.server, config);
    SwaggerModule.setup('docs', this.server, document);
  }

  private setupBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
      }),
    );
  }

  // setup 순서 중요
  private addGlobalMiddleware() {
    this.setupBasicAuth();
    this.setupOpenAPI();
    this.server.useGlobalPipes(new ValidationPipe({ transform: true }));
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    );
    this.server.useGlobalInterceptors(new SuccessResponseInterceptor());
    this.server.useGlobalFilters(new HttpExceptionFilter());
  }
  async init() {
    this.addGlobalMiddleware();
    await this.server.listen(process.env.PORT);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const application = new Application(app);
  await application.init();
}

bootstrap()
  .then(() =>
    new Logger('bootstrap').log(`✅ Server on port: ${process.env.PORT}`),
  )
  .catch((reason) => new Logger('bootstrap').error(reason));
