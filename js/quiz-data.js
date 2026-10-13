/**
 * UVic MECH 342 - Dynamics II
 * Comprehensive Diagnostic & Practice Problem Bank
 * Structured across Bloom's Taxonomy with Hints & Solutions
 */

const QuizBank = [
    {
        id: "q1",
        lecture: 2,
        bloomLevel: "Remember",
        question: "In Ginsberg's formulation of 3D dynamics, what do the <strong>columns</strong> of a rotation matrix $[R]$ represent?",
        options: [
            "The basis vectors of the original frame, in terms of the destination frame.",
            "The basis vectors of the destination frame, in terms of the original frame.",
            "The angular velocities about the principal body axes.",
            "The Euler angle derivatives."
        ],
        correctIndex: 0,
        explanation: "As stated in Lecture #2 Slide 5: <em>'The columns of a Rotation Matrix are the basis vectors of the frame you are in (source), in terms of the frame you are going to (destination).'</em> Conversely, the rows are the destination basis in terms of the source.",
        hint: "Think about how $[x'] = [R][x]$ unpacks: each column scales with an original component ($x, y, z$)."
    },

    {
        id: "q2",
        lecture: 1,
        bloomLevel: "Remember",
        question: "In the 1800s Imperial gravitational unit system, when length is measured in <strong>inches</strong>, what is the derived unit of mass called?",
        options: [
            "Slug",
            "Slugette (or Blob)",
            "Glug",
            "Pound-mass (lbm)"
        ],
        correctIndex: 1,
        explanation: "Lecture #1 Slide 20 points out that with $g = 386.0\\text{ in/s}^2$, mass is $\\text{lbf}\\cdot\\text{s}^2/\\text{in}$, which was named the <strong>slugette</strong>, and humorously but formally called a <strong>'blob'</strong>! (The slug uses feet with $g = 32.17\\text{ ft/s}^2$, and the glug is cgs).",
        hint: "It is 12 times heavier than a standard slug ($12\\text{ in} = 1\\text{ ft}$)."
    },

    {
        id: "q3",
        lecture: 1,
        bloomLevel: "Understand",
        question: "What is the critical distinction between the phrases <em>'with respects to'</em> and <em>'in terms of'</em> in kinematics?",
        options: [
            "'With respects to' indicates which unit basis vectors are used, while 'in terms of' specifies relative point displacement.",
            "'With respects to' denotes the relative physical displacement between two physical points (a coordinate-free vector), while 'in terms of' specifies which coordinate frame's basis is used to resolve the vector into numbers.",
            "They are interchangeable synonyms used for mathematical accounting.",
            "'With respects to' applies only to velocity, while 'in terms of' applies only to acceleration."
        ],
        correctIndex: 1,
        explanation: "Lecture #1 Slide 12 highlights this as a foundational concept. $\\vec{r}_{P/Q}$ is the physical displacement of $P$ with respects to $Q$. Expressing it in terms of $xyz$ means writing $[r^x, r^y, r^z]^T$.",
        hint: "A physical vector exists in real space without any coordinate frame drawn on it."
    },

    {
        id: "q4",
        lecture: 2,
        bloomLevel: "Apply",
        question: "A rotation matrix $[R]$ has 9 scalar entries. How many <strong>independent degrees of freedom</strong> does it have, and why?",
        options: [
            "9, because all entries are independent.",
            "6, because there are 3 diagonal entries.",
            "3, because the 9 entries are constrained by 3 unit magnitude equations and 3 mutual orthogonality equations ($9 - 6 = 3$).",
            "1, because of Euler's theorem."
        ],
        correctIndex: 2,
        explanation: "Lecture #2 Slide 14: The 3 columns must be unit vectors ($\\vec{c}_i \\cdot \\vec{c}_i = 1$, 3 constraints) and mutually perpendicular ($\\vec{c}_i \\cdot \\vec{c}_j = 0$, 3 constraints). $9 - 6 = 3$ degrees of freedom! That is why any spatial orientation is defined by 3 Euler angles.",
        hint: "Count how many constraints are imposed by $R^T R = I$."
    },

    {
        id: "q5",
        lecture: 2,
        bloomLevel: "Apply",
        question: "In the canonical rotation matrix about the $y$-axis, $R_y(\\theta_y)$, where does the negative sign appear?",
        options: [
            "Row 2, Column 1 ($R_{21} = -\\sin\\theta_y$)",
            "Row 1, Column 3 ($R_{13} = -\\sin\\theta_y$)",
            "Row 3, Column 2 ($R_{32} = -\\sin\\theta_y$)",
            "There are no negative signs in $R_y$."
        ],
        correctIndex: 1,
        explanation: "Lecture #2 Slide 11: Due to the right-hand cyclic rule ($z \\times x = y$), rotating about $y$ means $\\vec{i}' = \\cos\\theta \\vec{i} - \\sin\\theta \\vec{k}$, placing the negative sign at $R_{13} = -\\sin\\theta_y$!",
        hint: "Compare $R_x, R_y, R_z$. $R_y$ has the negative sign in the upper right."
    },

    {
        id: "q6",
        lecture: 2,
        bloomLevel: "Analyze",
        question: "When a coordinate system undergoes a sequence of <strong>body-fixed</strong> canonical rotations, how is the overall rotation matrix $[R]$ calculated?",
        options: [
            "By post-multiplying from left to right: $[R] = [R_1][R_2]\\cdots[R_N]$",
            "By pre-multiplying from left to right: $[R] = [R_N][R_{N-1}]\\cdots[R_2][R_1]$",
            "By adding the individual rotation matrices: $[R] = [R_1] + [R_2] + \\cdots + [R_N]$",
            "By taking the average of the direction cosines."
        ],
        correctIndex: 1,
        explanation: "Lecture #2 Slide 19: Body-fixed rotations PRE-multiply: $[R] = [R_N \\cdots R_2 R_1]$. Each subsequent rotation acts on the coordinates resulting from the previous step.",
        hint: "Because the new frame rotates relative to the intermediate frame, the new matrix operates on the left."
    },

    {
        id: "q7",
        lecture: 3,
        bloomLevel: "Understand",
        question: "Why do finite 3D rotations fail to commute ($R_A R_B \\neq R_B R_A$), whereas angular velocities $\\vec{\\omega}_A, \\vec{\\omega}_B$ commute and add vectorially?",
        options: [
            "They do commute; matrix multiplication is commutative in 3D.",
            "Infinitesimal rotations commute because second-order differential cross terms $(d\\theta_1 d\\theta_2)$ vanish in the limit, and angular velocity is the time rate of infinitesimal rotations.",
            "Angular velocities only commute in 2D, never in 3D.",
            "Because angular velocity is a scalar quantity."
        ],
        correctIndex: 1,
        explanation: "Lecture #3 Slide 2 & Lecture #4 Preview: Finite rotations produce geometric cross-coupling of axes. However, as $\\theta \\to d\\theta$, $\\cos(d\\theta) \\approx 1$ and $\\sin(d\\theta) \\approx d\\theta$. The product difference $(R_A R_B - R_B R_A)$ is $O(d\\theta^2) \\to 0$.",
        hint: "Look at Taylor series expansions of $\\sin\\theta$ and $\\cos\\theta$ for tiny angles."
    },

    {
        id: "q8",
        lecture: 3,
        bloomLevel: "Analyze",
        question: "According to the <strong>Reversal Theorem</strong>, which space-fixed sequence is mathematically identical to the body-fixed sequence $[R_Z(\\psi) R_Y(\\theta) R_X(\\phi)]_{\\text{body}}$?",
        options: [
            "$[R_Z(\\psi) R_Y(\\theta) R_X(\\phi)]_{\\text{space}}$",
            "$[R_X(\\phi) R_Y(\\theta) R_Z(\\psi)]_{\\text{space}}$",
            "$[R_Y(\\theta) R_Z(\\psi) R_X(\\phi)]_{\\text{space}}$",
            "$[R_Z(-\\psi) R_Y(-\\theta) R_X(-\\phi)]_{\\text{space}}$"
        ],
        correctIndex: 1,
        explanation: "Lecture #3 Slide 6 & 9: A space-fixed sequence and a body-fixed sequence yield the same $[R]$ if the order of rotations is completely reversed: $[R_1 R_2 \\cdots R_N]_{\\text{space}} = [R_N \\cdots R_2 R_1]_{\\text{body}}$.",
        hint: "Reverse the sequence order completely."
    },

    {
        id: "q9",
        lecture: 3,
        bloomLevel: "Evaluate",
        question: "Euler's Equivalent Axis Theorem proves that any 3D rotation matrix $[R]$ has what invariant eigenvalue, and what does its eigenvector represent?",
        options: [
            "Eigenvalue $\\lambda = 0$; eigenvector is the velocity vector.",
            "Eigenvalue $\\lambda = 1$; eigenvector is the invariant axis of rotation $\\vec{u}_\\beta$.",
            "Eigenvalue $\\lambda = -1$; eigenvector is the reflection plane.",
            "Eigenvalues are purely imaginary with no real eigenvector."
        ],
        correctIndex: 1,
        explanation: "Lecture #3 Slide 18 & 20: Every 3D rotation leaves vectors lying along the rotation axis completely unchanged: $[R]\\vec{u}_\\beta = 1\\cdot\\vec{u}_\\beta$. Thus $\\lambda = 1$ is always an eigenvalue, and the corresponding eigenvector IS the axis of rotation!",
        hint: "Vectors along the rotation axis do not move during the rotation."
    },

    {
        id: "q10",
        lecture: 3,
        bloomLevel: "Apply",
        question: "Given a rotation matrix $[R]$ with trace $\\text{tr}(R) = 2.0$, what is the magnitude of the equivalent rotation angle $\\beta$?",
        options: [
            "$30^\\circ$",
            "$45^\\circ$",
            "$60^\\circ$",
            "$90^\\circ$"
        ],
        correctIndex: 2,
        explanation: "Lecture #3 Slide 21: $\\text{tr}(R) = 1 + 2\\cos\\beta$. Setting $2.0 = 1 + 2\\cos\\beta \\implies 2\\cos\\beta = 1 \\implies \\cos\\beta = 0.5 \\implies \\beta = 60^\\circ$!",
        hint: "Use $\\cos\\beta = \\frac{\\text{tr}(R) - 1}{2}$."
    },

    {
        id: "q11",
        lecture: 1,
        bloomLevel: "Understand",
        question: "How is the Work-Energy Principle mathematically derived for a particle in 3D Newtonian dynamics?",
        options: [
            "By integrating $\\sum \\vec{F} = m\\vec{a}$ with respect to time $dt$.",
            "By taking the scalar dot product of $\\sum \\vec{F} = m\\vec{a}$ with the differential displacement $d\\vec{r}$ along the path.",
            "By taking the vector cross product of $\\vec{r}$ with $\\sum \\vec{F}$.",
            "By taking the divergence of the force field."
        ],
        correctIndex: 1,
        explanation: "Lecture #1 Slide 13: Taking the dot product of both sides with $d\\vec{r}$: $\\sum \\vec{F}\\cdot d\\vec{r} = m\\frac{d\\vec{v}}{dt}\\cdot\\vec{v} dt = m(\\vec{v}\\cdot d\\vec{v}) = \\frac{1}{2}m d(v^2)$, which integrates to $T_2 - T_1$.",
        hint: "Work is Force dotted with displacement."
    },

    {
        id: "q12",
        lecture: 3,
        bloomLevel: "Analyze",
        question: "In the bent shaft mechanism from Lecture 3 Slide 10 (precession $\\psi$, nutation $\\theta$, spin $\\phi$), why does $[R] = [R_z(\\phi)][R_y(\\theta)][R_z(\\psi)]$ hold regardless of how you analyze it?",
        options: [
            "Because matrix multiplication is commutative in mechanisms.",
            "Because the physical joints are arranged in a physical kinematic chain where joint $\\psi$ carries joint $\\theta$, which carries spin $\\phi$, establishing the fundamental frame dependencies.",
            "Because spin $\\phi$ can rotate the vertical precession axis.",
            "It only holds if all angles are less than $10^\\circ$."
        ],
        correctIndex: 1,
        explanation: "Lecture #3 Slide 14: Joint structure dictates dependencies: spin $\\phi$ cannot change the orientation of $\\psi$ or $\\theta$, but $\\psi$ alters the orientations of both $\\theta$ and $\\phi$. The physical linkage topology dictates the rotation sequence.",
        hint: "Look at which joint is physically attached to ground and which is attached to the rotor."
    },

    {
        id: "q13",
        lecture: 2,
        bloomLevel: "Apply",
        question: "In the hydraulic cylinder mechanism of Lecture 2 Slide 20, shaft $AB$ (length 600 mm) rotates about the vertical axis by $\\theta = 36.87^\\circ$ from the $+Y$ axis. What are the horizontal coordinates $[X, Y]$ of joint $B$?",
        options: [
            "$X = -360\\text{ mm}, Y = +480\\text{ mm}$",
            "$X = +480\\text{ mm}, Y = +360\\text{ mm}$",
            "$X = -600\\text{ mm}, Y = 0\\text{ mm}$",
            "$X = 0\\text{ mm}, Y = +600\\text{ mm}$"
        ],
        correctIndex: 0,
        explanation: "Since $\\sin(36.87^\\circ) \\approx 0.6$ and $\\cos(36.87^\\circ) \\approx 0.8$, rotating the vector $[0, 600, 0]^T$ by $36.87^\\circ$ counter-clockwise about $+Z$ yields $X = -600\\sin(36.87^\\circ) = -360\\text{ mm}$ and $Y = 600\\cos(36.87^\\circ) = +480\\text{ mm}$!",
        hint: "Apply the 2D rotation of $+Y$ toward $-X$."
    },

    {
        id: "q14",
        lecture: 2,
        bloomLevel: "Analyze",
        question: "In Lecture 2 Slide 21 (Rotated Rectangular Prism), if corner $E$ has initial coordinates $[E]_{XYZ} = [0, 120, 60]^T\\text{ mm}$, which matrix equation computes its coordinates in terms of the rotated frame $xyz$ after body-fixed rotations $R_x(\\theta_1)$ then $R_y(\\theta_2)$?",
        options: [
            "$[E]_{xyz} = [R_x(\\theta_1)][R_y(\\theta_2)][E]_{XYZ}$",
            "$[E]_{xyz} = [R_y(\\theta_2)][R_x(\\theta_1)][E]_{XYZ}$",
            "$[E]_{xyz} = ([R_y(\\theta_2)] + [R_x(\\theta_1)])[E]_{XYZ}$",
            "$[E]_{xyz} = [R_y(\\theta_2)]^T [R_x(\\theta_1)]^T [E]_{XYZ}$"
        ],
        correctIndex: 1,
        explanation: "By the body-fixed pre-multiplication rule, successive rotations about moving axes multiply on the left from first to last: $[R] = [R_N \\dots R_2 R_1] = [R_y(\\theta_2)][R_x(\\theta_1)]$. Therefore $[E]_{xyz} = [R_y(\\theta_2)][R_x(\\theta_1)][E]_{XYZ}$!",
        hint: "Body-fixed rotations are PRE-multiplied."
    },

    {
        id: "q15",
        lecture: 3,
        bloomLevel: "Understand",
        question: "What physical and mathematical condition causes <strong>Gimbal Lock</strong> in a 3-ring Euler angle gimbal system?",
        options: [
            "Friction in the bearings stops the rotation.",
            "When the middle gimbal (Pitch) rotates to $\\pm 90^\\circ$, aligning the outer (Yaw) and inner (Roll) gimbal axes into the same plane, causing the loss of one rotational degree of freedom.",
            "When all three angles exceed $180^\\circ$.",
            "When the angular velocity reaches the speed of sound."
        ],
        correctIndex: 1,
        explanation: "At Pitch $\\theta = \\pm 90^\\circ$, the rotation axis of the first gimbal becomes collinear with the rotation axis of the third gimbal. Any motion about that axis can be achieved by either gimbal, meaning the system can no longer rotate about the third perpendicular axis without tumbling the frame!",
        hint: "Look at the 3D Gimbal simulation when Pitch is snapped to 90 degrees."
    },

    {
        id: "q16",
        lecture: 3,
        bloomLevel: "Evaluate",
        question: "Why is the trace of a general rotation matrix $[R_u]$ identical to the trace of a simple canonical rotation $[R_z(\\beta)]$, regardless of the orientation of the rotation axis?",
        options: [
            "Because all matrices have the same trace.",
            "Because $[R_u]$ is related to $[R_z(\\beta)]$ by an orthonormal similarity transformation $[R_u] = [R']^T [R_z(\\beta)] [R']$, and the trace operator is invariant under cyclic permutation: $\\text{tr}(A B C) = \\text{tr}(C A B)$.",
            "Because the diagonal elements never change during coordinate rotations.",
            "Only symmetric matrices have invariant traces."
        ],
        correctIndex: 1,
        explanation: "Lecture #3 Slide 19: An arbitrary axis rotation is a similarity transformation. Since $[R']^T = [R']^{-1}$, $\\text{tr}([R']^T [R_z] [R']) = \\text{tr}([R_z] [R'] [R']^T) = \\text{tr}([R_z] [I]) = \\text{tr}(R_z) = 1 + 2\\cos\\beta$.",
        hint: "Similarity transformations preserve both eigenvalues and trace."
    },

    {
        id: "q17",
        lecture: 1,
        bloomLevel: "Apply",
        question: "An engineer specifies an object's mass as $2.0\\text{ blobs}$ (slugettes). What is its mass in standard engineering <strong>slugs</strong>?",
        options: [
            "$2.0\\text{ slugs}$",
            "$0.167\\text{ slugs}$",
            "$24.0\\text{ slugs}$",
            "$64.35\\text{ slugs}$"
        ],
        correctIndex: 2,
        explanation: "A blob (slugette) is based on inches: $\\text{lbf}\\cdot\\text{s}^2/\\text{in}$. Since $1\\text{ ft} = 12\\text{ in}$, $1\\text{ blob} = 12\\text{ slugs}$! Therefore $2.0\\text{ blobs} = 2.0 \\times 12 = 24.0\\text{ slugs}$!",
        hint: "There are 12 inches in a foot."
    },

    {
        id: "q18",
        lecture: 0,
        bloomLevel: "Analyze",
        question: "In the Lecture 0 Kinematics Challenge, why does the time derivative of relative position $\\vec{r}_{Q/P}$ contain both $(\\dot{x}\\vec{i} + \\dot{y}\\vec{j})$ and $(x\\dot{\\vec{i}} + y\\dot{\\vec{j}})$ terms?",
        options: [
            "Because the product rule $\\frac{d}{dt}(u v) = \\dot{u}v + u\\dot{v}$ applies when the basis vectors themselves rotate with the moving frame.",
            "It is an approximation that only holds for small angles.",
            "The second term is only present if the particle has mass.",
            "Because velocity cannot be defined without acceleration."
        ],
        correctIndex: 0,
        explanation: "Lecture #0 Slide 4 & Ginsberg §1.1.3: Vectors have magnitude and direction. In moving coordinate systems, the unit vectors change direction over time: $\\dot{\\vec{i}} = \\vec{\\omega} \\times \\vec{i}$. Applying product rule yields both relative observed rate and transport rate!",
        hint: "Both the coordinates $(x, y)$ and the unit vectors $(\\vec{i}, \\vec{j})$ are functions of time."
    }
,
    {
        id: "q19",
        lecture: 4,
        bloomLevel: "Remember",
        question: "In Cylindrical coordinates $(R, \\theta, z)$, what is the scale factor $h_\\theta$ corresponding to the azimuth coordinate $\\theta$?",
        options: [
            "$h_\\theta = 1$",
            "$h_\\theta = R$",
            "$h_\\theta = R\\sin\\theta$",
            "$h_\\theta = R^2$"
        ],
        correctIndex: 1,
        explanation: "Lecture #4 Slide 4: An infinitesimal angular displacement $d\\theta$ corresponds to an arc length $ds_\\theta = R d\\theta$. Therefore, the scale factor is $h_\\theta = |\\frac{\\partial\\vec{r}}{\\partial\\theta}| = R$.",
        hint: "Arc length on a circle is radius times angle in radians."
    },

    {
        id: "q20",
        lecture: 4,
        bloomLevel: "Understand",
        question: "In Cylindrical coordinates, what is the physical origin of the factor of 2 in the <strong>Coriolis acceleration</strong> term ($2\\dot{R}\\dot{\\theta}$)?",
        options: [
            "It is an empirical correction factor from wind tunnel tests.",
            "It is the sum of two equal physical effects: (1) the rotating direction of the radial velocity vector $\\dot{R}\\dot{\\vec{e}}_R = \\dot{R}\\dot{\\theta}\\vec{e}_\\theta$, and (2) the changing radius $R$ altering the tangential speed $\\frac{d}{dt}(R\\dot{\\theta}) = \\dot{R}\\dot{\\theta}\\vec{e}_\\theta$.",
            "It comes from the square of the angular velocity.",
            "It is because the body has two rotational degrees of freedom."
        ],
        correctIndex: 1,
        explanation: "Lecture #4 Slide 8: The product rule $\\frac{d}{dt}(\\dot{R}\\vec{e}_R + R\\dot{\\theta}\\vec{e}_\\theta)$ produces $\\dot{R}\\dot{\\vec{e}}_R = \\dot{R}\\dot{\\theta}\\vec{e}_\\theta$ and $\\frac{dR}{dt}\\dot{\\theta}\\vec{e}_\\theta = \\dot{R}\\dot{\\theta}\\vec{e}_\\theta$. Summing them yields exactly $2\\dot{R}\\dot{\\theta}$!",
        hint: "Apply the product rule to both the radial component $\\dot{R}\\vec{e}_R$ and tangential component $R\\dot{\\theta}\\vec{e}_\\theta$."
    },

    {
        id: "q21",
        lecture: 4,
        bloomLevel: "Apply",
        question: "A robotic collar slides outward along a rotating arm at $\\dot{R} = 2.0\\text{ m/s}$ when $R = 3.0\\text{ m}$. The arm rotates at a constant rate $\\dot{\\theta} = 4.0\\text{ rad/s}$ ($\\ddot{\\theta} = 0$). What is the tangential acceleration component $a_\\theta$?",
        options: [
            "$a_\\theta = 0\\text{ m/s}^2$",
            "$a_\\theta = 8.0\\text{ m/s}^2$",
            "$a_\\theta = 16.0\\text{ m/s}^2$",
            "$a_\\theta = 48.0\\text{ m/s}^2$"
        ],
        correctIndex: 2,
        explanation: "In cylindrical coordinates, $a_\\theta = R\\ddot{\\theta} + 2\\dot{R}\\dot{\\theta}$. Since $\\ddot{\\theta} = 0$, $a_\\theta = 2(2.0)(4.0) = 16.0\\text{ m/s}^2$!",
        hint: "Don't forget the factor of 2 in Coriolis: $2\\dot{R}\\dot{\\theta}$."
    },

    {
        id: "q22",
        lecture: 4,
        bloomLevel: "Analyze",
        question: "In Jerry Ginsberg's Spherical coordinates $(r, \\phi, \\theta)$, where $\\phi$ is colatitude from vertical $+Z$ and $\\theta$ is azimuth, what is the scale factor $h_\\theta$?",
        options: [
            "$h_\\theta = r$",
            "$h_\\theta = r\\cos\\phi$",
            "$h_\\theta = r\\sin\\phi$",
            "$h_\\theta = \\sin\\phi\\cos\\theta$"
        ],
        correctIndex: 2,
        explanation: "Lecture #4 Slide 20 & Ginsberg §2.2.2: The horizontal radius from the vertical axis is $R = r\\sin\\phi$. The horizontal arc length for an increment $d\\theta$ is $ds_\\theta = (r\\sin\\phi)d\\theta$, so $h_\\theta = r\\sin\\phi$!",
        hint: "Project radius $r$ onto the horizontal $XY$-plane."
    },

    {
        id: "q23",
        lecture: 5,
        bloomLevel: "Remember",
        question: "In Frenet-Serret path variables $(\\vec{e}_t, \\vec{e}_n, \\vec{e}_b)$, what is the component of acceleration along the <strong>binormal axis</strong> $\\vec{e}_b$?",
        options: [
            "Strictly zero ($a_b \\equiv 0$)",
            "$a_b = v^2/\\rho$",
            "$a_b = \\dot{v}$",
            "$a_b = \\tau v$ (where $\\tau$ is torsion)"
        ],
        correctIndex: 0,
        explanation: "Lecture #5 Slide 13 & Ginsberg Eq. (2.3.11): Acceleration is $\\vec{a} = \\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n + 0\\vec{e}_b$. The binormal acceleration is IDENTICALLY ZERO. Acceleration lies entirely in the osculating plane!",
        hint: "The binormal vector is perpendicular to the osculating plane."
    },

    {
        id: "q24",
        lecture: 5,
        bloomLevel: "Understand",
        question: "In 3D particle kinematics along a curve, which geometric plane contains <strong>both</strong> the instantaneous velocity vector $\\vec{v}$ and acceleration vector $\\vec{a}$?",
        options: [
            "The Normal plane (spanned by $\\vec{e}_n$ and $\\vec{e}_b$)",
            "The Rectifying plane (spanned by $\\vec{e}_t$ and $\\vec{e}_b$)",
            "The Osculating plane (spanned by $\\vec{e}_t$ and $\\vec{e}_n$)",
            "The horizontal $XY$ Cartesian plane"
        ],
        correctIndex: 2,
        explanation: "Lecture #5 Slide 6: The osculating plane is defined by the unit tangent $\\vec{e}_t$ and principal normal $\\vec{e}_n$. Since $\\vec{v} = v\\vec{e}_t$ and $\\vec{a} = \\dot{v}\\vec{e}_t + (v^2/\\rho)\\vec{e}_n$, both vectors lie strictly inside the osculating plane!",
        hint: "Latin 'osculari' means 'to kiss' — the plane that kisses the curve."
    },

    {
        id: "q25",
        lecture: 5,
        bloomLevel: "Apply",
        question: "What is the universal master formula for the <strong>radius of curvature</strong> $\\rho$ of an arbitrary 3D trajectory in terms of velocity $\\vec{v}$ and acceleration $\\vec{a}$?",
        options: [
            "$\\rho = \\frac{|\\vec{v}|^2}{|\\vec{a}|}$",
            "$\\rho = \\frac{|\\vec{v}|^3}{|\\vec{v} \\times \\vec{a}|}$",
            "$\\rho = \\frac{|\\vec{v} \\times \\vec{a}|}{|\\vec{v}|^2}$",
            "$\\rho = \\frac{|\\vec{a}|^2}{|\\vec{v}|^3}$"
        ],
        correctIndex: 1,
        explanation: "Lecture #5 Slide 12: $\\vec{v}\\times\\vec{a} = (v\\vec{e}_t)\\times(\\dot{v}\\vec{e}_t + \\frac{v^2}{\\rho}\\vec{e}_n) = \\frac{v^3}{\\rho}\\vec{e}_b$. Taking magnitudes gives $|\\vec{v}\\times\\vec{a}| = \\frac{v^3}{\\rho} \\implies \\rho = \\frac{|\\vec{v}|^3}{|\\vec{v}\\times\\vec{a}|}$!",
        hint: "Check dimensional units: m³/s³ divided by m²/s³ gives meters."
    },

    {
        id: "q26",
        lecture: 5,
        bloomLevel: "Analyze",
        question: "A test car enters a curved track with radius of curvature $\\rho = 200\\text{ m}$ at a constant speed of $v = 30\\text{ m/s}$. What is its tangential acceleration $\\dot{v}$ and total acceleration magnitude $|\\vec{a}|$?",
        options: [
            "$\\dot{v} = 0\\text{ m/s}^2, |\\vec{a}| = 0\\text{ m/s}^2$",
            "$\\dot{v} = 4.5\\text{ m/s}^2, |\\vec{a}| = 4.5\\text{ m/s}^2$",
            "$\\dot{v} = 0\\text{ m/s}^2, |\\vec{a}| = 4.5\\text{ m/s}^2$",
            "$\\dot{v} = 9.0\\text{ m/s}^2, |\\vec{a}| = 9.0\\text{ m/s}^2$"
        ],
        correctIndex: 2,
        explanation: "Because speed is constant, $\\dot{v} = 0$. However, because the car is turning, it has normal acceleration $a_n = \\frac{v^2}{\\rho} = \\frac{30^2}{200} = \\frac{900}{200} = 4.5\\text{ m/s}^2$. Total acceleration $|\\vec{a}| = \\sqrt{0^2 + 4.5^2} = 4.5\\text{ m/s}^2$!",
        hint: "Constant speed means $\\dot{v} = 0$, but changing direction requires normal acceleration."
    },

    {
        id: "q27",
        lecture: 6,
        bloomLevel: "Remember",
        question: "What is <strong>Poisson's Kinematic Relation</strong> for the time derivative of a moving unit basis vector $\\vec{e}$ in a frame with angular velocity $\\vec{\\omega}$?",
        options: [
            "$\\dot{\\vec{e}} = \\vec{\\omega} \\cdot \\vec{e}$",
            "$\\dot{\\vec{e}} = \\vec{\\omega} \\times \\vec{e}$",
            "$\\dot{\\vec{e}} = |\\vec{\\omega}|\\vec{e}$",
            "$\\dot{\\vec{e}} = \\vec{\\alpha} \\times \\vec{e}$"
        ],
        correctIndex: 1,
        explanation: "Lecture #6 Slide 8 & Ginsberg Eq. (3.2.14): Since $|\\vec{e}| = 1$ is constant, $\\vec{e} \\cdot \\dot{\\vec{e}} = 0$. The velocity of the tip of the unit vector due to rigid rotation is $\\dot{\\vec{e}} = \\vec{\\omega} \\times \\vec{e}$!",
        hint: "The tip of the unit vector sweeps an arc perpendicular to both $\\vec{\\omega}$ and $\\vec{e}$."
    },

    {
        id: "q28",
        lecture: 6,
        bloomLevel: "Understand",
        question: "Why do <strong>infinitesimal rotations</strong> commute ($d\\vec{\\theta}_1 + d\\vec{\\theta}_2 = d\\vec{\\theta}_2 + d\\vec{\\theta}_1$), allowing angular velocity to be a vector, even though finite rotations do NOT commute?",
        options: [
            "Because higher-order terms $\\mathcal{O}(d\\theta^2)$ vanish in the limit $dt \\to 0$, leaving linear matrix addition $[I] + [d\\tilde{\\theta}_1] + [d\\tilde{\\theta}_2]$ which is commutative.",
            "Because cross products are commutative.",
            "Because all matrices commute when their determinants are 1.",
            "Because rigid bodies cannot rotate by finite angles in 3D space."
        ],
        correctIndex: 0,
        explanation: "Lecture #6 Slide 7 & Ginsberg §3.2.2: Finite rotations differ by non-zero commutator $[R_1][R_2] - [R_2][R_1] \\neq 0$. But expanding for infinitesimal angles yields $[R_1][R_2] - [R_2][R_1] = \\mathcal{O}(d\\theta^2) \\to 0$. Dividing by $dt$ gives the commutative vector $\\vec{\\omega} = \\dot{\\vec{\\theta}}$!",
        hint: "Think about the Taylor series expansion of $\\cos(d\\theta) \\approx 1$ and $\\sin(d\\theta) \\approx d\\theta$."
    },

    {
        id: "q29",
        lecture: 6,
        bloomLevel: "Apply",
        question: "A robotic turntable rotates about vertical fixed axis $Z$ at $\\vec{\\omega} = 10\\vec{K}\\text{ rad/s}$. An arm carries a physical vector $\\vec{A} = 2\\vec{i}\\text{ m}$ extending horizontally along the arm. What is the <strong>transport rate of change</strong> $\\vec{\\omega} \\times \\vec{A}$?",
        options: [
            "$20\\vec{i}\\text{ m/s}$",
            "$20\\vec{j}\\text{ m/s}$",
            "$-20\\vec{j}\\text{ m/s}$",
            "$0\\text{ m/s}$"
        ],
        correctIndex: 1,
        explanation: "By the right-hand cyclic cross product rule: $(10\\vec{K}) \\times (2\\vec{i}) = 20(\\vec{k} \\times \\vec{i}) = 20\\vec{j}\\text{ m/s}$!",
        hint: "In a right-handed system, $\\vec{k} \\times \\vec{i} = +\\vec{j}$."
    },

    {
        id: "q30",
        lecture: 6,
        bloomLevel: "Evaluate",
        question: "Why is the time derivative of the angular velocity vector $\\vec{\\omega}$ <strong>identically the same</strong> whether taken with respect to the fixed frame $XYZ$ or the rotating frame $xyz$ ($\\vec{\\alpha} = (\\frac{d\\vec{\\omega}}{dt})_{XYZ} = (\\frac{d\\vec{\\omega}}{dt})_{xyz}$)?",
        options: [
            "Because the angular velocity vector never rotates.",
            "Because the Transport Theorem cross product term $\\vec{\\omega} \\times \\vec{\\omega} \\equiv \\vec{0}$, so the transport correction vanishes identically!",
            "Because only unit vectors have non-zero transport terms.",
            "Because angular acceleration is a scalar quantity."
        ],
        correctIndex: 1,
        explanation: "Lecture #6 Slide 16 & Ginsberg §3.3.2: Applying the Transport Theorem: $(\\frac{d\\vec{\\omega}}{dt})_{XYZ} = (\\frac{d\\vec{\\omega}}{dt})_{xyz} + \\vec{\\omega}\\times\\vec{\\omega}$. Since any vector crossed with itself is zero ($\\vec{\\omega}\\times\\vec{\\omega} = \\vec{0}$), both derivatives are exactly identical!",
        hint: "What is $\\vec{V} \\times \\vec{V}$ for any 3D vector?"
    },

    {
        id: "q31",
        lecture: 7,
        bloomLevel: "Remember",
        question: "What is Jerry Ginsberg's canonical 3-step sequence defining the <strong>Eulerian Angles</strong> in Chapter 4?",
        options: [
            "Precession $\\psi$ about $Z$, Pitch $\\theta$ about $Y$, Roll $\\phi$ about $X$ (Z-Y-X)",
            "Precession $\\psi$ about fixed $Z$, Nutation $\\theta$ about intermediate $y'$, Spin $\\phi$ about body $z''$ (Z-Y-Z)",
            "Rotation about $X$, then $Y$, then $Z$ (X-Y-Z)",
            "Rotation about $Z$, then $X'$, then $Z''$ (Classical Z-X-Z)"
        ],
        correctIndex: 1,
        explanation: "Lecture #7 Slide 1 & Ginsberg §4.2: Ginsberg defines the Eulerian Angles as the 3-step body-fixed Z-Y-Z sequence: (1) Precession $\\psi$ about $Z$, (2) Nutation $\\theta$ about intermediate $y'$, (3) Spin $\\phi$ about body symmetry axis $z''$!",
        hint: "Notice the intermediate axis is $y'$, not $x'$ or $z'$."
    },

    {
        id: "q32",
        lecture: 7,
        bloomLevel: "Understand",
        question: "In Ginsberg's Z-Y-Z Eulerian angle sequence, at what orientation does <strong>Gimbal Lock singularity</strong> occur?",
        options: [
            "When $\\theta = 90^\\circ$ ($\\cos\\theta = 0$)",
            "When $\\theta = 0^\\circ$ or $180^\\circ$ ($\\sin\\theta = 0$)",
            "When $\\psi = 45^\\circ$",
            "When all three angles are equal"
        ],
        correctIndex: 1,
        explanation: "Lecture #7 Slide 10: In Ginsberg's Z-Y-Z convention, when nutation $\\theta = 0$ or $\\pi$, the precession axis $Z$ and the spin axis $z''$ become completely collinear! Precession and spin rotate about the exact same physical axis, causing the loss of 1 rotational degree of freedom.",
        hint: "When nutation is zero, the top of the gyroscope stands straight up."
    },

    {
        id: "q33",
        lecture: 7,
        bloomLevel: "Apply",
        question: "In Ginsberg's Z-Y-Z Eulerian angle representation, what is the body-fixed angular velocity component along the rotor symmetry axis $\\vec{k}$ ($\\omega_z$)?",
        options: [
            "$\\omega_z = \\dot{\\phi}$",
            "$\\omega_z = \\dot{\\psi}\\cos\\theta + \\dot{\\phi}$",
            "$\\omega_z = \\dot{\\psi}\\sin\\theta + \\dot{\\theta}$",
            "$\\omega_z = \\dot{\\psi} + \\dot{\\theta} + \\dot{\\phi}$"
        ],
        correctIndex: 1,
        explanation: "Lecture #7 Slide 5 & Ginsberg Eq. (4.2.12): Precession $\\dot{\\psi}\\vec{K}$ projects onto the body axis $\\vec{k}$ as $\\dot{\\psi}\\cos\\theta$. Adding the rotor spin $\\dot{\\phi}$ along $\\vec{k}$ gives $\\omega_z = \\dot{\\psi}\\cos\\theta + \\dot{\\phi}$!",
        hint: "Project the vertical axis $\\vec{K}$ onto the tilted axis $\\vec{k}$."
    },

    {
        id: "q34",
        lecture: 1,
        bloomLevel: "Apply",
        question: "In Assignment 1 Question 1, British Columbia engineers use Buckets (1 bk = 15 kip), Trips (1 tr = 40 m), and hits (1 ht = 3 s). What is the acceleration due to gravity $g = 9.81\\text{ m/s}^2$ in this wacky unit system?",
        options: [
            "$g = 9.81\\text{ tr/ht}^2$",
            "$g = 2.207\\text{ tr/ht}^2$",
            "$g = 43.60\\text{ tr/ht}^2$",
            "$g = 0.245\\text{ tr/ht}^2$"
        ],
        correctIndex: 1,
        explanation: "Assignment 1 Solutions Q1: $1\\text{ m/s}^2 = (1/40\\text{ tr}) \\times (3^2\\text{ s}^2 / 1\\text{ ht}^2) = \\frac{9}{40}\\text{ tr/ht}^2$. Multiplying $9.81 \\times \\frac{9}{40} = 2.207\\text{ tr/ht}^2$!",
        hint: "Multiply by $(3^2) / 40 = 9/40$."
    },

    {
        id: "q35",
        lecture: 1,
        bloomLevel: "Apply",
        question: "In Tutorial 1 Problem 1, you find the moment vector of a cable force about corner A is $\\vec{M}_A = 7749\\vec{i} - 12034\\vec{k}\\text{ N}\\cdot\\text{m}$. The shaft unit vector is $\\vec{e}_{shaft} = \\cos 75^\\circ\\vec{j} + \\sin 75^\\circ\\vec{k}$. What is the moment about the shaft axis?",
        options: [
            "$M_{shaft} = 7749\\text{ N}\\cdot\\text{m}$",
            "$M_{shaft} = -12034\\text{ N}\\cdot\\text{m}$",
            "$M_{shaft} = -11624\\text{ N}\\cdot\\text{m}$",
            "$M_{shaft} = 0\\text{ N}\\cdot\\text{m}$"
        ],
        correctIndex: 2,
        explanation: "Tutorial 1 Solutions Q1: Project the moment vector onto the shaft unit vector via dot product: $M_{shaft} = \\vec{M}_A \\cdot \\vec{e}_{shaft} = (7749\\vec{i} - 12034\\vec{k}) \\cdot (0\\vec{i} + \\cos 75^\\circ\\vec{j} + \\sin 75^\\circ\\vec{k}) = -12034\\sin 75^\\circ = -11624\\text{ N}\\cdot\\text{m}$!",
        hint: "Take the dot product of $\\vec{M}_A$ with $\\vec{e}_{shaft}$."
    },

    {
        id: "q36",
        lecture: 4,
        bloomLevel: "Analyze",
        question: "In Tutorial 3 Problem 1, bar AB of length $L$ slides on a rising table ($z = L\\cos\\theta$) translating upward at speed $u$ ($\\dot{z} = -u$). What is the angular rate $\\dot{\\theta}$?",
        options: [
            "$\\dot{\\theta} = \\frac{u}{L\\cos\\theta}$",
            "$\\dot{\\theta} = \\frac{u}{L\\sin\\theta}$",
            "$\\dot{\\theta} = -\\frac{u}{L}$",
            "$\\dot{\\theta} = \\frac{u^2}{L^2\\sin\\theta}$"
        ],
        correctIndex: 1,
        explanation: "Tutorial 3 Solutions Q1: Differentiating $z = L\\cos\\theta$ yields $\\dot{z} = -L\\dot{\\theta}\\sin\\theta$. Since the table moves upward, $\\dot{z} = -u$. Equating $-u = -L\\dot{\\theta}\\sin\\theta \\implies \\dot{\\theta} = \\frac{u}{L\\sin\\theta}$!",
        hint: "Differentiate $L\\cos\\theta$ using the chain rule w.r.t time."
    }

];


if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizBank;
}
