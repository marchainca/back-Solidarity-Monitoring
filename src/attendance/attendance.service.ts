import { Firestore } from '@google-cloud/firestore';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { errorResponse } from 'src/tools/function.tools';

@Injectable()
export class AttendanceService {
    private firestore: Firestore
    constructor(){
        this.firestore = new Firestore();
    }

    // Listar asistencias con filtros opcionales
    async listAttendances(filters?: { identificacion?: string; actividad?: string; fecha?: string },
        page: number = 1,
        limit: number = 10,
    ): Promise<{data: any[]; total: number; page: number; limit: number }> {
        try {
            const asistenciasRef = this.firestore.collection('attendances');
            let query: FirebaseFirestore.Query = asistenciasRef;

            // Aplicar filtros si se proporcionan
            if (filters?.identificacion) {
            query = query.where('identificacion', '==', filters.identificacion);
            }
            if (filters?.actividad) {
            query = query.where('actividad', '==', filters.actividad);
            }
            if (filters?.fecha) {
            query = query.where('fecha', '==', filters.fecha);
            }

            const querySnapshot = await query.get();

            /* if (querySnapshot.empty) {
            return [];
            } */

            // Transformar los documentos en un arreglo de objetos
            const allAttendances = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Implementar paginación manual
            const total = allAttendances.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedData = allAttendances.slice(startIndex, endIndex);

            return {
                data: paginatedData,
                total,
                page,
                limit,
            };
        } catch (error) {
            console.log("Error in listAttendances: ", error)
            throw error;
        }
        
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
            console.log("Error in identifyIntegrante: ", error)
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
        console.log("Consulta asistencia duplicada");
        return !querySnapshot.empty; // Retorna true si ya existe una asistencia
    }

    // Registrar asistencia
    async registerAttendance(identificacion: string, actividad: string): Promise<object> {
        try {
            const fechaActual = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
            const isDuplicate = await this.isDuplicateAttendance(identificacion, actividad, fechaActual);
            if (isDuplicate) {
                throw await errorResponse("Error: An attendance record already exists for the member for this activity and date.", 
                    "registerAttendance");
            }
            const integrantesRef = this.firestore.collection('members');
            let querySnapshot = await integrantesRef.where('identificacion', '==', identificacion).get();
            console.log("Consulta asistenciasRef");
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

            return {message: `Asistencia registrada exitosamente para el integrante ${querySnapshot.docs[0].data().nombre}`};
        } catch (error) {
            console.log("Error in registerAttendance: ", error)
            throw error;
        }
        
    }

    // Registrar inasistencia
    async registerAbsence(identificacion: string, actividad: string, motivo: string ): Promise<object> {
        try {
            // Validar que el integrante existe
            const integranteRef = this.firestore.collection('members').doc(identificacion);
            const integranteDoc = await integranteRef.get();

            if (!integranteDoc.exists) {
            throw new NotFoundException(`No se encontró un integrante con el ID ${identificacion}.`);
            }

            // Crear un nuevo registro de inasistencia
            const inasistenciasRef = this.firestore.collection('absences');
            const newAbsenceRef = inasistenciasRef.doc();

            await newAbsenceRef.set({
            identificacion,
            actividad,
            motivo,
            fecha: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            });

            return {message: `Inasistencia registrada exitosamente para el integrante ${identificacion}`};
        } catch (error) {
            console.log("Error in registerAbsence: ", error)
            throw error;
        }
        
    }
}
