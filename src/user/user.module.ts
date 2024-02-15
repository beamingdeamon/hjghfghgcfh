import { Module } from '@nestjs/common';
import { UserPrismaService } from './user.prisma.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserPrismaService],
  exports: [UserPrismaService]
})
export class UserModule { }
