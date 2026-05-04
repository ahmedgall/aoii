const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    try {
        const { prompt } = JSON.parse(event.body);
        
        // جرب تحط المفتاح هنا مباشرة للتأكد، أو اسحبه من الـ Env
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBdfpGEK3emzIy3W5z-rKVEZ-rKhEfUh8c";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: text }),
        };
    } catch (error) {
        // ده هيخلينا نشوف السبب الحقيقي للـ 500 في الـ Console
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
