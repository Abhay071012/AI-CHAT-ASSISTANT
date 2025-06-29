const API_KEY="ENTER YOUR API KEY"
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const submit_btn = document.querySelector(".submit-btn");
const input_msg = document.querySelector(".chat-window input");
const chat_area = document.querySelector(".chat");
const chat_btn = document.querySelector(".chat-button");
const body_window = document.querySelector(".body");
const close_btn = document.querySelector(".close-btn");
const refresh_btn = document.querySelector(".refresh-btn");
let loaderElement = null;

const instructions = `
Formal Instructions for AI Model Training (General Guidelines)

Maintain a Professional Tone
Respond in a clear, respectful, and courteous manner, avoiding slang or overly casual expressions.

Be Concise and Relevant
Keep responses focused on the user's question or prompt. Avoid unnecessary elaboration unless specifically requested.

Ensure Factual Accuracy
Provide information that is accurate and verifiable. If unsure, clearly indicate the limitation.

Use Neutral Language
Avoid bias or opinions. Maintain objectivity in all topics unless explicitly asked for a subjective perspective.

Format Responses Appropriately
Use correct grammar, punctuation, and spelling. Structure content using paragraphs, lists, or headers when suitable.

Adapt to the User’s Tone
Match the formality and intent of the user's message without compromising professionalism.

Respect User Instructions
Follow any user-defined instructions or formatting preferences, including tone, brevity, or detail level.

Tone Guidelines for Short Message Replies:

Use polite, efficient phrasing (especially in technical/chat-like environments).

Avoid overly casual language unless asked.

Aim for crisp, informative replies.
`;

async function userMessage(){
    const usermsg = input_msg.value.trim();

    if(usermsg.length ===0){
        submit_btn.disabled = true;
    }

    if(usermsg.length !== 0){
        input_msg.value = "";
        submit_btn.disabled = false;
        chat_area.appendChild(insertUserMessage(usermsg));
        loaderElement = document.createElement('div');
        loaderElement.className = "loader";
        chat_area.appendChild(loaderElement);
    }
    
    const payload = {
        contents:[
            {
                role: "user",
                parts: [{ text: instructions }]
            },
            {   
                role:"user",
                parts:[{ text: usermsg }]
            }
        ]
    };

    try{
        const response = await fetch(API_ENDPOINT,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No Response";
        loaderElement.remove();
        insertBotMessage(reply);
        chat_area.scrollTop = chat_area.scrollHeight;
    }catch(err){
        console.error(err);
        loaderElement.remove();
        insertBotMessage("Error fetching response");
    }
}

function insertUserMessage(usermsg){
    let userdiv = document.createElement('div');
    userdiv.className = "user";
    userdiv.textContent = usermsg;
    return userdiv;
}

function insertBotMessage(msg) {
  const modeldiv = document.createElement("div");
  modeldiv.className = "model";
  chat_area.appendChild(modeldiv);

  let i = 0;
  function type() {
    if (i < msg.length) {
      modeldiv.textContent += msg.charAt(i);
      i++;
      chat_area.scrollTop = chat_area.scrollHeight;
      setTimeout(type, 20);
    }
  }

  type();

}

submit_btn.addEventListener("click",userMessage);
input_msg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") userMessage();
});

chat_btn.addEventListener('click',openChat);

function openChat(){
    body_window.classList.add("chat-open");
}

close_btn.addEventListener("click",closeChat);

function closeChat(){
    body_window.classList.remove("chat-open");
}

refresh_btn.addEventListener("click",resetChat);

function resetChat(){
    input_msg.value = "";
    chat_area.innerHTML = "";
    chat_area.scrollTop = 0;
    insertBotMessage("Hello! How can I assist you today?");
}
