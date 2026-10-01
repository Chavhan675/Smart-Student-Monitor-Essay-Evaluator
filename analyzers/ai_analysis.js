// analyzers/ai_analysis.js

export function aiAnalysis(
    basic,
    semantic
) {

    const finalScore =
        Math.round(
            (basic.score * 0.5) +
            (semantic.semantic_score * 0.5)
        );


    // -------------------------------
    // PERFORMANCE
    // -------------------------------

    let performance;

    if (finalScore >= 75) {

        performance = "GOOD";

    }
    else if (finalScore >= 50) {

        performance = "AVERAGE";

    }
    else {

        performance = "BAD";

    }


    // -------------------------------
    // SUGGESTIONS
    // -------------------------------

    const suggestions = [];


    if (basic.word_count < 100) {

        suggestions.push(
            "Add more supporting ideas and examples."
        );

    }


    if (basic.vocabulary_diversity < 0.35) {

        suggestions.push(
            "Use more varied vocabulary."
        );

    }


    if (basic.average_sentence_length > 25) {

        suggestions.push(
            "Break long sentences into smaller sentences."
        );

    }


    if (basic.sentence_count < 5) {

        suggestions.push(
            "Develop your ideas using more sentences."
        );

    }


    if (
        semantic.overall_similarity < 0.75
    ) {

        suggestions.push(
            "Your ideas show development compared with the previous essay."
        );

    }
    else {

        suggestions.push(
            "Try introducing more new ideas compared with your previous essay."
        );

    }


    // -------------------------------
    // IMPROVEMENT STATUS
    // -------------------------------

    let improvementStatus;


    if (
        semantic.overall_similarity < 0.75
    ) {

        improvementStatus =
            "IMPROVEMENT DETECTED";

    }
    else {

        improvementStatus =
            "CONTINUE IMPROVING";

    }


    return {

        final_score:
            finalScore,

        performance,

        improvement_status:
            improvementStatus,

        suggestions

    };

}