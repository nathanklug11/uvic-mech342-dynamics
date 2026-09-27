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
    // Euler Angle Conventions: Z-Y-X (Tait-Bryan) & Z-X-Z (Classical)
    // -------------------------------------------------------------
    eulerZYX(yawDeg, pitchDeg, rollDeg) {
        const yRad = (yawDeg * Math.PI) / 180;
        const pRad = (pitchDeg * Math.PI) / 180;
        const rRad = (rollDeg * Math.PI) / 180;

        const Rz = this.rotZ(yRad);
        const Ry = this.rotY(pRad);
        const Rx = this.rotX(rRad);

        // Body-fixed: Rx(roll) * Ry(pitch) * Rz(yaw)
        return this.multiply(Rx, this.multiply(Ry, Rz));
    },

    eulerZXZ(psiDeg, thetaDeg, phiDeg) {
        const psiRad = (psiDeg * Math.PI) / 180;
        const thRad = (thetaDeg * Math.PI) / 180;
        const phiRad = (phiDeg * Math.PI) / 180;

        const Rz1 = this.rotZ(psiRad);
        const Rx = this.rotX(thRad);
        const Rz2 = this.rotZ(phiRad);

        // Body-fixed: Rz2(phi) * Rx(theta) * Rz1(psi)
        return this.multiply(Rz2, this.multiply(Rx, Rz1));
    },

    detectGimbalLock(pitchDeg) {
        const isLocked = Math.abs(Math.abs(pitchDeg) - 90) < 1.0;
        return {
            isLocked,
            alignedAxes: isLocked ? "Yaw (Z) and Roll (X) gimbals are co-planar!" : "All 3 degrees of freedom independent",
            description: isLocked ? "Pitch reached \u00B190\u00B0: Inner and outer gimbal rings aligned. A degree of freedom is lost (Gimbal Lock)!" : "Nominal 3D rotation envelope."
        };
    },

    // -------------------------------------------------------------
    // Step-by-Step Matrix Multiplication Explainer
    // -------------------------------------------------------------
    explainMultiplicationStep(A, B, row, col) {
        const term0 = `${A[row][0].toFixed(3)} \u00D7 ${B[0][col].toFixed(3)} = ${(A[row][0] * B[0][col]).toFixed(3)}`;
        const term1 = `${A[row][1].toFixed(3)} \u00D7 ${B[1][col].toFixed(3)} = ${(A[row][1] * B[1][col]).toFixed(3)}`;
        const term2 = `${A[row][2].toFixed(3)} \u00D7 ${B[2][col].toFixed(3)} = ${(A[row][2] * B[2][col]).toFixed(3)}`;
        const sum = A[row][0] * B[0][col] + A[row][1] * B[1][col] + A[row][2] * B[2][col];

        return {
            row, col,
            formula: `C_{${row+1}${col+1}} = A_{${row+1}1} B_{1${col+1}} + A_{${row+1}2} B_{2${col+1}} + A_{${row+1}3} B_{3${col+1}}`,
            calculation: `(${term0}) + (${term1}) + (${term2}) = ${sum.toFixed(4)}`,
            result: sum
        };
    }
};

// Export if in Node/module context
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixEngine;
}
