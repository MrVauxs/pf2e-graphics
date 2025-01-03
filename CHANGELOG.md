# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](<https://keepachangelog.com/en/1.1.0/>),
and this project adheres to [Semantic Versioning](<https://semver.org/spec/v2.0.0.html>).

## [Unreleased]

### Added

- **`crosshair` and `animation` presets, allowing for usage of their respective Sequencer sections.**
- Dynamic Tokens data for Token Image import packs.
- Polish translation (thank you @Lioheart!)
- Combining Multiple Animations ([#49](<https://github.com/MrVauxs/pf2e-graphics/issues/49>))
- Wildcard `overrides` ([#202](<https://github.com/MrVauxs/pf2e-graphics/issues/202>))
- Usage of `name`d effects as a target through `options.preset.targets` ([#147](<https://github.com/MrVauxs/pf2e-graphics/issues/147>))
- Sound Preset ([#146](<https://github.com/MrVauxs/pf2e-graphics/issues/146>))
- **New Animations**
  - Added sounds to Breathe Fire (@MrVauxs)
  - Generic Casting Animation, Critical Success and Failure SFX for Strikes and Casting a Spell (@MrVauxs)
  - Treat Wounds/Battle Medicine (using Workbench), Dirty Trick, Grapple, Trip (@Aziareel)
  - Champion's Resistance, Devise a Stratagem, Strategic Strike, Surgical Shock, Cyclonic Ascent, Sneak Attack, Exploit Vulnerability (using  PF2e Exploit Vulnerability Module), Healer's Gloves, Extract Elements (@Aziareel)
  - Dueling Dance, Dueling Parry, Twin Parry & Twin Defense now share the Raise a Shield animation (@Aziareel)
  - Cornucopia, Crushing Ground, Guidance, Heal Animal, Lose the Path, Mushroom Patch, Needle Darts, Tempest Surge, Wildfire, Darkvision, Grease, Harmonize Self, Revealing Light, See the Unseen, Combustion, Holy Light, Magnetic Acceleration, Vision of Death, Howling Blizzard/Cone of Cold (+ Oscillating Wave), Disintegrate, Spirit Blast, Faerie Dust, Figment, Imaginary Weapon, Lay on Hands, Blazing Bolt, Blood Vendetta, Bloodspray Curse, Cleanse Affliction, Clear Mind, Sound Body, Darkness, False Vitality, Floating Flame, Heat Metal (+ Oscillating Wave), Paranoia, Powerful Inhalation, Translate, Water Breathing, Worm's Repast, Earthbind, Heroism, Cinder Swarm, Ymeri's Mark, Breath of Life, Flammable Fumes, Toxic Cloud, Flame Vortex (+ Oscillating Wave), Read Aura, Schadenfreude, Sigil, Laughing Fit, Sand Form, Confusion, Fire Shield (+ Oscillating Wave), Entwined Roots, Flames of Ego, Impaling Spike, Pressure Zone, Fiery Body (+ Oscillating Wave), Polar Ray (+ Oscillating Wave), Falling Stars (@Aziareel)
  - Persistent Damage (On Apply Damage Effects Only) (@ChasarooniZ)
  - Creature Abilities; Urevian - Diabolic Quill (@ChasarooniZ)

### Changed

- Significantly rewrote the animation backend to be more efficient and less error-prone
  - You can now chain references, ex. `custom-lightning-spell` leading to `chain-lightning` leading to `electric-arc` (up to 10 recursions)
- Updated validation scripts to provide more meaningful error messages in nicer formatting (@Spappz)
- `options.filter` now allows arrays ([#201](<https://github.com/MrVauxs/pf2e-graphics/issues/201>))
- `options.sound` has been deprecated.
- `offset.flipX/Y` has been deprecated.
- Token Image Manager now unlinks the feat its managing instead of deleting it.
- Blazing Wave now uses the Breathe Fire animation.
- Spear Group Attacks now work with JB2A Free version
- Oscillating Wave's Breathe Fire/Fireball now have an additional animation
- Kinetic Aura added for other Gates (@ChasarooniZ)

### Fixed

- Vitality Lash should now work again (@Aziareel)
- Shield (Cantrip) should now work again (@Aziareel)
- Validation error when `preset.options.blur` was used (@Spappz)
- NPCs with no owners breaking animations. ([#258](<https://github.com/MrVauxs/pf2e-graphics/issues/258>))

## [0.9.4] - 2024-11-22

### Fixed

- Worked around user ownership being buggy for imported adventure characters.

## [0.9.3] - 2024-09-21

### Changed

- Nothing. This release is purely for purposes of syncing the `module.zip` with the Forge. Again.

## [0.9.2] - 2024-09-21

### Fixed

- Changing the volume causing it to be applied multiplicatively with itself over multiple animations (so 1st is 50%, 2nd is 25%, 3rd is 12.5%, etc.)

## [0.9.1] - 2024-09-12

### Changed

- Nothing. This release is purely for purposes of syncing the `module.zip` with the Forge.

## [0.9.0] - 2024-09-11

### Added

- **A separate Persistent Animations setting.** Allows you to play or disable persistent animations regardless of quality settings.
  - Its roll option for animations is `settings:persistent`.
- Added `toggle:create`, `toggle:update`, and `toggle:delete` roll options for `toggle` trigger.
- "JB2A Mode" dev-only setting, allowing to quickly change between the module acting if only jb2a_patreon or JB2A_DnD5e is installed.
- Users now can see the Preset and World animations. They still cannot make changes to them.
- `requires` to Token Image packs. If a given module is not installed (but can be inactive!), the given options will not be shown.
- Monster Core Token Image Packs for Animal Form, Dragon Form, etcetera. Do note that Monster Core does not include images for every form.
- JSON Editor now clearly states whether it is in edit mode or read-only mode.
- Support for NPC and Item sheets having on-sheet "Animations" Tab button instead of a Header button. ([#154](<https://github.com/MrVauxs/pf2e-graphics/issues/154>))
- New "button position" setting for minimized graphics Header button (i.e. just the icon, no text). ([#154](<https://github.com/MrVauxs/pf2e-graphics/issues/154>))
- CSS Improvements (added [`content-visiblity`](<https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility>) and [`contain`](<https://developer.mozilla.org/en-US/docs/Web/CSS/contain>)) to list-like menus such as Animation History, Custom Animations, and Token Image Manager.
- **New Animations**
  - "Accelerate" and "Decelerate" from Dreams Circle (`graphics-vfx`)
  - Stabilize (Tradition Variants), Haste, Slow, Warp Step, Slashing Gust, Staves, Drain Bonded Item, Unleash Psyche, Produce Flame, Shove, Seek (@MrVauxs)
  - Courageous Anthem (using Workbench aura), Haunting Hymn, Heal, Light, Soothe, Telekinetic Rend, Triple Time (using Workbench aura) (@Mystler)
  - Flying Flame (@MrVauxs, @ChasarooniZ)
  - Tail, Horn, Trident (@ChasarooniZ)

### Changed

- **Changed all sounds to use `graphics-sfx` instead of `pf2e-graphics`**. Added `graphics-vfx`.
- **Maximum Settings no longer create persistent animations.** See the Added section.
- Quality Settings have been changed from `graphics-quality:X` to `settings:quality:X`.
- Removed the *Window Location* setting. Its now always on top, matching the original sheet.
- Tweaked Animations
  - Refactored all Conditions and some Effect animations. Some, primarily those with multiple steps were changed. (@MrVauxs)
  - Fixed all animations that were exclusive to JB2A Patreon to work on the free pack as well. (huge thanks to @Spappz!)
  - Delayed the Crossbow attack sound (@MrVauxs)
  - Blazing Wave now covers lot more area. (@MrVauxs)
  - Oscillating Wave ignite/produce flame now creates an ice projectile and not a blue fire bolt. (@MrVauxs)
  - Admonishing Ray (sound), Caustic Blast (sound), Daze, Divine Lance, Phase Bolt, Shield (sound), Void Warp (sound) (@Mystler)

### Fixed

- Animation History not including `settings` roll options.
- Fixed animations not triggering saying there are no targets when there are.
- Improved the handling of `default` animations, with multiple `default`s in separate parts of the same animation no longer causing issues.
- Fixed roll-based triggers using the wrong sluggify function for roll outcomes (resulting in `criticalfailure` instead of `critical-failure`).
- `remove` removing animations from all tokens and not just the one affected.
- Creating World Animations causing some but not all (???) preset animations to no longer function. ([#165](<https://github.com/MrVauxs/pf2e-graphics/issues/165>))

## [0.8.3] - 2024-08-28

### Added

- Triggers being shown in Animation History.
- Rudimentary support for rulesSelections as predicates (ex. `effect:rulesSelections:aidBonus:-1`).

### Changed

- **Removed `spell-cast` trigger in favor of `action`.**

### Fixed

- Stabilize and Aid animations.
- Multiple animations exiting early instead of playing every triggered animation.

## [0.8.2] - 2024-08-28

### Changed

- Various persistent animations to abide by standards.
  - For reference, those standards are: Minimum quality settings do not have persistent animations, Low quality get either very basic persistent animations, or more long-term / advanced animations that show only on beginning of turn, Medium quality get an extension of Low with extra stuff added in, and Maximum quality users get all animations for as long as the effect or condition applies.

### Fixed

- Dice So Nice causing animations to not trigger.
- JB2A Warnings triggering despite the free JB2A module being active.
- Tokens with no ownership crashing animations.

## [0.8.1] - 2024-08-27

### Fixed

- The Sounds database being wrapped by one too many object brackets.

## [0.8.0] - 2024-08-27

### Added

- Live preview mode to JSON Editor. Accessed by Shift clicking.
- `action` trigger. Activates animations whenever an action is posted, like Recognize Spell or Change Shape.
- Animation History menu. Stores animations played in the current session. Removed on refresh.
- Delay Animations settings. ([#111](<https://github.com/MrVauxs/pf2e-graphics/issues/111>))
- Added support for flat-check animations. ([#110](<https://github.com/MrVauxs/pf2e-graphics/issues/110>))
- Added support for persistent damage animations. ([#110](<https://github.com/MrVauxs/pf2e-graphics/issues/110>))
- Animation volume adjustment in both module settings and playlist tab. ([#89](<https://github.com/MrVauxs/pf2e-graphics/issues/89>))
- Holding Shift to see processed version of premade animations in Preset Animations menu.
- Ability to see errorenous sounds in Preset Animations menu.
- Support for multiple Triggers in animations.
- Warnings for when you dont have JB2A enabled.
- Conditions triggering `toggle` animations.
- **New Sounds**
  - [EminYILDIRIM](<https://freesound.org/people/EminYILDIRIM/>) (@ChasarooniZ)
  - [Tom Music](<https://tommusic.itch.io/>) (@ChasarooniZ)
  - Mapped metric ton of sounds to the DB from Ovani Sounds and GameDev Market (@MrVauxs, @ChasarooniZ)
- **New Animations**
  - Remaining Elemental Blasts, Briny Bolt, Divine Wrath, Bleeding Finisher, Confident Finisher, Panache, Nudge the Scales, All of the Conditions (except persistent damage) (@ChasarooniZ)
  - Boost Eidolon, Detect Magic, Evolution Surge, Force Barrage, Grim Tendrils, Ill Omen, Kinetic Ram (@Lerosnn)
  - Added Sounds to Divine Lance, Phase Bolt, Rousing Splash, Telekinetic Projectile (@Mystler!)
  - Added Sounds to Ignite. (@MrVauxs)

### Changed

- Sounds now are played before animations, allowing for more intuitive usage of `waitUntilFinished`.
  - As such, animations have been adjusted for this change.
- `atLocation`, `attachTo`, `stretchTo`, and `rotateTowards` have been removed from the `options` object and moved to `options.preset`, as these options are specific to each preset.

### Fixed

- The Animations Menu breaking when JB2A is not enabled ([#88](<https://github.com/MrVauxs/pf2e-graphics/issues/88>))
- Divine Lance predicates (@ChasarooniZ)
- Shield Boss Group Fix (@ChasarooniZ)
- Raise a Shield using the Shield cantrip animation. It uses the Shield Rampart animation now.

## [0.7.4] - 2024-08-21

### Added

- **New Sounds** from [LastDayDreaming](<https://lastdaydreaming.itch.io/>)! (@ChasarooniZ)
- Improvements to Custom Animations Menu:
  - Tooltips explaining options.
  - Delete button for subsidiary animations.
  - Tie To Documents only being shown with Persistent being on.
  - Warning when using file paths instead of Sequencer Database paths.
  - Setting preset to Macro reducing the menu down to macro input.
  - Significantly expanded the options available.
    - Randomize Mirror X/Y, Mirror X/Y, Fade In/Out, Size (+ Grid Units), Scale, Scale To Object

### Fixed

- The menu being partially not i18n-able.

## [0.7.3] - 2024-08-20

### Changed

- Removed update delay from World Animation settings.

## [0.7.2] - 2024-08-20

### Added

- Items that grant effects (ex. spells) storing animations pertaining to those effects.
  - Ex. Making a custom animation for the Lay On Hands **effect**, on the Lay On Hands **spell**.
- Modifiers Matter Trigger. Uses the triggering item's roll options and an additional `significance:` roll option ([#40](<https://github.com/MrVauxs/pf2e-graphics/issues/40>))
- More options to the Custom Animation menu.
- Drag and Drop ordering of Custom Animations ([#46](<https://github.com/MrVauxs/pf2e-graphics/issues/46>))
- **New Animations**:
  - Administer First Aid, Aid, Admonishing Ray (thank you @ChasarooniZ!)
  - Phase Bolt, Rousing Splash, and Telekinetic Projectile (thank you @Mystler!)

### Fixed

- Dev Mode not working without a refresh.
- World Animations menu not being able to properly delete animations.
- **Fixed Animations**:
  - Breath Fire, Chilling Spray, and Dizzying Colors should now take up the whole cone. (@7H3LaughingMan)

## [0.7.1] - 2024-08-18

### Fixed

- Old animations breaking the custom animations menu.
- **Fixed Animations**: Marshal's Aura being persistent at every performance setting.

## [0.7.0] - 2024-08-16

### Added

- **New Features to Animation Menus**, see *Changed* section.
- Origin data to `damage-taken` animations, allowing for animations to start from the attacker to the target taking damage / being healed.
- Ability to force `attachTo` on line and cone animations instead of standard `stretchTo`.
- SFX indicators, a Search bar, total tally, and columns config to Preset Animations Menu.
- **New Animations**:
  - Acid Splash, Alarm, Blight Bomb, Breathe Fire, Caustic Blast, Charm, Chilling Spray, Command, Daze, Dizzying Colors, Dread Ampoule, Enfeeble, Frostbite, Gale Blast, Gouging Claw, Mystic Armor, Puff of Poison, Scatter Scree, Spout, Void Warp (thank you @7H3LaughingMan!)
  - Divine Lance, Shield Spikes, Chain Sword, Shield Boss, Ray of Frost (thank you @ChasarooniZ!)
  - Pick Weapon Group (free JB2A version) (@MrVauxs)
- **New Sounds** from [SoundFlakes](<https://freesound.org/people/SoundFlakes/>)!

### Changed

- Spell Effect: Shield animation to be compatible with free version of JB2A.
- Existing alchemical bombs so that they follow the same layout.
- **Refactored Animations Menus**
  - Fixed bugs ([#38](<https://github.com/MrVauxs/pf2e-graphics/issues/38>))
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
  - Spell Effect: Shield (giving it to another token) (@MrVauxs)
  - Raise a Shield, Shields of the Spirit (Security) (thank you @ChasarooniZ!)

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
- **New Animations**: Acid Flask, Alchemist's Fire, Bottled Lightning, and Frost Vial (thank you @7H3LaughingMan!)

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
- **New Animations**: Club, Dart, Shield, Spear, Axe, Bomb, Brawling, Flail, Hammer, Polearm, and Sling (thank you @7H3LaughingMan!)

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

- TokenImage Imports ([#6](<https://github.com/MrVauxs/pf2e-graphics/issues/6>))
- World Animations Menu ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))
- Existing menus re-focusing when being opened again.
- Sound predicates and ability to have multiple sounds for effects.
- **New Sounds**: Sword Swing and Miss

## [0.4.0] - 2024-08-10

### Added

- `atLocation`, `radius`, `constrainedByWalls`, `volume`, and `duration` support for sound effects.
- `equipment:[state]` roll options for `toggle` animations. Use them wisely.
- `templateAsOrigin` preset option for `ranged` animations. Allows to have the template to be the source of the animation, as opposed to the owner token. Allows for template animations detached from token location.
- User Animation Menu ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))

### Changed

- The Sounds Database to use a two-digit indexes (01, 02, 03, etc.)
- Inner Radiance Torrent to use `templateAsOrigin`.
- Updated dependencies.

### Fixed

- Version 12 `.user => .author` deprecation warning.

## [0.3.3] - 2024-08-09

### Added

- **New Animations**: Inner Radiance Torrent

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

- JSON Export Button on Actor Custom Animations ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))
- Item Custom Animations Menu ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))
- `opacity`, `size`, `loopProperty`, and `animateProperty` effect options.

  - **New Animations**: Rage

### Fixed

- Multiple effects chained together inheriting previous animations options, for some reason.

## [0.2.1] - 2024-08-07

### Added

- Further improvements to Actor Custom Animations ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))

## [0.2.0] - 2024-08-06

### Added

- First version of the Actor Custom Animations ([#3](<https://github.com/MrVauxs/pf2e-graphics/issues/3>))

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
- Token Image Manager ([#4](<https://github.com/MrVauxs/pf2e-graphics/issues/4>))
- **New Animations**: Melee Ignition, Jaws, Unarmed Attack / Fist

### Changed

- All animations are now preloaded prior to being played.

### Fixed

- Granting effects causing any previous effects to also trigger.

## [0.0.9] - 2024-07-26

### Added

- Sounds ([#5](<https://github.com/MrVauxs/pf2e-graphics/issues/5>))
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

- Changelogs using [keep a changelog](<https://keepachangelog.com/en/1.1.0/>) format.
- Performance Settings
- Basic Sounds (Unprocessed)
- Ko-Fi Donation Button
- Effect, Template, Toggle, Start / End of Turn triggers for animations
- Test Runner

### Changed

- Merge separate animations files via Vite plugin ([#1](<https://github.com/MrVauxs/pf2e-graphics/issues/1>))
- Eslint Rules
- Moved internal structure
- Pre-release versions to be semver compliant

[Unreleased]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.9.4...HEAD
[0.9.4]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.9.3...v0.9.4
[0.9.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.8.3...v0.9.0
[0.8.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.8.2...v0.8.3
[0.8.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.7.4...v0.8.0
[0.7.4]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/MrVauxs/pf2e-graphics/compare/v0.6.4...v0.7.0
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
