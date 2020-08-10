import generateMovies from '../utils/generate';

export interface MoviesRequestType {
  noOfMovies: Number,
  noOfReviews: Number;
  noOfCastMembers: Number,
}

const getMovies = (noOfMovies: Number, noOfReviews: Number, noOfCastMembers: Number) => generateMovies(noOfMovies, noOfReviews, noOfCastMembers);

export const fetchMovies = ({ noOfMovies, noOfReviews, noOfCastMembers }: MoviesRequestType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMovies(noOfMovies, noOfReviews, noOfCastMembers));
    }, 0);
  });
};
