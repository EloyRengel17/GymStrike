import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultasPowerBiDto } from './create-consultas-power-bi.dto';

export class UpdateConsultasPowerBiDto extends PartialType(CreateConsultasPowerBiDto) {}
