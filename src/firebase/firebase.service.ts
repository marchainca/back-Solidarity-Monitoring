import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from 'firebase/firestore';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIRESTORE') private firestore: Firestore) {}

  async createDocument(collectionName: string, data: any): Promise<string> {
    const colRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  async getDocuments(collectionName: string): Promise<any[]> {
    const colRef = collection(this.firestore, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await updateDoc(docRef, data);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await deleteDoc(docRef);
  }
}
