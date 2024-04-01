import { AbstractRepository } from 'src/common/abstract.repository';
import { StaticContent } from './static-content.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StaticContentRepository extends AbstractRepository<StaticContent> {
  protected readonly logger = new Logger(StaticContentRepository.name);

  constructor(
    @InjectModel(StaticContent.name) readonly userModel: Model<StaticContent>,
  ) {
    super(userModel);
  }
}
