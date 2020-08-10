import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

import type MovieType from '@app/types/Movie';

interface PosterProps {
    movie: MovieType;
    borderRadius?: Animated.Value<number>;
}

const Poster = ({ borderRadius, movie }: PosterProps) => {
    const [loading, setLoading] = React.useState(false);
    return (
        <>
            <AnimatedFastImage
                source={{ uri: movie.poster }}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                style={[styles.image, { borderRadius: borderRadius || 8 }]}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{movie.name}</Text>
                <Text style={styles.reviews}>{`Reviews: ${
                    movie.reviews?.length || 0
                    }`}</Text>
            </View>
            {loading && <ActivityIndicator />}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingTop: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '100%',
    },
    name: {
        color: 'white',
        fontSize: 34,
        lineHeight: 41,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: {
            width: 1,
            height: 2,
        },
        textShadowRadius: 2,
        flex: 1,
    },
    reviews: {
        color: 'white',
        fontSize: 18,
        textShadowColor: '#000',
        textShadowOffset: {
            width: 1,
            height: 2,
        },
        textShadowRadius: 2,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },
});

export default Poster;
