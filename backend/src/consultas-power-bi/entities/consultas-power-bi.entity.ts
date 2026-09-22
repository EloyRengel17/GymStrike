
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pagos_historial') // Nombre exacto de la tabla en PostgreSQL
export class PagoHistorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stripePaymentIntentId', type: 'varchar' })
  stripePaymentIntentId: string;

  @Column({ name: 'montoPagado', type: 'integer' })
  montoPagado: number;

  @Column({ name: 'fechaPago', type: 'timestamp' })
  fechaPago: Date;

  @Column({ name: 'usuario_id', type: 'integer' })
  usuario_id: number;

  @Column({ name: 'plan_id', type: 'integer' })
  plan_id: number;
}