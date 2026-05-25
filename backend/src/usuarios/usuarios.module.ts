import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { DatosGym } from './entities/datosGym.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, DatosGym])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}