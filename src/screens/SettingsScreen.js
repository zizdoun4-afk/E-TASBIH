import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const [morningTime, setMorningTime] = useState(new Date());
    const [eveningTime, setEveningTime] = useState(new Date());
    const [morningEnabled, setMorningEnabled] = useState(false);
    const [eveningEnabled, setEveningEnabled] = useState(false);
    const [showMorningPicker, setShowMorningPicker] = useState(false);
    const [showEveningPicker, setShowEveningPicker] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
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

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('morningTime', morningTime.toISOString());
            await AsyncStorage.setItem('eveningTime', eveningTime.toISOString());
            await AsyncStorage.setItem('morningEnabled', JSON.stringify(morningEnabled));
            await AsyncStorage.setItem('eveningEnabled', JSON.stringify(eveningEnabled));

            // Schedule Notifications
            await scheduleNotification('Morning', morningTime, morningEnabled);
            await scheduleNotification('Evening', eveningTime, eveningEnabled);

            Alert.alert('تم الحفظ', 'تم تحديث إعدادات التنبيهات بنجاح');
        } catch (error) {
            Alert.alert('خطأ', 'فشل حفظ الإعدادات');
        }
    };

    const scheduleNotification = async (type, time, enabled) => {
        if (!enabled) return;

        // Verify Permissions first
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert('تنبيه', 'يجب تفعيل الإشعارات لتلقي التذكيرات');
                return;
            }
        }

        const trigger = {
            hour: time.getHours(),
            minute: time.getMinutes(),
            repeats: true,
        };

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: type === 'Morning' ? 'أذكار الصباح' : 'أذكار المساء',
                    body: 'حان الآن موعد الأذكار',
                    data: { screen: 'DhikrViewer' },
                },
                trigger,
            });
        } catch (e) {
            console.log("Notification Schedule Error (likely Expo Go restriction):", e);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>تنبيهات الأذكار</Text>

                {/* Morning */}
                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>أذكار الصباح</Text>
                        {morningEnabled && (
                            <TouchableOpacity onPress={() => setShowMorningPicker(true)}>
                                <Text style={styles.timeText}>
                                    {morningTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Switch
                        value={morningEnabled}
                        onValueChange={setMorningEnabled}
                        trackColor={{ false: "#767577", true: "#10B981" }}
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
                        <Text style={styles.label}>أذكار المساء</Text>
                        {eveningEnabled && (
                            <TouchableOpacity onPress={() => setShowEveningPicker(true)}>
                                <Text style={styles.timeText}>
                                    {eveningTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Switch
                        value={eveningEnabled}
                        onValueChange={setEveningEnabled}
                        trackColor={{ false: "#767577", true: "#10B981" }}
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
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveSettings}>
                <Text style={styles.saveBtnText}>حفظ الإعدادات</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
    },
    section: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#10B981',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'right',
    },
    row: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'flex-end',
    },
    label: {
        color: '#F8FAFC',
        fontSize: 16,
        marginBottom: 5,
    },
    timeText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    saveBtn: {
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
