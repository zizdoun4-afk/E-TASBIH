import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

export default function CustomCountModal({ visible, onClose, onConfirm }) {
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const { theme, language } = useSettings();

    const isRTL = language === 'ar';

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
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{t('enterCount')}</Text>

                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: theme.colors.background, 
                                color: theme.colors.text, 
                                borderColor: theme.colors.border 
                            }
                        ]}
                        keyboardType="number-pad"
                        placeholder={t('countExample')}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={value}
                        onChangeText={setValue}
                        maxLength={5}
                        autoFocus
                    />

                    <View style={[styles.actions, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                         <TouchableOpacity 
                            style={[styles.btnConfirm, { backgroundColor: theme.colors.primary }]} 
                            onPress={handleConfirm}
                        >
                            <Text style={styles.btnTextActive}>{t('confirm')}</Text>
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
        width: '80%',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        padding: 16,
        borderRadius: 12,
        fontSize: 20,
        textAlign: 'center',
        borderWidth: 1,
        marginBottom: 24,
    },
    actions: {
        justifyContent: 'space-between',
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