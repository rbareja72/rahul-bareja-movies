import type Review from './Review';
import type Cast from './Cast';

export default interface Movie {
    // change: id cannot be undefined
    id: string;
    name: string;
    poster: string;
    gender: string;
    description: string;
    reviews?: Array<Review>;
    casts?: Array<Cast>;
}
