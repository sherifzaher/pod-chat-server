import { IoAdapter } from '@nestjs/platform-socket.io';
import { getRepository } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { Session, User } from '../utils/typeorm/index';
import { AuthenticatedSocket } from '../utils/interfaces';
import { plainToInstance } from 'class-transformer';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const sessionRepository = getRepository(Session);
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      const { cookie: cookieClient } = socket.handshake.headers;
      if (!cookieClient) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated'));
      }

      const { POD_CHAT_SESSION_ID } = cookie.parse(cookieClient);
      if (!POD_CHAT_SESSION_ID) {
        console.log('POD_CHAT_SESSION_ID Cookie not provided');
        return next(new Error('Not Authenticated'));
      }

      const signedCookie = cookieParser.signedCookie(
        POD_CHAT_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) {
        console.log('Cookie not signed or destroyed');
        return next(new Error('Not Authenticated'));
      }

      const session = await sessionRepository.findOne({ id: signedCookie });

      if (!session?.json) return next(new Error('Not Found user'));

      socket.user = plainToInstance(
        User,
        JSON.parse(session.json).passport.user,
      );
      next();
    });
    return server;
  }
}
