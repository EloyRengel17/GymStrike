import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("AccesoGym")
export class Actividad {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    cedula:string;

    @Column({ nullable:true})
    horaEntrada:Date;

    @Column({ nullable:true})
    horaSalida:Date;

}
