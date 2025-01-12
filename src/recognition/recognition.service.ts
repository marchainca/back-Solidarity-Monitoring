import { Injectable, BadRequestException } from '@nestjs/common';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { loadFaceApiModels } from './face-api-loader';
import { Firestore } from '@google-cloud/firestore';
import { Person } from '../interfaces/interfaces'

// Extraer las clases necesarias de canvas
const { Canvas, Image, ImageData } = canvas;

// Configurar face-api para usar canvas en Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData }as any);

@Injectable()
export class RecognitionService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
    loadFaceApiModels(); // Cargar los modelos de Face API al iniciar el servicio
  }

  // Decodificar imagen Base64 a un objeto Canvas
  private async decodeImage(imageBase64: string): Promise<faceapi.TNetInput> {
    const base64Data = imageBase64.split(',')[1]; // Elimina el prefijo base64
    const buffer = Buffer.from(base64Data, 'base64'); // Convierte base64 a buffer
    const img = await canvas.loadImage(buffer); // Carga la imagen usando canvas
    return img as unknown as faceapi.TNetInput; // Asegura que sea del tipo TNetInput
  }

  // Método para registrar una persona con su descriptor facial
  async registerPerson(data: any): Promise<string> {
    const { name, lastName, email, imageBase64 } = data;

    if (!imageBase64) {
      throw new BadRequestException('La imagen base64 es requerida para el registro.');
    }

    const img = await this.decodeImage(imageBase64);

    // Generar descriptor facial (vector único para el rostro)
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new BadRequestException('No se detectó ningún rostro en la imagen proporcionada.');
    }

    const descriptor = Array.from(detection.descriptor); // Convertir Float32Array a un array normal

    // Guardar los datos en Firestore
    const personRef = this.firestore.collection('people').doc();
    await personRef.set({
      name,
      lastName,
      email,
      descriptor,
      createdAt: new Date().toISOString(),
    });

    return `Persona registrada exitosamente con ID: ${personRef.id}`;
  }

  // Método para identificar una persona
  async identifyPerson(imageBase64: string): Promise<any> {
    if (!imageBase64) {
      throw new BadRequestException('Debe proporcionar una imagen en formato base64 para la identificación.');
    }

    const img = await this.decodeImage(imageBase64);

    // Generar descriptor facial para la imagen proporcionada
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new BadRequestException('No se detectó ningún rostro en la imagen proporcionada.');
    }

    const queryDescriptor = detection.descriptor;

    // Recuperar todas las personas registradas
    const peopleSnapshot = await this.firestore.collection('people').get();
    const people = peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<Person, 'id'> }));

    // Comparar la imagen con los descriptores almacenados
    const labeledDescriptors = people.map(person => ({
      label: `${person.name} ${person.lastName}`,
      descriptor: new Float32Array(person.descriptor),
    }));

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // 0.6 es el umbral de similitud
    const bestMatch = faceMatcher.findBestMatch(queryDescriptor);

    if (bestMatch.label === 'unknown') {
      return { message: 'No se encontró ninguna coincidencia.' };
    }

    // Retornar los datos de la persona identificada
    const person = people.find(p => `${p.name} ${p.lastName}` === bestMatch.label);
    return {
      message: 'Persona identificada.',
      data: person,
    };
  }
}
