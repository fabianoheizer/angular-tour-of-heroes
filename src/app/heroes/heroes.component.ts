import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';

import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

    heroes: Hero[];
    selectedHero: Hero;

    // When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of HeroService.
    constructor(
        private heroService: HeroService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getHeroes();
    }   
        
    onSelect(hero: Hero){
        this.selectedHero = hero;
        this.messageService.add(`HeroService: Selected hero id=${hero.id}`);
    }

    getHeroes(): void {
        this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
    }

}
