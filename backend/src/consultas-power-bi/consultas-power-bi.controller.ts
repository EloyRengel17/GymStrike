import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express'; // ✅ Agrega la palabra 'type' aquí
import { PagosService } from './consultas-power-bi.service';

@Controller('consultas-power-bi')
export class ConsultasPowerBiController {
  constructor(private readonly powerBiService: PagosService) {}

  @Get('exportar-excel')
  async downloadPagosExcel(@Res() res: Response) {
    const buffer = await this.powerBiService.exportarPagosExcel();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="historial_pagos.xlsx"',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}