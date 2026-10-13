# UVic MECH 342: Advanced Dynamics II Studio
### Interactive 3D Teaching Application for Rigid Body Kinematics & Kinetics

> **Course**: MECH 342 — Dynamics II  
> **University**: University of Victoria (UVic), Department of Mechanical Engineering  
> **Course Text**: *Engineering Dynamics*, Jerry Ginsberg (Cambridge University Press)  
> **Instructor Reference**: Dr. Brad Buckham  
> **Live GitHub Pages URL**: [https://nathanklug11.github.io/uvic-mech342-dynamics/](https://nathanklug11.github.io/uvic-mech342-dynamics/)

---

## 🌟 Overview

**UVic MECH 342 Dynamics Studio** is an all-inclusive, interactive learning tool designed to help engineering students master three-dimensional rigid body mechanics and solve exam problems with high confidence and intuitive understanding. It combines rigorous mathematical derivations with synchronized WebGL/Three.js 3D physics sandboxes, step-by-step test-solving blueprints, live dynamic parameter solvers, an active diagnostic quiz arena, and reproducible MATLAB & Python code.

---

## 🚀 Key Features & Modules

### 1. Comprehensive Lecture Modules (Lectures 0–7)
* **Lecture 0**: 3D Coordinate Systems, Relative Position/Velocity, Product Rule Derivatives, and the Rotating Parabola Kinematics Challenge.
* **Lecture 1**: Multibody Kinematic Chains, Direction Cosines, Transformation Matrices $[R]$, and Mass/Force Units Balance (**Slugs**, **Blobs/Slugettes**, **Glugs**, **lbf**, **N**).
* **Lecture 2**: Canonical Rotations ($R_x, R_y, R_z$), Rotation Composition, Matrix Transpose Properties, and the Slide 15 Matrix Completion Puzzle.
* **Lecture 3**: Finite vs Infinitesimal Rotations, Non-Commutativity, Euler’s Rotation Theorem ($\lambda = 1, \vec{u}_\beta, \beta$), and Spatial Mechanisms.
* **Lecture 4 (Ginsberg §2.2)**: Common Curvilinear Coordinates — Cylindrical $(R, \theta, z)$ and Spherical $(r, \phi, \theta)$ frameworks, scale factors $h_i$, unit vectors $\vec{e}_i$, time derivative chain rules, and full acceleration breakdowns (isolating $\ddot{R}$, centripetal $-R\dot{\theta}^2$, tangential $R\ddot{\theta}$, and Coriolis $2\dot{R}\dot{\theta}$).
* **Lecture 5 (Ginsberg §2.3–§2.4)**: Path Variables & Frenet-Serret Triad ($\vec{e}_t, \vec{e}_n, \vec{e}_b$), Osculating Plane, Master Radius of Curvature formula $\rho = \frac{|\vec{v}|^3}{|\vec{v}\times\vec{a}|}$, the Zero Binormal Acceleration Theorem ($a_b \equiv 0$), and Forward vs Inverse problem kinematics matching.
* **Lecture 6 (Ginsberg §3.2–§3.3)**: Angular Velocity & The Transport Theorem — Proof of infinitesimal rotation commutativity, Poisson's formulas ($\dot{\vec{e}} = \vec{\omega}\times\vec{e}$), the general Transport Theorem $\left(\frac{d\vec{A}}{dt}\right)_{XYZ} = \left(\frac{d\vec{A}}{dt}\right)_{xyz} + \vec{\omega}\times\vec{A}$, angular acceleration invariant rate $\vec{\alpha} = (\dot{\vec{\omega}})_{XYZ} = (\dot{\vec{\omega}})_{xyz}$, and multi-body angular velocity superposition.
* **Lecture 7 (Ginsberg §4.2)**: The Eulerian Angles — The canonical Ginsberg **Z-Y-Z** body-fixed sequence: Precession $\psi$ ($Z$), Nutation $\theta$ ($y'$), Spin $\phi$ ($z''$). Complete $[R]$ matrix derivation, body-fixed angular velocity $(\omega_x, \omega_y, \omega_z)$, angular acceleration differentiation, inverse atan2 parameter extraction, and the Gimbal Lock singularity at $\sin\theta = 0$.

---

### 2. 📝 Dedicated Exam & Tutorial Problem-Solving Hub
Equipped with **5 Master Test Blueprints** and interactive live parameter calculators:
* **Blueprint 1**: Frame Setup & Matrix Multiplication Order (Fixed axes: pre-multiply; Body axes: post-multiply).
* **Blueprint 2**: Curvilinear Decision Matrix & Term Isolation (Cylindrical vs Spherical vs Cartesian selection).
* **Blueprint 3**: Frenet-Serret Path Variables Attack Strategy (Finding $\vec{e}_t, \vec{e}_n, \vec{e}_b$, osculating plane, and $\rho$).
* **Blueprint 4**: Transport Theorem & Moving Axes Derivatives ($\vec{v} = \vec{v}_{rel} + \vec{\omega}\times\vec{r}$).
* **Blueprint 5**: Ginsberg Z-Y-Z Eulerian Angles & Singularity Detection ($\theta = 0^\circ, 180^\circ$ lock identification).
* **Assignment 1 Problems**:
  * **Q1**: Particle along Rotating Parabolic Wire $y = cx^2$ in cylindrical framework with live parameter solver.
  * **Q2**: Spiral Track Kinematics on a Cone with live parameter solver.
  * **Q3**: Gimbal System Direction Cosines & Invariant Euler Axis Decomposition.
  * **Q4**: Multi-link Spatial Robotic Arm with Sequential Body Rotations.
  * **Q6**: Sliding Collar along Helical Guide Wire with matched Frenet kinematics.
* **Tutorial 1 & 3 Problems**:
  * **Tutorial 1 Prob 1**: 3D Guy-Wire Cable Tension & Moment Vector along Shaft Axis.
  * **Tutorial 1 Prob 2**: Hydraulic Boom Spatial Positioning.
  * **Tutorial 3 Prob 1**: Dual Turntable Transport Theorem Particle Kinematics with live parameter solver.
  * **Tutorial 3 Prob 2**: Ginsberg Z-Y-Z Eulerian Angle Extraction & Body-Fixed Angular Velocities.

---

### 3. 🔬 12 Synchronized 3D WebGL Physics Laboratories
1. **Lab 1: Lecture 0 Kinematics Simulator**: Real-time trajectory tracing of particle $Q$ on rotating parabola $y = x^2$ with tumbling reference frame.
2. **Lab 2: Multibody Kinematic Chain & Unit Balance**: Multi-body tumbling frames ($XYZ \to xyz \to x''y''z'' \to x'y'z'$), interactive "Spot-the-Error" mode, and mass unit converter.
3. **Lab 3: Canonical Rotations Explorer**: Interactive $R_x, R_y, R_z$ with live direction cosines and automated solver for the Slide 15 Matrix Completion Puzzle.
4. **Lab 4: Non-Commutativity Duel & Euler Axis**: Visual demonstration that $R_A R_B \neq R_B R_A$ and Euler equivalent axis decomposition ($\lambda = 1, \vec{u}_\beta, \beta$).
5. **Lab 5: Bent Shaft Gyropendulum**: Ginsberg's spatial mechanism with Precession $\psi$, Nutation $\theta$, and Spin $\phi$.
6. **Lab 6: Hydraulic Cylinder Spatial Mechanism (Slide 20)**: Interactive solver for shaft $AB$ rotating through $\theta = 36.87^\circ$ and cylinder $BC$ rotating by $\phi = 120^\circ$.
7. **Lab 7: Rotated Machined Prism (Slide 21)**: 3D model computing transformed coordinates of vertex $E$ under body-fixed rotations.
8. **Lab 8: 3-Ring Concentric Gimbals & Gimbal Lock**: Interactive rings with 1-click **"Trigger Gimbal Lock"** feature at $\text{Pitch} = \pm 90^\circ$.
9. **Lab 9: Curvilinear Space Explorer (Lecture 4)**: Cylindrical $(R, \theta, z)$ vs Spherical $(r, \phi, \theta)$ coordinate surfaces, scale factors, and moving unit basis triad.
10. **Lab 10: Frenet-Serret Roller Coaster Track (Lecture 5)**: 3D space curve with moving triad $(\vec{e}_t, \vec{e}_n, \vec{e}_b)$, osculating plane, and dynamic osculating circle displaying radius of curvature $\rho(t)$.
11. **Lab 11: Transport Theorem Turntable (Lecture 6)**: Visual decomposition of vector rate of change into relative observed rate $\left(\frac{d\vec{A}}{dt}\right)_{xyz}$ and transport rate $\vec{\omega}\times\vec{A}$.
12. **Lab 12: Ginsberg Z-Y-Z Eulerian Gyroscope (Lecture 7)**: 3-ring gimbal system tracking Precession $\psi$ ($Z$), Nutation $\theta$ ($y'$), and Spin $\phi$ ($z''$) with body-fixed angular velocity vector $\vec{\omega}$ and visual singularity alert when $\sin\theta \to 0$.

---

### 4. 🧠 Practice Arena & Diagnostic Quizzes
* **36 Bloom's Taxonomy Questions** (*Remember, Understand, Apply, Analyze, Evaluate*).
* Dynamic score tracking, instant visual feedback, progressive hints, and comprehensive textbook derivations.
* Covers all course concepts: unit conversions, canonical rotation matrices, direction cosines, non-commutativity, cylindrical and spherical scale factors, Coriolis acceleration, Frenet triads, curvature radius, Poisson's formulas, transport theorem, Eulerian Z-Y-Z transformations, and gimbal lock singularities.

---

### 5. 💻 Companion Code Lab (MATLAB & Python)
* Ready-to-run computational scripts for every lecture topic, assignment problem, and tutorial exercise.
* 1-click clipboard copy with side-by-side syntax comparison.
* Fully standalone — zero external dependencies required beyond standard NumPy and MATLAB toolboxes.

---

## 💻 Quick Start & Running Locally

### Option A: Using Python (Recommended)
```bash
python run_app.py
```
This serves the application locally and automatically launches `http://localhost:8342/index.html` in your default browser. It also displays your local Wi-Fi IP address so you can access the application from a tablet or phone on the same network.

### Option B: Standalone Direct Launch
Double-click `index.html` directly in your browser. All required dependencies (Three.js, OrbitControls, KaTeX, and fonts) are stored locally in the `libs/` folder, ensuring 100% offline autonomy.

---

## 🌐 Accessing on Other Computers / Devices

### Via GitHub Pages
The application is automatically hosted and updated at:
👉 **[https://nathanklug11.github.io/uvic-mech342-dynamics/](https://nathanklug11.github.io/uvic-mech342-dynamics/)**

### Via Local Network
When running `python run_app.py`, open the provided network address (e.g., `http://192.168.1.X:8342/index.html`) on any device connected to the same Wi-Fi.
