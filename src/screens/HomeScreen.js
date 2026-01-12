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
            
            {/* Daily Effort Card */}
            <View style={[styles.dailyEffortCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection }]}>
                <View>
                    <Text style={[styles.dailyEffortValue, { color: theme.colors.primary, textShadowColor: theme.colors.primary }]}>
                        {dailyTotal}
                    </Text>
                    <Text style={[styles.dailyEffortSub, { color: theme.colors.textSecondary }]}>{t('tasbeeh', {defaultValue: 'Tasbeeh'})}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                     <Text style={[styles.dailyEffortLabel, { color: theme.colors.textSecondary }]}>
                        {t('count', {defaultValue: 'Count'})}
                     </Text>
                </View>
            </View>

            {/* Daily Azkar Button */}
            <TouchableOpacity
                style={[styles.azkarBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary, flexDirection }]}
                onPress={() => navigation.navigate('DhikrViewer')}
            >
                <Text style={[styles.azkarBtnText, { color: theme.colors.primary }]}>{t('viewAll', {defaultValue: 'Azkar'})}</Text>
            </TouchableOpacity>

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
                                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                                        isSelected && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
                                    ]}
                                    onPress={() => handlePressDhikr(item)}
                                >
                                    {isSelected && <View style={[styles.indicator, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]} />}
                                    <Text style={[
                                        styles.cardText, 
                                        { color: theme.colors.text },
                                        isSelected && { fontWeight: 'bold' }
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
        justifyContent: 'center',
        gap: 15,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
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
    azkarBtn: {
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    azkarBtnText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
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
        borderWidth: 1,
        elevation: 2,
    },
    indicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
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