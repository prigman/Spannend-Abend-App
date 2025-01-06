import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../movie.service';
import type { Movie, Genre } from '../../models/app.model';

@Component({
	standalone: true,
	selector: 'movie-finder-app',
	styleUrl: './welcome.component.scss',
	imports: [CommonModule],
	templateUrl: './welcome.component.html'
})

export class WelcomeComponent {

	localStorageKey: string;
	
	movieList: Movie[];
	
	currentSliderIndex: number;

	sliderLoading: boolean;

	lastSlide: Movie;

	genreList: Genre[];

	currentGenre: Genre;

	currentGenrePage: number;

	constructor(private movieService : MovieService) {
		this.localStorageKey = "spannendabendapp-page";
		this.lastSlide = {
			title: 'lastSlide',
			poster: '/src/assets/next-page.png'
		};
		this.movieList = [];
		this.currentSliderIndex = 0;
		this.sliderLoading = true;
		this.genreList = [];
		this.currentGenre = {
			id: 0,
			name: ''
		};
		this.currentGenrePage = 1;
	}

	ngOnInit(): void {
		this.loadMovies(this.getPageNumberFromStorage());
		this.setGenreList();
	}

	changeSlide(index: number): void {
		if(this.currentSliderIndex === this.movieList.length-1 && index === this.currentSliderIndex){
			const page: number = this.getPageNumberFromStorage() + 1;
			if(this.currentGenre.name === '')
				this.loadMovies(page);
			else
				this.currentGenrePage+=1;
				this.loadMoviesByGenre(this.currentGenrePage, this.currentGenre.id);
		}
		else {
			this.currentSliderIndex = index;
		}
	}

	changeGenre(genre: Genre): void {
		this.currentGenre = genre;
		this.currentGenrePage = 1;
		this.loadMoviesByGenre(1, genre.id);
	}

	loadMovies(page: number): void {
		this.movieService.getTrendingMovies(page).then(movieList => {
			this.movieList = movieList;
		}).catch(error => console.log(error)).finally(() => {
			this.setMovieList(page, false);
		});
	}

	loadMoviesByGenre(page: number, genreId: number): void {
		this.movieService.getMoviesByGenre(page, genreId).then(movieList => {
			this.movieList = movieList;
		}).catch(error => console.log(error)).finally(() => {
			this.setMovieList(page, true);
		});
	}

	setMovieList(page: number, isGenre: boolean): void {
		this.movieList.push(this.lastSlide);
		this.sliderLoading = false;
		this.currentSliderIndex = 0;
		if(!isGenre)
			this.updateLocalStorage(page);
	}

	setGenreList(): void {
		this.movieService.getGenres().then(genreList => {
			this.genreList = genreList;
		}).catch(error => console.log(error));
	}

	getPageNumberFromStorage(): number {
		return (typeof localStorage === 'undefined') ? 1 : parseInt(JSON.parse(localStorage.getItem(this.localStorageKey) || '1'));
	}

	updateLocalStorage(page: number): void {
		if (typeof localStorage === 'undefined')
			return;
		localStorage.setItem(this.localStorageKey, JSON.stringify(page));
	}

}
