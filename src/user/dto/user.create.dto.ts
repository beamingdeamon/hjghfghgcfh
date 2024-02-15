import { MaxLength, MinLength } from "class-validator"
import * as UserConfig from "src/user/config/user.config"

export class CreateUserDTO {
  @MinLength(UserConfig.login.min)
  @MaxLength(UserConfig.login.max)
  login: string

  @MinLength(UserConfig.password.min)
  @MaxLength(UserConfig.password.max)
  password: string
}
