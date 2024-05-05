import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { DiscountModule } from './discount/discount.module';
import { ItemModule } from './item/item.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Database variable
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.required(),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_USER: Joi.string().default('root'),
        DATABASE_PASSWORD: Joi.string().default('root'),
        // Listening Port
        PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule,
    DiscountModule,
    ItemModule,
  ],
  providers: [AppService],
})
export class AppModule {}
