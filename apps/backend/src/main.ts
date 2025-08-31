import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Load OpenAPI spec from file
  const openApiPath = path.join(process.cwd(), 'openapi.yaml');
  const openApiContent = fs.readFileSync(openApiPath, 'utf8');
  const openApiSpec = yaml.load(openApiContent) as any;

  // Setup Swagger with our OpenAPI spec
  SwaggerModule.setup('api', app, openApiSpec);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api`);
}

bootstrap();
