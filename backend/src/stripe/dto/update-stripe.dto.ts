import { PartialType } from '@nestjs/mapped-types';
import { PlanesSuscripcionDto } from './create-stripe.dto';

export class UpdateStripeDto extends PartialType(PlanesSuscripcionDto) {}
