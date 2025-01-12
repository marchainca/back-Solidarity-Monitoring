export interface CustomResponse {
  code: number;
  message: string;
  content?: any;
  attribute?: string; 
  statusCode?:any
}

export interface Person {
  id: string; 
  name: string; 
  lastName: string; 
  email: string;
  documentType: string;
  documentNumber: string; 
  birthdate: string;
  address: string; 
  neighborhood: string;
  policyNumber: string; 
  emergencyContact: string;
  descriptor: number[]; 
}
