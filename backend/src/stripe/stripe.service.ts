import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlanesSuscripcionDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanesSuscripcion } from './entities/planes_suscripcion.entity';
import { PagosHistorial } from './entities/pagos_historial.entity';
import { Repository } from 'typeorm';
import { PagohistorialDto } from './dto/createPagosHistorial.dto';
import { DatosGym } from 'src/usuarios/entities/datosGym.entity';
import dayjs from 'dayjs';
@Injectable()
export class StripeService {

  constructor(
    @InjectRepository(PlanesSuscripcion)
    private readonly planesSuscripcionRepository: Repository<PlanesSuscripcion>,

    @InjectRepository(PagosHistorial)
    private readonly pagosHistorialRepository: Repository<PagosHistorial>,

    @InjectRepository(DatosGym)
    private readonly DatosGymRepository: Repository<DatosGym>

    //se debe crear una inyeccion de dependencias con 
  ) { }
  async createPlanesSuscripcion(createPlanesSuscripcionDto: PlanesSuscripcionDto) {
    try {
      const result = await this.planesSuscripcionRepository.create(createPlanesSuscripcionDto)
      const crearPlan = await this.planesSuscripcionRepository.save(result)
      return crearPlan;
    } catch (error) {
      console.log(error)
    }
  }

 async createPagoHistorial(createPagoHistorialDto: PagohistorialDto) {
    try {
      // 1. Buscamos la fecha de pago actual que tiene el cliente en la base de datos (su límite actual)
      const verificacion = await this.DatosGymRepository.findOne({
        where: { usuario: { id: createPagoHistorialDto.usuario } },
        select: { 
          id: true,         // <--- Añade esto para que TypeORM no pierda la referencia
          fechaPago: true,  // Tu columna deseada
        },
      });

      const fechaActualCliente = verificacion?.fechaPago ? dayjs(verificacion.fechaPago) : null;

      // 2. RECUPERAMOS LA FECHA REAL DEL PAGO DESDE EL DTO
      // Esta es la fecha exacta en que el usuario hizo el pago (enviada desde Postman/Frontend)
      const fechaPagoRealizado = dayjs(createPagoHistorialDto.fechaPago);

      let fechaPagoo;

      // 3. Aplicamos tu regla de negocio comparando la fecha límite con la fecha en que realmente pagó
      if (fechaActualCliente && (fechaPagoRealizado.isBefore(fechaActualCliente) || fechaPagoRealizado.isSame(fechaActualCliente, 'day'))) {
        // SI PAGÓ ANTES O EL MISMO DÍA (Adelanto): 
        // La nueva fecha se calcula sumando un mes a su fecha de pago anterior.
        fechaPagoo = fechaActualCliente.add(1, 'month');
      } else {
        // SI PAGÓ DÍAS DESPUÉS (Atrasado): 
        // La nueva fecha se calcula sumando un mes exacto a partir del día en que hizo este pago.
        fechaPagoo = fechaPagoRealizado.add(1, 'month');
      }

      // 4. Guardamos el historial del pago en la tabla pagos_historial
      const result = await this.pagosHistorialRepository.create({
        stripePaymentIntentId: createPagoHistorialDto.stripePaymentIntentId,
        montoPagado: createPagoHistorialDto.montoPagado,
        fechaPago: createPagoHistorialDto.fechaPago, // El día exacto del pago
        usuario: { id: createPagoHistorialDto.usuario },
        plan: { id: createPagoHistorialDto.plan }
      });
      const crearPagoHistorial = await this.pagosHistorialRepository.save(result);

      // 5. Actualizamos la tabla datos_gym con la nueva fecha de pago calculada (fechaPagoo)
      const actualizar = await this.DatosGymRepository.query(
        `UPDATE datos_gym
            SET "fechaPago" = $1, activo=TRUE
            WHERE usuario_id = $2 `,
        [
          fechaPagoo.toDate(),
          createPagoHistorialDto.usuario
        ]
      );
      
      return {
        crearPagoHistorial,
        actualizar,
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el historial de pago');
    }
  }

  findAll() {
    return this.planesSuscripcionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeDto: UpdateStripeDto) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}


//si es el pago es antes de la fecha de pago o el mismo dia(SE ENTIENDE QUE ES ADELANTO)  entonces a proxima fecha de pago sera el mismo deia de la fecha de pagoanterior pero un mes despues
//si la fecha de pago es dias despues, entonces sera un mes despues que se hizo el pago