import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ActividadModule } from 'src/actividad/actividad.module';
@Module({
  controllers: [],
  providers: [CronService],
  imports:[UsuariosModule, ActividadModule],
})
export class CronModule {}
