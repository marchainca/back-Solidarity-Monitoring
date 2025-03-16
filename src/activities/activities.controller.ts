import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { sendResponse } from 'src/tools/function.tools';
import params from 'src/tools/params';
import { CustomResponse } from 'src/interfaces/interfaces';
import { UpdateActivityDto } from './dtos/update-activity.dto';

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
    @Get('/program-activities/:programName')
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

    /**
     * Endpoint para crear los programas.
     * @body body Nombre del programa.
     * @returns Id del programa.
    */
    @Post('/createProgram')
    async createProgram(@Body() body: JSON): Promise<CustomResponse> {
        try {
            const createProgram = await this.activitiesService.createProgram(body);
            
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, createProgram );
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
     * Endpoint para crear los programas.
     * @body body data del subPrograma.
     * @returns Id del subPrograma.
    */
    @Post('/createSubprogram')
    async createSubprogram(@Body() body: JSON): Promise<CustomResponse> {
        try {
            const createSubprogram = await this.activitiesService.createSubprogram(body);
            
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, createSubprogram );
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
     * Endpoint para crear las actividades.
     * @body body data de la actividad.
     * @returns Id de la actividad.
    */
    @Post('/createActivity')
    async createActivity(@Body() body: JSON): Promise<CustomResponse> {
        try {

            const createActivity = await this.activitiesService.createActivity(body);
            
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, createActivity );
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
     * Endpoint para obtener los programas por identificación.
     * @Param id del usuarios.
     * @returns Programa vinculado al usuario.
    */
    @Post('/getPrograms/:id')
    async getPrograms(@Param('id') id: string): Promise<CustomResponse> {
        try {

            const getPrograms = await this.activitiesService.getPrograms(id);
            
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, getPrograms );
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
     * Endpoint para obtener actividades de un subprograma dentro de un programa específico.
     * @param programId ID del programa.
     * @param subprogramId ID del subprograma.
     * @returns Lista de actividades del subprograma solicitado.
     */
    @Get('/activities-by-subprogram')
    async getActivitiesBySubprogram(@Query('programId') programId: string, @Query('subprogramId') subprogramId: string): Promise<CustomResponse> {
        try {
           const activities = await this.activitiesService.getActivitiesBySubprogram(programId, subprogramId);
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

    /**
     * Endpoint para actualizar una actividad en Firestore.
     * @param updateActivityDto Objeto con la información de la actualización.
     * @returns Mensaje de éxito.
     */
    @Patch('update-activity')
    async updateActivity(@Body() updateActivityDto: UpdateActivityDto): Promise<CustomResponse> {
        try {
            const update = await this.activitiesService.updateActivityWeek(updateActivityDto);
            return await sendResponse(true, params.ResponseMessages.MESSAGE_SUCCESS, update );
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
