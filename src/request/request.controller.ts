import { Controller, Get } from '@nestjs/common';
import { RequestPrismaService } from './request.prisma.service';

@Controller('request')
export class RequestController {
  constructor(private readonly requestPrismaService: RequestPrismaService) { }

  @Get('all')
  async getAll() {
    return this.requestPrismaService.requests()
  }
}
