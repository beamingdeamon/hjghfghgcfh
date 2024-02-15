import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestGateway } from './request.gateway';
import { UserModule } from 'src/user/user.module';
import { RequestPrismaService } from './request.prisma.service';
import { DatabaseModule } from 'src/database/database.module';
import { RequestController } from './request.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [RequestGateway, RequestService, RequestPrismaService],
  controllers: [RequestController],
})
export class RequestModule { }
