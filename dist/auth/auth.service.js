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
exports.AuthService = void 0;
const user_prisma_service_1 = require("../user/user.prisma.service");
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(userPrismaService) {
        this.userPrismaService = userPrismaService;
    }
    async signUp(createUserDTO) {
        const user = await this.userPrismaService.user({
            where: { login: createUserDTO.login }
        });
        if (user)
            throw new common_1.BadRequestException(`User with login: ${createUserDTO.login} already is exists`);
        const newUser = await this.userPrismaService.createUser(createUserDTO);
        const tokens = await this.userPrismaService.getTokens(newUser.id, newUser.login);
        await this.userPrismaService.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }
    async signIn(authDTO) {
        const user = await this.userPrismaService.verifyUserExistException({
            where: { login: authDTO.login },
            select: { id: true, login: true }
        });
        const passwordMatches = await this.userPrismaService.verifyPassword({ id: user.id }, authDTO.password);
        if (!passwordMatches)
            throw new common_1.BadRequestException("Password is incorrect!");
        const tokens = await this.userPrismaService.getTokens(user.id, user.login);
        this.userPrismaService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userPrismaService.user({
            where: { id: userId },
            select: { id: true, login: true, refreshToken: true }
        });
        if (!user || !user.refreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const refreshTokenMatches = await this.userPrismaService.verifyRefreshToken({ id: userId }, refreshToken);
        if (!refreshTokenMatches)
            throw new common_1.ForbiddenException('Access Denied');
        const tokens = await this.userPrismaService.getTokens(user.id, user.login);
        await this.userPrismaService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_prisma_service_1.UserPrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map