import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlanesSuscripcionDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanesSuscripcion } from './entities/planes_suscripcion.entity';
import { PagosHistorial } from './entities/pagos_historial.entity';
import { Repository } from 'typeorm';
import { PagohistorialDto } from './dto/createPagosHistorial.dto';
@Injectable()
export class StripeService {

  constructor(
    @InjectRepository(PlanesSuscripcion)
    private readonly planesSuscripcionRepository: Repository<PlanesSuscripcion>,

    @InjectRepository(PagosHistorial)
    private readonly pagosHistorialRepository: Repository<PagosHistorial>

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
      // NOTA: Mapeo manual de relaciones.
      // El DTO solo envía 'usuarioID' (un number), pero la Entidad espera un objeto de tipo Usuario.
      // Envolver el ID en un objeto { id: dto.usuarioId } permite que TypeORM inserte la FK directamente en Postgres.
      const result = await this.pagosHistorialRepository.create({
        stripePaymentIntentId: createPagoHistorialDto.stripePaymentIntentId,
        montoPagado: createPagoHistorialDto.montoPagado,
        fechaPago: createPagoHistorialDto.fechaPago,
        usuario: { id: createPagoHistorialDto.usuario },
        plan: { id: createPagoHistorialDto.plan } // Si tu relación se llama plan o pago, adáptalo aquí
      });
      const crearPagoHistorial = await this.pagosHistorialRepository.save(result);
      return crearPagoHistorial

    } catch (error) {
      console.log(error);
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
