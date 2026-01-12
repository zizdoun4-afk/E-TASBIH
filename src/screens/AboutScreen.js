import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import Constants from 'expo-constants';
import pkg from '../../package.json';

export default function AboutScreen() {
    const { t } = useTranslation();
    const { theme } = useSettings();

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const libraries = [
        "React Native",
        "Expo",
        "React Navigation",
        "i18next",
        "AsyncStorage",
        "Expo Haptics",
        "Expo Notifications"
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                         {/* Placeholder for App Icon if available, or just text */}
                        <Text style={[styles.iconText, { color: theme.colors.primary }]}>📿</Text>
                    </View>
                    <Text style={[styles.appName, { color: theme.colors.text }]}>{t('appName')}</Text>
                    <Text style={[styles.version, { color: theme.colors.textSecondary }]}>v{pkg.version}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('about')}</Text>
                    <Text style={[styles.description, { color: theme.colors.text }]}>
                        {t('openSource')}
                    </Text>
                    
                    <TouchableOpacity 
                        style={[styles.githubBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => openLink('https://github.com/')} // Placeholder or specific link if known
                    >
                        <Text style={styles.githubBtnText}>{t('viewOnGithub')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('libraries')}</Text>
                    <View style={styles.libsContainer}>
                        {libraries.map((lib, index) => (
                            <View key={index} style={[styles.libBadge, { borderColor: theme.colors.border }]}>
                                <Text style={[styles.libText, { color: theme.colors.textSecondary }]}>{lib}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconText: {
        fontSize: 40,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    version: {
        fontSize: 16,
    },
    section: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'left' // Will flip with I18nManager if we use it, otherwise hard to handle mixed
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
    },
    githubBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    githubBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    libsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    libBadge: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    libText: {
        fontSize: 14,
    },
});
