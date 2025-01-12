import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RecognitionService } from './recognition.service';

@Controller('letsHelp/Colombia/recognition')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  // Endpoint para registrar una persona
  @Post('/register')
  async registerPerson(@Body() body: any): Promise<string> {
    return await this.recognitionService.registerPerson(body);
  }

  // Endpoint para identificar una persona
  @Post('/identify')
  async identifyPerson(@Body('imageBase64') imageBase64: string): Promise<any> {
    if (!imageBase64) {
      throw new BadRequestException('La imagen base64 es requerida.');
    }

    return await this.recognitionService.identifyPerson(imageBase64);
  }
}
