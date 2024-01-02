import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  constructor() {
    // const serviceAccount = require('');
    admin.initializeApp({
      credential: admin.credential.cert(
        './src/service/omurice-407219-firebase-adminsdk-zto79-7d8e431792.json',
      ),
      storageBucket: 'file-storage-407721.appspot.com',
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
