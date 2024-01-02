import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadImage(image) {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    const fileName = `${Date.now()}_${image.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });
    await new Promise((resolve, reject) => {
      stream.on('error', (error) => reject(error));
      stream.on('finish', resolve);
      stream.end(image.buffer);
    });
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2025', // Set the expiration date for the URL
    });
    return url.split('?')[0];
  }
}
