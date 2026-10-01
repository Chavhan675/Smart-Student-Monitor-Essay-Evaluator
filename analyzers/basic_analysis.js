// analyzers/basic_analysis.js

export function basicAnalysis(essay) {

    const words =
        essay.match(/\b[a-zA-Z]+\b/g) || [];

    const sentences =
        essay
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(Boolean);

    const paragraphs =
        essay
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(Boolean);

    const wordCount = words.length;

    const sentenceCount = sentences.length;

    const paragraphCount = paragraphs.length;

    const averageSentenceLength =
        sentenceCount > 0
            ? Number(
                (wordCount / sentenceCount).toFixed(2)
              )
            : 0;

    const uniqueWords =
        new Set(words.map(w => w.toLowerCase()));

    const vocabularyDiversity =
        wordCount > 0
            ? Number(
                (uniqueWords.size / wordCount).toFixed(2)
              )
            : 0;


    // -------------------------------
    // BASIC SCORE
    // -------------------------------

    let score = 0;

    if (wordCount >= 100)
        score += 30;
    else if (wordCount >= 60)
        score += 20;
    else
        score += 10;


    if (sentenceCount >= 5)
        score += 25;
    else if (sentenceCount >= 3)
        score += 15;
    else
        score += 5;


    if (paragraphCount >= 3)
        score += 20;
    else if (paragraphCount >= 2)
        score += 15;
    else
        score += 5;


    if (vocabularyDiversity >= 0.5)
        score += 25;
    else if (vocabularyDiversity >= 0.35)
        score += 15;
    else
        score += 5;


    return {

        word_count: wordCount,

        sentence_count: sentenceCount,

        paragraph_count: paragraphCount,

        average_sentence_length:
            averageSentenceLength,

        vocabulary_diversity:
            vocabularyDiversity,

        score: score

    };
}