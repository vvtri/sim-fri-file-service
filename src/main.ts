import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// trigger cicd
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = '/api/file-service';

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix(prefix);

  const config = new DocumentBuilder()
    .setTitle('File Service API')
    .setDescription('File Service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/swagger`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(+process.env.PORT || 5002);
  console.log('FileService is running');
}
bootstrap();
