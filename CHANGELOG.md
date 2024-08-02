# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - Unreleased

### Fixed

- Token Preview not updating when changing the token image path.
- Removing Predicates not returning to default value of `[]`.

## [0.1.2] - 2024-08-02

### Added

- Added a toggle to see the predicate data in the Token Image Manager.
- Added an option to use existing feats in the Token Image Manager.

  #### Animations

  - Jaws

## [0.1.1] - 2024-08-01

### Fixed

- Improved the stability of the Token Image Manager, especially in regards to pre-existing rule elements.

## [0.1.0] - 2024-07-31

### Added

- "Developer mode" setting. Puts into console what is being played with what roll options. Automatically on in `npm run dev`.
- Token Image Manager (#4)

  #### Animations

  - Melee Ignition
  - Jaws
  - Unarmed Attack / Fist

### Changed

- All animations are now preloaded prior to being played.

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

### Fixed

- Users being spammed with errors telling they are attempting to animate something without a token present.
  - Especially egregious during system migrations, causing animations based on creating, updating, or removing effects and items to trigger.
  - The error is now quietly put into console, with the error being only "loud" in dev mode.
- Animation Triggers being added since the moment the user loads, before the system is even ready.
- Template animations sometimes going off to `0, 0` coordinates by giving it a 100 ms delay.

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

[Unreleased]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.0.9...v0.1.0
[0.0.9]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.0.8-alpha...v0.0.9
[0.0.8-alpha]: https://github.com/MrVauxs/pf2e-graphics/releases/tag/v0.0.8-alpha
