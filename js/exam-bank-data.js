/**
 * UVic MECH 342 - Advanced Dynamics II
 * Official Exam & Tutorial Problem Bank & Test-Solving Blueprints
 * Integrated from Course Notes, Assignments, and Tutorials
 */

const MECH342_EXAM_BANK = {
    blueprints: [
        {
            id: "bp-frame",
            title: "Blueprint 1: Multi-Frame Setup & Rotation Matrix Recipe",
            targetTopic: "Lecture 1-3, Asg 1 Q2-Q6",
            steps: [
                {
                    stepNum: 1,
                    action: "Establish the Stationary Global Frame (XYZ)",
                    detail: "Anchor origin O at a fixed bearing, ground joint, or hinge. Align Z with a primary fixed axis of rotation whenever possible."
                },
                {
                    stepNum: 2,
                    action: "Assign Body-Fixed Frames to Each Link in the Kinematic Chain",
                    detail: "Attach moving frame x_j y_j z_j to each rigid body. Align one coordinate axis directly along the physical rotation pin or shaft."
                },
                {
                    stepNum: 3,
                    action: "Determine Canonical Rotation Sequences & Multiplication Order",
                    detail: "CRITICAL EXAM RULE: If rotations occur about moving (body-fixed) axes, PRE-MULTIPLY: [R] = [R_N]...[R_2][R_1]. If rotations occur about fixed global axes, POST-MULTIPLY: [R] = [R_1][R_2]...[R_N]."
                },
                {
                    stepNum: 4,
                    action: "Transform Vectors Across Reference Frames",
                    detail: "To express a vector from XYZ in terms of xyz: [r]_xyz = [R] [r]_XYZ. To convert back: [r]_XYZ = [R]^T [r]_xyz."
                },
                {
                    stepNum: 5,
                    action: "Verify Orthonormality Check",
                    detail: "Before proceeding, check: det([R]) = +1 and [R][R]^T = [I]. On exam paper, check that the sum of squares of any row or column equals 1.0!"
                }
            ]
        },
        {
            id: "bp-curv",
            title: "Blueprint 2: Curvilinear System Decision Matrix & Kinematics Recipe",
            targetTopic: "Lecture 4, Tutorial 3 Prob 1 & 2",
            steps: [
                {
                    stepNum: 1,
                    action: "Coordinate System Selection Flowchart",
                    detail: "Does the problem have axial/cylindrical symmetry (e.g. spinning vertical shaft, sliding collar)? -> Use Cylindrical (R, θ, z). Does motion radiate from a central spherical pivot? -> Use Spherical (r, φ, θ). Is motion strictly constrained along a 1D track/wire? -> Use Path Variables (s)."
                },
                {
                    stepNum: 2,
                    action: "Write the Scale Factors & Basis Vectors",
                    detail: "Cylindrical: h_R = 1, h_θ = R, h_z = 1. Spherical: h_r = 1, h_φ = r, h_θ = r sin(φ)."
                },
                {
                    stepNum: 3,
                    action: "Differentiate Parameter Functions",
                    detail: "Compute parameter rates: (R_dot, θ_dot, z_dot) and (R_ddot, θ_ddot, z_ddot). Watch out for constraint equations (e.g. z = L cos(θ) => z_dot = -L θ_dot sin(θ))."
                },
                {
                    stepNum: 4,
                    action: "Assemble Velocity & Acceleration Components",
                    detail: "Never forget the Coriolis term: 2 R_dot θ_dot in a_θ! Centripetal term: -R θ_dot² in a_R."
                }
            ]
        },
        {
            id: "bp-path",
            title: "Blueprint 3: Path Variables (Frenet-Serret) Attack Strategy",
            targetTopic: "Lecture 5, Ginsberg §2.3",
            steps: [
                {
                    stepNum: 1,
                    action: "Determine Unit Tangent Vector e_t",
                    detail: "e_t = v / |v| = (dr/dt) / |dr/dt|. Velocity is strictly tangential: v = v e_t."
                },
                {
                    stepNum: 2,
                    action: "Compute Radius of Curvature ρ via the Master Vector Formula",
                    detail: "ρ = |v|³ / |v × a|. This master formula bypasses parameter transformations and works directly with Cartesian derivatives!"
                },
                {
                    stepNum: 3,
                    action: "Compute Principal Normal e_n & Binormal e_b",
                    detail: "e_b = (v × a) / |v × a|. Then e_n = e_b × e_t (points inward toward center of curvature)."
                },
                {
                    stepNum: 4,
                    action: "Assemble Acceleration",
                    detail: "a = v_dot e_t + (v²/ρ) e_n + 0 e_b. Binormal component is strictly ZERO. Both v and a lie in the osculating plane!"
                }
            ]
        },
        {
            id: "bp-transport",
            title: "Blueprint 4: Transport Theorem & Rotating Frames Derivative Checklist",
            targetTopic: "Lecture 6, Ginsberg §3.2.2 & §3.3",
            steps: [
                {
                    stepNum: 1,
                    action: "Identify the Angular Velocity of the Frame (ω_frame)",
                    detail: "Distinguish between the angular velocity of the particle and the angular velocity of the coordinate frame!"
                },
                {
                    stepNum: 2,
                    action: "Apply the Transport Theorem Formula",
                    detail: "(dA/dt)_XYZ = (dA/dt)_xyz + ω_frame × A."
                },
                {
                    stepNum: 3,
                    action: "Evaluate Intermediate Derivatives in Kinematic Chains",
                    detail: "When ω = Ω K + ω_1 i', the angular acceleration is α = dω/dt = dΩ/dt K + dω_1/dt i' + ω_1 (Ω K × i')!"
                }
            ]
        },
        {
            id: "bp-euler",
            title: "Blueprint 5: Ginsberg Eulerian Angles (Z-Y-Z) Kinematic & Singularity Checklist",
            targetTopic: "Lecture 7, Ginsberg §4.2",
            steps: [
                {
                    stepNum: 1,
                    action: "Recognize the 3 Rotation Axes in the Problem",
                    detail: "1. Precession ψ about vertical fixed Z. 2. Nutation θ about intermediate y'. 3. Spin φ about body symmetry z''."
                },
                {
                    stepNum: 2,
                    action: "Assemble Body-Fixed Angular Velocity",
                    detail: "ω_x = -ψ_dot sin(θ) cos(φ) + θ_dot sin(φ)\nω_y = ψ_dot sin(θ) sin(φ) + θ_dot cos(φ)\nω_z = ψ_dot cos(θ) + φ_dot."
                },
                {
                    stepNum: 3,
                    action: "Detect Gimbal Lock Singularity",
                    detail: "Check if sin(θ) = 0 (θ = 0° or 180°). If so, precession and spin axes align, locking out 1 degree of freedom!"
                }
            ]
        }
    ],

    problems: [
        {
            id: "asg1-q1",
            category: "Assignment 1",
            title: "Q1. BC Coal Mining Units vs. SI Conversion & Gravity",
            source: "MECH 342 Assignment 1, Question 1",
            description: "A coalition of engineers in SE British Columbia reject SI units and define a new unit system: Buckets (1 bk = 15 kip), Trips (1 tr = 40 m), and hits (1 ht = 3 s). A belt tension of 6.5 bk accelerates an ore pile at 4 tr/ht². Find mass in wacky units, mass in kg, and g in wacky units.",
            given: [
                "1 bk = 15 kip (force)",
                "1 tr = 40 m (length)",
                "1 ht = 3 s (time)",
                "F = 6.5 bk",
                "a = 4.0 tr/ht²"
            ],
            interactiveType: "asg1-q1",
            defaultInputs: { F: 6.5, a: 4.0 },
            steps: [
                {
                    title: "Part (a): Mass in terms of wacky units",
                    content: "Apply Newton's Second Law: $F = m a \\implies m = \\frac{F}{a} = \\frac{6.5\\text{ bk}}{4.0\\text{ tr/ht}^2} = 1.625\\text{ }\\frac{\\text{bk}\\cdot\\text{ht}^2}{\\text{tr}}$."
                },
                {
                    title: "Part (b): Mass converted to SI (kg)",
                    content: "Using conversion factors: $1\\text{ kip} = 4.44\\times 10^3\\text{ N}$, $1\\text{ bk} = 15\\times 4.44\\times 10^3\\text{ N} = 6.66\\times 10^4\\text{ N}$.<br>" +
                             "Conversion factor for unit mass:<br>" +
                             "$$1\\text{ }\\frac{\\text{bk}\\cdot\\text{ht}^2}{\\text{tr}} = \\frac{(6.66\\times 10^4\\text{ N})(3^2\\text{ s}^2)}{40\\text{ m}} = 14,985\\text{ kg}$$<br>" +
                             "Therefore: $m = 1.625 \\times 14,985\\text{ kg} = \\mathbf{24.35\\times 10^3\\text{ kg}}$ (or $24,350\\text{ kg}$)."
                },
                {
                    title: "Part (c): Value of acceleration due to gravity in wacky units",
                    content: "Convert $g = 9.81\\text{ m/s}^2$:<br>" +
                             "$$1\\text{ m/s}^2 = \\frac{1\\text{ tr}}{40\\text{ m}} \\times \\frac{3^2\\text{ s}^2}{1\\text{ ht}^2} = \\frac{9}{40}\\text{ tr/ht}^2$$<br>" +
                             "$$g = 9.81 \\times \\frac{9}{40} = \\mathbf{2.207\\text{ tr/ht}^2}$$."
                }
            ],
            keyTakeaway: "Mass is always a constant of proportionality relating force to acceleration ($m = F/a$). In any coherent or incoherent unit system, dimensional homogeneity $F = m a$ dictates the derived mass unit!"
        },
        {
            id: "asg1-q2",
            category: "Assignment 1",
            title: "Q2. 3D Bracket Rotation about Skew Axis (Bearings A & D)",
            source: "MECH 342 Assignment 1, Question 2",
            description: "Bearings A and D are aligned along a skew shaft B->C. In reference configuration (φ = 0°), point P is at [50, 250, 0]^T mm in stationary frame XYZ. Find position of P when bracket rotates by φ = -37° about the shaft.",
            given: [
                "r_P(0) = [50, 250, 0]^T mm in XYZ",
                "Shaft vector offsets: ΔX = -100 mm, ΔY = 250 mm, ΔZ = -200 mm",
                "Rotation angle: φ = -37°"
            ],
            interactiveType: "asg1-q2",
            defaultInputs: { phiDeg: 37 },
            steps: [
                {
                    title: "Step 1: Determine Alignment Angles to Coordinate Axis",
                    content: "To rotate about the skew shaft B->C, align the shaft with the +Y axis using two successive canonical rotations:<br>" +
                             "$$\\alpha = \\text{atan2}(-100, 250) = -21.8014^\\circ$$ (rotation about Z)<br>" +
                             "$$\\beta = \\text{atan2}(-200, \\sqrt{100^2 + 250^2}) = -36.6043^\\circ$$ (rotation about X)"
                },
                {
                    title: "Step 2: Construct the Similarity Rotation Matrix Product",
                    content: "Align shaft to Y, perform rotation $[R_Y(\\phi)]$, then transform back:<br>" +
                             "$$[R] = [R_Z(\\alpha)]^T [R_X(\\beta)]^T [R_Y(\\phi)] [R_X(\\beta)] [R_Z(\\alpha)]$$"
                },
                {
                    title: "Step 3: Multiply by Initial Position Vector",
                    content: "$$[r_P]_{XYZ} = [R] \\begin{bmatrix} 50 \\\\ 250 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} \\mathbf{119.353} \\\\ \\mathbf{207.446} \\\\ \\mathbf{87.869} \\end{bmatrix}\\text{ mm}$$"
                }
            ],
            keyTakeaway: "Arbitrary axis rotation is always an orthonormal similarity transformation: align skew axis with a canonical axis, apply 1D rotation, and reverse alignment!"
        },
        {
            id: "asg1-q3",
            category: "Assignment 1",
            title: "Q3. Bent Rod Successive Rotations (AC then AB)",
            source: "MECH 342 Assignment 1, Question 3",
            description: "A bent rod in the XY plane is given a pair of rotations: first 30° about segment AC (which is 65° clockwise from X), then 60° about segment AB (aligned with X). Determine the entries of the rotation matrix transforming XYZ to body-fixed xyz.",
            given: [
                "Segment AC is 65° clockwise from X",
                "First rotation: 30° about AC",
                "Second rotation: 60° about AB"
            ],
            interactiveType: "asg1-q3",
            defaultInputs: {},
            steps: [
                {
                    title: "Step 1: First Rotation about Segment AC",
                    content: "Align temporary frame $x''y''z''$ with AC by rotating by $-65^\\circ$ about Z: $[R_z(-65^\\circ)]$.<br>" +
                             "The $30^\\circ$ rotation about AC is now a simple rotation about $x''$: $[R_x(30^\\circ)]$.<br>" +
                             "Transforming back to the intermediate frame $x'y'z'$: $[R_1] = [R_z(-65^\\circ)]^T [R_x(30^\\circ)] [R_z(-65^\\circ)]$."
                },
                {
                    title: "Step 2: Second Rotation about Segment AB",
                    content: "Since the $x'$-axis is aligned with AB, the second rotation is simply $[R_x(60^\\circ)]$.<br>" +
                             "By body-fixed pre-multiplication rule: $[x, y, z]^T = [R_x(60^\\circ)] [x', y', z']^T$."
                },
                {
                    title: "Step 3: Total Transformation Matrix",
                    content: "$$[R] = [R_x(60^\\circ)] [R_z(-65^\\circ)]^T [R_x(30^\\circ)] [R_z(-65^\\circ)]$$"
                }
            ],
            keyTakeaway: "Mastering alignment frames: when an axis doesn't lie along a Cartesian axis, temporarily rotate into it, perform the canonical rotation, and rotate back!"
        },
        {
            id: "asg1-q4",
            category: "Assignment 1",
            title: "Q4. Two-Bar Spatial Mechanism Displacement (Bars ABC & CD)",
            source: "MECH 342 Assignment 1, Question 4",
            description: "Bar ABC rotates by θ about fixed X, and collar C allows bar CD to rotate by φ about BC. In reference configuration (θ=φ=0), both bars lie in XY plane. Find displacement of end D to configuration φ = -70°, θ = 120°.",
            given: [
                "r_B/A = 400 i' mm",
                "r_C/B = -400 cos(50°) i' + 400 sin(50°) j' mm",
                "r_D/C = [0, -200, 0]^T mm in collar frame",
                "Final angles: θ = 120°, φ = -70°"
            ],
            interactiveType: "asg1-q4",
            defaultInputs: { thetaDeg: 120, phiDeg: -70 },
            steps: [
                {
                    title: "Step 1: Reference and Final Position of Point C",
                    content: "Initial position: $[r_C]_{XYZ} = [142.885, 306.418, 0]^T\\text{ mm}$.<br>" +
                             "Rotated by $\\theta = 120^\\circ$ about fixed X: $[r_C]_{XYZ,f} = [R_x(120^\\circ)]^T [r_C]_{XYZ,0} = [142.885, -153.209, 265.366]^T\\text{ mm}$.<br>" +
                             "Displacement: $\\Delta\\vec{r}_C = [0, -459.627, 265.366]^T\\text{ mm}$."
                },
                {
                    title: "Step 2: Position of D Relative to C",
                    content: "Body-fixed sequence for bar CD: $[R] = [R_x(\\phi)] [R_z(-50^\\circ)] [R_x(\\theta)]$.<br>" +
                             "To express relative vector in fixed XYZ: $[r_{D/C}]_{XYZ} = [R_x(\\theta)]^T [R_z(-50^\\circ)]^T [R_x(\\phi)]^T [r_{D/C}]_{xyz}$.<br>" +
                             "Initial ($\\theta=0, \\phi=0$): $[r_{D/C,0}] = [-153.209, -128.558, 0]^T\\text{ mm} \\implies [r_{D,0}] = [-10.324, 177.860, 0]^T\\text{ mm}$.<br>" +
                             "Final ($\\theta=120^\\circ, \\phi=-70^\\circ$): $[r_{D/C,f}] = [-52.401, -140.775, -132.048]^T\\text{ mm} \\implies [r_{D,f}] = [90.484, -293.984, 133.318]^T\\text{ mm}$."
                },
                {
                    title: "Step 3: Absolute Displacement of Point D",
                    content: "$$\\Delta\\vec{r}_D = \\vec{r}_{D,f} - \\vec{r}_{D,0} = \\mathbf{100.8\\vec{I} - 471.8\\vec{J} + 133.3\\vec{K}\\text{ mm}}$$"
                }
            ],
            keyTakeaway: "Kinematic vector chains: $\\vec{r}_D = \\vec{r}_C + \\vec{r}_{D/C}$. Transform each link's relative displacement using its own accumulated rotation matrix!"
        },
        {
            id: "tut1-q1",
            category: "Tutorial 1",
            title: "T1.1 Rectangular Plate Braced by Cable BC & Moments",
            source: "MECH 342 Tutorial 1, Problem 1",
            description: "A 4m x 3m rectangular plate is fastened at corner A to an inclined vertical shaft (75° to plate) and braced by cable BC with tension 5 kN. Find: (a) force components in plate frame, (b) moment about corner A, and (c) moment about the shaft axis.",
            given: [
                "Plate dimensions: 4 m x 3 m",
                "Cable tension: T = 5000 N",
                "Shaft angle: 75° to plate edge",
                "r_B/A = 4 j m",
                "r_C/A = 2 i + 2(cos 75° j + sin 75° k) m"
            ],
            interactiveType: "tut1-q1",
            defaultInputs: { T: 5000 },
            steps: [
                {
                    title: "Step 1: Cable Position Vector & Unit Vector e_C/B",
                    content: "$\\vec{r}_{C/B} = \\vec{r}_{C/A} - \\vec{r}_{B/A} = 2\\vec{i} + (2\\cos 75^\\circ - 4)\\vec{j} + 2\\sin 75^\\circ\\vec{k} = 2\\vec{i} - 3.482\\vec{j} + 1.932\\vec{k}\\text{ m}$.<br>" +
                             "Length $|\\vec{r}_{C/B}| = \\sqrt{2^2 + (-3.482)^2 + 1.932^2} = 4.456\\text{ m}$.<br>" +
                             "Unit vector: $\\vec{e}_{C/B} = \\mathbf{0.6017\\vec{i} - 0.6984\\vec{j} + 0.3875\\vec{k}}$."
                },
                {
                    title: "Step 2: Cable Force Vector",
                    content: "$$\\vec{F} = 5000\\vec{e}_{C/B} = \\mathbf{3009\\vec{i} - 3492\\vec{j} + 1937\\vec{k}\\text{ N}}$$"
                },
                {
                    title: "Step 3: Moment of Force about Corner A",
                    content: "$$\\vec{M}_A = \\vec{r}_{B/A} \\times \\vec{F} = (4\\vec{j}) \\times (3009\\vec{i} - 3492\\vec{j} + 1937\\vec{k}) = \\mathbf{7749\\vec{i} - 12034\\vec{k}\\text{ N}\\cdot\\text{m}}$$"
                },
                {
                    title: "Step 4: Moment about the Shaft Axis",
                    content: "Shaft unit vector: $\\vec{e}_{shaft} = \\cos 75^\\circ\\vec{j} + \\sin 75^\\circ\\vec{k}$.<br>" +
                             "Projecting moment onto shaft axis:<br>" +
                             "$$M_{shaft} = \\vec{M}_A \\cdot \\vec{e}_{shaft} = (7749\\vec{i} - 12034\\vec{k}) \\cdot (0\\vec{i} + \\cos 75^\\circ\\vec{j} + \\sin 75^\\circ\\vec{k}) = -12034\\sin 75^\\circ = \\mathbf{-11624\\text{ N}\\cdot\\text{m}}$$"
                }
            ],
            keyTakeaway: "Moment about an arbitrary line: calculate moment vector about any point on the line ($\\vec{M}_A = \\vec{r} \\times \\vec{F}$), then take scalar projection with the line's unit vector ($M_{line} = \\vec{M}_A \\cdot \\vec{e}_{line}$)!"
        },
        {
            id: "tut3-q1",
            category: "Tutorial 3",
            title: "T3.1 Rotating Shaft with Bar Sliding on Rising Table",
            source: "MECH 342 Tutorial 3, Problem 1",
            description: "Vertical shaft rotates at constant rate Ω. Pin A has constant height. Bar AB of length L has end B sliding on a base table translating upward at constant speed u. Describe velocity and acceleration of B as a function of elevation angle θ.",
            given: [
                "Shaft rotation rate: Ω = const",
                "Table vertical speed: z_dot = -u = const (u upward)",
                "Bar length: L = const",
                "Cylindrical coordinate setup with origin at pin A"
            ],
            interactiveType: "tut3-q1",
            defaultInputs: { L: 1.0, Omega: 2.0, u: 0.5, thetaDeg: 45 },
            steps: [
                {
                    title: "Step 1: Constraint Equation & Angle Rates",
                    content: "Measure z downward from pin A: $z = L\\cos\\theta$.<br>" +
                             "Differentiating w.r.t. time: $\\dot{z} = -u = -L\\dot{\\theta}\\sin\\theta \\implies \\mathbf{\\dot{\\theta} = \\frac{u}{L\\sin\\theta}}$.<br>" +
                             "Second derivative: $\\ddot{z} = 0 = -L\\ddot{\\theta}\\sin\\theta - L\\dot{\\theta}^2\\cos\\theta \\implies \\mathbf{\\ddot{\\theta} = -\\frac{u^2\\cos\\theta}{L^2\\sin^3\\theta}}$."
                },
                {
                    title: "Step 2: Cylindrical Coordinates & Derivatives",
                    content: "$$R = L\\sin\\theta$$<br>" +
                             "$$\\dot{R} = L\\dot{\\theta}\\cos\\theta = L\\left(\\frac{u}{L\\sin\\theta}\\right)\\cos\\theta = u\\cot\\theta$$<br>" +
                             "$$\\ddot{R} = L\\ddot{\\theta}\\cos\\theta - L\\dot{\\theta}^2\\sin\\theta = -\\frac{u^2}{L\\sin^3\\theta}$$"
                },
                {
                    title: "Step 3: Velocity of End B",
                    content: "$$\\vec{v} = \\dot{R}\\vec{e}_R + R\\Omega\\vec{e}_\\theta + \\dot{z}\\vec{e}_z = \\mathbf{[u\\cot\\theta]\\vec{e}_R + [L\\Omega\\sin\\theta]\\vec{e}_\\theta - u\\vec{e}_z}$$"
                },
                {
                    title: "Step 4: Acceleration of End B",
                    content: "$$\\vec{a} = (\\ddot{R} - R\\Omega^2)\\vec{e}_R + (2\\dot{R}\\Omega)\\vec{e}_\\theta + \\ddot{z}\\vec{e}_z = \\mathbf{-\\left[\\frac{u^2}{L\\sin^3\\theta} + L\\Omega^2\\sin\\theta\\right]\\vec{e}_R + [2u\\Omega\\cot\\theta]\\vec{e}_\\theta + 0\\vec{e}_z}$$"
                }
            ],
            keyTakeaway: "Kinematic constraints: always differentiate the geometric constraint equation first ($z = L\\cos\\theta$) to express parameter rates $(\\dot{\\theta}, \\ddot{\\theta})$ before assembling coordinate acceleration!"
        },
        {
            id: "tut3-q2",
            category: "Tutorial 3",
            title: "T3.2 Block Sliding in Cone: Spherical vs. Cylindrical Formulation",
            source: "MECH 342 Tutorial 3, Problem 2",
            description: "A small block slides inside a cone with apex semi-angle β = 53.13°. Angular momentum is conserved: R² θ_dot = 5 m²/s. Vertical motion is observed: z = 0.99 - 3t² m. Determine velocity and acceleration at z = 0.24 m using BOTH Spherical and Cylindrical coordinates and compare.",
            given: [
                "Apex semi-angle: β = 53.13° (tan β = 4/3, cos β = 0.6, sin β = 0.8)",
                "Angular momentum: R² θ_dot = 5 m²/s",
                "Vertical position: z = 0.99 - 3t² m",
                "Instant of interest: z = 0.24 m => t = 0.5 s, z_dot = -3 m/s, z_ddot = -6 m/s²"
            ],
            interactiveType: "tut3-q2",
            defaultInputs: { betaDeg: 53.13, z: 0.24 },
            steps: [
                {
                    title: "Step 1: Kinematic Instant at z = 0.24 m",
                    content: "$0.24 = 0.99 - 3t^2 \\implies 3t^2 = 0.75 \\implies t = 0.5\\text{ s}$.<br>" +
                             "$\\dot{z} = -6t = -3\\text{ m/s}, \\quad \\ddot{z} = -6\\text{ m/s}^2$."
                },
                {
                    title: "Step 2: Spherical Formulation (r, φ, θ)",
                    content: "On cone surface, $\\phi = \\beta = 53.13^\\circ = \\text{const} \\implies \\dot{\\phi} = \\ddot{\\phi} = 0$.<br>" +
                             "$r = \\frac{z}{\\cos\\beta} = \\frac{0.24}{0.6} = 0.4\\text{ m}, \\quad \\dot{r} = \\frac{-3}{0.6} = -5\\text{ m/s}, \\quad \\ddot{r} = \\frac{-6}{0.6} = -10\\text{ m/s}^2$.<br>" +
                             "$\\dot{\\theta} = \\frac{5}{R^2} = \\frac{5}{(r\\sin\\beta)^2} = \\frac{5}{(0.4\\times 0.8)^2} = 48.828\\text{ rad/s}$.<br>" +
                             "Velocity: $\\vec{v} = \\mathbf{-5\\vec{e}_r + 15.625\\vec{e}_\\theta\\text{ m/s}}$.<br>" +
                             "Acceleration: $\\vec{a} = \\mathbf{-525.89\\vec{e}_r - 386.92\\vec{e}_\\phi\\text{ m/s}^2}$."
                },
                {
                    title: "Step 3: Cylindrical Formulation (R, θ, z)",
                    content: "$R = z\\tan\\beta = 0.24(4/3) = 0.32\\text{ m}, \\quad \\dot{R} = -3(4/3) = -4\\text{ m/s}, \\quad \\ddot{R} = -6(4/3) = -8\\text{ m/s}^2$.<br>" +
                             "Velocity: $\\vec{v} = \\mathbf{-4\\vec{e}_R + 15.625\\vec{e}_\\theta - 3\\vec{e}_z\\text{ m/s}}$.<br>" +
                             "Acceleration: $\\vec{a} = \\mathbf{-770.94\\vec{e}_R + 0\\vec{e}_\\theta - 6\\vec{e}_z\\text{ m/s}^2}$."
                },
                {
                    title: "Step 4: Discussion of Merits & Direct Equivalence",
                    content: "Notice that in Spherical, $\\phi = \\text{const}$ reduces the system to 2 moving coordinates ($r, \\theta$). However, the acceleration vector has a component along $\\vec{e}_\\phi$ due to centripetal effect ($-\\frac{1}{2}r\\sin(2\\beta)\\dot{\\theta}^2$).<br>" +
                             "In Cylindrical, the radial acceleration is directly along the horizontal plane. Transforming $\\vec{a}_{cyl}$ using $\\vec{e}_R = \\sin\\beta\\vec{e}_r + \\cos\\beta\\vec{e}_\\phi$ and $\\vec{e}_z = \\cos\\beta\\vec{e}_r - \\sin\\beta\\vec{e}_\\phi$ yields <strong>exact mathematical identity</strong>: $|\\vec{a}| = 652.89\\text{ m/s}^2$!"
                }
            ],
            keyTakeaway: "Coordinate freedom: Physical vectors exist independent of coordinates. Choosing Spherical eliminates $\\dot{\\phi}$, while choosing Cylindrical aligns directly with gravity along $\\vec{e}_z$!"
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MECH342_EXAM_BANK;
}
