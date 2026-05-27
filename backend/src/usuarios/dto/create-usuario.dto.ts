import { IsInt, IsString, IsBoolean, IsDate, ValidateNested,IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { Type } from 'class-transformer';
import { IsNull } from "typeorm";

export class CreateDatosGymDto{

    
    

    @IsString()
    @IsOptional()
    suscripcion: string;

    @IsBoolean()
    @IsNotEmpty()
    activo: boolean;


}

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    cedula:string

    @IsString()
    @IsNotEmpty()
    telefono: string; 

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsInt()
    @IsNotEmpty()
    genero: number;

    @IsString()
    @IsNotEmpty()
    tipoUsuario: string;

    @ValidateNested()
    @Type(()=>CreateDatosGymDto)
    datosGym: CreateDatosGymDto;

}


