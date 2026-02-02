import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";


// ⚠️ NEVER expose API keys in frontend in production apps
// const apiKey = "AIzaSyAnGBJmhox6qKBEN3BqQVTI7avOZgUtGA0";
const apiKey = "AIzaSyDppGjoJyEjrypb5PPWc5SnVgmLrnLvgNo";
//  const apiKey =  process.env.GEMINI_API_KEY;

                const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  // model: "gemini-1.5-flash", // Recommended alias
  model: "gemini-2.0-flash", // Recommended alias
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 400,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  // alert(`➡️ Run in  Gemini prompt: ${prompt}`);

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    prompt = responseText ;
  
    // alert(`✅ Gemini response:  ${prompt}`);
  
    return [prompt];



  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    alert("❌ Error from Gemini: " + err.message);
    return ("❗ An error occurred. See console for details.");
    
  }
}

export default run;

