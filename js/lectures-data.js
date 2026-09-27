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
            id: "lec_future",
            number: "Roadmap",
            title: "Curriculum Extension & Future Lectures",
            subtitle: "Upcoming Modules in MECH 342 & Extensibility Architecture",
            ginsbergRef: "Chapters 2, 4, 5, 6, 7",
            summary: "Provides forward-looking scaffolding for remaining course topics and allows users or instructors to add custom lecture content into the engine.",
            pedagogicalFocus: "Constructive alignment, connecting kinematics to kinetics, and expandable course architecture.",
            
            tabs: [
                {
                    id: "concept",
                    title: "Future Lecture Roadmap",
                    contentHtml: `
                        <div class="concept-card">
                            <h3>🚀 Next Steps in the UVic MECH 342 Curriculum</h3>
                            <div class="future-lectures-grid">
                                <div class="future-box">
                                    <span class="lec-badge">Lecture 4</span>
                                    <h4>Angular Velocity & The Transport Theorem</h4>
                                    <p>Infinitesimal rotations, derivation of Poisson's formulas ($\\dot{\\vec{e}} = \\vec{\\omega} \\times \\vec{e}$), and the general transport theorem for differentiating vectors in moving frames.</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Lecture 5</span>
                                    <h4>Spatial Kinematics of Mechanisms</h4>
                                    <p>Relative velocity and acceleration equations in 3D: $\\vec{a}_P = \\vec{a}_O + \\dot{\\vec{\\omega}} \\times \\vec{r}_{P/O} + \\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{P/O}) + 2\\vec{\\omega} \\times (\\vec{v}_{rel}) + \\vec{a}_{rel}$.</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Lecture 6</span>
                                    <h4>Inertia Matrix & Angular Momentum of Rigid Bodies</h4>
                                    <p>Mass moments and products of inertia, transformation of inertia tensors $[I'] = [R][I][R]^T$, and principal axes via eigenvalue decomposition.</p>
                                </div>
                                <div class="future-box">
                                    <span class="lec-badge">Lecture 7</span>
                                    <h4>Euler's Equations & 3D Rigid Body Kinetics</h4>
                                    <p>Derivation of Euler's equations of motion: $\\sum M_x = I_{xx}\\dot{\\omega}_x - (I_{yy} - I_{zz})\\omega_y\\omega_z$, gyroscopic moments, and precession stability.</p>
                                </div>
                            </div>

                            <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">

                            <h3>➕ Add Custom Lecture to This App</h3>
                            <p>You can dynamically expand this application with your own lecture notes, problem sets, and derivations using the button below:</p>
                            <button class="btn btn-primary" onclick="App.openAddLectureModal()">+ Add New Lecture Module</button>
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
