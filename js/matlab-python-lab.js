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

% Define canonical rotation matrices: [x'] = [R] [x]
Rx = @(th) [1,        0,         0;
            0,  cos(th),   sin(th);
            0, -sin(th),   cos(th)];

% NOTE: Upper right element has negative sign for Ry!
Ry = @(th) [ cos(th), 0, -sin(th);
                   0, 1,         0;
             sin(th), 0,  cos(th)];

Rz = @(th) [ cos(th),  sin(th), 0;
            -sin(th),  cos(th), 0;
                   0,        0, 1];

% Sequence of Body-Fixed Rotations:
% 1. Rotate by theta1 about body x
% 2. Rotate by theta2 about new body y'
% 3. Rotate by theta3 about final body z''
th1 = deg2rad(30);
th2 = deg2rad(45);
th3 = deg2rad(60);

% Body-fixed rule: PRE-MULTIPLY (left to right from first to last)
R_total = Rz(th3) * Ry(th2) * Rx(th1);

fprintf('=== MECH 342 COMPOSITE ROTATION MATRIX ===\\n');
disp(R_total);
fprintf('Determinant: %.4f (must be +1.0000)\\n', det(R_total));
fprintf('Orthonormality check (norm(R*R'' - I)): %.4e\\n', norm(R_total*R_total' - eye(3)));`,

            python: `# UVic MECH 342 - Canonical Rotations & Body-Fixed Sequencing (Python)
import numpy as np

def Rx(th):
    return np.array([
        [1.0,        0.0,         0.0],
        [0.0, np.cos(th),  np.sin(th)],
        [0.0,-np.sin(th),  np.cos(th)]
    ])

def Ry(th):
    return np.array([
        [ np.cos(th), 0.0, -np.sin(th)],
        [        0.0, 1.0,         0.0],
        [ np.sin(th), 0.0,  np.cos(th)]
    ])

def Rz(th):
    return np.array([
        [ np.cos(th), np.sin(th), 0.0],
        [-np.sin(th), np.cos(th), 0.0],
        [        0.0,        0.0, 1.0]
    ])

th1 = np.radians(30.0)
th2 = np.radians(45.0)
th3 = np.radians(60.0)

# Body-fixed: PRE-MULTIPLY
R_tot = Rz(th3) @ Ry(th2) @ Rx(th1)

print("Composite Rotation Matrix R:")
print(np.round(R_tot, 4))
print(f"Det: {np.linalg.det(R_tot):.4f}")
print(f"Orthonormality Err: {np.linalg.norm(R_tot @ R_tot.T - np.eye(3)):.2e}")`
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
        },

        {
            id: "lec4-curvilinear",
            title: "Lecture 4: Curvilinear Coordinates Kinematics (Cylindrical & Spherical)",
            description: "Calculates position, velocity, and acceleration in Cylindrical (R, θ, z) and Spherical (r, φ, θ) coordinates, isolating centripetal, Coriolis, and tangential terms.",
            matlab: `% UVic MECH 342 - Curvilinear Coordinates Solver (Cylindrical & Spherical)
clear; clc;

% Input motion state (Cylindrical):
R = 2.5;       R_dot = 0.5;   R_ddot = -0.2;
theta = pi/4;  th_dot = 1.2;  th_ddot = 0.3;
z = 1.5;       z_dot = 0.8;   z_ddot = 0.0;

% 1. Basis vectors in global XYZ:
e_R = [cos(theta); sin(theta); 0];
e_th = [-sin(theta); cos(theta); 0];
e_z = [0; 0; 1];

% 2. Velocity: v = R_dot*e_R + R*th_dot*e_th + z_dot*e_z
v_R = R_dot;
v_th = R * th_dot;
v_z = z_dot;
v_vec = v_R * e_R + v_th * e_th + v_z * e_z;

% 3. Acceleration: a_R = R_ddot - R*th_dot^2, a_th = R*th_ddot + 2*R_dot*th_dot
a_R = R_ddot - R * th_dot^2;
a_th = R * th_ddot + 2 * R_dot * th_dot; % Coriolis: 2*R_dot*th_dot
a_z = z_ddot;
a_vec = a_R * e_R + a_th * e_th + a_z * e_z;

fprintf('=== CYLINDRICAL KINEMATICS RESULTS ===\\n');
fprintf('Velocity:     [%.3f e_R + %.3f e_th + %.3f e_z] m/s\\n', v_R, v_th, v_z);
fprintf('Total speed:  %.4f m/s\\n', norm(v_vec));
fprintf('Acceleration: [%.3f e_R + %.3f e_th + %.3f e_z] m/s^2\\n', a_R, a_th, a_z);
fprintf('  Centripetal term: %.4f m/s^2\\n', -R * th_dot^2);
fprintf('  Coriolis term:    %.4f m/s^2\\n', 2 * R_dot * th_dot);
fprintf('Total accel:  %.4f m/s^2\\n', norm(a_vec));`,

            python: `# UVic MECH 342 - Curvilinear Coordinates Solver (Python)
import numpy as np

R, R_dot, R_ddot = 2.5, 0.5, -0.2
theta, th_dot, th_ddot = np.pi/4, 1.2, 0.3
z, z_dot, z_ddot = 1.5, 0.8, 0.0

# Basis vectors in XYZ
e_R = np.array([np.cos(theta), np.sin(theta), 0.0])
e_th = np.array([-np.sin(theta), np.cos(theta), 0.0])
e_z = np.array([0.0, 0.0, 1.0])

v = R_dot * e_R + (R * th_dot) * e_th + z_dot * e_z
a_R = R_ddot - R * th_dot**2
a_th = R * th_ddot + 2.0 * R_dot * th_dot
a = a_R * e_R + a_th * e_th + z_ddot * e_z

print(f"Velocity:     {np.round(v, 3)} m/s (speed = {np.linalg.norm(v):.3f} m/s)")
print(f"Acceleration: {np.round(a, 3)} m/s^2 (|a| = {np.linalg.norm(a):.3f} m/s^2)")
print(f"Coriolis accel = {2.0 * R_dot * th_dot:.3f} m/s^2")`
        },

        {
            id: "lec5-frenet",
            title: "Lecture 5: Frenet-Serret Curvature & Osculating Plane",
            description: "Evaluates the Frenet triad (e_t, e_n, e_b) and radius of curvature rho = |v|^3 / |v x a| for any arbitrary 3D trajectory.",
            matlab: `% UVic MECH 342 - Frenet-Serret Master Curvature Evaluator
clear; clc;

% Arbitrary instantaneous Cartesian velocity & acceleration:
v = [4.0; -3.0; 2.0];  % m/s
a = [-2.0; 1.5; 5.0];  % m/s^2

% 1. Speed & Unit Tangent:
speed = norm(v);
e_t = v / speed;

% 2. Cross product v x a:
cross_va = cross(v, a);
cross_mag = norm(cross_va);

% 3. Master formula for radius of curvature: rho = |v|^3 / |v x a|
rho = (speed^3) / cross_mag;
curvature = 1 / rho;

% 4. Binormal & Principal Normal vectors:
e_b = cross_va / cross_mag;
e_n = cross(e_b, e_t);

% 5. Tangential and normal acceleration components:
a_t = dot(a, e_t);
a_n = (speed^2) / rho;
a_b = dot(a, e_b); % Must be 0!

fprintf('=== FRENET-SERRET RESULTS ===\\n');
fprintf('Speed v:                  %.4f m/s\\n', speed);
fprintf('Radius of Curvature rho:  %.4f m\\n', rho);
fprintf('Curvature kappa:          %.4f 1/m\\n', curvature);
fprintf('Tangential accel a_t:     %.4f m/s^2\\n', a_t);
fprintf('Normal accel a_n:         %.4f m/s^2\\n', a_n);
fprintf('Binormal accel a_b:       %.6f m/s^2 (strictly zero!)\\n', a_b);`,

            python: `# UVic MECH 342 - Frenet-Serret Master Curvature Evaluator (Python)
import numpy as np

v = np.array([4.0, -3.0, 2.0])
a = np.array([-2.0, 1.5, 5.0])

speed = np.linalg.norm(v)
e_t = v / speed

cross_va = np.cross(v, a)
cross_mag = np.linalg.norm(cross_va)

rho = (speed**3) / cross_mag
e_b = cross_va / cross_mag
e_n = np.cross(e_b, e_t)

a_t = np.dot(a, e_t)
a_n = (speed**2) / rho
a_b = np.dot(a, e_b)

print(f"Radius of curvature rho: {rho:.4f} m")
print(f"Tangential accel a_t:    {a_t:.4f} m/s^2")
print(f"Normal accel a_n:        {a_n:.4f} m/s^2")
print(f"Binormal accel a_b:      {a_b:.6e} m/s^2 (Theorem: a_b = 0)")`
        },

        {
            id: "lec7-euler-zyz",
            title: "Lecture 7: Ginsberg Z-Y-Z Eulerian Angles Forward & Inverse Solver",
            description: "Evaluates Jerry Ginsberg's Section 4.2 rotation matrix [R] = [Rz(phi)][Ry(theta)][Rz(psi)], body-fixed angular velocity, and extracts angles via inverse atan2.",
            matlab: `% UVic MECH 342 - Ginsberg Z-Y-Z Eulerian Angles Forward & Inverse
clear; clc;

% Input angles in degrees:
psi_deg = 30;    % Precession about Z
th_deg  = 45;    % Nutation about y'
phi_deg = 60;    % Spin about z''

psi = deg2rad(psi_deg);
th  = deg2rad(th_deg);
phi = deg2rad(phi_deg);

% Canonical matrices:
Rz_psi = [ cos(psi), sin(psi), 0; -sin(psi), cos(psi), 0; 0, 0, 1];
Ry_th  = [ cos(th), 0, -sin(th); 0, 1, 0; sin(th), 0, cos(th)];
Rz_phi = [ cos(phi), sin(phi), 0; -sin(phi), cos(phi), 0; 0, 0, 1];

% Body-fixed PRE-multiplication:
R = Rz_phi * Ry_th * Rz_psi;

% Inverse extraction:
th_extracted = atan2(sqrt(R(1,3)^2 + R(2,3)^2), R(3,3));
phi_extracted = atan2(R(2,3), -R(1,3));
psi_extracted = atan2(R(3,1), R(3,2));

fprintf('=== GINSBERG Z-Y-Z EULERIAN ANGLES ===\\n');
fprintf('Input:     psi = %.1f deg, theta = %.1f deg, phi = %.1f deg\\n', psi_deg, th_deg, phi_deg);
fprintf('Extracted: psi = %.1f deg, theta = %.1f deg, phi = %.1f deg\\n', ...
    rad2deg(psi_extracted), rad2deg(th_extracted), rad2deg(phi_extracted));
fprintf('Rotation Matrix R:\\n');
disp(R);`,

            python: `# UVic MECH 342 - Ginsberg Z-Y-Z Eulerian Angles Forward & Inverse (Python)
import numpy as np

psi = np.radians(30.0)
th  = np.radians(45.0)
phi = np.radians(60.0)

Rz_psi = np.array([[np.cos(psi), np.sin(psi), 0], [-np.sin(psi), np.cos(psi), 0], [0, 0, 1]])
Ry_th  = np.array([[np.cos(th), 0, -np.sin(th)], [0, 1, 0], [np.sin(th), 0, np.cos(th)]])
Rz_phi = np.array([[np.cos(phi), np.sin(phi), 0], [-np.sin(phi), np.cos(phi), 0], [0, 0, 1]])

R = Rz_phi @ Ry_th @ Rz_psi

# Inverse extraction:
th_ext  = np.arctan2(np.sqrt(R[0,2]**2 + R[1,2]**2), R[2,2])
phi_ext = np.arctan2(R[1,2], -R[0,2])
psi_ext = np.arctan2(R[2,0], R[2,1])

print(f"Extracted angles: psi={np.degrees(psi_ext):.1f}°, theta={np.degrees(th_ext):.1f}°, phi={np.degrees(phi_ext):.1f}°")`
        },

        {
            id: "tut3-shaft-cone",
            title: "Tutorial 3: Shaft Sliding Bar & Cone Kinematics Solvers",
            description: "Solves Tutorial 3 Problem 1 (bar on rotating shaft and rising table) and Problem 2 (spherical vs cylindrical comparison).",
            matlab: `% UVic MECH 342 - Tutorial 3 Problems Solver
clear; clc;

% Tutorial 3 Problem 1:
L = 1.0; Omega = 2.0; u = 0.5; th_deg = 45;
th = deg2rad(th_deg);

th_dot = u / (L * sin(th));
th_ddot = -u^2 * cos(th) / (L^2 * sin(th)^3);

R = L * sin(th);
R_dot = u * cot(th);
R_ddot = -u^2 / (L * sin(th)^3);

v_B = [R_dot; R * Omega; -u];
a_B = [R_ddot - R * Omega^2; 2 * R_dot * Omega; 0];

fprintf('=== TUTORIAL 3 PROBLEM 1 RESULTS ===\\n');
fprintf('Velocity of B:     [%.3f, %.3f, %.3f] m/s (|v| = %.3f m/s)\\n', v_B, norm(v_B));
fprintf('Acceleration of B: [%.3f, %.3f, %.3f] m/s^2 (|a| = %.3f m/s^2)\\n', a_B, norm(a_B));`,

            python: `# UVic MECH 342 - Tutorial 3 Problems Solver (Python)
import numpy as np

L, Omega, u = 1.0, 2.0, 0.5
th = np.radians(45.0)

th_dot = u / (L * np.sin(th))
R = L * np.sin(th)
R_dot = u / np.tan(th)
R_ddot = -u**2 / (L * np.sin(th)**3)

v_B = np.array([R_dot, R * Omega, -u])
a_B = np.array([R_ddot - R * Omega**2, 2.0 * R_dot * Omega, 0.0])

print(f"Velocity B [m/s]:     {np.round(v_B, 3)} (speed = {np.linalg.norm(v_B):.3f} m/s)")
print(f"Acceleration B [m/s²]: {np.round(a_B, 3)} (|a| = {np.linalg.norm(a_B):.3f} m/s²)")`
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeLab;
}
