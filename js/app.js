/**
 * UVic MECH 342 - Advanced Dynamics Studio
 * Main Application Controller & UI Orchestrator
 */

const App = {
    currentMode: 'lectures', // 'lectures', 'labs', 'practice', 'codelab', 'formulas', 'roadmap'
    currentLectureId: 'lec0',
    currentTabId: 'concept',
    activeSimInstance: null,
    quizScore: { correct: 0, total: 0, streak: 0 },
    answeredQuestions: {},

    init() {
        this.renderSidebarLectures();
        this.bindEvents();
        this.switchMode('lectures');
        this.renderFormulaVault();
        this.renderCodeLab();
        this.renderPracticeArena();
        this.renderExamBank();

        // Check if there are user-stored custom lectures
        this.loadCustomLectures();

        // Global KaTeX render
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ]
            });
        }

        console.log('UVic MECH 342 Dynamics Studio Initialized.');
    },

    bindEvents() {
        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                themeBtn.innerHTML = isLight ? '🌙' : '☀️';
            });
        }

        // Global Search
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Window resize for Three.js
        window.addEventListener('resize', () => {
            if (this.activeSimInstance && this.activeSimInstance.onResize) {
                this.activeSimInstance.onResize();
            }
        });
    },

    switchMode(mode) {
        this.currentMode = mode;

        // Update nav buttons
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Hide all main views
        document.querySelectorAll('.app-view').forEach(view => {
            view.style.display = 'none';
        });

        // Show selected view
        const targetView = document.getElementById(`view-${mode}`);
        if (targetView) {
            targetView.style.display = 'block';
        }

        if (mode === 'lectures') {
            this.selectLecture(this.currentLectureId);
        } else if (mode === 'labs') {
            this.initStandaloneLab('sim-lec0');
        } else if (mode === 'exams') {
            this.renderExamBank();
        }

        // Trigger math typesetting
        setTimeout(() => {
            if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ]
                });
            }
        }, 50);
    },

    renderSidebarLectures() {
        const container = document.getElementById('sidebar-lectures-list');
        if (!container) return;

        let html = '';
        MECH342_CURRICULUM.lectures.forEach(lec => {
            const isActive = lec.id === this.currentLectureId;
            const badgeText = typeof lec.number === 'number' ? `Lec #${lec.number}` : lec.number;
            html += `
                <div class="sidebar-item ${isActive ? 'active' : ''}" onclick="App.selectLecture('${lec.id}')">
                    <div class="lec-header">
                        <span class="badge">${badgeText}</span>
                        <span class="title">${lec.title}</span>
                    </div>
                    <div class="subtitle">${lec.subtitle}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    selectLecture(lecId) {
        this.currentLectureId = lecId;
        this.renderSidebarLectures();

        const lecture = MECH342_CURRICULUM.lectures.find(l => l.id === lecId);
        if (!lecture) return;

        // Render Lecture Header
        const headerEl = document.getElementById('lecture-header-area');
        if (headerEl) {
            const badgeText = typeof lecture.number === 'number' ? `Lecture #${lecture.number}` : lecture.number;
            headerEl.innerHTML = `
                <div class="lec-meta-row">
                    <span class="lec-badge-lg">${badgeText}</span>
                    <span class="ginsberg-ref">📖 Ginsberg: ${lecture.ginsbergRef}</span>
                </div>
                <h2>${lecture.title}</h2>
                <p class="lec-sub">${lecture.subtitle}</p>
                <div class="pedagogical-banner">
                    <div class="ped-icon">🎯</div>
                    <div class="ped-text">
                        <strong>Pedagogical Goal:</strong> ${lecture.pedagogicalFocus}
                    </div>
                </div>
            `;
        }

        // Render Tabs
        const tabsNavEl = document.getElementById('lecture-tabs-nav');
        if (tabsNavEl) {
            let tabsHtml = '';
            lecture.tabs.forEach((tab, idx) => {
                const isActive = (idx === 0 && !this.currentTabId) || tab.id === this.currentTabId;
                tabsHtml += `
                    <button class="lec-subtab-btn ${isActive ? 'active' : ''}" onclick="App.selectLectureTab('${tab.id}')">
                        ${tab.title}
                    </button>
                `;
            });
            tabsNavEl.innerHTML = tabsHtml;
        }

        // Set default tab if not set
        if (!lecture.tabs.find(t => t.id === this.currentTabId)) {
            this.currentTabId = lecture.tabs[0].id;
        }
        this.selectLectureTab(this.currentTabId);
    },

    selectLectureTab(tabId) {
        this.currentTabId = tabId;

        // Update tab buttons
        document.querySelectorAll('.lec-subtab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(tabId));
        });

        const lecture = MECH342_CURRICULUM.lectures.find(l => l.id === this.currentLectureId);
        if (!lecture) return;

        const tab = lecture.tabs.find(t => t.id === tabId);
        if (!tab) return;

        const bodyEl = document.getElementById('lecture-tab-body');
        if (!bodyEl) return;

        if (tab.simulationId) {
            bodyEl.innerHTML = `
                <div class="embedded-sim-wrapper">
                    <div class="sim-header">
                        <h4>Interactive 3D Visual Laboratory</h4>
                        <p>Rotate view with left click & drag | Pan with right click | Zoom with scroll wheel</p>
                    </div>
                    <div id="embedded-canvas-container" class="sim-canvas-viewport"></div>
                    <div id="embedded-controls-container" class="sim-controls-panel"></div>
                </div>
            `;
            setTimeout(() => {
                this.mountSimulation(tab.simulationId, 'embedded-canvas-container', 'embedded-controls-container');
            }, 50);
        } else {
            bodyEl.innerHTML = tab.contentHtml;
        }

        // Typeset math
        setTimeout(() => {
            if (window.renderMathInElement) {
                renderMathInElement(bodyEl, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ]
                });
            }
        }, 50);
    },

    mountSimulation(simId, canvasContainerId, controlsContainerId) {
        const controlsEl = document.getElementById(controlsContainerId);

        if (simId === 'sim-lec0') {
            const sim = Simulations.initSimLec0(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="lec0-play-btn" class="btn btn-primary">▶ Play / Pause</button>
                        <button id="lec0-reset-btn" class="btn btn-outline">↺ Reset</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Time Scrub: <span id="time-val">0.00</span> s</label>
                        <input id="lec0-time-slider" type="range" min="0" max="4.5" step="0.05" value="0">
                    </div>
                    <div class="ctrl-group">
                        <label>Simulation Speed:</label>
                        <select id="lec0-speed-select" class="form-select">
                            <option value="0.4">0.5x Slow</option>
                            <option value="0.8" selected>1.0x Normal</option>
                            <option value="1.6">2.0x Fast</option>
                        </select>
                    </div>
                    <div id="lec0-readouts" class="sim-readouts"></div>
                `;
                document.getElementById('lec0-play-btn').onclick = () => {
                    const isPlaying = sim.togglePlay();
                    document.getElementById('lec0-play-btn').innerHTML = isPlaying ? '⏸ Pause' : '▶ Play';
                };
                document.getElementById('lec0-reset-btn').onclick = () => sim.reset();
                document.getElementById('lec0-time-slider').oninput = (e) => {
                    sim.setTime(e.target.value);
                    document.getElementById('time-val').textContent = parseFloat(e.target.value).toFixed(2);
                };
                document.getElementById('lec0-speed-select').onchange = (e) => sim.setSpeed(e.target.value);
            }
        } else if (simId === 'sim-lec1') {
            const sim = Simulations.initSimLec1(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="lec1-tumble-btn" class="btn btn-primary">🔄 Toggle Tumbling Bodies</button>
                        <button id="lec1-reset-btn" class="btn btn-outline">↺ Reset Frame Orientations</button>
                    </div>
                    <div id="lec1-readouts" class="sim-readouts"></div>
                    <div class="mass-unit-lab">
                        <h4>⚖️ Proportionality & Mass Unit Explorer</h4>
                        <p>Adjust Force & Observe Mass Conversions across historical unit systems:</p>
                        <div class="ctrl-group">
                            <label>Applied Force: <span id="force-val">100</span> lbf</label>
                            <input id="force-slider" type="range" min="10" max="500" step="10" value="100">
                        </div>
                        <div class="unit-results-grid">
                            <div class="unit-res-card">
                                <span class="u-name">Foot-Slug System:</span>
                                <span id="slug-mass" class="u-val">3.108 slugs</span>
                                <span class="u-desc">g = 32.174 ft/s&sup2;</span>
                            </div>
                            <div class="unit-res-card">
                                <span class="u-name">Inch-Blob System:</span>
                                <span id="blob-mass" class="u-val">0.259 blobs</span>
                                <span class="u-desc">g = 386.09 in/s&sup2;</span>
                            </div>
                            <div class="unit-res-card">
                                <span class="u-name">Metric SI Equivalent:</span>
                                <span id="si-mass" class="u-val">45.36 kg</span>
                                <span class="u-desc">Weight = 444.8 N</span>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('lec1-tumble-btn').onclick = () => {
                    const isTumbling = sim.toggleTumble();
                    document.getElementById('lec1-tumble-btn').classList.toggle('active', isTumbling);
                };
                document.getElementById('lec1-reset-btn').onclick = () => sim.reset();
                const fSlider = document.getElementById('force-slider');
                fSlider.oninput = (e) => {
                    const F = parseFloat(e.target.value);
                    document.getElementById('force-val').textContent = F;
                    document.getElementById('slug-mass').textContent = (F / 32.174).toFixed(3) + ' slugs';
                    document.getElementById('blob-mass').textContent = (F / 386.088).toFixed(3) + ' blobs';
                    document.getElementById('si-mass').textContent = (F * 0.453592).toFixed(2) + ' kg';
                };
            }
        } else if (simId === 'sim-lec2') {
            const sim = Simulations.initSimLec2(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <label>Canonical Rotation Axis:</label>
                        <div class="axis-btn-group">
                            <button class="btn btn-sm btn-outline active" onclick="App.setCanonicalAxis('z', this)">R_z (&theta;_z)</button>
                            <button class="btn btn-sm btn-outline" onclick="App.setCanonicalAxis('y', this)">R_y (&theta;_y)</button>
                            <button class="btn btn-sm btn-outline" onclick="App.setCanonicalAxis('x', this)">R_x (&theta;_x)</button>
                        </div>
                    </div>
                    <div class="ctrl-group">
                        <label>Rotation Angle &theta;: <span id="lec2-angle-val">45</span>&deg;</label>
                        <input id="lec2-angle-slider" type="range" min="-180" max="180" step="1" value="45">
                    </div>
                    <div class="matrix-inspect-box">
                        <h5>Live Coordinate Transformation Matrix $[R]$:</h5>
                        <div id="lec2-matrix-display"></div>
                    </div>
                    <div id="lec2-props-display"></div>
                    <div class="slide15-puzzle-box">
                        <h4>🧩 Lecture 2 Slide 15: Matrix Completion Puzzle</h4>
                        <p>Given 6 known entries of an orthogonal matrix, find the missing elements using constraints.</p>
                        <button class="btn btn-sm btn-primary" onclick="App.solveSlide15Puzzle()">Solve with Orthonormality Constraints</button>
                        <div id="slide15-solution" style="margin-top: 10px;"></div>
                    </div>
                `;
                document.getElementById('lec2-angle-slider').oninput = (e) => {
                    document.getElementById('lec2-angle-val').textContent = e.target.value;
                    sim.setAngle(e.target.value);
                };
            }
        } else if (simId === 'sim-lec3') {
            const sim = Simulations.initSimLec3(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <label>Experiment Mode:</label>
                        <div class="axis-btn-group">
                            <button class="btn btn-sm btn-outline active" onclick="App.setLec3Mode('duel', this)">Non-Commutativity Duel</button>
                            <button class="btn btn-sm btn-outline" onclick="App.setLec3Mode('eigen', this)">Euler Eigen-Axis Theorem</button>
                        </div>
                    </div>
                    <div id="lec3-dynamic-controls">
                        <div class="ctrl-group">
                            <label>Rotation Angles: <span id="duel-angle-val">90</span>&deg;</label>
                            <input id="duel-angle-slider" type="range" min="1" max="90" step="1" value="90">
                            <small style="color: var(--text-muted);">Slide towards 1&deg; to observe infinitesimal commutativity!</small>
                        </div>
                    </div>
                    <div class="ctrl-group">
                        <button class="btn btn-sm btn-primary" onclick="App.loadLec3Slide22Example()">Load Lecture 3 Slide 22 Exam Problem</button>
                    </div>
                    <div id="lec3-readouts"></div>
                `;
                document.getElementById('duel-angle-slider').oninput = (e) => {
                    document.getElementById('duel-angle-val').textContent = e.target.value;
                    sim.setDuelAngle(e.target.value);
                };
            }
        } else if (simId === 'sim-mech') {
            const sim = Simulations.initSimMechanism(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="mech-spin-btn" class="btn btn-primary">▶ Toggle Mechanism Animation</button>
                        <button id="mech-reset-btn" class="btn btn-outline">↺ Reset</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Precession &psi; (Vertical Shaft): <span id="val-psi">25</span>&deg;</label>
                        <input id="slider-psi" type="range" min="0" max="360" step="1" value="25">
                    </div>
                    <div class="ctrl-group">
                        <label>Nutation &theta; (Hinge Arm): <span id="val-theta">40</span>&deg;</label>
                        <input id="slider-theta" type="range" min="0" max="90" step="1" value="40">
                    </div>
                    <div class="ctrl-group">
                        <label>Spin &phi; (Flywheel Disk): <span id="val-phi">60</span>&deg;</label>
                        <input id="slider-phi" type="range" min="0" max="360" step="1" value="60">
                    </div>
                    <div id="mech-readouts"></div>
                `;
                document.getElementById('mech-spin-btn').onclick = () => {
                    const isSpinning = sim.toggleSpin();
                    document.getElementById('mech-spin-btn').innerHTML = isSpinning ? '⏸ Pause Animation' : '▶ Toggle Mechanism Animation';
                };
                document.getElementById('mech-reset-btn').onclick = () => sim.reset();
                document.getElementById('slider-psi').oninput = (e) => {
                    document.getElementById('val-psi').textContent = e.target.value;
                    sim.setAngles(e.target.value, undefined, undefined);
                };
                document.getElementById('slider-theta').oninput = (e) => {
                    document.getElementById('val-theta').textContent = e.target.value;
                    sim.setAngles(undefined, e.target.value, undefined);
                };
                document.getElementById('slider-phi').oninput = (e) => {
                    document.getElementById('val-phi').textContent = e.target.value;
                    sim.setAngles(undefined, undefined, e.target.value);
                };
            }
        } else if (simId === 'sim-hydraulic') {
            const sim = Simulations.initSimHydraulic(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="hyd-reset-btn" class="btn btn-outline">↺ Reset Initial Geometry</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Shaft Angle &theta; (Z-axis): <span id="val-hyd-theta">36.87</span>&deg;</label>
                        <input id="slider-hyd-theta" type="range" min="0" max="180" step="0.5" value="36.87">
                    </div>
                    <div class="ctrl-group">
                        <label>Cylinder Roll &phi; (AB-axis): <span id="val-hyd-phi">120</span>&deg;</label>
                        <input id="slider-hyd-phi" type="range" min="0" max="360" step="1" value="120">
                    </div>
                    <div class="ctrl-group">
                        <label>Cylinder Length L: <span id="val-hyd-len">800</span> mm</label>
                        <input id="slider-hyd-len" type="range" min="300" max="1200" step="10" value="800">
                    </div>
                    <div id="hydraulic-readouts"></div>
                `;
                document.getElementById('hyd-reset-btn').onclick = () => {
                    sim.reset();
                    document.getElementById('val-hyd-theta').textContent = '36.87';
                    document.getElementById('slider-hyd-theta').value = '36.87';
                    document.getElementById('val-hyd-phi').textContent = '120';
                    document.getElementById('slider-hyd-phi').value = '120';
                    document.getElementById('val-hyd-len').textContent = '800';
                    document.getElementById('slider-hyd-len').value = '800';
                };
                document.getElementById('slider-hyd-theta').oninput = (e) => {
                    document.getElementById('val-hyd-theta').textContent = e.target.value;
                    sim.setTheta(e.target.value);
                };
                document.getElementById('slider-hyd-phi').oninput = (e) => {
                    document.getElementById('val-hyd-phi').textContent = e.target.value;
                    sim.setPhi(e.target.value);
                };
                document.getElementById('slider-hyd-len').oninput = (e) => {
                    document.getElementById('val-hyd-len').textContent = e.target.value;
                    sim.setLength(e.target.value);
                };
            }
        } else if (simId === 'sim-block') {
            const sim = Simulations.initSimBlock(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="block-reset-btn" class="btn btn-outline">↺ Reset to Original Block</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Step 1 &theta;_X (about X): <span id="val-block-r1">30</span>&deg;</label>
                        <input id="slider-block-r1" type="range" min="-180" max="180" step="1" value="30">
                    </div>
                    <div class="ctrl-group">
                        <label>Step 2 &theta;_y' (about y'): <span id="val-block-r2">45</span>&deg;</label>
                        <input id="slider-block-r2" type="range" min="-180" max="180" step="1" value="45">
                    </div>
                    <div id="block-readouts"></div>
                `;
                document.getElementById('block-reset-btn').onclick = () => {
                    sim.reset();
                    document.getElementById('val-block-r1').textContent = '30';
                    document.getElementById('slider-block-r1').value = '30';
                    document.getElementById('val-block-r2').textContent = '45';
                    document.getElementById('slider-block-r2').value = '45';
                };
                document.getElementById('slider-block-r1').oninput = (e) => {
                    document.getElementById('val-block-r1').textContent = e.target.value;
                    sim.setRot1(e.target.value);
                };
                document.getElementById('slider-block-r2').oninput = (e) => {
                    document.getElementById('val-block-r2').textContent = e.target.value;
                    sim.setRot2(e.target.value);
                };
            }
        } else if (simId === 'sim-gimbal') {
            const sim = Simulations.initSimGimbal(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="gimbal-lock-btn" class="btn btn-primary" style="background-color: var(--danger);">⚠️ Trigger Gimbal Lock (&theta; = 90&deg;)</button>
                        <button id="gimbal-reset-btn" class="btn btn-outline">↺ Reset Gimbals</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Outer Ring (Yaw &psi;): <span id="val-gimb-yaw">0</span>&deg;</label>
                        <input id="slider-gimb-yaw" type="range" min="-180" max="180" step="1" value="0">
                    </div>
                    <div class="ctrl-group">
                        <label>Middle Ring (Pitch &theta;): <span id="val-gimb-pitch">0</span>&deg;</label>
                        <input id="slider-gimb-pitch" type="range" min="-90" max="90" step="1" value="0">
                    </div>
                    <div class="ctrl-group">
                        <label>Inner Ring (Roll &phi;): <span id="val-gimb-roll">0</span>&deg;</label>
                        <input id="slider-gimb-roll" type="range" min="-180" max="180" step="1" value="0">
                    </div>
                    <div id="gimbal-readouts"></div>
                `;
                document.getElementById('gimbal-lock-btn').onclick = () => {
                    sim.triggerGimbalLock();
                    document.getElementById('val-gimb-pitch').textContent = '90';
                    document.getElementById('slider-gimb-pitch').value = '90';
                };
                document.getElementById('gimbal-reset-btn').onclick = () => {
                    sim.reset();
                    document.getElementById('val-gimb-yaw').textContent = '0';
                    document.getElementById('slider-gimb-yaw').value = '0';
                    document.getElementById('val-gimb-pitch').textContent = '0';
                    document.getElementById('slider-gimb-pitch').value = '0';
                    document.getElementById('val-gimb-roll').textContent = '0';
                    document.getElementById('slider-gimb-roll').value = '0';
                };
                document.getElementById('slider-gimb-yaw').oninput = (e) => {
                    document.getElementById('val-gimb-yaw').textContent = e.target.value;
                    sim.setAngles(e.target.value, undefined, undefined);
                };
                document.getElementById('slider-gimb-pitch').oninput = (e) => {
                    document.getElementById('val-gimb-pitch').textContent = e.target.value;
                    sim.setAngles(undefined, e.target.value, undefined);
                };
                document.getElementById('slider-gimb-roll').oninput = (e) => {
                    document.getElementById('val-gimb-roll').textContent = e.target.value;
                    sim.setAngles(undefined, undefined, e.target.value);
                };
            }
        } else if (simId === 'sim-lec4') {
            const sim = Simulations.initSimLec4(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <div class="axis-btn-group" style="margin-bottom: 10px;">
                            <button id="lec4-btn-cyl" class="btn btn-sm btn-primary active">Cylindrical (R, &theta;, z)</button>
                            <button id="lec4-btn-sph" class="btn btn-sm btn-outline">Spherical (r, &phi;, &theta;)</button>
                        </div>
                        <button id="lec4-reset-btn" class="btn btn-outline">↺ Reset Coordinates</button>
                    </div>
                    <div id="lec4-cyl-controls">
                        <div class="ctrl-group">
                            <label>Radius R: <span id="val-lec4-R">2.5</span> m</label>
                            <input id="slider-lec4-R" type="range" min="0.5" max="5.0" step="0.1" value="2.5">
                        </div>
                        <div class="ctrl-group">
                            <label>Azimuth &theta;: <span id="val-lec4-th">45</span>&deg;</label>
                            <input id="slider-lec4-th" type="range" min="0" max="360" step="1" value="45">
                        </div>
                        <div class="ctrl-group">
                            <label>Height z: <span id="val-lec4-z">1.5</span> m</label>
                            <input id="slider-lec4-z" type="range" min="-3.0" max="3.0" step="0.1" value="1.5">
                        </div>
                        <div class="ctrl-group">
                            <label>Radial Speed R_dot: <span id="val-lec4-dotR">0.5</span> m/s</label>
                            <input id="slider-lec4-dotR" type="range" min="-2.0" max="2.0" step="0.1" value="0.5">
                        </div>
                        <div class="ctrl-group">
                            <label>Spin Rate &theta;_dot: <span id="val-lec4-dotTh">1.2</span> rad/s</label>
                            <input id="slider-lec4-dotTh" type="range" min="-4.0" max="4.0" step="0.1" value="1.2">
                        </div>
                    </div>
                    <div id="lec4-sph-controls" style="display: none;">
                        <div class="ctrl-group">
                            <label>Radius r: <span id="val-lec4-r">3.0</span> m</label>
                            <input id="slider-lec4-r" type="range" min="1.0" max="5.0" step="0.1" value="3.0">
                        </div>
                        <div class="ctrl-group">
                            <label>Colatitude &phi; (from Z): <span id="val-lec4-phi">60</span>&deg;</label>
                            <input id="slider-lec4-phi" type="range" min="1" max="179" step="1" value="60">
                        </div>
                        <div class="ctrl-group">
                            <label>Azimuth &theta;: <span id="val-lec4-th-sph">45</span>&deg;</label>
                            <input id="slider-lec4-th-sph" type="range" min="0" max="360" step="1" value="45">
                        </div>
                    </div>
                    <div id="lec4-readout-card" style="margin-top: 15px;"></div>
                `;

                const btnCyl = document.getElementById('lec4-btn-cyl');
                const btnSph = document.getElementById('lec4-btn-sph');
                const cylCtrls = document.getElementById('lec4-cyl-controls');
                const sphCtrls = document.getElementById('lec4-sph-controls');

                btnCyl.onclick = () => {
                    btnCyl.classList.add('active', 'btn-primary');
                    btnCyl.classList.remove('btn-outline');
                    btnSph.classList.remove('active', 'btn-primary');
                    btnSph.classList.add('btn-outline');
                    cylCtrls.style.display = 'block';
                    sphCtrls.style.display = 'none';
                    sim.setSystem('cylindrical');
                };

                btnSph.onclick = () => {
                    btnSph.classList.add('active', 'btn-primary');
                    btnSph.classList.remove('btn-outline');
                    btnCyl.classList.remove('active', 'btn-primary');
                    btnCyl.classList.add('btn-outline');
                    cylCtrls.style.display = 'none';
                    sphCtrls.style.display = 'block';
                    sim.setSystem('spherical');
                };

                document.getElementById('lec4-reset-btn').onclick = () => sim.reset();

                document.getElementById('slider-lec4-R').oninput = (e) => {
                    document.getElementById('val-lec4-R').textContent = e.target.value;
                    sim.setParams({ R: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-th').oninput = (e) => {
                    document.getElementById('val-lec4-th').textContent = e.target.value;
                    sim.setParams({ thetaDeg: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-z').oninput = (e) => {
                    document.getElementById('val-lec4-z').textContent = e.target.value;
                    sim.setParams({ z: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-dotR').oninput = (e) => {
                    document.getElementById('val-lec4-dotR').textContent = e.target.value;
                    sim.setParams({ dotR: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-dotTh').oninput = (e) => {
                    document.getElementById('val-lec4-dotTh').textContent = e.target.value;
                    sim.setParams({ dotTh: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-r').oninput = (e) => {
                    document.getElementById('val-lec4-r').textContent = e.target.value;
                    sim.setParams({ r: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-phi').oninput = (e) => {
                    document.getElementById('val-lec4-phi').textContent = e.target.value;
                    sim.setParams({ phiDeg: parseFloat(e.target.value) });
                };
                document.getElementById('slider-lec4-th-sph').oninput = (e) => {
                    document.getElementById('val-lec4-th-sph').textContent = e.target.value;
                    sim.setParams({ thetaDeg: parseFloat(e.target.value) });
                };
            }
        } else if (simId === 'sim-lec5') {
            const sim = Simulations.initSimLec5(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="lec5-toggle-btn" class="btn btn-primary">⏸ Pause Track Motion</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Speed v = s_dot: <span id="val-lec5-speed">2.0</span> m/s</label>
                        <input id="slider-lec5-speed" type="range" min="0.2" max="6.0" step="0.1" value="2.0">
                    </div>
                    <div class="ctrl-group">
                        <label>Tangential Accel a_t = v_dot: <span id="val-lec5-dotSpeed">0.5</span> m/s&sup2;</label>
                        <input id="slider-lec5-dotSpeed" type="range" min="-3.0" max="3.0" step="0.1" value="0.5">
                    </div>
                    <div class="ctrl-group">
                        <label>Scrub Track Position (s):</label>
                        <input id="slider-lec5-prog" type="range" min="0" max="1" step="0.005" value="0.25">
                    </div>
                    <div id="lec5-readout-card" style="margin-top: 15px;"></div>
                `;

                let isPlaying = true;
                const toggleBtn = document.getElementById('lec5-toggle-btn');
                toggleBtn.onclick = () => {
                    isPlaying = !isPlaying;
                    toggleBtn.innerHTML = isPlaying ? '⏸ Pause Track Motion' : '▶ Play Track Motion';
                    sim.toggleAnimation();
                };

                document.getElementById('slider-lec5-speed').oninput = (e) => {
                    document.getElementById('val-lec5-speed').textContent = e.target.value;
                    sim.setSpeed(e.target.value);
                };
                document.getElementById('slider-lec5-dotSpeed').oninput = (e) => {
                    document.getElementById('val-lec5-dotSpeed').textContent = e.target.value;
                    sim.setDotSpeed(e.target.value);
                };
                document.getElementById('slider-lec5-prog').oninput = (e) => {
                    sim.setProgress(e.target.value);
                };
            }
        } else if (simId === 'sim-lec6') {
            const sim = Simulations.initSimLec6(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="lec6-toggle-btn" class="btn btn-primary">⏸ Pause Turntable Spin</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Frame Angular Rate &omega;_Z: <span id="val-lec6-w">1.5</span> rad/s</label>
                        <input id="slider-lec6-w" type="range" min="-5.0" max="5.0" step="0.1" value="1.5">
                    </div>
                    <div class="ctrl-group">
                        <label>Vector Length |A|: <span id="val-lec6-len">2.2</span> m</label>
                        <input id="slider-lec6-len" type="range" min="0.5" max="4.0" step="0.1" value="2.2">
                    </div>
                    <div class="ctrl-group">
                        <label>Relative Growth Rate (dA/dt)_xyz: <span id="val-lec6-rate">0.8</span> m/s</label>
                        <input id="slider-lec6-rate" type="range" min="0.0" max="3.0" step="0.1" value="0.8">
                    </div>
                    <div id="lec6-readout-card" style="margin-top: 15px;"></div>
                `;

                let isSpinning = true;
                const toggleBtn = document.getElementById('lec6-toggle-btn');
                toggleBtn.onclick = () => {
                    isSpinning = !isSpinning;
                    toggleBtn.innerHTML = isSpinning ? '⏸ Pause Turntable Spin' : '▶ Play Turntable Spin';
                    sim.toggleRotation();
                };

                document.getElementById('slider-lec6-w').oninput = (e) => {
                    document.getElementById('val-lec6-w').textContent = e.target.value;
                    sim.setOmega(e.target.value);
                };
                document.getElementById('slider-lec6-len').oninput = (e) => {
                    document.getElementById('val-lec6-len').textContent = e.target.value;
                    sim.setLengthA(e.target.value);
                };
                document.getElementById('slider-lec6-rate').oninput = (e) => {
                    document.getElementById('val-lec6-rate').textContent = e.target.value;
                    sim.setRateA(e.target.value);
                };
            }
        } else if (simId === 'sim-lec7') {
            const sim = Simulations.initSimLec7(canvasContainerId);
            this.activeSimInstance = sim;
            if (controlsEl && sim) {
                controlsEl.innerHTML = `
                    <div class="ctrl-group">
                        <button id="lec7-lock-btn" class="btn btn-primary" style="background-color: var(--danger);">⚠️ Snap to Gimbal Lock (&theta; = 0&deg;)</button>
                        <button id="lec7-reset-btn" class="btn btn-outline">↺ Reset Angles</button>
                    </div>
                    <div class="ctrl-group">
                        <label>Outer Ring: Precession &psi; (about Z): <span id="val-lec7-psi">30</span>&deg;</label>
                        <input id="slider-lec7-psi" type="range" min="0" max="360" step="1" value="30">
                    </div>
                    <div class="ctrl-group">
                        <label>Middle Ring: Nutation &theta; (about y'): <span id="val-lec7-th">45</span>&deg;</label>
                        <input id="slider-lec7-th" type="range" min="0" max="180" step="1" value="45">
                    </div>
                    <div class="ctrl-group">
                        <label>Inner Rotor: Spin &phi; (about z''): <span id="val-lec7-phi">60</span>&deg;</label>
                        <input id="slider-lec7-phi" type="range" min="0" max="360" step="1" value="60">
                    </div>
                    <div id="lec7-readout-card" style="margin-top: 15px;"></div>
                `;

                document.getElementById('lec7-lock-btn').onclick = () => {
                    sim.triggerGimbalLock();
                    document.getElementById('val-lec7-th').textContent = '0';
                    document.getElementById('slider-lec7-th').value = '0';
                };

                document.getElementById('lec7-reset-btn').onclick = () => {
                    sim.reset();
                    document.getElementById('val-lec7-psi').textContent = '30';
                    document.getElementById('slider-lec7-psi').value = '30';
                    document.getElementById('val-lec7-th').textContent = '45';
                    document.getElementById('slider-lec7-th').value = '45';
                    document.getElementById('val-lec7-phi').textContent = '60';
                    document.getElementById('slider-lec7-phi').value = '60';
                };

                document.getElementById('slider-lec7-psi').oninput = (e) => {
                    document.getElementById('val-lec7-psi').textContent = e.target.value;
                    sim.setAngles(e.target.value, undefined, undefined);
                };
                document.getElementById('slider-lec7-th').oninput = (e) => {
                    document.getElementById('val-lec7-th').textContent = e.target.value;
                    sim.setAngles(undefined, e.target.value, undefined);
                };
                document.getElementById('slider-lec7-phi').oninput = (e) => {
                    document.getElementById('val-lec7-phi').textContent = e.target.value;
                    sim.setAngles(undefined, undefined, e.target.value);
                };
            }
        }
    },

    setCanonicalAxis(axis, btn) {
        document.querySelectorAll('.axis-btn-group button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.activeSimInstance && this.activeSimInstance.setAxis) {
            this.activeSimInstance.setAxis(axis);
        }
    },

    setLec3Mode(mode, btn) {
        document.querySelectorAll('.axis-btn-group button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.activeSimInstance && this.activeSimInstance.setMode) {
            this.activeSimInstance.setMode(mode);
        }
        const dynamicCtrl = document.getElementById('lec3-dynamic-controls');
        if (mode === 'eigen') {
            dynamicCtrl.innerHTML = `
                <div class="ctrl-group">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        Euler's theorem guarantees every 3D orientation change has a single invariant axis (eigenvalue $\\lambda=1$) and single angle $\\beta$.
                    </p>
                </div>
            `;
            if (window.renderMathInElement) {
                window.renderMathInElement(dynamicCtrl, { delimiters: [{ left: "$", right: "$", display: false }] });
            }
        } else {
            dynamicCtrl.innerHTML = `
                <div class="ctrl-group">
                    <label>Rotation Angles: <span id="duel-angle-val">90</span>&deg;</label>
                    <input id="duel-angle-slider" type="range" min="1" max="90" step="1" value="90">
                    <small style="color: var(--text-muted);">Slide towards 1&deg; to observe infinitesimal commutativity!</small>
                </div>
            `;
            document.getElementById('duel-angle-slider').oninput = (e) => {
                document.getElementById('duel-angle-val').textContent = e.target.value;
                if (this.activeSimInstance && this.activeSimInstance.setDuelAngle) {
                    this.activeSimInstance.setDuelAngle(e.target.value);
                }
            };
        }
    },

    loadLec3Slide22Example() {
        if (this.activeSimInstance && this.activeSimInstance.loadLecture3Example) {
            this.activeSimInstance.loadLecture3Example();
        }
    },

    solveSlide15Puzzle() {
        const solEl = document.getElementById('slide15-solution');
        if (!solEl) return;
        const R = MatrixEngine.solveMissingElementsExample();
        solEl.innerHTML = `
            <div class="puzzle-solution-card">
                <strong>Solution Steps:</strong>
                <ol>
                    <li>Orthogonality constraint $\\vec{c}_1 \\cdot \\vec{c}_2 = 0 \\implies c_{22} = +0.7618$</li>
                    <li>Right-hand coordinate rule $\\det(R) = +1 \\implies \\vec{c}_3 = \\vec{c}_1 \\times \\vec{c}_2 = [0.6124, -0.4630, 0.6409]^T$</li>
                </ol>
                <h5>Completed Proper Rotation Matrix $[R]$:</h5>
                ${MatrixEngine.formatMatrixHTML(R, 4)}
                <div style="color: var(--success); font-weight: bold; margin-top: 5px;">&check; Verified Orthonormal & Proper Det = +1.000</div>
            </div>
        `;
        if (window.renderMathInElement) {
            window.renderMathInElement(solEl, { delimiters: [{ left: "$", right: "$", display: false }] });
        }
    },

    // -------------------------------------------------------------
    // STANDALONE 3D LABS VIEW
    // -------------------------------------------------------------
    initStandaloneLab(simKey) {
        document.querySelectorAll('.lab-nav-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.sim === simKey);
        });
        const container = document.getElementById('standalone-canvas-container');
        const controls = document.getElementById('standalone-controls-container');
        if (!container || !controls) return;
        this.mountSimulation(simKey, 'standalone-canvas-container', 'standalone-controls-container');
    },

    // -------------------------------------------------------------
    // PRACTICE & DIAGNOSTIC ARENA
    // -------------------------------------------------------------
    renderPracticeArena() {
        const container = document.getElementById('quiz-questions-list');
        if (!container) return;

        let html = '';
        QuizBank.forEach((q, idx) => {
            const isAnswered = this.answeredQuestions[q.id] !== undefined;
            const chosen = this.answeredQuestions[q.id];
            const isCorrect = isAnswered && chosen === q.correctIndex;

            html += `
                <div class="question-card" id="q-card-${q.id}">
                    <div class="q-header">
                        <span class="q-num">Question ${idx + 1} of ${QuizBank.length}</span>
                        <span class="bloom-badge ${q.bloomLevel.toLowerCase()}">${q.bloomLevel}</span>
                        <span class="lec-badge-sm">Lec #${q.lecture}</span>
                    </div>
                    <div class="q-body">
                        <p class="q-text">${q.question}</p>
                        <div class="options-list">
                            ${q.options.map((opt, optIdx) => {
                                let optClass = '';
                                if (isAnswered) {
                                    if (optIdx === q.correctIndex) optClass = 'correct';
                                    else if (optIdx === chosen) optClass = 'wrong';
                                }
                                return `
                                    <button class="option-btn ${optClass}" onclick="App.answerQuestion('${q.id}', ${optIdx})" ${isAnswered ? 'disabled' : ''}>
                                        <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
                                        <span class="opt-text">${opt}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <div class="q-actions">
                            <button class="btn btn-sm btn-ghost" onclick="App.toggleHint('${q.id}')">💡 Show Hint</button>
                        </div>
                        <div class="q-hint" id="hint-${q.id}" style="display: none;">
                            <em>Hint:</em> ${q.hint}
                        </div>
                        ${isAnswered ? `
                            <div class="explanation-box ${isCorrect ? 'success' : 'fail'}">
                                <strong>${isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</strong>
                                <p>${q.explanation}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        this.updateScorecard();

        if (window.renderMathInElement) {
            window.renderMathInElement(container, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ]
            });
        }
    },

    answerQuestion(qId, optionIdx) {
        const q = QuizBank.find(item => item.id === qId);
        if (!q || this.answeredQuestions[qId] !== undefined) return;

        this.answeredQuestions[qId] = optionIdx;
        const isCorrect = optionIdx === q.correctIndex;

        this.quizScore.total++;
        if (isCorrect) {
            this.quizScore.correct++;
            this.quizScore.streak++;
        } else {
            this.quizScore.streak = 0;
        }

        this.renderPracticeArena();
        this.renderExamBank();
    },

    toggleHint(qId) {
        const hintEl = document.getElementById(`hint-${qId}`);
        if (hintEl) {
            hintEl.style.display = hintEl.style.display === 'none' ? 'block' : 'none';
        }
    },

    updateScorecard() {
        const scoreEl = document.getElementById('quiz-score-display');
        const streakEl = document.getElementById('quiz-streak-display');
        const pctEl = document.getElementById('quiz-pct-display');
        if (scoreEl) scoreEl.textContent = `${this.quizScore.correct} / ${this.quizScore.total}`;
        if (streakEl) streakEl.textContent = `${this.quizScore.streak} 🔥`;
        if (pctEl) {
            const pct = this.quizScore.total > 0 ? ((this.quizScore.correct / this.quizScore.total) * 100).toFixed(0) : 0;
            pctEl.textContent = `${pct}%`;
        }
    },

    // -------------------------------------------------------------
    // MATLAB & PYTHON CODE LAB
    // -------------------------------------------------------------
    renderCodeLab() {
        const container = document.getElementById('codelab-content');
        if (!container) return;

        let html = '';
        CodeLab.snippets.forEach(snippet => {
            html += `
                <div class="code-snippet-card">
                    <div class="snippet-header">
                        <div>
                            <h4>${snippet.title}</h4>
                            <p class="desc">${snippet.description}</p>
                        </div>
                        <div class="lang-switch-group">
                            <button class="btn btn-sm btn-outline active" onclick="App.switchCodeLang('${snippet.id}', 'matlab', this)">MATLAB</button>
                            <button class="btn btn-sm btn-outline" onclick="App.switchCodeLang('${snippet.id}', 'python', this)">Python</button>
                            <button class="btn btn-sm btn-primary" onclick="App.copyCode('${snippet.id}')">📋 Copy Code</button>
                        </div>
                    </div>
                    <pre class="code-block" id="code-${snippet.id}"><code class="language-matlab">${this.escapeHTML(snippet.matlab)}</code></pre>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    switchCodeLang(snippetId, lang, btn) {
        const card = btn.closest('.code-snippet-card');
        card.querySelectorAll('.lang-switch-group button').forEach(b => {
            if (b.textContent.toLowerCase() === 'matlab' || b.textContent.toLowerCase() === 'python') {
                b.classList.remove('active');
            }
        });
        btn.classList.add('active');

        const snippet = CodeLab.snippets.find(s => s.id === snippetId);
        if (!snippet) return;

        const codeEl = document.getElementById(`code-${snippetId}`);
        if (codeEl) {
            codeEl.innerHTML = `<code class="language-${lang}">${this.escapeHTML(snippet[lang])}</code>`;
        }
    },

    copyCode(snippetId) {
        const codeEl = document.getElementById(`code-${snippetId}`);
        if (!codeEl) return;
        const text = codeEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Code copied to clipboard!');
        });
    },

    escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    // -------------------------------------------------------------
    // FORMULA VAULT & CHEATSHEET
    // -------------------------------------------------------------
    
    // -------------------------------------------------------------
    // EXAM & TUTORIAL PROBLEM-SOLVING HUB
    // -------------------------------------------------------------
    renderExamBank(activeFilter = 'all') {
        const bpContainer = document.getElementById('exam-blueprints-container');
        const probContainer = document.getElementById('exam-problems-container');
        if (!probContainer || typeof MECH342_EXAM_BANK === 'undefined') return;

        // Render Blueprints
        if (bpContainer) {
            if (activeFilter === 'all' || activeFilter === 'blueprints') {
                bpContainer.style.display = 'block';
                let bpHtml = `
                    <div class="concept-card" style="border-left: 4px solid var(--primary); margin-bottom: 25px;">
                        <h3>📐 MECH 342 Test-Solving Blueprints</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">
                            Proven 5-step recipes used by top dynamics students to systematically solve exam and homework problems without getting lost in trigonometry.
                        </p>
                        <div class="roadmap-grid" style="margin-top: 15px;">
                `;
                MECH342_EXAM_BANK.blueprints.forEach(bp => {
                    bpHtml += `
                        <div class="roadmap-box kinematics" style="margin-bottom: 12px;">
                            <span class="badge" style="font-size: 0.75rem;">${bp.targetTopic}</span>
                            <h4 style="margin: 6px 0 10px 0;">${bp.title}</h4>
                            <ol style="padding-left: 18px; margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
                                ${bp.steps.map(s => `<li><strong>${s.action}:</strong> ${s.detail}</li>`).join('')}
                            </ol>
                        </div>
                    `;
                });
                bpHtml += `</div></div>`;
                bpContainer.innerHTML = bpHtml;
            } else {
                bpContainer.style.display = 'none';
            }
        }

        // Filter and Render Problems
        let filteredProblems = MECH342_EXAM_BANK.problems;
        if (activeFilter !== 'all' && activeFilter !== 'blueprints') {
            filteredProblems = filteredProblems.filter(p => p.category === activeFilter);
        }

        let probHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3>Exam & Tutorial Problem Bank (${filteredProblems.length} Problems)</h3>
            </div>
        `;

        filteredProblems.forEach(p => {
            probHtml += `
                <div class="concept-card" style="margin-bottom: 25px; border-radius: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${p.category}</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">${p.source}</span>
                            <h3 style="margin: 6px 0;">${p.title}</h3>
                        </div>
                    </div>

                    <p style="margin: 10px 0; font-size: 0.95rem; line-height: 1.5;">${p.description}</p>

                    <div class="problem-statement" style="margin-bottom: 15px;">
                        <strong>Given Problem Data:</strong>
                        <ul style="margin: 6px 0 0 18px;">
                            ${p.given.map(g => `<li>${g}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Interactive Parameter Solver Card (if available) -->
                    ${this.renderInteractiveSolverWidget(p)}

                    <!-- Step-by-Step Breakdown Accordion -->
                    <div class="steps-accordion" style="margin-top: 15px;">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">📝 Step-by-Step Rigorous Exam Solution:</h4>
                        ${p.steps.map((st, sIdx) => `
                            <div class="exam-solution-step" style="background: rgba(30, 41, 59, 0.4); border-left: 3px solid var(--accent); padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                                <h5 style="color: #facc15; margin: 0 0 6px 0;">${st.title}</h5>
                                <div style="font-size: 0.9rem; line-height: 1.6;">${st.content}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="pedagogy-alert tip" style="margin-top: 15px;">
                        <div class="alert-icon">💡</div>
                        <div class="alert-body">
                            <strong>Exam Takeaway:</strong> ${p.keyTakeaway}
                        </div>
                    </div>
                </div>
            `;
        });

        probContainer.innerHTML = probHtml;

        setTimeout(() => {
            if (window.renderMathInElement) {
                window.renderMathInElement(probContainer, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ]
                });
            }
        }, 50);
    },

    filterExamBank(filter, btn) {
        document.querySelectorAll('.exam-filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.renderExamBank(filter);
    },

    renderInteractiveSolverWidget(problem) {
        if (problem.interactiveType === 'asg1-q1') {
            const res = MatrixEngine.solveAsg1Q1(problem.defaultInputs.F, problem.defaultInputs.a);
            return `
                <div class="solver-widget" style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h5 style="margin: 0; color: #38bdf8;">⚡ Live Parameter Solver & Unit Converter</h5>
                        <button class="btn btn-sm btn-outline" onclick="App.runAsg1Q1Live()">Solve Custom Inputs</button>
                    </div>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">
                        <label style="font-size: 0.85rem;">Force (bk): <input id="asg1q1-in-f" type="number" step="0.5" value="6.5" style="width: 70px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"></label>
                        <label style="font-size: 0.85rem;">Acceleration (tr/ht²): <input id="asg1q1-in-a" type="number" step="0.5" value="4.0" style="width: 70px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"></label>
                    </div>
                    <div id="asg1q1-live-result" class="eigen-grid" style="font-size: 0.85rem;">
                        <div class="item"><strong>Mass (wacky):</strong> ${res.m_wacky} (bk·ht²)/tr</div>
                        <div class="item"><strong>Mass (kg):</strong> ${res.m_kg} kg</div>
                        <div class="item"><strong>g (wacky):</strong> ${res.g_wacky} tr/ht²</div>
                    </div>
                </div>
            `;
        } else if (problem.interactiveType === 'asg1-q2') {
            const res = MatrixEngine.solveAsg1Q2(37);
            return `
                <div class="solver-widget" style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h5 style="margin: 0; color: #38bdf8;">⚡ Live Skew Bracket Rotation Solver</h5>
                        <button class="btn btn-sm btn-outline" onclick="App.runAsg1Q2Live()">Calculate</button>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 0.85rem;">Bracket Rotation Angle &phi;: <input id="asg1q2-in-phi" type="number" step="1" value="37" style="width: 80px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);">&deg;</label>
                    </div>
                    <div id="asg1q2-live-result" class="eigen-grid" style="font-size: 0.85rem;">
                        <div class="item"><strong>Alignment Angles:</strong> &alpha; = ${res.alphaDeg}&deg;, &beta; = ${res.betaDeg}&deg;</div>
                        <div class="item"><strong>Rotated P in XYZ:</strong> [${res.rP_f.join(', ')}] mm</div>
                    </div>
                </div>
            `;
        } else if (problem.interactiveType === 'tut3-q1') {
            const res = MatrixEngine.solveTut3Q1(1.0, 2.0, 0.5, 45);
            return `
                <div class="solver-widget" style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h5 style="margin: 0; color: #38bdf8;">⚡ Live Cylindrical Sliding Bar Solver</h5>
                        <button class="btn btn-sm btn-outline" onclick="App.runTut3Q1Live()">Evaluate</button>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px;">
                        <label style="font-size: 0.85rem;">Length L (m): <input id="tut3q1-in-L" type="number" step="0.1" value="1.0" style="width: 60px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"></label>
                        <label style="font-size: 0.85rem;">Spin &Omega; (rad/s): <input id="tut3q1-in-w" type="number" step="0.5" value="2.0" style="width: 60px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"></label>
                        <label style="font-size: 0.85rem;">Table Speed u (m/s): <input id="tut3q1-in-u" type="number" step="0.1" value="0.5" style="width: 60px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"></label>
                        <label style="font-size: 0.85rem;">Angle &theta;: <input id="tut3q1-in-th" type="number" step="1" value="45" style="width: 60px; padding: 4px; border-radius: 4px; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);">&deg;</label>
                    </div>
                    <div id="tut3q1-live-result" class="eigen-grid" style="font-size: 0.85rem;">
                        <div class="item"><strong>Velocity v_B:</strong> [${res.v.join(', ')}] m/s (|v| = ${res.speed} m/s)</div>
                        <div class="item"><strong>Acceleration a_B:</strong> [${res.a.join(', ')}] m/s² (|a| = ${res.accelMag} m/s²)</div>
                    </div>
                </div>
            `;
        }
        return '';
    },

    runAsg1Q1Live() {
        const F = parseFloat(document.getElementById('asg1q1-in-f').value) || 6.5;
        const a = parseFloat(document.getElementById('asg1q1-in-a').value) || 4.0;
        const res = MatrixEngine.solveAsg1Q1(F, a);
        const el = document.getElementById('asg1q1-live-result');
        if (el) {
            el.innerHTML = `
                <div class="item"><strong>Mass (wacky):</strong> ${res.m_wacky} (bk·ht²)/tr</div>
                <div class="item"><strong>Mass (kg):</strong> ${res.m_kg} kg</div>
                <div class="item"><strong>g (wacky):</strong> ${res.g_wacky} tr/ht²</div>
            `;
        }
    },

    runAsg1Q2Live() {
        const phi = parseFloat(document.getElementById('asg1q2-in-phi').value) || 37;
        const res = MatrixEngine.solveAsg1Q2(phi);
        const el = document.getElementById('asg1q2-live-result');
        if (el) {
            el.innerHTML = `
                <div class="item"><strong>Alignment Angles:</strong> &alpha; = ${res.alphaDeg}&deg;, &beta; = ${res.betaDeg}&deg;</div>
                <div class="item"><strong>Rotated P in XYZ:</strong> [${res.rP_f.join(', ')}] mm</div>
            `;
        }
    },

    runTut3Q1Live() {
        const L = parseFloat(document.getElementById('tut3q1-in-L').value) || 1.0;
        const w = parseFloat(document.getElementById('tut3q1-in-w').value) || 2.0;
        const u = parseFloat(document.getElementById('tut3q1-in-u').value) || 0.5;
        const th = parseFloat(document.getElementById('tut3q1-in-th').value) || 45;
        const res = MatrixEngine.solveTut3Q1(L, w, u, th);
        const el = document.getElementById('tut3q1-live-result');
        if (el) {
            el.innerHTML = `
                <div class="item"><strong>Velocity v_B:</strong> [${res.v.join(', ')}] m/s (|v| = ${res.speed} m/s)</div>
                <div class="item"><strong>Acceleration a_B:</strong> [${res.a.join(', ')}] m/s² (|a| = ${res.accelMag} m/s²)</div>
            `;
        }
    },

    renderFormulaVault() {
        const container = document.getElementById('formula-vault-list');
        if (!container) return;

        container.innerHTML = `
            <div class="formula-grid">
                <div class="formula-card">
                    <h4>Direction Cosines & Matrix Definition</h4>
                    <p>Components of basis vectors and coordinate projection:</p>
                    $$R_{ij} = \\vec{e}'_i \\cdot \\vec{e}_j = \\cos(\\angle(\\vec{e}'_i, \\vec{e}_j))$$
                    $$[x'] = [R] [x], \\quad [x] = [R]^T [x']$$
                </div>

                <div class="formula-card">
                    <h4>Orthonormality & Proper Rotation</h4>
                    <p>Inverting coordinate transformation via matrix transpose:</p>
                    $$[R]^T [R] = [I] \\implies [R]^{-1} = [R]^T$$
                    $$\\det(R) = +1 \\quad (\\text{Right-handed coordinate system})$$
                </div>

                <div class="formula-card">
                    <h4>Canonical Rotations (Ginsberg MECH 342)</h4>
                    $$R_x(\\theta_x) = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\theta_x & \\sin\\theta_x \\\\ 0 & -\\sin\\theta_x & \\cos\\theta_x \\end{bmatrix}$$
                    $$R_y(\\theta_y) = \\begin{bmatrix} \\cos\\theta_y & 0 & -\\sin\\theta_y \\\\ 0 & 1 & 0 \\\\ \\sin\\theta_y & 0 & \\cos\\theta_y \\end{bmatrix}$$
                    $$R_z(\\theta_z) = \\begin{bmatrix} \\cos\\theta_z & \\sin\\theta_z & 0 \\\\ -\\sin\\theta_z & \\cos\\theta_z & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$$
                </div>

                <div class="formula-card">
                    <h4>Sequencing Rules</h4>
                    <p><strong>Body-Fixed (moving axes):</strong> PRE-multiply</p>
                    $$[R_{\\text{body}}] = [R_N] [R_{N-1}] \\cdots [R_2] [R_1]$$
                    <p><strong>Space-Fixed (fixed axes):</strong> POST-multiply</p>
                    $$[R_{\\text{space}}] = [R_1] [R_2] \\cdots [R_{N-1}] [R_N]$$
                    <p><strong>Reversal Theorem:</strong> $[R_{\\text{space}}] = [R_{\\text{body}}]^{\\text{reversed}}$</p>
                </div>

                <div class="formula-card">
                    <h4>Euler's Rotation Theorem (Axis & Angle)</h4>
                    <p>Invariant eigenvalue $\\lambda = 1$ with invariant axis $\\vec{u}_\\beta$:</p>
                    $$[R] \\vec{u}_\\beta = 1 \\cdot \\vec{u}_\\beta$$
                    $$\\text{tr}(R) = 1 + 2\\cos\\beta \\implies \\cos\\beta = \\frac{\\text{tr}(R) - 1}{2}$$
                </div>

                <div class="formula-card">
                    <h4>Impulse-Momentum & Work-Energy Principles</h4>
                    $$\\int_{1}^{2} \\sum \\vec{F} \\cdot d\\vec{r} = \\frac{1}{2}m(v_2^2 - v_1^2)$$
                    $$\\int_{t_1}^{t_2} \\sum \\vec{F} dt = m(\\vec{v}_2 - \\vec{v}_1)$$
                    $$\\vec{M}_O = \\vec{r}_P \\times \\sum \\vec{F}_P = \\dot{\\vec{H}}_O, \\quad \\vec{H}_O = \\vec{r}_P \\times m\\vec{v}_P$$
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------
    // EXTENSIBILITY ENGINE: ADD CUSTOM LECTURES
    // -------------------------------------------------------------
    openAddLectureModal() {
        const modal = document.getElementById('add-lecture-modal');
        if (modal) modal.style.display = 'flex';
    },

    closeAddLectureModal() {
        const modal = document.getElementById('add-lecture-modal');
        if (modal) modal.style.display = 'none';
    },

    saveCustomLecture() {
        const num = document.getElementById('new-lec-num').value.trim();
        const title = document.getElementById('new-lec-title').value.trim();
        const subtitle = document.getElementById('new-lec-sub').value.trim();
        const ginsberg = document.getElementById('new-lec-ginsberg').value.trim();
        const summary = document.getElementById('new-lec-summary').value.trim();
        const content = document.getElementById('new-lec-content').value.trim();

        if (!title) {
            alert('Please provide a lecture title.');
            return;
        }

        const newLec = {
            id: `lec_custom_${Date.now()}`,
            number: num || 'Custom',
            title: title,
            subtitle: subtitle,
            ginsbergRef: ginsberg || 'Custom Notes',
            summary: summary,
            pedagogicalFocus: 'User-defined custom lecture expansion',
            tabs: [
                {
                    id: 'concept',
                    title: 'Concept & Notes',
                    contentHtml: `<div class="concept-card">${content || '<p>No content provided.</p>'}</div>`
                }
            ]
        };

        MECH342_CURRICULUM.lectures.push(newLec);
        this.saveCustomLecturesToStorage();
        this.renderSidebarLectures();
        this.selectLecture(newLec.id);
        this.closeAddLectureModal();
        alert(`Lecture "${title}" added successfully to MECH 342!`);
    },

    saveCustomLecturesToStorage() {
        try {
            const custom = MECH342_CURRICULUM.lectures.filter(l => l.id.startsWith('lec_custom_'));
            localStorage.setItem('mech342_custom_lectures', JSON.stringify(custom));
        } catch (e) {
            console.error('Storage error', e);
        }
    },

    loadCustomLectures() {
        try {
            const stored = localStorage.getItem('mech342_custom_lectures');
            if (stored) {
                const list = JSON.parse(stored);
                list.forEach(item => {
                    if (!MECH342_CURRICULUM.lectures.find(l => l.id === item.id)) {
                        MECH342_CURRICULUM.lectures.push(item);
                    }
                });
                this.renderSidebarLectures();
            }
        } catch (e) {
            console.error('Failed to load custom lectures', e);
        }
    },

    handleSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            this.renderSidebarLectures();
            return;
        }
        const filtered = MECH342_CURRICULUM.lectures.filter(lec => 
            lec.title.toLowerCase().includes(query) ||
            lec.subtitle.toLowerCase().includes(query) ||
            lec.summary.toLowerCase().includes(query)
        );
        const container = document.getElementById('sidebar-lectures-list');
        if (!container) return;

        let html = '';
        filtered.forEach(lec => {
            const isActive = lec.id === this.currentLectureId;
            const badgeText = typeof lec.number === 'number' ? `Lec #${lec.number}` : lec.number;
            html += `
                <div class="sidebar-item ${isActive ? 'active' : ''}" onclick="App.selectLecture('${lec.id}')">
                    <div class="lec-header">
                        <span class="badge">${badgeText}</span>
                        <span class="title">${lec.title}</span>
                    </div>
                    <div class="subtitle">${lec.subtitle}</div>
                </div>
            `;
        });
        container.innerHTML = html || '<div style="padding:15px; color:var(--text-muted);">No matching lectures found.</div>';
    }
};

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
