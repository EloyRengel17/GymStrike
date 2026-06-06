import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanesSuscripcion } from './entities/planes_suscripcion.entity';
import { PagosHistorial } from './entities/pagos_historial.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PlanesSuscripcion, PagosHistorial])],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
