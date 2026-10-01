// server.js

import express from "express";

import fs from "fs";

import path from "path";

import { fileURLToPath } from "url";

import { basicAnalysis }
    from "./analyzers/basic_analysis.js";

import { semanticAnalysis }
    from "./analyzers/semantic_analysis.js";

import { aiAnalysis }
    from "./analyzers/ai_analysis.js";


const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


const app = express();

app.use(express.json());


const latestPath =
    path.join(
        __dirname,
        "data",
        "latest_essay.txt"
    );


const previousPath =
    path.join(
        __dirname,
        "data",
        "previous_essays.txt"
    );


const resultPath =
    path.join(
        __dirname,
        "data",
        "evaluation_result.json"
    );


// ========================================
// EVALUATE ESSAY
// ========================================

async function evaluateEssay() {

    const latestEssay =
        fs.readFileSync(
            latestPath,
            "utf8"
        );


    const previousEssay =
        fs.readFileSync(
            previousPath,
            "utf8"
        );


    console.log("\n================================");

    console.log("SMART STUDENT MENTOR");

    console.log("ESSAY EVALUATION");

    console.log("================================\n");


    // ====================================
    // BASIC
    // ====================================

    const basic =
        basicAnalysis(latestEssay);


    console.log("1. BASIC ANALYSIS");

    console.log(
        "Words:",
        basic.word_count
    );

    console.log(
        "Sentences:",
        basic.sentence_count
    );

    console.log(
        "Score:",
        basic.score
    );


    // ====================================
    // SEMANTIC
    // ====================================

    const semantic =
        await semanticAnalysis(
            latestEssay,
            previousEssay
        );


    console.log("\n2. SENTENCE TRANSFORMER");

    console.log(
        "Model:",
        semantic.model
    );

    console.log(
        "Embedding:",
        semantic.embedding_dimensions,
        "dimensions"
    );

    console.log(
        "Semantic similarity:",
        semantic.overall_similarity
    );

    console.log(
        "Semantic score:",
        semantic.semantic_score
    );


    // ====================================
    // AI
    // ====================================

    const ai =
        aiAnalysis(
            basic,
            semantic
        );


    console.log("\n3. FINAL EVALUATION");

    console.log(
        "Score:",
        ai.final_score
    );

    console.log(
        "Performance:",
        ai.performance
    );

    console.log(
        "Status:",
        ai.improvement_status
    );


    console.log("\nSuggestions:");

    ai.suggestions.forEach(
        (suggestion, index) => {

            console.log(
                `${index + 1}. ${suggestion}`
            );

        }
    );


    // ====================================
    // FINAL JSON
    // ====================================

    const result = {

        basic_analysis: basic,

        semantic_analysis: semantic,

        ai_analysis: ai,

        final_evaluation: {

            score:
                ai.final_score,

            performance:
                ai.performance,

            improvement_status:
                ai.improvement_status,

            suggestions:
                ai.suggestions

        }

    };


    fs.writeFileSync(
        resultPath,
        JSON.stringify(
            result,
            null,
            2
        )
    );


    console.log(
        "\nResult saved:"
    );

    console.log(
        "data/evaluation_result.json"
    );


    return result;

}


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Smart Student Mentor",

        endpoint:
            "/evaluate"

    });

});


// ========================================
// EVALUATE
// ========================================

app.get(
    "/evaluate",
    async (req, res) => {

        try {

            const result =
                await evaluateEssay();

            res.json(result);

        }
        catch (error) {

            console.error(error);

            res.status(500).json({

                error:
                    "Evaluation failed",

                message:
                    error.message

            });

        }

    }
);


// ========================================
// SERVER
// ========================================

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);