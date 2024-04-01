import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaticContentDto } from './dto/create-static-content.dto';
import { UpdateStaticContentDto } from './dto/update-static-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StaticContentDocument } from './static-content.schema';
import { FilterQuery, Model, _FilterQuery } from 'mongoose';
import { StaticContentRepository } from './static-content.repository';
import { StaticContentTypeEnum } from './enums';

@Injectable()
export class StaticContentService {
  constructor(
    private readonly staticContentRepository: StaticContentRepository,
  ) {}

  async create(createStaticContentDto: CreateStaticContentDto) {
    if (
      createStaticContentDto.type == StaticContentTypeEnum.PRIVACY_POLICY ||
      createStaticContentDto.type == StaticContentTypeEnum.TERMS_AND_CONDITIONS
    ) {
      let exists = await this.staticContentRepository.userModel.findOne({
        type: createStaticContentDto.type,
      });

      if (exists) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `${createStaticContentDto.type} is already created`,
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.staticContentRepository.create(createStaticContentDto);
    return {
      success: true,
      message: 'Created static content',
      data: null,
    };
  }

  async findAll(filter?: any) {
    let data = await this.staticContentRepository.find(filter);

    return {
      success: true,
      message: 'Static content fetched successfully',
      data: data,
    };
  }

  async findOne(filter: any) {
    const data = await this.staticContentRepository.findOne(filter);

    return {
      success: true,
      message: 'Static content fetched successfully',
      data: data,
    };
  }

  async update(id: string, updateStaticContentDto: UpdateStaticContentDto) {
    let data = await this.staticContentRepository.findOneAndUpdate(
      { _id: id },
      {
        ...updateStaticContentDto,
      },
    );

    return {
      success: true,
      message: 'Static content updated successfully',
      data: data,
    };
  }

  async remove(id: string) {
    let data = await this.staticContentRepository.findOneAndUpdate(
      { _id: id },
      {
        status: 'INACTIVE',
      },
    );

    return {
      success: true,
      message: 'Static content deleted successfully',
      data: data,
    };
  }
}
