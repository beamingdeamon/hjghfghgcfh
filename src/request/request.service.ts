import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Socket } from 'socket.io';

@Injectable()
export class RequestService {
  constructor(
    private readonly configService: ConfigService
  ) { }
  async streamRequestCompletion(
    content: string,
    output: Socket,
    eventName: string,
    outputUniqueObject: Object
  ): Promise<string> {
    const openai = new OpenAI({
      apiKey: this.configService.get<string>("CHAT_GPT_SECRET")
    })

    const stream = openai.beta.chat.completions.stream({
      model: this.configService.get<string>("DEFAULT_GPT_MODEL"),
      messages: [{ role: 'user', content }]
    })

    stream.on('content', (delta: string, snapshot: string) => {
      output.emit(eventName, {
        ...outputUniqueObject,
        type: 'chunk',
        delta, snapshot
      })
    })

    return new Promise((resolve) => {
      stream.on('finalContent', async (snapshot: string) => {
        output.emit(eventName, {
          ...outputUniqueObject,
          type: 'streamEnd',
          snapshot
        })
        resolve(snapshot)
      })
    })
  }
}
