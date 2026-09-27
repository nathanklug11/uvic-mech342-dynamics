# UVic MECH 342: Advanced Dynamics II Studio
### Interactive 3D Teaching Application for Rigid Body Kinematics & Kinetics

> **Course**: MECH 342 — Dynamics II  
> **University**: University of Victoria (UVic), Department of Mechanical Engineering  
> **Course Text**: *Engineering Dynamics*, Jerry Ginsberg (Cambridge University Press)  
> **Instructor Reference**: Dr. Brad Buckham

---

## 🌟 Overview

**UVic MECH 342 Dynamics Studio** is an all-inclusive, interactive learning tool designed to help engineering students master three-dimensional rigid body mechanics. It combines rigorous mathematical walkthroughs with synchronized WebGL/Three.js 3D physics sandboxes, an active diagnostic quiz arena, and reproducible MATLAB & Python code.

---

## 🚀 Key Features

* **3D Interactive Laboratories**:
  1. **Lecture 0 Kinematics Simulator**: Real-time trajectory tracing of particle $Q$ on a rotating parabola ($y = x^2$) with frame $xyz$ rotating at $\psi(t) = 0.52 + 0.2t$.
  2. **Multibody Kinematic Chain & Unit Balance**: Multi-body tumbling frames ($XYZ \to xyz \to x''y''z'' \to x'y'z'$), interactive "Spot-the-Error" mode, and mass unit balance comparing **Slugs**, **Blobs (Slugettes)**, **Glugs**, and **Kilograms**.
  3. **Canonical Rotations Explorer**: Interactive $R_x(\theta_x), R_y(\theta_y), R_z(\theta_z)$ with live direction cosines and automated solver for the **Lecture 2 Slide 15 Matrix Completion Puzzle**.
  4. **Non-Commutativity Duel & Euler Axis**: Visual demonstration that $R_A R_B \neq R_B R_A$ and proof that infinitesimal rotations commute. Includes Euler equivalent axis decomposition ($\lambda = 1, \vec{u}_\beta, \beta$).
  5. **Spatial Mechanism (Bent Shaft Gyropendulum)**: Ginsberg's bent shaft mechanism with Precession $\psi$, Nutation $\theta$, and Spin $\phi$.
  6. **Hydraulic Cylinder Spatial Mechanism (Slide 20)**: Interactive solver for shaft $AB$ rotating through $\theta = 36.87^\circ$ and cylinder $BC$ rotating by $\phi = 120^\circ$ and extending from $400\text{ mm}$ to $800\text{ mm}$.
  7. **Rotated Rectangular Machined Prism (Slide 21)**: 3D model computing transformed coordinates of vertex $E$ under body-fixed rotations $R_x(\theta_1)$ and $R_y(\theta_2)$.
  8. **3-Ring Concentric Gimbals & Gimbal Lock Simulator**: Concentric Yaw-Pitch-Roll rings with a 1-click **"Trigger Gimbal Lock"** feature demonstrating the loss of a rotational degree of freedom at $\text{Pitch} = \pm 90^\circ$.

* **Floating Camera Perspective Toolbars**: Instant toggles for 📐 **Isometric**, 🔝 **Top ($XY$)**, 👁️ **Front ($XZ$)**, ➡️ **Side ($YZ$)**, and ↺ **Reset**.
* **Active Practice & Diagnostic Arena**: 18 questions across Bloom’s Taxonomy (*Remember, Understand, Apply, Analyze, Evaluate*) with progressive hints, step-by-step solutions, and streak tracking.
* **MATLAB & Python Code Lab**: Production-ready computational scripts with 1-click clipboard copy.
* **Extensibility Engine**: Dynamic in-app modal to add custom lectures and save them to local storage.
* **100% Offline Capability**: All libraries (Three.js, OrbitControls, KaTeX, KaTeX fonts) are bundled locally in `libs/`.

---

## 💻 Quick Start & Running Locally

### Option A: Using Python (Recommended)
```bash
python run_app.py
```
This serves the application and automatically opens `http://localhost:8342/index.html` in your default browser. It also displays your local Wi-Fi IP so other devices on your home network can connect.

### Option B: Standalone Direct Launch
Simply double-click `index.html` in your browser. No server or internet connection is required.

---

## 📱 Accessing from Another Device on Your Wi-Fi

1. Run `python run_app.py` on your host PC.
2. Note the network URL displayed in the terminal (e.g., `http://10.0.0.71:8342/index.html`).
3. Open that URL on any other laptop, tablet, or phone connected to the same Wi-Fi network.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Navigate to **Settings** $\to$ **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. The application will be live at:
   `https://<your-username>.github.io/<repo-name>/`
