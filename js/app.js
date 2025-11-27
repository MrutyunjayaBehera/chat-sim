// --- Conversation Data Structure ---
const chatFlow = {
    'start': {
        text: "Hey! I've been thinking... Do you love me? 🥺",
        options: [
            { text: "Yes", next: 'q2_yes', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'q2_no', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q2_yes': {
        text: "Wait, really? Are you sure? 🤨",
        options: [
            { text: "Yes", next: 'q3_yes', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'end_no_joke', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q2_no': {
        text: "Please say yes 🥺",
        options: [
            { text: "Yes", next: 'q2_yes', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'q2_no_retry', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q3_yes': {
        text: "Jabardasti me yes bol rhe ho kya? 😅",
        options: [
            { text: "Yes", next: 'q4_yes', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'q5', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q4_yes': {
        text: "Kya yr, karlo na pyaar 🙏",
        options: [
            { text: "Ok", next: 'q5', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'q4_no_final_plea', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q5': {
        text: "Matlab tum maante ho ki tumhe mujhse pyaar hai? 🤔",
        options: [
            { text: "Haan babu", next: 'q6_say_again', isPositive: true, class: 'btn-special' },
            { text: "Definitely yes", next: 'end_success_handsome', isPositive: true, class: 'btn-yes' }
        ],
        sender: 'crush'
    },
    'end_no_joke': {
        text: "Achha mazak kar rhe ho phir? 😏",
        options: [
            { text: "Yes", next: 'q5', isPositive: true, class: 'btn-yes' },
            { text: "No", next: 'end_success_aww', isPositive: false, class: 'btn-no' }
        ],
        sender: 'crush'
    },
    'q2_no_retry': {
        text: "Haan bol do na 🥺",
        options: [
            { text: "No", next: 'q4_no_final_plea', isPositive: false, class: 'btn-no' },
            { text: "Ok, I love you so much", next: 'end_success_handsome', isPositive: true, class: 'btn-special' }
        ],
        sender: 'crush'
    },
    'q4_no_final_plea': {
        text: "Please yr, iss pyaar ki mareez pe reham karo 😭",
        options: [
            { text: "No", next: 'q5_last_chance', isPositive: false, class: 'btn-no' },
            { text: "Ok", next: 'end_success_handsome', isPositive: true, class: 'btn-yes' }
        ],
        sender: 'crush'
    },
    'q6_say_again': {
        text: "Wait, say it again 😊",
        options: [
            { text: "Yes I love you", next: 'q7_one_more_time', isPositive: true, class: 'btn-yes' },
            { text: "Yes, yes, yes, I love you so much", next: 'end_success_final', isPositive: true, class: 'btn-special' }
        ],
        sender: 'crush'
    },
    'q7_one_more_time': {
        text: "One more time? 😄",
        options: [
            { text: "Say it", next: 'end_success_final', isPositive: true, class: 'btn-yes' }
        ],
        sender: 'crush'
    },
    'q5_last_chance': {
        text: "Tum ek masoom ka dil tod rahe ho 💔",
        options: [
            { text: "Ok, I love you", next: 'end_success_pata_hai', isPositive: true, class: 'btn-yes' },
            { text: "Ok cutie, I love you sooooo much", next: 'end_success_confident', isPositive: true, class: 'btn-special' }
        ],
        sender: 'crush'
    },

    // --- End Screens (No options needed) ---
    'end_success_handsome': { text: "Pyaar to karoge hi, mein hun hi itna handsome 😎\n🎉 MISSION SUCCESSFUL! 🎉", sender: 'crush', isEnd: true },
    'end_success_aww': { text: "Thank you, love you too 🥰\n💖 Aww! 💖", sender: 'crush', isEnd: true },
    'end_success_final': { text: "Aww, I love you so much too! 💖\n✨💖 You made my day! 💖✨", sender: 'crush', isEnd: true },
    'end_success_pata_hai': { text: "Mujhe pata hai, samjhe 😉\n😏 OBVIOUSLY! 😏", sender: 'crush', isEnd: true },
    'end_success_confident': { text: "Haan haan pata hai mujhe, har ladki mujhe dekh k aise diwani ho jaati hai 👑\n🔥 CONFIDENT MUCH? 🔥", sender: 'crush', isEnd: true }
};

// --- Global State ---
let currentId = 'start';
// Stores { type: 'sender'|'recipient', text: 'message', id: 'stepId', options: <Array> (optional, only for sender) }
let chatHistory = []; 
const historyElement = document.getElementById('chat-history');
const optionsElement = document.getElementById('options-container');
const backBtn = document.getElementById('backBtn');

// --- Helper Functions ---

/**
 * Spawns heart emojis from a given button element, relative to the phone container.
 * @param {HTMLElement} buttonElement The option button clicked.
 */
function spawnHearts(buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();
    const containerRect = document.querySelector('.phone-container').getBoundingClientRect();

    // Calculate button's position relative to the container for absolute positioning
    const buttonX = buttonRect.left - containerRect.left + (buttonRect.width / 2);
    const buttonY = buttonRect.top - containerRect.top + (buttonRect.height / 2);

    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.classList.add('heart-emoji');
        heart.innerHTML = '💖';
        
        // Randomize starting position slightly around the button's center
        const startX = buttonX + (Math.random() - 0.5) * 40;
        const startY = buttonY + (Math.random() - 0.5) * 20;

        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        
        heart.style.animationDelay = `${i * 0.15}s`; 

        document.querySelector('.phone-container').appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
}

/**
 * Renders a message bubble to the chat history.
 * @param {string} text The message content.
 * @param {string} type 'sender' or 'recipient'.
 * @param {number} delay Animation delay in milliseconds.
 */
function renderMessage(text, type, delay = 0) {
    const bubble = document.createElement('div');
    bubble.textContent = text;
    bubble.classList.add('message-bubble');
    
    if (type === 'sender') {
        bubble.classList.add('sender-message');
    } else {
        bubble.classList.add('recipient-message');
    }
    
    bubble.style.animationDelay = `${delay}ms`;
    historyElement.appendChild(bubble);

    // FIXED AUTO-SCROLL: Use requestAnimationFrame for reliable scrolling after DOM update
    requestAnimationFrame(() => {
        historyElement.scrollTop = historyElement.scrollHeight;
    });
}

/**
 * Displays the available options as buttons in the input area.
 * @param {Array<Object>} options The list of options.
 */
function displayOptions(options) {
    optionsElement.innerHTML = ''; // Clear previous options
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('option-btn', option.class);
        button.onclick = (event) => selectOption(option, event.target);
        optionsElement.appendChild(button);
    });
}

/**
 * Clears options and shows a realistic message input field (for end state).
 */
function hideOptions() {
    // New realistic input bar HTML
    optionsElement.innerHTML = `
        <div class="fake-input-bar">
            <button class="icon-btn" disabled title="Attach File">📎</button>
            <input type="text" placeholder="Type a message..." disabled class="flex-grow fake-text-input">
            <button class="icon-btn" disabled title="Camera">📸</button>
            <button class="send-btn" disabled title="Send">⬆️</button>
        </div>
    `;
}

/**
 * Handles user clicking an option.
 * @param {Object} option The selected option object.
 * @param {HTMLElement} buttonElement The button element that was clicked.
 */
function selectOption(option, buttonElement) {
    // 1. Render recipient's choice immediately
    renderMessage(option.text, 'recipient');
    
    // 2. Add recipient choice to history
    // We store the current step ID (the crush's question) so we know where the response was made
    chatHistory.push({ type: 'recipient', text: option.text, id: currentId }); 

    // 3. Trigger animation if positive
    if (option.isPositive) {
        spawnHearts(buttonElement);
    }

    // 4. Update current state and load next message
    currentId = option.next;
    loadNextStep(currentId);
}

/**
 * Loads and displays the next message from the chat flow.
 * @param {string} nextId The ID of the next step.
 */
function loadNextStep(nextId) {
    optionsElement.innerHTML = ''; // Clear options while sender types

    const step = chatFlow[nextId];
    if (!step) {
        console.error(`Chat step with ID ${nextId} not found.`);
        return;
    }

    // Simulate typing delay before showing the message
    setTimeout(() => {
        // 1. Render sender's message 
        renderMessage(step.text, step.sender === 'crush' ? 'sender' : 'sender', 0); 

        // 2. Add sender message to history
        // Note: The options property is critical for the goBack function
        chatHistory.push({ type: 'sender', text: step.text, id: nextId, options: step.options });

        // 3. Display next options or end the conversation
        if (step.isEnd) {
            hideOptions();
        } else {
            displayOptions(step.options);
        }
        
        updateControlButtons();
    }, 500); // 500ms delay to simulate the "crush" typing
}

/**
 * Reverts the chat one full interaction back (removing the last user reply and the last crush message).
 */
function goBack() {
    // Check if there are enough messages to go back (must be at least 3: SENDER, RECIPIENT, SENDER)
    if (chatHistory.length < 3) {
        // If only the initial message exists, we reset to keep it clean.
        resetChat();
        return;
    }

    // A full interaction cycle is (RECIPIENT choice + SENDER response). We need to remove 2 steps.
    // The target index is 3 steps back, which is the previous SENDER message with options.
    const targetIndex = chatHistory.length - 3; 

    // 1. Truncate history to the state before the last user interaction
    chatHistory = chatHistory.slice(0, targetIndex + 1);
    
    // 2. Restore the state from the previous sender message
    const previousStep = chatHistory[targetIndex];
    currentId = previousStep.id;

    // 3. Re-render the chat history from scratch
    historyElement.innerHTML = '';
    // Render without animation delay when restoring history
    chatHistory.forEach(msg => renderMessage(msg.text, msg.type, 0)); 
    
    // 4. Re-display options
    displayOptions(previousStep.options);

    updateControlButtons();
}

/**
 * Starts the chat over from the beginning.
 */
function resetChat() {
    chatHistory = [];
    historyElement.innerHTML = '';
    currentId = 'start';
    loadNextStep(currentId);
}

/**
 * Helper function to enable/disable the back button.
 */
function updateControlButtons() {
    // Back button is disabled if chat history length is less than 3 (less than one full interaction cycle)
    backBtn.disabled = chatHistory.length < 3;
}

// --- Initial Load ---
window.onload = resetChat;

// --- THEME SWITCHING ---
function setTheme(themeName) {
    // Remove all theme classes from body
    document.body.classList.remove('whatsapp-theme', 'instagram-theme');
    
    // Add the selected theme class (if not default)
    if (themeName !== 'default') {
        document.body.classList.add(`${themeName}-theme`);
    }

    // Update active button in theme selector
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });

    // Store theme preference in localStorage
    localStorage.setItem('selectedTheme', themeName);
}

// Load saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    setTheme(savedTheme);
});
