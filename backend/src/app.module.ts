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
import { StripeModule } from './stripe/stripe.module';
import { ConsultasPowerBiModule } from './consultas-power-bi/consultas-power-bi.module';
import { LoginPcModule } from './login-pc/login-pc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        // Si existe DATABASE_URL (Entorno Render)
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // Requerido por Render para conexiones SSL
            },
          };
        }

        // Si no existe, usa la configuración local (.env)
        return {
          type: 'postgres',
          host: configService.get<string>('BD_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5433),
          username: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'gymstrike'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    UsuariosModule,
    ActividadModule,
    WhatsappModule,
    ScheduleModule.forRoot(),
    CronModule,
    StripeModule,
    ConsultasPowerBiModule,
    LoginPcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}