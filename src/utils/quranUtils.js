import quranData from '../../quran_ar.json';

export const getRandomVerse = () => {
    try {
        console.log("Attempting to fetch verse...");

        if (!quranData) {
            throw new Error("quranData is undefined");
        }

        if (!quranData.data || !quranData.data.surahs) {
            console.log("quranData structure invalid:", Object.keys(quranData));
            throw new Error("Invalid structure");
        }

        const surahs = quranData.data.surahs;
        // Pick random Surah
        const randomSurahIndex = Math.floor(Math.random() * surahs.length);
        const surah = surahs[randomSurahIndex];

        // Pick random Ayah
        const randomAyahIndex = Math.floor(Math.random() * surah.ayahs.length);
        const ayah = surah.ayahs[randomAyahIndex];

        console.log("Verse fetched successfully:", ayah.text);

        return {
            text: ayah.text,
            surahName: surah.name,
            ayahNumber: ayah.numberInSurah,
            fullRef: `${surah.name} (${ayah.numberInSurah})`
        };
    } catch (error) {
        console.error("Error fetching verse:", error);
        // Fallback Verse (Basmalah)
        return {
            text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            fullRef: "سورة الفاتحة (1)",
            isFallback: true
        };
    }
};
