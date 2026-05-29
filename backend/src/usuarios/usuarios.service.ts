import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { DatosGym } from './entities/datosGym.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import dayjs from 'dayjs';


@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService')
  constructor(

    @InjectRepository(Usuario)
    private readonly usaurioRepository: Repository<Usuario>,

    @InjectRepository(DatosGym)
    private readonly datosGymRepository: Repository<DatosGym>,

    private readonly WhatsappService: WhatsappService

  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {

    try {
      const fechaEntrada = dayjs();
      const fechaPago = fechaEntrada.add(1, 'month');

      const { datosGym, ...datosUsuario } = createUsuarioDto;

     
      const nuevoDatosGym = await this.datosGymRepository.create(datosGym);



      const nuevoUsuario = await this.usaurioRepository.create({
        ...datosUsuario,
        datosGym:{
          ...nuevoDatosGym,
          fechaEntrada:fechaEntrada.toDate(),
          fechaPago:fechaPago.toDate()
        }
      })

      const crearUsuario = await this.usaurioRepository.save(nuevoUsuario);
      await this.WhatsappService.enviarMensajeTexto(nuevoUsuario.telefono, "Bienvenido al gimansio GymStrike")
      return crearUsuario

    } catch (error) {
      this.manejadorError(error);
    }
  }

  async findAll() {
    const usuario = await this.usaurioRepository.find();
    const datosGym = await this.datosGymRepository.find();

    return {
      usuario: usuario,
      datosGym: datosGym
    };
  }
  //aqui solo para buscar un usuario por cedula(este o no activo)
  async findOneCedula (cedula:string ){
    const respuesta= await this.usaurioRepository.findOneBy({cedula})
    if(!respuesta) throw new NotFoundException("el usuario no ha sido encontrado")
      return respuesta;
  }
  //aqui para buscar un usuario que unicamente este activo y al dia con el pago
  async findOne(cedula: string) {
    const usuario = await this.usaurioRepository.findOne({
      where: { cedula: cedula },
     relations: {
      datosGym: true, 
    },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no ha sido encontrado');
    }

    const datosGym = usuario.datosGym;
    const fechaActual = new Date();

    if (!datosGym.activo || fechaActual > new Date(datosGym.fechaPago)) {
  throw new ForbiddenException({
    status: 403,
    error: 'Forbidden',
    acceso: false, 
    code: 'MEMBERSHIP_EXPIRED', // Un código único que ayuda al frontend a saber qué pantalla mostrar
    message: 'Acceso denegado: Membresía vencida o inactiva'
  });
}

    return usuario;

  
  }



  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }




  private manejadorError(error: any) {
    if (error?.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
