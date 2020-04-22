import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor( private messageService: MessageService ) { }

  getHeroes(): Observable<Hero []> {
      this.messageService.add('HerosService: fetched heroes');

      // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.
      return of(HEROES);
  }

  getHeroe(id: number): Observable<Hero> {
      // Note the backticks ( ` ) that define a JavaScript template literal for embedding the id.
      this.messageService.add(`HeroService: fetched hero id=${id}`);
      
      return of( HEROES.find(hero => hero.id === id) );
  }
}
