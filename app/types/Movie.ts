import type Review from './Review';

export default interface Movie {
    // change: id cannot be undefined
    id: string;
    name: string;
    poster: string;
    gender: string;
    description: string;
    reviews?: Array<Review>;
}
