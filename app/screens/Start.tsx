import { RouteProp } from '@react-navigation/native';
import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar, FlatList, InteractionManager, ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native';
import { useValue } from 'react-native-redash';

import Modal from '@components/Modal';
import Movie from '@components/Movie';

import type MovieType from '@app/types/Movie';
import type PositionType from '@app/types/Position';
import { Movies } from 'app/providers';

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
    const movies = useContext(Movies.Context);
    const { loading, data, isPaginated } = movies.state;
    const activeMovieId = useValue<number>(-1);
    const [modal, setModal] = useState<ModalState | null>(null);

    useEffect(() => {
        movies.fetchMoviesAction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    if (loading) {
        return (
            <View style={[styles.center, styles.flex]}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    const onEndReached = () => {
        if (!loading && !isPaginated) {
            movies.fetchMoviesFromRemote(
                10,
                true,
            );
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                {/* Change: change to flat list from map */}
                <FlatList
                    data={data}
                    renderItem={renderMovie}
                    keyExtractor={(item: MovieType) => item.id}
                    contentInsetAdjustmentBehavior="automatic"
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.1}
                    windowSize={101}
                    ListFooterComponent={() => (
                        <View style={styles.center}>
                            <ActivityIndicator size={'small'} />
                        </View>
                    )}
                    getItemLayout={(moviesData, index) => {
                        const { height } = Dimensions.get('window');
                        return { length: height, offset: index * height, index };
                    }}
                />
                {modal !== null && <Modal {...modal} close={close} />}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Start;
