import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthStubMiddleware implements NestMiddleware {
  use(req: Request & { userId?: string }, res: Response, next: NextFunction) {
    // Stub auth: inject a fixed userId for now
    req.userId = '11111111-1111-1111-1111-111111111111';
    next();
  }
}
