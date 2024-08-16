# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Dictionary
> (P) - A premium version of that animation is available.

## [0.6.5] - Unreleased

### Added

- **New Features to Animation Menus**, see *Changed* section.
- Origin data to `damage-taken` animations, allowing for animations to start from the attacker to the target taking damage / being healed.
- Ability to force `attachTo` on line and cone animations instead of standard `stretchTo`.
- **New Animations**:
  - Acid Splash, Alarm, Blight Bomb, Breathe Fire, Caustic Blast, Charm, Chilling Spray, Command, Daze, Dizzying Colors, Dread Ampoule, Enfeeble, Frostbite, Gale Blast, Gouging Claw, Mystic Armor, Puff of Poison, Scatter Scree, Spout, Void Warp (thank you [@7H3LaughingMan](https://github.com/7H3LaughingMan)!)
  - Divine Lance, Shield Spikes, Chain Sword, Shield Boss, Ray of Frost (thank you [@ChasarooniZ](https://github.com/ChasarooniZ)!)
  - Pick Weapon Group (free JB2A version) ([@MrVauxs](https://mrvauxs.net/))
- **New Sounds** from [SoundFlakes](https://freesound.org/people/SoundFlakes/)!

### Changed

- Spell Effect: Shield animation to be compatible with free version of JB2A.
- Existing alchemical bombs so that they follow the same layout.
- **Refactored Animations Menus**
  - Fixed bugs ([#38](https://github.com/MrVauxs/pf2e-graphics/issues/38))
  - Improved underlying CSS.
  - Shift Clicking on the Animations button will open the animations menu and close the menu it was opened from.
  - Added a Search function.
  - You can now reference existing animations.

## [0.6.4] - 2024-08-13

### Added

- Ability to make animations between the grantee of an effect and its recipient with `Effect Granted` trigger.
  - `origin-exists` roll option to predicate animations based on whether the effect comes from another actor than the recipient.
- `mirrorY` and `mirrorX` Sequencer options.
- **New Animations**:
  - Spell Effect: Shield (giving it to another token) ([@MrVauxs](https://mrvauxs.net/))
  - Raise a Shield, Shields of the Spirit (Security) (thank you [@ChasarooniZ](https://github.com/ChasarooniZ)!)

### Changed

- How effects are organized inside the module.
- Compressed all assets from `.wav` to `.ogg`, resulting in 10x reduction in file size.

### Fixed

- `preset: both` on `onToken` animations not actually triggering animations on both the target and the source token.

## [0.6.3] - 2024-08-12

### Fixed

- `false` properties causing some options to trigger anyway.

## [0.6.2] - 2024-08-12

### Added

- `template:typeOfTemplate` roll options for templates.
- **New Animations**: Acid Flask, Alchemist's Fire, Bottled Lightning, and Frost Vial (thank you [@7H3LaughingMan](https://github.com/7H3LaughingMan)!)

### Fixed

- Preset Animations list scrolling horizontally instead of vertically.

## [0.6.1] - 2024-08-12

### Fixed

- Line and Cone Templates not animating properly.
- Blazing Wave animation.

## [0.6.0] - 2024-08-12

### Added

- `jb2a:patreon` and `jb2a:free` roll options for animations.
- Preset Animations tab in World Animations menu. Allows you to see all pre-made animations and their code.
- **New Animations**: Club, Dart, Shield, Spear, Axe, Bomb, Brawling, Flail, Hammer, Polearm, and Sling (thank you [@7H3LaughingMan](https://github.com/7H3LaughingMan)!)

### Changed

- How Animations are stored in module repository.
- Bumped default Performance Settings to Medium.

### Fixed

- Issues related to having multiple windows open by limiting them to only 1 window per type (item, actor, user, world).
- Custom Animations throwing errors due to nested properties.
- Export JSON causing posting an error in console when closed.
- Token Image Manager not working on non-Player Character Sheets.
- Actor Animations Manager buttons sometimes appearing twice on the character sheet, and not appearing on other Actor types.

## [0.5.2] - 2024-08-11

### Fixed

- Fixed players being able to open the World Animations menu.
- Fixed World Animations menu not being accounted for when picking animations.

## [0.5.1] - 2024-08-11

### Fixed

- Fixed getPlayerOwners getting wrong IDs.

## [0.5.0] - 2024-08-11

### Added

- TokenImage Imports ([#6](https://github.com/MrVauxs/pf2e-graphics/issues/6))
- World Animations Menu ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))
- Existing menus re-focusing when being opened again.
- Sound predicates and ability to have multiple sounds for effects.
- **New Sounds**: Sword Swing and Miss

## [0.4.0] - 2024-08-10

### Added

- `atLocation`, `radius`, `constrainedByWalls`, `volume`, and `duration` support for sound effects.
- `equipment:[state]` roll options for `toggle` animations. Use them wisely.
- `templateAsOrigin` preset option for `ranged` animations. Allows to have the template to be the source of the animation, as opposed to the owner token. Allows for template animations detached from token location.
- User Animation Menu ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))

### Changed

- The Sounds Database to use a two-digit indexes (01, 02, 03, etc.)
- Inner Radiance Torrent (P) to use `templateAsOrigin`.
- Updated dependencies.

### Fixed

- Version 12 `.user => .author` deprecation warning.

## [0.3.3] - 2024-08-09

### Added

- **New Animations**: Inner Radiance Torrent (P)

### Fixed

- Animations not properly inheriting multi-layer deep options and predicates.

## [0.3.2] - 2024-08-09

### Fixed

- Predicates not being saved in Custom Animations Menu.

## [0.3.1] - 2024-08-09

### Added

- Add support for animations on other tokens to be customized by their granter / origin.

### Fixed

- Reduce console and Sequence spam.

## [0.3.0] - 2024-08-08

### Added

- JSON Export Button on Actor Custom Animations ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))
- Item Custom Animations Menu ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))
- `opacity`, `size`, `loopProperty`, and `animateProperty` effect options.

  - **New Animations**: Rage

### Fixed

- Multiple effects chained together inheriting previous animations options, for some reason.

## [0.2.1] - 2024-08-07

### Added

- Further improvements to Actor Custom Animations ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))

## [0.2.0] - 2024-08-06

### Added

- First version of the Actor Custom Animations ([#3](https://github.com/MrVauxs/pf2e-graphics/issues/3))

## [0.1.3] - 2024-08-02

### Fixed

- Token Preview not updating when changing the token image path.
- Removing Predicates not returning to default value of `[]`.

## [0.1.2] - 2024-08-02

### Added

- Added a toggle to see the predicate data in the Token Image Manager.
- Added an option to use existing feats in the Token Image Manager.
- **New Animations**: Jaws

## [0.1.1] - 2024-08-01

### Fixed

- Improved the stability of the Token Image Manager, especially in regards to pre-existing rule elements.

## [0.1.0] - 2024-07-31

### Added

- "Developer mode" setting. Puts into console what is being played with what roll options. Automatically on in `npm run dev`.
- Token Image Manager ([#4](https://github.com/MrVauxs/pf2e-graphics/issues/4))
- **New Animations**: Melee Ignition, Jaws, Unarmed Attack / Fist

### Changed

- All animations are now preloaded prior to being played.

### Fixed

- Granting effects causing any previous effects to also trigger.

## [0.0.9] - 2024-07-26

### Added

- Sounds ([#5](https://github.com/MrVauxs/pf2e-graphics/issues/5))
- `.overrides` property, allowing for animations to remove others from being played.
  - Examples include preventing playing generic base animations on specific weapons (Arquebus > Firearm group.)
- `.wait` and `.delay` Sequencer options.
- Animations predicated upon on Performance Settings
- `.reference` property, allowing for individual animation objects to reference other keys as well as adding their own
  - (ex. Elemental Blast (Air) using Electric Arc animation predicated on the attack being an electric blast)

### Changed

- `options.shape.value` to `options.shape.type`
- **New Animations**: Light Pick, Firearm Group, Arquebus
- **New Sounds**: Chain Lightning / Electric Arc, Bow Shots, Crossbow Shots

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

- Merge separate animations files via Vite plugin ([#1](https://github.com/MrVauxs/pf2e-graphics/issues/1))
- Eslint Rules
- Moved internal structure
- Pre-release versions to be semver compliant


[Unreleased]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.4...HEAD
[0.6.4]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.0.9...v0.1.0
[0.0.9]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.0.8-alpha...v0.0.9
[0.0.8-alpha]: https://github.com/MrVauxs/pf2e-graphics/releases/tag/v0.0.8-alpha
