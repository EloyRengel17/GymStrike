import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { PagoHistorial } from './entities/consultas-power-bi.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(PagoHistorial)
    private readonly pagosRepository: Repository<PagoHistorial>,
  ) {}

  async exportarPagosExcel(): Promise<Buffer> {
    // 1. Consultar todos los pagos (puedes agregar relations: ['usuario', 'plan'] si los tienes en la entidad)
    const pagos = await this.pagosRepository.find({
      order: { fechaPago: 'DESC' },
    });

    // 2. Crear un libro de trabajo y una hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial de Pagos');

    // 3. Definir las columnas y encabezados
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Stripe Payment Intent ID', key: 'stripePaymentIntentId', width: 30 },
      { header: 'Monto Pagado', key: 'montoPagado', width: 15 },
      { header: 'Fecha de Pago', key: 'fechaPago', width: 22 },
      { header: 'ID Usuario', key: 'usuario_id', width: 15 },
      { header: 'ID Plan', key: 'plan_id', width: 15 },
    ];

    // Estilo básico para los encabezados
    worksheet.getRow(1).font = { bold: true };

    // 4. Llenar los datos
    pagos.forEach((pago) => {
      worksheet.addRow({
        id: pago.id,
        stripePaymentIntentId: pago.stripePaymentIntentId,
        montoPagado: pago.montoPagado,
        fechaPago: pago.fechaPago,
        usuario_id: pago.usuario_id,
        plan_id: pago.plan_id,
      });
    });

    // 5. Convertir el libro a un Buffer de Node.js
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}