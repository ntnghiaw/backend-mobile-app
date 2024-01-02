import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import { ImageService } from './upload-image.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService, ImageService],
  exports: [FirebaseService, ImageService],
})
export class FirebaseModule {}
