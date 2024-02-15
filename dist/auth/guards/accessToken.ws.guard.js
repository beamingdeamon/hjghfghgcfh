"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenWsGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const user_prisma_service_1 = require("../../user/user.prisma.service");
let AccessTokenWsGuard = class AccessTokenWsGuard {
    constructor(userPrismaService, jwtService) {
        this.userPrismaService = userPrismaService;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        if (!context.args[0].handshake.headers.authorization)
            throw new websockets_1.WsException('Error Unauthorized');
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        const { JWT_ACCESS_SECRET } = this.userPrismaService.getSecrets();
        try {
            const decoded = this.jwtService.verify(bearerToken, { secret: JWT_ACCESS_SECRET });
            return new Promise((resolve, reject) => {
                return this.userPrismaService.user({ where: { id: decoded.sub } }).then(user => {
                    context.switchToWs().args[1].user_guard_data = user;
                    if (user) {
                        resolve(user);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        }
        catch (error) {
            if (error?.name === 'TokenExpiredError')
                throw new websockets_1.WsException(Object.values(error).join(' '));
            return false;
        }
    }
};
exports.AccessTokenWsGuard = AccessTokenWsGuard;
exports.AccessTokenWsGuard = AccessTokenWsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_prisma_service_1.UserPrismaService,
        jwt_1.JwtService])
], AccessTokenWsGuard);
//# sourceMappingURL=accessToken.ws.guard.js.map