import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, Request } from '@prisma/client';

@Injectable()
export class RequestPrismaService {
  constructor(
    private readonly database: DatabaseService
  ) { }

  async request(params: {
    where: Prisma.RequestWhereUniqueInput,
    select?: Prisma.RequestSelect
  }): Promise<Request | null> {
    return this.database.request.findUnique({
      ...params
    })
  }

  async requests(params: {
    skip?: number
    take?: number
    cursor?: Prisma.RequestWhereUniqueInput
    where?: Prisma.RequestWhereInput
    orderBy?: Prisma.RequestOrderByWithRelationInput
    select?: Prisma.RequestSelect
  } = null): Promise<Request[]> {
    if (!params) return this.database.request.findMany()
    return this.database.request.findMany(params)
  }

  async createRequest(createInput: Prisma.RequestCreateInput): Promise<Request> {
    const newRequest = await this.database.request.create({ data: createInput })

    await this.database.user.update({
      where: { id: createInput.owner.connect.id },
      data: {
        requests: {
          connect: { id: newRequest.id }
        }
      }
    })

    return newRequest
  }

  async updateRequest(params: {
    where: Prisma.RequestWhereUniqueInput
    data: Prisma.RequestUpdateInput
  }): Promise<Request> {
    return this.database.request.update(params)
  }
}
