// Netlify Function: Claude-powered chatbot for Dr. Naila Marir's portfolio
// Uses Anthropic Messages API (Claude Sonnet 4.6)

const KNOWLEDGE_BASE = `
ABOUT DR. NAILA MARIR:
- Name: Dr. Naila Marir
- Current Position: Assistant Professor at Effat University, Computer Science Department, Jeddah, Saudi Arabia
- Research Focus: AI & Cybersecurity Researcher | Data-Centric AI | Federated Learning | Big Data Analytics | Agentic AI

SUMMARY:
Dr. Naila Marir serves as an Assistant Professor in the Computer Science Department at Effat University. She earned her PhD in Computer Science and Technology and specializes in artificial intelligence and cybersecurity. Her research is centered on Data-Centric AI, Federated Learning, and Big Data Analytics, with a strong emphasis on enhancing cybersecurity through Generative AI and Deep Learning. Dr. Marir's work advances Deep Learning techniques and their applications in Network Security, addressing critical challenges in data security and integrity. Additionally, she is dedicated to exploring Natural Language Processing and Sentiment Analysis to deepen understanding of human language for impactful real-world applications. Dr. Marir is committed to developing ethical AI solutions that prioritize privacy and security.

CONTACT INFORMATION:
- Email: namarir@effatuniversity.edu.sa
- Phone: +966 50 7337478
- Office Phone: +966 122137855
- Address: Qasr Khuzam St. Kilo. 2 Old Mecca Road. P.O.BOX 34689 - Jeddah 21478 Saudi Arabia

SOCIAL & ACADEMIC PROFILES:
- Effat University Profile: https://www.effatuniversity.edu.sa/English/Personal/namarir/Pages/Default.aspx
- Google Scholar: https://scholar.google.com/citations?user=vgxzZRYAAAAJ&hl=en
- LinkedIn: https://www.linkedin.com/in/naila-marir-7250139b/
- ResearchGate: https://www.researchgate.net/profile/Naila-Marir
- ORCID: https://orcid.org/0000-0001-6633-9099

EDUCATION:
- Ph.D. in Computer Science from Harbin Engineering University, China (2015-2019)
  College of Computer Science and Technology
  Thesis: "Research on Abnormal Behavior Detection Techniques Based on Big Data Analytics"
- Chinese Language Certificate from Harbin Engineering University, China (2014-2015)
- Master's in Computer Science from University of Skikda, Algeria (2012-2014)
  Specialization: Engineering of Distributed Systems
  Thesis: "Intrusion Detection System using Paxos Consensus based on Multi-agent Systems"
- Bachelor's in Mathematics and Computer Science from University of Skikda, Algeria (2009-2012)
  Specialization: Computer Networks and Distributed Systems

WORK EXPERIENCE:
- Assistant Professor at Effat University, Computer Science Department (August 2024 - Present)
- Associate Professor at Abdelhamid Mehri - Constantine 2 University (November 2023 - 2024)
- Assistant Professor at Abdelhamid Mehri - Constantine 2 University (November 2021 - 2022)

RESEARCH AREAS:
1. Artificial Intelligence: Data-Centric AI, Federated Learning, Generative AI, Agentic AI, Deep Learning Techniques
2. Cybersecurity: Network Security, Intrusion Detection Systems, Malware Detection, IoT Security, Adversarial ML, LLM Red-Teaming
3. Big Data Analytics: Distributed Computing, Apache Spark, Abnormal Behavior Detection, Data Processing at Scale
4. Natural Language Processing: Sentiment Analysis, Text Mining, MOOC Analytics, Social Media Analysis

TECHNICAL SKILLS:
- Programming Languages: Python, Java, JavaScript, C++
- Deep Learning Frameworks: PyTorch, TensorFlow, Keras, DL4J
- Big Data Technologies: Apache Spark, Hadoop, MapReduce
- Databases: Oracle, MySQL, MongoDB
- Business Intelligence: PowerBI, RapidMiner, Talend
- Other: Network Security, Federated Learning, NLP, Cloud Computing

SELECTED PUBLICATIONS:
1. "Risk Detection of Breast Cancer from MRI Images Using Deep Feature Extraction and Fine-Tuning NCA Feature Selection" (2026) - Journal of Statistical Computation and Simulation, 96(5), 1153-1175
2. "Network Analytics Techniques: Next-Generation Abnormal Behavior Detection System Based on Big Data Analytics and Deep Learning Techniques" (2026) - Mathematical Modeling for Big Data Analytics, Chapter 12
3. "Ontology-Driven Dynamic Learner Profiling: Towards Fluid Learning" (2025) - RIF Conference
4. "Towards an Explainable Framework for Personalized Treatment Recommendations" (2025) - IEEE/ACS AICCSA
5. "Personalized Learning Through MBTI Prediction: A Deep Learning Approach Integrated with Learner Profile Ontology" (2025) - IEEE Access
6. "Machine Learning-Driven Distributed Intrusion Detection System for the Internet of Vehicles" (2025) - ICRC Conference
7. "Centroid-Based Aspect Sentiment Analysis for MOOC Learner Reviews" (2025) - IEEE L&T Conference
8. "SocialNER2.0: A Comprehensive Dataset for Enhancing Named Entity Recognition in Short Human-Produced Text" (2024) - Intelligent Data Analysis
9. "Unsupervised Feature Learning with Distributed Stacked Denoising Sparse Autoencoder for Abnormal Behavior Detection using Apache Spark" (2019) - IEEE ICKII [BEST PAPER AWARD]
10. "Distributed Abnormal Behavior Detection Approach based on Deep Belief Network and Ensemble SVM using Spark" (2018) - IEEE Access [Most cited paper]

AWARDS & HONORS:
- Queen Effat Prize for Excellence in Teaching, Effat College of Engineering (2025–2026) — under the patronage of HRH Princess Lolowah Al Faisal
- Gold Medal — Geneva International Exhibition of Inventions 2026 (AGRI-BIRD)
- 1st Place — GCC Robotics Competition, Gulf Region 2026 (AGRI-BIRD)
- 3rd Place — National Robotics Competition, Saudi Arabia 2026 (AGRI-BIRD)
- IEEE ICKII 2019 Best Paper Award
- Machine Learning Trainer Certificate (2023)
- Enterprise Security with Elastic XDR Training Certificate (2023)
- Ethical Hacking Trainer Certificate (2022)
- Chinese Government Scholarship (CSC) for Ph.D. (2014)
- Algerian Ministry Scholarship for Ph.D. (2014)
- Top Student Award, University of Skikda (2012, 2014)

COURSES TAUGHT:
Machine Learning, Data Preprocessing (Data-centric AI), Cyber Security, Business Intelligence (BI), Statistics and Data Analysis, Information Security, Algorithmic and Data Structures, Operating Systems, Introduction to Computing, Text Mining and Natural Language Processing, Senior Project I-II, Principles of Computers (Python)

CITATION METRICS (Google Scholar, November 2026):
- Total Citations: 296 (249 since 2021)
- h-index: 5 (4 since 2021)
- i10-index: 3

STATISTICS:
- Years of Experience: 10+
- Publications: 20+
- Students Supervised: 20+
- Courses Taught: 10+

CURRENT RESEARCH PROJECTS:
1. BRAC — Byzantine-Resilient Agentic Consensus framework for NHL lymphoma diagnosis (accepted at HAIS 2026, Marbella, Spain)
2. OncoFusionNet — Semantic-driven multimodal learning for Non-Hodgkin's Lymphoma diagnosis stratification (published, MEDI 2025, Springer LNCS)
3. A3L — Adaptive Adversarial Active Learning for cyber threat intelligence (under review)
4. AGRI-BIRD — AI-powered gantry robot for plant health monitoring (multi-award winning, 2026)
5. HydroMind — 13-agent autonomous hydroponic farming system aligned with Vision 2030 (active)
6. Vision Beyond Sight — Cloud-based assistive AI mobile app for visually impaired users (active)
7. AEGIS — LLM-powered penetration testing framework for multimodal AI security (active)
`;

const SYSTEM_PROMPT = `You are Dr. Naila Marir's friendly AI assistant on her academic portfolio website. Your role is to answer questions about Dr. Marir's research, publications, education, skills, projects, and professional background in a warm, professional manner.

IMPORTANT GUIDELINES:
1. Only answer questions based on the knowledge base below.
2. Be friendly, professional, and concise — keep responses under 150 words unless more detail is specifically requested.
3. If asked about something not in the knowledge base, politely say you don't have that information and suggest contacting Dr. Marir directly.
4. Use a warm, professional tone appropriate for an academic website.
5. When mentioning publications, projects, or achievements, be accurate with titles and dates.
6. If asked irrelevant questions (not about Dr. Marir), politely redirect to relevant topics.
7. Never make up information not present in the knowledge base.
8. You can mention that visitors can download her CV or visit her social profiles for more details.
9. Refer to Dr. Marir in the third person — you are her assistant, not her.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FALLBACK_MESSAGE = "I'm having trouble connecting right now. Please try again in a moment, or feel free to contact Dr. Marir directly at namarir@effatuniversity.edu.sa";

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, conversationHistory = [] } = JSON.parse(event.body);

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Configuration error',
          fallback: "I'm currently unavailable. Please contact Dr. Marir directly at namarir@effatuniversity.edu.sa",
        }),
      };
    }

    // Anthropic Messages API requires alternating user/assistant turns.
    // The system prompt is passed separately. Filter to the last 6 turns.
    const messages = conversationHistory
      .slice(-6)
      .filter((m) => m && m.role && m.content)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to get response from AI',
          fallback: FALLBACK_MESSAGE,
        }),
      };
    }

    const data = await response.json();
    const assistantMessage =
      data.content?.[0]?.text ||
      "I apologize, but I couldn't generate a response. Please try rephrasing your question.";

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response: assistantMessage,
        usage: data.usage,
      }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        fallback: "I'm experiencing technical difficulties. Please try again later or contact Dr. Marir directly at namarir@effatuniversity.edu.sa",
      }),
    };
  }
};
