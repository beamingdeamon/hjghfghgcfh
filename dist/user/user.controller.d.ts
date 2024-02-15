import { UserPrismaService } from './user.prisma.service';
export declare class UserController {
    private readonly userPrismaService;
    constructor(userPrismaService: UserPrismaService);
    findAll(): Promise<{
        id: number;
        login: string;
        password: string;
        refreshToken: string;
    }[]>;
    findOne(req: Request): Promise<{
        id: number;
        login: string;
        password: string;
        refreshToken: string;
    }>;
}
