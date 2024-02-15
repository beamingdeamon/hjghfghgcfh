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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPrismaService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let RequestPrismaService = class RequestPrismaService {
    constructor(database) {
        this.database = database;
    }
    async request(params) {
        return this.database.request.findUnique({
            ...params
        });
    }
    async requests(params = null) {
        if (!params)
            return this.database.request.findMany();
        return this.database.request.findMany(params);
    }
    async createRequest(createInput) {
        const newRequest = await this.database.request.create({ data: createInput });
        await this.database.user.update({
            where: { id: createInput.owner.connect.id },
            data: {
                requests: {
                    connect: { id: newRequest.id }
                }
            }
        });
        return newRequest;
    }
    async updateRequest(params) {
        return this.database.request.update(params);
    }
};
exports.RequestPrismaService = RequestPrismaService;
exports.RequestPrismaService = RequestPrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], RequestPrismaService);
//# sourceMappingURL=request.prisma.service.js.map