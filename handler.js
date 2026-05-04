const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // 1. تفعيل الـ CORS عشان الفرونت إند بتاعك يعرف يتكلم مع السيرفر
  const headers = {
    "Access-Control-Allow-Origin": "*", // في الآخر هنغير دي لدومين موقعك عشان الأمان
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // التعامل مع طلبات الـ Pre-flight (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    // 2. استلام البيانات من الفرونت إند
    const { prompt } = JSON.parse(event.body);

    // 3. إعداد جيمناي بالمفتاح الجديد بتاعك
    const genAI = new GoogleGenerativeAI("AIzaSyBdfpGEK3emzIy3W5z-rKVEZ-rKhEfUh8c");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. طلب الرد من الموديل
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. إرسال الرد للفرونت إند بنجاح
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: text }),
    };

  } catch (error) {
    console.error("Error in Fixaa AI:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "فيه مشكلة حصلت، بس هنحلها يا بطل!", details: error.message }),
    };
  }
};
