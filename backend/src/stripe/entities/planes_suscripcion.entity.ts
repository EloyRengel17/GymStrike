import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { PagosHistorial } from "./pagos_historial.entity";
@Entity('planes_suscripcion')
export class PlanesSuscripcion {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    precio: number; //los precios de deben manejar en centavos en vez de 30$ son 3000centavos 

    @Column()
    duracionDias: number;

    @Column()
    activo: boolean;//por si el plan deja de estar activo mas adelante;

    @OneToMany(() => PagosHistorial, (pago) => pago.plan)
    pagos: PagosHistorial[];
}
