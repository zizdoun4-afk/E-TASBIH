import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { getRandomVerse } from '../utils/quranUtils';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish, verseData }) {
    // verseData is passed from App.js to ensure stability
    const [verse, setVerse] = useState(verseData);

    useEffect(() => {
        // If verseData wasn't ready when mounted (unlikely), set it when it updates
        if (verseData) {
            setVerse(verseData);
        } else if (!verse) {
            // Fallback fetch if prop is missing
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
        <View style={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>
                <Text style={styles.verseLabel}>آية اليوم</Text>
                <View style={styles.textBox}>
                    <Text style={styles.verseText}>
                        {verse ? verse.text : "جاري التحميل..."}
                    </Text>
                    {verse && <Text style={styles.verseRef}>{verse.fullRef}</Text>}
                </View>
            </View>

            {/* Middle Section */}
            <View style={styles.centerSection}>
                <Image
                    source={require('../../assets/tasbih_theme.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.appTitle}>اذكر الله يذكرك</Text>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.enterBtn} onPress={onFinish}>
                    <Text style={styles.enterBtnText}>دخول</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
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
        color: '#10B981',
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    textBox: {
        minHeight: 100, // Reserve space to prevent layout jump
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    verseText: {
        color: '#F8FAFC',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 34,
        fontWeight: '500',
    },
    verseRef: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 10,
    },
    image: {
        width: width * 0.45,
        height: width * 0.45,
        marginBottom: 15,
    },
    appTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#10B981',
    },
    enterBtn: {
        backgroundColor: '#1E293B',
        paddingVertical: 16,
        paddingHorizontal: 80,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#10B981',
        elevation: 5,
    },
    enterBtnText: {
        color: '#F8FAFC',
        fontSize: 20,
        fontWeight: 'bold',
    }
});
