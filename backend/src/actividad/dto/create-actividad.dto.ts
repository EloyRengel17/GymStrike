import { IsNotEmpty, IsString } from "class-validator";

export class CreateActividadDto {

    @IsString()
    @IsNotEmpty()
    cedula: string;

}
