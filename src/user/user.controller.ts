import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserPrismaService } from './user.prisma.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userPrismaService: UserPrismaService) { }

  @Get()
  findAll() {
    return this.userPrismaService.users();
  }

  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  @Get('me')
  findOne(@Req() req: Request) {
    return this.userPrismaService.user({ where: { id: req['user'].sub }, include: { requests: true } });
  }
}
