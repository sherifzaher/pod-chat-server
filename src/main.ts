import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { Session } from './utils/typeorm';
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from 'typeorm';

async function bootstrap() {
  const { PORT, COOKIE_SECRET } = process.env;
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getRepository(Session);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // cookie expires after 1 day.
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  try {
    await app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
