import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ActividadModule } from './actividad/actividad.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Recibes la instancia 'configService' aquí:
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Usas la instancia minúscula que recibiste:
        host: configService.get<string>('BD_HOST'),
        port: 5433,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsuariosModule,

    ActividadModule,

    WhatsappModule,

    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}