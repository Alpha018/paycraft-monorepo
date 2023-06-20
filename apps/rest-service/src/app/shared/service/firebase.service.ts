import * as admin from 'firebase-admin';
import App = admin.app.App;
import { Injectable, Scope } from '@nestjs/common';
import { RestServiceConfig } from '../../config/rest-service.config';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseService {
  private readonly app: App;

  constructor(private readonly configService: RestServiceConfig) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(this.configService.firebaseConfig.serviceAccount)),
    });
  }

  get auth() {
    return this.app.auth();
  }
}
