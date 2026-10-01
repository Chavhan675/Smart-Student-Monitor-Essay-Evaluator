// analyzers/semantic_analysis.js

import { pipeline } from "@huggingface/transformers";

let extractor = null;


// ========================================
// LOAD MODEL
// ========================================

async function loadModel() {

    if (!extractor) {

        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2",
            {
                dtype: "fp32"
            }
        );

    }

    return extractor;
}


// ========================================
// SPLIT SENTENCES
// ========================================

function splitSentences(text) {

    return text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(Boolean);

}


// ========================================
// CREATE EMBEDDING
// ========================================

async function createEmbedding(sentence) {

    const model = await loadModel();

    const output = await model(
        sentence,
        {
            pooling: "mean",
            normalize: true
        }
    );

    return Array.from(output.data);

}


// ========================================
// COSINE SIMILARITY
// ========================================

function cosineSimilarity(a, b) {

    let dot = 0;

    let magnitudeA = 0;

    let magnitudeB = 0;


    for (let i = 0; i < a.length; i++) {

        dot += a[i] * b[i];

        magnitudeA += a[i] * a[i];

        magnitudeB += b[i] * b[i];

    }


    return dot /
        (
            Math.sqrt(magnitudeA) *
            Math.sqrt(magnitudeB)
        );

}


// ========================================
// MAIN FUNCTION
// ========================================

export async function semanticAnalysis(
    currentEssay,
    previousEssay
) {

    const currentSentences =
        splitSentences(currentEssay);

    const previousSentences =
        splitSentences(previousEssay);


    const currentEmbeddings = [];

    const previousEmbeddings = [];


    // ------------------------------------
    // CURRENT ESSAY
    // ------------------------------------

    for (const sentence of currentSentences) {

        const embedding =
            await createEmbedding(sentence);

        currentEmbeddings.push({
            sentence,
            embedding
        });

    }


    // ------------------------------------
    // PREVIOUS ESSAY
    // ------------------------------------

    for (const sentence of previousSentences) {

        const embedding =
            await createEmbedding(sentence);

        previousEmbeddings.push({
            sentence,
            embedding
        });

    }


    // ------------------------------------
    // COMPARE SENTENCES
    // ------------------------------------

    const comparisons = [];


    for (const current of currentEmbeddings) {

        let bestSimilarity = -1;

        let bestPreviousSentence = "";


        for (const previous of previousEmbeddings) {

            const similarity =
                cosineSimilarity(
                    current.embedding,
                    previous.embedding
                );


            if (similarity > bestSimilarity) {

                bestSimilarity = similarity;

                bestPreviousSentence =
                    previous.sentence;

            }

        }


        comparisons.push({

            current_sentence:
                current.sentence,

            previous_similar_sentence:
                bestPreviousSentence,

            similarity:
                Number(
                    bestSimilarity.toFixed(2)
                )

        });

    }


    // ------------------------------------
    // OVERALL SCORE
    // ------------------------------------

    const total =
        comparisons.reduce(
            (sum, item) =>
                sum + item.similarity,
            0
        );


    const overallSimilarity =
        comparisons.length > 0
            ? total / comparisons.length
            : 0;


    const semanticScore =
        Math.round(
            overallSimilarity * 100
        );


    return {

        model:
            "all-MiniLM-L6-v2",

        embedding_dimensions:
            384,

        sentence_comparisons:
            comparisons,

        overall_similarity:
            Number(
                overallSimilarity.toFixed(2)
            ),

        semantic_score:
            semanticScore

    };

}