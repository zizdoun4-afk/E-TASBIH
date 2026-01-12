import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

export default function AddDhikrModal({ visible, onClose, onConfirm }) {
    const [text, setText] = useState('');
    const [count, setCount] = useState('1');
    const { t } = useTranslation();
    const { theme, language } = useSettings();

    const isRTL = language === 'ar';
    const textAlign = isRTL ? 'right' : 'left';

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
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.title, { color: theme.colors.primary }]}>{t('addDhikrTitle')}</Text>

                    <Text style={[styles.label, { color: theme.colors.text, textAlign }]}>{t('dhikrText')}</Text>
                    <TextInput
                        style={[
                            styles.input, 
                            styles.textArea, 
                            { 
                                backgroundColor: theme.colors.background, 
                                color: theme.colors.text, 
                                borderColor: theme.colors.border,
                                textAlign 
                            }
                        ]}
                        multiline
                        placeholder={t('dhikrPlaceholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={text}
                        onChangeText={setText}
                    />

                    <Text style={[styles.label, { color: theme.colors.text, textAlign }]}>{t('count')}</Text>
                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: theme.colors.background, 
                                color: theme.colors.text, 
                                borderColor: theme.colors.border,
                                textAlign 
                            }
                        ]}
                        keyboardType="number-pad"
                        placeholder={t('countPlaceholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={count}
                        onChangeText={setCount}
                        maxLength={4}
                    />

                    <View style={[styles.actions, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                         <TouchableOpacity 
                            style={[styles.btnConfirm, { backgroundColor: theme.colors.primary }]} 
                            onPress={handleConfirm}
                        >
                            <Text style={styles.btnTextActive}>{t('add')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={[styles.btnText, { color: theme.colors.textSecondary }]}>{t('cancel')}</Text>
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
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        marginBottom: 8,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    actions: {
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
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    btnText: {
        fontSize: 16,
    },
    btnTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});