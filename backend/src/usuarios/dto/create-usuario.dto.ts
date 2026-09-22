import { IsInt, IsString, IsBoolean, IsDate, ValidateNested,IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from "class-validator";
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
    
    @IsString()
    @IsOptional()
    @MinLength(6, {message: 'La clave debe tener al menos 6 caracteres'})
    clave?: string;

    @ValidateNested()
    @Type(()=>CreateDatosGymDto)
    datosGym: CreateDatosGymDto;

}


