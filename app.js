/**
 * Fixaa AI - Logic Module
 * هذا الملف مسؤول عن الربط بين واجهة المستخدم وسيرفر Netlify
 */

async function sendMessage() {
    const input = document.getElementById('userInput');
    const messagesDiv = document.getElementById('messages');
    const text = input.value.trim();

    // منع الإرسال إذا كان الحقل فارغاً
    if (!text) return;

    // 1. إضافة رسالة المستخدم للواجهة (UI Update)
    appendMessage(text, 'user');
    input.value = '';
    scrollToBottom();

    try {
        // 2. مناداة السيرفر (Netlify Function)
        // نستخدم المسار النسبي لضمان عمله على أي دومين تابع لـ Netlify
        const response = await fetch('/.netlify/functions/handler', {
            method: 'POST',
            body: JSON.stringify({ prompt: text }),
            headers: { 
                'Content-Type': 'application/json' 
            }
        });

        // التأكد من نجاح الطلب
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        
        // 3. عرض رد الذكاء الاصطناعي (Gemini Response)
        if (data.message) {
            appendMessage(data.message, 'ai');
        } else {
            throw new Error(data.error || "Unexpected response format");
        }

    } catch (error) {
        console.error("Fixaa Connection Error:", error);
        appendMessage("عذرًا، حدث خطأ أثناء الاتصال بالسيرفر. تأكد من إعدادات Netlify.", 'ai', true);
    }
    
    scrollToBottom();
}

// دالة مساعدة لإضافة الرسائل وتنسيقها
function appendMessage(text, sender, isError = false) {
    const messagesDiv = document.getElementById('messages');
    const msgElement = document.createElement('div');
    msgElement.classList.add('message', sender);
    
    if (isError) {
        msgElement.style.background = "#ff4444";
    }
    
    msgElement.innerText = text;
    messagesDiv.appendChild(msgElement);
}

// دالة لضبط التمرير لأسفل تلقائياً
function scrollToBottom() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// دعم الإرسال عن طريق زر Enter
document.getElementById('userInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
