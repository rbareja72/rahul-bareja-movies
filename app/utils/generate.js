import 'react-native-get-random-values';
import { times } from 'rambdax';
import { v4 as uuid } from 'uuid';
import moviesData from '@data/Movies';
import reviewsData from '@data/Reviews';
import castsData from '@data/Casts';

// Change: unneeded reduce
const flatMap = (fn, arr) => arr.map(fn); //.reduce((a, b) => a.concat(b), []);

const fuzzCount = (count) => {
    // makes the number randomly a little larger or smaller for fake data to seem more realistic
    const maxFuzz = 4;
    const fuzz = Math.round((Math.random() - 0.5) * maxFuzz * 2);
    return count + fuzz;
};

const makeRandomMovie = (i) => {
    const movie = moviesData[Math.floor(Math.random() * (i + 1)) % moviesData.length];
    return {
        id: uuid(),
        ...movie,
    };
};

const makeRandomReview = (i) => {
    const review = {
        id: uuid(),
        body: reviewsData[i % reviewsData.length],
    };

    return review;
};

const makeReviews = (movie, count) => {
    const reviews = times((i) => makeRandomReview(i), count);
    movie.reviews = reviews;
};

const makeRandomCast = (i) => {
    const casts = {
        id: uuid(),
        body: castsData[i % castsData.length],
    };

    return casts;
};

const makeCast = (movie, count) => {
    const casts = times((i) => makeRandomCast(i), count);
    movie.casts = casts;
};

const generateMovies = (moviesCount, reviewsPerMovie, castPerMovie) => {
    const movies = times((i) => makeRandomMovie(i), moviesCount);

    flatMap((movie) => {
        makeReviews(movie, fuzzCount(reviewsPerMovie));
        makeCast(movie, fuzzCount(castPerMovie));
    }, movies);

    return movies;
};

export default generateMovies;
