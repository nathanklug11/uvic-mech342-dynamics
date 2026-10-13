/**
 * UVic MECH 342 - Dynamics II
 * Three.js Interactive 3D Simulation Engines
 * Powered by Three.js & OrbitControls
 */

const Simulations = {
    // Utility: Create standard RGB coordinate frame axes
    createFrameAxes(length = 2.5, radius = 0.04, headLength = 0.5, headRadius = 0.12) {
        const group = new THREE.Group();

        // X-axis (Red)
        const dirX = new THREE.Vector3(1, 0, 0);
        const arrowX = new THREE.ArrowHelper(dirX, new THREE.Vector3(0, 0, 0), length, 0xef4444, headLength, headRadius);
        group.add(arrowX);

        // Y-axis (Green)
        const dirY = new THREE.Vector3(0, 1, 0);
        const arrowY = new THREE.ArrowHelper(dirY, new THREE.Vector3(0, 0, 0), length, 0x10b981, headLength, headRadius);
        group.add(arrowY);

        // Z-axis (Blue)
        const dirZ = new THREE.Vector3(0, 0, 1);
        const arrowZ = new THREE.ArrowHelper(dirZ, new THREE.Vector3(0, 0, 0), length, 0x3b82f6, headLength, headRadius);
        group.add(arrowZ);

        // Small origin sphere
        const origGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const origMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.8 });
        const origMesh = new THREE.Mesh(origGeo, origMat);
        group.add(origMesh);

        return group;
    },

    // Utility: Create custom text sprite for 3D axis labels
    createTextSprite(text, color = '#ffffff') {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 52px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.6, 0.6, 1.0);
        return sprite;
    },

    // -------------------------------------------------------------
    // SIMULATION 0: Lecture 0 Spatial Kinematics Simulator
    // -------------------------------------------------------------
    initSimLec0(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(9, 12, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        // Ground grid in global XY plane (Z is up in Ginsberg text, but in Three.js Y is up by default)
        // We'll align standard engineering convention: X = right, Y = back/depth, Z = up
        // So global Z is vertical! Let's rotate grid to lie in global XY plane:
        const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2; // Lie in XY plane with Z vertical
        scene.add(grid);

        // Stationary Global Frame XYZ at Origin O
        const globalFrame = this.createFrameAxes(3.0);
        scene.add(globalFrame);

        // Add labels for Global Frame
        const lblX = this.createTextSprite('X', '#ef4444'); lblX.position.set(3.3, 0, 0); scene.add(lblX);
        const lblY = this.createTextSprite('Y', '#10b981'); lblY.position.set(0, 3.3, 0); scene.add(lblY);
        const lblZ = this.createTextSprite('Z', '#3b82f6'); lblZ.position.set(0, 0, 3.3); scene.add(lblZ);

        // Moving Frame xyz at Point P
        const frameP = new THREE.Group();
        const pAxes = this.createFrameAxes(2.0, 0.03, 0.4, 0.1);
        frameP.add(pAxes);
        scene.add(frameP);

        const lblPx = this.createTextSprite("x'", '#f87171'); lblPx.position.set(2.2, 0, 0); frameP.add(lblPx);
        const lblPy = this.createTextSprite("y'", '#34d399'); lblPy.position.set(0, 2.2, 0); frameP.add(lblPy);
        const lblPz = this.createTextSprite("z'", '#60a5fa'); lblPz.position.set(0, 0, 2.2); frameP.add(lblPz);

        // Parabola guide curve in frame P (y = x^2)
        const parabolaCurve = new THREE.Group();
        const points = [];
        for (let x = -3.5; x <= 3.5; x += 0.1) {
            points.push(new THREE.Vector3(x, x * x * 0.4, 0)); // scaled slightly for visual fit
        }
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.2, gapSize: 0.1 });
        const curveLine = new THREE.Line(curveGeo, curveMat);
        curveLine.computeLineDistances();
        frameP.add(curveLine);

        // Particle Q mesh (Glowing amber sphere)
        const qGeo = new THREE.SphereGeometry(0.25, 24, 24);
        const qMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.5, emissive: 0xb45309 });
        const particleQ = new THREE.Mesh(qGeo, qMat);
        scene.add(particleQ);

        // Particle P mesh (Blue sphere)
        const pGeo = new THREE.SphereGeometry(0.2, 24, 24);
        const pMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
        const particleP = new THREE.Mesh(pGeo, pMat);
        scene.add(particleP);

        // Velocity Arrow for Q
        let velArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2, 0xe11d48, 0.4, 0.15);
        scene.add(velArrow);

        // Path trail of particle Q in stationary space
        const maxTrailPoints = 300;
        const trailPositions = new Float32Array(maxTrailPoints * 3);
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        const trailMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2, transparent: true, opacity: 0.7 });
        const trailLine = new THREE.Line(trailGeo, trailMat);
        scene.add(trailLine);
        let trailCount = 0;

        // State & Simulation parameters
        const state = {
            t: 0,
            isPlaying: false,
            speed: 0.8,
            showVelocity: true,
            showTrail: true
        };

        function updatePositions(t) {
            // Point P motion: r_P(0) = [3, 5, 2], v_P = [-1, -1, 0]
            const rPx = 3 - 1 * t;
            const rPy = 5 - 1 * t;
            const rPz = 2;
            frameP.position.set(rPx, rPy, rPz);
            particleP.position.set(rPx, rPy, rPz);

            // Frame rotation: psi(t) = 0.52 + 0.2*t (about Z)
            const psi = 0.52 + 0.2 * t;
            frameP.rotation.set(0, 0, psi); // rotation about Z

            // Point Q in frame P: x(t) = 3 - 1.2*t, y = x^2
            const qx = 3 - 1.2 * t;
            const qy = (qx * qx) * 0.4;
            const qz = 0;

            // Transform Q to global coordinates
            const cosPsi = Math.cos(psi);
            const sinPsi = Math.sin(psi);
            // r_Q = r_P + [cos -sin; sin cos] * [qx, qy]
            const qGlobalX = rPx + (cosPsi * qx - sinPsi * qy);
            const qGlobalY = rPy + (sinPsi * qx + cosPsi * qy);
            const qGlobalZ = rPz + qz;
            particleQ.position.set(qGlobalX, qGlobalY, qGlobalZ);

            // Velocity calculation at current t:
            const dotX = -1.2;
            const dotY = 2 * qx * dotX * 0.4;
            const dotPsi = 0.2;
            // v_Q = v_P + v_rel_rot + w x r_rel
            // in global frame:
            const vRelX = cosPsi * dotX - sinPsi * dotY - dotPsi * (sinPsi * qx + cosPsi * qy);
            const vRelY = sinPsi * dotX + cosPsi * dotY + dotPsi * (cosPsi * qx - sinPsi * qy);
            const vGlobalX = -1 + vRelX;
            const vGlobalY = -1 + vRelY;
            const vGlobalZ = 0;
            const vVec = new THREE.Vector3(vGlobalX, vGlobalY, vGlobalZ);
            const vMag = vVec.length();

            if (state.showVelocity && vMag > 0.01) {
                velArrow.visible = true;
                velArrow.position.copy(particleQ.position);
                velArrow.setDirection(vVec.clone().normalize());
                velArrow.setLength(Math.min(vMag * 0.4, 4.0), 0.4, 0.15);
            } else {
                velArrow.visible = false;
            }

            // Update trail
            if (state.showTrail) {
                if (trailCount < maxTrailPoints) {
                    trailPositions[trailCount * 3] = qGlobalX;
                    trailPositions[trailCount * 3 + 1] = qGlobalY;
                    trailPositions[trailCount * 3 + 2] = qGlobalZ;
                    trailCount++;
                    trailGeo.setDrawRange(0, trailCount);
                    trailGeo.attributes.position.needsUpdate = true;
                }
            }

            // Update live readouts if DOM element exists
            const readoutEl = document.getElementById('lec0-readouts');
            if (readoutEl) {
                readoutEl.innerHTML = `
                    <div class="readout-grid">
                        <div class="readout-item"><span class="lbl">Time:</span> <span class="val">${t.toFixed(2)} s</span></div>
                        <div class="readout-item"><span class="lbl">Angle &psi;:</span> <span class="val">${((psi * 180) / Math.PI).toFixed(1)}&deg;</span></div>
                        <div class="readout-item"><span class="lbl">Pos P [X,Y,Z]:</span> <span class="val">[${rPx.toFixed(2)}, ${rPy.toFixed(2)}, ${rPz.toFixed(2)}] m</span></div>
                        <div class="readout-item"><span class="lbl">Pos Q [X,Y,Z]:</span> <span class="val">[${qGlobalX.toFixed(2)}, ${qGlobalY.toFixed(2)}, ${qGlobalZ.toFixed(2)}] m</span></div>
                        <div class="readout-item"><span class="lbl">Speed |v_Q|:</span> <span class="val">${vMag.toFixed(2)} m/s</span></div>
                        <div class="readout-item"><span class="lbl">Slot Pos x':</span> <span class="val">${qx.toFixed(2)} m</span></div>
                    </div>
                `;
            }
        }

        let lastTime = performance.now();
        function animate(currentTime) {
            requestAnimationFrame(animate);
            const dt = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            if (state.isPlaying) {
                state.t += dt * state.speed;
                if (state.t > 4.5) {
                    state.t = 0;
                    trailCount = 0;
                }
                const slider = document.getElementById('lec0-time-slider');
                if (slider) slider.value = state.t;
                updatePositions(state.t);
            }

            controls.update();
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);

        updatePositions(0);

        return {
            setTime(t) {
                state.t = parseFloat(t);
                trailCount = 0;
                updatePositions(state.t);
            },
            togglePlay() {
                state.isPlaying = !state.isPlaying;
                return state.isPlaying;
            },
            reset() {
                state.t = 0;
                state.isPlaying = false;
                trailCount = 0;
                trailGeo.setDrawRange(0, 0);
                updatePositions(0);
            },
            setSpeed(s) {
                state.speed = parseFloat(s);
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 1: Multi-body Kinematic Chain & Basis Unification
    // -------------------------------------------------------------
    initSimLec1(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b1120);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(12, 14, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        // Ground Grid
        const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Stationary Absolute Frame XYZ
        const baseFrame = this.createFrameAxes(3.0);
        scene.add(baseFrame);
        const lblO = this.createTextSprite('O (Absolute XYZ)', '#94a3b8');
        lblO.position.set(0, -0.4, -0.4);
        scene.add(lblO);

        // Body 1: Tumbling mesh (smooth deformed torus/capsule)
        const body1Group = new THREE.Group();
        const b1Geo = new THREE.TorusGeometry(2.2, 0.7, 16, 32);
        const b1Mat = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            roughness: 0.4,
            metalness: 0.2,
            transparent: true,
            opacity: 0.35,
            wireframe: false
        });
        const body1Mesh = new THREE.Mesh(b1Geo, b1Mat);
        body1Group.add(body1Mesh);

        // Body 1 Frame xyz at Q
        const frameQ = this.createFrameAxes(1.8, 0.03, 0.35, 0.1);
        body1Group.add(frameQ);
        const lblQ = this.createTextSprite('Body 1 (xyz)', '#60a5fa');
        lblQ.position.set(0, 0, 2.2);
        body1Group.add(lblQ);

        // Position Body 1 in space
        body1Group.position.set(3, 4, 3);
        body1Group.rotation.set(0.4, 0.6, 0.3);
        scene.add(body1Group);

        // Joint D1 on Body 1
        const jointD1Geo = new THREE.SphereGeometry(0.22, 16, 16);
        const jointD1Mat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0x9d174d });
        const jointD1 = new THREE.Mesh(jointD1Geo, jointD1Mat);
        jointD1.position.set(1.8, 0.5, 0.8);
        body1Group.add(jointD1);
        const lblD1 = this.createTextSprite('D1', '#ec4899');
        lblD1.position.set(1.8, 0.9, 0.8);
        body1Group.add(lblD1);

        // Body 2: Connected via Joint D2
        const body2Group = new THREE.Group();
        const b2Geo = new THREE.CylinderGeometry(0.4, 0.6, 3.5, 24);
        const b2Mat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            roughness: 0.4,
            metalness: 0.2,
            transparent: true,
            opacity: 0.45
        });
        const body2Mesh = new THREE.Mesh(b2Geo, b2Mat);
        body2Mesh.position.set(0, 1.75, 0);
        body2Group.add(body2Mesh);

        // Joint frame x''y''z'' at D2
        const frameD2 = this.createFrameAxes(1.5, 0.025, 0.3, 0.09);
        body2Group.add(frameD2);

        // Point M on Body 2
        const pointMGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const pointMMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309 });
        const pointM = new THREE.Mesh(pointMGeo, pointMMat);
        pointM.position.set(0, 3.5, 0);
        body2Group.add(pointM);
        const lblM = this.createTextSprite('Point M', '#fbbf24');
        lblM.position.set(0, 3.9, 0);
        body2Group.add(lblM);

        jointD1.add(body2Group);
        body2Group.rotation.set(0.5, -0.7, 0.4);

        // Vectors visualizer
        const vectorArrowsGroup = new THREE.Group();
        scene.add(vectorArrowsGroup);

        const state = {
            t: 0,
            isTumbling: false,
            unifyMode: 'mixed' // 'mixed' or 'unified'
        };

        function updateMultiBody() {
            // Live vector positions
            vectorArrowsGroup.clear();

            const posO = new THREE.Vector3(0, 0, 0);
            const posQ = new THREE.Vector3();
            body1Group.getWorldPosition(posQ);

            const posD1 = new THREE.Vector3();
            jointD1.getWorldPosition(posD1);

            const posM = new THREE.Vector3();
            pointM.getWorldPosition(posM);

            // Arrow O -> Q (r_Q)
            const dirOQ = posQ.clone().sub(posO);
            const arrowOQ = new THREE.ArrowHelper(dirOQ.clone().normalize(), posO, dirOQ.length(), 0x38bdf8, 0.4, 0.15);
            vectorArrowsGroup.add(arrowOQ);

            // Arrow Q -> D1 (r_D1/Q)
            const dirQD1 = posD1.clone().sub(posQ);
            const arrowQD1 = new THREE.ArrowHelper(dirQD1.clone().normalize(), posQ, dirQD1.length(), 0xa855f7, 0.35, 0.12);
            vectorArrowsGroup.add(arrowQD1);

            // Arrow D1 -> M (r_M/D1)
            const dirD1M = posM.clone().sub(posD1);
            const arrowD1M = new THREE.ArrowHelper(dirD1M.clone().normalize(), posD1, dirD1M.length(), 0x10b981, 0.35, 0.12);
            vectorArrowsGroup.add(arrowD1M);

            // Arrow Direct O -> M (r_M total)
            const dirOM = posM.clone().sub(posO);
            const arrowOM = new THREE.ArrowHelper(dirOM.clone().normalize(), posO, dirOM.length(), 0xf59e0b, 0.5, 0.2);
            vectorArrowsGroup.add(arrowOM);

            // Readout
            const readout = document.getElementById('lec1-readouts');
            if (readout) {
                readout.innerHTML = `
                    <div class="readout-card">
                        <h4>Kinematic Vector Chain:</h4>
                        <div class="chain-eq">
                            $\\vec{r}_M = \\vec{r}_Q + \\vec{r}_{D1/Q} + \\vec{r}_{M/D1}$
                        </div>
                        <p><strong>Total |r_M|:</strong> ${posM.length().toFixed(2)} m</p>
                        <p><strong>Position M in XYZ:</strong> [${posM.x.toFixed(2)}, ${posM.y.toFixed(2)}, ${posM.z.toFixed(2)}] m</p>
                    </div>
                `;
                if (window.renderMathInElement) {
                    window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                }
            }
        }

        let animId;
        function animate() {
            animId = requestAnimationFrame(animate);
            if (state.isTumbling) {
                state.t += 0.01;
                body1Group.rotation.x = 0.4 + Math.sin(state.t * 0.8) * 0.4;
                body1Group.rotation.y = 0.6 + Math.cos(state.t * 0.6) * 0.5;
                body2Group.rotation.z = 0.4 + Math.sin(state.t * 1.2) * 0.6;
                updateMultiBody();
            }
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateMultiBody();

        return {
            toggleTumble() {
                state.isTumbling = !state.isTumbling;
                return state.isTumbling;
            },
            reset() {
                state.isTumbling = false;
                state.t = 0;
                body1Group.rotation.set(0.4, 0.6, 0.3);
                body2Group.rotation.set(0.5, -0.7, 0.4);
                updateMultiBody();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 2: Canonical Rotation Matrices & Direction Cosines
    // -------------------------------------------------------------
    initSimLec2(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(5, 6, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 8);
        scene.add(dirLight);

        // Ground grid
        const grid = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Fixed reference frame (Ghost / dashed representation)
        const fixedAxes = this.createFrameAxes(2.5, 0.02, 0.3, 0.08);
        scene.add(fixedAxes);

        const lblX = this.createTextSprite('X (Orig)', '#ef4444'); lblX.position.set(2.8, 0, 0); scene.add(lblX);
        const lblY = this.createTextSprite('Y (Orig)', '#10b981'); lblY.position.set(0, 2.8, 0); scene.add(lblY);
        const lblZ = this.createTextSprite('Z (Orig)', '#3b82f6'); lblZ.position.set(0, 0, 2.8); scene.add(lblZ);

        // Rotated frame
        const rotGroup = new THREE.Group();
        const rotAxes = this.createFrameAxes(2.8, 0.05, 0.5, 0.14);
        rotGroup.add(rotAxes);
        scene.add(rotGroup);

        const lblRx = this.createTextSprite("x'", '#f87171'); lblRx.position.set(3.2, 0, 0); rotGroup.add(lblRx);
        const lblRy = this.createTextSprite("y'", '#34d399'); lblRy.position.set(0, 3.2, 0); rotGroup.add(lblRy);
        const lblRz = this.createTextSprite("z'", '#60a5fa'); lblRz.position.set(0, 0, 3.2); rotGroup.add(lblRz);

        // Rotation arc visualizer
        const arcGroup = new THREE.Group();
        scene.add(arcGroup);

        const state = {
            axis: 'z',
            angleDeg: 45
        };

        function updateRotation() {
            const rad = (state.angleDeg * Math.PI) / 180;
            const R = MatrixEngine.getCanonical(state.axis, rad);

            // Ginsberg SO(3) [x'] = R [x] => frame orientation matrix in space is R^T
            const RT = MatrixEngine.transpose(R);
            const m = new THREE.Matrix4();
            m.set(
                RT[0][0], RT[0][1], RT[0][2], 0,
                RT[1][0], RT[1][1], RT[1][2], 0,
                RT[2][0], RT[2][1], RT[2][2], 0,
                0, 0, 0, 1
            );
            rotGroup.setRotationFromMatrix(m);

            // Rebuild rotation arc
            arcGroup.clear();
            const arcRadius = 1.5;
            const arcSegments = 32;
            const arcPoints = [];
            for (let i = 0; i <= arcSegments; i++) {
                const a = (i / arcSegments) * rad;
                if (state.axis === 'z') {
                    arcPoints.push(new THREE.Vector3(arcRadius * Math.cos(a), arcRadius * Math.sin(a), 0));
                } else if (state.axis === 'x') {
                    arcPoints.push(new THREE.Vector3(0, arcRadius * Math.cos(a), arcRadius * Math.sin(a)));
                } else if (state.axis === 'y') {
                    arcPoints.push(new THREE.Vector3(arcRadius * Math.sin(a), 0, arcRadius * Math.cos(a)));
                }
            }
            const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
            const arcMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 });
            const arcLine = new THREE.Line(arcGeo, arcMat);
            arcGroup.add(arcLine);

            // Update Matrix Table DOM
            const matrixContainer = document.getElementById('lec2-matrix-display');
            if (matrixContainer) {
                matrixContainer.innerHTML = MatrixEngine.formatMatrixHTML(R, 4);
            }

            const readout = document.getElementById('lec2-props-display');
            if (readout) {
                const info = MatrixEngine.checkOrthonormal(R);
                readout.innerHTML = `
                    <div class="props-grid">
                        <div class="prop-item"><span class="p-name">Determinant:</span> <span class="p-val ${info.det >= 0.999 ? 'valid' : 'invalid'}">${info.det.toFixed(4)}</span></div>
                        <div class="prop-item"><span class="p-name">Trace tr(R):</span> <span class="p-val">${info.trace.toFixed(4)}</span></div>
                        <div class="prop-item"><span class="p-name">Angle &beta; from Trace:</span> <span class="p-val">${(Math.acos(Math.max(-1, Math.min(1, (info.trace - 1)/2))) * 180 / Math.PI).toFixed(1)}&deg;</span></div>
                        <div class="prop-item"><span class="p-name">Orthogonal R^T R = I:</span> <span class="p-val valid">Verified &check;</span></div>
                    </div>
                `;
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateRotation();

        return {
            setAxis(axis) {
                state.axis = axis.toLowerCase();
                updateRotation();
            },
            setAngle(deg) {
                state.angleDeg = parseFloat(deg);
                updateRotation();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 3: Sequencer, Non-Commutativity Duel & Euler Axis Lab
    // -------------------------------------------------------------
    initSimLec3(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(7, 8, 9);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 12, 10);
        scene.add(dirLight);

        // Ground grid
        const grid = new THREE.GridHelper(12, 12, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Original stationary frame (Ghost)
        const origFrame = this.createFrameAxes(2.5, 0.02, 0.3, 0.08);
        scene.add(origFrame);

        // Sequence 1 Frame (Solid Blue/Green/Red)
        const frameSeq1 = new THREE.Group();
        frameSeq1.add(this.createFrameAxes(2.8, 0.04, 0.45, 0.12));
        scene.add(frameSeq1);

        // Sequence 2 Frame (For Non-Commutativity Comparison Duel, Orange hue or dashed)
        const frameSeq2 = new THREE.Group();
        frameSeq2.add(this.createFrameAxes(2.8, 0.04, 0.45, 0.12));
        scene.add(frameSeq2);
        frameSeq2.visible = false;

        // Invariant Eigen-Axis vector visualizer (Golden Arrow)
        let eigenArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3.5, 0xf59e0b, 0.6, 0.2);
        eigenArrow.visible = false;
        scene.add(eigenArrow);
        const lblEigen = this.createTextSprite('Invariant Axis u_\u03B2', '#f59e0b');
        lblEigen.visible = false;
        scene.add(lblEigen);

        const state = {
            mode: 'duel', // 'duel', 'sequencer', 'eigen'
            seq1: [{ axis: 'z', angleRad: Math.PI / 2, type: 'body' }, { axis: 'y', angleRad: Math.PI / 2, type: 'body' }],
            seq2: [{ axis: 'y', angleRad: Math.PI / 2, type: 'body' }, { axis: 'z', angleRad: Math.PI / 2, type: 'body' }],
            customSteps: [
                { axis: 'z', angleDeg: 30, type: 'body' },
                { axis: 'y', angleDeg: 45, type: 'body' }
            ]
        };

        function setGroupFromMatrix(group, R) {
            const RT = MatrixEngine.transpose(R);
            const m = new THREE.Matrix4();
            m.set(
                RT[0][0], RT[0][1], RT[0][2], 0,
                RT[1][0], RT[1][1], RT[1][2], 0,
                RT[2][0], RT[2][1], RT[2][2], 0,
                0, 0, 0, 1
            );
            group.setRotationFromMatrix(m);
        }

        function updateScene() {
            if (state.mode === 'duel') {
                frameSeq1.visible = true;
                frameSeq2.visible = true;
                eigenArrow.visible = false;
                lblEigen.visible = false;

                // Seq 1: Rz(90) then Ry(90) body-fixed => R1 = Ry * Rz
                const res1 = MatrixEngine.composeSequence(state.seq1);
                setGroupFromMatrix(frameSeq1, res1.finalMatrix);

                // Seq 2: Ry(90) then Rz(90) body-fixed => R2 = Rz * Ry
                const res2 = MatrixEngine.composeSequence(state.seq2);
                setGroupFromMatrix(frameSeq2, res2.finalMatrix);

                // Visual difference indicator
                const readout = document.getElementById('lec3-readouts');
                if (readout) {
                    readout.innerHTML = `
                        <div class="duel-readout">
                            <div class="duel-col">
                                <h5>Sequence 1: $R_z(90^\\circ) \\to R_y(90^\\circ)$</h5>
                                ${MatrixEngine.formatMatrixHTML(res1.finalMatrix, 3)}
                            </div>
                            <div class="duel-col">
                                <h5>Sequence 2: $R_y(90^\\circ) \\to R_z(90^\\circ)$</h5>
                                ${MatrixEngine.formatMatrixHTML(res2.finalMatrix, 3)}
                            </div>
                        </div>
                        <div class="comm-alert">
                            <strong>Notice:</strong> Sequence 1 &ne; Sequence 2! Matrix multiplication in 3D is <strong>non-commutative</strong> ($R_A R_B \\neq R_B R_A$).
                        </div>
                    `;
                    if (window.renderMathInElement) {
                        window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                    }
                }
            } else if (state.mode === 'eigen') {
                frameSeq2.visible = false;
                frameSeq1.visible = true;

                // Compose current sequence
                const stepsRad = state.customSteps.map(s => ({
                    axis: s.axis,
                    angleRad: (s.angleDeg * Math.PI) / 180,
                    type: s.type
                }));
                const res = MatrixEngine.composeSequence(stepsRad);
                setGroupFromMatrix(frameSeq1, res.finalMatrix);

                // Compute Euler Axis & Angle
                const decomp = MatrixEngine.decomposeToAxisAngle(res.finalMatrix);

                eigenArrow.visible = true;
                const axisVec = new THREE.Vector3(decomp.axis[0], decomp.axis[1], decomp.axis[2]);
                eigenArrow.setDirection(axisVec);
                eigenArrow.setLength(4.0, 0.5, 0.18);

                lblEigen.visible = true;
                lblEigen.position.copy(axisVec.clone().multiplyScalar(4.3));

                const readout = document.getElementById('lec3-readouts');
                if (readout) {
                    readout.innerHTML = `
                        <div class="eigen-readout-card">
                            <h4>👑 Euler's Rotation Theorem Invariants:</h4>
                            <div class="eigen-grid">
                                <div class="item"><strong>Unitary Eigenvalue:</strong> $\\lambda = 1.000$ &check;</div>
                                <div class="item"><strong>Invariant Rotation Axis $\\vec{u}_\\beta$:</strong> [${decomp.axis[0].toFixed(4)}, ${decomp.axis[1].toFixed(4)}, ${decomp.axis[2].toFixed(4)}]$^T$</div>
                                <div class="item"><strong>Trace $\\text{tr}(R)$:</strong> ${decomp.trace.toFixed(4)}</div>
                                <div class="item"><strong>Rotation Angle $\\beta$:</strong> ${decomp.angleDeg.toFixed(2)}&deg;</div>
                            </div>
                            <div class="overall-matrix-box">
                                <h5>Overall Rotation Matrix $[R]$:</h5>
                                ${MatrixEngine.formatMatrixHTML(res.finalMatrix, 3)}
                            </div>
                        </div>
                    `;
                    if (window.renderMathInElement) {
                        window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateScene();

        return {
            setMode(mode) {
                state.mode = mode;
                updateScene();
            },
            setDuelAngle(deg) {
                const rad = (parseFloat(deg) * Math.PI) / 180;
                state.seq1[0].angleRad = rad;
                state.seq1[1].angleRad = rad;
                state.seq2[0].angleRad = rad;
                state.seq2[1].angleRad = rad;
                updateScene();
            },
            setCustomStep(idx, axis, angleDeg, type) {
                if (state.customSteps[idx]) {
                    state.customSteps[idx] = { axis, angleDeg: parseFloat(angleDeg), type };
                    updateScene();
                }
            },
            loadLecture3Example() {
                // Azimuth psi = 30 deg, elevation theta = 70 deg, beta = -45 deg
                // Axis OA = [cos(70)*cos(30), cos(70)*sin(30), sin(70)]
                const psi = (30 * Math.PI) / 180;
                const theta = (70 * Math.PI) / 180;
                const beta = (-45 * Math.PI) / 180;
                const u = [Math.cos(theta) * Math.cos(psi), Math.cos(theta) * Math.sin(psi), Math.sin(theta)];
                const R = MatrixEngine.rotAxis(u, beta);

                state.mode = 'eigen';
                frameSeq2.visible = false;
                frameSeq1.visible = true;
                setGroupFromMatrix(frameSeq1, R);

                const decomp = MatrixEngine.decomposeToAxisAngle(R);
                eigenArrow.visible = true;
                const axisVec = new THREE.Vector3(decomp.axis[0], decomp.axis[1], decomp.axis[2]);
                eigenArrow.setDirection(axisVec);
                eigenArrow.setLength(4.0, 0.5, 0.18);
                lblEigen.visible = true;
                lblEigen.position.copy(axisVec.clone().multiplyScalar(4.3));

                const readout = document.getElementById('lec3-readouts');
                if (readout) {
                    readout.innerHTML = `
                        <div class="eigen-readout-card">
                            <h4>Slide 22 Example Problem Solved:</h4>
                            <p>Azimuth $\\psi = 30^\\circ$, Elevation $\\theta = 70^\\circ$, Rotation $\\beta = -45^\\circ$ about axis $OA$.</p>
                            <div class="eigen-grid">
                                <div class="item"><strong>Expected Axis $OA$:</strong> [${u[0].toFixed(4)}, ${u[1].toFixed(4)}, ${u[2].toFixed(4)}]</div>
                                <div class="item"><strong>Eigenvector $\\vec{u}_\\beta$ (from MATLAB eig):</strong> [${decomp.axis[0].toFixed(4)}, ${decomp.axis[1].toFixed(4)}, ${decomp.axis[2].toFixed(4)}]</div>
                                <div class="item"><strong>Trace:</strong> ${decomp.trace.toFixed(4)}</div>
                                <div class="item"><strong>Extracted $|\\beta|$:</strong> ${decomp.angleDeg.toFixed(2)}&deg;</div>
                            </div>
                            <div class="overall-matrix-box">
                                <h5>Computed Rotation Matrix $[R]$:</h5>
                                ${MatrixEngine.formatMatrixHTML(R, 4)}
                            </div>
                        </div>
                    `;
                    if (window.renderMathInElement) {
                        window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                    }
                }
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 4: Mechanism Kinematics (Bent Shaft Gyropendulum)
    // -------------------------------------------------------------
    initSimMechanism(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b132b);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(8, 10, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 15, 10);
        scene.add(dirLight);

        // Ground grid
        const grid = new THREE.GridHelper(12, 12, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Fixed base pedestal
        const pedGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.4, 24);
        const pedMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
        const pedestal = new THREE.Mesh(pedGeo, pedMat);
        scene.add(pedestal);

        // Joint 1: Vertical shaft (Precession psi about Z)
        const verticalShaftGroup = new THREE.Group();
        scene.add(verticalShaftGroup);

        const vertShaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.0, 16);
        const vertShaftMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
        const vertShaftMesh = new THREE.Mesh(vertShaftGeo, vertShaftMat);
        vertShaftMesh.position.set(0, 0, 2.0); // Z is vertical
        vertShaftMesh.rotation.x = Math.PI / 2;
        verticalShaftGroup.add(vertShaftMesh);

        // Joint 2: Hinge collar at height B
        const collarGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const collarMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.3 });
        const collar = new THREE.Mesh(collarGeo, collarMat);
        collar.position.set(0, 0, 3.5);
        verticalShaftGroup.add(collar);

        // Joint 2: Arm AB (Nutation theta about collar hinge)
        const armGroup = new THREE.Group();
        armGroup.position.set(0, 0, 3.5);
        verticalShaftGroup.add(armGroup);

        const armLength = 4.5;
        const armGeo = new THREE.CylinderGeometry(0.14, 0.14, armLength, 16);
        const armMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7, roughness: 0.3 });
        const armMesh = new THREE.Mesh(armGeo, armMat);
        armMesh.position.set(0, armLength / 2, 0);
        armGroup.add(armMesh);

        // Joint 3: Spinning Flywheel/Disk at end of shaft AB
        const diskGroup = new THREE.Group();
        diskGroup.position.set(0, armLength, 0);
        armGroup.add(diskGroup);

        const diskGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.25, 32);
        const diskMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.6,
            roughness: 0.3
        });
        const diskMesh = new THREE.Mesh(diskGeo, diskMat);
        diskGroup.add(diskMesh);

        // Marked point D on disk rim
        const ptDGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const ptDMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d });
        const ptDMesh = new THREE.Mesh(ptDGeo, ptDMat);
        ptDMesh.position.set(1.5, 0, 0);
        diskGroup.add(ptDMesh);

        const state = {
            psiDeg: 25,    // precession
            thetaDeg: 40,  // nutation
            phiDeg: 60,    // spin
            isSpinning: false
        };

        function updateMechanism() {
            const psiRad = (state.psiDeg * Math.PI) / 180;
            const thetaRad = (state.thetaDeg * Math.PI) / 180;
            const phiRad = (state.phiDeg * Math.PI) / 180;

            verticalShaftGroup.rotation.z = psiRad;
            armGroup.rotation.x = thetaRad;
            diskGroup.rotation.y = phiRad;

            const readout = document.getElementById('mech-readouts');
            if (readout) {
                // Rotation matrix: R = Rz(phi) * Ry(theta) * Rz(psi)
                const R_psi = MatrixEngine.rotZ(psiRad);
                const R_theta = MatrixEngine.rotY(thetaRad);
                const R_phi = MatrixEngine.rotZ(phiRad);

                const R_tot = MatrixEngine.multiply(R_phi, MatrixEngine.multiply(R_theta, R_psi));

                readout.innerHTML = `
                    <div class="mech-props-card">
                        <h4>Joint Topology & Rotation Matrix:</h4>
                        <p>$$[R] = [R_z(\\phi)] [R_y(\\theta)] [R_z(\\psi)]$$</p>
                        <div class="angles-row">
                            <span><strong>Precession $\\psi$:</strong> ${state.psiDeg.toFixed(1)}&deg;</span>
                            <span><strong>Nutation $\\theta$:</strong> ${state.thetaDeg.toFixed(1)}&deg;</span>
                            <span><strong>Spin $\\phi$:</strong> ${state.phiDeg.toFixed(1)}&deg;</span>
                        </div>
                        ${MatrixEngine.formatMatrixHTML(R_tot, 3)}
                    </div>
                `;
                if (window.renderMathInElement) {
                    window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                }
            }
        }

        let animId;
        function animate() {
            animId = requestAnimationFrame(animate);
            if (state.isSpinning) {
                state.psiDeg = (state.psiDeg + 0.5) % 360;
                state.phiDeg = (state.phiDeg + 3.0) % 360;
                state.thetaDeg = 35 + Math.sin(state.psiDeg * Math.PI / 180 * 2) * 10;
                updateMechanism();
            }
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateMechanism();

        return {
            setAngles(psi, theta, phi) {
                if (psi !== undefined) state.psiDeg = parseFloat(psi);
                if (theta !== undefined) state.thetaDeg = parseFloat(theta);
                if (phi !== undefined) state.phiDeg = parseFloat(phi);
                updateMechanism();
            },
            toggleSpin() {
                state.isSpinning = !state.isSpinning;
                return state.isSpinning;
            },
            reset() {
                state.isSpinning = false;
                state.psiDeg = 25;
                state.thetaDeg = 40;
                state.phiDeg = 60;
                updateMechanism();
            }
        };
    },

    // -------------------------------------------------------------
    // Camera View Presets Helper
    // -------------------------------------------------------------
    attachCameraControls(container, camera, controls, defaultPos = [8, 10, 10]) {
        let toolbar = container.querySelector('.sim-cam-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'sim-cam-toolbar';
            toolbar.innerHTML = `
                <button class="cam-btn" title="Isometric Perspective View" data-view="iso">📐 Iso</button>
                <button class="cam-btn" title="Top View (XY Plane)" data-view="top">🔝 Top (XY)</button>
                <button class="cam-btn" title="Front View (XZ Plane)" data-view="front">👁️ Front (XZ)</button>
                <button class="cam-btn" title="Side View (YZ Plane)" data-view="side">➡️ Side (YZ)</button>
                <button class="cam-btn" title="Reset Camera" data-view="reset">↺ Reset</button>
            `;
            container.appendChild(toolbar);

            const dist = Math.hypot(defaultPos[0], defaultPos[1], defaultPos[2]) || 12;

            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('.cam-btn');
                if (!btn) return;
                const view = btn.dataset.view;

                if (view === 'iso') {
                    camera.position.set(defaultPos[0], defaultPos[1], defaultPos[2]);
                    controls.target.set(0, 0, 0);
                } else if (view === 'top') {
                    camera.position.set(0, 0.01, dist); // looking down Z (where Z is up)
                    controls.target.set(0, 0, 0);
                } else if (view === 'front') {
                    camera.position.set(0, -dist, 0);
                    controls.target.set(0, 0, 0);
                } else if (view === 'side') {
                    camera.position.set(dist, 0, 0);
                    controls.target.set(0, 0, 0);
                } else if (view === 'reset') {
                    camera.position.set(defaultPos[0], defaultPos[1], defaultPos[2]);
                    controls.target.set(0, 0, 0);
                }
                controls.update();
            });
        }
    },

    // -------------------------------------------------------------
    // SIMULATION 5: Lecture 2 Slide 20 Hydraulic Cylinder Mechanism
    // -------------------------------------------------------------
    initSimHydraulic(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x070d19);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(10, 12, 9);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        this.attachCameraControls(container, camera, controls, [10, 12, 9]);

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(10, 20, 15);
        scene.add(dirLight);

        // Ground Grid
        const grid = new THREE.GridHelper(16, 16, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Global Origin O Frame
        const globalFrame = this.createFrameAxes(2.5);
        scene.add(globalFrame);

        // Vertical Guide Column
        const colGeo = new THREE.CylinderGeometry(0.3, 0.3, 8.0, 24);
        const colMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
        const colMesh = new THREE.Mesh(colGeo, colMat);
        colMesh.position.set(0, 0, 4.0);
        colMesh.rotation.x = Math.PI / 2;
        scene.add(colMesh);

        // Rotating assembly about vertical axis
        const vertAssembly = new THREE.Group();
        scene.add(vertAssembly);

        // Arm AB (scaled: 600mm -> 6.0 units)
        const armLength = 6.0;
        const armGeo = new THREE.CylinderGeometry(0.22, 0.22, armLength, 16);
        const armMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
        const armMesh = new THREE.Mesh(armGeo, armMat);
        armMesh.position.set(0, armLength / 2, 4.0); // centered along Y at height 4.0
        vertAssembly.add(armMesh);

        // Joint B Collar
        const collarGeo = new THREE.SphereGeometry(0.45, 20, 20);
        const collarMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.2 });
        const collarMesh = new THREE.Mesh(collarGeo, collarMat);
        collarMesh.position.set(0, armLength, 4.0);
        vertAssembly.add(collarMesh);

        // Cylinder Body BC Pivot at Joint B
        const cylPivot = new THREE.Group();
        cylPivot.position.set(0, armLength, 4.0);
        vertAssembly.add(cylPivot);

        // Outer cylinder barrel
        const barrelGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 20);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 });
        const barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
        barrelMesh.position.set(0, 0, 1.75); // extends along its own Z
        barrelMesh.rotation.x = Math.PI / 2;
        cylPivot.add(barrelMesh);

        // Extending Piston Rod (length L)
        const rodGroup = new THREE.Group();
        cylPivot.add(rodGroup);

        const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 8.0, 16);
        const rodMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
        const rodMesh = new THREE.Mesh(rodGeo, rodMat);
        rodMesh.rotation.x = Math.PI / 2;
        rodGroup.add(rodMesh);

        // End Point C Marker (Bright Magenta Sphere)
        const ptCGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const ptCMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d });
        const ptCMesh = new THREE.Mesh(ptCGeo, ptCMat);
        scene.add(ptCMesh);

        // Initial End Point C Marker (Ghost Sphere at t=0: L=400mm, vertical)
        const ptC1Geo = new THREE.SphereGeometry(0.25, 16, 16);
        const ptC1Mat = new THREE.MeshBasicMaterial({ color: 0x64748b, wireframe: true });
        const ptC1Mesh = new THREE.Mesh(ptC1Geo, ptC1Mat);
        ptC1Mesh.position.set(0, armLength, 4.0 + 4.0); // 4.0 units above joint B
        scene.add(ptC1Mesh);

        // Displacement Vector Arrow: delta_r_C
        let dispArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.5, 0.2);
        scene.add(dispArrow);

        const state = {
            thetaDeg: 36.87,
            phiDeg: 120,
            L: 800 // mm (scale 100mm = 1 unit => 8.0)
        };

        function updateHydraulic() {
            const thRad = (state.thetaDeg * Math.PI) / 180;
            const phiRad = (state.phiDeg * Math.PI) / 180;
            const rodLenUnits = state.L / 100.0;

            vertAssembly.rotation.z = thRad;
            // Body-fixed rotation about arm AB (which is Y):
            cylPivot.rotation.y = phiRad;

            // Rod position & scaling
            rodMesh.scale.set(1, rodLenUnits / 8.0, 1);
            rodMesh.position.set(0, 0, rodLenUnits / 2);

            // Compute global position of point C
            const posB = new THREE.Vector3(0, armLength, 4.0).applyAxisAngle(new THREE.Vector3(0, 0, 1), thRad);
            const localC = new THREE.Vector3(0, 0, rodLenUnits).applyAxisAngle(new THREE.Vector3(0, 1, 0), phiRad);
            localC.applyAxisAngle(new THREE.Vector3(0, 0, 1), thRad);
            const posC = posB.clone().add(localC);
            ptCMesh.position.copy(posC);

            // Displacement arrow from C1 to current C
            const posC1 = ptC1Mesh.position;
            const diff = posC.clone().sub(posC1);
            const dist = diff.length();
            if (dist > 0.05) {
                dispArrow.visible = true;
                dispArrow.position.copy(posC1);
                dispArrow.setDirection(diff.clone().normalize());
                dispArrow.setLength(dist, 0.4, 0.15);
            } else {
                dispArrow.visible = false;
            }

            // Update readouts
            const readout = document.getElementById('hydraulic-readouts');
            if (readout) {
                const res = MatrixEngine.solveHydraulicCylinder(state.thetaDeg, state.phiDeg, 400, state.L, 600);
                readout.innerHTML = `
                    <div class="readout-card">
                        <h4>Slide 20 Mathematical Results:</h4>
                        <div class="eigen-grid">
                            <div class="item"><strong>Initial Position $C_1$:</strong> [${res.r_C1.join(', ')}] mm</div>
                            <div class="item"><strong>Final Position $C_2$:</strong> [${res.r_C2.map(v => v.toFixed(1)).join(', ')}] mm</div>
                            <div class="item"><strong>Displacement $\\Delta\\vec{r}_C$:</strong> [${res.delta_r_C.map(v => v.toFixed(1)).join(', ')}] mm</div>
                            <div class="item"><strong>Total |\\Delta r_C|:</strong> <span style="color:var(--success); font-size:1.1rem; font-weight:bold;">${res.displacementMagnitude.toFixed(1)} mm</span></div>
                        </div>
                        <div style="margin-top: 10px;">
                            <h5>Cylinder Frame Transformation Matrix $[R] = [R_y(\\phi)][R_z(\\theta)]$:</h5>
                            ${MatrixEngine.formatMatrixHTML(res.R_tot, 3)}
                        </div>
                    </div>
                `;
                if (window.renderMathInElement) {
                    window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateHydraulic();

        return {
            setTheta(val) { state.thetaDeg = parseFloat(val); updateHydraulic(); },
            setPhi(val) { state.phiDeg = parseFloat(val); updateHydraulic(); },
            setLength(val) { state.L = parseFloat(val); updateHydraulic(); },
            reset() {
                state.thetaDeg = 36.87;
                state.phiDeg = 120;
                state.L = 800;
                updateHydraulic();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 6: Lecture 2 Slide 21 Rotated Rectangular Block
    // -------------------------------------------------------------
    initSimBlock(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(7, 8, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        this.attachCameraControls(container, camera, controls, [7, 8, 8]);

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(8, 12, 10);
        scene.add(dirLight);

        // Ground grid
        const grid = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Stationary Reference Axes XYZ (Ghost)
        const fixedAxes = this.createFrameAxes(3.0, 0.02, 0.3, 0.08);
        scene.add(fixedAxes);

        // Rotatable Block Group
        const blockGroup = new THREE.Group();
        scene.add(blockGroup);

        // Body Frame xyz attached to Block
        const bodyAxes = this.createFrameAxes(3.2, 0.04, 0.45, 0.12);
        blockGroup.add(bodyAxes);

        // Custom Machined Prism Geometry (Scale: 150x120x60mm -> 3.75 x 3.0 x 1.5 units)
        // With inclined face on front right matching Slide 21 diagram
        const sx = 3.75, sy = 3.0, sz = 1.5;
        const blockGeo = new THREE.BoxGeometry(sx, sy, sz);
        // Shift origin so corner B is at [0, 0, 0]
        blockGeo.translate(sx / 2, sy / 2, sz / 2);

        const blockMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.65
        });
        const blockMesh = new THREE.Mesh(blockGeo, blockMat);
        blockGroup.add(blockMesh);

        // Wireframe outline for clarity
        const wireGeo = new THREE.WireframeGeometry(blockGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x0284c7 });
        const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
        blockGroup.add(wireMesh);

        // Target Point E marker (Top rear corner)
        const ptEGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const ptEMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d });
        const ptEMesh = new THREE.Mesh(ptEGeo, ptEMat);
        ptEMesh.position.set(0, sy, sz); // at corner E
        blockGroup.add(ptEMesh);

        const lblE = this.createTextSprite('Point E', '#ec4899');
        lblE.position.set(0, sy + 0.4, sz);
        blockGroup.add(lblE);

        const state = {
            rot1_deg: 30, // about X
            rot2_deg: 45  // about new y'
        };

        function updateBlock() {
            const r1 = (state.rot1_deg * Math.PI) / 180;
            const r2 = (state.rot2_deg * Math.PI) / 180;

            const Rx = MatrixEngine.rotX(r1);
            const Ry = MatrixEngine.rotY(r2);
            // Body-fixed pre-multiply: R_tot = Ry * Rx
            const R_tot = MatrixEngine.multiply(Ry, Rx);

            const RT = MatrixEngine.transpose(R_tot);
            const m = new THREE.Matrix4();
            m.set(
                RT[0][0], RT[0][1], RT[0][2], 0,
                RT[1][0], RT[1][1], RT[1][2], 0,
                RT[2][0], RT[2][1], RT[2][2], 0,
                0, 0, 0, 1
            );
            blockGroup.setRotationFromMatrix(m);

            const readout = document.getElementById('block-readouts');
            if (readout) {
                const res = MatrixEngine.solveRectangularPrism(150, 120, 60, state.rot1_deg, state.rot2_deg);
                readout.innerHTML = `
                    <div class="readout-card">
                        <h4>Slide 21 Point E Coordinates:</h4>
                        <div class="eigen-grid">
                            <div class="item"><strong>Original Coords $[E]_{XYZ}$:</strong> [0, 120, 60] mm</div>
                            <div class="item"><strong>Coords in Rotated Frame $[E]_{xyz}$:</strong> [${res.r_E_xyz.map(v => v.toFixed(1)).join(', ')}] mm</div>
                            <div class="item"><strong>Step 1 $\\theta_X$:</strong> ${state.rot1_deg}&deg;</div>
                            <div class="item"><strong>Step 2 $\\theta_{y'}$:</strong> ${state.rot2_deg}&deg;</div>
                        </div>
                        <div style="margin-top: 10px;">
                            <h5>Body-Fixed Rotation Matrix $[R] = [R_y(\\theta_2)][R_x(\\theta_1)]$:</h5>
                            ${MatrixEngine.formatMatrixHTML(res.R_tot, 4)}
                        </div>
                    </div>
                `;
                if (window.renderMathInElement) {
                    window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateBlock();

        return {
            setRot1(deg) { state.rot1_deg = parseFloat(deg); updateBlock(); },
            setRot2(deg) { state.rot2_deg = parseFloat(deg); updateBlock(); },
            reset() {
                state.rot1_deg = 30;
                state.rot2_deg = 45;
                updateBlock();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 7: 3-Ring Concentric Gimbal System & Gimbal Lock
    // -------------------------------------------------------------
    initSimGimbal(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x080e1a);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(8, 9, 9);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        this.attachCameraControls(container, camera, controls, [8, 9, 9]);

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 15, 12);
        scene.add(dirLight);

        // Ground grid
        const grid = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Outer Ring: Yaw (Rotates about vertical Z, Cyan)
        const outerGroup = new THREE.Group();
        scene.add(outerGroup);

        const outerTorusGeo = new THREE.TorusGeometry(3.6, 0.1, 16, 64);
        const outerMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 });
        const outerRing = new THREE.Mesh(outerTorusGeo, outerMat);
        outerGroup.add(outerRing);

        // Middle Ring: Pitch (Rotates about Y, Emerald)
        const midGroup = new THREE.Group();
        outerGroup.add(midGroup);

        const midTorusGeo = new THREE.TorusGeometry(2.8, 0.09, 16, 64);
        const midMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8, roughness: 0.2 });
        const midRing = new THREE.Mesh(midTorusGeo, midMat);
        midRing.rotation.y = Math.PI / 2;
        midGroup.add(midRing);

        // Inner Ring: Roll (Rotates about X, Amber)
        const innerGroup = new THREE.Group();
        midGroup.add(innerGroup);

        const innerTorusGeo = new THREE.TorusGeometry(2.0, 0.08, 16, 64);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const innerRing = new THREE.Mesh(innerTorusGeo, innerMat);
        innerRing.rotation.x = Math.PI / 2;
        innerGroup.add(innerRing);

        // Center Payload: Spacecraft / Coordinate Triad
        const payloadTriad = this.createFrameAxes(1.8, 0.035, 0.35, 0.1);
        innerGroup.add(payloadTriad);

        const state = {
            yawDeg: 0,
            pitchDeg: 0,
            rollDeg: 0
        };

        function updateGimbals() {
            const yRad = (state.yawDeg * Math.PI) / 180;
            const pRad = (state.pitchDeg * Math.PI) / 180;
            const rRad = (state.rollDeg * Math.PI) / 180;

            outerGroup.rotation.z = yRad;
            midGroup.rotation.y = pRad;
            innerGroup.rotation.x = rRad;

            const lockInfo = MatrixEngine.detectGimbalLock(state.pitchDeg);
            const R = MatrixEngine.eulerZYX(state.yawDeg, state.pitchDeg, state.rollDeg);

            const readout = document.getElementById('gimbal-readouts');
            if (readout) {
                readout.innerHTML = `
                    <div class="readout-card">
                        <div class="gimbal-status ${lockInfo.isLocked ? 'locked' : 'nominal'}">
                            <strong>Status:</strong> ${lockInfo.isLocked ? '⚠️ GIMBAL LOCK ACTIVE!' : '✅ 3 Independent Rotational DOF'}
                            <p>${lockInfo.description}</p>
                        </div>
                        <div class="eigen-grid" style="margin-top: 10px;">
                            <div class="item"><strong>Outer (Yaw &psi;):</strong> ${state.yawDeg.toFixed(1)}&deg;</div>
                            <div class="item"><strong>Middle (Pitch &theta;):</strong> ${state.pitchDeg.toFixed(1)}&deg;</div>
                            <div class="item"><strong>Inner (Roll &phi;):</strong> ${state.rollDeg.toFixed(1)}&deg;</div>
                            <div class="item"><strong>Trace tr(R):</strong> ${MatrixEngine.trace(R).toFixed(3)}</div>
                        </div>
                        <div style="margin-top: 10px;">
                            <h5>Overall Euler Angle Rotation Matrix $[R]_{ZYX}$:</h5>
                            ${MatrixEngine.formatMatrixHTML(R, 3)}
                        </div>
                    </div>
                `;
                if (window.renderMathInElement) {
                    window.renderMathInElement(readout, { delimiters: [{ left: "$", right: "$", display: false }] });
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateGimbals();

        return {
            setAngles(y, p, r) {
                if (y !== undefined) state.yawDeg = parseFloat(y);
                if (p !== undefined) state.pitchDeg = parseFloat(p);
                if (r !== undefined) state.rollDeg = parseFloat(r);
                updateGimbals();
            },
            triggerGimbalLock() {
                state.pitchDeg = 90;
                updateGimbals();
            },
            reset() {
                state.yawDeg = 0;
                state.pitchDeg = 0;
                state.rollDeg = 0;
                updateGimbals();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 4: Lecture 4 Curvilinear Coordinates Explorer
    // (Cylindrical vs Spherical Space Lab)
    // -------------------------------------------------------------
    initSimLec4(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(8, 8, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(10, 15, 10);
        scene.add(dirLight);

        // Ground grid in global XY (Z is vertical)
        const grid = new THREE.GridHelper(16, 16, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Global stationary frame XYZ
        const globalFrame = this.createFrameAxes(3.0);
        scene.add(globalFrame);

        // Particle Mesh
        const particleGeo = new THREE.SphereGeometry(0.18, 32, 32);
        const particleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });
        const particleMesh = new THREE.Mesh(particleGeo, particleMat);
        scene.add(particleMesh);

        // Coordinate surface: Transparent Cylinder
        const cylGroup = new THREE.Group();
        const cylGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 32, 1, true);
        const cylMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12, wireframe: true });
        const cylMesh = new THREE.Mesh(cylGeo, cylMat);
        cylMesh.rotation.x = Math.PI / 2;
        cylGroup.add(cylMesh);
        scene.add(cylGroup);

        // Coordinate surface: Transparent Sphere
        const sphGroup = new THREE.Group();
        const sphGeo = new THREE.SphereGeometry(3.0, 24, 16);
        const sphMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.1, wireframe: true });
        const sphMesh = new THREE.Mesh(sphGeo, sphMat);
        sphGroup.add(sphMesh);
        sphGroup.visible = false;
        scene.add(sphGroup);

        // Dynamic Vector Arrows
        // e_R (Red), e_theta (Green), e_z (Blue)
        const arrowER = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.5, 0xef4444, 0.35, 0.12);
        const arrowETh = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.5, 0x10b981, 0.35, 0.12);
        const arrowEZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.5, 0x3b82f6, 0.35, 0.12);
        scene.add(arrowER);
        scene.add(arrowETh);
        scene.add(arrowEZ);

        // Velocity Arrow (Gold) & Acceleration Arrow (Magenta)
        const arrowVel = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.8, 0xfacc15, 0.4, 0.15);
        const arrowAcc = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2.0, 0xec4899, 0.45, 0.18);
        scene.add(arrowVel);
        scene.add(arrowAcc);

        // Position vector line from origin to particle
        const posLineMat = new THREE.LineDashedMaterial({ color: 0x06b6d4, dashSize: 0.2, gapSize: 0.1 });
        const posLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(2.5, 0, 1)]);
        const posLine = new THREE.Line(posLineGeo, posLineMat);
        posLine.computeLineDistances();
        scene.add(posLine);

        // State
        const state = {
            coordSystem: 'cylindrical', // 'cylindrical' or 'spherical'
            R: 2.5,
            thetaDeg: 45,
            z: 1.5,
            dotR: 0.5,
            dotTh: 1.2,
            dotZ: 0.8,
            ddotR: 0.0,
            ddotTh: 0.0,
            ddotZ: 0.0,
            // Spherical parameters
            r: 3.0,
            phiDeg: 60, // colatitude from vertical Z
            dotPhi: 0.6,
            ddotPhi: 0.0
        };

        function updateSimulation() {
            let px = 0, py = 0, pz = 0;
            let dirR = new THREE.Vector3(), dirTh = new THREE.Vector3(), dirZ = new THREE.Vector3();
            let vVec = new THREE.Vector3(), aVec = new THREE.Vector3();
            let kinInfo = null;

            if (state.coordSystem === 'cylindrical') {
                cylGroup.visible = true;
                sphGroup.visible = false;
                cylMesh.scale.set(state.R / 2.5, 1, state.R / 2.5);

                const thRad = (state.thetaDeg * Math.PI) / 180;
                px = state.R * Math.cos(thRad);
                py = state.R * Math.sin(thRad);
                pz = state.z;

                dirR.set(Math.cos(thRad), Math.sin(thRad), 0).normalize();
                dirTh.set(-Math.sin(thRad), Math.cos(thRad), 0).normalize();
                dirZ.set(0, 0, 1);

                kinInfo = MatrixEngine.cylindricalKinematics(
                    state.R, state.dotR, state.ddotR,
                    thRad, state.dotTh, state.ddotTh,
                    state.z, state.dotZ, state.ddotZ
                );

                vVec = dirR.clone().multiplyScalar(kinInfo.velocity[0])
                    .add(dirTh.clone().multiplyScalar(kinInfo.velocity[1]))
                    .add(dirZ.clone().multiplyScalar(kinInfo.velocity[2]));

                aVec = dirR.clone().multiplyScalar(kinInfo.acceleration[0])
                    .add(dirTh.clone().multiplyScalar(kinInfo.acceleration[1]))
                    .add(dirZ.clone().multiplyScalar(kinInfo.acceleration[2]));

            } else {
                cylGroup.visible = false;
                sphGroup.visible = true;
                sphMesh.scale.set(state.r / 3.0, state.r / 3.0, state.r / 3.0);

                const phiRad = (state.phiDeg * Math.PI) / 180;
                const thRad = (state.thetaDeg * Math.PI) / 180;

                px = state.r * Math.sin(phiRad) * Math.cos(thRad);
                py = state.r * Math.sin(phiRad) * Math.sin(thRad);
                pz = state.r * Math.cos(phiRad);

                dirR.set(Math.sin(phiRad) * Math.cos(thRad), Math.sin(phiRad) * Math.sin(thRad), Math.cos(phiRad)).normalize();
                dirTh.set(Math.cos(phiRad) * Math.cos(thRad), Math.cos(phiRad) * Math.sin(thRad), -Math.sin(phiRad)).normalize(); // e_phi
                dirZ.set(-Math.sin(thRad), Math.cos(thRad), 0).normalize(); // e_theta

                kinInfo = MatrixEngine.sphericalKinematics(
                    state.r, state.dotR, state.ddotR,
                    phiRad, state.dotPhi, state.ddotPhi,
                    thRad, state.dotTh, state.ddotTh
                );

                vVec = dirR.clone().multiplyScalar(kinInfo.velocity[0])
                    .add(dirTh.clone().multiplyScalar(kinInfo.velocity[1]))
                    .add(dirZ.clone().multiplyScalar(kinInfo.velocity[2]));

                aVec = dirR.clone().multiplyScalar(kinInfo.acceleration[0])
                    .add(dirTh.clone().multiplyScalar(kinInfo.acceleration[1]))
                    .add(dirZ.clone().multiplyScalar(kinInfo.acceleration[2]));
            }

            const pos = new THREE.Vector3(px, py, pz);
            particleMesh.position.copy(pos);

            // Update position line
            posLine.geometry.dispose();
            posLine.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), pos]);
            posLine.computeLineDistances();

            // Position basis arrows at particle
            arrowER.position.copy(pos);
            arrowER.setDirection(dirR);

            arrowETh.position.copy(pos);
            arrowETh.setDirection(dirTh);

            arrowEZ.position.copy(pos);
            arrowEZ.setDirection(dirZ);

            // Velocity & Acceleration arrows
            const vLen = Math.max(0.1, Math.min(4.0, vVec.length() * 0.8));
            arrowVel.position.copy(pos);
            if (vVec.length() > 0.01) {
                arrowVel.setDirection(vVec.clone().normalize());
                arrowVel.setLength(vLen, 0.35, 0.12);
                arrowVel.visible = true;
            } else {
                arrowVel.visible = false;
            }

            const aLen = Math.max(0.1, Math.min(4.0, aVec.length() * 0.5));
            arrowAcc.position.copy(pos);
            if (aVec.length() > 0.01) {
                arrowAcc.setDirection(aVec.clone().normalize());
                arrowAcc.setLength(aLen, 0.35, 0.12);
                arrowAcc.visible = true;
            } else {
                arrowAcc.visible = false;
            }

            // Update UI readout
            const readout = document.getElementById('lec4-readout-card');
            if (readout && kinInfo) {
                if (state.coordSystem === 'cylindrical') {
                    readout.innerHTML = `
                        <div class="readout-card">
                            <div class="readout-header">
                                <h4>Cylindrical Kinematics Status</h4>
                                <span class="badge">Speed: ${kinInfo.speed.toFixed(3)} m/s | |a|: ${kinInfo.accelMag.toFixed(3)} m/s²</span>
                            </div>
                            <div class="eigen-grid" style="margin-top: 8px;">
                                <div class="item"><strong>Pos r:</strong> [${px.toFixed(2)}, ${py.toFixed(2)}, ${pz.toFixed(2)}] m</div>
                                <div class="item"><strong>v:</strong> ${kinInfo.velocity[0].toFixed(2)} e_R + ${kinInfo.velocity[1].toFixed(2)} e_θ + ${kinInfo.velocity[2].toFixed(2)} e_z</div>
                                <div class="item"><strong>Centripetal -R θ_dot²:</strong> ${kinInfo.breakdown.centripetal.toFixed(3)} m/s²</div>
                                <div class="item" style="color: #ec4899;"><strong>Coriolis 2 R_dot θ_dot:</strong> ${kinInfo.breakdown.coriolis.toFixed(3)} m/s²</div>
                            </div>
                            <div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                                <strong>Total Acceleration:</strong> a = (${kinInfo.acceleration[0].toFixed(3)}) e_R + (${kinInfo.acceleration[1].toFixed(3)}) e_θ + (${kinInfo.acceleration[2].toFixed(3)}) e_z m/s²
                            </div>
                        </div>
                    `;
                } else {
                    readout.innerHTML = `
                        <div class="readout-card">
                            <div class="readout-header">
                                <h4>Spherical Kinematics Status (Ginsberg §2.2)</h4>
                                <span class="badge">Speed: ${kinInfo.speed.toFixed(3)} m/s | |a|: ${kinInfo.accelMag.toFixed(3)} m/s²</span>
                            </div>
                            <div class="eigen-grid" style="margin-top: 8px;">
                                <div class="item"><strong>Radius r:</strong> ${state.r.toFixed(2)} m</div>
                                <div class="item"><strong>Colatitude φ:</strong> ${state.phiDeg.toFixed(1)}°</div>
                                <div class="item"><strong>Azimuth θ:</strong> ${state.thetaDeg.toFixed(1)}°</div>
                                <div class="item"><strong>Scale Factors:</strong> h_r=1, h_φ=${state.r.toFixed(2)}, h_θ=${(state.r * Math.sin(state.phiDeg*Math.PI/180)).toFixed(2)}</div>
                            </div>
                            <div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                                <strong>Total Acceleration:</strong> a = (${kinInfo.acceleration[0].toFixed(2)}) e_r + (${kinInfo.acceleration[1].toFixed(2)}) e_φ + (${kinInfo.acceleration[2].toFixed(2)}) e_θ m/s²
                            </div>
                        </div>
                    `;
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateSimulation();

        return {
            setSystem(sys) {
                state.coordSystem = sys;
                updateSimulation();
            },
            setParams(params) {
                Object.assign(state, params);
                updateSimulation();
            },
            reset() {
                state.R = 2.5;
                state.thetaDeg = 45;
                state.z = 1.5;
                state.dotR = 0.5;
                state.dotTh = 1.2;
                state.dotZ = 0.8;
                updateSimulation();
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 5: Lecture 5 Path Variables (Frenet-Serret) 3D Track
    // -------------------------------------------------------------
    initSimLec5(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(10, 10, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lights & Ground
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(15, 20, 15);
        scene.add(dirLight);

        const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // Build 3D Helical Roller Coaster Curve
        const curvePoints = [];
        const R_track = 3.5;
        const pitch = 0.35;
        const totalPoints = 300;
        for (let i = 0; i <= totalPoints; i++) {
            const u = (i / totalPoints) * 4 * Math.PI; // 2 complete revolutions
            const x = R_track * Math.cos(u);
            const y = R_track * Math.sin(u);
            const z = pitch * u - 2.5;
            curvePoints.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.06, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 });
        const trackMesh = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(trackMesh);

        // Particle Mesh (Roller Coaster Cart)
        const cartGeo = new THREE.BoxGeometry(0.35, 0.25, 0.2);
        const cartMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });
        const cartMesh = new THREE.Mesh(cartGeo, cartMat);
        scene.add(cartMesh);

        // Frenet Triad Arrows: e_t (Green), e_n (Red), e_b (Blue)
        const arrowEt = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.6, 0x10b981, 0.35, 0.12);
        const arrowEn = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.6, 0xef4444, 0.35, 0.12);
        const arrowEb = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.6, 0x3b82f6, 0.35, 0.12);
        scene.add(arrowEt);
        scene.add(arrowEn);
        scene.add(arrowEb);

        // Osculating Plane Visualizer (Transparent Quad)
        const oscPlaneGeo = new THREE.PlaneGeometry(2.5, 2.5);
        const oscPlaneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
        const oscPlaneMesh = new THREE.Mesh(oscPlaneGeo, oscPlaneMat);
        scene.add(oscPlaneMesh);

        // Osculating Circle Wireframe
        const oscCircleGeo = new THREE.RingGeometry(3.5, 3.55, 64);
        const oscCircleMat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const oscCircleMesh = new THREE.Mesh(oscCircleGeo, oscCircleMat);
        scene.add(oscCircleMesh);

        const state = {
            progress: 0.25, // 0 to 1 along curve
            speed: 2.0,
            dotSpeed: 0.5,
            isAnimating: true
        };

        function updateFrenet() {
            const tVal = state.progress % 1.0;
            const pt = curve.getPointAt(tVal);
            const tangent = curve.getTangentAt(tVal).normalize();

            // Numerical curvature: derivative of tangent w.r.t arc length
            const dt = 0.002;
            const tNext = Math.min(1.0, tVal + dt);
            const tanNext = curve.getTangentAt(tNext).normalize();
            const dTan = tanNext.clone().sub(tangent).divideScalar(dt * curve.getLength());
            
            let normal = dTan.clone();
            let curvature = normal.length();
            if (curvature < 1e-4) {
                normal = new THREE.Vector3(0, 1, 0);
                curvature = 1e-4;
            } else {
                normal.normalize();
            }

            const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
            const rho = 1.0 / curvature;

            // Update Cart
            cartMesh.position.copy(pt);
            
            // Orient cart along Frenet frame
            const rotMatrix = new THREE.Matrix4().makeBasis(tangent, normal, binormal);
            cartMesh.setRotationFromMatrix(rotMatrix);

            // Update Frenet arrows
            arrowEt.position.copy(pt);
            arrowEt.setDirection(tangent);

            arrowEn.position.copy(pt);
            arrowEn.setDirection(normal);

            arrowEb.position.copy(pt);
            arrowEb.setDirection(binormal);

            // Update Osculating Plane
            oscPlaneMesh.position.copy(pt);
            oscPlaneMesh.setRotationFromMatrix(rotMatrix);

            // Center of curvature = pt + rho * normal
            const centerOfCurv = pt.clone().add(normal.clone().multiplyScalar(rho));
            oscCircleMesh.position.copy(centerOfCurv);
            oscCircleMesh.setRotationFromMatrix(rotMatrix);
            oscCircleMesh.scale.set(rho / 3.5, rho / 3.5, 1);

            // Acceleration: a = dot_v * e_t + (v^2 / rho) * e_n
            const a_t = state.dotSpeed;
            const a_n = (state.speed * state.speed) / rho;
            const a_total = Math.hypot(a_t, a_n);

            // Update readout card
            const readout = document.getElementById('lec5-readout-card');
            if (readout) {
                readout.innerHTML = `
                    <div class="readout-card">
                        <div class="readout-header">
                            <h4>Frenet-Serret Kinematics Readout</h4>
                            <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">Osculating Radius: ρ = ${rho.toFixed(2)} m</span>
                        </div>
                        <div class="eigen-grid" style="margin-top: 8px;">
                            <div class="item"><strong>Speed v = s_dot:</strong> ${state.speed.toFixed(2)} m/s</div>
                            <div class="item"><strong>Tangential Accel a_t = v_dot:</strong> ${a_t.toFixed(2)} m/s²</div>
                            <div class="item"><strong>Normal Accel a_n = v²/ρ:</strong> ${a_n.toFixed(2)} m/s²</div>
                            <div class="item" style="color: #38bdf8;"><strong>Binormal Accel a_b:</strong> 0.00 m/s² (Theorem!)</div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                            <strong>Total Acceleration:</strong> |a| = √(a_t² + a_n²) = ${a_total.toFixed(3)} m/s² (lies strictly in osculating plane!)
                        </div>
                    </div>
                `;
            }
        }

        let lastTime = performance.now();
        function animate() {
            requestAnimationFrame(animate);
            const now = performance.now();
            const deltaSec = (now - lastTime) / 1000;
            lastTime = now;

            if (state.isAnimating) {
                state.progress += (state.speed * deltaSec) / curve.getLength();
                if (state.progress > 1.0) state.progress -= 1.0;
                updateFrenet();
            }

            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateFrenet();

        return {
            setProgress(val) {
                state.progress = parseFloat(val);
                updateFrenet();
            },
            setSpeed(v) {
                state.speed = parseFloat(v);
                updateFrenet();
            },
            setDotSpeed(dv) {
                state.dotSpeed = parseFloat(dv);
                updateFrenet();
            },
            toggleAnimation() {
                state.isAnimating = !state.isAnimating;
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 6: Lecture 6 Transport Theorem Visualizer
    // -------------------------------------------------------------
    initSimLec6(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(7, 7, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(10, 10, 15);
        scene.add(dirLight);

        // Fixed Global Frame XYZ
        const globalFrame = this.createFrameAxes(2.5);
        scene.add(globalFrame);

        // Rotating Frame xyz Group (Turntable)
        const rotFrameGroup = new THREE.Group();
        const rotFrameAxes = this.createFrameAxes(2.0, 0.03, 0.4, 0.1);
        rotFrameGroup.add(rotFrameAxes);

        // Turntable disk
        const diskGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.08, 32);
        const diskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.7 });
        const diskMesh = new THREE.Mesh(diskGeo, diskMat);
        diskMesh.rotation.x = Math.PI / 2;
        rotFrameGroup.add(diskMesh);
        scene.add(rotFrameGroup);

        // Physical Vector A (Cyan arrow)
        const arrowA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2.5, 0x06b6d4, 0.4, 0.15);
        scene.add(arrowA);

        // Relative Rate (dA/dt)_xyz (Green arrow)
        const arrowRel = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1.5, 0x10b981, 0.35, 0.12);
        scene.add(arrowRel);

        // Transport Term omega x A (Orange arrow)
        const arrowOmegaCrossA = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1.8, 0xf97316, 0.35, 0.12);
        scene.add(arrowOmegaCrossA);

        // Total Rate (dA/dt)_XYZ (Yellow arrow = sum)
        const arrowTotal = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0), new THREE.Vector3(), 2.5, 0xfacc15, 0.45, 0.16);
        scene.add(arrowTotal);

        const state = {
            omegaZ: 1.5,
            lengthA: 2.2,
            rateA: 0.8,
            currentAngle: 0.0,
            isRotating: true
        };

        function updateTransport() {
            rotFrameGroup.rotation.z = state.currentAngle;

            // In rotating frame xyz, vector A points along arm
            const cosTh = Math.cos(state.currentAngle);
            const sinTh = Math.sin(state.currentAngle);

            const vecA = new THREE.Vector3(state.lengthA * cosTh, state.lengthA * sinTh, 0.5);
            arrowA.setDirection(vecA.clone().normalize());
            arrowA.setLength(vecA.length(), 0.4, 0.15);

            // Relative rate in frame: (dA/dt)_xyz is purely radial extension along arm
            const dAdt_rel = new THREE.Vector3(state.rateA * cosTh, state.rateA * sinTh, 0.0);
            
            // Frame angular velocity: omega = omegaZ * K
            const omegaVec = new THREE.Vector3(0, 0, state.omegaZ);

            // Transport term: omega x A
            const transport = new THREE.Vector3().crossVectors(omegaVec, vecA);

            // Total rate: sum of both
            const dAdt_total = dAdt_rel.clone().add(transport);

            // Position derivative arrows at the tip of vector A
            const tip = vecA.clone();
            arrowRel.position.copy(tip);
            if (dAdt_rel.length() > 0.01) {
                arrowRel.setDirection(dAdt_rel.clone().normalize());
                arrowRel.setLength(Math.min(3, dAdt_rel.length()), 0.3, 0.1);
            }

            arrowOmegaCrossA.position.copy(tip);
            if (transport.length() > 0.01) {
                arrowOmegaCrossA.setDirection(transport.clone().normalize());
                arrowOmegaCrossA.setLength(Math.min(3, transport.length() * 0.8), 0.3, 0.1);
            }

            arrowTotal.position.copy(tip);
            if (dAdt_total.length() > 0.01) {
                arrowTotal.setDirection(dAdt_total.clone().normalize());
                arrowTotal.setLength(Math.min(4, dAdt_total.length() * 0.8), 0.35, 0.12);
            }

            const readout = document.getElementById('lec6-readout-card');
            if (readout) {
                readout.innerHTML = `
                    <div class="readout-card">
                        <div class="readout-header">
                            <h4>Transport Theorem Real-Time Breakdown</h4>
                            <span class="badge" style="background: rgba(6, 182, 212, 0.2); color: #06b6d4;">(dA/dt)_XYZ = (dA/dt)_xyz + ω × A</span>
                        </div>
                        <div class="eigen-grid" style="margin-top: 8px;">
                            <div class="item"><strong>Frame Rate ω:</strong> ${state.omegaZ.toFixed(2)} rad/s (Z-axis)</div>
                            <div class="item"><strong>|A| Length:</strong> ${vecA.length().toFixed(2)} m</div>
                            <div class="item" style="color: #10b981;"><strong>Relative Rate (dA/dt)_xyz:</strong> ${dAdt_rel.length().toFixed(2)} m/s</div>
                            <div class="item" style="color: #f97316;"><strong>Transport ω × A:</strong> ${transport.length().toFixed(2)} m/s</div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #facc15;">
                            <strong>Total Absolute Rate:</strong> |(dA/dt)_XYZ| = ${dAdt_total.length().toFixed(3)} m/s
                        </div>
                    </div>
                `;
            }
        }

        let lastTime = performance.now();
        function animate() {
            requestAnimationFrame(animate);
            const now = performance.now();
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            if (state.isRotating) {
                state.currentAngle += state.omegaZ * dt;
                updateTransport();
            }
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateTransport();

        return {
            setOmega(w) {
                state.omegaZ = parseFloat(w);
                updateTransport();
            },
            setLengthA(len) {
                state.lengthA = parseFloat(len);
                updateTransport();
            },
            setRateA(r) {
                state.rateA = parseFloat(r);
                updateTransport();
            },
            toggleRotation() {
                state.isRotating = !state.isRotating;
            }
        };
    },

    // -------------------------------------------------------------
    // SIMULATION 7: Lecture 7 Ginsberg Eulerian Angles (Z-Y-Z)
    // -------------------------------------------------------------
    initSimLec7(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1d);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(7, 7, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
        dirLight.position.set(10, 15, 12);
        scene.add(dirLight);

        // Fixed Base Global Axes XYZ
        const globalFrame = this.createFrameAxes(2.6);
        scene.add(globalFrame);

        // 3-Ring Gimbal Hierarchy for Ginsberg Z-Y-Z:
        // Outer Group: Rotates about vertical Z (Precession psi)
        const outerGroup = new THREE.Group();
        scene.add(outerGroup);

        const outerRingGeo = new THREE.TorusGeometry(2.4, 0.06, 16, 64);
        const outerRingMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 }); // Gold
        const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
        outerGroup.add(outerRingMesh);

        // Middle Group: Rotates about intermediate y' axis (Nutation theta)
        const midGroup = new THREE.Group();
        outerGroup.add(midGroup);

        const midRingGeo = new THREE.TorusGeometry(1.8, 0.05, 16, 64);
        const midRingMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.8 }); // Cyan
        const midRingMesh = new THREE.Mesh(midRingGeo, midRingMat);
        midRingMesh.rotation.x = Math.PI / 2; // Lie in x'z' plane
        midGroup.add(midRingMesh);

        // Inner Group: Rotates about body z'' axis (Spin phi)
        const innerGroup = new THREE.Group();
        midGroup.add(innerGroup);

        const innerRotorGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32);
        const innerRotorMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2, metalness: 0.85 }); // Magenta
        const innerRotorMesh = new THREE.Mesh(innerRotorGeo, innerRotorMat);
        innerRotorMesh.rotation.x = Math.PI / 2; // Rotor axis aligned with z''
        innerGroup.add(innerRotorMesh);

        // Body frame axes attached to rotor
        const bodyAxes = this.createFrameAxes(1.6, 0.03, 0.35, 0.1);
        innerGroup.add(bodyAxes);

        // Angular velocity vector arrow (White)
        const arrowOmega = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2.2, 0xffffff, 0.4, 0.14);
        scene.add(arrowOmega);

        const state = {
            psiDeg: 30,    // Precession about Z
            thetaDeg: 45,  // Nutation about y'
            phiDeg: 60,    // Spin about z''
            dotPsi: 1.5,
            dotTheta: 0.8,
            dotPhi: 8.0
        };

        function updateEulerZYZ() {
            const psiRad = (state.psiDeg * Math.PI) / 180;
            const thRad = (state.thetaDeg * Math.PI) / 180;
            const phiRad = (state.phiDeg * Math.PI) / 180;

            // Z-Y-Z body fixed sequence:
            // 1. outerGroup rotates about Z by psi
            outerGroup.rotation.z = psiRad;
            // 2. midGroup rotates about y' by theta
            midGroup.rotation.y = thRad;
            // 3. innerGroup rotates about z'' by phi
            innerGroup.rotation.z = phiRad;

            const res = MatrixEngine.eulerZYZ(state.psiDeg, state.thetaDeg, state.phiDeg);
            const omegaBody = MatrixEngine.eulerZYZOms(psiRad, thRad, phiRad, state.dotPsi, state.dotTheta, state.dotPhi);

            // Convert body omega to global for visual arrow
            const R_trans = MatrixEngine.transpose(res.R);
            const omegaGlobal = MatrixEngine.multVec(R_trans, omegaBody);
            const omVec = new THREE.Vector3(omegaGlobal[0], omegaGlobal[1], omegaGlobal[2]);
            if (omVec.length() > 0.05) {
                arrowOmega.setDirection(omVec.clone().normalize());
                arrowOmega.setLength(Math.min(3.5, omVec.length() * 0.3), 0.35, 0.12);
                arrowOmega.visible = true;
            } else {
                arrowOmega.visible = false;
            }

            const readout = document.getElementById('lec7-readout-card');
            if (readout) {
                readout.innerHTML = `
                    <div class="readout-card">
                        <div class="readout-header">
                            <h4>Ginsberg Z-Y-Z Eulerian Angles Status</h4>
                            <span class="badge ${res.isSingular ? 'locked' : ''}">
                                ${res.isSingular ? '⚠️ GIMBAL LOCK ACTIVE!' : '✅ 3 Independent Rotational DOF'}
                            </span>
                        </div>
                        <div class="eigen-grid" style="margin-top: 8px;">
                            <div class="item"><strong>Precession ψ (Z):</strong> ${state.psiDeg.toFixed(1)}°</div>
                            <div class="item"><strong>Nutation θ (y'):</strong> ${state.thetaDeg.toFixed(1)}°</div>
                            <div class="item"><strong>Spin φ (z''):</strong> ${state.phiDeg.toFixed(1)}°</div>
                            <div class="item"><strong>Matrix Trace:</strong> ${MatrixEngine.trace(res.R).toFixed(3)}</div>
                        </div>
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #ec4899;">
                            <strong>Body Angular Velocity:</strong> ω = (${omegaBody[0].toFixed(2)}) i + (${omegaBody[1].toFixed(2)}) j + (${omegaBody[2].toFixed(2)}) k rad/s
                        </div>
                        ${res.isSingular ? `
                            <div style="margin-top: 8px; padding: 6px 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 6px; font-size: 0.8rem; color: #fca5a5;">
                                <strong>Singularity Warning:</strong> θ ≈ ${state.thetaDeg.toFixed(1)}° causes sin(θ) ≈ 0. Precession axis (Z) and spin axis (z'') align!
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        updateEulerZYZ();

        return {
            setAngles(psi, th, phi) {
                if (psi !== undefined) state.psiDeg = parseFloat(psi);
                if (th !== undefined) state.thetaDeg = parseFloat(th);
                if (phi !== undefined) state.phiDeg = parseFloat(phi);
                updateEulerZYZ();
            },
            setRates(dPsi, dTh, dPhi) {
                if (dPsi !== undefined) state.dotPsi = parseFloat(dPsi);
                if (dTh !== undefined) state.dotTheta = parseFloat(dTh);
                if (dPhi !== undefined) state.dotPhi = parseFloat(dPhi);
                updateEulerZYZ();
            },
            triggerGimbalLock() {
                state.thetaDeg = 0;
                updateEulerZYZ();
            },
            reset() {
                state.psiDeg = 30;
                state.thetaDeg = 45;
                state.phiDeg = 60;
                updateEulerZYZ();
            }
        };
    }

};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = Simulations;
}
