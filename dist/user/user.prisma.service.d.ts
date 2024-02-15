import { DatabaseService } from 'src/database/database.service';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export type Tokens = {
    accessToken: string;
    refreshToken: string;
};
export declare class UserPrismaService {
    private readonly database;
    private readonly configService;
    private readonly jwtService;
    constructor(database: DatabaseService, configService: ConfigService, jwtService: JwtService);
    user(params: {
        where: Prisma.UserWhereUniqueInput;
        select?: Prisma.UserSelect;
        include?: Prisma.UserInclude;
    }): Promise<User | null>;
    users(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
        select?: Prisma.UserSelect;
    }): Promise<User[]>;
    createUser(createInput: Prisma.UserCreateInput): Promise<User>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;
    hash(hashingData: string): string;
    verifyPassword(where: Prisma.UserWhereUniqueInput, password: string): Promise<boolean>;
    verifyRefreshToken(where: Prisma.UserWhereUniqueInput, refreshToken: string): Promise<boolean>;
    verifyUserExistException(params: {
        where: Prisma.UserWhereUniqueInput;
        select?: Prisma.UserSelect;
    }): Promise<User>;
    getSecrets(): {
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
    };
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    getTokens(userId: number, login: string): Promise<Tokens>;
}
