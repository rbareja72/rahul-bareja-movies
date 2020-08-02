/* eslint-disable prettier/prettier */
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, FlatList, InteractionManager } from 'react-native';
import { useValue } from 'react-native-redash';

import Modal from '@components/Modal';
import Movie from '@components/Movie';

import type MovieType from '@app/types/Movie';
import type PositionType from '@app/types/Position';

interface ModalState {
    movie: MovieType;
    position: PositionType;
}

type StartParamList = {
    Start: {
        movies: Array<MovieType>;
    };
};

type StartRoute = RouteProp<StartParamList, 'Start'>;

const Start = () => {
    const route = useRoute<StartRoute>();
    const { movies } = route.params;
    const activeMovieId = useValue<number>(-1);
    const [modal, setModal] = useState<ModalState | null>(null);

    const open = (index: number, movie: MovieType, position: PositionType) => {
        activeMovieId.setValue(index);
        setModal({ movie, position });
    };

    const close = () => {
        InteractionManager.runAfterInteractions(() => {
            activeMovieId.setValue(-1);
            setModal(null);
        });
    };

    const renderMovie = ({ item: movie, index }: { item: MovieType, index: number }) => {
        return (
            <Movie
                activeMovieId={activeMovieId}
                key={movie.id}
                index={index}
                movie={movie}
                open={open}
            />
        );
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                {/* Change: change to flat list from map */}
                <FlatList
                    data={movies}
                    renderItem={renderMovie}
                    keyExtractor={(item: MovieType) => item.id}
                    maxToRenderPerBatch={3}
                    contentInsetAdjustmentBehavior="automatic"
                //  getItemLayout={(data, index) => ({length: number, offset: number, index: number})}
                />
                {modal !== null && <Modal {...modal} close={close} />}
            </SafeAreaView>
        </>
    );
};

export default Start;
