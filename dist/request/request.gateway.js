"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const request_service_1 = require("./request.service");
const request_create_dto_1 = require("./dto/request.create.dto");
const common_1 = require("@nestjs/common");
const accessToken_ws_guard_1 = require("../auth/guards/accessToken.ws.guard");
const socket_io_1 = require("socket.io");
const request_prisma_service_1 = require("./request.prisma.service");
let RequestGateway = class RequestGateway {
    constructor(requestService, requestPrismaService) {
        this.requestService = requestService;
        this.requestPrismaService = requestPrismaService;
    }
    async create(requestCreateDTO, client) {
        const outputDefaultParams = {
            requestId: requestCreateDTO.externalRequestId,
            userId: requestCreateDTO.externalUserId
        };
        const chunkPushingEventName = 'streamRequest';
        const finalContent = await this.requestService.streamRequestCompletion(requestCreateDTO.text, client, chunkPushingEventName, outputDefaultParams);
        console.log(requestCreateDTO);
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
        });
    }
};
exports.RequestGateway = RequestGateway;
__decorate([
    (0, common_1.UseGuards)(accessToken_ws_guard_1.AccessTokenWsGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, websockets_1.SubscribeMessage)('createRequest'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_create_dto_1.RequestCreateDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RequestGateway.prototype, "create", null);
exports.RequestGateway = RequestGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        "cors": true
    }),
    __metadata("design:paramtypes", [request_service_1.RequestService,
        request_prisma_service_1.RequestPrismaService])
], RequestGateway);
//# sourceMappingURL=request.gateway.js.map