import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Hero } from './hero';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

    private heroUrl = 'api/heroes';
    httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor( 
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    // All HttpClient methods return an RxJS Observable of something
    getHeroes(): Observable<Hero []> {
        this.messageService.add('HerosService: fetched heroes');

        // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.
        return this.http.get<Hero[]>(this.heroUrl)
                                    .pipe(
                                        tap(_ => this.log('fetched heroes')), // chama o método de log quando não encontrar nada
                                        catchError(this.handleError<Hero[]>('getHeroes', []))
                                    );
    }

    /** GET hero by id. Will 404 if id not found */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroUrl}/${id}`;

        return this.http.get<Hero>(url)
                                    .pipe(
                                        tap(_ => this.log(`fetched hero id=${id}`)),
                                        catchError(this.handleError<Hero>(`getHero id=${id}`))
                                    );
    }

    updateHero(hero: Hero): Observable<any>{
        return this.http.put(this.heroUrl, hero, this.httpOptions)
                        .pipe(
                            tap(_ => this.log(`update hero id=${hero.id}`)),
                            catchError(this.handleError<any>('updateHero'))
                        );
    }

    addHero(hero: Hero): Observable<Hero>{
        return this.http.post<Hero>(this.heroUrl, hero, this.httpOptions)
                        .pipe(
                            tap( (newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`) ),
                            catchError(this.handleError<Hero>('addHero'))
                        )
    }

    deleteHero(hero: Hero | number): Observable<Hero>{
        const id = typeof hero == 'number' ? hero : hero.id;
        const url = `${this.heroUrl}/${id}`;

        return this.http.delete<Hero>(url, this.httpOptions)
                        .pipe(
                            tap(_ => this.log(`delete hero id=${id}`)),
                            catchError(this.handleError<Hero>('deleteHero'))
                        );
    }

    searchHero(term: string): Observable<Hero[]>{
        if(!term.trim()){
            return of([]);
        }

        return this.http.get<Hero[]>(`${this.heroUrl}/?name=${term}`)
                        .pipe(
                            tap( x => x.length ? 
                                this.log(`found heroes matching "${term}"`) : 
                                this.log(`no heroes matching "${term}"`)
                            ),
                            catchError(this.handleError<Hero[]>('searchHeroes', []))
                        )
    }

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
}
