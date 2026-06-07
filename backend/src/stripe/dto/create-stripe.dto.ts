import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class PlanesSuscripcionDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    precio: number;

    @IsNumber()
    @IsNotEmpty()
    duracionDias: number;

    @IsBoolean()
    @IsNotEmpty()
    activo: boolean;


}
