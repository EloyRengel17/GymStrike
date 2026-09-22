// login-pc.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginPcService } from './login-pc.service';
import { LoginPcController } from './login-pc.controller';
import { Usuario } from '../usuarios/entities/usuario.entity'; // Ajusta la ruta a tu entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [LoginPcController],
  providers: [LoginPcService],
  exports: [LoginPcService, JwtModule],
})
export class LoginPcModule {}