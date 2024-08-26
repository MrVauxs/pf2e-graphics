// Start from 01
const p = 'modules/pf2e-graphics/assets/library';
export const database = {
	// #region Weapons
	generic: {
		miss: {
			'01': `${p}/sounds/soniss/SWSH_Swing 3 Large 03_DDUMAIS_NONE.ogg`,
		},
		swing: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/giant-demon-sword-swoosh.ogg`,
			'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/diablo-swing-01.ogg`,
			'03': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/diablo-swing-02.ogg`,
			'04': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/tyrael-wings-swing.ogg`,
		},
		hit: {
			blunt: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-hit-the-giants-eye_flesh.ogg`,
				'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh A.ogg`,
				'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh B.ogg`,
				'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh C.ogg`,
				'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh D.ogg`,
				'06': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh E.ogg`,
				'07': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh F.ogg`,
			},
			sharp: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/malthael-weapon-hit.ogg`,
			},
		},
		throw: {
			'01': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw A.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw B.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw C.ogg`,
		},
	},
	knife: {
		miss: {
			'01': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh A.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh B.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh C.ogg`,
			'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh D.ogg`,
			'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh E.ogg`,
		},
	},
	sword: {
		melee: {
			impale: `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-impale-flesh-05.ogg`,
			takeout: `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-out-of-flesh-06.ogg`,
			slice: `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-slice-flesh-02.ogg`,
			swing: {
				'01': `${p}/sounds/tom-music/sword/Sword Attack 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Attack 2.ogg`,
				'03': `${p}/sounds/tom-music/sword/Sword Attack 3.ogg`,
			},
			hit: {
				solid: {

					'04': `${p}/sounds/soniss/SWSH_Sword Slash Impact V2 Assorted 18_DDUMAIS_NONE.ogg`,
					'01': `${p}/sounds/tom-music/sword/Sword Blocked 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Blocked 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Blocked 3.ogg`,
				},
				flesh: {
					'01': `${p}/sounds/tom-music/sword/Sword Impact Hit 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Impact Hit 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Impact Hit 3.ogg`,

					'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/sword-out-of-flesh.ogg`,
					'05': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-01.ogg`,
					'06': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-02.ogg`,
					'07': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-03.ogg`,
				},
				parry: {
					'01': `${p}/sounds/tom-music/sword/Sword Parry 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Parry 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Parry 3.ogg`,
				},
			},
			miss: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-03.ogg`,
				'03': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-04.ogg`,
				'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-05.ogg`,
				'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh A.ogg`,
				'06': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh B.ogg`,
				'07': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh C.ogg`,
				'08': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh D.ogg`,
				'09': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh E.ogg`,
			},
			sheath: {
				'01': `${p}/sounds/tom-music/sword/Sword Sheath 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Sheath 2.ogg`,
			},
			unsheath: {
				'01': `${p}/sounds/tom-music/sword/Sword Unsheath 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Unsheath 2.ogg`,
			},
		},
		throw: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-throw-swoosh-02.ogg`,
		},
	},
	bow: {
		attack: {
			'01': `${p}/sounds/tom-music/bow/Bow Attack 1.ogg`,
			'02': `${p}/sounds/tom-music/bow/Bow Attack 2.ogg`,
			'03': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot1.ogg`,
			'04': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot2.ogg`,
			'05': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot3.ogg`,
			'06': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot4.ogg`,
			'07': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot5.ogg`,
			'08': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot6.ogg`,
			'09': `${p}/sounds/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot7.ogg`,
		},
		hit: {
			solid: {
				'01': `${p}/sounds/tom-music/bow/Bow Blocked 1.ogg`,
				'02': `${p}/sounds/tom-music/bow/Bow Blocked 2.ogg`,
				'03': `${p}/sounds/tom-music/bow/Bow Blocked 3.ogg`,
			},
			flesh: {
				'01': `${p}/sounds/tom-music/bow/Bow Impact Hit 1.ogg`,
				'02': `${p}/sounds/tom-music/bow/Bow Impact Hit 2.ogg`,
				'03': `${p}/sounds/tom-music/bow/Bow Impact Hit 3.ogg`,
			},
		},
		sheath: {
			'01': `${p}/sounds/tom-music/bow/Bow Put Away 1.ogg`,
		},
		unsheath: {
			'01': `${p}/sounds/tom-music/bow/Bow Take Out 1.ogg`,
		},
	},
	crossbow: {
		shot: {
			'01': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot A.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot B.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot C.ogg`,
			'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot D.ogg`,
		},
		load: {
			'01': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Load A.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Load B.ogg`,
		},
	},
	axe: {
		slash: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/axe-hitting-metal_blood-splash.ogg`,
		},
		throw: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/axe-throwing-hitting-flesh.ogg`,
		},
		miss: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/axe-throwing.ogg`,
		},
	},
	flail: {
		miss: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/bludgeon-throwing.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh A.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh B.ogg`,
			'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh C.ogg`,
			'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh D.ogg`,
			'06': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh E.ogg`,
			'07': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh F.ogg`,
		},
	},
	spear: {
		hit: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-01.ogg`,
			'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-02.ogg`,
			'03': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-03.ogg`,
			'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-04.ogg`,
			'05': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-05.ogg`,
			'06': `${p}/sounds/soundflakes/diablo-wrath-weapon/spear-impale-flesh-hit.ogg`,
			'07': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/spear-penetration.ogg`,
			'08': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-hit-the-giant.ogg`,
		},
		miss: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-spear-whoosh.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh A.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh B.ogg`,
			'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh C.ogg`,
			'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh D.ogg`,
			'06': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh E.ogg`,
			'07': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh F.ogg`,
		},
		parry: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/diablo-reflect-the-spear-01.ogg`,
			'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/diablo-reflect-the-spear-02.ogg`,
		},
	},
	shield: {
		break: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/shield-breaking-with-bludgeon.ogg`,
		},
	},
	unarmed: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-face-punch.ogg`,
	},
	torch: {
		light: {
			single: {
				'01': `${p}/sounds/tom-music/torch/Light Torch 1.ogg`,
				'02': `${p}/sounds/tom-music/torch/Light Torch 2.ogg`,
			},
			loop: {
				'03': `${p}/sounds/tom-music/torch/Light Torch with Starting Loop 1.ogg`,
				'04': `${p}/sounds/tom-music/torch/Light Torch with Starting Loop 2.ogg`,
			},
		},
		attack: {
			'01': `${p}/sounds/tom-music/torch/Torch Attack Strike 1.ogg`,
			'02': `${p}/sounds/tom-music/torch/Torch Attack Strike 2.ogg`,
		},
		impact: {
			'01': `${p}/sounds/tom-music/torch/Torch Impact 1.ogg`,
			'02': `${p}/sounds/tom-music/torch/Torch Impact 2.ogg`,
		},
	},
	// #endregion
	// #region Misc
	critical: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-01.ogg`,
		'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-02.ogg`,
		'03': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-03.ogg`,
		'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-04.ogg`,
	},
	finisher: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-last-hit.ogg`,
	},
	containers: {
		unlock: {
			'01': `${p}/sounds/tom-music/containers/Lock Unlock.ogg`,
		},
	},
	magic: {
		air: {
			blade: {
				aero: {
					cast: {
						'01': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Cast A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Cast B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Cast C.ogg`,
					},
					impact: {
						'01': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Impact A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Impact B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Impact C.ogg`,
					},
					trail: {
						loop: `${p}/sounds/ovani-sounds/Magic/Air/Aero Blade Trail Loop.ogg`,
					},
				},
				cyclone: {
					cast: {
						'01': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Cast A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Cast B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Cast C.ogg`,
					},
					impact: {
						'01': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Impact A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Impact B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Impact C.ogg`,
					},
					trail: {
						loop: `${p}/sounds/ovani-sounds/Magic/Air/Cyclone Blade Trail Loop.ogg`,
					},
				},
			},
			teleport: {
				'01': {
					in: `${p}/sounds/ovani-sounds/Magic/Air/Aeroportation In.ogg`,
					out: `${p}/sounds/ovani-sounds/Magic/Air/Aeroportation Out.ogg`,
				},
			},
			gust: {
				echoing: {
					cast: `${p}/sounds/ovani-sounds/Magic/Air/Echoing Gust Cast.ogg`,
					impact: `${p}/sounds/ovani-sounds/Magic/Air/Echoing Gust impact.ogg`,
				},
				whirlwind: {
					'01': `${p}/sounds/ovani-sounds/Magic/Air/Whirlwind Gust.ogg`,
				},
			},
			mist: {
				form: {
					'01': `${p}/sounds/ovani-sounds/Magic/Air/Mistform.ogg`,
				},
			},
			surge: {
				'01': `${p}/sounds/ovani-sounds/Magic/Air/Sky Surge.ogg`,
			},
			zephyr: {
				embrace: `${p}/sounds/ovani-sounds/Magic/Air/Zephyrs Embrace.ogg`,
				resonance: `${p}/sounds/ovani-sounds/Magic/Air/Zephyrs Resonance.ogg`,
			},
		},
		fire: {
			cast: {
				single: {
					'01': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_01.ogg`,
					'02': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_02.ogg`,
				},
				loop: {
					'01': `${p}/sounds/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Fire_Cast_Loop_01.ogg`,
					'02': `${p}/sounds/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Fire_Cast_Loop_02.ogg`,
				},
			},
			hold: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_HOLD_4s.ogg`,
			},
			impact: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_IMPACT_01.ogg`,
			},
			launch: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_LAUNCH_01.ogg`,
				'02': {
					'01': `${p}/sounds/tom-music/magic/fire/Fireball 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/fire/Fireball 2.ogg`,
					'03': `${p}/sounds/tom-music/magic/fire/Fireball 3.ogg`,
				},
			},
			gust: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Gust 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Gust 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Gust 003.ogg`,
			},
			enchant: {
				lava: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Lava Enchantment Loop 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Lava Enchantment Loop 002.ogg`,
				},
			},
			ward: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Ward 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Ward 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Fire/Fire Ward 003.ogg`,
			},
			miasma: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Miasma 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Miasma 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Fire/Miasma 003.ogg`,
			},
			smoke: {
				loop: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Suffocating Smoke Loop 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Suffocating Smoke Loop 002.ogg`,
				},
				strike: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Smoke Strike 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Smoke Strike 002.ogg`,
					'03': `${p}/sounds/ovani-sounds/Magic II/Fire/Smoke Strike 003.ogg`,
				},
			},
			summon: {
				'coal-spirit': `${p}/sounds/ovani-sounds/Magic II/Fire/Summon Coal Spirit.ogg`,
				'fire-spawn': `${p}/sounds/ovani-sounds/Magic II/Fire/Summon Fire Spawn.ogg`,
				'sparkle': `${p}/sounds/ovani-sounds/Magic II/Fire/Summon Sparkle.ogg`,
			},
			ignite: {
				'01': `${p}/sounds/tom-music/magic/fire/Firebuff 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/fire/Firebuff 2.ogg`,
			},
			buff: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Fire/Warm Buff 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Fire/Warm Buff 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Fire/Warm Buff 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Fire/Warm Buff 004.ogg`,
			},
			spray: {
				'01': `${p}/sounds/tom-music/magic/fire/Firespray 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/fire/Firespray 2.ogg`,
			},
		},
		dark: {
			bolt: {
				'01': {
					cast: {
						'01': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Cast A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Cast B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Cast C.ogg`,
					},
					impact: {
						'01': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Impact A.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Impact B.ogg`,
						'03': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Impact C.ogg`,
					},
					trail: {
						loop: {
							'01': `${p}/sounds/ovani-sounds/Magic/Dark/Shadow Bolt Trail Loop.ogg`,
						},
					},
				},
			},
			siphon: {
				'01': `${p}/sounds/ovani-sounds/Magic/Dark/Soul Siphon.ogg`,
			},
			shatter: {
				'01': `${p}/sounds/ovani-sounds/Magic/Dark/Soul Shatter.ogg`,
			},
			light: {
				'01': `${p}/sounds/ovani-sounds/Magic/Dark/Necrotic Touch.ogg`,
			},
			wave: {
				'01': `${p}/sounds/ovani-sounds/Magic/Dark/Abyssal Pulse.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic/Dark/Dread Wave.ogg`,
			},
			curse: {
				'01': {
					'01': `${p}/sounds/ovani-sounds/Magic/Dark/Nightshade Curse.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic/Dark/Horrify.ogg`,
				},
			},
		},
		earth: {
			geokinesis: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Geokinesis Loop 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Geokinesis Loop 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Earth/Geokinesis Loop 003.ogg`,
			},
			stoneskin: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Stoneskin 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Stoneskin 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Earth/Stoneskin 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Earth/Stoneskin 004.ogg`,
			},
			armor: {
				'01': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Armor.ogg`,
			},
			quicksand: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Quicksand Loop 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Quicksand Loop 002.ogg`,
			},
			grease: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Grease Loop 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Grease Loop 002.ogg`,
			},
			ranged: {
				single: {
					throw: {
						'01': `${p}/sounds/tom-music/magic/earth/Rock Meteor Throw 1.ogg`,
						'02': `${p}/sounds/tom-music/magic/earth/Rock Meteor Throw 2.ogg`,
						'boulder': {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Cast A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Cast B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Cast C.ogg`,
						},
						'rock': {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast C.ogg`,
						},
						'stone': {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast C.ogg`,
						},
					},
					missile: {
						'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Rocky Missile 001.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Rocky Missile 002.ogg`,
					},
					impact: {
						boulder: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Impact A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Impact B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Impact C.ogg`,
						},
						rock: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Cast C.ogg`,
						},
						stone: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast A.ogg`,
							'02': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast B.ogg`,
							'03': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Cast C.ogg`,
						},
					},
				},
				barrage: {
					throw: {
						'01': `${p}/sounds/tom-music/magic/earth/Rock Meteor Swarm 1.ogg`,
						'02': `${p}/sounds/tom-music/magic/earth/Rock Meteor Swarm 2.ogg`,
					},
					missile: `${p}/sounds/ovani-sounds/Magic II/Earth/Rocky Missile 003.ogg`,
				},
				storm: `${p}/sounds/ovani-sounds/Magic II/Earth/Stonepocalypse.ogg`,
				trail: {
					loop: {
						boulder: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Boulder Throw Trail Loop.ogg`,
						},
						rock: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Rock Throw Trail Loop.ogg`,
						},
						stone: {

							'01': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Throw Trail Loop.ogg`,
						},
					},
				},
			},
			ward: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Stone Ward 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Stone Ward 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Earth/Stone Ward 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Earth/Stone Ward 004.ogg`,
			},
			wall: {
				'01': `${p}/sounds/tom-music/magic/earth/Rock Wall 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/earth/Rock Wall 2.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic/Earth/Stone Wall.ogg`,
			},
			close: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-02.ogg`,
				'03': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-03.ogg`,
			},
			explosion: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-with-chains-is-destroyed.ogg`,

				'02': `${p}/sounds/ovani-sounds/Magic/Earth/Quake Step.ogg`,
			},
			eruption: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Earth/Boulder Eruption 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Earth/Boulder Eruption 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Earth/Boulder Eruption 003.ogg`,
			},
			pulse: {

				'01': `${p}/sounds/ovani-sounds/Magic/Earth/Seismic Pulse.ogg`,
			},
			magnet: {
				burst: {

					'01': `${p}/sounds/ovani-sounds/Magic/Earth/Magnetic Burst.ogg`,
				},
			},
			grab: {

				'01': `${p}/sounds/ovani-sounds/Magic/Earth/Earthern Grasp.ogg`,
			},
			meld: {

				'01': `${p}/sounds/ovani-sounds/Magic/Earth/Earthmeld.ogg`,
			},
		},
		ice: {
			ranged: {
				barrage: {
					'01': `${p}/sounds/tom-music/magic/ice/Ice Barrage 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/ice/Ice Barrage 2.ogg`,
				},
				strike: {
					loop: {
						'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Loop 001.ogg`,
						'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Loop 002.ogg`,
					},
				},
				frostbourne: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frostbourne 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frostbourne 002.ogg`,
					'03': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frostbourne 003.ogg`,
					'04': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frostbourne 004.ogg`,
				},
			},
			wall: {
				'01': `${p}/sounds/tom-music/magic/ice/Ice Wall 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/ice/Ice Wall 2.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frost Wall 001.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frost Wall 002.ogg`,
				'05': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Frost Wall 003.ogg`,
			},
			seal: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Seal Of The Ocean Loop.ogg`,
			iceberg: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Summon Iceberg 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Summon Iceberg 002.ogg`,
			},
			dispel: {
				magic: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 002.ogg`,
					'03': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 003.ogg`,
				},
				iceberg: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Dispel Iceberg.ogg`,
			},
			cast: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 003.ogg`,
			},
		},
		holy: {
			smite: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Smite 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Smite 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Smite 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Light/Smite 004.ogg`,
			},
			flyby: `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/angels-flying.ogg`,
			protection: {
				'01': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-01.ogg`,
				'02': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-02.ogg`,
				'03': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-03.ogg`,
				'04': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-04.ogg`,
				'05': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-05.ogg`,
			},
			seal: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Holy Seal Loop 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Holy Seal Loop 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Holy Seal Loop 003.ogg`,
			},
			bliss: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Eternal Bliss 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Eternal Bliss 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Eternal Bliss 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Light/Eternal Bliss 004.ogg`,
			},
			restoration: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Divine Restoration 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Divine Restoration 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Divine Restoration 003.ogg`,
			},
			cure: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Cure 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Cure 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Cure 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Light/Cure 004.ogg`,
			},
			bless: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Light/Bless 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Light/Bless 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Light/Bless 003.ogg`,
			},
		},
		healing: {
			'01': `${p}/sounds/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-1.ogg`,
			'02': `${p}/sounds/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-2.ogg`,
			'03': `${p}/sounds/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-3.ogg`,
		},
		shock: {
			impact: {
				'01': `${p}/sounds/ovani-sounds/Magic/Shock/Lightning Bolt Impact A.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic/Shock/Lightning Bolt Impact B.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic/Shock/Lightning Bolt Impact C.ogg`,
			},
		},
		lightning: {
			cast: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Lightning/EM_LIGHT_CAST_01_L.ogg`,
				'02': `${p}/sounds/LastDayDreaming/Magic/Lightning/EM_LIGHT_CAST_02_S.ogg`,
			},
			hold: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Lightning/EM_LIGHT_HOLD_5s.ogg`,
			},
			impact: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Lightning/EM_LIGHT_IMPACT_01.ogg`,
			},
			launch: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Lightning/EM_LIGHT_LAUNCH_01.ogg`,
			},
		},
		water: {
			charm: {
				single: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Mermaid Charm 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Mermaid Charm 002.ogg`,
				},
				loop: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Mermaid Charm Loop.ogg`,
			},
			cast: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Water/EM_WATER_CAST_01.ogg`,
				'02': `${p}/sounds/LastDayDreaming/Magic/Water/EM_WATER_CAST_02.ogg`,
			},
			hold: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Water/EM_WATER_HOLD_4s.ogg`,
			},
			impact: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Water/EM_WATER_IMPACT_01.ogg`,
			},
			launch: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Water/EM_WATER_LAUNCH_01.ogg`,
			},
			spray: {
				'01': `${p}/sounds/tom-music/magic/water/Waterspray 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/water/Waterspray 2.ogg`,
			},
			bless: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/River Blessing.ogg`,
			},
			call: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Call Of The Deep.ogg`,
			wave: {
				'01': `${p}/sounds/tom-music/magic/water/Wave Attack 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/water/Wave Attack 2.ogg`,
			},
			tides: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Enchantment Of Tides Loop.ogg`,
			ward: `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Wave Ward.ogg`,
			summon: {
				'01': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 003.ogg`,
			},
		},
		movement: {
			blink: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/etherael-blink-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/etherael-blink-02.ogg`,
			},
			strafe: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-02.ogg`,
				'03': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-03.ogg`,
			},
			fly: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-wings-swing-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-wings-swing-02.ogg`,
			},
		},
		counterspell: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-spellbreaking.ogg`,
		},
		fail: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-land-on-giant.ogg`,
		},
		weapons: {
			summon: `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-spears-in-the-air.ogg`,
			launch: `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-spears-launch.ogg`,
		},
		buff: {
			'01': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Item Use B.ogg`,
			'02': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Item Use A.ogg`,
			'03': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm C.ogg`,
			'04': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm B.ogg`,
			'05': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm A.ogg`,
			'06': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet D.ogg`,
			'07': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet C.ogg`,
			'08': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet B.ogg`,
			'09': `${p}/sounds/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet A.ogg`,
		},
		nature: {
			'animate-tree': {
				'01': `${p}/sounds/ovani-sounds/Magic II/Nature/Animate Tree 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Nature/Animate Tree 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Nature/Animate Tree 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Nature/Animate Tree 004.ogg`,
			},
			'roots': {
				'01': `${p}/sounds/ovani-sounds/Magic II/Nature/Deep Roots 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Nature/Deep Roots 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Nature/Deep Roots 003.ogg`,
				'04': `${p}/sounds/ovani-sounds/Magic II/Nature/Deep Roots 004.ogg`,
			},
			'charm': {
				single: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Nature/Dryad Charm Loop 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Nature/Dryad Charm Loop 002.ogg`,
					'03': `${p}/sounds/ovani-sounds/Magic II/Nature/Dryad Charm Loop 003.ogg`,
				},
				loop: `${p}/sounds/ovani-sounds/Magic II/Nature/Dryad Charm Loop.ogg`,
			},
			'buff': {
				'bear-rage': `${p}/sounds/ovani-sounds/Magic II/Nature/Bear Rage.ogg`,
				'bird-flight': `${p}/sounds/ovani-sounds/Magic II/Nature/Bird Flight.ogg`,
				'horse-speed': `${p}/sounds/ovani-sounds/Magic II/Nature/Horse Speed.ogg`,
				'lion-courage': `${p}/sounds/ovani-sounds/Magic II/Nature/Lion Courage.ogg`,
				'owl-wisdom': `${p}/sounds/ovani-sounds/Magic II/Nature/Owl Wisdom.ogg`,
			},
			'poison-swarm': {
				'01': `${p}/sounds/ovani-sounds/Magic II/Nature/Poisonous Swarm 001.ogg`,
				'02': `${p}/sounds/ovani-sounds/Magic II/Nature/Poisonous Swarm 002.ogg`,
				'03': `${p}/sounds/ovani-sounds/Magic II/Nature/Poisonous Swarm 003.ogg`,
			},
			'seal': {
				loop: {
					'01': `${p}/sounds/ovani-sounds/Magic II/Nature/Seal Of The Beasts Loop 001.ogg`,
					'02': `${p}/sounds/ovani-sounds/Magic II/Nature/Seal Of The Beasts Loop 002.ogg`,
				},
			},
		},
	},
	movement: {
		landing: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/tyrael-landing_footsteps.ogg`,
		},
	},
	dodge: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/auriel-avoiding.ogg`,
	},
	// #endregion
};
