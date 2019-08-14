import { Controller, Get, HttpService, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Payment } from './payment';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService) {}

  @Get("/banks")
  banks(): any {
    return this.appService.banks();
  }

  @Post("/pay/:userId")
  pay(@Body() payment: Payment, userId: string): any {
    return this.appService.pay(payment, userId);
  }

  @Get("/cards/:userid")
  cards(@Param('userid') userId): any {
    return this.appService.cards(userId);
  }
  
  @Get("/transactions/:userId")
  transactions(@Param('userid') userId): any {
    return this.appService.transactions(userId);
  }

}
