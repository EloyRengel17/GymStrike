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
        datosGym: {
          ...nuevoDatosGym,
          fechaEntrada: fechaEntrada.toDate(),
          fechaPago: fechaPago.toDate()
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
  async  findOne(cedula: string) {
    const respuesta = await this.usaurioRepository.findOneBy({ cedula })
    if (!respuesta) throw new NotFoundException("el usuario no ha sido encontrado")
    return respuesta;
  }
  //aqui para buscar un usuario que unicamente este activo y al dia con el pago 
  async findOneCedula(cedula: string) {
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
    const horaActual = fechaActual.getHours(); // Devuelve un número entre 0 y 23

    if (!datosGym.activo || fechaActual > new Date(datosGym.fechaPago) || (datosGym.suscripcion === "matutino" && (horaActual < 10 || horaActual > 15)) ) {
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

  
  //  Tarea programada (Cron) para la gestión de membresías. Verifica diariamente los clientes con mensualidades vencidas y cambia su casilla 'activo' de true a false en la base de datos.
   
  async denegarPasoCliente() {
    try {
      const [filas, cantidad] = await this.datosGymRepository.query(`
          UPDATE datos_gym dg
          SET activo = false
          FROM usuarios u
          WHERE dg.usuario_id = u.id -- Aquí haces la relación entre ambas tablas
            AND dg."fechaPago" < CURRENT_DATE
            AND dg.activo = true
            AND u."tipoUsuario" = 'cliente' -- Aquí filtras por el tipo de usuario
          RETURNING dg.usuario_id;
        `);
      if (cantidad === 0) {
        console.log("No hubo modificaciones de acceso por pago para hoy");
        return
      }

      await Promise.all(
        filas.map(async (fila) => {

          const usuario = await this.datosGymRepository.query(
            `SELECT nombre, apellido, telefono
       FROM usuarios
       WHERE id = $1`,
            [fila.usuario_id]
          );

          const mensaje = `Hola, ${usuario[0].nombre} ${usuario[0].apellido}. Te informamos desde Gym-strike que tu pago mensual no se ha registrado. Para poder seguir disfrutando de nuestras instalaciones, te solicitamos ponerte al día con el saldo pendiente. ¡Te esperamos!`;
          await this.WhatsappService.enviarMensajeTexto(
            usuario[0].telefono,
            mensaje
          );

        })
      );
      return {
        modificados: cantidad,
      };

    } catch (error) {
      this.manejadorError(error);
    }
  }

  //funcion para enviar notificaion al cliente para que recuerde cuanto tiempo le queda de entrada al gimansio
  async AlertarUSuarioPago() {
    try {
      const filas = await this.datosGymRepository.query(`
          SELECT 
    u.nombre, 
    u.apellido, 
    u.telefono,
    dg."fechaPago",
    (dg."fechaPago" - CURRENT_DATE) AS dias_restantes -- dice exactamente cuántos días faltan (3, 2 o 1)
FROM usuarios u
INNER JOIN datos_gym dg ON u.id = dg.usuario_id -- Unimos las dos tablas
WHERE u."tipoUsuario" = 'cliente'
  AND dg.activo = true --validar que su plan actual esté activo
  --  diferencia sea entre 1 y 3 días:
  AND (dg."fechaPago" - CURRENT_DATE) BETWEEN 1 AND 3;
        `);
        //utilizar este for par poder ejecutarlo de manera asincrona y no enviar toda la infromacion de golpe
      for (const fila of filas) {
        //codigo recuperado por la ia para sanitizar la fecha 
        const fechaObj = new Date(fila.fechaPago);
        const fechaLimpia = fechaObj.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const mensaje = `Hola, ${fila.nombre} ${fila.apellido}. Te recordamos desde Gym-Strike que tu plan está próximo a vencer (quedan ${fila.dias_restantes} días). Para seguir disfrutando de nuestras instalaciones, recuerda realizar tu pago antes del ${fechaLimpia}. ¡Te esperamos!`;
        await this.WhatsappService.enviarMensajeTexto(fila.telefono, mensaje);
      }


    } catch (error) {
      this.manejadorError(error);
    }
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
    console.log(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');


  }
}
