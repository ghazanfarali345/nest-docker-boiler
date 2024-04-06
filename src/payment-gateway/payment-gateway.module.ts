import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';

@Module({})
export class PaymentGatewayModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PaymentGatewayModule,
      controllers: [PaymentGatewayController],
      imports: [ConfigModule.forRoot()],
      providers: [
        PaymentGatewayService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
      exports: [PaymentGatewayService],
    };
  }
}
