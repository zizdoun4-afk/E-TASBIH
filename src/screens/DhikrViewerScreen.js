import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDhikr } from '../context/DhikrContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import AddDhikrModal from '../components/AddDhikrModal';

export default function DhikrViewerScreen() {
    const [activeTab, setActiveTab] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const { morningAzkar, eveningAzkar, addCustomAzkar } = useDhikr();
    const { theme, language } = useSettings();
    const { t } = useTranslation();

    const data = activeTab === 'morning' ? morningAzkar : eveningAzkar;
    const isRTL = language === 'ar';
    const flexDirection = isRTL ? 'row-reverse' : 'row';
    const textAlign = isRTL ? 'right' : 'left';

    const handleAddConfirm = (text, count) => {
        addCustomAzkar(activeTab, text, count);
        setShowAddModal(false);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.primary, textAlign }]}>{item.text}</Text>
            {item.arabic && item.arabic !== item.text && (
                <Text style={[styles.cardArabic, { color: theme.colors.text, textAlign }]}>{item.arabic}</Text>
            )}
            <View style={[styles.badge, { backgroundColor: theme.colors.border, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>{t('count')}: {item.count}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
            {/* Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface, flexDirection }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'morning' && { backgroundColor: theme.colors.border }
                    ]}
                    onPress={() => setActiveTab('morning')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: theme.colors.textSecondary },
                        activeTab === 'morning' && { color: theme.colors.primary, fontWeight: 'bold' }
                    ]}>{t('morningAzkar')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'evening' && { backgroundColor: theme.colors.border }
                    ]}
                    onPress={() => setActiveTab('evening')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: theme.colors.textSecondary },
                        activeTab === 'evening' && { color: theme.colors.primary, fontWeight: 'bold' }
                    ]}>{t('eveningAzkar')}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[
                    styles.fab,
                    { backgroundColor: theme.colors.primary },
                    isRTL ? { left: 20 } : { right: 20 }
                ]}
                onPress={() => setShowAddModal(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <AddDhikrModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onConfirm={handleAddConfirm}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        padding: 10,
        justifyContent: 'center',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabText: {
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 120,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardArabic: {
        fontSize: 16,
        lineHeight: 28,
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 80,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
    },
    fabText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -2,
    }
});