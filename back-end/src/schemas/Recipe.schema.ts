import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User.schema';
import mongoose from 'mongoose';

@Schema()
export class Recipe {
  @Prop()
  name: string;
  @Prop()
  imageUrl: string;
  @Prop()
  description: string;
  @Prop()
  dishType: string;
  @Prop()
  duration: number;
  @Prop()
  ingredients: Array<string>;
  @Prop()
  steps: Array<string>;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  favoritedBy?: User[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
