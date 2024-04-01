import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AbstractDocument } from 'src/common/abstract.schema';
import { StaticContentTypeEnum, StatusEnum } from './enums';

export type StaticContentDocument = HydratedDocument<StaticContent>;

@Schema()
export class StaticContent extends AbstractDocument {
  @Prop()
  title: string;

  @Prop({})
  description: string;

  @Prop({ enum: StaticContentTypeEnum })
  type: string;

  @Prop({ enum: StatusEnum })
  status: StatusEnum;
}

export const StaticContentSchema = SchemaFactory.createForClass(StaticContent);
