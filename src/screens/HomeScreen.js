import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDhikr } from '../context/DhikrContext';
import { DHIKR_PRESETS } from '../data/dhikrPresets';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomCountModal from '../components/CustomCountModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const {
        startNewSession, // Import new function
        dailyDhikrQueue,
        setTargetCount,
        targetCount,
        resetQueue,
        dailyTotal
    } = useDhikr();
    const navigation = useNavigation();

    const [showCustomModal, setShowCustomModal] = useState(false);
    // Track selected Dhikr IDs (Multi-Select)
    const [selectedDhikrIds, setSelectedDhikrIds] = useState([]);

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
            // Use atomic update to avoid race conditions
            startNewSession(selectedItems);
            navigation.navigate('Tasbeeh');
        } else if (dailyDhikrQueue.length > 0) {
            // Resume functionality
            navigation.navigate('Tasbeeh');
        }
    };

    const handleCustomCountConfirm = (val) => {
        setTargetCount(val);
        setShowCustomModal(false);
    };

    const Counts = [33, 100, 1000];

    return (
        <SafeAreaView style={styles.container}>
            {/* Daily Effort Card - Reduced height */}
            <View style={styles.dailyEffortCard}>
                <Text style={styles.dailyEffortLabel}>جهد اليوم</Text>
                <Text style={styles.dailyEffortValue}>{dailyTotal}</Text>
                <Text style={styles.dailyEffortSub}>تسبيحة</Text>
            </View>

            {/* Daily Azkar Button - Reduced margin */}
            <TouchableOpacity
                style={styles.azkarBtn}
                onPress={() => navigation.navigate('DhikrViewer')}
            >
                <Text style={styles.azkarBtnText}>أذكار الصباح والمساء</Text>
            </TouchableOpacity>

            {/* Header - Removed margin */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>المسبحة الإلكترونية</Text>
            </View>

            {/* Main Content Area - Flexible to take up remaining space */}
            <View style={styles.contentArea}>
                {/* Count Selector */}
                <View style={styles.countSelectorContainer}>
                    <Text style={styles.sectionTitle}>عدد التكرار:</Text>
                    <View style={styles.countButtons}>
                        {Counts.map((count) => (
                            <TouchableOpacity
                                key={count}
                                style={[styles.countBtn, targetCount === count && styles.countBtnActive]}
                                onPress={() => setTargetCount(count)}
                            >
                                <Text style={[styles.countBtnText, targetCount === count && styles.countBtnTextActive]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.countBtn, ![33, 100, 1000].includes(targetCount) && styles.countBtnActive]}
                            onPress={() => setShowCustomModal(true)}
                        >
                            <Text style={[styles.countBtnText, ![33, 100, 1000].includes(targetCount) && styles.countBtnTextActive]}>
                                {![33, 100, 1000].includes(targetCount) ? targetCount : 'مخصص'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dhikr Grid - 9 items (3x3) */}
                <View style={styles.gridContainer}>
                    <View style={styles.grid}>
                        {DHIKR_PRESETS.map((item) => {
                            const isSelected = selectedDhikrIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    onPress={() => handlePressDhikr(item)}
                                >
                                    {isSelected && <View style={styles.indicator} />}
                                    <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>{item.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Start Button - Fixed at bottom of safe area */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.startBtn, selectedDhikrIds.length === 0 && dailyDhikrQueue.length === 0 && styles.startBtnDisabled]}
                    onPress={startSession}
                    disabled={selectedDhikrIds.length === 0 && dailyDhikrQueue.length === 0}
                >
                    <Text style={styles.startBtnText}>
                        {selectedDhikrIds.length > 0 ? `ابدأ (${selectedDhikrIds.length})` : 'ابدأ'}
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
        backgroundColor: '#020617', // Slate 950
        padding: 16, // Reduced padding
    },
    // Flex container to hold Grid and Selector
    contentArea: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        gap: 10,
    },
    dailyEffortCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        paddingVertical: 15, // Reduced
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10, // Reduced margin
        borderWidth: 1,
        borderColor: '#334155',
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: 15,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    dailyEffortLabel: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    dailyEffortValue: {
        color: '#34D399',
        fontSize: 28, // Slightly smaller
        fontWeight: '800',
        textShadowColor: 'rgba(16, 185, 129, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    dailyEffortSub: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 10,
        fontWeight: '500',
    },
    azkarBtn: {
        backgroundColor: '#0F172A',
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#10B981',
        flexDirection: 'row-reverse',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    azkarBtnText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#F1F5F9',
        letterSpacing: 0.5,
    },
    countSelectorContainer: {
        marginBottom: 5,
        backgroundColor: '#1E293B',
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    sectionTitle: {
        color: '#CBD5E1',
        marginBottom: 8,
        textAlign: 'right',
        fontSize: 12,
        fontWeight: '600',
    },
    countButtons: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    countBtn: {
        backgroundColor: '#334155',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        minWidth: 55,
        alignItems: 'center',
    },
    countBtnActive: {
        backgroundColor: '#10B981',
        borderColor: '#059669',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    countBtnText: {
        color: '#F8FAFC',
        fontWeight: '600',
        fontSize: 12,
    },
    countBtnTextActive: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    gridContainer: {
        marginBottom: 5,
        flexShrink: 1,
    },
    grid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 8,
    },
    card: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: '#1E293B',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardSelected: {
        borderColor: '#10B981',
        backgroundColor: '#064E3B',
        borderWidth: 1.5,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    indicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34D399',
        shadowColor: '#34D399',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    cardText: {
        color: '#E2E8F0',
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    },
    cardTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    footer: {
        marginTop: 5,
    },
    startBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 14, // Reduced
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    startBtnDisabled: {
        backgroundColor: '#334155',
        shadowOpacity: 0,
        elevation: 0,
    },
    startBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
