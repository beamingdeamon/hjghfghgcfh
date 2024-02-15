import { User } from '@prisma/client';
import { CreateUserDTO } from 'src/user/dto/user.create.dto';
import { Tokens, UserPrismaService } from 'src/user/user.prisma.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from 'src/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPrismaService: UserPrismaService
  ) { }

  async signUp(createUserDTO: CreateUserDTO): Promise<Tokens> {
    const user: User = await this.userPrismaService.user({
      where: { login: createUserDTO.login }
    })
    if (user) throw new BadRequestException(`User with login: ${createUserDTO.login} already is exists`)

    const newUser: User = await this.userPrismaService.createUser(createUserDTO)

    const tokens = await this.userPrismaService.getTokens(newUser.id, newUser.login)
    await this.userPrismaService.updateRefreshToken(newUser.id, tokens.refreshToken)

    return tokens
  }

  async signIn(authDTO: AuthDTO): Promise<Tokens> {
    const user: User = await this.userPrismaService.verifyUserExistException({
      where: { login: authDTO.login },
      select: { id: true, login: true }
    })

    const passwordMatches = await this.userPrismaService.verifyPassword(
      { id: user.id },
      authDTO.password
    )

    if (!passwordMatches) throw new BadRequestException("Password is incorrect!")

    const tokens: Tokens = await this.userPrismaService.getTokens(user.id, user.login)
    this.userPrismaService.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userPrismaService.user({
      where: { id: userId },
      select: { id: true, login: true, refreshToken: true }
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this.userPrismaService.verifyRefreshToken(
      { id: userId },
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.userPrismaService.getTokens(user.id, user.login);
    await this.userPrismaService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
