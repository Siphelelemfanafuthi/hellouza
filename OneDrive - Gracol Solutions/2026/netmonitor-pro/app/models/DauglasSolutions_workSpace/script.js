const portalModal = document.getElementById('portalModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const quoteResult = document.getElementById('quoteResult');
const getStartedBtn = document.getElementById('getStartedBtn');
const portalButtons = document.querySelectorAll('.portal-button');
const closeModalButton = document.querySelector('.modal-close');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');
const clientLoginBtn = document.getElementById('clientLoginBtn');
const clientSignupBtn = document.getElementById('clientSignupBtn');
const employeeForm = document.getElementById('employeeForm');
const employeeNameInput = document.getElementById('employeeName');
const employeeList = document.getElementById('employeeList');
const newAlerts = document.getElementById('newAlerts');
const newClients = document.getElementById('newClients');
const openIssues = document.getElementById('openIssues');
const featureCards = document.querySelectorAll('.feature-card');
const featureGuideTitle = document.getElementById('featureGuideTitle');
const featureGuideText = document.getElementById('featureGuideText');
const featureActionBtn = document.getElementById('featureActionBtn');
const clientGuideTitle = document.getElementById('clientGuideTitle');
const clientGuideText = document.getElementById('clientGuideText');
const clientActionBtn = document.getElementById('clientActionBtn');
const adminGuideTitle = document.getElementById('adminGuideTitle');
const adminGuideText = document.getElementById('adminGuideText');
const adminActionBtn = document.getElementById('adminActionBtn');

const quotePackages = {
    basic: {
        title: 'Basic Helpdesk',
        price: 'R1,499 / month',
        description: 'Entry-level communication and support access for new customers. Includes ticket logging, email updates, and monthly check-ins.',
        benefits: ['Helpdesk ticket creation', 'Email support', 'Monthly service report']
    },
    pro: {
        title: 'Pro Support',
        price: 'R3,499 / month',
        description: 'Priority support with AI-assisted chat, phone escalation, and SLA tracking for growing businesses.',
        benefits: ['AI chat assistance', '24/7 monitoring', 'Dedicated support line', 'SLA management']
    },
    enterprise: {
        title: 'Enterprise Partner',
        price: 'Custom pricing',
        description: 'Custom partner engagement for OEMs, tenders, and long-term business growth. Includes portal access, sales coordination, and account management.',
        benefits: ['Partner onboarding', 'Dedicated account manager', 'Issue tracking', 'Custom quotes']
    }
};

const storage = {
    get(key, fallback) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatPanel = document.getElementById('chatPanel');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const identityForm = document.getElementById('identityForm');
const identityInput = document.getElementById('identityInput');
const assistantConversation = document.getElementById('assistantConversation');
const assistantLog = document.getElementById('assistantLog');
const assistantChatForm = document.getElementById('assistantChatForm');
const assistantInput = document.getElementById('assistantInput');

function getAssistantUser() {
    return storage.get('assistantUser', null);
}

function setAssistantUser(name) {
    storage.set('assistantUser', name);
}

function appendAssistantMessage(role, text) {
    const message = document.createElement('p');
    message.classList.add(role);
    message.innerHTML = text;
    assistantLog.appendChild(message);
    assistantLog.scrollTop = assistantLog.scrollHeight;
}

function renderAssistantHistory() {
    const messages = storage.get('assistantMessages', []);
    assistantLog.innerHTML = '';
    if (messages.length === 0) {
        assistantLog.innerHTML = '<p style="color:#888;">The assistant is ready. Ask a question or request a quote.</p>';
        return;
    }
    messages.forEach(msg => appendAssistantMessage(msg.role, msg.text));
}

function saveAssistantMessage(role, text) {
    const messages = storage.get('assistantMessages', []);
    messages.push({ role, text, time: new Date().toISOString() });
    storage.set('assistantMessages', messages);
}

function showAssistantConversation() {
    const user = getAssistantUser();
    if (!user) return;
    document.querySelector('.assistant-welcome').classList.add('hidden');
    assistantConversation.classList.remove('hidden');
    assistantChatForm.classList.remove('hidden');
    renderAssistantHistory();
    const messages = storage.get('assistantMessages', []);
    if (messages.length === 0) {
        const greeting = `Hello ${user}! I am your persistent AI assistant. Ask about support, quotes, membership, or portal access.`;
        appendAssistantMessage('assistant', greeting);
        saveAssistantMessage('assistant', greeting);
    }
}

function resetAssistantConversation() {
    assistantLog.innerHTML = '';
    assistantConversation.classList.add('hidden');
    assistantChatForm.classList.add('hidden');
    document.querySelector('.assistant-welcome').classList.remove('hidden');
}

function handleAssistantResponse(userMessage) {
    let response = 'Thanks for your message. We will get back to you with next steps.';
    const normalized = userMessage.toLowerCase();
    if (normalized.includes('quote')) {
        response = 'I have logged your quote request. A specialist will prepare pricing details and contact you shortly.';
    } else if (normalized.includes('support') || normalized.includes('issue') || normalized.includes('help')) {
        response = 'Your support request is recorded. The helpdesk team has been notified and will review the issue now.';
    } else if (normalized.includes('membership') || normalized.includes('join')) {
        response = 'I have noted your membership interest. Our client onboarding team will reach out with account setup information.';
    } else if (normalized.includes('partner') || normalized.includes('tender')) {
        response = 'Partner request received. Our business relations team will contact you for the next steps.';
    }
    appendAssistantMessage('assistant', response);
    saveAssistantMessage('assistant', response);
    incrementCounter('dauglasAlerts');
    loadAdminData();
}

function toggleChatPanel() {
    chatPanel.classList.toggle('hidden');
}

function initializeAssistant() {
    if (!assistantConversation || !assistantLog) return;
    const user = getAssistantUser();
    if (user) {
        showAssistantConversation();
        renderAssistantHistory();
    }
}

function openModal(type) {
    portalModal.classList.remove('hidden');
    setActiveTab(type || 'public');
    if (type === 'public') {
        modalTitle.textContent = 'Public Website Quotes';
        modalSubtitle.textContent = 'Select the package that suits your communication and support needs.';
    } else if (type === 'client') {
        modalTitle.textContent = 'Client Portal';
        modalSubtitle.textContent = 'Create your account, ask for support, and keep all communication in one place.';
    } else {
        modalTitle.textContent = 'Admin Portal';
        modalSubtitle.textContent = 'Monitor helpdesk alerts, create employees, and manage new client activity.';
    }
}

function closeModal() {
    portalModal.classList.add('hidden');
}

function setActiveTab(name) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === name);
    });
    tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${name}`);
    });
    if (name === 'public') {
        showQuote('basic');
    } else if (name === 'client') {
        updateClientChatStats();
    } else {
        loadAdminData();
    }
}

function showQuote(key) {
    const quote = quotePackages[key];
    quoteResult.innerHTML = `
        <h4>${quote.title}</h4>
        <p><strong>Starting price:</strong> ${quote.price}</p>
        <p>${quote.description}</p>
        <ul>${quote.benefits.map(item => `<li>${item}</li>`).join('')}</ul>
        <p><strong>Recommended when:</strong> ${key === 'basic' ? 'you need a simple communication path and helpdesk entry.' : key === 'pro' ? 'you require faster response times and proactive support.' : 'you are planning partnerships, tenders, or enterprise integration.'}</p>
    `;
}

const featureGuides = {
    public: {
        basic: {
            title: 'Basic Helpdesk Guide',
            description: 'This package gives you direct access to our helpdesk. Use it for quick ticket creation, status updates, and standard support requests. Click Start Quote when you are ready to get pricing and membership details.',
            button: 'Ask for Quote',
            action: 'quote',
            quotePackage: 'basic'
        },
        pro: {
            title: 'Pro Support Guide',
            description: 'Pro Support includes priority communication, AI-assisted chat, and SLA tracking. It is ideal for businesses that need fast response times and workflow monitoring. Click Start Quote to request a tailored pro package.',
            button: 'Ask for Quote',
            action: 'quote',
            quotePackage: 'pro'
        },
        enterprise: {
            title: 'Enterprise Partner Guide',
            description: 'Enterprise partner plans are for OEM relationships, tender-ready engagements, and large-scale communication setups. Click Start Quote to begin the partner onboarding process.',
            button: 'Request Partner Quote',
            action: 'quote',
            quotePackage: 'enterprise'
        }
    },
    client: {
        support: {
            title: 'Support Ticket Guide',
            description: 'Submit a support ticket here and our helpdesk team will track it. This is the main way to report issues and request technical assistance. Click Start Now to open your helpdesk session.',
            button: 'Open Support',
            action: 'contact'
        },
        chat: {
            title: 'AI Chat Guide',
            description: 'Use our AI chat to describe your problem, request a quote, or ask about services. The system logs your issue and notifies the admin team automatically.',
            button: 'Use AI Chat',
            action: 'chat'
        },
        membership: {
            title: 'Membership Guide',
            description: 'Create an account to become a registered client. Members get faster support, special offers, and one-click communication access.',
            button: 'Join Now',
            action: 'join'
        },
        partner: {
            title: 'Partner Request Guide',
            description: 'Interested in becoming a partner for OEM or tenders? Use this feature to start the partner qualification process and open business conversations.',
            button: 'Partner Request',
            action: 'partner'
        }
    },
    admin: {
        alerts: {
            title: 'Alerts Dashboard Guide',
            description: 'See new communication alerts, track urgent client requests, and respond quickly. This section keeps your operations aware of real-time support demand.',
            button: 'View Alerts',
            action: 'manage'
        },
        employees: {
            title: 'Employee Management Guide',
            description: 'Create employee accounts for your helpdesk team. Assign them to monitor support tickets, client conversations, and daily issue workflows.',
            button: 'Add Employee',
            action: 'manage'
        },
        clients: {
            title: 'Client Registration Guide',
            description: 'Monitor new client registrations and welcome members to the portal. This helps keep your customer base organized and ready for communication.',
            button: 'Review Clients',
            action: 'manage'
        },
        issues: {
            title: 'Issue Tracking Guide',
            description: 'Track open issues through the portal and escalate them as needed. Use this feature to keep your helpdesk pipeline transparent and accountable.',
            button: 'Track Issues',
            action: 'manage'
        }
    }
};

function showFeatureGuide(tab, feature) {
    const guide = featureGuides[tab] && featureGuides[tab][feature];
    if (!guide) return;

    let titleEl;
    let textEl;
    let actionBtn;

    if (tab === 'public') {
        titleEl = document.getElementById('featureGuideTitle');
        textEl = document.getElementById('featureGuideText');
        actionBtn = document.getElementById('featureActionBtn');
    } else if (tab === 'client') {
        titleEl = document.getElementById('clientGuideTitle');
        textEl = document.getElementById('clientGuideText');
        actionBtn = document.getElementById('clientActionBtn');
    } else if (tab === 'admin') {
        titleEl = document.getElementById('adminGuideTitle');
        textEl = document.getElementById('adminGuideText');
        actionBtn = document.getElementById('adminActionBtn');
    }

    if (!titleEl || !textEl || !actionBtn) return;

    titleEl.textContent = guide.title;
    textEl.textContent = guide.description;
    actionBtn.textContent = guide.button;
    actionBtn.dataset.action = guide.action;
    actionBtn.dataset.feature = feature;
    if (tab === 'public' && guide.quotePackage) {
        showQuote(guide.quotePackage);
    }
}

function activateFeatureButtons(tab, feature) {
    document.querySelectorAll(`#tab-${tab} .feature-card`).forEach(card => {
        card.classList.toggle('active', card.dataset.feature === feature);
    });
}

function handleFeatureClick(event) {
    const button = event.currentTarget;
    const tabPanel = button.closest('.tab-panel');
    const tab = tabPanel ? tabPanel.id.replace('tab-', '') : 'public';
    const feature = button.dataset.feature;
    showFeatureGuide(tab, feature);
    activateFeatureButtons(tab, feature);
}

function handlePortalAction(event) {
    const button = event.currentTarget;
    const action = button.dataset.action;
    const feature = button.dataset.feature;
    switch (action) {
        case 'quote': {
            const url = `quote.html${feature ? `?package=${encodeURIComponent(feature)}` : ''}`;
            window.location.href = url;
            break;
        }
        case 'join':
            window.location.href = 'signup.html';
            break;
        case 'contact':
            window.location.href = 'quote.html?type=support';
            break;
        case 'chat':
            if (chatPanel) chatPanel.classList.remove('hidden');
            if (assistantInput) assistantInput.focus();
            break;
        case 'partner':
            window.location.href = 'quote.html?package=partner';
            break;
        case 'manage':
            window.alert('Use the admin panels below to view alerts, issues, clients, and employees.');
            break;
        default:
            window.alert('Action starting...');
    }
}

function loadInitialFeatureGuides() {
    showFeatureGuide('public', 'basic');
    activateFeatureButtons('public', 'basic');
    showFeatureGuide('client', 'support');
    activateFeatureButtons('client', 'support');
    showFeatureGuide('admin', 'alerts');
    activateFeatureButtons('admin', 'alerts');
}

function appendChatMessage(role, text) {
    const message = document.createElement('p');
    message.classList.add(role);
    message.innerHTML = text;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function loadChatMessages() {
    const messages = storage.get('dauglasChatMessages', []);
    chatLog.innerHTML = '';
    if (messages.length === 0) {
        chatLog.innerHTML = '<p style="color:#888;">Chat is ready. Send your first support or quote request.</p>';
        return;
    }
    messages.forEach(msg => appendChatMessage(msg.role, msg.text));
}

function saveChatMessage(role, text) {
    const messages = storage.get('dauglasChatMessages', []);
    messages.push({ role, text, time: new Date().toISOString() });
    storage.set('dauglasChatMessages', messages);
}

function notifyAdmin(type, detail) {
    const alerts = storage.get('dauglasAlerts', 0) + 1;
    storage.set('dauglasAlerts', alerts);
    loadAdminData();
    window.alert(`New ${type} alert: ${detail}`);
}

function updateClientChatStats() {
    const messages = storage.get('dauglasChatMessages', []);
    if (messages.length === 0) {
        chatLog.innerHTML = '<p style="color:#888;">AI chat is ready to log your first message.</p>';
    }
}

function handleChatSubmit(event) {
    event.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    if (chatLog.querySelector('p[style]')) {
        chatLog.innerHTML = '';
    }
    appendChatMessage('client', value);
    saveChatMessage('client', value);
    const messages = storage.get('dauglasChatMessages', []);
    if (messages.length === 1) {
        incrementCounter('dauglasClients');
        notifyAdmin('new client', 'A new client has started communication.');
    } else {
        notifyAdmin('communication', 'A client message requires attention.');
    }
    chatInput.value = '';
    setTimeout(() => {
        const response = `Hello! I have logged your request: "${value}". Our helpdesk will follow up with a quote and status update.`;
        appendChatMessage('agent', response);
        saveChatMessage('agent', response);
        incrementCounter('dauglasIssues');
        loadAdminData();
    }, 800);
}

function incrementCounter(key) {
    const value = storage.get(key, 0) + 1;
    storage.set(key, value);
}

function loadAdminData() {
    newAlerts.textContent = storage.get('dauglasAlerts', 0);
    newClients.textContent = storage.get('dauglasClients', 0);
    openIssues.textContent = storage.get('dauglasIssues', 0);
    const employees = storage.get('dauglasEmployees', []);
    employeeList.innerHTML = employees.map(name => `<li>${name}</li>`).join('') || '<li style="color:#888;">No employee accounts yet.</li>';
}

function addEmployee(event) {
    event.preventDefault();
    const name = employeeNameInput.value.trim();
    if (!name) return;
    const employees = storage.get('dauglasEmployees', []);
    employees.push(name);
    storage.set('dauglasEmployees', employees);
    employeeNameInput.value = '';
    loadAdminData();
}

function initialize() {
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            window.location.href = 'quote.html';
        });
    }
    portalButtons.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.portal));
    });
    closeModalButton.addEventListener('click', closeModal);
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeModal();
    });
    document.querySelectorAll('.quote-option').forEach(btn => {
        btn.addEventListener('click', () => showQuote(btn.dataset.quote));
    });
    featureCards.forEach(btn => {
        btn.addEventListener('click', handleFeatureClick);
    });
    if (featureActionBtn) featureActionBtn.addEventListener('click', handlePortalAction);
    if (clientActionBtn) clientActionBtn.addEventListener('click', handlePortalAction);
    if (adminActionBtn) adminActionBtn.addEventListener('click', handlePortalAction);
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);
    if (clientLoginBtn) clientLoginBtn.addEventListener('click', () => window.alert('Client login is available after system integration. This prototype shows how the portal would behave.'));
    if (clientSignupBtn) clientSignupBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
    });
    if (employeeForm) employeeForm.addEventListener('submit', addEmployee);
    if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChatPanel);
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChatPanel);
    if (identityForm) identityForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = identityInput.value.trim();
        if (!name) return;
        setAssistantUser(name);
        showAssistantConversation();
        renderAssistantHistory();
    });
    if (assistantChatForm) assistantChatForm.addEventListener('submit', event => {
        event.preventDefault();
        const text = assistantInput.value.trim();
        if (!text) return;
        appendAssistantMessage('user', text);
        saveAssistantMessage('user', text);
        assistantInput.value = '';
        setTimeout(() => handleAssistantResponse(text), 600);
    });
    loadChatMessages();
    loadAdminData();
    loadInitialFeatureGuides();
    initializeAssistant();
    if (chatPanel) chatPanel.classList.remove('hidden');
}

initialize();