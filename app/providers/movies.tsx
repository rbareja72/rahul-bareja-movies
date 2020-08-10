import React from 'react';
import { fetchMovies } from './../apis/';
import { useAsyncStorage } from '@react-native-community/async-storage';

interface ReduxAction {
  type: string,
  payload?: any,
}

const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
const FETCH_MOVIES_ERROR = 'FETCH_MOVIES_ERROR';
const FETCH_MOVIES_PROGRESS = 'FETCH_MOVIES_PROGRESS';
const FETCH_MOVIES_CLEAR_API_STATE = 'FETCH_MOVIES_CLEAR_API_STATE';

const initialApiState = {
  isSuccess: false,
  isError: false,
  message: '',
};

const initialState = {
  fetchMovieApiState: {
    ...initialApiState,
  },
  data: [],
  loading: false,
  isPaginated: false,
};

const reducer = (state: any, action: ReduxAction) => {
  switch (action.type) {
    case FETCH_MOVIES_SUCCESS:
      return {
        ...state,
        fetchMovieApiState: {
          ...state.fetchMovieApiState,
          isSuccess: true,
        },
        loading: false,
        isPaginated: false,
        data: action.payload && action.payload.data ? action.payload.isPaginated ? [...state.data, ...action.payload.data] : action.payload.data : state.data,
      };
    case FETCH_MOVIES_ERROR:
      return {
        ...state,
        fetchMovieApiState: {
          ...state.fetchMovieApiState,
          isError: true,
          message: action.payload.message,
        },
        isPaginated: false,
        loading: false,
      };
    case FETCH_MOVIES_PROGRESS:
      return {
        ...state,
        isPaginated: action.payload.isPaginated,
        loading: !action.payload.isPaginated,
      };
    case FETCH_MOVIES_CLEAR_API_STATE:
      return {
        ...state,
        fetchMovieApiState: {
          ...initialApiState,
        },
      };
    default:
      return state;
  }
};

const useMovies = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { getItem, setItem } = useAsyncStorage('movies');

  const fetchMoviesAction = async () => {
    dispatch({ type: FETCH_MOVIES_PROGRESS, payload: {} });
    const movies = await getItem();
    if (movies) {
      dispatch({ type: FETCH_MOVIES_SUCCESS, payload: { data: JSON.parse(movies), isPaginated: false } });
    } else {
      fetchMoviesFromRemote(
        20,
        false,
        Math.floor(Math.random() * 10000),
        Math.floor(Math.random() * 20),
      );
    }
  };

  const fetchMoviesFromRemote = (
    noOfMovies: number,
    isPaginated = false,
    noOfReviews = Math.floor(Math.random() * 10000),
    noOfCastMembers = Math.floor(Math.random() * 20)
  ) => {
    dispatch({ type: FETCH_MOVIES_PROGRESS, payload: { isPaginated } });
    fetchMovies({
      noOfMovies,
      noOfReviews,
      noOfCastMembers,
    })
      .then(async (data) => {
        dispatch({ type: FETCH_MOVIES_SUCCESS, payload: { data, isPaginated } });
        await setItem(JSON.stringify(state.data.concat(data)));
      })
      .catch(e => dispatch({ type: FETCH_MOVIES_ERROR, payload: { message: e } }));
  };

  return {
    state,
    fetchMoviesAction,
    fetchMoviesFromRemote,
  };
};

export const Context = React.createContext({
  state: initialState,
  fetchMoviesAction: () => { },
  fetchMoviesFromRemote: (noOfMovies: number, isPaginated = false) => { },
});

export const Provider = (props: any) => {
  const movies = useMovies();

  return (
    <Context.Provider
      value={movies}
      {...props}
    />
  );
};
