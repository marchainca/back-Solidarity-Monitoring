import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { errorResponse } from 'src/tools/function.tools';

@Injectable()
export class UsersService {
    private collectionName = 'users';
    
    constructor(private readonly firebaseService: FirebaseService) {}

    /**
     * Crear usuarios en Firestore
     * @param data Datos del usuario
     */
    async createUser(data: any): Promise<string> {
        try {
           
            const userByEmail = await this.firebaseService.findUserByField("email", data.email, this.collectionName);
            console.log("Consulta de usuario por email:", userByEmail, userByEmail[0] == false);

            if (userByEmail.length > 0 ) {
                throw await errorResponse("Error: user is already registered with the email", "createUser");
            }

            const userByIdNumber = await this.firebaseService.findUserByField("idNumber", data.idNumber, this.collectionName);

            if (userByIdNumber.length > 0) {
                throw await errorResponse("Error: user is already registered with the idNumber", "createUser");
            }

            return await this.firebaseService.createDocument(this.collectionName, data);
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error; // Relanzar el error para que el llamador lo maneje
        }
    }


    // Obtener todos los usuarios
    async getUsers(): Promise<any[]> {
        // Llama al método genérico para obtener documentos de la colección
        return await this.firebaseService.getDocuments(this.collectionName);
    }

    // Actualizar un usuario por ID
    async updateUser(userId: string, data: any): Promise<void> {
        // Llama al método genérico para actualizar un documento
        return await this.firebaseService.updateDocument(this.collectionName, userId, data);
    }

    // Eliminar un usuario por ID
    async deleteUser(userId: string): Promise<void> {
        // Llama al método genérico para eliminar un documento
        return await this.firebaseService.deleteDocument(this.collectionName, userId);
    }

}
