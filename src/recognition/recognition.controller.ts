import { Controller, Post, UploadedFile, Body, UseInterceptors, BadRequestException } from '@nestjs/common';
import { RecognitionService } from './recognition.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';

@Controller('letsHelp/Colombia/recognition')
export class RecognitionController {
    constructor(
        private readonly recognitionService: RecognitionService,
    ){}

    @Post('train')
    @UseInterceptors(FileInterceptor('image'))
    async trainFace(
        @UploadedFile() file: Express.Multer.File, // Tipo correcto para `file` 
        @Body() integranteData: any, // Datos adicionales
    ) {
        if (!file) {
        throw new BadRequestException('No se ha subido ninguna imagen.');
        }

        // Genera un nombre único para la imagen
        const fileName = `${uuidv4()}.jpg`;

        return await this.recognitionService.trainFace(file.buffer, fileName, integranteData);
    }
}
