import * as admin from 'firebase-admin';
import App = admin.app.App;

import { Injectable, OnModuleInit } from '@nestjs/common';
import { CoreServiceConfig } from '../../config/core-service.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: App;
  constructor(private readonly configService: CoreServiceConfig) {}

  onModuleInit(): void {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(this.configService.firebaseConfiguration),
    });
  }

  get auth() {
    return this.app.auth();
  }
}
