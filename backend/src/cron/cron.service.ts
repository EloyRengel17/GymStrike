import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ActividadService } from 'src/actividad/actividad.service';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { interval } from 'rxjs';

@Injectable()
export class CronService {
    constructor(
        private readonly usuarioService:UsuariosService ,
        private readonly actividadService:ActividadService 
    ){}

 // @Cron('0 0 * * *') // A las 0:00
  @Interval(10000)
  async denegarPasoCliente() {
    console.log("llamando a funoin para cambiar el estado activo del clietne")
    await this.usuarioService.denegarPasoCliente();
  }

    //@Cron('0 0,30 * * * *')
   //@Interval(5000)
  async insertarSalidas() {
    
    console.log("insertarSalida desde el cron")
    await this.actividadService.cerrarSalidasAutomaticamente();
    
  }

}
//para intervalos simples, se puede usar @Interval() trabaj en milisegundos
//https://crontab.guru/