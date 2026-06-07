import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlanesSuscripcionDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanesSuscripcion } from './entities/planes_suscripcion.entity';
import { PagosHistorial } from './entities/pagos_historial.entity';
import { Repository } from 'typeorm';
@Injectable()
export class StripeService {
  
    constructor(
    @InjectRepository(PlanesSuscripcion)
    private readonly planesSuscripcionRepository: Repository<PlanesSuscripcion>,

    @InjectRepository(PagosHistorial)
    private readonly pagosHistorialRepository:Repository<PagosHistorial>
    
    ){}
  async create(createPlanesSuscripcionDto: PlanesSuscripcionDto) {
    try{
     const result= await this.planesSuscripcionRepository.create(createPlanesSuscripcionDto)
     const crearPlan=await this.planesSuscripcionRepository.save(result)
     return crearPlan;
     }catch(error){
      console.log(error)
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
