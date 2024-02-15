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
exports.UserPrismaService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt_1 = require("bcrypt");
const UserConfig = require("./config/user.config");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let UserPrismaService = class UserPrismaService {
    constructor(database, configService, jwtService) {
        this.database = database;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async user(params) {
        return this.database.user.findUnique({
            ...params
        });
    }
    async users(params = null) {
        if (!params)
            return this.database.user.findMany();
        return this.database.user.findMany(params);
    }
    async createUser(createInput) {
        const condidate = await this.user({
            where: { login: createInput.login },
            select: { id: true }
        });
        if (condidate)
            throw new common_1.ConflictException(`User with login: ${createInput.login} already is exist`);
        const hashedPassword = this.hash(createInput.password);
        return this.database.user.create({
            data: {
                login: createInput.login,
                password: hashedPassword
            }
        });
    }
    async updateUser(params) {
        return this.database.user.update(params);
    }
    hash(hashingData) {
        const res = (0, bcrypt_1.hashSync)(hashingData, (0, bcrypt_1.genSaltSync)(UserConfig.password.saltRounds));
        return res;
    }
    async verifyPassword(where, password) {
        const user = await this.user({ where, select: { id: true, password: true } });
        if (!user)
            throw new common_1.NotFoundException(`User does not found.`);
        return (0, bcrypt_1.compareSync)(password, user.password);
    }
    async verifyRefreshToken(where, refreshToken) {
        const user = await this.verifyUserExistException({
            where, select: { refreshToken: true }
        });
        return (0, bcrypt_1.compareSync)(refreshToken, user.refreshToken);
    }
    async verifyUserExistException(params) {
        const user = await this.user(params);
        if (!user)
            throw new common_1.NotFoundException(`User does not found.`);
        return user;
    }
    getSecrets() {
        return {
            JWT_ACCESS_SECRET: this.configService.get("JWT_ACCESS_SECRET"),
            JWT_REFRESH_SECRET: this.configService.get("JWT_REFRESH_SECRET")
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = this.hash(refreshToken);
        await this.updateUser({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken }
        });
    }
    async getTokens(userId, login) {
        const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = this.getSecrets();
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, login }, {
                secret: JWT_ACCESS_SECRET,
                expiresIn: '10m'
            }),
            this.jwtService.signAsync({ sub: userId, login }, {
                secret: JWT_REFRESH_SECRET,
                expiresIn: '7d'
            })
        ]);
        return { accessToken, refreshToken };
    }
};
exports.UserPrismaService = UserPrismaService;
exports.UserPrismaService = UserPrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService,
        jwt_1.JwtService])
], UserPrismaService);
//# sourceMappingURL=user.prisma.service.js.map