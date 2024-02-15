import { CreateUserDTO } from 'src/user/dto/user.create.dto';
import { Tokens, UserPrismaService } from 'src/user/user.prisma.service';
import { AuthDTO } from 'src/auth/dto/auth.dto';
export declare class AuthService {
    private readonly userPrismaService;
    constructor(userPrismaService: UserPrismaService);
    signUp(createUserDTO: CreateUserDTO): Promise<Tokens>;
    signIn(authDTO: AuthDTO): Promise<Tokens>;
    refreshTokens(userId: number, refreshToken: string): Promise<Tokens>;
}
