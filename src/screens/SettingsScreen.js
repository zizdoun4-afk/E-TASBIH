import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, Alert, ScrollView, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings, THEME_COLORS } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const { 
        theme, 
        language, 
        changeLanguage, 
        isDarkMode, 
        toggleTheme, 
        primaryColor, 
        changePrimaryColor, 
        hapticsEnabled, 
        toggleHaptics 
    } = useSettings();
    
    const { t } = useTranslation();
    const navigation = useNavigation();

    // Notification State
    const [morningTime, setMorningTime] = useState(new Date());
    const [eveningTime, setEveningTime] = useState(new Date());
    const [morningEnabled, setMorningEnabled] = useState(false);
    const [eveningEnabled, setEveningEnabled] = useState(false);
    const [showMorningPicker, setShowMorningPicker] = useState(false);
    const [showEveningPicker, setShowEveningPicker] = useState(false);
    
    // Language Modal State
    const [langModalVisible, setLangModalVisible] = useState(false);

    const LANGUAGES = [
        { code: 'ar', label: 'العربية' },
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'es', label: 'Español' },
        { code: 'zgh', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'zh', label: '中文' },
    ];

    useEffect(() => {
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        try {
            const storedMorningTime = await AsyncStorage.getItem('morningTime');
            const storedEveningTime = await AsyncStorage.getItem('eveningTime');
            const storedMorningEnabled = await AsyncStorage.getItem('morningEnabled');
            const storedEveningEnabled = await AsyncStorage.getItem('eveningEnabled');

            if (storedMorningTime) setMorningTime(new Date(storedMorningTime));
            if (storedEveningTime) setEveningTime(new Date(storedEveningTime));
            if (storedMorningEnabled) setMorningEnabled(JSON.parse(storedMorningEnabled));
            if (storedEveningEnabled) setEveningEnabled(JSON.parse(storedEveningEnabled));
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const saveNotificationSettings = async () => {
        try {
            await AsyncStorage.setItem('morningTime', morningTime.toISOString());
            await AsyncStorage.setItem('eveningTime', eveningTime.toISOString());
            await AsyncStorage.setItem('morningEnabled', JSON.stringify(morningEnabled));
            await AsyncStorage.setItem('eveningEnabled', JSON.stringify(eveningEnabled));

            await scheduleNotification('Morning', morningTime, morningEnabled);
            await scheduleNotification('Evening', eveningTime, eveningEnabled);

            Alert.alert(t('saved'), t('savedMsg'));
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const scheduleNotification = async (type, time, enabled) => {
        if (!enabled) return;
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') return;
        }

        const trigger = {
            hour: time.getHours(),
            minute: time.getMinutes(),
            repeats: true,
        };

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: type === 'Morning' ? t('morningAzkar') : t('eveningAzkar'),
                    body: t('appName'),
                    data: { screen: 'DhikrViewer' },
                },
                trigger,
            });
        } catch (e) {
            console.log("Notification Schedule Error:", e);
        }
    };

    const handleTimeChange = (event, selectedDate, type) => {
        const currentDate = selectedDate || (type === 'morning' ? morningTime : eveningTime);
        if (type === 'morning') {
            setShowMorningPicker(Platform.OS === 'ios');
            setMorningTime(currentDate);
        } else {
            setShowEveningPicker(Platform.OS === 'ios');
            setEveningTime(currentDate);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Language Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('language')}</Text>
                    <TouchableOpacity 
                        style={[styles.rowBtn, { borderBottomColor: theme.colors.border }]}
                        onPress={() => setLangModalVisible(true)}
                    >
                        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>
                            {LANGUAGES.find(l => l.code === language)?.label || language}
                        </Text>
                        <Text style={{color: theme.colors.textSecondary}}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Theme Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('theme')}</Text>
                    
                    {/* Dark Mode Toggle */}
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>
                            {isDarkMode ? t('darkMode') : t('lightMode')}
                        </Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    {/* Color Picker */}
                    <Text style={[styles.subLabel, { color: theme.colors.textSecondary }]}>{t('colors')}</Text>
                    <View style={styles.colorContainer}>
                        {THEME_COLORS.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.colorCircle, 
                                    { backgroundColor: color },
                                    primaryColor === color && { borderWidth: 3, borderColor: theme.colors.text }
                                ]}
                                onPress={() => changePrimaryColor(color)}
                            />
                        ))}
                    </View>
                </View>

                {/* Haptics Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('haptics')}</Text>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>{t('enableHaptics')}</Text>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={toggleHaptics}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                        />
                    </View>
                </View>

                {/* Notifications Section (Existing Logic) */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('notifications')}</Text>
                    
                    {/* Morning */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>{t('morningAzkar')}</Text>
                            {morningEnabled && (
                                <TouchableOpacity onPress={() => setShowMorningPicker(true)}>
                                    <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                                        {morningTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Switch
                            value={morningEnabled}
                            onValueChange={setMorningEnabled}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                        />
                    </View>
                    {showMorningPicker && (
                        <DateTimePicker
                            value={morningTime}
                            mode="time"
                            display="default"
                            onChange={(e, d) => handleTimeChange(e, d, 'morning')}
                        />
                    )}

                    {/* Evening */}
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>{t('eveningAzkar')}</Text>
                            {eveningEnabled && (
                                <TouchableOpacity onPress={() => setShowEveningPicker(true)}>
                                    <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                                        {eveningTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Switch
                            value={eveningEnabled}
                            onValueChange={setEveningEnabled}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                        />
                    </View>
                    {showEveningPicker && (
                        <DateTimePicker
                            value={eveningTime}
                            mode="time"
                            display="default"
                            onChange={(e, d) => handleTimeChange(e, d, 'evening')}
                        />
                    )}

                    <TouchableOpacity 
                        style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]} 
                        onPress={saveNotificationSettings}
                    >
                        <Text style={styles.saveBtnText}>{t('saveSettings')}</Text>
                    </TouchableOpacity>
                </View>

                {/* About Link */}
                <TouchableOpacity 
                    style={[styles.linkBtn, { backgroundColor: theme.colors.surface }]}
                    onPress={() => navigation.navigate('About')}
                >
                    <Text style={[styles.linkBtnText, { color: theme.colors.text }]}>{t('about')}</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Language Selection Modal */}
            <Modal
                transparent={true}
                visible={langModalVisible}
                onRequestClose={() => setLangModalVisible(false)}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('language')}</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={item => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.langItem, 
                                        { borderBottomColor: theme.colors.border },
                                        language === item.code && { backgroundColor: theme.colors.background }
                                    ]}
                                    onPress={() => {
                                        changeLanguage(item.code);
                                        setLangModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.langText, { color: theme.colors.text }]}>{item.label}</Text>
                                    {language === item.code && <Text style={{ color: theme.colors.primary }}>✓</Text>}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity 
                            style={[styles.closeBtn, { backgroundColor: theme.colors.border }]}
                            onPress={() => setLangModalVisible(false)}
                        >
                            <Text style={{ color: theme.colors.text }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    section: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    textContainer: {
        // alignItems: 'flex-start',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    timeText: {
        fontSize: 14,
    },
    subLabel: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8,
        elevation: 2,
    },
    saveBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    linkBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rowBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    rowLabel: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    langItem: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    langText: {
        fontSize: 16,
    },
    closeBtn: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
});