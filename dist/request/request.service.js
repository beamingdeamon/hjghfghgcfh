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
exports.RequestService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let RequestService = class RequestService {
    constructor(configService) {
        this.configService = configService;
    }
    async streamRequestCompletion(content, output, eventName, outputUniqueObject) {
        const openai = new openai_1.default({
            apiKey: this.configService.get("CHAT_GPT_SECRET")
        });
        const stream = openai.beta.chat.completions.stream({
            model: this.configService.get("DEFAULT_GPT_MODEL"),
            messages: [{ role: 'user', content }]
        });
        stream.on('content', (delta, snapshot) => {
            output.emit(eventName, {
                ...outputUniqueObject,
                type: 'chunk',
                delta, snapshot
            });
        });
        return new Promise((resolve) => {
            stream.on('finalContent', async (snapshot) => {
                output.emit(eventName, {
                    ...outputUniqueObject,
                    type: 'streamEnd',
                    snapshot
                });
                resolve(snapshot);
            });
        });
    }
};
exports.RequestService = RequestService;
exports.RequestService = RequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RequestService);
//# sourceMappingURL=request.service.js.map