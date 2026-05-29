import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) { }

  @Post()
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadService.create(createActividadDto);
  }

  @Get()
  async findAll(@Query('cantidadPersonas') cantidadPersonas: string) {
    return await this.actividadService.findAll(cantidadPersonas === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actividadService.findOne(id);
  }



}
