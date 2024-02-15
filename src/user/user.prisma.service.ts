import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import * as UserConfig from 'src/user/config/user.config'
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export type Tokens = {
  accessToken: string,
  refreshToken: string
}

@Injectable()
export class UserPrismaService {
  constructor(
    private readonly database: DatabaseService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async user(params: {
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
    include?: Prisma.UserInclude
  }): Promise<User | null> {
    return this.database.user.findUnique({
      ...params
    })
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
    select?: Prisma.UserSelect
  } = null): Promise<User[]> {
    if (!params) return this.database.user.findMany()
    return this.database.user.findMany(params)
  }

  async createUser(createInput: Prisma.UserCreateInput): Promise<User> {
    const condidate = await this.user({
      where: { login: createInput.login },
      select: { id: true }
    })

    if (condidate) throw new ConflictException(`User with login: ${createInput.login} already is exist`)

    const hashedPassword = this.hash(createInput.password)

    return this.database.user.create({
      data: {
        login: createInput.login,
        password: hashedPassword
      }
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    return this.database.user.update(params)
  }

  hash(hashingData: string): string {
    const res = hashSync(hashingData, genSaltSync(UserConfig.password.saltRounds))

    return res
  }

  async verifyPassword(where: Prisma.UserWhereUniqueInput, password: string): Promise<boolean> {
    const user: User = await this.user({ where, select: { id: true, password: true } })

    if (!user) throw new NotFoundException(`User does not found.`)

    return compareSync(password, user.password)
  }

  async verifyRefreshToken(where: Prisma.UserWhereUniqueInput, refreshToken: string): Promise<boolean> {
    const user: User = await this.verifyUserExistException({
      where, select: { refreshToken: true }
    })

    return compareSync(refreshToken, user.refreshToken)
  }

  async verifyUserExistException(params: {
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect
  }): Promise<User> {
    const user: User = await this.user(params)

    if (!user) throw new NotFoundException(`User does not found.`)
    return user
  }

  getSecrets() {
    return {
      JWT_ACCESS_SECRET: this.configService.get<string>("JWT_ACCESS_SECRET"),
      JWT_REFRESH_SECRET: this.configService.get<string>("JWT_REFRESH_SECRET")
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = this.hash(refreshToken)
    await this.updateUser({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken }
    })
  }

  async getTokens(userId: number, login: string): Promise<Tokens> {
    const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = this.getSecrets()

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, login },
        {
          secret: JWT_ACCESS_SECRET,
          expiresIn: '10m'
        }
      ),
      this.jwtService.signAsync(
        { sub: userId, login },
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: '7d'
        }
      )
    ])

    return { accessToken, refreshToken }
  }
}
