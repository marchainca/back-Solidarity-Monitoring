import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { FirestoreConnectionService } from './firebase/firestore-connection.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { RecognitionController } from './recognition/recognition.controller';
import { RecognitionService } from './recognition/recognition.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    FirebaseModule,
    AuthModule,
    UsersModule,
    AttendanceModule,
    SchedulerModule
  ],
  controllers: [AppController, RecognitionController],
  providers: [AppService, FirestoreConnectionService, RecognitionService],
})
export class AppModule {}
