import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from 'typeorm';
import { AppModule } from './app.module';
import { Session } from './utils/typeorm';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const { PORT, COOKIE_SECRET } = process.env;
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getRepository(Session);
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.4:3000'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      name: 'POD_CHAT_SESSION_ID',
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
