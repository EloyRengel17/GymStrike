import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividad.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
@Module({
  imports:[TypeOrmModule.forFeature([Actividad]), UsuariosModule],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports:[ActividadService]
})
export class ActividadModule {}
 