// Demo data
const demoUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', role: 'Student', profilePic: 'https://via.placeholder.com/40', lastMessage: 'Hey, how are you?' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'Teacher', profilePic: 'https://via.placeholder.com/40', lastMessage: 'The assignment is due tomorrow' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', role: 'Student', profilePic: 'https://via.placeholder.com/40', lastMessage: 'Thanks for the help!' }
];

const demoMessages = {
    1: [
        { id: 1, sender: 1, text: 'Hey, how are you?', timestamp: '2024-02-09T10:00:00' },
        { id: 2, sender: 'currentUser', text: 'I\'m good, thanks! How about you?', timestamp: '2024-02-09T10:01:00' },
        { id: 3, sender: 1, text: 'Doing great! Did you finish the assignment?', timestamp: '2024-02-09T10:02:00' }
    ],
    2: [
        { id: 1, sender: 2, text: 'The assignment is due tomorrow', timestamp: '2024-02-09T09:00:00' },
        { id: 2, sender: 'currentUser', text: 'Yes, I\'m working on it now', timestamp: '2024-02-09T09:01:00' },
        { id: 3, sender: 2, text: 'Great, let me know if you need help', timestamp: '2024-02-09T09:02:00' }
    ],
    3: [
        { id: 1, sender: 3, text: 'Thanks for the help!', timestamp: '2024-02-09T08:00:00' },
        { id: 2, sender: 'currentUser', text: 'You\'re welcome!', timestamp: '2024-02-09T08:01:00' }
    ]
};

let currentChat = null;

// Create chat item element
function createChatItem(user) {
    const div = document.createElement('div');
    div.className = `chat-item ${currentChat === user.id ? 'active' : ''}`;
    div.dataset.userId = user.id; // Add data attribute for easier selection

    div.innerHTML = `
                <img src="${user.profilePic}" class="chat-item-avatar" alt="Profile">
                <div>
                    <h6 class="mb-1">${user.firstName} ${user.lastName}</h6>
                    <small class="text-muted">${user.lastMessage}</small>
                </div>
            `;

    // Add click event listener directly to the element
    div.addEventListener('click', () => {
        selectChat(user.id);
        // Close sidebar on mobile when a chat is selected
        if (window.innerWidth < 768) {
            closeChatSidebar();
        }
    });

    return div;
}

// Select a chat
function selectChat(userId) {
    currentChat = userId;
    const user = demoUsers.find(u => u.id === userId);

    if (!user) return;

    // Update active states
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });

    const selectedItem = document.querySelector(`.chat-item[data-user-id="${userId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    // Update chat header
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.classList.remove('d-none');
    chatHeader.querySelector('.flex-grow-1').innerHTML = `
                <img src="${user.profilePic}" class="chat-item-avatar" alt="Profile">
                <div>
                    <h6 class="mb-1">${user.firstName} ${user.lastName}</h6>
                    <small class="text-muted">${user.role}</small>
                </div>
            `;

    // Show chat input and hide no chat selected message
    document.querySelector('.chat-input').classList.remove('d-none');
    document.querySelector('.no-chat-selected').style.display = 'none';

    // Load messages
    loadMessages(userId);
}

// Load messages for a chat
function loadMessages(userId) {
    const messagesContainer = document.getElementById('messageContainer');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    const messages = demoMessages[userId] || [];
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });

    scrollToBottom();
}

// Create message element
function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.sender === 'currentUser' ? 'sent' : 'received'}`;

    const timestamp = new Date(message.timestamp);
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.innerHTML = `
                <div class="message-content">${message.text}</div>
                <small class="message-time">${timeString}</small>
            `;

    return div;
}

// Initialize recent chats
function loadRecentChats() {
    const chatListContainer = document.querySelector('.chat-list-container');
    if (!chatListContainer) return;

    chatListContainer.innerHTML = '';
    demoUsers.forEach(user => {
        const chatItem = createChatItem(user);
        chatListContainer.appendChild(chatItem);
    });
}

// Send a message
function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) return;

    const message = input.value.trim();

    if (!message || !currentChat) return;

    // Create new message
    const newMessage = {
        id: Date.now(),
        sender: 'currentUser',
        text: message,
        timestamp: new Date().toISOString()
    };

    // Add to demo data
    if (!demoMessages[currentChat]) {
        demoMessages[currentChat] = [];
    }
    demoMessages[currentChat].push(newMessage);

    // Update UI
    const messagesContainer = document.getElementById('messageContainer');
    if (messagesContainer) {
        messagesContainer.appendChild(createMessageElement(newMessage));
    }

    // Clear input and scroll
    input.value = '';
    scrollToBottom();

    // Update last message in chat list
    updateLastMessage(currentChat, message);
}

// Update last message in chat list
function updateLastMessage(userId, message) {
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
        user.lastMessage = message;
        loadRecentChats();
        // Keep the current chat selected after updating the list
        const selectedItem = document.querySelector(`.chat-item[data-user-id="${currentChat}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }
}

// Scroll to bottom of messages
function scrollToBottom() {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// Open chat sidebar on mobile - renamed to make distinction clear
function openChatSidebar() {
    document.querySelector('.chat-sidebar').classList.add('show');
    document.querySelector('.sidebar-overlay1').classList.add('show');
}

// Close chat sidebar on mobile - renamed to make distinction clear
function closeChatSidebar() {
    document.querySelector('.chat-sidebar').classList.remove('show');
    document.querySelector('.sidebar-overlay1').classList.remove('show');
}

// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load initial chats
    loadRecentChats();

    // Setup message input handler
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Setup search handler
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = demoUsers.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm)
            );

            const chatListContainer = document.querySelector('.chat-list-container');
            if (chatListContainer) {
                chatListContainer.innerHTML = '';
                filteredUsers.forEach(user => {
                    const chatItem = createChatItem(user);
                    chatListContainer.appendChild(chatItem);
                });
                // Keep the current chat selected after filtering
                if (currentChat) {
                    const selectedItem = document.querySelector(`.chat-item[data-user-id="${currentChat}"]`);
                    if (selectedItem) {
                        selectedItem.classList.add('active');
                    }
                }
            }
        });
    }

    // Setup mobile chat sidebar handlers - Renamed and made more specific
    const chatMobileToggles = document.querySelectorAll('.chat-main .mobile-toggle');
    const chatSidebarOverlay = document.querySelector('.sidebar-overlay1');
    const closeChatSidebarBtn = document.querySelector('.chat-sidebar .close-sidebar');

    chatMobileToggles.forEach(toggle => {
        toggle.addEventListener('click', openChatSidebar);
    });

    if (chatSidebarOverlay) {
        chatSidebarOverlay.addEventListener('click', closeChatSidebar);
    }

    if (closeChatSidebarBtn) {
        closeChatSidebarBtn.addEventListener('click', closeChatSidebar);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            // Make sure sidebar is visible on larger screens
            document.querySelector('.chat-sidebar').classList.remove('show');
            document.querySelector('.sidebar-overlay1').classList.remove('show');
        }
    });
});