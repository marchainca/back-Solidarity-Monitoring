import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

     // Ruta para identificar al integrante
    @Post('identify')
    async identifyIntegrante(@Body('rostroHash') rostroHash: string): Promise<any> {
        return await this.attendanceService.identifyIntegrante(rostroHash);
    }

    // Ruta para registrar asistencia
    @Post('register')
    async registerAttendance(
        @Body('integranteId') integranteId: string,
        @Body('actividad') actividad: string,
    ): Promise<string> {
        return await this.attendanceService.registerAttendance(integranteId, actividad);
    }
}
