import { Injectable } from "@angular/core";
import type { Movie, Header, Genre } from "./models/app.model";


@Injectable({
	providedIn: 'root'
})

export class MovieService {

	options : Header;

	genres: Genre[];

	constructor() {
		this.options = {
			method: 'GET',
			headers : {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTFiMTEzY2UzYjM5Y2NlZjI0NzMwNjQ4ZDdjMmExZiIsIm5iZiI6MTczNjA5NjYwMi44MTc5OTk4LCJzdWIiOiI2NzdhYmI1YTM4ZDI2YTJhNjM3MmI3MGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.43oAUQEU7wby1BltlJhooziE1Rv83xI35aJ4AjR-9Q8'
			}
		}
		this.genres = [];
	}

	async getMoviesFromAPI(page: number, genreId: number = 0): Promise<Movie[]> {
		try {
			if (this.genres.length === 0)
				await this.getGenreList();
			let response : Response;
			(genreId === 0) 
			? response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=de-DE&page=${page}`, this.options) 
			: response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=de-DE&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`, this.options);
			const data = await response.json();
			// console.log(data.results);
			return data.results.map(({ title, overview, genre_ids, vote_average, release_date, poster_path }: { title: string; overview: string; genre_ids : Array<number>; vote_average: number; release_date: string; poster_path: string }) => {
				return ({
				title: title,
				description: overview,
				vote: vote_average,
				genres: this.convertGenreIdsToNames(genre_ids),
				date: this.convertDateToDDMMYY(release_date),
				poster: `https://image.tmdb.org/t/p/w500${poster_path}`,
			})});
		} 
		catch (error) {
			console.log(error);
			return [];
		}
	}

	async getGenreList(): Promise<Genre[]> {
    try {
      const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=de-DE', this.options);
      const data = await response.json();
			this.genres = data.genres;
      return data.genres;
    } catch (error) {
      console.log(error);
			return []
    }
  }

	convertGenreIdsToNames(genreIds: number[]): string[] {	
		return genreIds.map((id) => {
			const genre = this.genres.find((g) => g.id === id);
			return genre ? ' ' + genre.name: 'Unknown';
		});
	}

	convertDateToDDMMYY(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear());
		return `${day}/${month}/${year}`;
	}
}