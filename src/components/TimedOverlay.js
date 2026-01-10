import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { QURANIC_VERSES } from '../data/dhikrPresets';

const { width, height } = Dimensions.get('window');

export default function TimedOverlay({ onDismiss }) {
    const [verse, setVerse] = useState('');
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Pick random verse
        const randomIndex = Math.floor(Math.random() * QURANIC_VERSES.length);
        setVerse(QURANIC_VERSES[randomIndex]);

        // Fade In
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Auto dismiss after 6 seconds
        const timer = setTimeout(() => {
            handleDismiss();
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    };

    return (
        <View style={styles.overlayContainer} pointerEvents="box-none">
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                <Text style={styles.verseText}>{verse}</Text>
                <TouchableOpacity onPress={handleDismiss}>
                    <Text style={styles.closeText}>اضغط للإخفاء</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent background
        zIndex: 1000,
    },
    card: {
        width: width * 0.85,
        padding: 24,
        backgroundColor: '#1E293B',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    verseText: {
        color: '#F8FAFC',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 28,
    },
    closeText: {
        color: '#94A3B8',
        fontSize: 12,
    },
});
