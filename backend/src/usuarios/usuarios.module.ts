import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { DatosGym } from './entities/datosGym.entity';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, DatosGym]), WhatsappModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports:[UsuariosService]
})
export class UsuariosModule {}