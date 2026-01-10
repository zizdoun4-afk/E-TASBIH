import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function AddDhikrModal({ visible, onClose, onConfirm }) {
    const [text, setText] = useState('');
    const [count, setCount] = useState('1');

    const handleConfirm = () => {
        const num = parseInt(count, 10);
        if (text.trim() && !isNaN(num) && num > 0) {
            onConfirm(text, num);
            setText('');
            setCount('1');
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>إضافة ذكر جديد</Text>

                    <Text style={styles.label}>نص الذكر</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        multiline
                        placeholder="اكتب الذكر هنا..."
                        placeholderTextColor="#64748B"
                        value={text}
                        onChangeText={setText}
                    />

                    <Text style={styles.label}>عدد التكرار</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        placeholder="عدد"
                        placeholderTextColor="#64748B"
                        value={count}
                        onChangeText={setCount}
                        maxLength={4}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={styles.btnText}>إلغاء</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
                            <Text style={styles.btnTextActive}>إضافة</Text>
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
        width: '90%',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    title: {
        color: '#10B981',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        color: '#F8FAFC',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        textAlign: 'right',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
