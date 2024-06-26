import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StaticContentModule } from './static-content/static-content.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
@Module({
  imports: [
    PaymentGatewayModule.forRootAsync(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT as unknown as number,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" <user@gmail.com>', // outgoing email ID
      },
    }),

    MongooseModule.forRoot(
      process.env.NODE_ENV !== 'production'
        ? process.env.MONGO_URL
        : process.env.MONGO_URL_ATLAS,
    ),

    // Custom Modules
    UsersModule,
    StaticContentModule,
    NotificationsModule,
    // PaymentGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
