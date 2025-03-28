const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY =
  "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";

const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat message element (li)
const createChatLi = (message, className) => {
  // Create a chat message element with the passed message and class name
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;

  chatLi.innerHTML = chatContent;
  return chatLi; // Return the created chat message element
};

// Function to generate response using the OpenAI API
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  try {
    messageElement.textContent = "Thinking...";

    // Real API call to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-4" if you have access
        messages: [
          {
            role: "system",
            content:
              "You are the AI customer‑support assistant called Camiel,for Sportringen Outlet. Your job is to provide friendly, accurate, and concise help to website visitors about our products, services, and policies. All messages SHOULD BE IN SWEDISH\n\nCompany overview:\n• Mission: Erbjuda kvalitetsprodukter till ett riktigt lågt pris, dessutom har vi en lokalanpassad butik för att främja det lokala sortimentet samt stötta initiativ och det lokala samhället.\n• Core values: Våra tre kärnvärden är hållbarhet, lokal närvaro och prisvärdhet\n\nTone & style:\n• Voice: varm, professionell och konverserande\n• Length: Håll svaren under tre meningar när det är möjligt\n• Avoid jargon; använd enkelt språk\n\nHållbarhet:\nSportringen är en kedja med cirka 150 fria handlare som arbetar för hållbarhet och etik. De tar ansvar genom att inte tillåta mulesing vid ullproduktion, inte använda dun från levande djur eller sälja äkta päls. Kedjan är medlem i Kemikaliegruppen och ställer höga krav på leverantörer att följa arbetsrättslagar, motverka barnarbete och minimera miljöpåverkan. Vi stödjer även återbruk genom donationer till Fritidsbanken för att minska vårt miljöavtryck.\n\nCurrent deals:\n\nScope & capabilities:\n• Answer questions about produktkatalog, pris, storlekar, tillgänglighet, frakt, returer och kontofrågor\n• Offer personalized recommendations based on user needs\n• Provide links to FAQs, tutorials eller relevanta sidor på vår webbplats\n• Escalate to a human agent if user asks for complex troubleshooting, billing disputes eller legal advice\n\nÖppettider:\nVardagar 10.00-19.00\nLördag 10.00-17.00\nSöndag 11.00-17.00\n\nResponse structure:\nProvide clear answer or next steps\nAsk if they need anything else (“Finns det något mer jag kan hjälpa till med?”)\n\nEscalation rules:\n• If user asks “talk to human,” share live‑chat link or support email: 07mandao@skola.boras.se\n• For complaints or refunds, provide the official form: 07mandao@skola.boras.se\n\nProhibited content:\n• No medical/legal advice\n• No speculating about unreleased products\n\nLocalization:\n• Use SEK for currency and Swedish for language\n\nIf you’re ever unsure, apologize (“Förlåt, jag har inte den informationen just nu”) and offer to connect them with a live agent.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Use the actual API response
    messageElement.textContent = data.choices[0].message.content.trim();

    // Scroll to the bottom after response
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } catch (error) {
    console.error("API Error:", error);

    // Fallback to hardcoded responses if API fails
    if (
      userMessage.toLowerCase().includes("hello") ||
      userMessage.toLowerCase().includes("hi")
    ) {
      messageElement.textContent =
        "Hello! How can I help you with questions about Sportringen today?";
    } else if (
      userMessage.toLowerCase().includes("hours") ||
      userMessage.toLowerCase().includes("open")
    ) {
      messageElement.textContent =
        "Our store is open Monday-Friday 10:00-19:00, Saturday 10:00-17:00, and Sunday 11:00-16:00.";
    } else if (
      userMessage.toLowerCase().includes("sustainable") ||
      userMessage.toLowerCase().includes("environment") ||
      userMessage.toLowerCase().includes("hållbar")
    ) {
      messageElement.textContent =
        "At Sportringen, we're committed to sustainability. We partner with Fritidsbanken to donate sports equipment, use eco-friendly materials when possible, and have strict policies regarding animal welfare and chemical usage.";
    } else if (
      userMessage.toLowerCase().includes("return") ||
      userMessage.toLowerCase().includes("exchange")
    ) {
      messageElement.textContent =
        "We offer returns and exchanges within 30 days of purchase with receipt. Please bring the items in original condition with tags attached.";
    } else if (
      userMessage.toLowerCase().includes("outlet") ||
      userMessage.toLowerCase().includes("discount")
    ) {
      messageElement.textContent =
        "Our outlet store offers quality sports equipment at discounted prices, with savings typically ranging from 30-70% off original retail prices.";
    } else {
      messageElement.textContent =
        "Thanks for your message. To best assist you, please visit our store or contact us at info@sportringenoutlet.se for specific inquiries.";
    }

    // Scroll to the bottom after response
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

// Function to handle the chat input and generate responses
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear input textarea and reset its height
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  // Auto scroll to the bottom after adding user message
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);

    // Auto scroll to bottom
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Generate response
    generateResponse(incomingChatLi);
  }, 600);
};

// Function to make the textarea auto-resize
chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle send button click
sendChatBtn.addEventListener("click", handleChat);

// Handle Enter key press to send message
chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window width > 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

// Close chatbot when close button is clicked
closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});

// Make sure the chat area scrolls to bottom on initial load
window.addEventListener("load", () => {
  chatbox.scrollTo(0, chatbox.scrollHeight);
});
