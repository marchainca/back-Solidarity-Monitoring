import { Firestore } from '@google-cloud/firestore';
import { Injectable, NotFoundException } from '@nestjs/common';
import { errorResponse } from 'src/tools/function.tools';

@Injectable()
export class AttendanceService {
    private firestore: Firestore
    constructor(){
        this.firestore = new Firestore();
    }

    // Listar asistencias con filtros opcionales
    async listAttendances(filters?: { identificacion?: string; actividad?: string; fecha?: string }): Promise<any[]> {
        const asistenciasRef = this.firestore.collection('asistencias');
        let query: FirebaseFirestore.Query = asistenciasRef;

        // Aplicar filtros si se proporcionan
        if (filters?.identificacion) {
        query = query.where('integranteId', '==', filters.identificacion);
        }
        if (filters?.actividad) {
        query = query.where('actividad', '==', filters.actividad);
        }
        if (filters?.fecha) {
        query = query.where('fecha', '==', filters.fecha);
        }

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
        return [];
        }

        // Transformar los documentos en un arreglo de objetos
        const asistencias = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));

        return asistencias;
    }

    // Buscar integrante por el hash facial
    async identifyIntegrante(rostroHash: string): Promise<any> {
        try {
            const integrantesRef = this.firestore.collection('members');
            const querySnapshot = await integrantesRef.where('rostroHash', '==', rostroHash).get();

            if (querySnapshot.empty) {
                throw await errorResponse("Error: Invalid hash", "identifyIntegrante");
            }

            const integrante = querySnapshot.docs[0].data();
            return integrante;
        } catch (error) {
            throw error;
        }
        
    }

    private async isDuplicateAttendance(
        identificacion: string,
        actividad: string,
        fecha: string,
    ): Promise<boolean> {
        const asistenciasRef = this.firestore.collection('attendances');
        const querySnapshot = await asistenciasRef
        .where('identificacion', '==', identificacion)
        .where('actividad', '==', actividad)
        .where('fecha', '==', fecha)
        .get();
        console.log("Consulta asistencia duplicada", querySnapshot.docs[0].data());
        return !querySnapshot.empty; // Retorna true si ya existe una asistencia
    }

    // Registrar asistencia
    async registerAttendance(identificacion: string, actividad: string): Promise<string> {
        try {
            const fechaActual = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
            const isDuplicate = await this.isDuplicateAttendance(identificacion, actividad, fechaActual);
            if (isDuplicate) {
                throw await errorResponse("Error: An attendance record already exists for the member for this activity and date.", 
                    "registerAttendance");
            }
            const integrantesRef = this.firestore.collection('members');
            let querySnapshot = await integrantesRef.where('identificacion', '==', identificacion).get();
            console.log("Consulta asistenciasRef", querySnapshot.docs[0].data());
            if (querySnapshot.empty) {
                throw await errorResponse("Error: Invalid Identification", "registerAttendance");
            }
            const asistenciasRef = this.firestore.collection('attendances');
            
            const newAttendanceRef = asistenciasRef.doc();
            
            await newAttendanceRef.set({
                identificacion,
                fecha: fechaActual,
                actividad,
            });

            return `Asistencia registrada exitosamente para el integrante ${querySnapshot.docs[0].data().nombre}`;
        } catch (error) {
            throw error;
        }
        
    }
}
