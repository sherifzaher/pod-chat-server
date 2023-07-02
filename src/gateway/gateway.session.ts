import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../utils/interfaces';

export interface IGatewaySession {
  getSocketId(id: number): AuthenticatedSocket;
  setUserSocket(id: number, socket: AuthenticatedSocket): void;
  removeUserSocket(id: number): void;
  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySession {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();
  getSocketId(id: number) {
    return this.sessions.get(id);
  }

  setUserSocket(userId: number, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
  }

  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
