import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultasPowerBiController } from './consultas-power-bi.controller';
import { PagosService } from './consultas-power-bi.service'; // o PagosService según como lo nombraste
import { PagoHistorial } from './entities/consultas-power-bi.entity'; // Asegúrate de ajustar la ruta de la entidad

@Module({
  imports: [
    // 👈 AGREGA ESTA LÍNEA AQUÍ
    TypeOrmModule.forFeature([PagoHistorial]),
  ],
  controllers: [ConsultasPowerBiController],
  providers: [PagosService],
})
export class ConsultasPowerBiModule {}