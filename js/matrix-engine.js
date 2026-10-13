/**
 * UVic MECH 342 - Dynamics II
 * Mathematical Vector & Matrix Engine
 * Reference: Jerry Ginsberg, "Engineering Dynamics", Chapter 1 & Chapter 3
 */

const MatrixEngine = {
    // Basic 3D Vector Operations
    vecAdd(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    },
    vecSub(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    },
    vecScale(v, s) {
        return [v[0] * s, v[1] * s, v[2] * s];
    },
    dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },
    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    },
    norm(v) {
        return Math.hypot(v[0], v[1], v[2]);
    },
    normalize(v) {
        const n = this.norm(v);
        if (n < 1e-12) return [0, 0, 1];
        return [v[0] / n, v[1] / n, v[2] / n];
    },

    // 3x3 Matrix Operations
    identity() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    },
    multiply(A, B) {
        const C = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
            }
        }
        return C;
    },
    multVec(M, v) {
        return [
            M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
            M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
            M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]
        ];
    },
    transpose(M) {
        return [
            [M[0][0], M[1][0], M[2][0]],
            [M[0][1], M[1][1], M[2][1]],
            [M[0][2], M[1][2], M[2][2]]
        ];
    },
    trace(M) {
        return M[0][0] + M[1][1] + M[2][2];
    },
    det(M) {
        return (
            M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
            M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
            M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
        );
    },

    // Canonical Rotation Matrices (UVic Ginsberg MECH 342 convention: [x'] = [R][x])
    rotX(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        return [
            [1, 0, 0],
            [0, c, s],
            [0, -s, c]
        ];
    },
    rotY(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        return [
            [c, 0, -s],
            [0, 1, 0],
            [s, 0, c]
        ];
    },
    rotZ(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        return [
            [c, s, 0],
            [-s, c, 0],
            [0, 0, 1]
        ];
    },

    getCanonical(axis, rad) {
        if (axis.toLowerCase() === 'x') return this.rotX(rad);
        if (axis.toLowerCase() === 'y') return this.rotY(rad);
        if (axis.toLowerCase() === 'z') return this.rotZ(rad);
        return this.identity();
    },

    // Arbitrary Axis Rotation (Rodrigues / Similarity formulation from Lecture 3 Slide 15)
    // Rotation of angle beta about unit axis u = [ux, uy, uz]
    // Transforms coordinates from initial frame to rotated frame
    rotAxis(u, betaRad) {
        const axis = this.normalize(u);
        const ux = axis[0], uy = axis[1], uz = axis[2];
        const c = Math.cos(betaRad);
        const s = Math.sin(betaRad);
        const omc = 1.0 - c;

        // Ginsberg coordinate transformation matrix SO(3)
        // [x'] = R [x]
        return [
            [c + ux * ux * omc,        ux * uy * omc + uz * s, ux * uz * omc - uy * s],
            [ux * uy * omc - uz * s, c + uy * uy * omc,        uy * uz * omc + ux * s],
            [ux * uz * omc + uy * s, uy * uz * omc - ux * s, c + uz * uz * omc]
        ];
    },

    // Euler's Equivalent Axis Theorem Decomposer (Lecture 3 Slides 16-21)
    // Extracts invariant rotation axis u_beta and finite rotation angle beta from ANY R
    decomposeToAxisAngle(R) {
        const tr = this.trace(R);
        // tr(R) = 1 + 2*cos(beta)
        let cosBeta = (tr - 1.0) / 2.0;
        cosBeta = Math.max(-1.0, Math.min(1.0, cosBeta));
        let beta = Math.acos(cosBeta);

        let axis = [0, 0, 1];

        if (Math.abs(beta) < 1e-7) {
            // Identity / zero rotation
            axis = [0, 0, 1];
            beta = 0;
        } else if (Math.abs(beta - Math.PI) < 1e-4) {
            // 180 degree rotation: R + I = 2 * u * u^T
            const M = [
                [R[0][0] + 1, R[0][1],     R[0][2]],
                [R[1][0],     R[1][1] + 1, R[1][2]],
                [R[2][0],     R[2][1],     R[2][2] + 1]
            ];
            // Pick column with largest norm
            let bestCol = [M[0][0], M[1][0], M[2][0]];
            let bestNorm = this.norm(bestCol);
            for (let j = 1; j < 3; j++) {
                const col = [M[0][j], M[1][j], M[2][j]];
                const n = this.norm(col);
                if (n > bestNorm) {
                    bestNorm = n;
                    bestCol = col;
                }
            }
            axis = this.normalize(bestCol);
        } else {
            // Standard case: skew symmetric part
            // Ginsberg SO(3) [x'] = R [x]:
            // R[0][1] - R[1][0] = 2*uz*sin(beta)
            // R[2][0] - R[0][2] = 2*uy*sin(beta)
            // R[1][2] - R[2][1] = 2*ux*sin(beta)
            const twoSinBeta = 2.0 * Math.sin(beta);
            axis = [
                (R[1][2] - R[2][1]) / twoSinBeta,
                (R[2][0] - R[0][2]) / twoSinBeta,
                (R[0][1] - R[1][0]) / twoSinBeta
            ];
            axis = this.normalize(axis);
        }

        return {
            axis: axis,
            angleRad: beta,
            angleDeg: (beta * 180.0) / Math.PI,
            trace: tr,
            eigenvalue: 1.0
        };
    },

    // Sequence Multiplier:
    // Body-fixed (pre-multiply): R_total = R_N * ... * R_2 * R_1
    // Space-fixed (post-multiply): R_total = R_1 * R_2 * ... * R_N
    composeSequence(steps) {
        // steps is an array of { axis: 'x'|'y'|'z', angleRad: number, type: 'body'|'space' }
        let currentR = this.identity();
        const history = [];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const R_step = this.getCanonical(step.axis, step.angleRad);

            if (step.type === 'body') {
                // Pre-multiply from left: R_new = R_step * currentR
                currentR = this.multiply(R_step, currentR);
            } else {
                // Space-fixed: Post-multiply to right: R_new = currentR * R_step
                currentR = this.multiply(currentR, R_step);
            }

            history.push({
                stepIndex: i + 1,
                stepInfo: step,
                stepMatrix: R_step,
                accumulatedMatrix: currentR
            });
        }

        return {
            finalMatrix: currentR,
            history: history
        };
    },

    // Orthonormality & Property Inspector
    checkOrthonormal(R, eps = 1e-4) {
        const c1 = [R[0][0], R[1][0], R[2][0]];
        const c2 = [R[0][1], R[1][1], R[2][1]];
        const c3 = [R[0][2], R[1][2], R[2][2]];

        const norm1 = this.norm(c1);
        const norm2 = this.norm(c2);
        const norm3 = this.norm(c3);

        const d12 = this.dot(c1, c2);
        const d23 = this.dot(c2, c3);
        const d31 = this.dot(c3, c1);

        const detVal = this.det(R);
        const trVal = this.trace(R);

        const isUnitNorm = Math.abs(norm1 - 1) < eps && Math.abs(norm2 - 1) < eps && Math.abs(norm3 - 1) < eps;
        const isOrthogonal = Math.abs(d12) < eps && Math.abs(d23) < eps && Math.abs(d31) < eps;
        const isProper = Math.abs(detVal - 1.0) < eps;

        return {
            isValid: isUnitNorm && isOrthogonal && isProper,
            colNorms: [norm1, norm2, norm3],
            dotProducts: { d12, d23, d31 },
            det: detVal,
            trace: trVal,
            issues: [
                !isUnitNorm ? 'Columns are not unit length' : null,
                !isOrthogonal ? 'Columns are not mutually perpendicular' : null,
                !isProper ? `Determinant is ${detVal.toFixed(4)} (must be +1.0 for right-handed rotation)` : null
            ].filter(Boolean)
        };
    },

    // Solver for Lecture 2 Slide 15:
    // Missing elements in R given partial knowns
    solveMissingElementsExample() {
        // [ 0.6409, -0.4630,  0.6124 ]
        // [ 0.6409,     c22,     c23 ]
        // [-0.4226,  0.4532,     c33 ]
        // We know:
        // Col 1 is known: [0.6409, 0.6409, -0.4226]^T (norm^2 = 0.41075 + 0.41075 + 0.17859 = 1.00009 ~ 1)
        // Col 2 row 1 and 3 are known: [-0.4630, c22, 0.4532]^T
        // Using ||Col 2|| = 1: c22^2 = 1 - (-0.4630)^2 - (0.4532)^2 = 1 - 0.21437 - 0.20539 = 0.58024 => c22 = +/- 0.7617
        // Also Col 1 . Col 2 = 0: 0.6409*(-0.4630) + 0.6409*(c22) + (-0.4226)*(0.4532) = 0
        // -0.29674 + 0.6409*c22 - 0.19152 = 0 => 0.6409*c22 = 0.48826 => c22 = +0.7618!
        // Col 3 is then Col 1 x Col 2 (or Col 2 x Col 1 depending on right-handed frame):
        const col1 = [0.6409, 0.6409, -0.4226];
        const c22 = 0.7618;
        const col2 = [-0.4630, c22, 0.4532];
        const col3 = this.cross(col1, col2); // for right-handed SO(3) det = +1
        // Form the full matrix:
        return [
            [col1[0], col2[0], col3[0]],
            [col1[1], col2[1], col3[1]],
            [col1[2], col2[2], col3[2]]
        ];
    },

    // Convert matrix to formatted HTML / LaTeX string
    formatMatrixLatex(M, decimals = 4) {
        let str = '\\begin{bmatrix}\n';
        for (let i = 0; i < 3; i++) {
            str += '  ' + M[i].map(val => val.toFixed(decimals)).join(' & ') + (i < 2 ? ' \\\\\n' : '\n');
        }
        str += '\\end{bmatrix}';
        return str;
    },

    formatMatrixHTML(M, decimals = 3) {
        let html = '<table class="matrix-grid">';
        for (let i = 0; i < 3; i++) {
            html += '<tr>';
            for (let j = 0; j < 3; j++) {
                const val = M[i][j];
                const cls = Math.abs(val) < 1e-4 ? 'zero' : val > 0 ? 'pos' : 'neg';
                html += `<td class="matrix-cell ${cls}">${val.toFixed(decimals)}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    },

    // -------------------------------------------------------------
    // Lecture 2 Slide 20: Hydraulic Cylinder Spatial Mechanism Solver
    // -------------------------------------------------------------
    solveHydraulicCylinder(thetaDeg = 36.87, phiDeg = 120, L1 = 400, L2 = 800, armAB = 600) {
        const thRad = (thetaDeg * Math.PI) / 180;
        const phiRad = (phiDeg * Math.PI) / 180;

        // Initial Position (t=0):
        // Shaft AB along fixed +Y axis: r_B1 = [0, armAB, 0]^T
        // Cylinder BC vertical (+Z axis): r_C/B1 = [0, 0, L1]^T
        const r_B1 = [0, armAB, 0];
        const r_CB1 = [0, 0, L1];
        const r_C1 = this.vecAdd(r_B1, r_CB1); // [0, 600, 400]

        // Rotation Sequence to Final Position:
        // 1. Rotation by theta about vertical Z-axis (R_z(theta))
        // 2. Body-fixed rotation about shaft AB (which is current y-axis) by phi (R_y(phi))
        // Overall coordinate transformation matrix from XYZ to frame attached to cylinder:
        const Rz = this.rotZ(thRad);
        const Ry = this.rotY(phiRad);
        // Body-fixed sequence: R_total = Ry * Rz
        const R_tot = this.multiply(Ry, Rz);

        // Position of joint B in global frame:
        // r_B rotates about Z by theta:
        // r_B2 = Rz^T * [0, armAB, 0]^T
        const RzT = this.transpose(Rz);
        const r_B2 = this.multVec(RzT, [0, armAB, 0]);

        // In cylinder-fixed frame, cylinder vector is along its axis [0, 0, L2]^T
        // Transform back to global XYZ: r_CB2 = R_tot^T * [0, 0, L2]^T
        const R_totT = this.transpose(R_tot);
        const r_CB2 = this.multVec(R_totT, [0, 0, L2]);

        const r_C2 = this.vecAdd(r_B2, r_CB2);
        const delta_r_C = this.vecSub(r_C2, r_C1);
        const displacementMagnitude = this.norm(delta_r_C);

        return {
            thetaDeg, phiDeg, L1, L2, armAB,
            r_B1, r_C1,
            r_B2, r_CB2, r_C2,
            delta_r_C,
            displacementMagnitude,
            R_tot
        };
    },

    // -------------------------------------------------------------
    // Lecture 2 Slide 21: Rotated Rectangular Machined Prism Solver
    // -------------------------------------------------------------
    solveRectangularPrism(dimX = 150, dimY = 120, dimZ = 60, th1_deg = 30, th2_deg = 45) {
        const th1_rad = (th1_deg * Math.PI) / 180;
        const th2_rad = (th2_deg * Math.PI) / 180;

        // Body-fixed: 1. Rotate about X by th1 -> Rx(th1)
        //             2. Rotate about new y' by th2 -> Ry(th2)
        // R_tot = Ry(th2) * Rx(th1)
        const Rx = this.rotX(th1_rad);
        const Ry = this.rotY(th2_rad);
        const R_tot = this.multiply(Ry, Rx);

        // Point E in original block XYZ:
        // From slide figure: length 150 along X, width 120 along Y, height 60 along Z
        // E is at [0, 120, 60] mm
        const r_E_XYZ = [0, dimY, dimZ];
        // Coordinates in terms of rotated frame xyz: [r]_xyz = [R_tot] * [r]_XYZ
        const r_E_xyz = this.multVec(R_tot, r_E_XYZ);

        return {
            dimX, dimY, dimZ,
            th1_deg, th2_deg,
            r_E_XYZ,
            r_E_xyz,
            R_tot
        };
    },

    // -------------------------------------------------------------
    // Ginsberg Eulerian Angles (Z-Y-Z Sequence) & Singularity
    // Reference: Ginsberg Section 4.2 & Lecture #7
    // Sequence: 1. Precession psi about Z, 2. Nutation theta about y', 3. Spin phi about z''
    // -------------------------------------------------------------
    eulerZYZ(psiDeg, thetaDeg, phiDeg) {
        const psi = (psiDeg * Math.PI) / 180;
        const th = (thetaDeg * Math.PI) / 180;
        const phi = (phiDeg * Math.PI) / 180;

        const c_psi = Math.cos(psi), s_psi = Math.sin(psi);
        const c_th  = Math.cos(th),  s_th  = Math.sin(th);
        const c_phi = Math.cos(phi), s_phi = Math.sin(phi);

        const Rz_psi = this.rotZ(psi);
        const Ry_th  = this.rotY(th);
        const Rz_phi = this.rotZ(phi);

        // Body fixed: [R] = [Rz(phi)] * [Ry(theta)] * [Rz(psi)]
        const R = this.multiply(Rz_phi, this.multiply(Ry_th, Rz_psi));

        return {
            psiDeg, thetaDeg, phiDeg,
            psi, theta: th, phi,
            R,
            // Analytical components of Ginsberg's rotation matrix (Slide 7)
            R_analytic: [
                [
                    c_psi * c_th * c_phi - s_psi * s_phi,
                    s_psi * c_th * c_phi + c_psi * s_phi,
                    -s_th * c_phi
                ],
                [
                    -c_psi * c_th * s_phi - s_psi * c_phi,
                    -s_psi * c_th * s_phi + c_psi * c_phi,
                    s_th * s_phi
                ],
                [
                    c_psi * s_th,
                    s_psi * s_th,
                    c_th
                ]
            ],
            // Singularity check: sin(theta) = 0 (Gimbal lock in Z-Y-Z)
            isSingular: Math.abs(s_th) < 1e-4,
            singularityNote: Math.abs(s_th) < 1e-4 ?
                "GIMBAL LOCK SINGULARITY: sin(theta) ≈ 0. The precession axis (Z) and spin axis (z'') are collinear! Degrees of freedom degenerate into (psi + phi)." :
                "Nominal: All 3 rotational degrees of freedom are well-conditioned."
        };
    },

    // Inverse Eulerian Angles Solver: Extract (psi, theta, phi) from [R]
    // Reference: Ginsberg Section 4.2 & Lecture #7 Slide 10
    inverseZYZ(R) {
        const r13 = R[0][2];
        const r23 = R[1][2];
        const r33 = R[2][2];
        const r31 = R[2][0];
        const r32 = R[2][1];

        // cos(theta) = R_33
        // sin(theta) = ±sqrt(R_13^2 + R_23^2)
        const s_th = Math.sqrt(r13 * r13 + r23 * r23);
        const thetaRad = Math.atan2(s_th, r33);
        const thetaDeg = (thetaRad * 180) / Math.PI;

        if (s_th < 1e-5) {
            // Singular state (Gimbal lock)
            // R simplifies to rotation by (psi + phi) or (psi - phi)
            const sumAngleRad = Math.atan2(R[0][1], R[0][0]);
            return {
                isSingular: true,
                thetaDeg,
                thetaRad,
                psiDeg: 0,
                phiDeg: (sumAngleRad * 180) / Math.PI,
                note: "Singularity at theta ≈ 0° or 180°. Precession and spin axes align; only (psi + phi) can be uniquely identified."
            };
        }

        // phi = atan2(R_23, -R_13)
        const phiRad = Math.atan2(r23, -r13);
        const phiDeg = (phiRad * 180) / Math.PI;

        // psi = atan2(R_31, R_32)
        const psiRad = Math.atan2(r31, r32);
        const psiDeg = (psiRad * 180) / Math.PI;

        return {
            isSingular: false,
            thetaDeg,
            thetaRad,
            phiDeg,
            phiRad,
            psiDeg,
            psiRad,
            note: "Unique solution extracted successfully via atan2 quadrant disambiguation."
        };
    },

    // Body-Fixed Angular Velocity in Z-Y-Z Eulerian Angles
    // omega = (-dot_psi * sin(theta) * cos(phi) + dot_theta * sin(phi)) * i
    //       + (dot_psi * sin(theta) * sin(phi) + dot_theta * cos(phi)) * j
    //       + (dot_psi * cos(theta) + dot_phi) * k
    eulerZYZOms(psiRad, thRad, phiRad, dotPsi, dotTh, dotPhi) {
        const s_th = Math.sin(thRad), c_th = Math.cos(thRad);
        const s_phi = Math.sin(phiRad), c_phi = Math.cos(phiRad);

        const om_x = -dotPsi * s_th * c_phi + dotTh * s_phi;
        const om_y = dotPsi * s_th * s_phi + dotTh * c_phi;
        const om_z = dotPsi * c_th + dotPhi;

        return [om_x, om_y, om_z];
    },

    // -------------------------------------------------------------
    // Curvilinear Coordinates Kinematics Engine (Lecture 4 - Ginsberg §2.2)
    // -------------------------------------------------------------
    cylindricalKinematics(R, dotR, ddotR, thetaRad, dotTh, ddotTh, z, dotZ, ddotZ) {
        // Basis: e_R, e_theta, e_z
        // Velocity: v = dot_R * e_R + R * dot_th * e_theta + dot_z * e_z
        const v_R = dotR;
        const v_theta = R * dotTh;
        const v_z = dotZ;
        const speed = Math.hypot(v_R, v_theta, v_z);

        // Acceleration:
        // a_R = ddot_R - R * dot_th^2
        // a_theta = R * ddot_th + 2 * dot_R * dot_th
        // a_z = ddot_z
        const a_R = ddotR - R * dotTh * dotTh;
        const a_theta = R * ddotTh + 2 * dotR * dotTh;
        const a_z = ddotZ;
        const accelMag = Math.hypot(a_R, a_theta, a_z);

        // Dissect acceleration terms for teaching:
        const centripetal = -R * dotTh * dotTh;
        const coriolis = 2 * dotR * dotTh;
        const tangential = R * ddotTh;
        const radialRel = ddotR;

        return {
            velocity: [v_R, v_theta, v_z],
            speed,
            acceleration: [a_R, a_theta, a_z],
            accelMag,
            breakdown: {
                radialRel,
                centripetal,
                tangential,
                coriolis,
                axial: ddotZ
            }
        };
    },

    sphericalKinematics(r, dotR, ddotR, phiRad, dotPhi, ddotPhi, thetaRad, dotTh, ddotTh) {
        // Ginsberg §2.2 convention: r (radius), phi (colatitude/elevation from Z), theta (azimuth)
        const s_phi = Math.sin(phiRad);
        const c_phi = Math.cos(phiRad);

        // Velocity: v = dot_r * e_r + r * dot_phi * e_phi + r * sin(phi) * dot_th * e_theta
        const v_r = dotR;
        const v_phi = r * dotPhi;
        const v_th = r * s_phi * dotTh;
        const speed = Math.hypot(v_r, v_phi, v_th);

        // Acceleration:
        const a_r = ddotR - r * dotPhi * dotPhi - r * s_phi * s_phi * dotTh * dotTh;
        const a_phi = r * ddotPhi + 2 * dotR * dotPhi - r * s_phi * c_phi * dotTh * dotTh;
        const a_th = r * s_phi * ddotTh + 2 * dotR * s_phi * dotTh + 2 * r * c_phi * dotPhi * dotTh;
        const accelMag = Math.hypot(a_r, a_phi, a_th);

        return {
            velocity: [v_r, v_phi, v_th],
            speed,
            acceleration: [a_r, a_phi, a_th],
            accelMag,
            scaleFactors: {
                h_r: 1,
                h_phi: r,
                h_th: r * s_phi
            }
        };
    },

    // -------------------------------------------------------------
    // Path Variables (Frenet-Serret) Engine (Lecture 5 - Ginsberg §2.3)
    // -------------------------------------------------------------
    frenetKinematics(v, dotV, rho) {
        // Velocity is purely tangent: v = v * e_t
        // Acceleration: a = dot_v * e_t + (v^2 / rho) * e_n + 0 * e_b
        const a_t = dotV;
        const a_n = (rho > 1e-6) ? (v * v) / rho : 0;
        const a_b = 0; // Strictly zero in Frenet-Serret!
        const a_mag = Math.hypot(a_t, a_n);

        return {
            a_t, a_n, a_b, a_mag,
            curvature: (rho > 1e-6) ? 1 / rho : 0
        };
    },

    // Radius of Curvature from 3D Cartesian Velocity & Acceleration
    // rho = |v|^3 / |v x a|
    calcRadiusOfCurvature(vVec, aVec) {
        const speed = this.norm(vVec);
        const crossVA = this.cross(vVec, aVec);
        const crossMag = this.norm(crossVA);
        if (crossMag < 1e-9) return Infinity; // Straight path
        const rho = Math.pow(speed, 3) / crossMag;
        const e_t = this.normalize(vVec);
        const e_b = this.normalize(crossVA);
        const e_n = this.cross(e_b, e_t); // Principal normal pointing toward center of curvature
        return {
            rho,
            speed,
            curvature: 1 / rho,
            e_t,
            e_n,
            e_b
        };
    },

    // -------------------------------------------------------------
    // Transport Theorem Engine (Lecture 6 - Ginsberg §3.2.2)
    // (dA/dt)_XYZ = (dA/dt)_xyz + omega x A
    // -------------------------------------------------------------
    transportTheorem(dAdt_rel, omega, A) {
        const transportTerm = this.cross(omega, A);
        const dAdt_XYZ = this.vecAdd(dAdt_rel, transportTerm);
        return {
            dAdt_rel,
            transportTerm,
            dAdt_XYZ
        };
    },

    // 5-Term Spatial Acceleration Equation (Ginsberg §3.4)
    // a_P = a_O + alpha x r + omega x (omega x r) + 2*omega x v_rel + a_rel
    spatialAcceleration5Term(aO, alpha, rPO, omega, vRel, aRel) {
        const eulerTerm = this.cross(alpha, rPO);
        const centripetalTerm = this.cross(omega, this.cross(omega, rPO));
        const coriolisTerm = this.vecScale(this.cross(omega, vRel), 2);
        
        let aP = this.vecAdd(aO, eulerTerm);
        aP = this.vecAdd(aP, centripetalTerm);
        aP = this.vecAdd(aP, coriolisTerm);
        aP = this.vecAdd(aP, aRel);

        return {
            aP,
            terms: {
                baseAccel: aO,
                euler: eulerTerm,
                centripetal: centripetalTerm,
                coriolis: coriolisTerm,
                relative: aRel
            }
        };
    },

    // -------------------------------------------------------------
    // Assignment 1 Interactive Solvers (UVic MECH 342)
    // -------------------------------------------------------------
    solveAsg1Q1(F_bk = 6.5, a_tr_ht2 = 4.0) {
        // 1 bk = 15 kip = 15 * 4448.2216 N = 66,723.324 N
        // 1 tr = 40 m
        // 1 ht = 3 s
        const F_N_per_bk = 15 * 4448.2216;
        const m_per_tr = 40;
        const s_per_ht = 3;

        // F = m * a => m_wacky = F / a
        const m_wacky = F_bk / a_tr_ht2; // (bk * ht^2) / tr

        // 1 (bk * ht^2)/tr = (66,723.324 N * 9 s^2) / (40 m) = 15,012.75 kg
        // Using Dr. Buckham's exact factor (1 kip = 4.44 kN):
        // 15 * 4440 * 9 / 40 = 14,985 kg
        const kg_per_wacky_unit = (15 * 4440 * 9) / 40;
        const m_kg = m_wacky * kg_per_wacky_unit;

        // g = 9.81 m/s^2 to wacky:
        // 1 m/s^2 = (1/40 tr) / (1/9 ht^2) = 9/40 tr/ht^2
        const g_wacky = 9.81 * (9 / 40);

        return {
            F_bk, a_tr_ht2,
            m_wacky: m_wacky.toFixed(4),
            m_kg: m_kg.toFixed(2),
            g_wacky: g_wacky.toFixed(4),
            steps: [
                `Step 1: Newton's 2nd Law in BC coal mining units: $F = m a \\implies m = \\frac{${F_bk}}{${a_tr_ht2}} = ${m_wacky.toFixed(4)} \\text{ }\\frac{\\text{bk}\\cdot\\text{ht}^2}{\\text{tr}}$`,
                `Step 2: Conversion to SI: $1\\text{ bk} = 15\\text{ kip} = 15 \\times 4.44\\times 10^3\\text{ N}$, $1\\text{ tr} = 40\\text{ m}$, $1\\text{ ht} = 3\\text{ s}$.`,
                `Conversion factor: $\\frac{(15 \\times 4.44\\times 10^3\\text{ N})(3^2\\text{ s}^2)}{40\\text{ m}} = 14,985\\text{ kg}$.`,
                `Mass in kg: $m = ${m_wacky.toFixed(4)} \\times 14,985 = ${m_kg.toFixed(2)}\\text{ kg} \\approx 24.35\\times 10^3\\text{ kg}$.`,
                `Step 3: Acceleration due to gravity: $g = 9.81\\text{ m/s}^2 \\times \\frac{1\\text{ tr}}{40\\text{ m}} \\times \\frac{3^2\\text{ s}^2}{1\\text{ ht}^2} = 9.81 \\times \\frac{9}{40} = ${g_wacky.toFixed(3)}\\text{ tr/ht}^2$.`
            ]
        };
    },

    solveAsg1Q2(phiDeg = 37) {
        // Bearings A & D, shaft direction B->C aligned with +Y
        // alpha = atan(-100/250) = -21.801 deg
        // beta = atan(-200 / sqrt(100^2 + 250^2)) = -36.604 deg
        const alpha = Math.atan2(-100, 250);
        const beta = Math.atan2(-200, Math.sqrt(100 * 100 + 250 * 250));
        const phi = (-phiDeg * Math.PI) / 180; // sense of rotation

        const Rz_alpha = this.rotZ(alpha);
        const Rx_beta  = this.rotX(beta);
        const Ry_phi   = this.rotY(phi);

        // Transformation: [R_Z(alpha)]^T * [R_X(beta)]^T * [R_Y(phi)] * [R_X(beta)] * [R_Z(alpha)]
        const R_align = this.multiply(Rx_beta, Rz_alpha);
        const R_rot = this.multiply(Ry_phi, R_align);
        const R_final = this.multiply(this.transpose(R_align), R_rot);

        const rP0 = [50, 250, 0];
        const rP_f = this.multVec(R_final, rP0);

        return {
            phiDeg,
            alphaDeg: (alpha * 180 / Math.PI).toFixed(4),
            betaDeg: (beta * 180 / Math.PI).toFixed(4),
            rP_f: [rP_f[0].toFixed(3), rP_f[1].toFixed(3), rP_f[2].toFixed(3)],
            R_final
        };
    },

    solveAsg1Q3() {
        // Bent rod rotations: 30 deg about AC (65 deg from X), then 60 deg about AB
        const Rz_neg65 = this.rotZ((-65 * Math.PI) / 180);
        const Rx_30 = this.rotX((30 * Math.PI) / 180);
        const Rx_60 = this.rotX((60 * Math.PI) / 180);

        // [x'/y'/z'] = [Rz(-65)]^T * [Rx(30)] * [Rz(-65)] * [X/Y/Z]
        // [x/y/z] = [Rx(60)] * [x'/y'/z']
        const step1 = this.multiply(Rx_30, Rz_neg65);
        const step2 = this.multiply(this.transpose(Rz_neg65), step1);
        const R_tot = this.multiply(Rx_60, step2);

        return {
            R_tot,
            formula: "[R] = [R_x(60^\\circ)] [R_z(-65^\\circ)]^T [R_x(30^\\circ)] [R_z(-65^\\circ)]"
        };
    },

    solveAsg1Q4(thetaDeg = 120, phiDeg = -70) {
        const thRad = (thetaDeg * Math.PI) / 180;
        const phiRad = (phiDeg * Math.PI) / 180;

        // Position of C initial:
        const rC0 = [400 - 400 * Math.cos(50 * Math.PI / 180), 400 * Math.sin(50 * Math.PI / 180), 0];
        const Rx_th = this.rotX(thRad);
        const rCf = this.multVec(this.transpose(Rx_th), rC0);
        const delta_rC = this.vecSub(rCf, rC0);

        // Position of D relative to C:
        const rD_rel_C_xyz = [0, -200, 0];
        const Rz_neg50 = this.rotZ((-50 * Math.PI) / 180);
        const Rx_phi = this.rotX(phiRad);

        // Initial rD_rel_C in XYZ (theta=0, phi=0):
        const rD_rel_C_0 = this.multVec(this.transpose(Rz_neg50), rD_rel_C_xyz);
        const rD_0 = this.vecAdd(rC0, rD_rel_C_0);

        // Final rD_rel_C in XYZ:
        // [R] = [Rx(th)]^T * [Rz(-50)]^T * [Rx(phi)]^T
        const R_trans = this.multiply(this.transpose(Rx_th), this.multiply(this.transpose(Rz_neg50), this.transpose(Rx_phi)));
        const rD_rel_C_f = this.multVec(R_trans, rD_rel_C_xyz);
        const rD_f = this.vecAdd(rCf, rD_rel_C_f);

        const delta_rD = this.vecSub(rD_f, rD_0);

        return {
            thetaDeg, phiDeg,
            rC0: rC0.map(v => v.toFixed(3)),
            rCf: rCf.map(v => v.toFixed(3)),
            delta_rC: delta_rC.map(v => v.toFixed(3)),
            rD_0: rD_0.map(v => v.toFixed(3)),
            rD_f: rD_f.map(v => v.toFixed(3)),
            delta_rD: delta_rD.map(v => v.toFixed(3))
        };
    },

    solveAsg1Q6(thetaDeg = 30, psiDeg = 75) {
        const thRad = (thetaDeg * Math.PI) / 180;
        const psiRad = (psiDeg * Math.PI) / 180;

        const Rx_negTh = this.rotX(-thRad);
        const Rz_psi = this.rotZ(psiRad);

        // [R] = [Rx(-theta)]^T * [Rz(psi)] * [Rx(-theta)]
        const step1 = this.multiply(Rz_psi, Rx_negTh);
        const R = this.multiply(this.transpose(Rx_negTh), step1);

        const R22 = R[1][1];
        const beta_yY_deg = (Math.acos(Math.max(-1, Math.min(1, R22))) * 180) / Math.PI;

        return {
            thetaDeg, psiDeg,
            R,
            R22: R22.toFixed(4),
            beta_yY_deg: beta_yY_deg.toFixed(2)
        };
    },

    // -------------------------------------------------------------
    // Tutorial 1 Solvers (UVic MECH 342)
    // -------------------------------------------------------------
    solveTut1Q1(T = 5000) {
        // Plate 4m x 3m, fastened at A, inclined vertical shaft at 75 deg
        // r_C/A = 2 i + 2(cos 75 deg j + sin 75 deg k)
        // r_B/A = 4 j
        const cos75 = Math.cos((75 * Math.PI) / 180);
        const sin75 = Math.sin((75 * Math.PI) / 180);

        const r_C_A = [2, 2 * cos75, 2 * sin75];
        const r_B_A = [0, 4, 0];
        const r_C_B = this.vecSub(r_C_A, r_B_A); // [2, 2*cos75 - 4, 2*sin75]
        const e_C_B = this.normalize(r_C_B);

        const F = this.vecScale(e_C_B, T);
        const M_A = this.cross(r_B_A, F);

        const e_shaft = [0, cos75, sin75];
        const M_shaft = this.dot(M_A, e_shaft);

        return {
            T,
            e_C_B: e_C_B.map(v => v.toFixed(4)),
            F: F.map(v => v.toFixed(1)),
            M_A: M_A.map(v => v.toFixed(1)),
            M_shaft: M_shaft.toFixed(1)
        };
    },

    solveTut3Q1(L = 1.0, Omega = 2.0, u = 0.5, thetaDeg = 45) {
        // Vertical shaft rotating at Omega, bar AB length L sliding on rising table speed u
        const thRad = (thetaDeg * Math.PI) / 180;
        const s_th = Math.sin(thRad);
        const c_th = Math.cos(thRad);

        // z = L cos(th) => z_dot = -u = -L th_dot sin(th)
        const dotTh = u / (L * s_th);
        const ddotTh = -(dotTh * dotTh) * (c_th / s_th);

        // Cylindrical coordinates of B:
        // R = L sin(th), dot_R = L dotTh cos(th) = u cot(th)
        // ddot_R = L ddotTh cos(th) - L dotTh^2 sin(th) = -u^2 / (L sin^3(th))
        const R = L * s_th;
        const dotR = u * (c_th / s_th);
        const ddotR = -(u * u) / (L * Math.pow(s_th, 3));

        // Velocity: v = dotR e_R + R Omega e_theta - u e_z
        const v = [dotR, R * Omega, -u];
        // Acceleration:
        // a_R = ddotR - R Omega^2
        // a_theta = 2 dotR Omega (since Omega is constant)
        // a_z = 0
        const a_R = ddotR - R * Omega * Omega;
        const a_theta = 2 * dotR * Omega;
        const a_z = 0;

        return {
            thetaDeg,
            dotTh: dotTh.toFixed(4),
            ddotTh: ddotTh.toFixed(4),
            v: v.map(n => n.toFixed(3)),
            a: [a_R.toFixed(3), a_theta.toFixed(3), a_z.toFixed(3)],
            speed: Math.hypot(...v).toFixed(3),
            accelMag: Math.hypot(a_R, a_theta, a_z).toFixed(3)
        };
    },

    solveTut3Q2(betaDeg = 53.13, z = 0.24, t = 0.5) {
        // Block sliding in cone apex angle beta
        // Angular momentum conserved: R^2 dot_th = 5 m^2/s
        // Vertical motion: z = 0.99 - 3t^2 => dot_z = -6t = -3, ddot_z = -6
        const dotZ = -6 * t;
        const ddotZ = -6;

        const betaRad = (betaDeg * Math.PI) / 180;
        const tanBeta = Math.tan(betaRad); // 4/3 approx
        const cosBeta = Math.cos(betaRad); // 3/5 = 0.6
        const sinBeta = Math.sin(betaRad); // 4/5 = 0.8

        // (a) Spherical: r = z / cos(beta)
        const r = z / cosBeta;
        const dotR = dotZ / cosBeta;
        const ddotR = ddotZ / cosBeta;

        // dot_th = 5 / R^2 = 5 / (r sin beta)^2 = 7.8125 / r^2
        const dotTh = 5 / Math.pow(r * sinBeta, 2);
        const ddotTh = -2 * (dotTh / r) * dotR;

        const v_sph = [dotR, 0, r * sinBeta * dotTh];
        const a_r_sph = ddotR - r * Math.pow(sinBeta * dotTh, 2);
        const a_phi_sph = -r * sinBeta * cosBeta * dotTh * dotTh;
        const a_th_sph = 0; // conserved angular momentum

        // (b) Cylindrical: R = z tan beta
        const R = z * tanBeta;
        const dotR_cyl = dotZ * tanBeta;
        const ddotR_cyl = ddotZ * tanBeta;

        const v_cyl = [dotR_cyl, R * dotTh, dotZ];
        const a_R_cyl = ddotR_cyl - R * dotTh * dotTh;
        const a_th_cyl = 0;
        const a_z_cyl = ddotZ;

        return {
            betaDeg, z, t,
            spherical: {
                r: r.toFixed(3),
                dotR: dotR.toFixed(3),
                ddotR: ddotR.toFixed(3),
                dotTh: dotTh.toFixed(3),
                v: v_sph.map(n => n.toFixed(2)),
                a: [a_r_sph.toFixed(2), a_phi_sph.toFixed(2), a_th_sph.toFixed(2)]
            },
            cylindrical: {
                R: R.toFixed(3),
                dotR: dotR_cyl.toFixed(3),
                ddotR: ddotR_cyl.toFixed(3),
                v: v_cyl.map(n => n.toFixed(2)),
                a: [a_R_cyl.toFixed(2), a_th_cyl.toFixed(2), a_z_cyl.toFixed(2)]
            }
        };
    }
};

// Export if in Node/module context
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixEngine;
}

