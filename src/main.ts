import { Component } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { of, tap, map, switchMap, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from './app/people/people.component';
import { People } from './app/interfaces/people.interface';
import { Film } from './app/interfaces/film.interface';
import { CharacterService } from './app/services/character.service';
import { RomanPipe } from './app/pipes/roman.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styles: `:host {
    .body {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: center;
    }
  }
  `,
  imports: [CommonModule, PeopleComponent],
  providers: [HttpClient, CharacterService, RomanPipe],
})
export class App {
  protected author = 'Sinni';
  protected characters$: Observable<People[]> = of([]);
  protected expandedIndex = 0;

  private initialCharacters: People[] = [];

  constructor(
    private characterService: CharacterService,
    private romanPipe: RomanPipe
  ) {}

  public ngOnInit(): void {
    this.initPeople();
  }

  protected onExpand(indexExpanded: number) {
    this.expandedIndex = indexExpanded;
  }

  private initPeople(): void {
    this.characters$ = this.characterService.getPeople().pipe(
      tap((people: People[]) => {
        this.initialCharacters = people;
      }),
      map((people: People[]) =>
        people.flatMap((c: { films: string[] }) => c.films)
      ),
      tap((films) => console.log(films)),
      map((films) => this.getUniqueFilms(films)),
      switchMap((films) => this.characterService.getFilms(films)),
      map(this.populateTitles.bind(this))
    );
  }

  private getUniqueFilms(films: string[]): string[] {
    return [...new Set(films)];
  }

  private populateTitles(films: Film[]): People[] {
    const filmTitleMapping: Record<string, string> = {};
    films.forEach(
      ({ url, title, episode_id }) =>
        (filmTitleMapping[url] = `Episode ${this.romanPipe.transform(
          episode_id
        )}: ${title}`)
    );

    this.initialCharacters = this.initialCharacters.map((character) => {
      character.films = character.films.map((film) => filmTitleMapping[film]);
      return character;
    });

    return this.initialCharacters;
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
