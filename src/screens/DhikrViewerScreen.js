import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDhikr } from '../context/DhikrContext';
import AddDhikrModal from '../components/AddDhikrModal';

export default function DhikrViewerScreen() {
    const [activeTab, setActiveTab] = useState('morning');
    const [showAddModal, setShowAddModal] = useState(false);
    const { morningAzkar, eveningAzkar, addCustomAzkar } = useDhikr();

    const data = activeTab === 'morning' ? morningAzkar : eveningAzkar;

    const handleAddConfirm = (text, count) => {
        addCustomAzkar(activeTab, text, count);
        setShowAddModal(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.text}</Text>
            <Text style={styles.cardArabic}>{item.arabic}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>تكرار: {item.count}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'morning' && styles.activeTab]}
                    onPress={() => setActiveTab('morning')}
                >
                    <Text style={[styles.tabText, activeTab === 'morning' && styles.activeTabText]}>أذكار الصباح</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'evening' && styles.activeTab]}
                    onPress={() => setActiveTab('evening')}
                >
                    <Text style={[styles.tabText, activeTab === 'evening' && styles.activeTabText]}>أذكار المساء</Text>
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
                style={styles.fab}
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
        backgroundColor: '#0F172A',
    },
    tabContainer: {
        flexDirection: 'row-reverse',
        backgroundColor: '#1E293B',
        padding: 10,
        justifyContent: 'center',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#334155',
    },
    tabText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#10B981',
    },
    listContent: {
        padding: 16,
        paddingBottom: 120, // Increased space for FAB
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardTitle: {
        color: '#10B981',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
    },
    cardArabic: {
        color: '#F8FAFC',
        fontSize: 16,
        lineHeight: 28,
        textAlign: 'right',
        marginBottom: 12,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#334155',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#E2E8F0',
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        left: 20, // Check RTL placement
        backgroundColor: '#10B981',
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
