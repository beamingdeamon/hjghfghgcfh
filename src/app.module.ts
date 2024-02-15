import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    DatabaseModule, UserModule, AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.register({ global: true }),
    RequestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
