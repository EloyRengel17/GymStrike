import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginPcDto } from './create-login-pc.dto';

export class UpdateLoginPcDto extends PartialType(CreateLoginPcDto) {}
