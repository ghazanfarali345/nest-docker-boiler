import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AbstractDocument } from 'src/common/abstract.schema';

// export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  fullName: string;

  @Prop({ required: true })
  phoneNo: string;

  @Prop({ default: '' })
  profileImage: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({})
  pushNotificationEnabled: boolean;

  @Prop({ enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  otp: string;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

  @Prop()
  stripeCustomerId: string;

  @Prop()
  deviceToken: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
