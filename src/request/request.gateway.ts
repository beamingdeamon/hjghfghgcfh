import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { RequestService } from './request.service';
import { RequestCreateDTO } from './dto/request.create.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenWsGuard } from 'src/auth/guards/accessToken.ws.guard';
import { Socket } from 'socket.io';
import { RequestPrismaService } from './request.prisma.service';

@WebSocketGateway({
  "cors" : true
})
export class RequestGateway {
  constructor(
    private readonly requestService: RequestService,
    private readonly requestPrismaService: RequestPrismaService
  ) { }

  @UseGuards(AccessTokenWsGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('createRequest')
  async create(
    @MessageBody() requestCreateDTO: RequestCreateDTO,
    @ConnectedSocket() client: Socket
  ) {
    const outputDefaultParams = {
      requestId: requestCreateDTO.externalRequestId,
      userId: requestCreateDTO.externalUserId
    }
    const chunkPushingEventName: string = 'streamRequest'

    const finalContent: string = await this.requestService.streamRequestCompletion(
      requestCreateDTO.text, client, chunkPushingEventName, outputDefaultParams
    )
      
    this.requestPrismaService.createRequest({
      externalRequestId: requestCreateDTO.externalRequestId,
      externalUserId: requestCreateDTO.externalUserId,
      timestamp: requestCreateDTO.timestamp,
      text: requestCreateDTO.text,
      answer: finalContent,
      owner: {
        connect: {
          id: requestCreateDTO['user_guard_data'].id
        }
      }
    })
  }
}
