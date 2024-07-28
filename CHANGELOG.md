# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Fixed
- Granting effects causing any previous effects to also trigger.

## [0.0.9] - 2024-07-26

### Added

- Sounds (#5)
- `.overrides` property, allowing for animations to remove others from being played.
  - Examples include preventing playing generic base animations on specific weapons (Arquebus > Firearm group.)
- `.wait` and `.delay` Sequencer options.
- Animations predicated upon on Performance Settings
- `.reference` property, allowing for individual animation objects to reference other keys as well as adding their own
  - (ex. Elemental Blast (Air) using Electric Arc animation predicated on the attack being an electric blast)

### Fixed

- Users being spammed with errors telling they are attempting to animate something without a token present.
  - Especially egregious during system migrations, causing animations based on creating, updating, or removing effects and items to trigger.
  - The error is now quietly put into console, with the error being only "loud" in dev mode.
- Animation Triggers being added since the moment the user loads, before the system is even ready.
- Template animations sometimes going off to `0, 0` coordinates by giving it a 100 ms delay.

### Changed

- `options.shape.value` to `options.shape.type`

#### Animations
- Light Pick
- Firearm Group
- Arquebus

#### Sounds
- Chain Lightning / Electric Arc
- Bow Shots
- Crossbow Shots

#### Unfinished
- Actor Animations Menu (#3)

## [0.0.8-alpha] - 2024-07-20

### Added

- Changelogs using [keep a changelog](https://keepachangelog.com/en/1.1.0/) format.
- Performance Settings
- Basic Sounds (Unprocessed)
- Ko-Fi Donation Button
- Effect, Template, Toggle, Start / End of Turn triggers for animations
- Test Runner

### Changed

- Merge separate animations files via Vite plugin (#1)
- Eslint Rules
- Moved internal structure
- Pre-release versions to be semver compliant

[Unreleased]: https://github.com/MrVauxs/pf2e-graphics/compare/0.0.9...HEAD
[0.0.9]: https://github.com/MrVauxs/pf2e-graphics/compare/0.0.8-alpha...0.0.9
[0.0.8-alpha]: https://github.com/MrVauxs/pf2e-graphics/releases/tag/0.0.8-alpha
