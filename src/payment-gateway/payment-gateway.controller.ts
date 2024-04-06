import { Controller, Get, Post } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payments')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  // @Post('charge')
  // async createPayment() {
  //   return this.paymentGatewayService.createPaymentIntent();
  // }
  // @Post('saveCard')
  // async saveCard() {
  //   return this.paymentGatewayService.saveCard();
  // }

  // @Get('cards')
  // async getProducts() {
  //   return await this.paymentGatewayService.listCards();
  // }
}
