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

	emptyGenre : Genre

	currentGenrePage: number;

	currentLocalStoragePage: number;

	constructor(private movieService : MovieService) {
		this.localStorageKey = "spannendabendapp-page";
		this.lastSlide = {
			title: '',
			description: '',
			genres: [],
			vote: 0.0,
			date: '',
			poster: './next-page.png'
		};
		this.movieList = [];
		this.currentSliderIndex = 0;
		this.sliderLoading = true;
		this.genreList = [];
		this.emptyGenre = {
			id: 0,
			name: ''
		}
		this.currentGenre = this.emptyGenre;
		this.currentGenrePage = 1;
		this.currentLocalStoragePage = this.getPageNumberFromStorage();
		
	}

	ngOnInit(): void {
		this.loadMovies(this.currentLocalStoragePage);
		this.setGenreList();
	}

	changeSlide(index: number): void {
		if(this.currentSliderIndex === this.movieList.length-1 && index === this.currentSliderIndex){
			this.sliderLoading = true;
			(this.currentLocalStoragePage !== 500) ? this.currentLocalStoragePage+=1 : this.currentLocalStoragePage = 1;
			if(this.currentGenre === this.emptyGenre){
				this.loadMovies(this.currentLocalStoragePage);
			}
			else {
				(this.currentGenrePage !== 500) ? this.currentGenrePage+=1 : this.currentGenrePage = 1;
				this.loadMovies(this.currentGenrePage);
			}
		}
		else {
			this.currentSliderIndex = index;
		}
	}

	changeGenre(genre: Genre): void {
		this.sliderLoading = true;
		if (genre === this.currentGenre){
			this.currentGenre = this.emptyGenre;
			this.loadMovies(this.currentLocalStoragePage);
		}
		else {
			this.currentGenre = genre;
			this.currentGenrePage = 1;
			this.loadMovies(this.currentGenrePage);
		}
	}

	loadMovies(page: number): void {
		this.movieService.getMoviesFromAPI(page, this.currentGenre.id).then(movieList => {
			this.movieList = movieList;
		}).catch(error => console.log(error)).finally(() => {
			this.setMovieList(page, (this.currentGenre === this.emptyGenre) ? true : false);
			// console.log(this.movieList);
		});
	}

	setMovieList(page: number, byPopular: boolean): void {
		this.movieList.push(this.lastSlide);
		this.sliderLoading = false;
		this.currentSliderIndex = 0;
		if(byPopular)
			this.updateLocalStorage(page);
	}

	setGenreList(): void {
		this.movieService.getGenreList().then(genreList => {
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

	scrollToTarget(index: number): void {
		if(index !== this.currentSliderIndex) return;
		const targetElement = document.querySelector('.movie-details');
		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}

}
