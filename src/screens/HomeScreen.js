import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDhikr } from '../context/DhikrContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { DHIKR_PRESETS } from '../data/dhikrPresets';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomCountModal from '../components/CustomCountModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const {
        startNewSession,
        dailyDhikrQueue,
        setTargetCount,
        targetCount,
        dailyTotal
    } = useDhikr();

    const { theme, language } = useSettings();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [showCustomModal, setShowCustomModal] = useState(false);
    const [selectedDhikrIds, setSelectedDhikrIds] = useState([]);

    const isRTL = language === 'ar';
    const flexDirection = isRTL ? 'row-reverse' : 'row';
    const textAlign = isRTL ? 'right' : 'left';

    const handlePressDhikr = (item) => {
        setSelectedDhikrIds(prev => {
            if (prev.includes(item.id)) {
                return prev.filter(id => id !== item.id);
            } else {
                return [...prev, item.id];
            }
        });
    };

    const startSession = () => {
        const selectedItems = DHIKR_PRESETS.filter(item => selectedDhikrIds.includes(item.id));

        if (selectedItems.length > 0) {
            startNewSession(selectedItems);
            navigation.navigate('Tasbeeh');
        } else if (dailyDhikrQueue.length > 0) {
            navigation.navigate('Tasbeeh');
        }
    };

    const handleCustomCountConfirm = (val) => {
        setTargetCount(val);
        setShowCustomModal(false);
    };

    const Counts = [33, 100, 1000];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Top Header */}
            <View style={[styles.topHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: theme.colors.surface }]}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={{ fontSize: 22 }}>⚙️</Text>
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('appName')}</Text>

                {/* Spacer to balance the header if needed, or another icon */}
                <View style={{ width: 40 }} />
            </View>

            {/* Daily Effort Card */}
            <View style={[styles.dailyEffortCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection }]}>
                {/* Left Side: Stats */}
                <View style={{ flex: 1 }}>
                    <Text style={[styles.dailyEffortValue, { color: theme.colors.primary, textShadowColor: theme.colors.primary, textAlign }]}>
                        {dailyTotal}
                    </Text>
                    <Text style={[styles.dailyEffortSub, { color: theme.colors.textSecondary, textAlign }]}>{t('tasbeeh', { defaultValue: 'Tasbeeh' })}</Text>
                </View>

                {/* Right Side: Azkar Shortcut Icon */}
                <TouchableOpacity
                    style={[styles.miniAzkarBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('DhikrViewer')}
                >
                    <Text style={{ fontSize: 20 }}>📖</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentArea}>
                {/* Count Selector */}
                <View style={[styles.countSelectorContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, textAlign }]}>{t('target')}:</Text>
                    <View style={[styles.countButtons, { flexDirection }]}>
                        {Counts.map((count) => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.countBtn,
                                    { backgroundColor: theme.colors.border },
                                    targetCount === count && { backgroundColor: theme.colors.primary }
                                ]}
                                onPress={() => setTargetCount(count)}
                            >
                                <Text style={[
                                    styles.countBtnText,
                                    { color: theme.colors.text },
                                    targetCount === count && { color: '#FFFFFF' }
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.countBtn,
                                { backgroundColor: theme.colors.border },
                                ![33, 100, 1000].includes(targetCount) && { backgroundColor: theme.colors.primary }
                            ]}
                            onPress={() => setShowCustomModal(true)}
                        >
                            <Text style={[
                                styles.countBtnText,
                                { color: theme.colors.text },
                                ![33, 100, 1000].includes(targetCount) && { color: '#FFFFFF' }
                            ]}>
                                {![33, 100, 1000].includes(targetCount) ? targetCount : '+'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dhikr Grid */}
                <View style={styles.gridContainer}>
                    <View style={[styles.grid, { flexDirection }]}>
                        {DHIKR_PRESETS.map((item) => {
                            const isSelected = selectedDhikrIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.card,
                                        { backgroundColor: isSelected ? theme.colors.primary + '15' : theme.colors.surface },
                                    ]}
                                    onPress={() => handlePressDhikr(item)}
                                >
                                    {isSelected && (
                                        <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]}>
                                            <Text style={styles.indicatorText}>✓</Text>
                                        </View>
                                    )}
                                    <Text style={[
                                        styles.cardText,
                                        { color: isSelected ? theme.colors.primary : theme.colors.text },
                                        isSelected && { fontWeight: '800' }
                                    ]}>{item.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Start Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.startBtn,
                        { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary },
                        selectedDhikrIds.length === 0 && dailyDhikrQueue.length === 0 && { backgroundColor: theme.colors.border, shadowOpacity: 0 }
                    ]}
                    onPress={startSession}
                    disabled={selectedDhikrIds.length === 0 && dailyDhikrQueue.length === 0}
                >
                    <Text style={styles.startBtnText}>
                        {selectedDhikrIds.length > 0 ? `${t('start')} (${selectedDhikrIds.length})` : t('start')}
                    </Text>
                </TouchableOpacity>
            </View>

            <CustomCountModal
                visible={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                onConfirm={handleCustomCountConfirm}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
        gap: 10,
    },
    dailyEffortCard: {
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        justifyContent: 'space-between',
    },
    dailyEffortLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    dailyEffortValue: {
        fontSize: 28,
        fontWeight: '800',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    dailyEffortSub: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '500',
    },
    miniAzkarBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        elevation: 3,
    },
    countSelectorContainer: {
        marginBottom: 5,
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
    },
    sectionTitle: {
        marginBottom: 8,
        fontSize: 12,
        fontWeight: '600',
    },
    countButtons: {
        justifyContent: 'space-between',
    },
    countBtn: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        minWidth: 55,
        alignItems: 'center',
    },
    countBtnText: {
        fontWeight: '600',
        fontSize: 12,
    },
    gridContainer: {
        marginBottom: 5,
        flexShrink: 1,
    },
    grid: {
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 8,
    },
    card: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    indicator: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    indicatorText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardText: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    },
    footer: {
        marginTop: 5,
    },
    startBtn: {
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    startBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
