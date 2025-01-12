export interface CustomResponse {
  code: number;
  message: string;
  content?: any;
  attribute?: string; 
  statusCode?:any
}

export interface Person {
  id: string; // ID del documento en Firestore
  name: string; // Nombre de la persona
  lastName: string; // Apellido de la persona
  descriptor: number[]; // Descriptor facial almacenado
}
