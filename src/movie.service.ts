import { Injectable } from "@angular/core";
import type { Movie, Header, Genre } from "./models/app.model";


@Injectable({
	providedIn: 'root'
})

export class MovieService {

	options : Header;

	constructor() {
		this.options = {
			method: 'GET',
			headers : {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTFiMTEzY2UzYjM5Y2NlZjI0NzMwNjQ4ZDdjMmExZiIsIm5iZiI6MTczNjA5NjYwMi44MTc5OTk4LCJzdWIiOiI2NzdhYmI1YTM4ZDI2YTJhNjM3MmI3MGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.43oAUQEU7wby1BltlJhooziE1Rv83xI35aJ4AjR-9Q8'
			}
		}
	}

	async getMoviesFromAPI(page: number, genreId: number = 0): Promise<Movie[]> {
		try {
			let response : Response;
			(genreId === 0) 
			? response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`, this.options) 
			: response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`, this.options);
			const data = await response.json();
			return data.results.map(({ title, poster_path }: { title: string; poster_path: string }) => ({
				title,
				poster: `https://image.tmdb.org/t/p/w500${poster_path}`,
			}));
		} 
		catch (error) {
			console.log(error);
			return [];
		}
	}

	async getGenreList(): Promise<Genre[]> {
    try {
      const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', this.options);
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.log(error);
			return []
    }
  }
}