
<p align="center">
  <img src="https://raw.githubusercontent.com/KauaZs/nick_sniper/main/assets/nicksniper.png" alt="Nick Sniper Banner"/>
</p>

# NSNIPER

Nick Sniper (nsniper) is a CLI tool for generating and checking available Minecraft nicknames quickly and easily.

## Features

- Generate random Minecraft nicknames with custom length and prefix
- Option to allow or disallow numbers in nicknames
- Checks nickname availability using Mojang's official API
- Prevents duplicate nickname generation
- User-friendly CLI with colored output


## Installation

You can install nsniper globally using npm:

```bash
npm install -g nsniper
```

Or use it as a local dependency in your project:

```bash
npm install nsniper
```

## Usage

Run in development mode:

```bash
npm run dev
```

Or use globally (after build):

```bash
npm install -g .
nsniper
```

### CLI Options

The tool will prompt you for:

- Nickname length (3-16 characters)
- Prefix (optional)
- Allow numbers (y/n)
- How many nicknames to generate

You can stop the process at any time with `Ctrl+C`.
