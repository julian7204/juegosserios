# Blueprint: Multiplication Game

## Overview

This document outlines the plan and progress for creating a multiplication game for kids. The application will feature a login system, a multiplication game, and user data will be stored locally.

## Current State

- **Project Setup:** Basic React project created with Vite.
- **Assets:** Background and spaceship images are available.

## Plan

### Phase 1: Login Page

1.  **Create Folder Structure:**
    *   `src/pages/Login`: To hold the main login page component.
    *   `src/components/FormularioLogin`: For the reusable login form.
    *   `data`: To store local JSON data.

2.  **Create Login Page:**
    *   Set up the main login component with a background and the animated spaceship.
    *   Create a form with fields for "student name" and "password", and a "create user" button.

3.  **Implement Routing:**
    *   Install `react-router-dom`.
    *   Set up routing in `App.tsx` to display the login page.

4.  **Local Data Storage:**
    *   Create a `students.json` file to store user data.
    *   Implement basic functions to read from and write to this file.

### Phase 2: Multiplication Game (Future)

*   Design and implement the multiplication game interface.
*   Connect the game to the user data, storing progress and scores.
