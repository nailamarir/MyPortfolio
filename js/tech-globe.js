// 3D Skills Globe — wireframe sphere with research-themed skills orbiting it.
// Click a skill -> side panel opens showing projects that use it (matched
// against knowledge-base.json by tag).

(function () {
  const SKILLS = [
    { id: 'deep-learning',     name: 'Deep Learning',     icon: 'brain-circuit', color: '#8B5CF6', proficiency: 'Expert',   tagline: 'Representation learning across vision, language, and biomedical signals.',           tags: ['deep learning','multimodal deep learning','distilbert','secbert','bioclinicalbert','lstm'] },
    { id: 'federated-learning',name: 'Federated Learning',icon: 'network',       color: '#A78BFA', proficiency: 'Advanced', tagline: 'Privacy-preserving distributed model training across institutions.',                 tags: ['federated learning','distributed','knowledge distillation'] },
    { id: 'agentic-ai',        name: 'Agentic AI',        icon: 'bot',           color: '#3B82F6', proficiency: 'Expert',   tagline: 'Multi-agent systems, BDI planning, and LLM orchestration.',                          tags: ['agentic ai','multi-agent ai','bdi agents','llm','llm red-teaming'] },
    { id: 'adversarial-ml',    name: 'Adversarial ML',    icon: 'swords',        color: '#EF4444', proficiency: 'Advanced', tagline: 'Robustness, red-teaming, and defense against evasion and poisoning attacks.',        tags: ['adversarial ml','adversarial defense','ai safety','ai security','penetration testing'] },
    { id: 'cybersecurity',     name: 'Cybersecurity',     icon: 'shield-check',  color: '#60A5FA', proficiency: 'Expert',   tagline: 'Network security, intrusion detection, and threat intelligence.',                    tags: ['cti','network security','intrusion detection'] },
    { id: 'nlp',               name: 'Natural Language Processing', icon: 'message-square-text', color: '#8B5CF6', proficiency: 'Advanced', tagline: 'Sentiment analysis, ontology-driven text mining, biomedical NLP.', tags: ['ontology nlp','arabic nlp','nlp','text mining'] },
    { id: 'computer-vision',   name: 'Computer Vision',   icon: 'scan-eye',      color: '#A78BFA', proficiency: 'Advanced', tagline: 'Medical imaging, plant-health diagnostics, and scene understanding.',                tags: ['computer vision','image captioning','plant health'] },
    { id: 'big-data',          name: 'Big Data Analytics',icon: 'database-zap',  color: '#3B82F6', proficiency: 'Expert',   tagline: 'Distributed processing and abnormal behavior detection at scale.',                   tags: ['apache spark','hadoop','big data','distributed computing'] },
    { id: 'multimodal',        name: 'Multimodal AI',     icon: 'layers',        color: '#10B981', proficiency: 'Advanced', tagline: 'Fusing pathology, radiology, and text for clinical decision support.',               tags: ['multimodal fusion','multimodal ai security'] },
    { id: 'edge-ai',           name: 'Edge AI & IoT',     icon: 'cpu',           color: '#F59E0B', proficiency: 'Advanced', tagline: 'On-device inference and knowledge distillation for resource-constrained hardware.', tags: ['iot','nvidia jetson','edge ai','knowledge distillation'] },
    { id: 'data-centric-ai',   name: 'Data-Centric AI',   icon: 'sigma',         color: '#A78BFA', proficiency: 'Expert',   tagline: 'Treating data quality as the lever for trustworthy AI systems.',                     tags: ['data preprocessing','data-centric ai','data quality'] },
    { id: 'ethical-ai',        name: 'Ethical & Privacy-Preserving AI', icon: 'scale', color: '#8B5CF6', proficiency: 'Expert', tagline: 'Designing AI that respects privacy, fairness, and accountability.', tags: ['ethical ai','privacy','accessibility','wcag'] }
  ];

  function ensureDeps(cb, attempts) {
    attempts = attempts || 0;
    if (typeof THREE !== 'undefined' && typeof lucide !== 'undefined') { cb(); return; }
    if (attempts > 100) { console.error('Three.js or Lucide failed to load'); return; }
    setTimeout(function () { ensureDeps(cb, attempts + 1); }, 60);
  }

  function renderLucide() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }
  }

  function init() {
    const mount = document.getElementById('tech-globe');
    if (!mount) return;

    const size = mount.clientWidth;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 5;

    // Wireframe sphere
    const sphereGroup = new THREE.Group();
    const sphereGeom = new THREE.SphereGeometry(1.6, 24, 18);
    const wireGeom = new THREE.WireframeGeometry(sphereGeom);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.18 });
    const wire = new THREE.LineSegments(wireGeom, wireMat);
    sphereGroup.add(wire);

    // Inner glow sphere
    const glowGeom = new THREE.SphereGeometry(1.55, 32, 24);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.04 });
    sphereGroup.add(new THREE.Mesh(glowGeom, glowMat));

    scene.add(sphereGroup);

    // Place skill labels on a Fibonacci-distributed sphere
    const RADIUS = 2.05;
    const labels = [];
    const n = SKILLS.length;
    for (let i = 0; i < n; i++) {
      const skill = SKILLS[i];

      // Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.cos(phi);
      const z = RADIUS * Math.sin(phi) * Math.sin(theta);

      // Build a DOM "node": icon-only by default, name on hover.
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tech-skill-node';
      el.dataset.skillId = skill.id;
      el.style.setProperty('--skill-color', skill.color);
      el.setAttribute('aria-label', skill.name);
      el.innerHTML =
        '<span class="tech-skill-icon"><i data-lucide="' + skill.icon + '"></i></span>' +
        '<span class="tech-skill-tip">' + skill.name + '</span>';
      el.addEventListener('click', function () { openPanel(skill); });
      mount.appendChild(el);

      labels.push({
        skill: skill,
        el: el,
        basePos: new THREE.Vector3(x, y, z)
      });
    }

    // Replace the <i data-lucide=...> placeholders with actual SVGs
    renderLucide();

    // Manual rotation state
    const AUTO_SPIN = 0.0012; // baseline Y rotation per frame (slow)
    let rotX = 0, rotY = 0;
    let velX = 0, velY = AUTO_SPIN;
    let dragging = false;
    let lastX = 0, lastY = 0;

    function onPointerDown(e) {
      dragging = true;
      lastX = (e.touches ? e.touches[0].clientX : e.clientX);
      lastY = (e.touches ? e.touches[0].clientY : e.clientY);
      mount.classList.add('dragging');
    }
    function onPointerMove(e) {
      if (!dragging) return;
      const cx = (e.touches ? e.touches[0].clientX : e.clientX);
      const cy = (e.touches ? e.touches[0].clientY : e.clientY);
      const dx = cx - lastX;
      const dy = cy - lastY;
      velY = dx * 0.003;
      velX = dy * 0.003;
      lastX = cx;
      lastY = cy;
    }
    function onPointerUp() {
      dragging = false;
      mount.classList.remove('dragging');
    }
    mount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    mount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    function onResize() {
      const w = mount.clientWidth;
      renderer.setSize(w, w);
    }
    window.addEventListener('resize', onResize);

    // Animation loop
    const tmp = new THREE.Vector3();
    function animate() {
      requestAnimationFrame(animate);

      if (!dragging) {
        velY *= 0.96;
        velX *= 0.92; // x-axis settles back to flat
        if (Math.abs(velY) < AUTO_SPIN) velY = velY >= 0 ? AUTO_SPIN : -AUTO_SPIN;
      }
      rotY += velY;
      rotX += velX;
      rotX = Math.max(-1, Math.min(1, rotX));

      sphereGroup.rotation.y = rotY;
      sphereGroup.rotation.x = rotX;

      // Project each label to screen
      const halfW = mount.clientWidth / 2;
      const halfH = mount.clientHeight / 2;
      for (let i = 0; i < labels.length; i++) {
        const L = labels[i];
        tmp.copy(L.basePos).applyMatrix4(sphereGroup.matrix);

        // depth: z in view space (camera at +z looking down -z)
        const depth = tmp.z;          // -RADIUS..+RADIUS (front is +)
        const opacity = 0.35 + 0.65 * ((depth + RADIUS) / (2 * RADIUS));
        const scale = 0.65 + 0.55 * ((depth + RADIUS) / (2 * RADIUS));

        tmp.project(camera);
        const sx = tmp.x * halfW + halfW;
        const sy = -tmp.y * halfH + halfH;

        L.el.style.transform = 'translate(-50%, -50%) translate(' + sx + 'px, ' + sy + 'px) scale(' + scale.toFixed(3) + ')';
        L.el.style.opacity = opacity.toFixed(3);
        L.el.style.zIndex = String(Math.round((depth + RADIUS) * 100));
        L.el.style.pointerEvents = depth > -0.4 ? 'auto' : 'none';
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // -------- Panel logic --------

  function findMatchingProjects(skill) {
    const kb = window.__kb;
    if (!kb || !kb.projects) return [];
    const tagSet = new Set(skill.tags.map(function (t) { return t.toLowerCase(); }));
    return kb.projects.filter(function (p) {
      const techs = (p.technologies || []).map(function (t) { return t.toLowerCase(); });
      for (let i = 0; i < techs.length; i++) {
        if (tagSet.has(techs[i])) return true;
      }
      return false;
    });
  }

  function openPanel(skill) {
    const panel = document.getElementById('skill-panel');
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const iconHost = document.getElementById('skill-panel-icon');
    iconHost.innerHTML = '<i data-lucide="' + skill.icon + '"></i>';
    iconHost.style.setProperty('--skill-color', skill.color);
    renderLucide();
    document.getElementById('skill-panel-title').textContent = skill.name;
    document.getElementById('skill-panel-tagline').textContent = skill.tagline;

    const list = document.getElementById('skill-panel-projects');
    list.innerHTML = '';

    const projects = findMatchingProjects(skill);
    if (!projects.length) {
      list.innerHTML = '<p class="skill-panel-empty">Used across ongoing research — no public project pages yet.</p>';
      return;
    }

    projects.forEach(function (p) {
      const card = document.createElement('div');
      card.className = 'skill-project-card';
      const tags = (p.technologies || []).slice(0, 4).map(function (t) {
        return '<span class="project-tech">' + t + '</span>';
      }).join('');
      card.innerHTML =
        '<div class="skill-project-header">' +
          '<span class="skill-project-icon">' + (p.icon || '📁') + '</span>' +
          '<h4 class="skill-project-title">' + p.title + '</h4>' +
        '</div>' +
        '<p class="skill-project-desc">' + (p.description || '') + '</p>' +
        '<div class="project-technologies">' + tags + '</div>' +
        (p.link ? '<a href="' + p.link + '" target="_blank" rel="noopener" class="skill-project-link">View project →</a>' : '');
      list.appendChild(card);
    });
  }

  function closePanel() {
    const panel = document.getElementById('skill-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Expose for inline onclick
  window.closeSkillPanel = closePanel;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });

  // Wait for DOM + Three + Lucide + knowledge base
  function start() {
    ensureDeps(function () {
      function checkKb(attempts) {
        attempts = attempts || 0;
        if (window.__kb || attempts > 50) { init(); return; }
        setTimeout(function () { checkKb(attempts + 1); }, 100);
      }
      checkKb();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
