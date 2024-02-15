import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
export declare class RequestService {
    private readonly configService;
    constructor(configService: ConfigService);
    streamRequestCompletion(content: string, output: Socket, eventName: string, outputUniqueObject: Object): Promise<string>;
}
