import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Recipe } from './Recipe.schema';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: false })
  displayName?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  dayOfBirth?: string;

  @Prop({ required: false })
  sex?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }] })
  recipes?: Recipe[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }] })
  favorited?: Recipe[];
}

export const UserSchema = SchemaFactory.createForClass(User);
