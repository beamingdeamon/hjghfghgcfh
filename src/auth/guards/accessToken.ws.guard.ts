import { CanActivate, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { UserPrismaService } from "src/user/user.prisma.service";

@Injectable()
export class AccessTokenWsGuard implements CanActivate {

  constructor(
    private readonly userPrismaService: UserPrismaService,
    private readonly jwtService: JwtService
  ) { }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    if (!context.args[0].handshake.headers.authorization) throw new WsException('Error Unauthorized')

    const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
    const { JWT_ACCESS_SECRET } = this.userPrismaService.getSecrets()

    try {
      const decoded = this.jwtService.verify(bearerToken, { secret: JWT_ACCESS_SECRET }) as any;
      return new Promise((resolve, reject) => {
        return this.userPrismaService.user({ where: { id: decoded.sub } }).then(user => {
          context.switchToWs().args[1].user_guard_data = user

          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });

      });
    } catch (error) {
      if (error?.name === 'TokenExpiredError') throw new WsException(Object.values(error).join(' '))
      return false;
    }
  }
}