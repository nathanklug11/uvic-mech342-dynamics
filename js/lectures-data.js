/**
 * UVic MECH 342 - Advanced Dynamics II
 * Comprehensive Lecture Data & Pedagogical Scaffolding
 * Based on Dr. Brad Buckham's Lectures & Jerry Ginsberg's "Engineering Dynamics"
 */

const MECH342_CURRICULUM = {
    courseInfo: {
        code: "MECH 342",
        title: "Dynamics II (Rigid Body Kinematics & Kinetics)",
        institution: "University of Victoria (UVic)",
        department: "Department of Mechanical Engineering",
        term: "Fall 2026",
        textbook: "Engineering Dynamics, Jerry Ginsberg (Cambridge University Press)",
        description: "Advanced study of three-dimensional kinematics and kinetics of particles and rigid bodies, reference frame transformations, Euler angles, inertia tensors, equations of motion, and numerical solutions."
    },

    learningOutcomes: [
        "Use multiple reference frames in the description of a rigid body's 3D motion, and calculate rotation matrices for converting vector expressions between these reference frames.",
        "Construct Cartesian vector expressions for the angular velocity and acceleration of a rigid body.",
        "Apply equations of relative motion to solve for motion variables for a simple spatial mechanism.",
        "Evaluate the energy and momentum of a rigid body moving in 3D space.",
        "Form the equations of motion for a rigid body subject to kinematic constraints.",
        "Transform inertia properties between different choices of reference frame and reference point.",
        "Solve equations of motion to assess transient motion, equilibrium conditions and stability."
    ],

    lectures: [
        {
            id: "lec0",
            number: 0,
            title: "Course Roadmap & Spatial Kinematics Review",
            subtitle: "Graphic Syllabus, Vector Operations, & Moving Frames",
            ginsbergRef: "Section 1.1 (Eqs. 1.1.1 - 1.1.52)",
            summary: "Establishes the roadmap for 3D dynamics, contrasts 2D vs 3D mechanics, and tackles a multi-frame spatial kinematics problem with rotating axes and trajectory constraints.",
            pedagogicalFocus: "Cognitive bridging from 2D mechanics (ENGR 141) to 3D spatial dynamics. Treating unit vectors as dynamic physical entities.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🗺️ The MECH 342 Roadmap</h3>
                            <p>Dynamics II is organized into three interconnected pillars:</p>
                            <div class="roadmap-grid">
                                <div class="roadmap-box kinematics">
                                    <h4>1. Rigid Body Kinematics</h4>
                                    <ul>
                                        <li><strong>Coordinate Systems:</strong> Absolute vs Inertial vs Tumbling frames</li>
                                        <li><strong>Rotation Matrices:</strong> Converting Cartesian coordinates between frames</li>
                                        <li><strong>Angular Velocity:</strong> Euler's theorem, time rates of change of rotating basis vectors</li>
                                    </ul>
                                </div>
                                <div class="roadmap-box kinetics">
                                    <h4>2. Rigid Body Kinetics</h4>
                                    <ul>
                                        <li><strong>Governing Equations:</strong> Extended Newton's 2nd Law & Conservation of Angular Momentum</li>
                                        <li><strong>Inertia Tensor:</strong> 3D mass distribution, invariant vs time-varying inertia, principal axes</li>
                                        <li><strong>Reference Points:</strong> The critical impact of reference point selection on torque and angular momentum</li>
                                    </ul>
                                </div>
                                <div class="roadmap-box solution">
                                    <h4>3. Solution Methods</h4>
                                    <ul>
                                        <li><strong>Initial Value Problems:</strong> Numerical integration using Runge-Kutta & MATLAB <code>ode45</code></li>
                                        <li><strong>Linearization:</strong> Quasi-static equilibrium & multi-variable Taylor expansions</li>
                                        <li><strong>Stability:</strong> Eigenvalue problems for vibrational modes and dynamical stability</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">💡</div>
                                <div class="alert-body">
                                    <strong>The Fundamental Mindset Shift:</strong>
                                    In introductory statics and 2D dynamics, unit vectors ($\\vec{i}, \\vec{j}, \\vec{k}$) were treated merely as "accounting tags" to keep $x, y, z$ components separate. 
                                    <strong>In 3D dynamics, unit vectors are physical objects that tumble and rotate in space!</strong> Their time rates of change ($\\dot{\\vec{i}}, \\dot{\\vec{j}}, \\dot{\\vec{k}}$) introduce gyroscopic, Coriolis, and centrifugal kinematic terms.
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>📐 Detailed Problem Walkthrough: Lecture #0 Kinematics Challenge</h3>
                            <p>Let us rigorously dissect the example problem presented on Slide 3 of Lecture 0:</p>

                            <div class="problem-statement">
                                <strong>Problem Setup:</strong>
                                <ul>
                                    <li>Stationary reference frame $XYZ$ with origin at $O$ and fixed basis vectors $\\vec{I}, \\vec{J}, \\vec{K}$.</li>
                                    <li>Point $P$ moves with position at $t=0$: $\\vec{r}_P(0) = 3\\vec{I} + 5\\vec{J} + 2\\vec{K} \\text{ m}$.</li>
                                    <li>Velocity of point $P$ is constant: $\\vec{v}_P = \\frac{d\\vec{r}_P}{dt} = -1\\vec{I} - 1\\vec{J} + 0\\vec{K} \\text{ m/s}$.</li>
                                    <li>A moving frame $xyz$ is attached to point $P$ with basis $\\vec{i}, \\vec{j}, \\vec{k}$.</li>
                                    <li>Frame $xyz$ rotates about the vertical $Z$-axis (so $\\vec{k} = \\vec{K}$) by angle $\\psi(t) = 0.52 + 0.2t \\text{ rad}$.</li>
                                    <li>Point $Q$ traverses a parabolic slot defined in frame $xyz$: $y = x^2$, where $x(t) = 3 - 1.2t \\text{ m}$.</li>
                                </ul>
                                <strong>Questions:</strong>
                                <ol type="a">
                                    <li>Provide a vector function of time for the path (position) of point $Q$.</li>
                                    <li>What is the absolute velocity of point $Q$ at $t = 0\\text{ s}$?</li>
                                </ol>
                            </div>

                            <h4>Part (a): Vector Function for Position of Point $Q$</h4>
                            <p>By relative displacement addition (vector chain):</p>
                            $$\\vec{r}_{Q/O}(t) = \\vec{r}_{P/O}(t) + \\vec{r}_{Q/P}(t)$$
                            <p>Integrating the velocity of $P$:</p>
                            $$\\vec{r}_P(t) = \\vec{r}_P(0) + \\vec{v}_P \\cdot t = (3 - t)\\vec{I} + (5 - t)\\vec{J} + 2\\vec{K} \\text{ m}$$
                            <p>The relative displacement of $Q$ with respect to $P$, expressed <em>in terms of</em> frame $xyz$:</p>
                            $$\\vec{r}_{Q/P}(t) = x(t)\\vec{i} + y(t)\\vec{j} = (3 - 1.2t)\\vec{i} + (3 - 1.2t)^2\\vec{j}$$
                            <p>To write this in terms of the global frame $XYZ$, we use the rotating basis transformation:</p>
                            $$\\begin{cases}
                                \\vec{i}(t) = \\cos\\psi(t)\\vec{I} + \\sin\\psi(t)\\vec{J} \\\\
                                \\vec{j}(t) = -\\sin\\psi(t)\\vec{I} + \\cos\\psi(t)\\vec{J} \\\\
                                \\vec{k} = \\vec{K}
                            \\end{cases}$$
                            <p>Substituting into $\\vec{r}_Q(t)$ gives the complete spatial vector function.</p>

                            <h4>Part (b): Velocity of Point $Q$ at $t = 0\\text{ s}$</h4>
                            <p>Taking the time derivative of $\\vec{r}_Q$ using the transport relation or chain rule:</p>
                            $$\\vec{v}_Q = \\vec{v}_P + \\frac{d}{dt}\\vec{r}_{Q/P}$$
                            <p>Since $\\vec{r}_{Q/P} = x\\vec{i} + y\\vec{j}$, product rule yields:</p>
                            $$\\frac{d}{dt}\\vec{r}_{Q/P} = (\\dot{x}\\vec{i} + \\dot{y}\\vec{j}) + (x\\dot{\\vec{i}} + y\\dot{\\vec{j}})$$
                            <p>where the first term is relative velocity seen within frame $xyz$, and the second is due to frame rotation:</p>
                            $$\\dot{\\vec{i}} = \\dot{\\psi}\\vec{k} \\times \\vec{i} = \\dot{\\psi}\\vec{j}, \\quad \\dot{\\vec{j}} = \\dot{\\psi}\\vec{k} \\times \\vec{j} = -\\dot{\\psi}\\vec{i}$$
                            <p>Evaluating at $t = 0$:</p>
                            <ul>
                                <li>$x(0) = 3\\text{ m}$, $\\dot{x}(0) = -1.2\\text{ m/s}$</li>
                                <li>$y(0) = 3^2 = 9\\text{ m}$, $\\dot{y}(0) = 2x\\dot{x} = 2(3)(-1.2) = -7.2\\text{ m/s}$</li>
                                <li>$\\psi(0) = 0.52\\text{ rad} \\approx 29.79^\\circ$, $\\dot{\\psi} = 0.2\\text{ rad/s}$</li>
                                <li>Frame rotation contribution: $x\\dot{\\vec{i}} + y\\dot{\\vec{j}} = 3(0.2\\vec{j}) + 9(-0.2\\vec{i}) = -1.8\\vec{i} + 0.6\\vec{j}$</li>
                                <li>Total relative velocity in $xyz$: $(\\dot{x} - 1.8)\\vec{i} + (\\dot{y} + 0.6)\\vec{j} = (-1.2 - 1.8)\\vec{i} + (-7.2 + 0.6)\\vec{j} = -3.0\\vec{i} - 6.6\\vec{j} \\text{ m/s}$</li>
                            </ul>
                            <p>Transforming $-3.0\\vec{i} - 6.6\\vec{j}$ to $XYZ$ via $[R_z(\\psi)]^T$ and adding $\\vec{v}_P = -1\\vec{I} - 1\\vec{J}$ gives the final absolute velocity!</p>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive 3D Simulation",
                    simulationId: "sim-lec0"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Critical Misconceptions in Spatial Kinematics</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Forgetting that unit vectors have non-zero time derivatives!</strong>
                                <p>Students often write $\\frac{d}{dt}(x\\vec{i}) = \\dot{x}\\vec{i}$, completely dropping $x\\dot{\\vec{i}}$. If the reference frame is tumbling or rotating with angular velocity $\\vec{\\omega}$, then $\\dot{\\vec{i}} = \\vec{\\omega} \\times \\vec{i} \\neq 0$. Dropping this term omits the rotational velocity!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Confusing the path constraint with the motion parameter.</strong>
                                <p>In this problem, $y = x^2$ is a geometric path constraint, but $x(t) = 3 - 1.2t$ prescribes how point $Q$ moves along that path. Therefore, by the chain rule, $\\dot{y} = \\frac{dy}{dx} \\frac{dx}{dt} = 2x\\dot{x}$.</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec1",
            number: 1,
            title: "Reference Frames, Derivatives, & Units",
            subtitle: "Absolute vs Moving Frames, Multi-body Chains, Energy/Momentum, & The Slugs/Blobs/Glugs",
            ginsbergRef: "Chapter 1 (Sections 1.2, 1.3, 1.4)",
            summary: "Clarifies the precise language of kinetics ('in terms of' vs 'with respects to'), explores derivative unifications across multi-body chains, reviews work-energy and impulse-momentum for particles, and untangles historical mass unit conventions.",
            pedagogicalFocus: "Language precision, spotting basis-mixing errors, and demystifying why mass is a constant of proportionality.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🔍 Language Matters in Kinetics: Two Non-Negotiable Phrases</h3>
                            <div class="language-comparison">
                                <div class="lang-box wrt">
                                    <h4>"...with respects to..." (w.r.t.)</h4>
                                    <p>Refers to <strong>relative physical displacement between two physical points</strong> in the real world.</p>
                                    <p>Example: $\\vec{r}_{P/Q}$ is the position vector of point $P$ <em>with respects to</em> point $Q$.</p>
                                    <p class="highlight">This is a physical vector that exists regardless of any coordinate system you choose to draw on the page!</p>
                                </div>
                                <div class="lang-box ito">
                                    <h4>"...in terms of..." (i.t.o.)</h4>
                                    <p>Refers to <strong>which set of coordinate basis vectors</strong> you use to express that vector mathematically as scalar numbers.</p>
                                    <p>Example: Expressing $\\vec{r}_{P/Q}$ <em>in terms of</em> frame $xyz$ means writing $[r^x_{P/Q}, r^y_{P/Q}, r^z_{P/Q}]^T$.</p>
                                    <p class="highlight">Changing the reference frame changes the numerical components, but the physical arrow in space remains identical!</p>
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚖️ Absolute vs Inertial vs Moving Frames</h3>
                            <table class="concept-table">
                                <thead>
                                    <tr>
                                        <th>Frame Type</th>
                                        <th>Origin Motion</th>
                                        <th>Axis Orientation</th>
                                        <th>Newton's 2nd Law Valid?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Absolute Frame</strong> ($XYZ$)</td>
                                        <td>$\\vec{v}_O = \\vec{0}, \\vec{a}_O = \\vec{0}$ (Stationary)</td>
                                        <td>Unit vectors fixed in space</td>
                                        <td>Yes (Fundamental standard)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Inertial Frame</strong> ($x_I y_I z_I$)</td>
                                        <td>$\\vec{v}_O = \\text{const}, \\vec{a}_O = \\vec{0}$</td>
                                        <td>Unit vectors non-rotating</td>
                                        <td>Yes (Galilean invariance)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Moving/Tumbling Frame</strong> ($xyz$)</td>
                                        <td>$\\vec{a}_O \\neq \\vec{0}$</td>
                                        <td>Unit vectors rotate/tumble ($\\dot{\\vec{e}} \\neq 0$)</td>
                                        <td>Requires fictitious/inertial forces</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>🔗 'Building' Position Vectors Across Kinematic Chains</h3>
                            <p>Consider the multi-body system from Lecture 1 Slide 4 (Stationary base $O$, Tumbling Body 1, Tumbling Body 2, Point $M$):</p>
                            $$\\vec{r}_M = \\vec{r}_P + \\vec{r}_{D1/P} + \\vec{r}_{D2/D1} + \\vec{r}_{M/D2}$$
                            <p>Each relative displacement is known naturally in its own local coordinate system:</p>
                            <ul>
                                <li>$\\vec{r}_P$ in terms of Global Frame $XYZ$: $\\{r_P^X \\vec{I} + r_P^Y \\vec{J} + r_P^Z \\vec{K}\\}$</li>
                                <li>$\\vec{r}_{D1/P}$ in terms of Body 1 frame $xyz$: $\\{r_{D1/P}^x \\vec{i} + r_{D1/P}^y \\vec{j} + r_{D1/P}^z \\vec{k}\\}$</li>
                                <li>$\\vec{r}_{D2/D1}$ in terms of Joint frame $x''y''z''$: $\\{r_{D2/D1}^{x''} \\vec{i}'' + r_{D2/D1}^{y''} \\vec{j}'' + r_{D2/D1}^{z''} \\vec{k}''\\}$</li>
                                <li>$\\vec{r}_{M/D2}$ in terms of Body 2 frame $x'y'z'$: $\\{r_{M/D2}^{x'} \\vec{i}' + r_{M/D2}^{y'} \\vec{j}' + r_{M/D2}^{z'} \\vec{k}'\\}$</li>
                            </ul>

                            <div class="pedagogy-alert challenge">
                                <div class="alert-icon">🕵️</div>
                                <div class="alert-body">
                                    <strong>Dr. Buckham's Spot-the-Error Challenge (Lecture 1 Slide 4):</strong>
                                    <em>"In the expression for $r_M$, there is an error somewhere - can you find it?"</em><br>
                                    Look at the slide notation: on line 3, the displacement between $D2$ and $D1$ was written with mixed basis labels, and $r_{D1/P}$ had a typo using $r_{P/Q}^z$ basis in one term!
                                    <strong>The Lesson:</strong> You cannot add scalar components ($r_1^x + r_2^{x'}$) unless you first transform all basis vectors into one <em>unified reference frame</em> using <strong>Rotation Matrices</strong>!
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚡ Repackaging Newton's 2nd Law for Particles</h3>
                            <p>All particle principles in kinetics are simply different mathematical integrals of $\\sum \\vec{F}_P = m \\vec{a}_P$:</p>

                            <h4>1. Work-Energy Principle (Spatial Path Integral)</h4>
                            $$\\sum \\vec{F}_P \\cdot d\\vec{r}_P = m \\vec{a}_P \\cdot d\\vec{r}_P = m \\frac{d\\vec{v}_P}{dt} \\cdot \\vec{v}_P dt = m (\\vec{v}_P \\cdot d\\vec{v}_P) = \\frac{1}{2}m d(\\vec{v}_P \\cdot \\vec{v}_P)$$
                            $$\\int_{1}^{2} \\sum \\vec{F}_P \\cdot d\\vec{r}_P = \\frac{1}{2}m (v_2^2 - v_1^2) = T_2 - T_1$$

                            <h4>2. Linear Impulse-Momentum Principle (Time Integral)</h4>
                            $$\\int_{t_1}^{t_2} \\sum \\vec{F}_P dt = \\int_{t_1}^{t_2} m \\frac{d\\vec{v}_P}{dt} dt = m(\\vec{v}_{P2} - \\vec{v}_{P1})$$

                            <h4>3. Angular Impulse-Momentum Principle (Moment & Time Integral)</h4>
                            <p>Take the cross product of position $\\vec{r}_P$ with $\\sum \\vec{F}_P$ about reference point $O$:</p>
                            $$\\vec{M}_O = \\vec{r}_P \\times \\sum \\vec{F}_P = \\vec{r}_P \\times (m \\vec{a}_P)$$
                            <p>Note that:</p>
                            $$\\frac{d}{dt}(\\vec{r}_P \\times m\\vec{v}_P) = \\underbrace{\\dot{\\vec{r}}_P \\times m\\vec{v}_P}_{\\vec{v}_P \\times m\\vec{v}_P = \\vec{0}} + \\vec{r}_P \\times m\\frac{d\\vec{v}_P}{dt} = \\vec{r}_P \\times m\\vec{a}_P$$
                            $$\\therefore \\vec{M}_O = \\frac{d}{dt}\\vec{H}_O = \\dot{\\vec{H}}_O, \\quad \\text{where } \\vec{H}_O \\equiv \\vec{r}_P \\times m\\vec{v}_P$$
                            <p>Integrating over time:</p>
                            $$\\int_{t_1}^{t_2} \\vec{M}_O dt = \\vec{H}_{O2} - \\vec{H}_{O1}$$

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🪐 Systems of Units: Slugs, Blobs, Glugs, and Newtons</h3>
                            <p>Why is there so much confusion about mass? Because <strong>mass is the only one of the 4 mechanical quantities that humans cannot perceive directly with our senses!</strong></p>
                            <ul>
                                <li><strong>Length ($L$):</strong> We see it (sight)</li>
                                <li><strong>Time ($T$):</strong> We hear/feel the beat (sound/rhythm)</li>
                                <li><strong>Force ($F$):</strong> We feel weight pushing against our hands (touch)</li>
                                <li><strong>Mass ($M$):</strong> Invisible! It is only detected as the <em>constant of proportionality</em> between applied force and acceleration ($F/a$).</li>
                            </ul>

                            <div class="unit-table-wrapper">
                                <table class="concept-table">
                                    <thead>
                                        <tr>
                                            <th>System</th>
                                            <th>Type</th>
                                            <th>Base Units</th>
                                            <th>Derived Unit of Mass or Force</th>
                                            <th>Proportionality $g$</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>SI</strong></td>
                                            <td>Absolute</td>
                                            <td>$m$ (meter), $s$ (second), <strong>$kg$ (mass)</strong></td>
                                            <td>Force: $\\text{Newton } (\\text{N}) = \\text{kg}\\cdot\\text{m/s}^2$</td>
                                            <td>$g = 9.807 \\text{ m/s}^2$</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Imperial (Foot)</strong></td>
                                            <td>Gravitational</td>
                                            <td>$ft$ (foot), $s$ (second), <strong>$\\text{lbf}$ (force)</strong></td>
                                            <td>Mass: $\\text{Slug} = \\text{lbf}\\cdot\\text{s}^2/\\text{ft} \\approx 32.174 \\text{ lbm}$</td>
                                            <td>$g = 32.174 \\text{ ft/s}^2$</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Imperial (Inch)</strong></td>
                                            <td>Gravitational</td>
                                            <td>$in$ (inch), $s$ (second), <strong>$\\text{lbf}$ (force)</strong></td>
                                            <td>Mass: $\\text{Slugette}$ or <strong>\"Blob\"</strong> $= \\text{lbf}\\cdot\\text{s}^2/\\text{in} = 12 \\text{ slugs}$</td>
                                            <td>$g = 386.088 \\text{ in/s}^2$</td>
                                        </tr>
                                        <tr>
                                            <td><strong>CGS (Obsolete)</strong></td>
                                            <td>Gravitational</td>
                                            <td>$cm$ (centimeter), $s$ (second), <strong>$g_f$ (gram-force)</strong></td>
                                            <td>Mass: <strong>\"Glug\"</strong> $= g_f\\cdot\\text{s}^2/\\text{cm} = 980.665 \\text{ g}$</td>
                                            <td>$g = 980.665 \\text{ cm/s}^2$</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive Kinematic Chain & Unit Lab",
                    simulationId: "sim-lec1"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Traps to Avoid in Problem Sets & Exams</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Mixing basis vectors in scalar equations!</strong>
                                <p>Writing $v_x = v_1^X + v_2^{x'}$ without transforming $v_1^X$ into the $xyz$ frame is a fatal error that invalidates all subsequent steps.</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Using pounds-mass ($lbm$) in $F=ma$ without $g_c$!</strong>
                                <p>If given an object with weight $W = 100\\text{ lbf}$, its mass in the standard foot-slug-second system is $m = \\frac{100}{32.174} = 3.108\\text{ slugs}$. If working in inches, its mass is $m = \\frac{100}{386.09} = 0.259\\text{ blobs}$! Never use $100$ directly as $m$ when applying $F=ma$.</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 3: Angular momentum reference point mismatch.</strong>
                                <p>The moment equation $\\vec{M}_O = \\dot{\\vec{H}}_O$ is ONLY valid if moments and angular momentum are computed about the <em>exact same point $O$</em>, and point $O$ must be either stationary or the center of mass!</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec2",
            number: 2,
            title: "Rotation Matrices & Canonical Transformations",
            subtitle: "Direction Cosines, Orthonormality, 3 DOF, and Body-Fixed Pre-multiplication",
            ginsbergRef: "Section 3.1.1, Section 3.1.2, Section 3.1.3",
            summary: "Introduces the rotation matrix as a coordinate transformation tool, derives its geometric direction-cosine structure, proves orthonormality and 3 degrees of freedom, and establishes the pre-multiplication rule for body-fixed sequences.",
            pedagogicalFocus: "Understanding the columns and rows of R as projected unit vectors, and mastering body-fixed pre-multiplication.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🔄 The Language Translation Metaphor</h3>
                            <p>Think of a Rotation Matrix $[R]$ as a <strong>bilingual dictionary</strong> between two observers:</p>
                            <p class="highlight" style="font-size: 1.1rem; text-align: center;">
                                $[\\text{Components in Destination Frame}] = [R] \\times [\\text{Components in Source Frame}]$
                            </p>
                            <p>The vector itself (an arrow in space) does not change. What changes is the <em>language</em> (basis coordinates) used to describe it.</p>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>👑 The Golden Rule of Rotation Matrices</h3>
                            <div class="rules-card-grid">
                                <div class="rule-box col-rule">
                                    <h4>Columns of $[R]$</h4>
                                    <p>The <strong>columns</strong> of $[R]$ are the basis vectors of the <em>frame you are IN</em> (source), expressed in terms of the <em>frame you are GOING TO</em> (destination):</p>
                                    $$[R] = \\begin{bmatrix} | & | & | \\\\ [\\vec{e}_1]_{dest} & [\\vec{e}_2]_{dest} & [\\vec{e}_3]_{dest} \\\\ | & | & | \\end{bmatrix}$$
                                </div>
                                <div class="rule-box row-rule">
                                    <h4>Rows of $[R]$</h4>
                                    <p>The <strong>rows</strong> of $[R]$ are the basis vectors of the <em>destination frame</em> expressed in terms of the <em>source frame</em>:</p>
                                    $$[R] = \\begin{bmatrix} - & [\\vec{e}'_1]_{src}^T & - \\\\ - & [\\vec{e}'_2]_{src}^T & - \\\\ - & [\\vec{e}'_3]_{src}^T & - \\end{bmatrix}$$
                                </div>
                            </div>

                            <p style="margin-top: 15px;">Every single entry $R_{ij}$ is the <strong>direction cosine</strong> between the $i$-th axis of the new frame and the $j$-th axis of the old frame:</p>
                            $$R_{ij} = \\vec{e}'_i \\cdot \\vec{e}_j = \\cos(\\angle(\\vec{e}'_i, \\vec{e}_j))$$
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>📐 Properties of Rotation Matrices</h3>
                            <h4>1. Orthonormality & Inverses</h4>
                            <p>Because the basis vectors are mutually perpendicular unit vectors:</p>
                            $$\\vec{e}'_i \\cdot \\vec{e}'_j = \\delta_{ij} = \\begin{cases} 1 & \\text{if } i = j \\\\ 0 & \\text{if } i \\neq j \\end{cases}$$
                            <p>This implies:</p>
                            $$[R]^T [R] = [I] \\implies [R]^{-1} = [R]^T$$
                            <p>To invert a coordinate transformation, you simply <strong>transpose</strong> the matrix!</p>

                            <h4>2. Determinant</h4>
                            $$\\det(R) = +1 \\quad (\\text{for all right-handed coordinate systems})$$
                            <p>If $\\det(R) = -1$, the transformation includes a reflection (turning right-handed frames into left-handed frames).</p>

                            <h4>3. Degrees of Freedom: Why Only 3 Numbers are Free!</h4>
                            <p>A $3\\times 3$ matrix has 9 scalar numbers. But they are constrained by 6 equations:</p>
                            <ul>
                                <li>3 unit length constraints: $\\vec{c}_1 \\cdot \\vec{c}_1 = 1, \\quad \\vec{c}_2 \\cdot \\vec{c}_2 = 1, \\quad \\vec{c}_3 \\cdot \\vec{c}_3 = 1$</li>
                                <li>3 mutual orthogonality constraints: $\\vec{c}_1 \\cdot \\vec{c}_2 = 0, \\quad \\vec{c}_2 \\cdot \\vec{c}_3 = 0, \\quad \\vec{c}_3 \\cdot \\vec{c}_1 = 0$</li>
                            </ul>
                            $$9 \\text{ unknowns} - 6 \\text{ constraints} = \\mathbf{3 \\text{ Degrees of Freedom}}$$
                            <p class="highlight">Any 3D spatial orientation is completely determined by exactly 3 independent parameters (e.g. 3 Euler angles)!</p>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🧩 The 3 Canonical (Simple) Rotation Matrices</h3>
                            <p>In Ginsberg / UVic convention, $[x'] = [R][x]$ transforms coordinates from unprimed to primed:</p>

                            <div class="canonical-grid">
                                <div class="canonical-box">
                                    <h5>Rotation about $x$-axis by $\\theta_x$:</h5>
                                    $$R_x(\\theta_x) = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\theta_x & \\sin\\theta_x \\\\ 0 & -\\sin\\theta_x & \\cos\\theta_x \\end{bmatrix}$$
                                </div>
                                <div class="canonical-box">
                                    <h5>Rotation about $y$-axis by $\\theta_y$:</h5>
                                    $$R_y(\\theta_y) = \\begin{bmatrix} \\cos\\theta_y & 0 & -\\sin\\theta_y \\\\ 0 & 1 & 0 \\\\ \\sin\\theta_y & 0 & \\cos\\theta_y \\end{bmatrix}$$
                                </div>
                                <div class="canonical-box">
                                    <h5>Rotation about $z$-axis by $\\theta_z$:</h5>
                                    $$R_z(\\theta_z) = \\begin{bmatrix} \\cos\\theta_z & \\sin\\theta_z & 0 \\\\ -\\sin\\theta_z & \\cos\\theta_z & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$$
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🔄 Body-Fixed Rotation Sequences: The PRE-Multiplication Rule</h3>
                            <p>When rotations occur successively about the <strong>moving (body-fixed) axes</strong>:</p>
                            <ol>
                                <li>Rotate original frame $XYZ$ about its $x$-axis $\\implies [x_1] = [R_1] [X]$</li>
                                <li>Rotate intermediate frame $x_1 y_1 z_1$ about its own new $y_1$-axis $\\implies [x_2] = [R_2] [x_1] = [R_2] [R_1] [X]$</li>
                                <li>Rotate $x_2 y_2 z_2$ about its own new $z_2$-axis $\\implies [x_3] = [R_3] [x_2] = [R_3] [R_2] [R_1] [X]$</li>
                            </ol>
                            <p class="highlight" style="font-size: 1.15rem; text-align: center;">
                                $$[R_{\\text{total}}] = [R_N] [R_{N-1}] \\cdots [R_2] [R_1] \\quad \\text{(PRE-MULTIPLY from left to right!)}$$
                            </p>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive Canonical Rotations & Matrix Puzzle",
                    simulationId: "sim-lec2"
                },
                {
                    id: "hydraulic",
                    title: "3D Lab: Hydraulic Cylinder (Slide 20)",
                    simulationId: "sim-hydraulic"
                },
                {
                    id: "block",
                    title: "3D Lab: Rotated Prism (Slide 21)",
                    simulationId: "sim-block"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Traps & Inspection Tests</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Transposed Signs in $R_y$ vs $R_x, R_z$!</strong>
                                <p>Notice that in $R_x$ and $R_z$, the $-\\sin\\theta$ term appears in the row below the diagonal. In $R_y$, because of cyclic right-handed permutation ($z \\times x = y$), the negative sign appears in the top-right entry: $R_{13} = -\\sin\\theta_y$. Getting this sign flipped is the #1 algebraic error on UVic MECH 342 exams!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Reversing the multiplication order in body-fixed sequences!</strong>
                                <p>Because step 2 is applied to the frame resulting from step 1, the new rotation matrix must multiply the vector from the <em>left</em>. Therefore, the second rotation matrix is placed in front of the first: $R_2 R_1$, NOT $R_1 R_2$.</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 3: Calculating Displacement in Mechanisms without unifying to a common frame!</strong>
                                <p>In the hydraulic cylinder problem (Slide 20), point $C$ undergoes both rotation of arm $AB$ and rotation/extension of cylinder $BC$. You must compute both $\\vec{r}_{C1}$ and $\\vec{r}_{C2}$ <em>in terms of the global $XYZ$ frame</em> before subtracting them to get the displacement $\\Delta\\vec{r}_C = \\vec{r}_{C2} - \\vec{r}_{C1}$!</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec3",
            number: 3,
            title: "Space-Fixed, Mixed Rotations, & Equivalent Axis",
            subtitle: "Non-Commutativity, Reversal Theorem, Physical Linkages, & Euler's Eigen-Axis Proof",
            ginsbergRef: "Section 3.1.3",
            summary: "Investigates non-commutativity of finite 3D rotations, establishes the post-multiplication rule for space-fixed rotations, analyzes kinematic joint topology in mechanisms, and proves Euler's Equivalent Axis Theorem using similarity transforms and eigenvalues.",
            pedagogicalFocus: "Non-commutativity visualization, joint constraint ordering, and uncovering the invariant eigenvector of any spatial rotation.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🚫 Non-Commutativity of Finite Rotations</h3>
                            <p>In 2D, rotations simply add: $\\theta_1 + \\theta_2 = \\theta_2 + \\theta_1$.</p>
                            <p><strong>In 3D, finite rotations DO NOT COMMUTE!</strong></p>
                            $$R_A R_B \\neq R_B R_A$$
                            <p>Try rotating a book $90^\\circ$ about $Z$ then $90^\\circ$ about $Y$. Now reset and rotate $90^\\circ$ about $Y$ then $90^\\circ$ about $Z$. The final orientations are completely different!</p>
                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">✨</div>
                                <div class="alert-body">
                                    <strong>The Infinitesimal Exception:</strong>
                                    As the rotation angle approaches zero (infinitesimal rotations $d\\theta$), the cross-terms of order $d\\theta^2$ vanish. Therefore, <strong>angular velocities (which are rates of infinitesimal rotations) DO commute and add vectorially</strong>, while finite rotations do not! (Preview of Lecture 4).
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🌌 Space-Fixed Rotations: The POST-Multiplication Rule</h3>
                            <p>When rotations occur about the <strong>stationary, original global axes</strong> ($XYZ$):</p>
                            <p class="highlight" style="font-size: 1.15rem; text-align: center;">
                                $$[R_{\\text{space}}] = [R_1] [R_2] \\cdots [R_{N-1}] [R_N] \\quad \\text{(POST-MULTIPLY from left to right!)}$$
                            </p>

                            <div class="theorem-card">
                                <h4>🔄 The Reversal Theorem</h4>
                                <p><em>A space-fixed sequence and a body-fixed sequence produce the EXACT SAME overall rotation matrix if and only if the order of rotations is completely reversed!</em></p>
                                $$[R_Z(\\psi) R_Y(\\theta) R_X(\\phi)]_{\\text{space}} \\equiv [R_X(\\phi) R_Y(\\theta) R_Z(\\psi)]_{\\text{body}}$$
                            </div>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>🔀 Mixed Rotations: Systematic Sequencing</h3>
                            <p>What if a motion sequence contains some body-fixed steps and some space-fixed steps?</p>
                            <p>Consider Lecture 3 Slide 7:</p>
                            <ol>
                                <li>Rotate $XYZ$ about fixed $X$-axis by $\\theta_1 \\implies [R_x(\\theta_1)]$</li>
                                <li>Rotate about current body $z'$-axis by $\\theta_2 \\implies$ Body-fixed step $\\implies$ <strong>PRE-multiply</strong>: $[R_z(\\theta_2)] [R_x(\\theta_1)]$</li>
                                <li>Rotate about original fixed $Y$-axis by $\\theta_3 \\implies$ Space-fixed step $\\implies$ <strong>POST-multiply</strong>: $[R_z(\\theta_2) R_x(\\theta_1)] [R_y(\\theta_3)]$</li>
                            </ol>
                            $$[R_{\\text{mixed}}] = [R_z(\\theta_2)] [R_x(\\theta_1)] [R_y(\\theta_3)]$$

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚙️ Physical Linkage Topology: The Bent Shaft Mechanism</h3>
                            <p>Consider the bent shaft with spinning disk from Lecture 3 Slide 10:</p>
                            <ul>
                                <li>Vertical shaft rotates by precession $\\psi$ about fixed $Z$.</li>
                                <li>Collar hinge allows nutation $\\theta$ about horizontal arm.</li>
                                <li>Disk spins by $\\phi$ about bent shaft $AB$.</li>
                            </ul>
                            <p><strong>Crucial Insight:</strong> Because the physical joints are chained mechanically in series, joint $1$ carries joint $2$, which carries joint $3$:</p>
                            <ul>
                                <li>Spin $\\phi$ cannot alter the orientation of the $\\psi$ or $\\theta$ axes.</li>
                                <li>Precession $\\psi$ sweeps both the $\\theta$ and $\\phi$ axes through space.</li>
                            </ul>
                            <p>Therefore, regardless of whether you formulate it forward or backward, the mechanical structure enforces:</p>
                            $$[R] = [R_z(\\phi)] [R_y(\\theta)] [R_z(\\psi)]$$

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>👑 Euler's Equivalent Axis Theorem (The Eigen-Axis Proof)</h3>
                            <p><strong>Theorem:</strong> <em>Any general spatial orientation change of a rigid body can be achieved by a SINGLE finite rotation of angle $\\beta$ about a single axis $\\vec{u}_\\beta$.</em></p>

                            <h4>The 3-Step Similarity Procedure:</h4>
                            <ol>
                                <li>Apply coordinate transform $[R']$ to align global $Z$-axis with the target rotation axis $\\vec{u}_\\beta$.</li>
                                <li>Execute the rotation by angle $\\beta$ about the newly aligned $Z'$-axis: $[R_z(\\beta)]$.</li>
                                <li>Undo the alignment transformation: $[R']^T$.</li>
                            </ol>
                            $$[R_u] = [R']^T [R_z(\\beta)] [R']$$
                            <p>This is a <strong>similarity transformation</strong>! Similarity transformations preserve eigenvalues and traces:</p>

                            <h4>1. Preservation of Eigenvalues (The Invariant Axis)</h4>
                            <p>In the aligned frame, the unit vector along the rotation axis is $\\vec{k}' = [0, 0, 1]^T$:</p>
                            $$[R_z(\\beta)] \\vec{k}' = \\vec{k}' \\implies \\lambda = 1$$
                            <p>In the original frame, let $\\vec{u}_\\beta = [R']^T \\vec{k}'$. Then:</p>
                            $$[R_u] \\vec{u}_\\beta = \\left([R']^T [R_z(\\beta)] [R']\\right) \\left([R']^T \\vec{k}'\\right) = [R']^T [R_z(\\beta)] \\vec{k}' = [R']^T \\vec{k}' = \\vec{u}_\\beta$$
                            $$[R_u] \\vec{u}_\\beta = 1 \\cdot \\vec{u}_\\beta$$
                            <p class="highlight" style="font-size: 1.15rem; text-align: center;">
                                <strong>Conclusion:</strong> Every 3D rotation matrix has a unitary eigenvalue $\\lambda = 1$. The corresponding eigenvector $\\vec{u}_\\beta$ IS the axis of rotation!
                            </p>

                            <h4>2. Preservation of Trace (Extracting the Rotation Angle $\\beta$)</h4>
                            $$\\text{tr}(R_u) = \\text{tr}(R_z(\\beta)) = \\cos\\beta + \\cos\\beta + 1 = 1 + 2\\cos\\beta$$
                            $$\\cos\\beta = \\frac{\\text{tr}(R_u) - 1}{2} \\implies \\mathbf{\\beta = \\arccos\\left(\\frac{\\text{tr}(R_u) - 1}{2}\\right)}$$
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive Sequencer, Linkage & Eigen-Axis Lab",
                    simulationId: "sim-lec3"
                },
                {
                    id: "gimbal",
                    title: "3D Lab: 3-Ring Gimbals & Gimbal Lock",
                    simulationId: "sim-gimbal"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Advanced Traps in Rotation Analysis</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Sign ambiguity in extracting $\\beta$ from trace!</strong>
                                <p>Because $\\cos(\\beta) = \\cos(-\\beta)$, the trace alone only gives $|\\beta| \\in [0, \\pi]$. To resolve the direction of rotation, you must examine the skew-symmetric off-diagonal terms: $R_{32} - R_{23} = 2 u_x \\sin\\beta$. The sign of $\\sin\\beta$ paired with $\\vec{u}_\\beta$ resolves the direction unambiguously!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Confusing the physical joint sequence with the algebraic multiplication order.</strong>
                                <p>In a mechanism, students often see joint 1 at the base, joint 2 on the arm, and joint 3 at the rotor, and mistakenly multiply $[R_1][R_2][R_3]$. But since each subsequent joint rotates relative to the preceding body (body-fixed), the matrices must be pre-multiplied: $[R_3][R_2][R_1]$!</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec4",
            number: 4,
            title: "Common (Orthogonal) Curvilinear Coordinates",
            subtitle: "Cylindrical & Spherical Frameworks, Scale Factors, Moving Unit Vectors, & Rate Derivatives",
            ginsbergRef: "Ginsberg §2.2 (pp. 52-78)",
            summary: "Generalizes 3D spatial kinematics from Cartesian coordinates to arbitrary orthogonal curvilinear coordinates u1, u2, u3. Derives scale factors h_i, base vectors, dynamic unit vectors e_i, and completes the kinematic ladder up to acceleration with full physical dissection of centripetal, Coriolis, and tangential terms in Cylindrical and Spherical systems.",
            pedagogicalFocus: "Understanding why moving basis vectors have non-zero derivatives; mapping abstract coordinates (R, θ, z) and (r, φ, θ) to intuitive physical directions and exam-ready formulas.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🌐 Why Do We Need Curvilinear Coordinates?</h3>
                            <p>
                                In <strong>Cartesian coordinates</strong>, the position vector is simply $\\vec{r}(t) = x(t)\\vec{I} + y(t)\\vec{J} + z(t)\\vec{K}$. Because the unit vectors $\\vec{I}, \\vec{J}, \\vec{K}$ are fixed in space, their time derivatives are identically zero: $\\dot{\\vec{I}} = \\dot{\\vec{J}} = \\dot{\\vec{K}} = \\vec{0}$.
                            </p>
                            <p>
                                <strong>However</strong>, mechanical systems rarely move along rectilinear grid lines! Robotic arms revolve around vertical bearings, shafts rotate about axes, and pistons slide within cylinders. Describing circular or spherical motion using $(x, y, z)$ leads to unwieldy trigonometry and coupled nonlinear differential equations.
                            </p>
                            
                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">💡</div>
                                <div class="alert-body">
                                    <strong>The Curvilinear Trade-Off:</strong>
                                    We replace fixed Cartesian axes with moving coordinate surfaces. 
                                    <em>The benefit:</em> The coordinates $(u_1, u_2, u_3)$ match the natural geometry of the mechanism (e.g. radius $R$, angle $\\theta$, height $z$).
                                    <em>The cost:</em> The unit vectors $(\\vec{e}_1, \\vec{e}_2, \\vec{e}_3)$ change orientation as the particle moves! Therefore, <strong>unit vector derivatives are non-zero: $\\dot{\\vec{e}}_i \\neq \\vec{0}$</strong>.
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>📐 The Universal 4-Step Curvilinear Framework</h3>
                            <div class="roadmap-grid">
                                <div class="roadmap-box kinematics">
                                    <h4>1. Position Function</h4>
                                    <p>Express Cartesian position $\\vec{r}$ in terms of 3 independent parameters $(u_1, u_2, u_3)$:</p>
                                    $$\\vec{r} = x(u_1, u_2, u_3)\\vec{I} + y(u_1, u_2, u_3)\\vec{J} + z(u_1, u_2, u_3)\\vec{K}$$
                                </div>
                                <div class="roadmap-box kinetics">
                                    <h4>2. Base Vectors & Scale Factors</h4>
                                    <p>Differentiate along coordinate curves to find tangential base vectors $\\vec{g}_i$ and their lengths $h_i$:</p>
                                    $$\\vec{g}_i = \\frac{\\partial \\vec{r}}{\\partial u_i}, \\quad h_i = |\\vec{g}_i|$$
                                </div>
                                <div class="roadmap-box solution">
                                    <h4>3. Moving Unit Vectors</h4>
                                    <p>Normalize base vectors to form an orthonormal triad $\\vec{e}_i$:</p>
                                    $$\\vec{e}_i = \\frac{1}{h_i} \\frac{\\partial \\vec{r}}{\\partial u_i}, \\quad \\vec{e}_i \\cdot \\vec{e}_j = \\delta_{ij}$$
                                </div>
                                <div class="roadmap-box kinematics">
                                    <h4>4. Kinematic Ladder</h4>
                                    <p>Climb from velocity $\\vec{v} = \\sum h_i \\dot{u}_i \\vec{e}_i$ to acceleration $\\vec{a}$ by accounting for $\\dot{\\vec{e}}_i$:</p>
                                    $$\\vec{a} = \\frac{d\\vec{v}}{dt} = \\sum (h_i \\dot{u}_i)^\\cdot \\vec{e}_i + \\sum h_i \\dot{u}_i \\dot{\\vec{e}}_i$$
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>📊 Summary of Common Orthogonal Coordinate Systems</h3>
                            <table class="concept-table">
                                <thead>
                                    <tr>
                                        <th>System</th>
                                        <th>Parameters $(u_1, u_2, u_3)$</th>
                                        <th>Scale Factors $(h_1, h_2, h_3)$</th>
                                        <th>Basis Triad</th>
                                        <th>Differential Arc Length $ds^2$</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Cartesian</strong></td>
                                        <td>$(x, y, z)$</td>
                                        <td>$h_x=1, h_y=1, h_z=1$</td>
                                        <td>$\\vec{I}, \\vec{J}, \\vec{K}$</td>
                                        <td>$dx^2 + dy^2 + dz^2$</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cylindrical</strong></td>
                                        <td>$(R, \\theta, z)$</td>
                                        <td>$h_R=1, h_\\theta=R, h_z=1$</td>
                                        <td>$\\vec{e}_R, \\vec{e}_\\theta, \\vec{e}_z$</td>
                                        <td>$dR^2 + R^2 d\\theta^2 + dz^2$</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Spherical (Ginsberg)</strong></td>
                                        <td>$(r, \\phi, \\theta)$</td>
                                        <td>$h_r=1, h_\\phi=r, h_\\theta=r\\sin\\phi$</td>
                                        <td>$\\vec{e}_r, \\vec{e}_\\phi, \\vec{e}_\\theta$</td>
                                        <td>$dr^2 + r^2 d\\phi^2 + r^2\\sin^2\\phi d\\theta^2$</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>🔬 Cylindrical Coordinates Kinematics Derivation</h3>
                            <p>Let a particle be located by polar radius $R$ in the horizontal plane, azimuth angle $\\theta$ from the $X$-axis, and elevation $z$ along the vertical $Z$-axis:</p>
                            $$\\vec{r} = R\\cos\\theta\\vec{I} + R\\sin\\theta\\vec{J} + z\\vec{K}$$

                            <h4>Step 1: Basis Vectors & Scale Factors</h4>
                            $$\\begin{aligned}
                                \\vec{g}_R &= \\frac{\\partial\\vec{r}}{\\partial R} = \\cos\\theta\\vec{I} + \\sin\\theta\\vec{J} \\implies h_R = |\\vec{g}_R| = 1, \\quad \\vec{e}_R = \\cos\\theta\\vec{I} + \\sin\\theta\\vec{J} \\\\
                                \\vec{g}_\\theta &= \\frac{\\partial\\vec{r}}{\\partial \\theta} = -R\\sin\\theta\\vec{I} + R\\cos\\theta\\vec{J} \\implies h_\\theta = |\\vec{g}_\\theta| = R, \\quad \\vec{e}_\\theta = -\\sin\\theta\\vec{I} + \\cos\\theta\\vec{J} \\\\
                                \\vec{g}_z &= \\frac{\\partial\\vec{r}}{\\partial z} = \\vec{K} \\implies h_z = 1, \\quad \\vec{e}_z = \\vec{K}
                            \\end{aligned}$$

                            <h4>Step 2: Time Rates of Change of Moving Basis Vectors</h4>
                            <p>Differentiating $\\vec{e}_R$ and $\\vec{e}_\\theta$ with respect to time:</p>
                            $$\\begin{aligned}
                                \\dot{\\vec{e}}_R &= \\frac{d}{dt}(\\cos\\theta\\vec{I} + \\sin\\theta\\vec{J}) = -\\dot{\\theta}\\sin\\theta\\vec{I} + \\dot{\\theta}\\cos\\theta\\vec{J} = \\dot{\\theta}\\vec{e}_\\theta \\\\
                                \\dot{\\vec{e}}_\\theta &= \\frac{d}{dt}(-\\sin\\theta\\vec{I} + \\cos\\theta\\vec{J}) = -\\dot{\\theta}\\cos\\theta\\vec{I} - \\dot{\\theta}\\sin\\theta\\vec{J} = -\\dot{\\theta}\\vec{e}_R \\\\
                                \\dot{\\vec{e}}_z &= \\vec{0}
                            \\end{aligned}$$

                            <h4>Step 3: Velocity Vector in Cylindrical Coordinates</h4>
                            $$\\vec{v} = \\frac{d}{dt}(R\\vec{e}_R + z\\vec{e}_z) = \\dot{R}\\vec{e}_R + R\\dot{\\vec{e}}_R + \\dot{z}\\vec{e}_z = \\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta + \\dot{z}\\vec{e}_z$$

                            <h4>Step 4: Acceleration Vector & Physical Dissection</h4>
                            $$\\begin{aligned}
                                \\vec{a} &= \\frac{d\\vec{v}}{dt} = \\frac{d}{dt}\\left(\\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta + \\dot{z}\\vec{e}_z\\right) \\\\
                                &= (\\ddot{R}\\vec{e}_R + \\dot{R}\\dot{\\vec{e}}_R) + (\\dot{R}\\dot{\\theta}\\vec{e}_\\theta + R\\ddot{\\theta}\\vec{e}_\\theta + R\\dot{\\theta}\\dot{\\vec{e}}_\\theta) + \\ddot{z}\\vec{e}_z \\\\
                                &= \\ddot{R}\\vec{e}_R + \\dot{R}(\\dot{\\theta}\\vec{e}_\\theta) + \\dot{R}\\dot{\\theta}\\vec{e}_\\theta + R\\ddot{\\theta}\\vec{e}_\\theta + R\\dot{\\theta}(-\\dot{\\theta}\\vec{e}_R) + \\ddot{z}\\vec{e}_z \\\\
                                &= \\underbrace{(\\ddot{R} - R\\dot{\\theta}^2)}_{a_R}\\vec{e}_R + \\underbrace{(R\\ddot{\\theta} + 2\\dot{R}\\dot{\\theta})}_{a_\\theta}\\vec{e}_\\theta + \\underbrace{\\ddot{z}}_{a_z}\\vec{e}_z
                            \\end{aligned}$$

                            <div class="pedagogy-alert note">
                                <div class="alert-icon">🔍</div>
                                <div class="alert-body">
                                    <strong>Exam Dissection of Acceleration Terms:</strong>
                                    <ul>
                                        <li>$\\ddot{R}$: Radial acceleration due to changing extension along the arm.</li>
                                        <li>$-R\\dot{\\theta}^2$: <strong>Centripetal acceleration</strong> directed inward toward the rotation axis.</li>
                                        <li>$R\\ddot{\\theta}$: Tangential acceleration due to angular acceleration of the arm.</li>
                                        <li>$2\\dot{R}\\dot{\\theta}$: <strong>Coriolis acceleration</strong>! Arises from two equal contributions: (1) velocity $\\dot{R}$ rotating direction, and (2) moving radially into a region of greater tangential speed $\\omega R$.</li>
                                        <li>$\\ddot{z}$: Axial vertical acceleration.</li>
                                    </ul>
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🌐 Spherical Coordinates Kinematics (Ginsberg §2.2.2)</h3>
                            <p>Coordinates: radial distance $r$, polar angle / colatitude $\\phi$ from $+Z$ axis ($0 \\le \\phi \\le \\pi$), and azimuth $\\theta$ from $+X$ axis:</p>
                            $$\\vec{r} = r\\sin\\phi\\cos\\theta\\vec{I} + r\\sin\\phi\\sin\\theta\\vec{J} + r\\cos\\phi\\vec{K}$$
                            <p><strong>Scale factors:</strong> $h_r = 1$, $h_\\phi = r$, $h_\\theta = r\\sin\\phi$.</p>
                            <p><strong>Velocity:</strong></p>
                            $$\\vec{v} = \\dot{r}\\vec{e}_r + r\\dot{\\phi}\\vec{e}_\\phi + r\\sin\\phi\\dot{\\theta}\\vec{e}_\\theta$$
                            <p><strong>Acceleration:</strong></p>
                            $$\\begin{aligned}
                                a_r &= \\ddot{r} - r\\dot{\\phi}^2 - r\\sin^2\\phi\\dot{\\theta}^2 \\\\
                                a_\\phi &= r\\ddot{\\phi} + 2\\dot{r}\\dot{\\phi} - r\\sin\\phi\\cos\\phi\\dot{\\theta}^2 \\\\
                                a_\\theta &= r\\sin\\phi\\ddot{\\theta} + 2\\dot{r}\\sin\\phi\\dot{\\theta} + 2r\\cos\\phi\\dot{\\phi}\\dot{\\theta}
                            \\end{aligned}$$
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive 3D Simulation",
                    simulationId: "sim-lec4"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Exam Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ High-Frequency Exam Traps in Curvilinear Kinematics</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Forgetting the factor of 2 in Coriolis acceleration!</strong>
                                <p>In Cylindrical coordinates, students often write $a_\\theta = R\\ddot{\\theta} + \\dot{R}\\dot{\\theta}$ instead of $R\\ddot{\\theta} + 2\\dot{R}\\dot{\\theta}$. The factor of 2 comes from two distinct physical sources: the rate of rotation of the radial unit vector $\\dot{\\vec{e}}_R$ acting on $\\dot{R}$, AND the change in radius $R$ altering the circumference speed $R\\dot{\\theta}$. Always remember: $2\\dot{R}\\dot{\\theta}$!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Angle convention confusion in Spherical coordinates!</strong>
                                <p>In physics, $\\theta$ is often polar and $\\phi$ is azimuth. In <strong>Jerry Ginsberg's MECH 342 text</strong>, $\\phi$ is the polar angle measured from the vertical $Z$-axis, and $\\theta$ is the azimuth angle in the horizontal $XY$-plane! When $\\phi = 90^\\circ$, the particle is on the horizontal plane and $\\sin\\phi = 1$.</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 3: Assuming scale factors $h_i$ are dimensionless constants.</strong>
                                <p>Scale factors convert changes in parameter ($du_i$) into true physical arc lengths ($ds_i = h_i du_i$). While $h_R = 1$ and $h_z = 1$ are dimensionless, $h_\\theta = R$ has units of <strong>meters</strong> (or feet)! Multiplying by $d\\theta$ (radians) gives meters.</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec5",
            number: 5,
            title: "Path Variables (Frenet-Serret) & Matched Kinematics",
            subtitle: "The Frenet Frame (e_t, e_n, e_b), Osculating Plane, Curvature κ=1/ρ, & Forward vs. Inverse Problems",
            ginsbergRef: "Ginsberg §2.3 - §2.4 (pp. 79-98)",
            summary: "Formulates kinematics along an arbitrary 3D curve using intrinsic path coordinates s(t). Defines the Frenet-Serret triad: tangent e_t, principal normal e_n, and binormal e_b. Proves that acceleration has ZERO binormal component (a = v_dot e_t + (v^2/rho) e_n). Explores matched kinematical descriptions for solving forward and inverse mechanism problems.",
            pedagogicalFocus: "Physical roller-coaster intuition for osculating plane; why your body feels normal acceleration in the turn but zero binormal acceleration; mastering matched kinematic descriptions.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🎢 The Roller Coaster Analogy: Intrinsic Path Variables</h3>
                            <p>
                                Imagine you are riding a roller coaster through space in complete darkness. You don't know your absolute Cartesian $(X, Y, Z)$ coordinates relative to the amusement park ticket booth. What you DO know is:
                            </p>
                            <ul>
                                <li>The distance $s(t)$ travelled along the steel track from the starting station.</li>
                                <li>Your speedometer reading: $v(t) = \\dot{s}(t)$.</li>
                                <li>The forces your body feels in your seat: pushed forward/backward when accelerating (tangent $\\vec{e}_t$), and pushed into the turn by banking (principal normal $\\vec{e}_n$).</li>
                            </ul>

                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">💡</div>
                                <div class="alert-body">
                                    <strong>Why Path Variables Are Unique:</strong>
                                    Path variables describe motion <em>strictly from the geometry of the curve itself</em>, without needing any external coordinate origin! The coordinate is arc length $s(t)$, and the reference frame moves with the particle.
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>📐 The Frenet-Serret Moving Triad: $(\\vec{e}_t, \\vec{e}_n, \\vec{e}_b)$</h3>
                            <div class="roadmap-grid">
                                <div class="roadmap-box kinematics">
                                    <h4>1. Tangent Vector $\\vec{e}_t$</h4>
                                    <p>Points directly along the instantaneous direction of motion:</p>
                                    $$\\vec{e}_t = \\frac{d\\vec{r}}{ds} = \\frac{\\vec{v}}{|\\vec{v}|}$$
                                </div>
                                <div class="roadmap-box kinetics">
                                    <h4>2. Principal Normal $\\vec{e}_n$</h4>
                                    <p>Points directly toward the <strong>center of curvature</strong> (inside the curve):</p>
                                    $$\\vec{e}_n = \\frac{1}{\\kappa} \\frac{d\\vec{e}_t}{ds} = \\rho \\frac{d\\vec{e}_t}{ds}$$
                                </div>
                                <div class="roadmap-box solution">
                                    <h4>3. Binormal Vector $\\vec{e}_b$</h4>
                                    <p>Completes the right-handed triad perpendicular to the osculating plane:</p>
                                    $$\\vec{e}_b = \\vec{e}_t \\times \\vec{e}_n$$
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🎯 The Three Fundamental Planes</h3>
                            <table class="concept-table">
                                <thead>
                                    <tr>
                                        <th>Plane Name</th>
                                        <th>Spanned By</th>
                                        <th>Normal Vector</th>
                                        <th>Physical Meaning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Osculating Plane</strong></td>
                                        <td>$\\vec{e}_t$ and $\\vec{e}_n$</td>
                                        <td>$\\vec{e}_b$</td>
                                        <td>The "best-fit" 2D plane containing the instantaneous velocity and acceleration vectors!</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Normal Plane</strong></td>
                                        <td>$\\vec{e}_n$ and $\\vec{e}_b$</td>
                                        <td>$\\vec{e}_t$</td>
                                        <td>Cross-section perpendicular to motion.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Rectifying Plane</strong></td>
                                        <td>$\\vec{e}_t$ and $\\vec{e}_b$</td>
                                        <td>$\\vec{e}_n$</td>
                                        <td>Tangent to the envelope surface containing the curve.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>📐 Derivation of Velocity and Acceleration</h3>
                            <p>Let position along the curve be parameterized by arc length $s$. By the chain rule:</p>
                            $$\\vec{v} = \\frac{d\\vec{r}}{dt} = \\frac{d\\vec{r}}{ds} \\frac{ds}{dt} = v \\vec{e}_t$$
                            <p><strong>Crucial Fact:</strong> Velocity in path variables has ONLY a tangential component!</p>

                            <h4>Deriving Acceleration:</h4>
                            $$\\vec{a} = \\frac{d\\vec{v}}{dt} = \\frac{d}{dt}(v\\vec{e}_t) = \\dot{v}\\vec{e}_t + v\\dot{\\vec{e}}_t$$
                            <p>Now evaluate the rate of change of the unit tangent vector $\\dot{\\vec{e}}_t$:</p>
                            $$\\dot{\\vec{e}}_t = \\frac{d\\vec{e}_t}{ds} \\frac{ds}{dt} = \\left(\\kappa \\vec{e}_n\\right) v = \\frac{v}{\\rho} \\vec{e}_n$$
                            <p>Substituting back yields the fundamental equation of path kinematics (Ginsberg Eq. 2.3.11):</p>
                            $$\\vec{a} = \\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n + 0\\vec{e}_b$$

                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">⭐</div>
                                <div class="alert-body">
                                    <strong>The Zero Binormal Acceleration Theorem:</strong>
                                    Notice that the binormal component $a_b \\equiv 0$! Acceleration NEVER has a binormal component. This proves mathematically that <strong>both velocity $\\vec{v}$ and acceleration $\\vec{a}$ lie entirely within the osculating plane!</strong>
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🔍 How to Calculate Radius of Curvature $\\rho$ on Exams</h3>
                            <p>In general 3D motion, you are rarely handed the radius of curvature $\\rho$. How do you calculate it? Take the cross product of velocity and acceleration:</p>
                            $$\\vec{v} \\times \\vec{a} = (v\\vec{e}_t) \\times \\left(\\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n\\right) = \\frac{v^3}{\\rho} (\\vec{e}_t \\times \\vec{e}_n) = \\frac{v^3}{\\rho} \\vec{e}_b$$
                            <p>Take the magnitude of both sides:</p>
                            $$|\\vec{v} \\times \\vec{a}| = \\frac{v^3}{\\rho} \\implies \\rho = \\frac{|\\vec{v}|^3}{|\\vec{v} \\times \\vec{a}|}$$
                            <p>This master formula works in ANY coordinate system (Cartesian, Cylindrical, Spherical)!</p>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🔄 Matched Kinematical Descriptions (§2.4)</h3>
                            <p>An <strong>inverse problem</strong> arises when motion is known in one coordinate representation, and you must determine the motion parameters in another system:</p>
                            <div class="problem-statement">
                                <strong>Forward vs. Inverse Strategy:</strong>
                                <ul>
                                    <li><strong>Forward:</strong> Given coordinates $R(t), \\theta(t), z(t)$, differentiate directly to get velocity and acceleration.</li>
                                    <li><strong>Inverse / Matching:</strong> Given total velocity $\\vec{v}$ or path shape, equate vector components:
                                    $$\\vec{v} = v_x\\vec{I} + v_y\\vec{J} + v_z\\vec{K} = \\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta + \\dot{z}\\vec{e}_z = v\\vec{e}_t$$
                                    Dotting with each basis vector produces 3 scalar equations to solve for the unknown parameter rates ($\\dot{R}, \\dot{\\theta}, \\dot{z}$).</li>
                                </ul>
                            </div>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive 3D Simulation",
                    simulationId: "sim-lec5"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Exam Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Frequent Exam Traps in Path Variables</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Confusing path curvature radius $\\rho$ with cylindrical radius $R$!</strong>
                                <p>A particle spiraling up a cylinder has $R = \\text{const}$. But its path is a 3D helix! The radius of curvature of a helix is $\\rho = R + \\frac{p^2}{R} > R$. Plugging $R$ into $a_n = \\frac{v^2}{R}$ instead of $\\rho$ will immediately cost full points!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Confusing $\\dot{v}$ with $|\\vec{a}|$.</strong>
                                <p>$\\dot{v} = \\frac{d}{dt}|\\vec{v}|$ is the rate of change of speed (scalar derivative). $|\\vec{a}| = \\sqrt{\\dot{v}^2 + (v^2/\\rho)^2}$ is the magnitude of total acceleration. If a car moves around a curve at constant speed $v$, then $\\dot{v} = 0$, but its acceleration is NOT zero: $|\\vec{a}| = \\frac{v^2}{\\rho}$!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 3: Assuming $\\vec{e}_n$ points outward.</strong>
                                <p>$\\vec{e}_n$ always points <strong>inward</strong> towards the center of curvature (in the direction of the turning force). The centripetal acceleration vector is $+a_n\\vec{e}_n = +\\frac{v^2}{\\rho}\\vec{e}_n$.</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec6",
            number: 6,
            title: "Angular Velocity & The Transport Theorem",
            subtitle: "Infinitesimal Rotations Commute, Poisson's Formulas (e_dot = omega x e), Rotating Frame Derivatives, & Superposition",
            ginsbergRef: "Ginsberg §3.2.2 & §3.3 (pp. 148-175)",
            summary: "Rigorously establishes that while finite rotations do not commute, infinitesimal angular displacements dθ DO commute, proving that angular velocity is a true spatial vector ω. Derives Poisson's kinematic relations and the celebrated Transport Theorem: (dA/dt)_XYZ = (dA/dt)_xyz + ω x A. Teaches how to construct angular velocity vectors by superposing joint rates across spatial mechanisms.",
            pedagogicalFocus: "Resolving the non-commutativity paradox: why finite rotations can't be vectors, but angular velocity IS a vector! Mastering the Transport Theorem as the master key of 3D dynamics.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🧩 The Paradox: Why is Angular Velocity a Vector if Rotations Don't Commute?</h3>
                            <p>
                                In Lecture #3, we proved that finite rotations do <strong>not</strong> commute: turning a book $90^\\circ$ about $X$ then $90^\\circ$ about $Y$ results in a completely different orientation than turning it about $Y$ then $X$. 
                                Since vector addition is commutative ($\\vec{A} + \\vec{B} = \\vec{B} + \\vec{A}$), <strong>finite rotations CANNOT be represented as vectors!</strong>
                            </p>
                            <p>
                                Why, then, in every dynamics course, do we write angular velocity as a vector: $\\vec{\\omega} = \\omega_x\\vec{i} + \\omega_y\\vec{j} + \\omega_z\\vec{k}$?
                            </p>

                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">💡</div>
                                <div class="alert-body">
                                    <strong>The Resolution: Infinitesimal Rotations DO Commute!</strong>
                                    For an infinitesimal rotation $d\\vec{\\theta}$, the rotation matrix is:
                                    $$[R(d\\vec{\\theta})] = [I] + [d\\tilde{\\theta}] + \\mathcal{O}(d\\theta^2)$$
                                    Multiplying two infinitesimal rotations in opposite order:
                                    $$[R_1][R_2] - [R_2][R_1] = ([I] + [d\\tilde{\\theta}_1] + [d\\tilde{\\theta}_2]) - ([I] + [d\\tilde{\\theta}_2] + [d\\tilde{\\theta}_1]) + \\mathcal{O}(d\\theta^2) = \\mathbf{0}$$
                                    To first order, the order of multiplication DOES NOT MATTER! Dividing by $dt \\to 0$ gives:
                                    $$\\vec{\\omega} = \\lim_{\\Delta t \\to 0} \\frac{\\Delta\\vec{\\theta}}{\\Delta t} = \\frac{d\\vec{\\theta}}{dt}$$
                                    Angular velocity is a mathematically rigorous vector!
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🐟 Poisson's Kinematic Relations</h3>
                            <p>
                                Consider a unit basis vector $\\vec{e}$ attached to a rotating body. Since its length is strictly fixed at 1, it cannot stretch or shrink. The only change it can undergo is rotation about $\\vec{\\omega}$:
                            </p>
                            <div class="roadmap-grid">
                                <div class="roadmap-box kinematics">
                                    <h4>$\\dot{\\vec{i}} = \\vec{\\omega} \\times \\vec{i}$</h4>
                                    <p>Rate of change of body $x$-axis.</p>
                                </div>
                                <div class="roadmap-box kinetics">
                                    <h4>$\\dot{\\vec{j}} = \\vec{\\omega} \\times \\vec{j}$</h4>
                                    <p>Rate of change of body $y$-axis.</p>
                                </div>
                                <div class="roadmap-box solution">
                                    <h4>$\\dot{\\vec{k}} = \\vec{\\omega} \\times \\vec{k}$</h4>
                                    <p>Rate of change of body $z$-axis.</p>
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🚀 The Transport Theorem (The Engine of 3D Dynamics)</h3>
                            <p>
                                Let $\\vec{A} = A_x\\vec{i} + A_y\\vec{j} + A_z\\vec{k}$ be <strong>any arbitrary physical vector</strong> (velocity, momentum, force, magnetic field) whose components are written in rotating frame $xyz$ moving with angular velocity $\\vec{\\omega}$.
                            </p>
                            <p>Differentiating with respect to the stationary reference frame $XYZ$ using product rule:</p>
                            $$\\left(\\frac{d\\vec{A}}{dt}\\right)_{XYZ} = (\\dot{A}_x\\vec{i} + \\dot{A}_y\\vec{j} + \\dot{A}_z\\vec{k}) + (A_x\\dot{\\vec{i}} + A_y\\dot{\\vec{j}} + A_z\\dot{\\vec{k}})$$
                            <p>Substituting Poisson's formulas into the second term:</p>
                            $$A_x(\\vec{\\omega}\\times\\vec{i}) + A_y(\\vec{\\omega}\\times\\vec{j}) + A_z(\\vec{\\omega}\\times\\vec{k}) = \\vec{\\omega} \\times (A_x\\vec{i} + A_y\\vec{j} + A_z\\vec{k}) = \\vec{\\omega} \\times \\vec{A}$$
                            <p>Therefore, we arrive at the celebrated <strong>Transport Theorem</strong>:</p>
                            $$\\left(\\frac{d\\vec{A}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{A}}{dt}\\right)_{xyz} + \\vec{\\omega} \\times \\vec{A}$$
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>🔗 Superposition of Angular Velocities across Kinematic Chains</h3>
                            <p>
                                When multiple bodies are linked in series (e.g. turntable $\\to$ boom arm $\\to$ gimbal $\\to$ rotor), the total absolute angular velocity is the direct vector sum of the relative angular velocity at each joint:
                            </p>
                            $$\\vec{\\omega}_{N/0} = \\sum_{j=1}^N \\vec{\\omega}_{j/j-1} = \\vec{\\omega}_{1/0} + \\vec{\\omega}_{2/1} + \\cdots + \\vec{\\omega}_{N/N-1}$$

                            <div class="problem-statement">
                                <strong>Lecture #6 Example: Ginsberg Ex 3.9 (pp. 164)</strong>
                                <ul>
                                    <li>Vertical shaft $AB$ rotates about fixed vertical axis $Z$ at $\\Omega = 20\\text{ rad/s}$ ($+Z$ direction: $\\vec{\\omega}_{shaft} = 20\\vec{K}$).</li>
                                    <li>Attached collar carries an arm tipped at an angle, around which a flywheel spins at $N = 3600\\text{ rpm}$ relative to the arm ($+e$ axis).</li>
                                </ul>
                                <strong>Building the Total Angular Velocity Vector:</strong>
                                $$\\vec{\\omega}_{disk} = \\vec{\\omega}_{shaft} + \\vec{\\omega}_{disk/shaft} = 20\\vec{K} + \\left(\\frac{3600 \\times 2\\pi}{60}\\right)\\vec{e}_a = 20\\vec{K} + 377.0\\vec{e}_a \\text{ rad/s}$$
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚡ Angular Acceleration $\\vec{\\alpha}$</h3>
                            <p>By definition, angular acceleration is the time derivative of angular velocity:</p>
                            $$\\vec{\\alpha} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ}$$
                            <p>Applying the Transport Theorem to $\\vec{\\omega}$ itself:</p>
                            $$\\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{xyz} + \\vec{\\omega} \\times \\vec{\\omega}$$
                            <p>Because the cross product of any vector with itself is zero ($\\vec{\\omega} \\times \\vec{\\omega} = \\vec{0}$):</p>
                            $$\\vec{\\alpha} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{xyz}$$

                            <div class="pedagogy-alert tip">
                                <div class="alert-icon">⭐</div>
                                <div class="alert-body">
                                    <strong>Golden Exam Theorem:</strong>
                                    The time derivative of the angular velocity vector $\\vec{\\omega}$ is <strong>identically the same</strong> whether computed in the stationary frame $XYZ$ or in the rotating body frame $xyz$!
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive 3D Simulation",
                    simulationId: "sim-lec6"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Exam Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Fatal Mistakes in Transport Theorem Problems</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Differentiating basis vectors when building $\\vec{\\alpha}$!</strong>
                                <p>If $\\vec{\\omega} = \\Omega\\vec{K} + \\omega_1\\vec{i}'$, when you take $\\frac{d\\vec{\\omega}}{dt}$, students often write $\\dot{\\Omega}\\vec{K} + \\dot{\\omega}_1\\vec{i}'$, forgetting that $\\vec{i}'$ is a moving unit vector! By Poisson's formula, $\\dot{\\vec{i}}' = (\\Omega\\vec{K}) \\times \\vec{i}'$. Dropping this term completely loses the gyroscopic acceleration!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Using the wrong $\\vec{\\omega}$ in the transport cross-product.</strong>
                                <p>In the formula $\\left(\\frac{d\\vec{A}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{A}}{dt}\\right)_{xyz} + \\vec{\\omega}_{frame} \\times \\vec{A}$, the angular velocity $\\vec{\\omega}_{frame}$ MUST be the angular velocity of the coordinate frame in which $\\vec{A}$'s scalar components are defined, NOT the angular velocity of the particle!</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec7",
            number: 7,
            title: "The Eulerian Angles (Ginsberg Z-Y-Z Sequence)",
            subtitle: "Precession ψ, Nutation θ, Spin φ, Body-Fixed Angular Velocity, Acceleration, & Gimbal Lock",
            ginsbergRef: "Ginsberg §4.2 (pp. 176-188)",
            summary: "Presents Jerry Ginsberg's canonical 3-step body-fixed Eulerian angle sequence (Precession ψ about Z, Nutation θ about intermediate y', Spin φ about body z''). Derives the full 3x3 direction cosine rotation matrix [R], computes body-fixed angular velocity and angular acceleration components, and solves the inverse kinematic problem with full analysis of the Gimbal Lock singularity at sin(θ) = 0.",
            pedagogicalFocus: "Understanding why body-fixed frames are essential for 3D kinetics (where inertia [I] is constant!); decoding the physical meaning of precession, nutation, and spin in gyroscopes, spacecraft, and spinning tops.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Concept & Intuition",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🎯 Why Do We Need the Body-Fixed Eulerian Angles?</h3>
                            <p>
                                In 3D rigid body kinetics (Chapters 5 and 6), a body's mass moment of inertia tensor $[I]$ changes continuously with time if expressed in absolute space coordinates $XYZ$. 
                                But when attached to the tumbling body itself, the mass distribution is stationary, meaning <strong>the body-fixed inertia tensor $[I]_{xyz}$ is completely constant!</strong>
                            </p>
                            <p>
                                To exploit this, Jerry Ginsberg defines a standard 3-angle body-fixed sequence called the <strong>Eulerian Angles</strong>:
                            </p>

                            <div class="roadmap-grid">
                                <div class="roadmap-box kinematics">
                                    <h4>1. Precession ($\\psi$)</h4>
                                    <p>Rotation about fixed vertical axis $Z$ by angle $\\psi$. Produces intermediate frame $x' y' z'$.</p>
                                    $$\\vec{\\omega}_1 = \\dot{\\psi}\\vec{K}$$
                                </div>
                                <div class="roadmap-box kinetics">
                                    <h4>2. Nutation ($\\theta$)</h4>
                                    <p>Rotation about the intermediate $y'$-axis (line of nodes) by angle $\\theta$. Produces frame $x'' y'' z''$.</p>
                                    $$\\vec{\\omega}_2 = \\dot{\\theta}\\vec{j}'$$
                                </div>
                                <div class="roadmap-box solution">
                                    <h4>3. Spin ($\\phi$)</h4>
                                    <p>Rotation about the final symmetry axis $z''$-axis by angle $\\phi$. Produces body frame $x y z$.</p>
                                    $$\\vec{\\omega}_3 = \\dot{\\phi}\\vec{k}$$
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚠️ Ginsberg's Z-Y-Z Convention vs. Aerodynamic Z-Y-X (Yaw-Pitch-Roll)</h3>
                            <table class="concept-table">
                                <thead>
                                    <tr>
                                        <th>Convention</th>
                                        <th>Rotation Axes</th>
                                        <th>Common Applications</th>
                                        <th>Singularity (Gimbal Lock)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Ginsberg Eulerian Angles</strong></td>
                                        <td>$Z(\\psi) \\to y'(\\theta) \\to z''(\\phi)$</td>
                                        <td>Gyroscopes, spinning tops, symmetrical rotors, MECH 342 exams</td>
                                        <td>$\\sin\\theta = 0$ (vertical alignment $\\theta = 0^\\circ$ or $180^\\circ$)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Aerodynamic Tait-Bryan</strong></td>
                                        <td>$Z(\\psi) \\to y'(\\theta) \\to x''(\\phi)$ (Yaw-Pitch-Roll)</td>
                                        <td>Aircraft flight dynamics, marine submersibles, quadcopters</td>
                                        <td>$\\cos\\theta = 0$ (vertical pitch $\\theta = \\pm 90^\\circ$)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                },
                {
                    id: "derivation",
                    title: "Mathematical Walkthrough",
                    contentHtml: `
                        <div class="math-card">
                            <h3>📐 Derivation of the Complete Ginsberg Rotation Matrix $[R]$</h3>
                            <p>Using the body-fixed pre-multiplication rule:</p>
                            $$[R] = [R_Z(\\phi)] [R_Y(\\theta)] [R_Z(\\psi)]$$
                            <p>Multiplying these three matrices in closed form (Lecture #7 Slide 7):</p>
                            $$[R] = \\begin{bmatrix}
                                c\\psi c\\theta c\\phi - s\\psi s\\phi & s\\psi c\\theta c\\phi + c\\psi s\\phi & -s\\theta c\\phi \\\\
                                -c\\psi c\\theta s\\phi - s\\psi c\\phi & -s\\psi c\\theta s\\phi + c\\psi c\\phi & s\\theta s\\phi \\\\
                                c\\psi s\\theta & s\\psi s\\theta & c\\theta
                            \\end{bmatrix}$$
                            <p>where $c\\psi = \\cos\\psi, s\\psi = \\sin\\psi$, etc.</p>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>⚡ Angular Velocity in Body-Fixed Components</h3>
                            <p>The vector angular velocity is the superposition of the three rates:</p>
                            $$\\vec{\\omega} = \\dot{\\psi}\\vec{K} + \\dot{\\theta}\\vec{j}' + \\dot{\\phi}\\vec{k}$$
                            <p>Transforming $\\vec{K}$ and $\\vec{j}'$ into the final body-fixed frame $(x, y, z)$:</p>
                            $$\\begin{aligned}
                                \\vec{K} &= -\\sin\\theta\\cos\\phi\\vec{i} + \\sin\\theta\\sin\\phi\\vec{j} + \\cos\\theta\\vec{k} \\\\
                                \\vec{j}' &= \\sin\\phi\\vec{i} + \\cos\\phi\\vec{j} \\\\
                                \\vec{k} &= \\vec{k}
                            \\end{aligned}$$
                            <p>Substituting into $\\vec{\\omega}$ gives Jerry Ginsberg's fundamental equations (Eq. 4.2.12, pp. 180):</p>
                            $$\\begin{aligned}
                                \\omega_x &= -\\dot{\\psi}\\sin\\theta\\cos\\phi + \\dot{\\theta}\\sin\\phi \\\\
                                \\omega_y &= \\dot{\\psi}\\sin\\theta\\sin\\phi + \\dot{\\theta}\\cos\\phi \\\\
                                \\omega_z &= \\dot{\\psi}\\cos\\theta + \\dot{\\phi}
                            \\end{aligned}$$

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>🔄 Inverse Kinematic Extraction from Rotation Matrix $[R]$</h3>
                            <p>Given numerical entries $R_{ij}$, how do we extract the physical angles $(\\psi, \\theta, \\phi)$?</p>
                            <ol>
                                <li><strong>Nutation $\\theta$:</strong> From $R_{33} = \\cos\\theta$ and $\\sqrt{R_{13}^2 + R_{23}^2} = \\sin\\theta$:
                                $$\\theta = \\text{atan2}\\left(\\pm\\sqrt{R_{13}^2 + R_{23}^2}, R_{33}\\right)$$
                                </li>
                                <li><strong>Spin $\\phi$:</strong> From $\\frac{R_{23}}{-R_{13}} = \\frac{\\sin\\theta\\sin\\phi}{\\sin\\theta\\cos\\phi} = \\tan\\phi$:
                                $$\\phi = \\text{atan2}(R_{23}, -R_{13})$$
                                </li>
                                <li><strong>Precession $\\psi$:</strong> From $\\frac{R_{31}}{R_{32}} = \\frac{\\cos\\psi\\sin\\theta}{\\sin\\psi\\sin\\theta}$:
                                $$\\psi = \\text{atan2}(R_{31}, R_{32})$$
                                </li>
                            </ol>
                        </div>
                    `
                },
                {
                    id: "interactive",
                    title: "Interactive 3D Simulation",
                    simulationId: "sim-lec7"
                },
                {
                    id: "pitfalls",
                    title: "Common Pitfalls & Exam Checks",
                    contentHtml: `
                        <div class="pitfalls-card">
                            <h3>⚠️ Critical Exam Pitfalls in Eulerian Angles</h3>
                            <div class="misconception-item">
                                <strong>Pitfall 1: Gimbal Lock Singularity when $\\sin\\theta = 0$!</strong>
                                <p>When $\\theta = 0$ or $\\pi$, the nutation angle is zero, causing the initial $Z$-axis and final $z''$-axis to become completely collinear! In the equations, $R_{13} = 0, R_{23} = 0$, causing $\\text{atan2}$ to be undefined. Physically, precession $\\psi$ and spin $\\phi$ rotate about the exact same physical axis, meaning 1 degree of freedom is lost!</p>
                            </div>
                            <div class="misconception-item">
                                <strong>Pitfall 2: Mixing up intermediate unit vectors.</strong>
                                <p>Notice that $\\dot{\\theta}$ is about the INTERMEDIATE axis $\\vec{j}'$, while $\\dot{\\psi}$ is about the GLOBAL axis $\\vec{K}$, and $\\dot{\\phi}$ is about the FINAL BODY axis $\\vec{k}$. You cannot simply add them as scalar components without transforming them to the same reference frame!</p>
                            </div>
                        </div>
                    `
                }
            ]
        },

        {
            id: "lec_future",
            number: "Roadmap",
            title: "Future Course Roadmap & Kinetics",
            subtitle: "3D Inertia Tensors, Euler's Equations of Motion, Gyroscopic Precession, & Extensibility",
            ginsbergRef: "Jerry Ginsberg Chapters 5, 6, 7 & 8",
            summary: "Provides the bridge to 3D kinetics: rigid body momentum, mass moments and products of inertia, principal axes, Euler's dynamic equations of motion, and numerical simulation.",
            pedagogicalFocus: "Transition from kinematics (geometry of motion) to kinetics (forces and torques generating motion).",
            
            tabs: [
                {
                    id: "concept",
                    title: "Upcoming Kinetics Modules",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🚀 The Road Ahead: Rigid Body 3D Kinetics</h3>
                            <div class="future-lectures-grid">
                                <div class="future-box">
                                    <span class="lec-badge">Next Module</span>
                                    <h4>Inertia Tensor & Principal Axes</h4>
                                    <p>Mass moments ($I_{xx}, I_{yy}, I_{zz}$) and products of inertia ($I_{xy}, I_{xz}, I_{yz}$). Transformation law $[I'] = [R][I][R]^T$, and diagonalizing $[I]$ via eigenvector decomposition.</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Next Module</span>
                                    <h4>Angular Momentum of a Rigid Body</h4>
                                    <p>Calculating $\\vec{H}_O = [I_O]\\vec{\\omega}$ and $\\vec{H}_G = [I_G]\\vec{\\omega}$. Crucial dependency on reference point selection (center of mass $G$ vs fixed pivot $O$).</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Next Module</span>
                                    <h4>Euler's Dynamic Equations of Motion</h4>
                                    <p>Applying $\\sum \\vec{M}_G = \\dot{\\vec{H}}_G = [I_G]\\vec{\\alpha} + \\vec{\\omega}\\times([I_G]\\vec{\\omega})$ along principal axes: gyroscopic couples and stability.</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Next Module</span>
                                    <h4>State-Space Simulation & Stability</h4>
                                    <p>Formulating second-order ODEs into first-order state-space form for integration with MATLAB <code>ode45</code> and Python <code>scipy.integrate.solve_ivp</code>.</p>
                                </div>
                            </div>
                        </div>
                    `
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MECH342_CURRICULUM;
}
