import { RequestPrismaService } from './request.prisma.service';
export declare class RequestController {
    private readonly requestPrismaService;
    constructor(requestPrismaService: RequestPrismaService);
    getAll(): Promise<{
        id: number;
        externalUserId: string;
        externalRequestId: string;
        timestamp: Date;
        text: string;
        answer: string;
        ownerId: number;
    }[]>;
}
