/**
 * UVic MECH 342 - Dynamics II
 * MATLAB & Python Companion Code Lab
 * Production-ready computational scripts for Dr. Buckham's course assignments
 */

const CodeLab = {
    snippets: [
        {
            id: "lec0-kinematics",
            title: "Lecture 0: Multi-Frame Spatial Kinematics",
            description: "Solves for the position and velocity of point Q traversing a rotating parabolic slot (Slide 3).",
            matlab: `% UVic MECH 342 - Lecture 0 Kinematics Problem
% Solves position and velocity of point Q on rotating parabola

clear; clc; close all;

t = 0; % Evaluation time (s)

% 1. Point P kinematics
r_P = [3 - 1*t; 5 - 1*t; 2];      % Position of P in XYZ (m)
v_P = [-1; -1; 0];                % Velocity of P in XYZ (m/s)

% 2. Moving frame rotation (about Z-axis)
psi = 0.52 + 0.2*t;               % Rotation angle (rad)
psi_dot = 0.2;                    % Spin rate (rad/s)
omega_frame = [0; 0; psi_dot];    % Angular velocity of frame xyz

% Canonical rotation matrix: transforms components from XYZ to xyz
R_z = [ cos(psi),  sin(psi), 0;
       -sin(psi),  cos(psi), 0;
               0,         0, 1];

% 3. Point Q kinematics relative to P in frame xyz
x_q = 3 - 1.2*t;
y_q = x_q^2;
r_Q_rel_xyz = [x_q; y_q; 0];

% Time derivative of relative position in frame xyz (observed velocity)
x_q_dot = -1.2;
y_q_dot = 2 * x_q * x_q_dot;
v_rel_xyz = [x_q_dot; y_q_dot; 0];

% 4. Transform relative velocity to global XYZ and add frame rotation
% v_Q = v_P + R_z' * v_rel_xyz + cross(omega_frame, R_z' * r_Q_rel_xyz)
r_Q_rel_XYZ = R_z' * r_Q_rel_xyz;
v_rel_XYZ   = R_z' * v_rel_xyz;
v_Q = v_P + v_rel_XYZ + cross(omega_frame, r_Q_rel_XYZ);

fprintf('=== MECH 342 LECTURE 0 RESULTS AT t = %.2f s ===\\n', t);
fprintf('Position of Q in XYZ: [%.4f, %.4f, %.4f] m\\n', (r_P + r_Q_rel_XYZ));
fprintf('Velocity of Q in XYZ: [%.4f, %.4f, %.4f] m/s\\n', v_Q);
fprintf('Total speed |v_Q|:    %.4f m/s\\n', norm(v_Q));`,

            python: `# UVic MECH 342 - Lecture 0 Kinematics Problem (Python)
import numpy as np

t = 0.0

# 1. Point P kinematics
r_P = np.array([3.0 - 1.0*t, 5.0 - 1.0*t, 2.0])
v_P = np.array([-1.0, -1.0, 0.0])

# 2. Frame rotation
psi = 0.52 + 0.2 * t
psi_dot = 0.2
omega = np.array([0.0, 0.0, psi_dot])

# Canonical R_z (Ginsberg coordinate transform)
R_z = np.array([
    [ np.cos(psi),  np.sin(psi), 0.0],
    [-np.sin(psi),  np.cos(psi), 0.0],
    [        0.0,          0.0, 1.0]
])

# 3. Relative motion in xyz
x_q = 3.0 - 1.2 * t
y_q = x_q**2
r_rel_xyz = np.array([x_q, y_q, 0.0])

x_dot = -1.2
y_dot = 2.0 * x_q * x_dot
v_rel_xyz = np.array([x_dot, y_dot, 0.0])

# 4. Total absolute velocity
r_rel_XYZ = R_z.T @ r_rel_xyz
v_rel_XYZ = R_z.T @ v_rel_xyz
v_Q = v_P + v_rel_XYZ + np.cross(omega, r_rel_XYZ)

print(f"Position Q [m]: {r_P + r_rel_XYZ}")
print(f"Velocity Q [m/s]: {v_Q}")
print(f"Speed |v_Q|: {np.linalg.norm(v_Q):.4f} m/s")`
        },

        {
            id: "lec2-canonical",
            title: "Lecture 2: Canonical Matrices & Body-Fixed Sequences",
            description: "Implements canonical rotation matrices with Ginsberg sign conventions and composes body-fixed sequences via pre-multiplication.",
            matlab: `% UVic MECH 342 - Canonical Rotation Functions & Body-Fixed Sequencing
clear; clc;

% Define canonical rotation matrices: [x'] = [R][x]
Rx = @(th) [1,       0,        0; 
            0, cos(th),  sin(th); 
            0, -sin(th), cos(th)];

Ry = @(th) [ cos(th), 0, -sin(th); 
                   0, 1,        0; 
             sin(th), 0,  cos(th)]; % Note upper-right negative sign!

Rz = @(th) [ cos(th),  sin(th), 0; 
            -sin(th),  cos(th), 0; 
                   0,        0, 1];

% Example: Sequence of 2 Body-Fixed Rotations (Slide 16-18)
% 1. Rotate about x by 30 deg
% 2. Rotate about new y by 45 deg
th_x = deg2rad(30);
th_y = deg2rad(45);

% PRE-MULTIPLY for body-fixed sequences!
R_total = Ry(th_y) * Rx(th_x);

fprintf('Body-Fixed Rotation Matrix R:\\n');
disp(R_total);

% Verify Orthonormality
fprintf('det(R) = %.6f (must be 1.0)\\n', det(R_total));
fprintf('norm(R*R'' - I) = %.2e (must be 0)\\n', norm(R_total*R_total' - eye(3)));`,

            python: `# UVic MECH 342 - Canonical Rotations & Body-Fixed Sequencing (Python)
import numpy as np

def Rx(th):
    c, s = np.cos(th), np.sin(th)
    return np.array([[1, 0, 0], [0, c, s], [0, -s, c]])

def Ry(th):
    c, s = np.cos(th), np.sin(th)
    return np.array([[c, 0, -s], [0, 1, 0], [s, 0, c]])

def Rz(th):
    c, s = np.cos(th), np.sin(th)
    return np.array([[c, s, 0], [-s, c, 0], [0, 0, 1]])

# Body-fixed sequence: Rotate X by 30 deg, then new Y by 45 deg
th_x, th_y = np.radians(30), np.radians(45)
# PRE-MULTIPLY:
R_total = Ry(th_y) @ Rx(th_x)

print("Body-Fixed Rotation Matrix R:")
print(np.round(R_total, 4))
print(f"det(R) = {np.linalg.det(R_total):.6f}")`
        },

        {
            id: "lec2-puzzle",
            title: "Lecture 2: Slide 15 Matrix Completion Puzzle Solver",
            description: "Automatically computes missing elements of a rotation matrix using orthonormality constraints.",
            matlab: `% UVic MECH 342 - Slide 15 Matrix Completion Puzzle Solver
% Given partial matrix R:
% [ 0.6409, -0.4630,  0.6124 ]
% [ 0.6409,     c22,     c23 ]
% [-0.4226,  0.4532,     c33 ]

clear; clc;

col1 = [0.6409; 0.6409; -0.4226];
col2_known = [-0.4630; NaN; 0.4532];

% 1. Enforce orthogonality between Col 1 and Col 2: dot(col1, col2) = 0
% col1(1)*col2(1) + col1(2)*c22 + col1(3)*col2(3) = 0
c22 = -(col1(1)*col2_known(1) + col1(3)*col2_known(3)) / col1(2);
col2 = [-0.4630; c22; 0.4532];

% 2. In a right-handed frame (det(R) = +1), Col 3 is the cross product:
col3 = cross(col1, col2);

R_complete = [col1, col2, col3];

fprintf('=== COMPLETED ROTATION MATRIX ===\\n');
disp(R_complete);
fprintf('Solved c22 = %.4f\\n', c22);
fprintf('Solved Col 3 = [%.4f, %.4f, %.4f]^T\\n', col3);
fprintf('Determinant = %.4f\\n', det(R_complete));`,

            python: `# UVic MECH 342 - Slide 15 Matrix Completion Puzzle (Python)
import numpy as np

col1 = np.array([0.6409, 0.6409, -0.4226])
c21 = -0.4630
c23_row3 = 0.4532

# Dot product col1 . col2 = 0
# col1[0]*c21 + col1[1]*c22 + col1[2]*c23_row3 = 0
c22 = -(col1[0]*c21 + col1[2]*c23_row3) / col1[1]
col2 = np.array([c21, c22, c23_row3])

# Right-handed coordinate system: col3 = col1 x col2
col3 = np.cross(col1, col2)

R = np.column_stack([col1, col2, col3])
print("Completed Matrix R:")
print(np.round(R, 4))
print(f"Solved c22: {c22:.4f}")
print(f"det(R): {np.linalg.det(R):.4f}")`
        },

        {
            id: "lec3-eigen",
            title: "Lecture 3: Euler Equivalent Axis & Eigen-Decomposition",
            description: "Solves Slide 22 Exam Problem: Extracts unitary eigenvalue, invariant axis OA, and angle beta using MATLAB eig and trace.",
            matlab: `% UVic MECH 342 - Lecture 3 Slide 22 Exam Problem
% Reference frame rotated by beta = -45 deg about axis OA (psi = 30 deg, theta = 70 deg)

clear; clc;

% 1. Target rotation parameters
psi   = deg2rad(30);  % Azimuth angle
theta = deg2rad(70);  % Elevation angle
beta  = deg2rad(-45); % Rotation angle

% Unit axis vector OA in XYZ
u_OA = [cos(theta)*cos(psi); 
        cos(theta)*sin(psi); 
        sin(theta)];

fprintf('Target Axis OA: [%.4f, %.4f, %.4f]^T\\n', u_OA);

% 2. Construct Rotation Matrix via 3-step similarity procedure:
% Align Z with OA, rotate by beta, then undo alignment
R_align = [ cos(psi),  sin(psi), 0;
           -sin(psi),  cos(psi), 0;
                   0,         0, 1];
Ry_elev = [ cos(pi/2 - theta), 0, -sin(pi/2 - theta);
                            0, 1,                   0;
            sin(pi/2 - theta), 0,  cos(pi/2 - theta)];
R_prime = Ry_elev * R_align;

% Rotate by beta about aligned Z-axis:
R_z_beta = [ cos(beta),  sin(beta), 0;
            -sin(beta),  cos(beta), 0;
                     0,          0, 1];

% Similarity transformation: R = R_prime' * R_z_beta * R_prime
R = R_prime' * R_z_beta * R_prime;

fprintf('\\nConstructed Rotation Matrix R:\\n');
disp(R);

% 3. Extract Axis using MATLAB 'eig' command (Slide 18 & 22)
[V, D] = eig(R);
eigenvalues = diag(D);

% Find eigenvalue closest to 1.0
[~, idx] = min(abs(eigenvalues - 1.0));
u_extracted = real(V(:, idx));
u_extracted = u_extracted / norm(u_extracted);

% Ensure sign alignment with u_OA
if dot(u_extracted, u_OA) < 0
    u_extracted = -u_extracted;
end

fprintf('=== EIGEN-DECOMPOSITION VERIFICATION ===\\n');
fprintf('Unitary Eigenvalue: %.4f\\n', real(eigenvalues(idx)));
fprintf('Extracted Axis:     [%.4f, %.4f, %.4f]^T\\n', u_extracted);

% 4. Extract Angle using Trace Operator (Slide 21 & 22)
% tr(R) = 1 + 2*cos(beta)
tr_R = trace(R);
cos_beta = (tr_R - 1) / 2;
beta_extracted_deg = rad2deg(acos(cos_beta));

fprintf('Matrix Trace tr(R): %.4f\\n', tr_R);
fprintf('Extracted |beta|:   %.2f deg (target was 45 deg)\\n', beta_extracted_deg);`,

            python: `# UVic MECH 342 - Lecture 3 Slide 22 Exam Problem (Python)
import numpy as np

psi = np.radians(30)
theta = np.radians(70)
beta = np.radians(-45)

# Target unit axis
u_OA = np.array([np.cos(theta)*np.cos(psi), np.cos(theta)*np.sin(psi), np.sin(theta)])
print(f"Target Axis OA: {np.round(u_OA, 4)}")

# Rodrigues' formula for rotation by beta about u_OA
c, s = np.cos(beta), np.sin(beta)
omc = 1.0 - c
ux, uy, uz = u_OA

R = np.array([
    [c + ux*ux*omc,      ux*uy*omc + uz*s,  ux*uz*omc - uy*s],
    [ux*uy*omc - uz*s,  c + uy*uy*omc,      uy*uz*omc + ux*s],
    [ux*uz*omc + uy*s,  uy*uz*omc - ux*s,  c + uz*uz*omc]
])

print("\\nComputed Rotation Matrix R:")
print(np.round(R, 4))

# Eigen-decomposition
vals, vecs = np.linalg.eig(R)
idx = np.argmin(np.abs(vals - 1.0))
u_extracted = np.real(vecs[:, idx])
u_extracted /= np.linalg.norm(u_extracted)
if np.dot(u_extracted, u_OA) < 0:
    u_extracted = -u_extracted

print(f"Extracted Axis (Eigenvector): {np.round(u_extracted, 4)}")

# Extract angle using trace
tr = np.trace(R)
extracted_beta_deg = np.degrees(np.arccos(np.clip((tr - 1)/2, -1, 1)))
print(f"Matrix Trace: {tr:.4f}")
print(f"Extracted |beta|: {extracted_beta_deg:.2f} deg")`
        },

        {
            id: "lec2-hydraulic",
            title: "Lecture 2: Slide 20 Hydraulic Cylinder Mechanism",
            description: "Computes the 3D displacement vector of point C as shaft AB and cylinder BC rotate and extend.",
            matlab: `% UVic MECH 342 - Lecture 2 Slide 20 Hydraulic Cylinder Solver
clear; clc;

% Initial parameters
armAB = 600; % mm
L1 = 400;    % mm
theta = deg2rad(36.87); % rotation about vertical Z
phi = deg2rad(120);     % rotation of cylinder about shaft AB
L2 = 800;    % mm

% Initial position of C (shaft along Y, cylinder vertical along Z)
r_C1 = [0; armAB; L1];

% Rotation about vertical axis:
Rz = [ cos(theta),  sin(theta), 0;
      -sin(theta),  cos(theta), 0;
                0,           0, 1];

% Rotation about shaft AB (which is aligned with y-axis of intermediate frame):
Ry = [ cos(phi), 0, -sin(phi);
              0, 1,         0;
       sin(phi), 0,  cos(phi)];

% Overall body-fixed rotation matrix:
R_tot = Ry * Rz;

% Position of Joint B after rotation of arm AB:
r_B2 = Rz' * [0; armAB; 0];

% Position of C relative to B in final orientation:
r_CB2 = R_tot' * [0; 0; L2];

% Total final position of C:
r_C2 = r_B2 + r_CB2;

% Displacement vector:
delta_r_C = r_C2 - r_C1;
disp_mag = norm(delta_r_C);

fprintf('Initial Position C1: [%.2f, %.2f, %.2f] mm\\n', r_C1);
fprintf('Final Position C2:   [%.2f, %.2f, %.2f] mm\\n', r_C2);
fprintf('Displacement Vector: [%.2f, %.2f, %.2f] mm\\n', delta_r_C);
fprintf('Total Displacement:  %.2f mm\\n', disp_mag);`,

            python: `# UVic MECH 342 - Lecture 2 Slide 20 Hydraulic Cylinder Solver (Python)
import numpy as np

armAB = 600.0
L1 = 400.0
th = np.radians(36.87)
phi = np.radians(120.0)
L2 = 800.0

r_C1 = np.array([0.0, armAB, L1])

Rz = np.array([
    [ np.cos(th),  np.sin(th), 0.0],
    [-np.sin(th),  np.cos(th), 0.0],
    [        0.0,         0.0, 1.0]
])

Ry = np.array([
    [ np.cos(phi), 0.0, -np.sin(phi)],
    [         0.0, 1.0,          0.0],
    [ np.sin(phi), 0.0,  np.cos(phi)]
])

R_tot = Ry @ Rz

r_B2 = Rz.T @ np.array([0.0, armAB, 0.0])
r_CB2 = R_tot.T @ np.array([0.0, 0.0, L2])
r_C2 = r_B2 + r_CB2
delta_r_C = r_C2 - r_C1

print(f"Initial C1: {r_C1} mm")
print(f"Final C2:   {np.round(r_C2, 2)} mm")
print(f"Displacement: {np.round(delta_r_C, 2)} mm")
print(f"Magnitude: {np.linalg.norm(delta_r_C):.2f} mm")`
        },

        {
            id: "lec2-block",
            title: "Lecture 2: Slide 21 Rotated Rectangular Prism",
            description: "Transforms the coordinates of vertex E through a sequence of two body-fixed rotations.",
            matlab: `% UVic MECH 342 - Lecture 2 Slide 21 Rotated Block Solver
clear; clc;

% Block dimensions: length 150 (X), width 120 (Y), height 60 (Z)
dimX = 150; dimY = 120; dimZ = 60;

% Target point E in original XYZ frame:
r_E_XYZ = [0; dimY; dimZ];

% Two body-fixed rotations:
% Step 1: Rotate about X by 30 deg
% Step 2: Rotate about new y' by 45 deg
th1 = deg2rad(30);
th2 = deg2rad(45);

Rx = [1,         0,          0;
      0, cos(th1),  sin(th1);
      0,-sin(th1),  cos(th1)];

Ry = [ cos(th2), 0, -sin(th2);
              0, 1,          0;
       sin(th2), 0,  cos(th2)];

% Body-fixed: PRE-MULTIPLY:
R_tot = Ry * Rx;

% Transform coordinates from XYZ to xyz: [x'] = [R] [x]
r_E_xyz = R_tot * r_E_XYZ;

fprintf('Original Point E [XYZ]: [%.2f, %.2f, %.2f] mm\\n', r_E_XYZ);
fprintf('Rotated Point E  [xyz]: [%.2f, %.2f, %.2f] mm\\n', r_E_xyz);
fprintf('Overall Rotation Matrix R:\\n');
disp(R_tot);`,

            python: `# UVic MECH 342 - Lecture 2 Slide 21 Rotated Block Solver (Python)
import numpy as np

r_E_XYZ = np.array([0.0, 120.0, 60.0])

th1 = np.radians(30.0)
th2 = np.radians(45.0)

Rx = np.array([
    [1.0,         0.0,          0.0],
    [0.0, np.cos(th1),  np.sin(th1)],
    [0.0,-np.sin(th1),  np.cos(th1)]
])

Ry = np.array([
    [ np.cos(th2), 0.0, -np.sin(th2)],
    [         0.0, 1.0,          0.0],
    [ np.sin(th2), 0.0,  np.cos(th2)]
])

R_tot = Ry @ Rx
r_E_xyz = R_tot @ r_E_XYZ

print(f"Original E in XYZ: {r_E_XYZ} mm")
print(f"Rotated E in xyz:  {np.round(r_E_xyz, 2)} mm")`
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeLab;
}
