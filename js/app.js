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
        window.__kb = knowledgeBase;
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

    // Hero Section — render name with italic accent on last word
    const fullName = knowledgeBase.personal.name;
    const nameParts = fullName.split(' ');
    const lastWord = nameParts.pop();
    const heroNameEl = document.getElementById('hero-name');
    heroNameEl.innerHTML = `${nameParts.join(' ')} <em class="accent">${lastWord}</em>`;

    document.getElementById('hero-title').textContent = knowledgeBase.personal.title;
    document.getElementById('hero-bio').textContent = knowledgeBase.personal.short_bio;

    const socialLinksContainer = document.getElementById('social-links');
    const heroRight = document.getElementById('hero-right');

    // Citation Metrics — render into the hero-right column
    if (knowledgeBase.citation_metrics && heroRight) {
        const cm = knowledgeBase.citation_metrics;
        const metricsDiv = document.createElement('div');
        metricsDiv.className = 'citation-metrics';
        metricsDiv.innerHTML = `
            <div class="citation-metrics-title">cited_by.metrics<span class="citation-source">${cm.source || ''}</span></div>
            <table class="citation-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>All</th>
                        <th>Since 2021</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Citations</td>
                        <td>${cm.all.citations}</td>
                        <td>${cm.since_2021.citations}</td>
                    </tr>
                    <tr>
                        <td>h-index</td>
                        <td>${cm.all.h_index}</td>
                        <td>${cm.since_2021.h_index}</td>
                    </tr>
                    <tr>
                        <td>i10-index</td>
                        <td>${cm.all.i10_index}</td>
                        <td>${cm.since_2021.i10_index}</td>
                    </tr>
                </tbody>
            </table>
        `;
        heroRight.appendChild(metricsDiv);
    }

    // CV Download Button (after social links)
    if (knowledgeBase.cv_link) {
        const cvButton = document.createElement('a');
        cvButton.href = knowledgeBase.cv_link;
        cvButton.className = 'cv-download-btn';
        cvButton.target = '_blank';
        cvButton.innerHTML = '<span class="cv-arrow">↓</span> Download CV';
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

    const socialLabels = {
        'effat': 'Effat University Profile',
        'google_scholar': 'Google Scholar',
        'linkedin': 'LinkedIn',
        'researchgate': 'ResearchGate',
        'orcid': 'ORCID'
    };

    for (const [key, url] of Object.entries(knowledgeBase.social_links)) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        const label = socialLabels[key] || key.replace(/_/g, ' ');
        link.setAttribute('aria-label', label);
        link.setAttribute('data-tooltip', label);
        link.innerHTML = `<span class="social-icon">${socialIcons[key] || '🔗'}</span>`;
        socialLinksContainer.appendChild(link);
    }

    // About Section
    document.getElementById('about-summary').textContent = knowledgeBase.summary;

    // About — stat ribbon
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';

    const statMeta = {
        'years_experience':    { label: 'Years of Experience',   icon: 'calendar-clock' },
        'publications':        { label: 'Publications',          icon: 'file-text' },
        'students_supervised': { label: 'Students Supervised',   icon: 'graduation-cap' },
        'courses_taught':      { label: 'Courses Taught',        icon: 'book-open' }
    };

    for (const [key, value] of Object.entries(knowledgeBase.statistics)) {
        const meta = statMeta[key] || { label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), icon: 'sparkles' };
        const stat = document.createElement('div');
        stat.className = 'stat-pill';
        stat.innerHTML = `
            <div class="stat-pill-icon"><i data-lucide="${meta.icon}"></i></div>
            <div class="stat-pill-body">
                <div class="stat-pill-value">${value}</div>
                <div class="stat-pill-label">${meta.label}</div>
            </div>
        `;
        statsContainer.appendChild(stat);
    }

    // Render any newly inserted Lucide icons (stats + portrait badge)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }

    // Education Timeline — polished vertical timeline
    const educationTimeline = document.getElementById('education-timeline');
    if (educationTimeline) {
        educationTimeline.innerHTML = '';

        const inferDegreeStyle = (degree) => {
            const d = (degree || '').toLowerCase();
            if (d.includes('ph.d') || d.includes('phd'))   return { icon: 'award',          accent: '#8B5CF6', tag: 'Doctorate' };
            if (d.includes('master'))                       return { icon: 'graduation-cap', accent: '#3B82F6', tag: 'Master\'s' };
            if (d.includes('bachelor'))                     return { icon: 'book-open-text', accent: '#10B981', tag: 'Bachelor\'s' };
            if (d.includes('chinese') || d.includes('language')) return { icon: 'languages', accent: '#F59E0B', tag: 'Language Cert.' };
            return { icon: 'book-open', accent: '#A78BFA', tag: 'Program' };
        };

        knowledgeBase.education.forEach((edu, index) => {
            const style = inferDegreeStyle(edu.degree);
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';
            eduItem.style.setProperty('--edu-accent', style.accent);

            const detailParts = [];
            if (edu.college)        detailParts.push(`<span class="edu-meta-pill"><i data-lucide="building-2"></i> ${edu.college}</span>`);
            if (edu.specialization) detailParts.push(`<span class="edu-meta-pill"><i data-lucide="target"></i> ${edu.specialization}</span>`);

            eduItem.innerHTML = `
                <div class="edu-marker" aria-hidden="true">
                    <i data-lucide="${style.icon}"></i>
                </div>
                <div class="edu-content">
                    <div class="edu-tag">${style.tag}</div>
                    <h3 class="edu-degree">${edu.degree}</h3>
                    <div class="edu-meta-row">
                        <span class="edu-institution"><i data-lucide="map-pin"></i> ${edu.institution}</span>
                        <span class="edu-year"><i data-lucide="calendar"></i> ${edu.years}</span>
                    </div>
                    ${detailParts.length ? `<div class="edu-meta-pills">${detailParts.join('')}</div>` : ''}
                    ${edu.thesis ? `
                        <figure class="edu-thesis-quote">
                            <i data-lucide="quote" class="edu-quote-icon"></i>
                            <blockquote>${edu.thesis}</blockquote>
                            <figcaption>Thesis</figcaption>
                        </figure>
                    ` : ''}
                </div>
            `;
            educationTimeline.appendChild(eduItem);
        });

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
        }
    }

    // Research Areas — bento grid layout
    const researchGrid = document.getElementById('research-grid');
    researchGrid.innerHTML = '';

    const areaMeta = {
        'Artificial Intelligence':       { lucide: 'brain-circuit',       accent: '#8B5CF6', subtitle: 'Frontier methods for trustworthy, ethical AI.' },
        'Cybersecurity':                 { lucide: 'shield-check',        accent: '#3B82F6', subtitle: 'Securing networks, devices, and AI itself.' },
        'Big Data Analytics':            { lucide: 'database-zap',        accent: '#A78BFA', subtitle: 'Insights at distributed scale.' },
        'Natural Language Processing':   { lucide: 'message-square-text', accent: '#10B981', subtitle: 'Language understanding for real-world impact.' }
    };

    knowledgeBase.research_areas.forEach((area, idx) => {
        const meta = areaMeta[area.title] || { lucide: 'sparkles', accent: '#8B5CF6', subtitle: '' };
        const card = document.createElement('article');
        card.className = `research-card bento-${idx} ${idx === 0 ? 'is-feature' : ''}`.trim();
        card.style.setProperty('--card-accent', meta.accent);

        const topicsList = area.topics.map(t => `<span class="research-topic">${t}</span>`).join('');

        card.innerHTML = `
            <div class="research-card-glow" aria-hidden="true"></div>
            <div class="research-card-head">
                <div class="research-card-icon"><i data-lucide="${meta.lucide}"></i></div>
                <span class="research-card-index">0${idx + 1}</span>
            </div>
            <h3 class="research-card-title">${area.title}</h3>
            ${meta.subtitle ? `<p class="research-card-subtitle">${meta.subtitle}</p>` : ''}
            <div class="research-topics">${topicsList}</div>
        `;
        researchGrid.appendChild(card);
    });

    // Render Lucide icons inside the cards (Lucide is loaded via CDN by tech-globe)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }

    // Publications
    const publicationsList = document.getElementById('publications-list');
    publicationsList.innerHTML = '';

    knowledgeBase.selected_publications.forEach(pub => {
        const item = document.createElement('div');
        item.className = 'publication-item';

        const typeClassMap = {
            'Journal': 'pub-journal',
            'Conference': 'pub-conference',
            'Book Chapter': 'pub-book'
        };
        const typeClass = typeClassMap[pub.type] || 'pub-conference';
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

        const metaParts = [];
        if (project.domain) metaParts.push(project.domain);
        if (project.period) metaParts.push(project.period);
        if (project.status) metaParts.push(`<span class="project-status">${project.status}</span>`);
        const metaLine = metaParts.length
            ? `<div class="project-meta">${project.icon ? `<span class="project-meta-icon">${project.icon}</span>` : ''}${metaParts.join(' · ')}</div>`
            : '';

        const subtitle = project.subtitle ? `<p class="project-subtitle">${project.subtitle}</p>` : '';
        const venue = project.venue ? `<p class="project-venue">${project.venue}</p>` : '';
        const hasMultiple = (str) => str && (str.includes(',') || str.includes('·'));
        const collaborators = project.collaborators ? `<p class="project-collaborators"><strong>Collaborator${hasMultiple(project.collaborators) ? 's' : ''}:</strong> ${project.collaborators}</p>` : '';
        const supervisors = project.supervisors ? `<p class="project-collaborators"><strong>Supervisor${hasMultiple(project.supervisors) ? 's' : ''}:</strong> ${project.supervisors}</p>` : '';
        const students = project.students ? `<p class="project-collaborators"><strong>Student${hasMultiple(project.students) ? 's' : ''}:</strong> ${project.students}</p>` : '';
        const linkEl = project.link ? `<a href="${project.link}" target="_blank" class="project-link">🔗 ${project.link}</a>` : '';

        let awardsBlock = '';
        if (project.awards && project.awards.length) {
            const awardItems = project.awards.map(a =>
                `<li><span class="project-award-medal">${a.medal}</span>${a.title}</li>`
            ).join('');
            awardsBlock = `
                <div class="project-awards">
                    <div class="project-awards-title">🏆 Awards & Recognition</div>
                    <ul>${awardItems}</ul>
                </div>
            `;
        }

        projectCard.innerHTML = `
            ${metaLine || (project.icon ? `<div class="project-icon">${project.icon}</div>` : '')}
            <h3 class="project-title">${project.title}</h3>
            ${subtitle}
            <p class="project-description">${project.description}</p>
            ${venue}
            ${awardsBlock}
            ${supervisors}
            ${students}
            ${collaborators}
            <div class="project-technologies">${techTags}</div>
            ${linkEl}
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
            const isHighlight = award.medal || award.title.includes('Best Paper') || award.title.includes('Scholarship');
            const medalIcon = award.medal ? `<span class="award-medal">${award.medal}</span> ` : '';
            const imageEl = award.image ? `<a href="${award.image}" target="_blank" class="award-image-link"><img src="${award.image}" alt="${award.title}" class="award-image" loading="lazy"></a>` : '';
            awardItem.innerHTML = `
                <div class="award-year">${award.year}</div>
                <div class="award-content ${isHighlight ? 'highlight' : ''}">
                    ${imageEl}
                    <h4 class="award-title">${medalIcon}${award.title}</h4>
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

// Navbar spotlight that follows the cursor
(function initNavSpotlight() {
    const navbar = document.getElementById('navbar');
    const spotlight = navbar && navbar.querySelector('.nav-spotlight');
    if (!navbar || !spotlight) return;

    let raf = null;
    navbar.addEventListener('mousemove', (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const rect = navbar.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            spotlight.style.setProperty('--spotlight-x', `${x}%`);
            spotlight.style.setProperty('--spotlight-y', `${y}%`);
        });
    });
})();

// Navbar scroll effect + active section highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sectionIds = Array.from(navLinks)
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.startsWith('#'));

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight active section
    const scrollPos = window.scrollY + 120;
    let activeId = sectionIds[0];
    for (const id of sectionIds) {
        const el = document.querySelector(id);
        if (el && el.offsetTop <= scrollPos) {
            activeId = id;
        }
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activeId);
    });
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

// Chatbot functionality - LLM-powered with Anthropic Claude API
let conversationHistory = [];
let isWaitingForResponse = false;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('active');
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !isWaitingForResponse) {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const sendButton = document.querySelector('.chatbot-input-area button');
    const message = input.value.trim();

    if (message === '' || isWaitingForResponse) return;

    // Add user message
    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    input.value = '';

    // Disable input while waiting
    isWaitingForResponse = true;
    input.disabled = true;
    sendButton.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: conversationHistory.slice(-6)
            }),
        });

        const data = await response.json();

        // Hide typing indicator
        hideTypingIndicator();

        if (data.response) {
            addMessage(data.response, 'bot');
            conversationHistory.push({ role: 'assistant', content: data.response });
        } else if (data.fallback) {
            addMessage(data.fallback, 'bot');
        } else {
            addMessage("I'm sorry, I couldn't process your request. Please try again.", 'bot');
        }
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessage("I'm having trouble connecting. Please try again in a moment, or contact Dr. Marir directly at namarir@effatuniversity.edu.sa", 'bot');
    } finally {
        // Re-enable input
        isWaitingForResponse = false;
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
    }
}

// Minimal, safe Markdown -> HTML renderer for chatbot replies.
// Escapes HTML first, then maps a small Markdown subset:
// headings, bold, italic, inline code, fenced code, links, lists, paragraphs, line breaks.
function renderMarkdown(src) {
    const esc = (s) => s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // Extract fenced code blocks first so their contents don't get re-parsed
    const codeBlocks = [];
    let text = src.replace(/```([\s\S]*?)```/g, (_, code) => {
        codeBlocks.push(`<pre><code>${esc(code.replace(/^\n|\n$/g, ''))}</code></pre>`);
        return ` CODE${codeBlocks.length - 1} `;
    });

    text = esc(text);

    // Inline code
    text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Bold + italic — bold first
    text = text.replace(/\*\*([^\*\n]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(?:^|[^\*])\*([^\*\n]+)\*/g, (m, p1) => m.replace(`*${p1}*`, `<em>${p1}</em>`));

    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Auto-link bare urls (only those not already in href="…")
    text = text.replace(/(^|[\s(])((?:https?:\/\/)[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

    // Block parsing line-by-line
    const lines = text.split('\n');
    const out = [];
    let listType = null; // 'ul' or 'ol'

    const closeList = () => {
        if (listType) {
            out.push(`</${listType}>`);
            listType = null;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            closeList();
            continue;
        }

        // Heading
        const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
        if (heading) {
            closeList();
            const level = heading[1].length;
            out.push(`<h${level} class="chat-heading">${heading[2]}</h${level}>`);
            continue;
        }

        // Unordered list
        if (/^[-*•]\s+/.test(trimmed)) {
            if (listType !== 'ul') {
                closeList();
                out.push('<ul>');
                listType = 'ul';
            }
            out.push(`<li>${trimmed.replace(/^[-*•]\s+/, '')}</li>`);
            continue;
        }

        // Ordered list
        if (/^\d+\.\s+/.test(trimmed)) {
            if (listType !== 'ol') {
                closeList();
                out.push('<ol>');
                listType = 'ol';
            }
            out.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
            continue;
        }

        // Horizontal rule
        if (/^---+$/.test(trimmed)) {
            closeList();
            out.push('<hr>');
            continue;
        }

        // Paragraph (accumulate consecutive non-list lines)
        closeList();
        out.push(`<p>${trimmed}</p>`);
    }
    closeList();

    let html = out.join('\n');
    // Restore fenced code blocks
    html = html.replace(/ CODE(\d+) /g, (_, i) => codeBlocks[Number(i)]);
    return html;
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    if (sender === 'bot') {
        const avatar = document.createElement('img');
        avatar.src = 'images/Avatar/chatbot-avatar.png';
        avatar.alt = '';
        avatar.className = 'message-avatar';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = renderMarkdown(text);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
    } else {
        messageDiv.textContent = text;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <img src="images/Avatar/chatbot-avatar.png" alt="" class="message-avatar">
        <div class="message-bubble typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
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
