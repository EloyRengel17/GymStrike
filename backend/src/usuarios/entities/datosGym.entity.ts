import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"; // Agregados los decoradores faltantes
import { Usuario } from "./usuario.entity"; // Agregada la importación del Usuario

@Entity("datos_gym") 
export class DatosGym { 
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'date' })
    fechaEntrada: Date;

    @Column({ type: 'date', nullable:true })
    fechaPago: Date;

    @Column({nullable:true})
    suscripcion: string;

    @Column()
    activo: boolean;

    @OneToOne(() => Usuario, (usuario) => usuario.datosGym)
    @JoinColumn({ name: 'usuario_id' }) 
    usuario: Usuario;
}