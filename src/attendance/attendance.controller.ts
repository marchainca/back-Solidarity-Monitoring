import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { sendResponse } from 'src/tools/function.tools';
import params from 'src/tools/params';
import { CustomResponse } from 'src/interfaces/interfaces';

@Controller('letsHelp/Colombia/attendance/')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    // Endpoint para listar asistencias con filtros opcionales
    @Get('list')
    async listAttendances(
        @Query('integranteId') identificacion?: string,
        @Query('actividad') actividad?: string,
        @Query('fecha') fecha?: string,
    ): Promise<any[]> {
        const filters = { identificacion, actividad, fecha };
        return await this.attendanceService.listAttendances(filters);
    }

     // Ruta para identificar al integrante
    @Post('identify')
    async identifyIntegrante(@Body('rostroHash') rostroHash: string): Promise<CustomResponse> {
        try {
            const identify= await this.attendanceService.identifyIntegrante(rostroHash);
            return await sendResponse(true, params.ResponseMessages.SUCCESS, identify);
             
        } catch (error) {
            throw new HttpException(
                {
                code: error.code,
                message: error.message,
                attribute: error.attribute,
                statusCode: error.statusCode,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        
    }

    // Ruta para registrar asistencia
    @Post('register')
    async registerAttendance(
        @Body('identificacion') identificacion: string,
        @Body('actividad') actividad: string,
    ): Promise<CustomResponse> {
        try {
             const record = await this.attendanceService.registerAttendance(identificacion, actividad);
             return await sendResponse(true, params.ResponseMessages.SUCCESS, record);
        } catch (error) {
            throw new HttpException(
                {
                code: error.code,
                message: error.message,
                attribute: error.attribute,
                statusCode: error.statusCode,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        
    }
}
