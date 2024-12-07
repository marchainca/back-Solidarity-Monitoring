import { Module, Global } from '@nestjs/common';
import { firestore, firebaseAuth } from './firebase.config'
import { FirebaseService } from './firebase.service';

@Global()
@Module({providers: [
    {
      provide: 'FIRESTORE',
      useValue: firestore,
    },
    {
      provide: 'FIREBASE_AUTH',
      useValue: firebaseAuth,
    },
    FirebaseService,
  ],
  exports: ['FIRESTORE', 'FIREBASE_AUTH'],})
export class FirebaseModule {}
