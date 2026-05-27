import { Injectable } from '@nestjs/common';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import dayjs from 'dayjs';
@Injectable()
export class ActividadService {

  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository:Repository<Actividad>,

    private readonly usuariosService: UsuariosService
  ){}

  async create(createActividadDto: CreateActividadDto) {
    const respuesta = await this.usuariosService.findOne(createActividadDto.cedula);
     
    if(respuesta){
      const comprobacionSalida= await this.comprobacionEntrada(createActividadDto.cedula)

      if(!comprobacionSalida ){
        const horaEntrada= dayjs();

      const instanciaActividad= await this.actividadRepository.create({
        cedula:createActividadDto.cedula,
        horaEntrada: horaEntrada.toDate(),
      })
      const crearActividad= await this.actividadRepository.save(instanciaActividad)
      return crearActividad;

      }
      const horaSalida= dayjs();
      this.update(horaSalida.toDate(), createActividadDto.cedula)
    }
    
  }

  async findAll() {
    const result=  await this.actividadRepository.find();
    if(result.length==0){
      return "no hay usuarios para mostrar"
    }
    return result
  }

  async comprobacionEntrada(cedula: string){
    const result= await this.actividadRepository.query(`
    SELECT * FROM "AccesoGym" 
    WHERE cedula =$1
    AND Date("horaEntrada")=CURRENT_DATE
    AND "horaSalida" IS NULL
    `,[cedula]) 

    return result.length > 0 ? result[0] : null;
  }
  async findOne(cedula: string) {
   
  }

  async update(horaSalida:Date, cedula:string) {
    await this.actividadRepository.query(`
    UPDATE "AccesoGym"
    SET "horaSalida" = $1
    WHERE cedula = $2
      AND "horaSalida" IS NULL
      AND "horaEntrada"::date = CURRENT_DATE
  `, [horaSalida, cedula]);
  }

  remove(id: number) {
    return `This action removes a #${id} actividad`;
  }
}
