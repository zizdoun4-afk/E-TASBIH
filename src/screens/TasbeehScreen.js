import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import { useDhikr } from '../context/DhikrContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimedOverlay from '../components/TimedOverlay';

const { width, height } = Dimensions.get('window');

export default function TasbeehScreen() {
    const {
        dailyDhikrQueue,
        handleTap,
        currentDhikrIndex,
        isSessionComplete,
        resetQueue
    } = useDhikr();
    const navigation = useNavigation();
    const [scaleValue] = useState(new Animated.Value(1));
    const [showOverlay, setShowOverlay] = useState(false);

    const currentItem = dailyDhikrQueue[currentDhikrIndex];

    const onScreenTap = () => {
        if (isSessionComplete) return;

        // Gemini Pulse: Spring animation for tactile feel
        scaleValue.setValue(0.92); // Shrink immediately
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 4,  // Low friction = more bounce
            tension: 80,  // High tension = faster snap
            useNativeDriver: true,
        }).start();

        handleTap();
    };

    const handleFinish = () => {
        resetQueue();
        navigation.goBack();
    };

    // Simplified completion logic: No overlay, just show completion screen immediately
    if (isSessionComplete) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.completeText}>تقبل الله منا ومنكم</Text>
                <TouchableWithoutFeedback onPress={handleFinish}>
                    <View style={styles.finishBtn}>
                        <Text style={styles.finishBtnText}>العودة للرئيسية</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    if (!currentItem) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>جاري بدء الجلسة...</Text>
                <Text style={{ color: '#94A3B8', fontSize: 14, marginTop: 10 }}>
                    {dailyDhikrQueue.length} أذكار مختارة
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={onScreenTap}>
                <View style={styles.touchArea}>
                    <SafeAreaView style={styles.content}>

                        {/* Progress Visuals (Optional - simplified for now) */}
                        <View style={styles.header}>
                            <Text style={styles.headerText}>
                                الذكر {currentDhikrIndex + 1} من {dailyDhikrQueue.length}
                            </Text>
                        </View>

                        {/* Main Dhikr Display */}
                        {!isSessionComplete && (
                            <Animated.View style={[styles.centerDisplay, { transform: [{ scale: scaleValue }] }]}>
                                <Text style={styles.dhikrText}>{currentItem.text}</Text>
                                <Text style={styles.countText}>
                                    {currentItem.target - currentItem.completed}
                                </Text>
                                <Text style={styles.subText}>المتبقي</Text>
                            </Animated.View>
                        )}

                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Slate 950
    },
    touchArea: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 25,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: '#1E293B',
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#334155',
    },
    headerText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    centerDisplay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dhikrText: {
        color: '#F1F5F9', // Slate 100
        fontSize: 34,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 50,
        lineHeight: 50,
        textShadowColor: 'rgba(0,0,0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    countText: {
        color: '#34D399', // Emerald 400
        fontSize: 90,
        fontWeight: '900',
        textShadowColor: 'rgba(16, 185, 129, 0.4)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    subText: {
        color: '#64748B', // Slate 500
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
    },
    completeText: {
        color: '#34D399',
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 40,
        textAlign: 'center',
        marginTop: 200, // Rough centering
        textShadowColor: 'rgba(52, 211, 153, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    finishBtn: {
        backgroundColor: '#1E293B',
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    finishBtnText: {
        color: '#F8FAFC',
        fontSize: 20,
        fontWeight: 'bold',
    }
});
