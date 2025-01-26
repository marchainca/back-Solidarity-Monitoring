import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { sendResponse } from 'src/tools/function.tools';
import params from 'src/tools/params';
import { CustomResponse } from 'src/interfaces/interfaces';

@Controller('letsHelp/Colombia/activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}
    
    /**
     * Endpoint para obtener el contenido de la colección 'programs'.
     * @returns Lista de actividades.
    */
    @Get('/getAllActivities')
    async getActivities(): Promise<CustomResponse> {
        try {
            const allActivities = await this.activitiesService.getAllActivities();
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, allActivities );
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


    /**
     * Endpoint para obtener la lista de nombres de los programas.
     * @returns Lista de nombres de programas.
    */
    @Get('/programs')
        async getProgramNames(): Promise<CustomResponse> {
        try {
            const getPrograms = await this.activitiesService.getProgramNames();
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, {getPrograms} );
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

    /**
     * Endpoint para obtener las actividades de un programa específico.
     * @param programName Nombre del programa.
     * @returns Actividades asociadas al programa.
    */
    @Get('/:programName')
    async getProgramActivities(@Param('programName') programName: string): Promise<CustomResponse> {
        try {
            const activities = await this.activitiesService.getProgramActivities(programName);
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, activities );
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
