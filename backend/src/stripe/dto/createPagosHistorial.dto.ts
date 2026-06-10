import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";


export class PagohistorialDto {

    @IsString()
    @IsNotEmpty()
    stripePaymentIntentId: string;

    @IsNotEmpty()
    @IsNumber()
    montoPagado: number;

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    fechaPago: Date | undefined;


    @IsNotEmpty()
    @IsNumber() 
    usuario: number;

    // Aquí se  especifica  el ID del plan que se está pagando
    @IsNotEmpty()
    @IsNumber()
    plan: number;
}