// Global variable to store knowledge base
let knowledgeBase = null;

// Load knowledge base on page load
async function loadKnowledgeBase() {
    try {
        console.log('Attempting to load knowledge base...');
        const response = await fetch('data/knowledge-base.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        knowledgeBase = await response.json();
        console.log('Knowledge base loaded successfully!', knowledgeBase);
        populatePage();
    } catch (error) {
        console.error('Error loading knowledge base:', error);
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
    document.getElementById('hero-bio').textContent = knowledgeBase.personal.short_bio;

    // Citation Metrics (add after social links)
    const socialLinksContainer = document.getElementById('social-links');
    if (knowledgeBase.citation_metrics) {
        const metricsDiv = document.createElement('div');
        metricsDiv.className = 'citation-metrics';
        metricsDiv.innerHTML = `
            <div class="metric">
                <span class="metric-value">${knowledgeBase.citation_metrics.h_index}</span>
                <span class="metric-label">h-index</span>
            </div>
            <div class="metric">
                <span class="metric-value">${knowledgeBase.citation_metrics.total_citations}</span>
                <span class="metric-label">Citations</span>
            </div>
            <div class="metric">
                <span class="metric-value">${knowledgeBase.citation_metrics.i10_index}</span>
                <span class="metric-label">i10-index</span>
            </div>
        `;
        socialLinksContainer.parentNode.insertBefore(metricsDiv, socialLinksContainer);
    }

    // CV Download Button
    if (knowledgeBase.cv_link) {
        const cvButton = document.createElement('a');
        cvButton.href = knowledgeBase.cv_link;
        cvButton.className = 'cv-download-btn';
        cvButton.target = '_blank';
        cvButton.innerHTML = '📄 Download CV';
        socialLinksContainer.parentNode.insertBefore(cvButton, socialLinksContainer.nextSibling);
    }

    // Footer
    document.getElementById('footer-name').textContent = knowledgeBase.personal.name;

    // Social Links (already declared above)
    socialLinksContainer.innerHTML = '';
    
    const socialIcons = {
        'effat': '🏛️',
        'google_scholar': '🎓',
        'linkedin': '💼',
        'researchgate': '📊',
        'orcid': '🔬'
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

    // Skills with progress bars
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';

    // Skills with proficiency levels
    const skillsWithLevels = [
        { name: 'Python', level: 95 },
        { name: 'Deep Learning', level: 90 },
        { name: 'PyTorch', level: 88 },
        { name: 'TensorFlow', level: 85 },
        { name: 'Apache Spark', level: 85 },
        { name: 'Machine Learning', level: 92 },
        { name: 'Cybersecurity', level: 88 },
        { name: 'NLP', level: 82 },
        { name: 'Federated Learning', level: 80 },
        { name: 'Big Data Analytics', level: 85 }
    ];

    skillsWithLevels.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percentage">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" data-level="${skill.level}"></div>
            </div>
        `;
        skillsContainer.appendChild(skillItem);
    });

    // Initialize skill bar animations
    initSkillBarAnimations();

    // Education Timeline
    const educationTimeline = document.getElementById('education-timeline');
    if (educationTimeline) {
        educationTimeline.innerHTML = '';
        knowledgeBase.education.forEach((edu, index) => {
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';
            eduItem.innerHTML = `
                <div class="edu-marker"></div>
                <div class="edu-content">
                    <div class="edu-year">${edu.years}</div>
                    <h3 class="edu-degree">${edu.degree}</h3>
                    <p class="edu-institution">${edu.institution}</p>
                    <p class="edu-college">${edu.college}</p>
                    ${edu.thesis ? `<p class="edu-thesis"><strong>Thesis:</strong> ${edu.thesis}</p>` : ''}
                    ${edu.specialization ? `<p class="edu-spec"><strong>Specialization:</strong> ${edu.specialization}</p>` : ''}
                </div>
            `;
            educationTimeline.appendChild(eduItem);
        });
    }

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

        const typeClass = pub.type === 'Journal' ? 'pub-journal' : 'pub-conference';
        const awardBadge = pub.award ? `<span class="pub-award">${pub.award}</span>` : '';

        item.innerHTML = `
            <div class="pub-header">
                <span class="pub-type ${typeClass}">${pub.type}</span>
                <span class="pub-year">${pub.year}</span>
            </div>
            <h4 class="pub-title">${pub.title}</h4>
            <p class="pub-authors">${pub.authors}</p>
            <p class="pub-venue">${pub.venue}</p>
            <div class="pub-footer">
                ${awardBadge}
                ${pub.link ? `<a href="${pub.link}" target="_blank" class="pub-link">View Publication →</a>` : ''}
            </div>
        `;
        publicationsList.appendChild(item);
    });

    // Projects
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    knowledgeBase.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const techTags = project.technologies.map(tech =>
            `<span class="project-tech">${tech}</span>`
        ).join('');

        projectCard.innerHTML = `
            <div class="project-icon">${project.icon}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">${techTags}</div>
        `;
        projectsGrid.appendChild(projectCard);
    });

    // Awards & Honors
    const awardsTimeline = document.getElementById('awards-timeline');
    if (awardsTimeline) {
        awardsTimeline.innerHTML = '';
        knowledgeBase.awards.forEach(award => {
            const awardItem = document.createElement('div');
            awardItem.className = 'award-item';
            const isHighlight = award.title.includes('Best Paper') || award.title.includes('Scholarship');
            awardItem.innerHTML = `
                <div class="award-year">${award.year}</div>
                <div class="award-content ${isHighlight ? 'highlight' : ''}">
                    <h4 class="award-title">${award.title}</h4>
                    <p class="award-org">${award.organization}</p>
                </div>
            `;
            awardsTimeline.appendChild(awardItem);
        });
    }

    // Student Supervision
    const supervisionGrid = document.getElementById('supervision-grid');
    if (supervisionGrid && knowledgeBase.student_supervision) {
        supervisionGrid.innerHTML = '';
        knowledgeBase.student_supervision.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = 'supervision-card';
            const statusClass = student.status === 'In Progress' ? 'status-progress' : 'status-completed';
            studentCard.innerHTML = `
                <div class="supervision-header">
                    <span class="supervision-degree">${student.degree}</span>
                    <span class="supervision-status ${statusClass}">${student.status}</span>
                </div>
                <h4 class="supervision-name">${student.name}</h4>
                <p class="supervision-thesis">${student.thesis}</p>
                <p class="supervision-year">${student.year}</p>
            `;
            supervisionGrid.appendChild(studentCard);
        });
    }

    // Courses Taught
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    const courseIcons = {
        'Machine Learning': '🤖',
        'Data Preprocessing (Data-centric AI)': '📊',
        'Cyber Security': '🔒',
        'Business Intelligence (BI)': '📈',
        'Statistics and Data Analysis': '📉',
        'Information Security': '🛡️',
        'Algorithmic and Data Structures': '🔢',
        'Operating Systems': '💻',
        'Introduction to Computing': '🖥️',
        'Text Mining and Natural Language Processing': '💬',
        'Senior Project I-II': '🎓',
        'Principles of Computers (Python)': '🐍'
    };

    knowledgeBase.courses_taught.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        const icon = courseIcons[course] || '📚';
        courseCard.innerHTML = `
            <span class="course-icon">${icon}</span>
            <span class="course-name">${course}</span>
        `;
        coursesGrid.appendChild(courseCard);
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
    document.getElementById('hero-title').textContent = 'Assistant Professor';
    document.getElementById('hero-bio').textContent = 'Advancing the frontiers of AI and Cybersecurity through cutting-edge research in Data-Centric AI, Federated Learning, and Deep Learning. Committed to developing ethical, privacy-preserving AI solutions that address real-world security challenges.';
    
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
    
    // Add fallback skills with progress bars
    const skillsContainer = document.getElementById('skills-container');
    const fallbackSkills = [
        { name: 'Python', level: 95 },
        { name: 'Deep Learning', level: 90 },
        { name: 'PyTorch', level: 88 },
        { name: 'TensorFlow', level: 85 },
        { name: 'Apache Spark', level: 85 },
        { name: 'Machine Learning', level: 92 },
        { name: 'Cybersecurity', level: 88 },
        { name: 'NLP', level: 82 },
        { name: 'Federated Learning', level: 80 },
        { name: 'Big Data Analytics', level: 85 }
    ];
    skillsContainer.innerHTML = fallbackSkills.map(skill => `
        <div class="skill-item">
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percentage">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" data-level="${skill.level}"></div>
            </div>
        </div>
    `).join('');

    // Initialize skill bar animations for fallback
    initSkillBarAnimations();
    
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

// Skill bar animation with Intersection Observer
function initSkillBarAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const level = progressBar.getAttribute('data-level');

                // Add small delay for staggered effect
                setTimeout(() => {
                    progressBar.style.width = level + '%';
                }, 200);

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadKnowledgeBase);
