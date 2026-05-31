import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './entities/actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
    //busca un usuario con una funcino propia del moduilo de usuarios
    const respuesta = await this.usuariosService.findOne(createActividadDto.cedula);
     
    
    if(respuesta){
      //Buscar la ceudla en la tabala AccesoGym para ver si ya entró 
      const comprobacionEntrada= await this.comprobacionEntrada(createActividadDto.cedula)

      //si no hubo resultados entonces crearara un nuevo registro, quiero decri que el dia de hoy la persona no ha entrado
      if(!comprobacionEntrada ){
        const horaEntrada= dayjs();

      const instanciaActividad= await this.actividadRepository.create({
        cedula:createActividadDto.cedula,
        horaEntrada: horaEntrada.toDate(),
        tipoUsuario: respuesta.tipoUsuario
      })
      const crearActividad= await this.actividadRepository.save(instanciaActividad)
      return crearActividad;

      }
      const horaSalida= dayjs();
      this.update(horaSalida.toDate(), createActividadDto.cedula)
    }
    
  }

  async findAll(contarActivos:boolean) {
     console.log("ejecutandose funcion de reconteo de clientes en el gimanasio")
  //para buscar la cantidad de personas entrenando en el gimansio, 
    if(contarActivos){
      const cantidad= await this.actividadRepository.count({
        where:{
          horaSalida: IsNull(),
          tipoUsuario: 'cliente'
        }
      });
     
      return {cantidadPersonas:cantidad};
    }

    //si no entra el parametro comom true, devolvera es los datos de la tabla de activdad
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
  
  //aqui buscamos u registro, independientemente que este activo o no
    async findOne(cedula: string) {
  
  const usuario = await this.usuariosService.findOneCedula(cedula);
  
  if (!usuario) return usuario;

  // Buscamos las actividades
  const actividades = await this.actividadRepository.find({
    where: { cedula },
    order: { horaEntrada: 'DESC' }
  });

  if (actividades.length === 0) throw new BadRequestException('No se han encontrado registros de actividades para esta cédula');
  

  
  return actividades.map(actividad => ({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    horaEntrada: actividad.horaEntrada,
    horaSalida: actividad.horaSalida
  }));
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

  async cerrarSalidasAutomaticamente(){
    
   const result = await this.actividadRepository.query(`
    UPDATE "AccesoGym"
    SET "horaSalida" = CURRENT_TIMESTAMP
    WHERE "tipoUsuario" = 'cliente'
      AND "horaSalida" IS NULL
      AND "horaEntrada" <= (CURRENT_TIMESTAMP - INTERVAL '3 hours')
  `);
 
  return result.affectedRows;
  }
}
