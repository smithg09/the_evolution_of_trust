# The Trust Paradox - Copilot Instructions

## Project Overview
Interactive game theory experiment (iterated Prisoner's Dilemma) built with React + TypeScript + Vite.

## Architecture
- `src/engine/` — Core game logic (types, strategies, tournament/evolution simulation)
- `src/components/` — Reusable UI components (Section, CoinSlot, PayoffMatrix, RoundDisplay, CharacterCard)
- `src/sections/` — Story sections (Intro, WhatIsTheGame, MeetTheCharacters, Tournament, Evolution, Sandbox, Conclusion)
- `src/context/` — React context for game state

## Coding Conventions
- Use TypeScript with strict mode
- Use `type` imports for type-only imports (verbatimModuleSyntax enabled)
- No `React` default import needed (JSX transform)
- CSS files alongside components, using BEM-style class naming
- Framer Motion for animations
- CSS custom properties for theming (cosmic/neon dark theme)

## General Guidelines
- DO NOT write tests for this project. The focus is on rapid iteration and creative storytelling, not on test coverage.
- DO NOT build the project everytime you make a change.
