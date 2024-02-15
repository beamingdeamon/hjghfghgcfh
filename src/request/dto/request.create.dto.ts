import { IsDateString, IsString } from "class-validator";

export class RequestCreateDTO {
  @IsString()
  externalUserId: string

  @IsString()
  externalRequestId: string

  @IsDateString()
  timestamp: Date

  @IsString()
  text: string
}
