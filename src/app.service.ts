import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Payment } from './payment';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) {
  }

  pay(payment: Payment, userId: string): Promise<any | any> {
    let that = this;
    return this.cards(userId).then(function(_cards){
      const card = _cards.filter((c) => { return c.card_number == payment.card_number;})[0];
      if (card){
        return that.httpService.post(`http://localhost:3000/banks/${card.bank_id}/transactions/${userId}`)
        .pipe(map((response: any) => {
          console.log(response.data);
          return response.data as any
          })).pipe(catchError(that.handleErrorVideo)).toPromise();
      }

    });
  }

  banks(): any[] {
    return [{
      "id": "rhte",
      "short_name": "RHTE",
      "full_name": "Tech Exchange Bank",
      "logo": "rhte-bank.png",
      "website": "redhat.com/rhte"
    },
    {
      "id": "summit",
      "short_name": "SUMMIT",
      "full_name": "Summit",
      "logo": "summit-bank.png",
      "website": "redhat.com/summit"
    }]
  };

  cards(userId: string): Promise<any | any>  {
    let cardsTotal: any[] = [];

    return this.cardsByUserId("rhte", userId).then((data: any) => {
      cardsTotal.push(data);
      return this.cardsByUserId("summit", userId);
    }).then((dataz: any) => {
      cardsTotal.push(dataz);
      return cardsTotal;
    })
  }

  transactions(userId: string): Promise<any | any>  {
    let transactionsTotal: any[] = [];
    let rhteTransactions: any[];
    let summitTransactions: any[]; 

    return this.transactionsByUserId("rhte", userId).then((data: any) => {
      rhteTransactions = data;
      return this.transactionsByUserId("summit", userId);
    }).then((dataz: any) => {
      summitTransactions = dataz;

      return rhteTransactions.concat(summitTransactions);
    })
  }

  private transactionsByUserId(bank: string, userId: string): Promise<any | any>  {
    return this.httpService.get(`http://localhost:3000/banks/${bank}/transactions/${userId}`).
      pipe(map((response: any) => {
        return response.data as any
      })).pipe(catchError(this.handleErrorVideo)).toPromise();
  }

  private cardsByUserId(bank: string, userId: string): Promise<any | any>  {
    return this.httpService.get(`http://localhost:3000/banks/${bank}/cards/${userId}`).
      pipe(map((response: any) => {
        return response.data as any
      })).pipe(catchError(this.handleErrorVideo)).toPromise();
  }


  private handleErrorVideo(err: any) {
      console.log(err);
      return observableThrowError({"message": "ERROR 001 - Internal error"});
  }
}
