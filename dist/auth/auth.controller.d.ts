import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { CreateUserDTO } from 'src/user/dto/user.create.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(authDTO: AuthDTO): Promise<import("../user/user.prisma.service").Tokens>;
    signUp(createUserDTO: CreateUserDTO): Promise<import("../user/user.prisma.service").Tokens>;
    refreshTokens(req: Request): Promise<import("../user/user.prisma.service").Tokens>;
}
