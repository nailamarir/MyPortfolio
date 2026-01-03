// Global variable to store knowledge base
let knowledgeBase = null;

// Load knowledge base on page load
async function loadKnowledgeBase() {
    try {
        console.log('Attempting to load knowledge base...');
        const response = await fetch('knowledge-base.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        knowledgeBase = await response.json();
        console.log('Knowledge base loaded successfully!', knowledgeBase);
        populatePage();
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        alert('Error loading data. Please check browser console (F12) for details.');
        // Fallback content if JSON fails to load
        displayFallbackContent();
    }
}

// Populate all page sections with data from knowledge base
function populatePage() {
    if (!knowledgeBase) return;

    // Hero Section
    document.getElementById('hero-name').textContent = knowledgeBase.personal.name;
    document.getElementById('hero-title').textContent = knowledgeBase.personal.title;
    document.getElementById('hero-tagline').textContent = knowledgeBase.personal.tagline;
    
    // Footer
    document.getElementById('footer-name').textContent = knowledgeBase.personal.name;

    // Social Links
    const socialLinksContainer = document.getElementById('social-links');
    socialLinksContainer.innerHTML = '';
    
    const socialIcons = {
        'google_scholar': '🎓',
        'linkedin': '💼',
        'researchgate': '📊',
        'orcid': '🔬',
        'scopus': '📚'
    };

    for (const [key, url] of Object.entries(knowledgeBase.social_links)) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.title = key.replace('_', ' ').toUpperCase();
        link.textContent = socialIcons[key] || '🔗';
        socialLinksContainer.appendChild(link);
    }

    // About Section
    document.getElementById('about-summary').textContent = knowledgeBase.summary;

    // Stats
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';
    
    for (const [key, value] of Object.entries(knowledgeBase.statistics)) {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';
        statCard.innerHTML = `
            <h3>${value}</h3>
            <p>${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        `;
        statsContainer.appendChild(statCard);
    }

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    // Combine all skills
    const allSkills = [
        ...knowledgeBase.skills.programming_languages,
        ...knowledgeBase.skills.deep_learning_frameworks,
        ...knowledgeBase.skills.big_data_technologies.slice(0, 3),
        ...knowledgeBase.skills.other_skills.slice(0, 4)
    ];

    allSkills.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'skill-badge';
        badge.textContent = skill;
        skillsContainer.appendChild(badge);
    });

    // Research Areas
    const researchGrid = document.getElementById('research-grid');
    researchGrid.innerHTML = '';
    
    knowledgeBase.research_areas.forEach(area => {
        const card = document.createElement('div');
        card.className = 'research-card';
        
        const topicsList = area.topics.map(topic => `<li>${topic}</li>`).join('');
        
        card.innerHTML = `
            <h3>${area.icon} ${area.title}</h3>
            <ul>${topicsList}</ul>
        `;
        researchGrid.appendChild(card);
    });

    // Publications
    const publicationsList = document.getElementById('publications-list');
    publicationsList.innerHTML = '';
    
    knowledgeBase.selected_publications.forEach(pub => {
        const item = document.createElement('div');
        item.className = 'publication-item';
        
        let venue = pub.venue;
        if (pub.year) venue += `, ${pub.year}`;
        if (pub.pages) venue += `, ${pub.pages}`;
        if (pub.award) venue += ` (${pub.award})`;
        
        item.innerHTML = `
            <h4>${pub.title}</h4>
            <p>${pub.authors}. ${venue}.</p>
        `;
        publicationsList.appendChild(item);
    });

    // Contact Information
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
        <div class="contact-card">
            <h3>📧 Email</h3>
            <a href="mailto:${knowledgeBase.contact.email}">${knowledgeBase.contact.email}</a>
        </div>
        <div class="contact-card">
            <h3>🏢 Institution</h3>
            <p>${knowledgeBase.personal.institution}<br>${knowledgeBase.personal.department}<br>${knowledgeBase.personal.location}</p>
        </div>
        <div class="contact-card">
            <h3>📱 Phone</h3>
            <p>${knowledgeBase.contact.phone}<br>${knowledgeBase.contact.office_phone}</p>
        </div>
    `;
}

// Fallback content if JSON fails to load
function displayFallbackContent() {
    console.log('Using fallback content...');
    
    document.getElementById('hero-name').textContent = 'Dr. Naila Marir';
    document.getElementById('hero-title').textContent = 'AI & Cybersecurity Researcher';
    document.getElementById('hero-tagline').textContent = 'Assistant Professor | Data-Centric AI | Federated Learning | Big Data Analytics';
    
    // Add fallback summary
    const summary = document.getElementById('about-summary');
    summary.textContent = 'Dr. Naila Marir serves as an Assistant Professor in the Computer Science Department at Effat University. She specializes in artificial intelligence and cybersecurity, with research centered on Data-Centric AI, Federated Learning, and Big Data Analytics.';
    
    // Add fallback stats
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <div class="stat-card"><h3>10+</h3><p>Years Experience</p></div>
        <div class="stat-card"><h3>15+</h3><p>Publications</p></div>
        <div class="stat-card"><h3>20+</h3><p>Students Supervised</p></div>
        <div class="stat-card"><h3>10+</h3><p>Courses Taught</p></div>
    `;
    
    // Add fallback skills
    const skillsContainer = document.getElementById('skills-container');
    const skills = ['Python', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Apache Spark', 'Hadoop', 'Network Security', 'Federated Learning', 'NLP', 'Business Intelligence'];
    skillsContainer.innerHTML = skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('');
    
    // Add fallback research areas
    const researchGrid = document.getElementById('research-grid');
    researchGrid.innerHTML = `
        <div class="research-card">
            <h3>🤖 Artificial Intelligence</h3>
            <ul>
                <li>Data-Centric AI</li>
                <li>Federated Learning</li>
                <li>Generative AI</li>
                <li>Deep Learning Techniques</li>
            </ul>
        </div>
        <div class="research-card">
            <h3>🔒 Cybersecurity</h3>
            <ul>
                <li>Network Security</li>
                <li>Intrusion Detection Systems</li>
                <li>Malware Detection</li>
                <li>IoT Security</li>
            </ul>
        </div>
        <div class="research-card">
            <h3>📊 Big Data Analytics</h3>
            <ul>
                <li>Distributed Computing</li>
                <li>Apache Spark</li>
                <li>Abnormal Behavior Detection</li>
                <li>Data Processing at Scale</li>
            </ul>
        </div>
        <div class="research-card">
            <h3>💬 Natural Language Processing</h3>
            <ul>
                <li>Sentiment Analysis</li>
                <li>Text Mining</li>
                <li>MOOC Analytics</li>
                <li>Social Media Analysis</li>
            </ul>
        </div>
    `;
    
    // Add fallback publications
    const publicationsList = document.getElementById('publications-list');
    publicationsList.innerHTML = `
        <div class="publication-item">
            <h4>Distributed Abnormal Behavior Detection System Based on Deep Learning Techniques</h4>
            <p>Marir N., Wang H., et al. IEEE Transactions on Network and Service Management. (Accepted with revision)</p>
        </div>
        <div class="publication-item">
            <h4>Distributed Abnormal Behavior Detection Approach based on Deep Belief Network and Ensemble SVM using Spark</h4>
            <p>Marir N., Wang H., et al. IEEE Access, 2018, 6: 59657-59671.</p>
        </div>
        <div class="publication-item">
            <h4>Unsupervised Feature Learning with Distributed Stacked Denoising Sparse Autoencoder for Abnormal Behavior Detection</h4>
            <p>IEEE International Conference on Knowledge Innovation and Invention 2019, Seoul, Korea. (Best Paper Award)</p>
        </div>
    `;
    
    // Add fallback contact
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
        <div class="contact-card">
            <h3>📧 Email</h3>
            <a href="mailto:namarir@effatuniversity.edu.sa">namarir@effatuniversity.edu.sa</a>
        </div>
        <div class="contact-card">
            <h3>🏢 Institution</h3>
            <p>Effat University<br>Computer Science Department<br>Jeddah, Saudi Arabia</p>
        </div>
        <div class="contact-card">
            <h3>📱 Phone</h3>
            <p>+966 50 7337478<br>+966 122137855</p>
        </div>
    `;
    
    // Add fallback social links
    const socialLinksContainer = document.getElementById('social-links');
    socialLinksContainer.innerHTML = `
        <a href="https://scholar.google.com/citations?user=vgxz ZRYAAAAJ&hl=en&oi=ao" target="_blank" title="Google Scholar">🎓</a>
        <a href="https://www.linkedin.com/in/naila-marir-7250139b/" target="_blank" title="LinkedIn">💼</a>
        <a href="https://www.researchgate.net/profile/Naila-Marir" target="_blank" title="ResearchGate">📊</a>
        <a href="https://orcid.org/0000-0001-6633-9099" target="_blank" title="ORCID">🔬</a>
    `;
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Chatbot functionality
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('active');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, 'user');
    input.value = '';
    
    setTimeout(() => {
        const response = getBotResponse(message.toLowerCase());
        addMessage(response, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    if (!knowledgeBase || !knowledgeBase.chatbot_responses) {
        return "I'm still loading information about Dr. Marir. Please try again in a moment.";
    }

    const responses = knowledgeBase.chatbot_responses;

    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return responses.greetings;
    }

    // Check for specific keywords
    const keywords = [
        'research', 'education', 'position', 'publications', 'skills', 
        'awards', 'contact', 'teaching', 'ai', 'cybersecurity', 
        'nlp', 'spark', 'federated_learning'
    ];

    for (const keyword of keywords) {
        if (message.includes(keyword.replace('_', ' '))) {
            return responses[keyword];
        }
    }

    // Check for specific queries
    if (message.includes('big data') || message.includes('hadoop')) {
        return responses.spark;
    }

    if (message.includes('phd') || message.includes('degree')) {
        return responses.education;
    }

    if (message.includes('work') || message.includes('job') || message.includes('university')) {
        return responses.position;
    }

    if (message.includes('paper') || message.includes('publication') || message.includes('research paper')) {
        return responses.publications;
    }

    if (message.includes('email') || message.includes('phone') || message.includes('reach')) {
        return responses.contact;
    }

    if (message.includes('machine learning') || message.includes('deep learning')) {
        return responses.ai;
    }

    if (message.includes('security') || message.includes('intrusion')) {
        return responses.cybersecurity;
    }

    if (message.includes('language') || message.includes('sentiment')) {
        return responses.nlp;
    }

    if (message.includes('course') || message.includes('teach') || message.includes('class')) {
        return responses.teaching;
    }

    if (message.includes('prize') || message.includes('award') || message.includes('achievement')) {
        return responses.awards;
    }

    if (message.includes('python') || message.includes('java') || message.includes('programming')) {
        return responses.skills;
    }

    // Default response
    return responses.default;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadKnowledgeBase);
