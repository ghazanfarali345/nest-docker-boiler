import { Module } from '@nestjs/common';
import { StaticContentService } from './static-content.service';
import { StaticContentController } from './static-content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticContentSchema } from './static-content.schema';
import { StaticContentRepository } from './static-content.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StaticContent', schema: StaticContentSchema },
    ]),
  ],
  controllers: [StaticContentController],
  providers: [StaticContentService, StaticContentRepository],
})
export class StaticContentModule {}
