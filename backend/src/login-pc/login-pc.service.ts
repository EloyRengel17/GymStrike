import { Injectable, UnauthorizedException, BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class LoginPcService {
    constructor(
      @InjectRepository(Usuario)
      private readonly usuarioRepository:Repository<Usuario>,
      private readonly jwtService: JwtService
    ){}


  async login(cedula:string, clave: string) {
    if (!cedula || !clave) {
    throw new BadRequestException('La cédula y la clave son obligatorias.');
  }
      const cedulaLimpia= cedula.trim();
      
      const usuario= await this.usuarioRepository.findOne({
        where:{cedula: ILike(cedulaLimpia)},
        select:{
          id:true,
          cedula:true,
          nombre:true,
          clave:true,
        }
      });

      if (!usuario) {
          throw new NotFoundException('El usuario no existe.');
        }
      
          if (!usuario.clave) {
            throw new UnauthorizedException('El usuario aún no ha configurado una contraseña.');
          }
          //comporacion de clave
      const claveValida= await bcrypt.compare(clave, usuario.clave  )
      if(!claveValida){
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      //contruccion del jwt 
      const payload= {
        sub:usuario.id,
        cedula:usuario.cedula,
        clave: usuario.clave,
      };
    
    return{
      access_token: await this.jwtService.signAsync(payload),
      usuario:{
        id:usuario.id,
        cedula:usuario.cedula,
        nombre:usuario.nombre,
      },
    };

  }

  findAll() {
    return `This action returns all loginPc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginPc`;
  }

  

  remove(id: number) {
    return `This action removes a #${id} loginPc`;
  }
}
