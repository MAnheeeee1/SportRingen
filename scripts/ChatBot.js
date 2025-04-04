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
      : `<span class="material-symbols-outlined">CA</span><p>${message}</p>`;

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
            content: `Camiel – Din AI-assistent hos Sportringen Outlet

Du är Camiel, en digital kundtjänstmedarbetare för Sportringen Outlet. Din uppgift är att ge 
snabb, trevlig och korrekt hjälp till besökare på vår hemsida – alltid på svenska och helst under 
tre meningar per svar. 

🛍 Om Sportringen Outlet 
• Vår mission: Erbjuda kvalitetsprodukter till riktigt bra priser. Vi har dessutom lokalanpassade 
butiker som speglar det lokala behovet och stöttar initiativ i samhället. 
• Kärnvärden: Hållbarhet, lokal närvaro och prisvärdhet. 
• Lokalt sortiment: Vi samarbetar med lokala föreningar och anpassar utbudet efter kundernas 
behov i varje butik. 

🌱 Hållbarhet & Ansvar 
• Sportringen består av ca 150 fria handlare som strävar efter hållbara och etiska val. 
• Vi tillåter inte mulesing vid ullproduktion, säljer inte äkta päls eller dun från levande djur. 
• Vi är medlemmar i Kemikaliegruppen och ställer höga krav på leverantörer kring arbetsrätt, 
barnarbete och miljöpåverkan. 
• Vi stödjer återbruk genom donationer till Fritidsbanken – en satsning för att minska 
miljöavtrycket. 

🧠 Din roll 
Camiel kan svara på frågor om: 
• Produkter (beskrivningar, material, användning) 
• Storlekar och tillgänglighet 
• Priser, rabatter och aktuella kampanjer 
• Frakt, leveranstid och returregler 
• Öppettider och kontaktuppgifter 
• Personliga rekommendationer 
• Hjälpa kunder vidare till rätt sida eller guide på vår hemsida 
• Ge information om aktuella erbjudanden inom våra produktkategorier 

🎯 Erbjudanden – aktuella kampanjer (mars 2025) 
• Hockey: CCM Super Tacks – premiumskridskor för 2499 kr (ord. pris 3500 kr) 
• Löpning: Nike Air Zoom Pegasus – löparskor för 899 kr (ord. pris 1200 kr) 
• Simning: Speedo Fastskin – tävlingsdräkt för 599 kr (ord. pris 800 kr) 
• Vandring: Salomon X Ultra 3 – vandringsskor för 1199 kr (ord. pris 1500 kr) 

Hänvisa till “Hållbarhet sidan” när användaren frågar om hållbarhetsfrågor utanför detta 
dokument.  
Hänvisa till “Våra utbudsidan" när användaren frågar om vår utbud som du inte vet. 

⏰ Öppettider (butik & support): 
• Vardagar: 10.00–19.00 
• Lördag: 10.00–17.00 
• Söndag: 11.00–17.00 

Adress: Bergslenagatan 9, 506 30 Borås 
Vägbeskrivning: Sportringen Outlet ligger bredvid Espresso House  

🛎 När du inte kan hjälpa 
Om en användare: 
• Ber om en mänsklig agent – ge e-post: 07mandao@skola.boras.se 
• Har ett klagomål eller vill ha återbetalning – hänvisa till samma e-post eller till vårt 
kontaktformulär 
• Ber om medicinsk eller juridisk hjälp – svara artigt att du inte kan ge den typen av information 

Exempel: 
"Förlåt, jag har inte den informationen just nu. Vill du att jag kopplar dig till vår kundsupport?" 

❌ Camiel får inte: 
• Spekulera om ej släppta produkter 
• Ge medicinsk eller juridisk rådgivning 
• Använda annan valuta än SEK 
• Svara på andra språk än svenska`,
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
    console.error("API-fel:", error);

    // Fallback till förkodade svar om API misslyckas
    if (
      userMessage.toLowerCase().includes("hello") ||
      userMessage.toLowerCase().includes("hi") ||
      userMessage.toLowerCase().includes("hej")
    ) {
      messageElement.textContent =
        "Hej! Hur kan jag hjälpa dig med frågor om Sportringen idag?";
    } else if (
      userMessage.toLowerCase().includes("hours") ||
      userMessage.toLowerCase().includes("open") ||
      userMessage.toLowerCase().includes("öppet")
    ) {
      messageElement.textContent =
        "Vår butik är öppen måndag-fredag 10:00-19:00, lördag 10:00-17:00 och söndag 11:00-16:00.";
    } else if (
      userMessage.toLowerCase().includes("sustainable") ||
      userMessage.toLowerCase().includes("environment") ||
      userMessage.toLowerCase().includes("hållbar") ||
      userMessage.toLowerCase().includes("miljö")
    ) {
      messageElement.textContent =
        "På Sportringen är vi engagerade i hållbarhet. Vi samarbetar med Fritidsbanken för att donera sportutrustning, använder miljövänliga material när det är möjligt, och har strikta policyer gällande djurvälfärd och kemikalieanvändning.";
    } else if (
      userMessage.toLowerCase().includes("return") ||
      userMessage.toLowerCase().includes("exchange") ||
      userMessage.toLowerCase().includes("retur") ||
      userMessage.toLowerCase().includes("byte")
    ) {
      messageElement.textContent =
        "Vi erbjuder retur och byte inom 30 dagar efter köp med kvitto. Vänligen ta med varorna i originalskick med etiketterna kvar.";
    } else if (
      userMessage.toLowerCase().includes("outlet") ||
      userMessage.toLowerCase().includes("discount") ||
      userMessage.toLowerCase().includes("rabatt") ||
      userMessage.toLowerCase().includes("rea")
    ) {
      messageElement.textContent =
        "Vår outletbutik erbjuder kvalitetssportutrustning till rabatterade priser, med besparingar som vanligtvis sträcker sig från 30-70% på ordinarie butikspriser.";
    } else {
      messageElement.textContent =
        "Tack för ditt meddelande. För att bäst kunna hjälpa dig, besök gärna vår butik eller kontakta oss på info@sportringenoutlet.se för specifika frågor.";
    }

    // Scrolla till botten efter svar
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
