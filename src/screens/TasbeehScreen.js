import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import { useDhikr } from '../context/DhikrContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

export default function TasbeehScreen() {
    const {
        dailyDhikrQueue,
        handleTap,
        currentDhikrIndex,
        isSessionComplete,
        resetQueue
    } = useDhikr();
    
    const { theme, hapticsEnabled } = useSettings();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [scaleValue] = useState(new Animated.Value(1));

    const currentItem = dailyDhikrQueue[currentDhikrIndex];

    const onScreenTap = () => {
        if (isSessionComplete) return;

        // Haptics
        if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Animation
        scaleValue.setValue(0.92);
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 4,
            tension: 80,
            useNativeDriver: true,
        }).start();

        handleTap();
    };

    const handleFinish = () => {
        resetQueue();
        navigation.goBack();
    };

    if (isSessionComplete) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.completeText, { color: theme.colors.primary }]}>
                    {t('accepted', { defaultValue: 'تقبل الله منا ومنكم' })}
                </Text>
                <TouchableWithoutFeedback onPress={handleFinish}>
                    <View style={[styles.finishBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}>
                        <Text style={[styles.finishBtnText, { color: theme.colors.text }]}>{t('home')}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }

    if (!currentItem) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.colors.text, fontSize: 18 }}>{t('loading', {defaultValue: '...'})}</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TouchableWithoutFeedback onPress={onScreenTap}>
                <View style={styles.touchArea}>
                    <SafeAreaView style={styles.content}>

                        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>
                                {currentDhikrIndex + 1} / {dailyDhikrQueue.length}
                            </Text>
                        </View>

                        {!isSessionComplete && (
                            <Animated.View style={[styles.centerDisplay, { transform: [{ scale: scaleValue }] }]}>
                                <Text style={[styles.dhikrText, { color: theme.colors.text }]}>
                                    {currentItem.text}
                                </Text>
                                <Text style={[styles.countText, { color: theme.colors.primary, textShadowColor: theme.colors.primary }]}>
                                    {currentItem.target - currentItem.completed}
                                </Text>
                                <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>{t('remaining', {defaultValue: 'المتبقي'})}</Text>
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
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
    },
    headerText: {
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
        fontSize: 90,
        fontWeight: '900',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    subText: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
    },
    completeText: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    finishBtn: {
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        borderWidth: 1,
        elevation: 8,
    },
    finishBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});