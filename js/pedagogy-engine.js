/**
 * UVic MECH 342 - Advanced Dynamics Studio
 * Pedagogy Engine: Evidence-Based Learning & Teaching Interventions
 * 
 * Implements:
 * 1. Predict-Observe-Explain (POE) Active Inquiry Cycles (White & Gunstone, Chi)
 * 2. Learning from Erroneous Examples / "Spot-the-Exam-Trap" Bug Hunt (Große & Renkl)
 * 3. Term-by-Term "X-Ray Formula Inspector" for Cognitive Load Reduction (Mayer, Sweller)
 * 4. Coordinate Rosetta Stone: Multi-Representational Fluency across Coordinates
 * 5. Metacognitive Calibration & Exam Readiness Analytics (Bjork, Roediger)
 */

window.PedagogyEngine = {
    // ==========================================
    // 1. PREDICT-OBSERVE-EXPLAIN (POE) CYCLES
    // ==========================================
    poeChallenges: [
        {
            id: 'poe-comm',
            title: 'POE Challenge #1: Non-Commutativity of 3D Rotations',
            topic: 'Lecture 3 & Ginsberg §2.1.3',
            simId: 'sim-comm',
            scenario: 'You hold a book flat on a table (face up, top pointing North). You perform two sequential 90° rotations: First 90° about local X (pitch up), then 90° about local Y (yaw right). Next, you reset and reverse the order: First 90° about local Y, then 90° about local X.',
            question: 'Will the book end up in the exact same spatial orientation in both cases?',
            predictionOptions: [
                { id: 'p1', text: 'Yes: Since 2 × 3 = 3 × 2, geometric rotations are commutative regardless of dimension.', correct: false, feedback: 'Common intuitive fallacy! Vector additions commute in 1D and 2D, but 3D finite rotations alter the very axes around which subsequent rotations occur!' },
                { id: 'p2', text: 'No: Finite 3D rotations do NOT commute. The final orientations will be completely different!', correct: true, feedback: 'Correct intuition! In matrix mathematics, [R_A][R_B] ≠ [R_B][R_A]. The order of operations fundamentally determines spatial orientation.' },
                { id: 'p3', text: 'Only if the rotation angles are both exactly 180°.', correct: false, feedback: 'While 180° rotations have special symmetry properties, in general finite 3D rotations remain non-commutative.' }
            ],
            observationGoal: 'Watch the 3D duel in Lab 4: Notice how Frame A and Frame B end up in completely distinct orientations.',
            explanation: 'Finite rotations cannot be treated as vectors because vector addition is commutative ($A + B = B + A$), whereas finite matrix multiplication is non-commutative ($[R_1][R_2] \\neq [R_2][R_1]$). However, when angles become infinitesimal ($d\\theta \\to 0$), higher-order terms $d\\theta_1 d\\theta_2$ vanish, and rotations become commutative: $d\\vec{\\theta}_1 + d\\vec{\\theta}_2 = d\\vec{\\theta}_2 + d\\vec{\\theta}_1$!'
        },
        {
            id: 'poe-binormal',
            title: 'POE Challenge #2: The Zero Binormal Acceleration Theorem',
            topic: 'Lecture 5 & Ginsberg §2.3.1',
            simId: 'sim-lec5',
            scenario: 'A roller coaster car traverses an arbitrary, highly twisting 3D helical space curve with velocity $\\vec{v}$ and acceleration $\\vec{a}$. The Frenet-Serret triad $(\\vec{e}_t, \\vec{e}_n, \\vec{e}_b)$ moves along with the car.',
            question: 'What is the component of total physical acceleration along the binormal axis $\\vec{e}_b$ ($a_b = \\vec{a} \\cdot \\vec{e}_b$)?',
            predictionOptions: [
                { id: 'p1', text: 'It depends on the torsion τ of the 3D curve: a_b = v² · τ.', correct: false, feedback: 'A classic exam trap! Torsion τ governs how the osculating plane rotates in space, NOT the particle’s instantaneous acceleration.' },
                { id: 'p2', text: 'It is identically ZERO (a_b ≡ 0) at every single instant along ANY smooth 3D curve!', correct: true, feedback: 'Spot on! By definition of the osculating plane, the particle’s instantaneous velocity and acceleration span that plane entirely, leaving zero projection along the binormal normal vector!' },
                { id: 'p3', text: 'It equals the Coriolis acceleration 2ω × v.', correct: false, feedback: 'Path variables are intrinsic coordinates defined by the curve itself, not by rotating reference frames!' }
            ],
            observationGoal: 'Observe the osculating plane in Lab 10: Notice both the velocity vector (blue) and acceleration vector (green) lie completely flat inside the semi-transparent osculating plane sheet.',
            explanation: 'Since velocity is tangent to the curve, $\\vec{v} = v\\vec{e}_t$. Differentiating gives $\\vec{a} = \\dot{v}\\vec{e}_t + v\\dot{\\vec{e}}_t$. By the Frenet-Serret formulas, $\\dot{\\vec{e}}_t = \\frac{v}{\\rho}\\vec{e}_n$. Thus, $\\vec{a} = \\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n + 0\\vec{e}_b$. Because $\\vec{e}_b = \\vec{e}_t \\times \\vec{e}_n$ is orthogonal to both $\\vec{e}_t$ and $\\vec{e}_n$, $a_b \\equiv 0$ always!'
        },
        {
            id: 'poe-coriolis',
            title: 'POE Challenge #3: The Origin of the Factor of 2 in Coriolis Acceleration',
            topic: 'Lecture 4 & Ginsberg §2.2',
            simId: 'sim-lec4',
            scenario: 'A collar slides radially outward along a rotating rod at constant speed $\\dot{R} = 2\\text{ m/s}$, while the rod rotates at constant angular speed $\\dot{\\theta} = 3\\text{ rad/s}$. Why does the Coriolis acceleration formula have a factor of 2: $a_{cor} = 2\\dot{R}\\dot{\\theta}$?',
            predictionOptions: [
                { id: 'p1', text: 'It is a mathematical artifact of integrating a triangular velocity profile.', correct: false, feedback: 'Not an artifact! It is the exact sum of two distinct physical phenomena occurring simultaneously.' },
                { id: 'p2', text: 'One factor comes from the rotating radial velocity vector, and the second comes from the collar moving to larger circumferences where tangential speed is higher.', correct: true, feedback: 'Exact physical insight! Part 1 is the changing direction of radial speed: d(e_R)/dt = θ̇ e_θ. Part 2 is the change in tangential speed v_θ = R θ̇ as radius grows: (dR/dt) θ̇ = Ṙ θ̇!' },
                { id: 'p3', text: 'Because of action-reaction: one term for the collar and one for the rod.', correct: false, feedback: 'Kinematics describes motion purely without forces; Newton’s third law is kinetics.' }
            ],
            observationGoal: 'In Lab 9, observe how both changing radius R and changing angle θ combine to rapidly swing the total tangential velocity.',
            explanation: 'Differentiating the velocity $\\vec{v} = \\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta$ gives: $\\frac{d}{dt}(\\dot{R}\\vec{e}_R) = \\ddot{R}\\vec{e}_R + \\dot{R}\\dot{\\vec{e}}_R = \\ddot{R}\\vec{e}_R + \\dot{R}(\\dot{\\theta}\\vec{e}_\\theta)$. Next, $\\frac{d}{dt}(R\\dot{\\theta}\\vec{e}_\\theta) = \\dot{R}\\dot{\\theta}\\vec{e}_\\theta + R\\ddot{\\theta}\\vec{e}_\\theta + R\\dot{\\theta}(-\\dot{\\theta}\\vec{e}_R)$. Combining the two identical terms $\\dot{R}\\dot{\\theta}\\vec{e}_\\theta + \\dot{R}\\dot{\\theta}\\vec{e}_\\theta$ yields $2\\dot{R}\\dot{\\theta}\\vec{e}_\\theta$!'
        },
        {
            id: 'poe-gimbal-lock',
            title: 'POE Challenge #4: The Geometry of Gimbal Lock Singularity',
            topic: 'Lecture 7 & Ginsberg §4.2.3',
            simId: 'sim-lec7',
            scenario: 'A gyro mounted on a Ginsberg Z-Y-Z gimbal platform has Precession $\\psi$ about fixed $Z$, Nutation $\\theta$ about intermediate $y\'$, and Spin $\\phi$ about body $z\'\'$. The nutation angle is rotated to $\\theta = 0^\\circ$ (or $180^\\circ$).',
            question: 'What happens to the rotational degrees of freedom of the body?',
            predictionOptions: [
                { id: 'p1', text: 'Nothing happens physically; all 3 rotational axes remain completely independent.', correct: false, feedback: 'In 3D rotation, when the nutation angle reaches 0, the first rotation axis Z and the third rotation axis z\'\' become colinear!' },
                { id: 'p2', text: 'Gimbal Lock occurs: The Precession axis Z and Spin axis z\'\' align, losing one rotational degree of freedom, and inverse angle formulas divide by zero.', correct: true, feedback: 'Spot on! At θ = 0°, changes in ψ and φ rotate about the EXACT same physical line, causing the transformation matrix determinant to lose rank.' },
                { id: 'p3', text: 'The gimbal mechanism experiences an infinite physical torque and jams mechanically.', correct: false, feedback: 'In a frictionless virtual model or real aircraft gyro, the bearings still spin smoothly, but the mathematical orientation tracking becomes singular because it cannot distinguish between precession and spin!' }
            ],
            observationGoal: 'In Lab 12, click "Trigger Gimbal Lock" to see the outer and inner gimbal rings snap into alignment, flashing the Singularity Alert banner.',
            explanation: 'The Ginsberg body angular velocity is $\\vec{\\omega} = (\\dot{\\psi}\\sin\\theta\\sin\\phi + \\dot{\\theta}\\cos\\phi)\\vec{i} + (\\dot{\\psi}\\sin\\theta\\cos\\phi - \\dot{\\theta}\\sin\\phi)\\vec{j} + (\\dot{\\psi}\\cos\\theta + \\dot{\\phi})\\vec{k}$. When $\\theta = 0$, the $x$ and $y$ components lose $\\dot{\\psi}$ entirely because $\\sin 0 = 0$, and the $z$ component becomes $\\dot{\\psi} + \\dot{\\phi}$. The system can only measure the sum $(\\dot{\\psi} + \\dot{\\phi})$, not either angle individually!'
        },
        {
            id: 'poe-transport',
            title: 'POE Challenge #5: The Angular Acceleration Invariance Paradox',
            topic: 'Lecture 6 & Ginsberg §3.3',
            simId: 'sim-lec6',
            scenario: 'For any arbitrary vector $\\vec{A}$, the Transport Theorem states $\\left(\\frac{d\\vec{A}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{A}}{dt}\\right)_{xyz} + \\vec{\\omega} \\times \\vec{A}$. Suppose we apply this to the angular velocity vector itself: $\\vec{A} = \\vec{\\omega}$.',
            question: 'Is the absolute angular acceleration $\\vec{\\alpha} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ}$ different from the moving frame derivative $\\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{xyz}$?',
            predictionOptions: [
                { id: 'p1', text: 'Yes, they differ by ω × ω which produces a non-zero gyroscopic acceleration.', correct: false, feedback: 'Recall the vector cross product property: ANY vector crossed with itself is IDENTICALLY zero: ω × ω = 0!' },
                { id: 'p2', text: 'No, they are IDENTICAL: (dω/dt)_XYZ ≡ (dω/dt)_xyz because ω × ω ≡ 0!', correct: true, feedback: 'Master-level insight! This is Ginsberg’s Invariance Theorem for Angular Acceleration: α̇ has the exact same value whether differentiated in the fixed or rotating frame!' },
                { id: 'p3', text: 'They only match if the rotating reference frame has zero angular acceleration.', correct: false, feedback: 'It holds universally for all reference frames and all motions!' }
            ],
            observationGoal: 'In Lab 11, note how the rotation vector of the turntable points purely along its axis, and its cross product with itself vanishes.',
            explanation: 'Substitute $\\vec{A} = \\vec{\\omega}$ into the Transport Theorem: $\\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{xyz} + \\vec{\\omega} \\times \\vec{\\omega}$. Since the cross product of any parallel vectors is identically zero, $\\vec{\\omega}\\times\\vec{\\omega} = \\vec{0}$, we obtain the fundamental theorem: $\\vec{\\alpha} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{\\omega}}{dt}\\right)_{xyz}$. You can differentiate $\\vec{\\omega}$ in WHICHEVER frame has simpler components!'
        }
    ],

    // ==========================================
    // 2. "SPOT-THE-EXAM-TRAP" BUG HUNT
    // ==========================================
    bugHuntChallenges: [
        {
            id: 'bug-1',
            title: 'Exam Trap #1: Matrix Multiplication Order for Follower Frames',
            problemStatement: 'A robotic arm rotates first by angle $\\psi = 30^\\circ$ about fixed $Z$-axis, and then rotates by angle $\\theta = 45^\\circ$ about the CURRENT (body-fixed) $y\'-axis$. A student computes the transformation matrix from base $XYZ$ to end-effector $x\'y\'z\'$.',
            studentSolution: [
                { stepNum: 1, text: 'Rotation 1 is about $Z$: $[R_1] = [R_z(\\psi)]$', isError: false },
                { stepNum: 2, text: 'Rotation 2 is about current $y\'$: $[R_2] = [R_y(\\theta)]$', isError: false },
                { stepNum: 3, text: 'Because Rotation 2 happened second, the student writes: $[R] = [R_2][R_1] = [R_y(\\theta)][R_z(\\psi)]$', isError: true, 
                  correction: 'FATAL EXAM ERROR! For body-fixed (follower) axis rotations, transformation matrices POST-MULTIPLY: $[R] = [R_1][R_2\'] = [R_z(\\psi)][R_y(\\theta)]$. Pre-multiplying is ONLY valid if the second rotation occurs about the FIXED spatial $Y$-axis!' },
                { stepNum: 4, text: 'Substitute angles: $[R] = [R_y(45^\\circ)][R_z(30^\\circ)]$', isError: false }
            ],
            takeaway: 'Rule of Thumb for Exams: Fixed axes = PRE-multiply ($[R] = [R_B][R_A]$). Body-fixed follower axes = POST-multiply ($[R] = [R_A][R_B\']$).'
        },
        {
            id: 'bug-2',
            title: 'Exam Trap #2: Omitting Moving Basis Derivatives in Relative Velocity',
            problemStatement: 'Point $Q$ moves on a turntable that rotates at $\\vec{\\omega} = \\dot{\\psi}\\vec{K}$. Position in rotating axes is $\\vec{r}_{Q/P} = x(t)\\vec{i} + y(t)\\vec{j}$. Find absolute velocity $\\vec{v}_{Q/P}$.',
            studentSolution: [
                { stepNum: 1, text: 'Position vector in rotating frame: $\\vec{r}_{Q/P} = x\\vec{i} + y\\vec{j}$', isError: false },
                { stepNum: 2, text: 'Differentiating with respect to time gives: $\\frac{d\\vec{r}_{Q/P}}{dt} = \\dot{x}\\vec{i} + \\dot{y}\\vec{j}$', isError: true,
                  correction: 'ZERO CREDIT! The unit basis vectors $\\vec{i}$ and $\\vec{j}$ are rotating with angular velocity $\\vec{\\omega}$. By the product rule, you MUST differentiate the basis vectors: $\\frac{d}{dt}(x\\vec{i}) = \\dot{x}\\vec{i} + x\\dot{\\vec{i}} = \\dot{x}\\vec{i} + x(\\vec{\\omega}\\times\\vec{i})$. Dropping this term completely ignores the rotational velocity!' },
                { stepNum: 3, text: 'Substitute coordinates to find absolute velocity.', isError: false }
            ],
            takeaway: 'Never treat moving basis vectors as constants. Differentiating $\\vec{r} = x\\vec{i}$ always yields $\\dot{x}\\vec{i} + x(\\vec{\\omega}\\times\\vec{i})$.'
        },
        {
            id: 'bug-3',
            title: 'Exam Trap #3: Forgetting the Coriolis Factor of 2',
            problemStatement: 'In cylindrical coordinates $(R, \\theta, z)$, find the total acceleration vector for a particle with variable $R(t)$ and $\\theta(t)$.',
            studentSolution: [
                { stepNum: 1, text: 'Velocity is $\\vec{v} = \\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta + \\dot{z}\\vec{e}_z$', isError: false },
                { stepNum: 2, text: 'Radial acceleration has linear derivative and centripetal term: $a_R = \\ddot{R} - R\\dot{\\theta}^2$', isError: false },
                { stepNum: 3, text: 'Tangential acceleration has angular acceleration and radial rate: $a_\\theta = R\\ddot{\\theta} + \\dot{R}\\dot{\\theta}$', isError: true,
                  correction: 'MISSING FACTOR OF 2! The Coriolis acceleration term is $2\\dot{R}\\dot{\\theta}$, NOT $\\dot{R}\\dot{\\theta}$. One $\\dot{R}\\dot{\\theta}$ arises from differentiating $\\dot{R}\\vec{e}_R$ (since $\\dot{\\vec{e}}_R = \\dot{\\theta}\\vec{e}_\\theta$), and the second arises from differentiating $R\\dot{\\theta}\\vec{e}_\\theta$ via product rule on $R$. Total is $2\\dot{R}\\dot{\\theta}$!' },
                { stepNum: 4, text: 'Combine components: $\\vec{a} = a_R\\vec{e}_R + a_\\theta\\vec{e}_\\theta + \\ddot{z}\\vec{e}_z$', isError: false }
            ],
            takeaway: 'Always verify the factor of 2 in Coriolis: $2\\dot{R}\\dot{\\theta}$ in cylindrical, $2\\dot{r}\\dot{\\theta}\\sin\\phi$ in spherical, and $2\\vec{\\omega}\\times\\vec{v}_{rel}$ in transport theorem!'
        },
        {
            id: 'bug-4',
            title: 'Exam Trap #4: Assuming Non-Zero Binormal Acceleration in Frenet Triad',
            problemStatement: 'A particle moves on a 3D helix with radius $R = 2\\text{ m}$, pitch $p = 1\\text{ m}$, speed $v = 10\\text{ m/s}$, and tangential acceleration $\\dot{v} = 4\\text{ m/s}^2$. An exam problem asks for $a_b$, the component of acceleration along the binormal axis.',
            studentSolution: [
                { stepNum: 1, text: 'Compute tangent vector: $\\vec{e}_t = \\frac{\\vec{v}}{v}$ and tangential acceleration $a_t = \\dot{v} = 4\\text{ m/s}^2$', isError: false },
                { stepNum: 2, text: 'Compute curvature $\\kappa = \\frac{1}{\\rho}$ and normal acceleration $a_n = \\frac{v^2}{\\rho}$', isError: false },
                { stepNum: 3, text: 'Compute binormal acceleration using curve torsion $\\tau$: $a_b = v^2 \\tau$', isError: true,
                  correction: 'FUNDAMENTAL BLUNDER! By the Zero Binormal Acceleration Theorem, $a_b \\equiv 0$ ALWAYS! Torsion $\\tau$ governs how the binormal vector rotates ($\\dot{\\vec{e}}_b = -v\\tau\\vec{e}_n$), but physical acceleration has ZERO projection along $\\vec{e}_b$ on ANY curve in the universe!' },
                { stepNum: 4, text: 'Add components via Pythagorean theorem: $a = \\sqrt{a_t^2 + a_n^2 + a_b^2}$', isError: false }
            ],
            takeaway: 'Always remember: $\\vec{a} = \\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n + 0\\vec{e}_b$. If a question asks for binormal acceleration, write $a_b = 0$ immediately.'
        },
        {
            id: 'bug-5',
            title: 'Exam Trap #5: Differentiating Moving Angular Velocity Vectors Incorrectly',
            problemStatement: 'A gyro frame has angular velocity $\\vec{\\omega} = \\Omega\\vec{K} + \\omega_1\\vec{i}\'$, where $\\Omega$ and $\\omega_1$ are constant speeds, $\\vec{K}$ is fixed vertical, and $\\vec{i}\'$ is attached to an intermediate gimbal spinning about $\\vec{K}$. Find angular acceleration $\\vec{\\alpha}$.',
            studentSolution: [
                { stepNum: 1, text: 'Total angular velocity is the superposition: $\\vec{\\omega} = \\Omega\\vec{K} + \\omega_1\\vec{i}\'$', isError: false },
                { stepNum: 2, text: 'Because $\\Omega$ and $\\omega_1$ are constants, their derivatives are zero: $\\dot{\\Omega} = 0, \\dot{\\omega}_1 = 0$', isError: false },
                { stepNum: 3, text: 'Therefore, the angular acceleration is: $\\vec{\\alpha} = \\frac{d\\vec{\\omega}}{dt} = 0\\vec{K} + 0\\vec{i}\' = \\vec{0}$', isError: true,
                  correction: 'DISASTROUS ERROR! Even though $\\omega_1$ is constant in magnitude, the gimbal axis $\\vec{i}\'$ is rotating with angular velocity $\\Omega\\vec{K}$! By Poisson’s formula, $\\frac{d\\vec{i}\'}{dt} = (\\Omega\\vec{K})\\times\\vec{i}\' = \\Omega\\vec{j}\'$. Therefore, $\\vec{\\alpha} = \\omega_1(\\Omega\\vec{j}\') \\neq \\vec{0}$! This is the fundamental source of gyroscopic torque!' },
                { stepNum: 4, text: 'Conclude gyroscopic moment is zero.', isError: false }
            ],
            takeaway: 'When differentiating $\\vec{\\omega} = \\omega_A\\vec{e}_A + \\omega_B\\vec{e}_B$, moving unit vectors have time rates of change: $\\dot{\\vec{e}}_B = \\vec{\\omega}_{frame} \\times \\vec{e}_B$.'
        }
    ],

    // ==========================================
    // 3. TERM-BY-TERM "X-RAY FORMULA INSPECTOR"
    // ==========================================
    formulaXRayBank: {
        'cylindrical-accel': {
            title: 'Cylindrical Acceleration Formula X-Ray',
            latexMaster: '\\vec{a} = (\\ddot{R} - R\\dot{\\theta}^2)\\vec{e}_R + (R\\ddot{\\theta} + 2\\dot{R}\\dot{\\theta})\\vec{e}_\\theta + \\ddot{z}\\vec{e}_z',
            terms: [
                {
                    id: 'r-ddot',
                    symbol: '\\ddot{R}\\vec{e}_R',
                    name: 'Linear Radial Acceleration',
                    color: '#38bdf8',
                    meaning: 'Direct second time derivative of distance from origin. Represents speeding up or slowing down along the radial line.',
                    examTrap: 'Students often forget this term is 0 for circular motion ($R = \\text{const}$), but dominates for sliding collars or pistons.',
                    limitCase: 'If $R = \\text{const}$, $\\ddot{R} = 0$.'
                },
                {
                    id: 'centripetal',
                    symbol: '-R\\dot{\\theta}^2\\vec{e}_R',
                    name: 'Centripetal Acceleration',
                    color: '#f43f5e',
                    meaning: 'Inward directed acceleration caused by the continuous turning of the velocity direction vector toward the center of rotation.',
                    examTrap: 'The minus sign is critical! It points inward ($-\\vec{e}_R$). Leaving off the minus sign reverses net radial force in kinetic equations ($F = ma$).',
                    limitCase: 'Equal to $-v_\\theta^2 / R$ because $v_\\theta = R\\dot{\\theta}$.'
                },
                {
                    id: 'tangential-ang',
                    symbol: 'R\\ddot{\\theta}\\vec{e}_\\theta',
                    name: 'Angular Acceleration Tangential Rate',
                    color: '#a855f7',
                    meaning: 'Speeding up or slowing down of the rate of rotation about the axis. Governed by torque and angular acceleration $\\alpha$.',
                    examTrap: 'If angular velocity is constant ($\\dot{\\theta} = \\text{const}$), this term is exactly ZERO. Do not waste time computing $\\ddot{\\theta}$ if problem states "steady rotation".',
                    limitCase: 'If $\\dot{\\theta} = \\text{const}$, $R\\ddot{\\theta} = 0$.'
                },
                {
                    id: 'coriolis',
                    symbol: '2\\dot{R}\\dot{\\theta}\\vec{e}_\\theta',
                    name: 'Coriolis Acceleration',
                    color: '#eab308',
                    meaning: 'Interaction term arising from moving radially into regions of different tangential circumference speed while the reference triad rotates.',
                    examTrap: 'The number 2! Dropping the 2 is the single most common deduction in MECH 342 midterms. It accounts for two distinct rate changes.',
                    limitCase: 'Vanishes if motion is purely circular ($\\dot{R} = 0$) or purely stationary rotation ($\\dot{\\theta} = 0$).'
                },
                {
                    id: 'axial-z',
                    symbol: '\\ddot{z}\\vec{e}_z',
                    name: 'Axial Acceleration',
                    color: '#10b981',
                    meaning: 'Standard 1D linear acceleration parallel to the cylinder centerline axis.',
                    examTrap: 'Because $\\vec{e}_z = \\vec{K}$ has a fixed direction, its time derivative is identically 0. No cross terms couple with $z$ in cylindrical coordinates.',
                    limitCase: 'If motion is planar in $XY$, $\\ddot{z} = 0$.'
                }
            ]
        },
        'frenet-accel': {
            title: 'Frenet-Serret Path Variables Acceleration X-Ray',
            latexMaster: '\\vec{a} = \\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n + 0\\vec{e}_b',
            terms: [
                {
                    id: 'tangential-rate',
                    symbol: '\\dot{v}\\vec{e}_t',
                    name: 'Tangential Rate of Speed Change',
                    color: '#38bdf8',
                    meaning: 'Rate at which the particle’s scalar speed $v = |\\vec{v}|$ is increasing or decreasing along the path tangent.',
                    examTrap: '$\\dot{v} \\neq |\\vec{a}|$! $\\dot{v}$ is the derivative of the speed, while $|\\vec{a}| = \\sqrt{\\dot{v}^2 + (v^2/\\rho)^2}$. If speed is constant ($v = \\text{const}$), $\\dot{v} = 0$ even though total acceleration $\\vec{a}$ is non-zero!',
                    limitCase: 'If constant speed $v$, $\\dot{v} = 0$.'
                },
                {
                    id: 'normal-centripetal',
                    symbol: '\\frac{v^2}{\\rho}\\vec{e}_n',
                    name: 'Principal Normal Centripetal Acceleration',
                    color: '#10b981',
                    meaning: 'Acceleration directing toward the center of curvature in the osculating plane, responsible for bending the path.',
                    examTrap: '$\\rho$ is the instantaneous RADIUS OF CURVATURE, not the distance from the origin $r$! On general 3D curves, calculate via $\\rho = \\frac{|\\vec{v}|^3}{|\\vec{v}\\times\\vec{a}|}$.',
                    limitCase: 'On a straight line, $\\rho \\to \\infty \\implies a_n = 0$.'
                },
                {
                    id: 'binormal-zero',
                    symbol: '0\\vec{e}_b',
                    name: 'Zero Binormal Acceleration',
                    color: '#f43f5e',
                    meaning: 'The binormal component of acceleration is identically zero for all physical trajectories.',
                    examTrap: 'Do not attempt to derive a binormal acceleration term involving torsion $\\tau$. Write $a_b \\equiv 0$ on the test sheet and state "by definition of osculating plane".',
                    limitCase: 'Always zero.'
                }
            ]
        },
        'transport-theorem': {
            title: 'Transport Theorem Vector Derivative X-Ray',
            latexMaster: '\\left(\\frac{d\\vec{A}}{dt}\\right)_{XYZ} = \\left(\\frac{d\\vec{A}}{dt}\\right)_{xyz} + \\vec{\\omega}\\times\\vec{A}',
            terms: [
                {
                    id: 'relative-observed',
                    symbol: '\\left(\\frac{d\\vec{A}}{dt}\\right)_{xyz}',
                    name: 'Relative Observed Rate of Change',
                    color: '#38bdf8',
                    meaning: 'The rate of change of vector $\\vec{A}$ as seen by an observer stationed inside the rotating frame $xyz$: $(\\dot{A}_x\\vec{i} + \\dot{A}_y\\vec{j} + \\dot{A}_z\\vec{k})$.',
                    examTrap: 'Hold the basis vectors $\\vec{i}, \\vec{j}, \\vec{k}$ CONSTANT when computing this term. Differentiate only the scalar component coefficients!',
                    limitCase: 'If vector is rigidly attached to rotating body, $(\\frac{d\\vec{A}}{dt})_{xyz} = \\vec{0}$.'
                },
                {
                    id: 'transport-omega-cross',
                    symbol: '\\vec{\\omega}\\times\\vec{A}',
                    name: 'Transport Rate of Change',
                    color: '#eab308',
                    meaning: 'The additional rate of change created solely because the reference frame’s coordinate axes are swinging through space with angular velocity $\\vec{\\omega}$.',
                    examTrap: 'Cross product order! $\\vec{\\omega} \\times \\vec{A} \\neq \\vec{A} \\times \\vec{\\omega}$. Reversing order flips the sign by $180^\\circ$ ($-\\vec{\\omega}\\times\\vec{A}$).',
                    limitCase: 'If frame is non-rotating ($\\vec{\\omega} = \\vec{0}$), transport rate vanishes.'
                }
            ]
        },
        'euler-omega': {
            title: 'Ginsberg Z-Y-Z Body Angular Velocity X-Ray',
            latexMaster: '\\vec{\\omega} = (\\dot{\\psi}\\sin\\theta\\sin\\phi + \\dot{\\theta}\\cos\\phi)\\vec{i} + (\\dot{\\psi}\\sin\\theta\\cos\\phi - \\dot{\\theta}\\sin\\phi)\\vec{j} + (\\dot{\\psi}\\cos\\theta + \\dot{\\phi})\\vec{k}',
            terms: [
                {
                    id: 'omega-x',
                    symbol: '(\\dot{\\psi}\\sin\\theta\\sin\\phi + \\dot{\\theta}\\cos\\phi)\\vec{i}',
                    name: 'Body x-Axis Angular Velocity Component',
                    color: '#38bdf8',
                    meaning: 'Superposition of precession $\\dot{\\psi}$ projected through nutation $\\theta$ and spin $\\phi$, plus nutation rate $\\dot{\\theta}$ projected onto body $\\vec{i}$.',
                    examTrap: 'Notice the plus sign between the terms for $\\omega_x$, whereas $\\omega_y$ has a minus sign! Don’t mix up the trigonometric signs.',
                    limitCase: 'If nutation angle $\\theta = 0$, $\\sin\\theta = 0 \\implies \\omega_x = \\dot{\\theta}\\cos\\phi$.'
                },
                {
                    id: 'omega-y',
                    symbol: '(\\dot{\\psi}\\sin\\theta\\cos\\phi - \\dot{\\theta}\\sin\\phi)\\vec{j}',
                    name: 'Body y-Axis Angular Velocity Component',
                    color: '#a855f7',
                    meaning: 'Superposition of precession $\\dot{\\psi}$ and nutation $\\dot{\\theta}$ projected onto body-fixed $\\vec{j}$ axis.',
                    examTrap: 'The negative sign on $\\dot{\\theta}\\sin\\phi$ is due to the right-hand rule projection from $y\'$ to body $y\'\'$.',
                    limitCase: 'If $\\theta = 0$, $\\omega_y = -\\dot{\\theta}\\sin\\phi$.'
                },
                {
                    id: 'omega-z',
                    symbol: '(\\dot{\\psi}\\cos\\theta + \\dot{\\phi})\\vec{k}',
                    name: 'Body z-Axis Angular Velocity Component (Spin Axis)',
                    color: '#10b981',
                    meaning: 'Direct sum of precession $\\dot{\\psi}$ projected along the symmetry spin shaft plus the body spin rate $\\dot{\\phi}$.',
                    examTrap: 'When $\\theta = 0$, $\\cos 0 = 1$, so $\\omega_z = \\dot{\\psi} + \\dot{\\phi}$. This is the Gimbal Lock singularity: $\\psi$ and $\\phi$ rotations combine into a single axis!',
                    limitCase: 'If $\\theta = 90^\\circ$, $\\cos 90^\\circ = 0 \\implies \\omega_z = \\dot{\\phi}$.'
                }
            ]
        }
    },

    // ==========================================
    // 4. COORDINATE ROSETTA STONE ENGINE
    // ==========================================
    /**
     * Computes the exact same 3D spatial motion (Conical Spiral Track, similar to Asg1 Q2)
     * across all 4 coordinate representations simultaneously to demonstrate physical vector equivalence.
     */
    computeRosettaStone: function(t, coneHalfAngleDeg = 30, spiralPitch = 0.5, omegaSpeed = 2.0) {
        const beta = (coneHalfAngleDeg * Math.PI) / 180; // half cone angle
        const theta = omegaSpeed * t;
        const thetaDot = omegaSpeed;
        const thetaDDot = 0;

        // Helix expanding on a cone: R = c * z = z * tan(beta)
        const z = spiralPitch * t;
        const zDot = spiralPitch;
        const zDDot = 0;

        const R = z * Math.tan(beta);
        const RDot = zDot * Math.tan(beta);
        const RDDot = 0;

        // 1. Cartesian Coordinates
        const x = R * Math.cos(theta);
        const y = R * Math.sin(theta);
        const vx = RDot * Math.cos(theta) - R * thetaDot * Math.sin(theta);
        const vy = RDot * Math.sin(theta) + R * thetaDot * Math.cos(theta);
        const vz = zDot;
        const ax = (RDDot - R * thetaDot * thetaDot) * Math.cos(theta) - (2 * RDot * thetaDot + R * thetaDDot) * Math.sin(theta);
        const ay = (RDDot - R * thetaDot * thetaDot) * Math.sin(theta) + (2 * RDot * thetaDot + R * thetaDDot) * Math.cos(theta);
        const az = zDDot;

        // Vector Magnitudes (Physical Invariants)
        const vMag = Math.sqrt(vx * vx + vy * vy + vz * vz);
        const aMag = Math.sqrt(ax * ax + ay * ay + az * az);

        // 2. Cylindrical Coordinates
        const vR = RDot;
        const vTheta = R * thetaDot;
        const vZ = zDot;
        const aR = RDDot - R * thetaDot * thetaDot;
        const aTheta = R * thetaDDot + 2 * RDot * thetaDot;
        const aZ = zDDot;

        // 3. Spherical Coordinates (r, phi, theta)
        // r = sqrt(R^2 + z^2), phi = cone angle from z-axis = beta
        const r = Math.sqrt(R * R + z * z);
        const phi = beta;
        const rDot = (R * RDot + z * zDot) / (r || 1e-6);
        const vr = rDot;
        const vPhi = 0; // constrained to cone surface
        const vSphTheta = r * Math.sin(phi) * thetaDot;

        // 4. Frenet-Serret Path Variables
        // v = vMag * e_t
        // a = a_t * e_t + a_n * e_n
        const vDot = (vx * ax + vy * ay + vz * az) / (vMag || 1e-6);
        const anMag = Math.sqrt(Math.max(0, aMag * aMag - vDot * vDot));
        const rho = (vMag * vMag) / (anMag || 1e-6);

        return {
            t: t,
            physicalInvariants: {
                speed: vMag,
                accelMag: aMag,
                radiusCurvature: rho
            },
            cartesian: {
                pos: [x, y, z],
                vel: [vx, vy, vz],
                acc: [ax, ay, az],
                exprV: `${vx.toFixed(2)}\\vec{I} + ${vy.toFixed(2)}\\vec{J} + ${vz.toFixed(2)}\\vec{K}`,
                exprA: `${ax.toFixed(2)}\\vec{I} + ${ay.toFixed(2)}\\vec{J} + ${az.toFixed(2)}\\vec{K}`
            },
            cylindrical: {
                coords: [R, theta, z],
                vel: [vR, vTheta, vZ],
                acc: [aR, aTheta, aZ],
                exprV: `${vR.toFixed(2)}\\vec{e}_R + ${vTheta.toFixed(2)}\\vec{e}_\\theta + ${vZ.toFixed(2)}\\vec{e}_z`,
                exprA: `${aR.toFixed(2)}\\vec{e}_R + ${aTheta.toFixed(2)}\\vec{e}_\\theta + ${aZ.toFixed(2)}\\vec{e}_z`
            },
            spherical: {
                coords: [r, phi, theta],
                vel: [vr, vPhi, vSphTheta],
                exprV: `${vr.toFixed(2)}\\vec{e}_r + 0\\vec{e}_\\phi + ${vSphTheta.toFixed(2)}\\vec{e}_\\theta`
            },
            frenet: {
                vScalar: vMag,
                vDot: vDot,
                an: anMag,
                rho: rho,
                exprV: `${vMag.toFixed(2)}\\vec{e}_t`,
                exprA: `${vDot.toFixed(2)}\\vec{e}_t + ${anMag.toFixed(2)}\\vec{e}_n + 0\\vec{e}_b`
            }
        };
    },

    // ==========================================
    // 5. METACOGNITIVE CALIBRATION METRICS
    // ==========================================
    trackRecord: {
        totalAnswered: 0,
        highConfCorrect: 0,    // Calibrated Mastery
        highConfIncorrect: 0,  // Dangerous Blindspot (High-Risk Exam Trap!)
        medConfCorrect: 0,     // Solid Reasoning
        medConfIncorrect: 0,   // Developing
        lowConfCorrect: 0,     // Lucky Guess
        lowConfIncorrect: 0    // Known Knowledge Gap
    },

    recordResponse: function(confidence, isCorrect) {
        this.trackRecord.totalAnswered++;
        if (confidence === 'high') {
            if (isCorrect) this.trackRecord.highConfCorrect++;
            else this.trackRecord.highConfIncorrect++;
        } else if (confidence === 'med') {
            if (isCorrect) this.trackRecord.medConfCorrect++;
            else this.trackRecord.medConfIncorrect++;
        } else {
            if (isCorrect) this.trackRecord.lowConfCorrect++;
            else this.trackRecord.lowConfIncorrect++;
        }
        this.saveMetrics();
    },

    saveMetrics: function() {
        try {
            localStorage.setItem('mech342_metacognitive_metrics', JSON.stringify(this.trackRecord));
        } catch(e) {}
    },

    loadMetrics: function() {
        try {
            const data = localStorage.getItem('mech342_metacognitive_metrics');
            if (data) this.trackRecord = JSON.parse(data);
        } catch(e) {}
    },

    getExamReadinessScore: function() {
        const tr = this.trackRecord;
        if (tr.totalAnswered === 0) return 0;
        
        // High confidence correct gives +3 points
        // Med confidence correct gives +2 points
        // Low confidence correct gives +1 point (guess)
        // High confidence incorrect applies a -2 penalty (Dunning-Kruger penalty)
        // Med confidence incorrect applies -0.5
        // Low confidence incorrect applies 0
        const rawScore = (tr.highConfCorrect * 3) + (tr.medConfCorrect * 2) + (tr.lowConfCorrect * 1) - (tr.highConfIncorrect * 2) - (tr.medConfIncorrect * 0.5);
        const maxPossible = tr.totalAnswered * 3;
        const pct = Math.max(0, Math.min(100, Math.round((rawScore / (maxPossible || 1)) * 100)));
        return pct;
    }
};

PedagogyEngine.loadMetrics();
