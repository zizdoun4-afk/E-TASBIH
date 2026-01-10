import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function CustomCountModal({ visible, onClose, onConfirm }) {
    const [value, setValue] = useState('');

    const handleConfirm = () => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num > 0) {
            onConfirm(num);
            setValue('');
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>أدخل عدد التكرار</Text>

                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        placeholder="مثال: 50"
                        placeholderTextColor="#64748B"
                        value={value}
                        onChangeText={setValue}
                        maxLength={5}
                        autoFocus
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={styles.btnText}>إلغاء</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
                            <Text style={styles.btnTextActive}>تأكيد</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    title: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        fontSize: 20,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 24,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnCancel: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    btnConfirm: {
        flex: 1,
        backgroundColor: '#10B981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10,
    },
    btnText: {
        color: '#94A3B8',
        fontSize: 16,
    },
    btnTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
