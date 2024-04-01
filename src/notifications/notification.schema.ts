import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: () => Boolean, default: false })
  isRead: boolean;

  @Prop({ enum: ['MESSAGE', 'FRIEND_REQUEST', 'PROMOTION'] })
  type: string;

  @Prop({ required: true, enum: ['HIGH', 'MEDIUM', 'LOW'] })
  priority: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
