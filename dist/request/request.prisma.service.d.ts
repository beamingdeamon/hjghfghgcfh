import { DatabaseService } from 'src/database/database.service';
import { Prisma, Request } from '@prisma/client';
export declare class RequestPrismaService {
    private readonly database;
    constructor(database: DatabaseService);
    request(params: {
        where: Prisma.RequestWhereUniqueInput;
        select?: Prisma.RequestSelect;
    }): Promise<Request | null>;
    requests(params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.RequestWhereUniqueInput;
        where?: Prisma.RequestWhereInput;
        orderBy?: Prisma.RequestOrderByWithRelationInput;
        select?: Prisma.RequestSelect;
    }): Promise<Request[]>;
    createRequest(createInput: Prisma.RequestCreateInput): Promise<Request>;
    updateRequest(params: {
        where: Prisma.RequestWhereUniqueInput;
        data: Prisma.RequestUpdateInput;
    }): Promise<Request>;
}
