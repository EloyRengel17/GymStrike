import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir cookies o encabezados de autenticación si se usa mas adelante
  });

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist:true,
    //forbidNonWhitelisted:true,
    transform:true,
    transformOptions:{
      enableImplicitConversion:true
    }

  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
