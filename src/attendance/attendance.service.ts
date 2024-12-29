import { Firestore } from '@google-cloud/firestore';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AttendanceService {
    private firestore: Firestore
    constructor(){
        this.firestore = new Firestore();
    }

    // Buscar integrante por el hash facial
  async identifyIntegrante(rostroHash: string): Promise<any> {
    const integrantesRef = this.firestore.collection('integrantes');
    const querySnapshot = await integrantesRef.where('rostroHash', '==', rostroHash).get();

    if (querySnapshot.empty) {
      throw new NotFoundException('No se encontró un integrante con el rostro escaneado.');
    }

    // Retornar los datos del primer integrante encontrado
    const integrante = querySnapshot.docs[0].data();
    return integrante;
  }

  // Registrar asistencia
  async registerAttendance(integranteId: string, actividad: string): Promise<string> {
    const asistenciasRef = this.firestore.collection('asistencias');
    const newAttendanceRef = asistenciasRef.doc();

    await newAttendanceRef.set({
      integranteId,
      fecha: new Date().toISOString(),
      actividad,
    });

    return `Asistencia registrada exitosamente para el integrante ${integranteId}`;
  }
}
