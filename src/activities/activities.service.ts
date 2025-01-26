import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { errorResponse } from 'src/tools/function.tools';

@Injectable()
export class ActivitiesService {
    private firestore: Firestore;

    constructor() {
      this.firestore = new Firestore();
    }
  
    /**
     * Obtiene el contenido de la colección 'programs' desde Firestore.
     * @returns Lista con los datos de todos los documentos en la colección 'programs'.
     */
    async getAllActivities(): Promise<any[]> {
      try {
        const programsRef = this.firestore.collection('programs');
        const snapshot = await programsRef.get();
  
        if (snapshot.empty) {
          console.log('No se encontraron documentos en la colección "programs".');
          return [];
        }
  
        // Mapear los documentos para devolver su contenido
        const programs = snapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data(), 
        }));
  
        return programs;
      } catch (error) {
        console.error('Error al obtener los programas:', error);
        throw new Error('Error al obtener los programas.');
      }
    }

    /**
     * Obtiene la lista de los nombres de los programas.
     * @returns Lista con los nombres de los programas.
     */
    async getProgramNames(): Promise<string[]> {
        try {
        const programsRef = this.firestore.collection('programs');
        const snapshot = await programsRef.get();
    
        if (snapshot.empty) {
            console.log('No se encontraron documentos en la colección "programs".');
            return [];
        }
    
        // Extraer solo los nombres de los programas (IDs de los documentos)
        const programNames = snapshot.docs.map(doc => doc.id);
        return programNames;
        } catch (error) {
            console.error('Error al obtener los nombres de los programas:', error);
            throw error;
        }
    }

    /**
     * Obtiene las actividades asociadas a un programa específico.
     * @param programName Nombre del programa.
     * @returns Las actividades del programa solicitado.
     */
    async getProgramActivities(programName: string): Promise<any> {
        try {
            const programRef = this.firestore.collection('programs').doc(programName);
            const doc = await programRef.get();
        
            if (!doc.exists) {
                throw await errorResponse(`Error: The program "${programName}" does not exist.`, 'getProgramActivities');
            }
        
            // Retornar las actividades del programa
            return doc.data();
        } catch (error) {
            console.error('Error al obtener las actividades del programa:', error);
            throw error;
        }
    }
  
  
}
