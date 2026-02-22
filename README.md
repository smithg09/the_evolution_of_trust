<div align="center">

# 🤝 The Evolution of Trust

**An interactive game theory experiment exploring cooperation, betrayal, and the emergence of trust.**

Built with React · TypeScript · Vite

[Live Demo](https://smithgajjar.dev/evolution-of-trust) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## About

Why do strangers cooperate? Why do friends betray? And what does game theory have to say about it?

**The Evolution of Trust** is an interactive web experience that walks you through the *iterated Prisoner's Dilemma* — one of the most studied problems in game theory — as a narrative-driven story. Rather than reading equations, you **play** the game, **meet** different strategies as characters, **watch** them compete, and **see** trust evolve in populations over time.

Inspired by [Veritasium's video on the Prisoner's Dilemma](https://www.youtube.com/watch?v=mScpHTIi-kM) and Robert Axelrod's foundational research on cooperation.
Read more about the research here [Axelrod's The Evolution of Cooperation](https://archive.org/details/evolutionofcoop00axel/mode/2up)

## Features

| Section | What You'll Do |
|---------|---------------|
| 🏠 **The Game** | Learn the rules of the Prisoner's Dilemma through hands-on play |
| 👥 **Meet the Characters** | Play rounds against 7 distinct strategies and see how they think |
| 🏆 **The Tournament** | Watch all strategies compete in a round-robin tournament |
| 🧬 **Evolution** | Observe populations evolve over generations — who survives? |
| 🕹️ **Sandbox** | Freely experiment with any matchup and parameters |
| 📖 **Lessons** | Discover the key takeaways about trust, cooperation, and game theory |

## Strategies

Each strategy represents a different philosophy on trust:

| Strategy | Color | Behavior |
|----------|-------|----------|
| **Copycat** (Tit-for-Tat) | 🔵 | Cooperates first, then mirrors your last move — the golden rule |
| **Always Cooperate** | 🟢 | Unconditional kindness, no matter what |
| **Always Cheat** | 🔴 | Pure selfishness, exploits everyone |
| **Grudger** | 🟣 | Cooperates until betrayed once, then cheats forever |
| **Detective** | 🟡 | Plays C, D, C, C to probe you — then exploits or reciprocates |
| **Copykitten** | 🩷 | Like Copycat, but forgives a single cheat — only retaliates after two in a row |
| **Random** | 🟠 | Flips a coin each round — chaos incarnate |

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/smithg09/the_evolution_of_trust.git
cd the_evolution_of_trust

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

## Contributing

Contributions are welcome! Whether it's a bug fix, new strategy, UI improvement, or documentation update — all help is appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Acknowledgments

- [What Game Theory Reveals About Life, The Universe, and Everything](https://www.youtube.com/watch?v=mScpHTIi-kM) by **Veritasium** — the video that inspired this project
- [The Evolution of Cooperation](https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation) by **Robert Axelrod** — the foundational research
- [Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma) — Wikipedia overview of the game
