import { RequestService } from './request.service';
import { RequestCreateDTO } from './dto/request.create.dto';
import { Socket } from 'socket.io';
import { RequestPrismaService } from './request.prisma.service';
export declare class RequestGateway {
    private readonly requestService;
    private readonly requestPrismaService;
    constructor(requestService: RequestService, requestPrismaService: RequestPrismaService);
    create(requestCreateDTO: RequestCreateDTO, client: Socket): Promise<void>;
}
