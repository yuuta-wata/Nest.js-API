import dotenv from 'dotenv';
import session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectRedis from 'connect-redis';
import { redis } from './redis';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const RedisStore = connectRedis(session);
  // クッキーの設定
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'nestapp',
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 365,
      },
    }),
  );

  await app.listen(4000);
  console.log('server started on http://localhost:4000/graphql');
}
bootstrap();
