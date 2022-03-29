import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop()
  login: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  user: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  repos: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  events: any;

  @Prop()
  emails: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  subscriptions: any[];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default(val: any): any {
      return 0;
    },
  })
  stages: number;
}

export const GithubProfileSchema = SchemaFactory.createForClass(Profile);
