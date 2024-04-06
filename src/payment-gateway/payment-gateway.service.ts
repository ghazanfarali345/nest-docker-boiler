import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentGatewayService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(body): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create(body);
    return customer;
  }

  // This function will be used on frontend to create payment id and pass it to charge method

  // async createPaymentMethod() {
  //   const paymentMethod = await stripe.paymentMethods.create({
  //     type: 'card',
  //     card: {
  //       number: '4242424242424242',
  //       exp_month: 8,
  //       exp_year: 2026,
  //       cvc: '314',
  //     },
  //   });
  // }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
    });
    return paymentIntent;
  }

  async saveCard(
    customerId: string,
    cardToken: string,
  ): Promise<Stripe.CustomerSource> {
    const source = await this.stripe.customers.createSource(customerId, {
      source: cardToken,
    });
    return source;
  }

  async listCards(customerId: string): Promise<Stripe.CustomerSource[]> {
    const cards = await this.stripe.customers.listSources(customerId, {
      object: 'card',
    });
    return cards.data;
  }

  async chargeWithSavedCard(
    customerId: string,
    cardId: string,
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: cardId,
      confirm: true,
    });
    return paymentIntent;
  }

  async listCustomers(): Promise<Stripe.Customer[]> {
    const customers = await this.stripe.customers.list();
    return customers.data;
  }
}
