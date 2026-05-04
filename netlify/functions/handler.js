const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
    // 1. إعدادات الـ CORS لضمان قبول الطلبات من الفرونت إند الخاص بك
    const headers = {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    // الرد على طلبات الـ OPTIONS (Pre-flight)
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers };
    }

    try {
        // التأكد من أن الطلب يحتوي على بيانات
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "الطلب فارغ!" }),
            };
        }

        const { prompt } = JSON.parse(event.body);

        // 2. ربط مفتاح جيمناي الجديد (المحرك الخاص بـ Fixaa Arab)
        const genAI = new GoogleGenerativeAI("AIzaSyBdfpGEK3emzIy3W5z-rKVEZ-rKhEfUh8c");
        
        // استخدام موديل 1.5 Flash لسرعته الفائقة في مهام الأتمتة
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. توليد الرد من الذكاء الاصطناعي
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. إرسال الرد النهائي للفرونت إند
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: text }),
        };

    } catch (error) {
        console.error("خطأ في سيرفر فيكساا:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "حصلت مشكلة في الربط، بس مكملين!", 
                details: error.message 
            }),
        };
    }
};
