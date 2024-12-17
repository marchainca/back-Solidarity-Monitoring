import { BadRequestException, Injectable } from '@nestjs/common';
import * as vision from '@google-cloud/vision'
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class RecognitionService {
    private visionClient: vision.ImageAnnotatorClient;
    private firestore: Firestore;
    private storage: Storage;
    private bucketName: ''; // Ojo reemplazar con el nombre del bucket de Google Cloud Storage
    constructor(){
        this.visionClient = new vision.ImageAnnotatorClient({
          keyFilename: "" // ojo poner la ruta de las credenciales  
        });
        this.firestore = new Firestore();
    }

    // Método para analizar la imagen y entrenar un integrante
    async trainFace(imageBuffer: Buffer, fileName: string, integranteData: any): Promise<string> {
        try {
          // 1. Subir la imagen a Cloud Storage
          const bucket = this.storage.bucket(this.bucketName);
          const file = bucket.file(`images/${fileName}`); // Ruta de almacenamiento en el bucket
    
          console.log('Subiendo imagen a Google Cloud Storage...');
          await file.save(imageBuffer, {
            metadata: {
              contentType: 'image/jpeg', // Tipo de archivo
            },
          });
    
          // Hacer la imagen pública opcionalmente
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/images/${fileName}`;
          console.log(`Imagen subida exitosamente: ${publicUrl}`);
    
          // 2. Analizar la imagen con Google Vision
          console.log('Analizando la imagen con Google Vision...');
          const [result] = await this.visionClient.faceDetection(imageBuffer);
          const faces = result.faceAnnotations;
    
          if (!faces || faces.length === 0) {
            throw new BadRequestException('No se detectaron rostros en la imagen.');
          }
    
          console.log(`Número de rostros detectados: ${faces.length}`);
    
          // 3. Guardar los datos del integrante en Firestore
          const integranteRef = this.firestore.collection('integrantes').doc();
          await integranteRef.set({
            ...integranteData,
            imageUrl: publicUrl, // URL de la imagen subida
            createdAt: new Date(),
          });
    
          console.log('Datos del integrante guardados en Firestore.');
    
          return `Integrante creado exitosamente con ID: ${integranteRef.id}`;
        } catch (error) {
          console.error('Error durante el entrenamiento facial:', error);
          throw new BadRequestException('Error al procesar la imagen y asociar los datos.');
        }
    }
}
