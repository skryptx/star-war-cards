import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { People } from '../interfaces/people.interface';
import { Film } from '../interfaces/film.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  public getPeople(): Observable<People[]> {
    return this.http
      .get<{ results: People[] }>('https://swapi.dev/api/people')
      .pipe(map(({ results }) => results));
  }

  public getFilms(films: string[]): Observable<Film[]> {
    const filmsObs$ = films.map((film) => this.http.get<Film>(film));
    return forkJoin(filmsObs$);
  }
}
