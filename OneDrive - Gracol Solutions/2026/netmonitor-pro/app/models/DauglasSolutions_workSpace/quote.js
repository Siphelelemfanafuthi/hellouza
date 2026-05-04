// Quote form utilities
const MAX_QUOTE_HISTORY = 50; // Limit localStorage growth

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function saveQuoteRequest(request) {
    try {
        const requests = JSON.parse(localStorage.getItem('dauglasQuoteRequests') || '[]');
        requests.push(request);
        
        // Keep only last MAX_QUOTE_HISTORY entries
        const trimmed = requests.slice(-MAX_QUOTE_HISTORY);
        localStorage.setItem('dauglasQuoteRequests', JSON.stringify(trimmed));
        return true;
    } catch (error) {
        console.error('Failed to save quote request:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const quotePackage = getQueryParam('package');
    const quoteType = getQueryParam('type');
    const packageInput = document.getElementById('quotePackage');
    const quoteSuccess = document.getElementById('quoteSuccess');
    const quoteForm = document.getElementById('quoteForm');

    // Guard against missing elements
    if (!quoteForm || !packageInput || !quoteSuccess) {
        console.error('Required form elements not found');
        return;
    }

    // Pre-select package from URL
    if (quotePackage && packageInput) {
        const option = Array.from(packageInput.options).find(opt => opt.value === quotePackage);
        if (option) option.selected = true;
    }
    if (quoteType === 'support' && packageInput) {
        packageInput.value = 'basic';
    }

    quoteForm.addEventListener('submit', event => {
        event.preventDefault();
        
        const nameInput = document.getElementById('quoteName');
        const emailInput = document.getElementById('quoteEmail');
        const phoneInput = document.getElementById('quotePhone');
        const companyInput = document.getElementById('quoteCompany');
        const detailsInput = document.getElementById('quoteDetails');

        // Guard against missing inputs
        if (!nameInput || !emailInput || !phoneInput || !companyInput || !detailsInput) {
            quoteSuccess.classList.remove('hidden');
            quoteSuccess.textContent = 'Error: Form fields are missing. Please refresh the page.';
            quoteSuccess.style.background = 'rgba(255, 0, 0, 0.1)';
            quoteSuccess.style.borderColor = 'rgba(255, 0, 0, 0.3)';
            return;
        }

        const request = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            company: companyInput.value.trim(),
            package: packageInput.value,
            details: detailsInput.value.trim(),
            submittedAt: new Date().toISOString()
        };

        const saved = saveQuoteRequest(request);
        
        if (saved) {
            quoteForm.reset();
            quoteSuccess.classList.remove('hidden');
            quoteSuccess.style.background = 'rgba(0, 255, 136, 0.08)';
            quoteSuccess.style.borderColor = 'rgba(0, 255, 136, 0.25)';
            quoteSuccess.textContent = `Thanks ${request.name}! Your quote request has been submitted. We will contact you at ${request.email} shortly.`;
            
            // TODO: Send to backend API instead of localStorage
            // Example: fetch('/api/quotes', { method: 'POST', body: JSON.stringify(request) })
        } else {
            quoteSuccess.classList.remove('hidden');
            quoteSuccess.style.background = 'rgba(255, 0, 0, 0.1)';
            quoteSuccess.style.borderColor = 'rgba(255, 0, 0, 0.3)';
            quoteSuccess.textContent = 'Failed to save your request. Storage may be full. Please contact us directly.';
        }
    });
});


