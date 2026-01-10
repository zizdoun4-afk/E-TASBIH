import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MORNING_DHIKR, EVENING_DHIKR } from '../data/staticDhikr';

const DhikrContext = createContext();

export const useDhikr = () => {
    return useContext(DhikrContext);
};

export const DhikrProvider = ({ children }) => {
    const [dailyDhikrQueue, setDailyDhikrQueue] = useState([]);
    const [totalSessionCount, setTotalSessionCount] = useState(0);
    const [currentDhikrIndex, setCurrentDhikrIndex] = useState(0);
    const [targetCount, setTargetCount] = useState(33);
    const [dailyTotal, setDailyTotal] = useState(0);

    // Dynamic Azkar
    const [morningAzkar, setMorningAzkar] = useState(MORNING_DHIKR);
    const [eveningAzkar, setEveningAzkar] = useState(EVENING_DHIKR);

    useEffect(() => {
        loadDailyStats();
        loadCustomAzkar();
    }, []);

    const loadDailyStats = async () => {
        try {
            const storedDate = await AsyncStorage.getItem('lastActiveDate');
            const storedTotal = await AsyncStorage.getItem('dailyTotal');
            const today = new Date().toDateString();

            if (storedDate === today && storedTotal) {
                setDailyTotal(parseInt(storedTotal, 10));
            } else {
                await AsyncStorage.setItem('lastActiveDate', today);
                await AsyncStorage.setItem('dailyTotal', '0');
                setDailyTotal(0);
            }
        } catch (e) {
            console.error("Failed to load daily stats", e);
        }
    };

    const loadCustomAzkar = async () => {
        try {
            const storedMorning = await AsyncStorage.getItem('customMorningAzkar');
            const storedEvening = await AsyncStorage.getItem('customEveningAzkar');

            if (storedMorning) {
                const customM = JSON.parse(storedMorning);
                setMorningAzkar([...MORNING_DHIKR, ...customM]);
            } else {
                setMorningAzkar(MORNING_DHIKR);
            }

            if (storedEvening) {
                const customE = JSON.parse(storedEvening);
                setEveningAzkar([...EVENING_DHIKR, ...customE]);
            } else {
                setEveningAzkar(EVENING_DHIKR);
            }

        } catch (e) {
            console.error("Failed to load Azkar", e);
        }
    };

    const addCustomAzkar = async (type, text, count) => {
        const newItem = {
            id: Date.now().toString(),
            text: text,
            arabic: text,
            count: count
        };

        if (type === 'morning') {
            try {
                const stored = await AsyncStorage.getItem('customMorningAzkar');
                const currentCustom = stored ? JSON.parse(stored) : [];
                const newCustom = [...currentCustom, newItem];
                await AsyncStorage.setItem('customMorningAzkar', JSON.stringify(newCustom));
                setMorningAzkar([...MORNING_DHIKR, ...newCustom]);
            } catch (e) { console.warn(e); }
        } else {
            try {
                const stored = await AsyncStorage.getItem('customEveningAzkar');
                const currentCustom = stored ? JSON.parse(stored) : [];
                const newCustom = [...currentCustom, newItem];
                await AsyncStorage.setItem('customEveningAzkar', JSON.stringify(newCustom));
                setEveningAzkar([...EVENING_DHIKR, ...newCustom]);
            } catch (e) { console.warn(e); }
        }
    };

    const updateDailyTotal = async (newTotal) => {
        setDailyTotal(newTotal);
        AsyncStorage.setItem('dailyTotal', newTotal.toString());
        AsyncStorage.setItem('lastActiveDate', new Date().toDateString());
    };

    const addToQueue = (dhikrItem) => {
        const newItem = {
            ...dhikrItem,
            target: dhikrItem.count || targetCount,
            completed: 0
        };
        setDailyDhikrQueue((prev) => [...prev, newItem]);
    };

    const removeFromQueue = (index) => {
        setDailyDhikrQueue((prev) => prev.filter((_, i) => i !== index));
    };

    const resetQueue = () => {
        setDailyDhikrQueue([]);
        setTotalSessionCount(0);
        setCurrentDhikrIndex(0);
    };

    const handleTap = () => {
        if (dailyDhikrQueue.length === 0) return;
        if (currentDhikrIndex >= dailyDhikrQueue.length) return;

        const currentItem = dailyDhikrQueue[currentDhikrIndex];

        // Update completion
        const updatedQueue = [...dailyDhikrQueue];
        updatedQueue[currentDhikrIndex] = {
            ...currentItem,
            completed: currentItem.completed + 1
        };
        setDailyDhikrQueue(updatedQueue);
        setTotalSessionCount(prev => prev + 1);

        // Update Daily Effort
        updateDailyTotal(dailyTotal + 1);

        // Check if current item finished
        if (updatedQueue[currentDhikrIndex].completed >= updatedQueue[currentDhikrIndex].target) {
            if (currentDhikrIndex < dailyDhikrQueue.length - 1) {
                setCurrentDhikrIndex(prev => prev + 1);
            } else {
                setCurrentDhikrIndex(prev => prev + 1);
            }
        }
    };

    const startNewSession = (items) => {
        const newQueue = items.map(item => ({
            ...item,
            target: item.count || targetCount, // Use global target count unless item has specific one
            completed: 0
        }));
        setDailyDhikrQueue(newQueue);
        setTotalSessionCount(0);
        setCurrentDhikrIndex(0);
    };

    const isSessionComplete = dailyDhikrQueue.length > 0 && currentDhikrIndex >= dailyDhikrQueue.length;

    return (
        <DhikrContext.Provider
            value={{
                dailyDhikrQueue,
                addToQueue,
                removeFromQueue,
                resetQueue,
                startNewSession, // Exported
                handleTap,
                totalSessionCount,
                currentDhikrIndex,
                isSessionComplete,
                targetCount,
                setTargetCount,
                dailyTotal,
                morningAzkar,
                eveningAzkar,
                addCustomAzkar
            }}
        >
            {children}
        </DhikrContext.Provider>
    );
};
