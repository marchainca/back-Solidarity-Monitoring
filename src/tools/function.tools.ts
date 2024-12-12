import { HttpStatus } from "@nestjs/common";
import {CustomResponse} from '../interfaces/interfaces'
import params from "./params";


/**
 * Función reutilizable para enviar respuestas HTTP 
 * @param success Si la operación fue exitosa(true) o fallida(false)
 * @param message El mensaje a enviar en la respuesta
 * @param data Los datos a incluir en la respuesta
*/
export async function sendResponse(success: boolean, message: string, data?: any): Promise<CustomResponse> {
    const code = success ? 1 : 0;
    const response: CustomResponse = {
      code,
      message,
      data: data ? { content: data } : {},
    };
    return response;
  }
  
  export async function errorResponse(message: string, attribute: string): Promise<CustomResponse> {
    const response: CustomResponse = {
      code: params.ResponseCodes.ERROR,
      message: message,
      attribute: attribute,
      statusCode: HttpStatus.BAD_REQUEST,
    };
    return response;
  
  }