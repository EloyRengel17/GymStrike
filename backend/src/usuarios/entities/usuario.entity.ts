import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DatosGym } from "./datosGym.entity"; // Importación corregida en mayúscula

@Entity('usuarios') // Corregido typo 'usaurios'
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cedula: string;

    @Column()
    telefono: string; 

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    genero: number; 

    @Column()
    tipoUsuario: string; // 'admin', 'entrenador', 'cliente'
    
    @OneToOne(() => DatosGym, (datosGym) => datosGym.usuario, { cascade: true, eager: true })
    datosGym: DatosGym; 

}