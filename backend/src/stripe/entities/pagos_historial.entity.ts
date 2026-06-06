import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "../../usuarios/entities/usuario.entity"; 
import { PlanesSuscripcion } from "./planes_suscripcion.entity";

@Entity('pagos_historial')
export class PagosHistorial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    stripePaymentIntentId: string;

    @Column({ type: 'integer' })
    montoPagado: number;

    @CreateDateColumn({ type: 'timestamp' })
    fechaPago: Date;

    // Relación con Usuario: Permitimos nullable: true para máxima flexibilidad
    @ManyToOne(() => Usuario, (usuario) => usuario.pagos, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'usuario_id' }) 
    usuario: Usuario;

    @ManyToOne(() => PlanesSuscripcion, (plan) => plan.pagos, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'plan_id' }) 
    plan: PlanesSuscripcion;
}
