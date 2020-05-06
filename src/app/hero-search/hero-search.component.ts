import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

    heroes$: Observable<Hero[]>;
    private searchterms = new Subject<string>();

    constructor(private heroService: HeroService) { }
     
    search(term: string): void{
        this.searchterms.next(term);
    }

    ngOnInit(): void {
        this.heroes$ = this.searchterms.pipe(
            // aguarda 300ms para a cada pressionamento de tecla para efetuar a busca
            debounceTime(300),

            // garante que sera efetuada a busca somente se o term for atualizado
            distinctUntilChanged(),

            // cada incremento da busca vai no servico e busca
            switchMap( (term: string) => this.heroService.searchHero(term) ),
        );
    }

}
