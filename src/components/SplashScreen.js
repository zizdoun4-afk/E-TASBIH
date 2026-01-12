import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { getRandomVerse } from '../utils/quranUtils';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish, verseData }) {
    const [verse, setVerse] = useState(verseData);
    const { t } = useTranslation();
    const { theme } = useSettings();

    useEffect(() => {
        if (verseData) {
            setVerse(verseData);
        } else if (!verse) {
            try {
                const v = getRandomVerse();
                setVerse(v);
            } catch (e) {
                setVerse({
                    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                    fullRef: "سورة الفاتحة (1)"
                });
            }
        }
    }, [verseData]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Top Section */}
            <View style={styles.topSection}>
                <Text style={[styles.verseLabel, { color: theme.colors.primary }]}>{t('verseOfDay')}</Text>
                <View style={styles.textBox}>
                    <Text style={[styles.verseText, { color: theme.colors.text }]}>
                        {verse ? verse.text : t('loading')}
                    </Text>
                    {verse && <Text style={[styles.verseRef, { color: theme.colors.textSecondary }]}>{verse.fullRef}</Text>}
                </View>
            </View>

            {/* Middle Section - Replaced Image with a Moon Icon */}
            <View style={styles.centerSection}>
                <View style={[styles.moonContainer, { borderColor: theme.colors.primary + '30' }]}>
                    <Text style={[styles.moonIcon, { color: theme.colors.primary }]}>🌙</Text>
                </View>
                <Text style={[styles.appTitle, { color: theme.colors.primary }]}>{t('appSlogan')}</Text>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <TouchableOpacity 
                    style={[styles.enterBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]} 
                    onPress={onFinish}
                >
                    <Text style={[styles.enterBtnText, { color: theme.colors.text }]}>{t('enter')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    centerSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        marginBottom: 20,
    },
    verseLabel: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    textBox: {
        minHeight: 120,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    verseText: {
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 34,
        fontWeight: '500',
    },
    verseRef: {
        fontSize: 14,
        marginTop: 10,
    },
    moonContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    moonIcon: {
        fontSize: 60,
        textAlign: 'center',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    enterBtn: {
        paddingVertical: 16,
        paddingHorizontal: 80,
        borderRadius: 30,
        borderWidth: 1,
        elevation: 5,
    },
    enterBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
