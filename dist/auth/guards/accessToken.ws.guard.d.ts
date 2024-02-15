import { CanActivate } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { UserPrismaService } from "src/user/user.prisma.service";
export declare class AccessTokenWsGuard implements CanActivate {
    private readonly userPrismaService;
    private readonly jwtService;
    constructor(userPrismaService: UserPrismaService, jwtService: JwtService);
    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any>;
}
