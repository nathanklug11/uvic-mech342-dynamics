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
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizBank;
}
