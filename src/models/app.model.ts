export interface Movie {
	title: string,
	description: string,
	genres: Array<string>,
	vote: number,
	date: string,
	poster: string
}

export interface Header {
	method: string,
	headers : {
		accept: string,
		Authorization: string
	}
}

export interface Genre {
  id: number,
  name: string,
}