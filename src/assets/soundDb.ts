export const DB_PREFIX = 'graphics-sfx';

// Start from 01
const p = 'modules/pf2e-graphics/assets/library/sounds';
export const database = {
	// #region Weapons
	generic: {
		miss: {
			'01': `${p}/soniss/SWSH_Swing 3 Large 03_DDUMAIS_NONE.ogg`,
			'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh A.ogg`,
			'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh B.ogg`,
			'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh C.ogg`,
			'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh D.ogg`,
			'06': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh E.ogg`,
			'07': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Blunt Whoosh F.ogg`,
		},
		swing: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/giant-demon-sword-swoosh.ogg`,
			'02': `${p}/soundflakes/diablo-wrath-miscellaneous/diablo-swing-01.ogg`,
			'03': `${p}/soundflakes/diablo-wrath-miscellaneous/diablo-swing-02.ogg`,
			'04': `${p}/soundflakes/diablo-wrath-miscellaneous/tyrael-wings-swing.ogg`,
		},
		hit: {
			blunt: {
				'01': `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-hit-the-giants-eye_flesh.ogg`,
				'02': `${p}/OpenGameArt/independent_nu/hits/hit03.ogg`,
				'03': `${p}/OpenGameArt/independent_nu/hits/hit06.ogg`,
				'04': `${p}/OpenGameArt/independent_nu/hits/hit33.ogg`,
				'05': `${p}/OpenGameArt/independent_nu/hits/hit34.ogg`,
				'06': `${p}/OpenGameArt/independent_nu/hits/hit35.ogg`,
				'07': `${p}/OpenGameArt/independent_nu/hits/hit36.ogg`,
				'08': `${p}/OpenGameArt/independent_nu/hits/hit37.ogg`,
			},
			sharp: {
				'01': `${p}/soundflakes/diablo-wrath-weapon/malthael-weapon-hit.ogg`,
			},
		},
		throw: {
			'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw A.ogg`,
			'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw B.ogg`,
			'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/General Throw C.ogg`,
		},
	},
	knife: {
		miss: {
			'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh A.ogg`,
			'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh B.ogg`,
			'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh C.ogg`,
			'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh D.ogg`,
			'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Small Blade Whoosh E.ogg`,
		},
	},
	boomerang: {
		throw: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Boomerang 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Boomerang 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Boomerang 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Boomerang 004.ogg`,
			},
		},
	},
	sword: {
		melee: {
			impale: `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-impale-flesh-05.ogg`,
			takeout: `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-out-of-flesh-06.ogg`,
			slice: `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-slice-flesh-02.ogg`,
			swing: {
				'01': {
					'01': `${p}/tom-music/sword/Sword Attack 1.ogg`,
					'02': `${p}/tom-music/sword/Sword Attack 2.ogg`,
					'03': `${p}/tom-music/sword/Sword Attack 3.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Blade Vibe 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Blade Vibe 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Blade Vibe 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Blade Vibe 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Blade Vibe 005.ogg`,
				},
			},
			hit: {
				solid: {
					'01': {
						'01': `${p}/tom-music/sword/Sword Blocked 1.ogg`,
						'02': `${p}/tom-music/sword/Sword Blocked 2.ogg`,
						'03': `${p}/tom-music/sword/Sword Blocked 3.ogg`,
					},
					'02': {
						'01': `${p}/soniss/SWSH_Sword Slash Impact V2 Assorted 18_DDUMAIS_NONE.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Crit A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Crit B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Crit C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Crit D.ogg`,
					},
				},
				flesh: {
					'01': `${p}/tom-music/sword/Sword Impact Hit 1.ogg`,
					'02': `${p}/tom-music/sword/Sword Impact Hit 2.ogg`,
					'03': `${p}/tom-music/sword/Sword Impact Hit 3.ogg`,
					'04': `${p}/soundflakes/diablo-wrath-weapon/sword-out-of-flesh.ogg`,
					'05': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-01.ogg`,
					'06': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-02.ogg`,
					'07': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-03.ogg`,
				},
				parry: {
					'01': {
						'01': `${p}/tom-music/sword/Sword Parry 1.ogg`,
						'02': `${p}/tom-music/sword/Sword Parry 2.ogg`,
						'03': `${p}/tom-music/sword/Sword Parry 3.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Parry/Parry Ultimate A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Parry/Parry Ultimate B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Parry/Parry Ultimate C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Parry/Parry Ultimate D.ogg`,
					},
				},
			},
			miss: {
				'01': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-03.ogg`,
				'03': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-04.ogg`,
				'04': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-05.ogg`,
				'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh A.ogg`,
				'06': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh B.ogg`,
				'07': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh C.ogg`,
				'08': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh D.ogg`,
				'09': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Large Blade Whoosh E.ogg`,
			},
			sheath: {
				'01': `${p}/tom-music/sword/Sword Sheath 1.ogg`,
				'02': `${p}/tom-music/sword/Sword Sheath 2.ogg`,
			},
			unsheath: {
				'01': `${p}/tom-music/sword/Sword Unsheath 1.ogg`,
				'02': `${p}/tom-music/sword/Sword Unsheath 2.ogg`,
			},
			bamboo: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Bamboo 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Bamboo 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Bamboo 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Bamboo 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Bamboo 005.ogg`,
				},
			},
		},
		throw: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/tyrael-sword-throw-swoosh-02.ogg`,
		},
	},
	bow: {
		attack: {
			'01': {
				'01': `${p}/tom-music/bow/Bow Attack 1.ogg`,
				'02': `${p}/tom-music/bow/Bow Attack 2.ogg`,
			},
			'02': {
				'03': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot1.ogg`,
				'04': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot2.ogg`,
				'05': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot3.ogg`,
				'06': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot4.ogg`,
				'07': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot5.ogg`,
				'08': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot6.ogg`,
				'09': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/BowWhistleShot7.ogg`,
			},
		},
		hit: {
			solid: {
				'01': `${p}/tom-music/bow/Bow Blocked 1.ogg`,
				'02': `${p}/tom-music/bow/Bow Blocked 2.ogg`,
				'03': `${p}/tom-music/bow/Bow Blocked 3.ogg`,
			},
			flesh: {
				'01': `${p}/tom-music/bow/Bow Impact Hit 1.ogg`,
				'02': `${p}/tom-music/bow/Bow Impact Hit 2.ogg`,
				'03': `${p}/tom-music/bow/Bow Impact Hit 3.ogg`,
			},
			combo: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Hit A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Hit B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Hit C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Hit D.ogg`,
					'05': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Hit E.ogg`,
				},
			},
		},
		magical: {
			arcane: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Fire A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Fire B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Fire C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Fire D.ogg`,
					'05': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Crit Fire E.ogg`,
				},
			},
		},
		miss: {
			'01': {
				'01': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Miss A.ogg`,
				'02': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Miss B.ogg`,
				'03': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Miss C.ogg`,
				'04': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Miss D.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Fail A.ogg`,
				'02': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Fail B.ogg`,
				'03': `${p}/ovani-sounds/Combos Crits and Fails/Arrow/Arrow Fail C.ogg`,
			},
		},
		sheath: {
			'01': `${p}/tom-music/bow/Bow Put Away 1.ogg`,
		},
		unsheath: {
			'01': `${p}/tom-music/bow/Bow Take Out 1.ogg`,
		},
	},
	crossbow: {
		shot: {
			'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot A.ogg`,
			'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot B.ogg`,
			'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot C.ogg`,
			'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Shot D.ogg`,
		},
		load: {
			'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Load A.ogg`,
			'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Weapons/Crossbow Load B.ogg`,
		},
	},
	creature: {
		roar: {
			shriek: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Tool/Rusty Tool A.ogg`,
				},
			},
			kraken: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Close A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Close B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Close C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Close D.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Distant A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Distant B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Distant C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Distant D.ogg`,
				},
			},
			siren: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Siren Call A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Siren Call B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Siren Call C.ogg`,
				},
			},
		},
		strike: {
			tentacle: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Tenticle A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Tenticle B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Kraken Tenticle C.ogg`,
				},
			},
		},
	},
	axe: {
		slash: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/axe-hitting-metal_blood-splash.ogg`,
		},
		throw: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/axe-throwing-hitting-flesh.ogg`,
		},
		miss: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/axe-throwing.ogg`,
		},
	},
	potion: {
		bomb: {
			break: {
				'01': {
					'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Break A.ogg`,
					'02': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Break B.ogg`,
					'03': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Break C.ogg`,
				},
			},
			acid: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Acid.ogg`,
			},
			blood: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Blood.ogg`,
			},
			explosion: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Explosion.ogg`,
			},
			fire: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Fire.ogg`,
			},
			holy_water: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Holy Water.ogg`,
			},
			ice: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Ice.ogg`,
			},
			lightning: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Lightning.ogg`,
			},
			poison: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Poison.ogg`,
			},
			water: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Pot Water.ogg`,
			},
		},
	},
	flail: {
		miss: {
			'01': {
				'01': `${p}/soundflakes/diablo-wrath-weapon/bludgeon-throwing.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh A.ogg`,
				'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh B.ogg`,
				'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh C.ogg`,
				'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh D.ogg`,
				'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh E.ogg`,
				'06': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Flail Whoosh F.ogg`,
			},
		},
		flame: {
			'01': {
				'01': `${p}/ovani-sounds/Magic/Fire/Flame Chain A.ogg`,
				'02': `${p}/ovani-sounds/Magic/Fire/Flame Chain B.ogg`,
				'03': `${p}/ovani-sounds/Magic/Fire/Flame Chain C.ogg`,
			},
		},
	},
	spear: {
		hit: {
			'01': {
				'01': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-02.ogg`,
				'03': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-03.ogg`,
				'04': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-04.ogg`,
				'05': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-05.ogg`,
			},
			'02': {
				'06': `${p}/soundflakes/diablo-wrath-weapon/spear-impale-flesh-hit.ogg`,
				'07': `${p}/soundflakes/diablo-wrath-miscellaneous/spear-penetration.ogg`,
				'08': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-hit-the-giant.ogg`,
			},
		},
		miss: {
			'01': {
				'01': `${p}/soundflakes/diablo-wrath-weapon/imperius-spear-whoosh.ogg`,
			},
			'02': {
				'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh A.ogg`,
				'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh B.ogg`,
				'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh C.ogg`,
				'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh D.ogg`,
				'06': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh E.ogg`,
				'07': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Whooshes/Spear Whoosh F.ogg`,
			},
		},
		parry: {
			'01': `${p}/soundflakes/diablo-wrath-miscellaneous/diablo-reflect-the-spear-01.ogg`,
			'02': `${p}/soundflakes/diablo-wrath-miscellaneous/diablo-reflect-the-spear-02.ogg`,
		},
	},
	shield: {
		break: {
			'01': `${p}/soundflakes/diablo-wrath-weapon/shield-breaking-with-bludgeon.ogg`,
		},
	},
	firearm: {
		ricochet: {
			'01': {
				'01': `${p}/ovani-sounds/Comedy SFX/Cartoon/Ricochet A.ogg`,
				'02': `${p}/ovani-sounds/Comedy SFX/Cartoon/Ricochet B.ogg`,
				'03': `${p}/ovani-sounds/Comedy SFX/Cartoon/Ricochet C.ogg`,
				'04': `${p}/ovani-sounds/Comedy SFX/Cartoon/Ricochet D.ogg`,
				'05': `${p}/ovani-sounds/Comedy SFX/Cartoon/Ricochet E.ogg`,
			},
		},
		impact: {
			magical: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Ultimate A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Ultimate B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Ultimate C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Ultimate D.ogg`,
				},
			},
		},
		misfire: {
			magical: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Fail A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Fail B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Fail C.ogg`,
				},
			},
		},
	},
	cannon: {
		fuse: {
			dud: {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Burning Fuse Dud.ogg`,
			},
			loop: {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Burning Fuse Loop A.ogg`,
			},
			complete: {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Burning Fuse With End A.ogg`,
				'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Burning Fuse With End B.ogg`,
			},
		},
		ball: {
			'01': {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ball A.ogg`,
				'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ball B.ogg`,
				'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ball C.ogg`,
				'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ball D.ogg`,
				'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ball E.ogg`,
			},
		},
		barrage: {
			'01': {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage A.ogg`,
				'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage B.ogg`,
				'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage C.ogg`,
				'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage D.ogg`,
				'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage E.ogg`,
				'06': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Barrage F.ogg`,
			},
		},
		fire: {
			close: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Close A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Close B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Close C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Close D.ogg`,
					'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Close E.ogg`,
				},
			},
			far: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Distant A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Distant B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Distant C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Distant D.ogg`,
					'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Fire Distant E.ogg`,
				},
			},
		},
		load: {
			'01': {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load A.ogg`,
				'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load B.ogg`,
				'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load C.ogg`,
				'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load D.ogg`,
				'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load E.ogg`,
				'06': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Load F.ogg`,
			},
		},
		ready: {
			'01': {
				'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ready A.ogg`,
				'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ready B.ogg`,
				'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Cannon Ready C.ogg`,
			},
		},
	},
	unarmed: {
		'01': {
			'01': `${p}/soundflakes/diablo-wrath-weapon/imperius-face-punch.ogg`,
		},
		'02': {
			'01': `${p}/OpenGameArt/independent_nu/hits/hit01.ogg`,
			'02': `${p}/OpenGameArt/independent_nu/hits/hit02.ogg`,
			'03': `${p}/OpenGameArt/independent_nu/hits/hit03.ogg`,
			'04': `${p}/OpenGameArt/independent_nu/hits/hit04.ogg`,
			'05': `${p}/OpenGameArt/independent_nu/hits/hit05.ogg`,
			'06': `${p}/OpenGameArt/independent_nu/hits/hit06.ogg`,
			'07': `${p}/OpenGameArt/independent_nu/hits/hit07.ogg`,
			'08': `${p}/OpenGameArt/independent_nu/hits/hit08.ogg`,
			'09': `${p}/OpenGameArt/independent_nu/hits/hit09.ogg`,
			'10': `${p}/OpenGameArt/independent_nu/hits/hit10.ogg`,
			'11': `${p}/OpenGameArt/independent_nu/hits/hit11.ogg`,
			'12': `${p}/OpenGameArt/independent_nu/hits/hit12.ogg`,
			'13': `${p}/OpenGameArt/independent_nu/hits/hit13.ogg`,
			'14': `${p}/OpenGameArt/independent_nu/hits/hit14.ogg`,
			'15': `${p}/OpenGameArt/independent_nu/hits/hit15.ogg`,
			'16': `${p}/OpenGameArt/independent_nu/hits/hit16.ogg`,
			'17': `${p}/OpenGameArt/independent_nu/hits/hit17.ogg`,
			'18': `${p}/OpenGameArt/independent_nu/hits/hit18.ogg`,
			'19': `${p}/OpenGameArt/independent_nu/hits/hit19.ogg`,
			'20': `${p}/OpenGameArt/independent_nu/hits/hit20.ogg`,
			'21': `${p}/OpenGameArt/independent_nu/hits/hit21.ogg`,
			'22': `${p}/OpenGameArt/independent_nu/hits/hit22.ogg`,
			'23': `${p}/OpenGameArt/independent_nu/hits/hit23.ogg`,
			'24': `${p}/OpenGameArt/independent_nu/hits/hit24.ogg`,
			'25': `${p}/OpenGameArt/independent_nu/hits/hit25.ogg`,
			'26': `${p}/OpenGameArt/independent_nu/hits/hit26.ogg`,
			'27': `${p}/OpenGameArt/independent_nu/hits/hit27.ogg`,
			'28': `${p}/OpenGameArt/independent_nu/hits/hit28.ogg`,
			'29': `${p}/OpenGameArt/independent_nu/hits/hit29.ogg`,
			'30': `${p}/OpenGameArt/independent_nu/hits/hit30.ogg`,
			'31': `${p}/OpenGameArt/independent_nu/hits/hit31.ogg`,
			'32': `${p}/OpenGameArt/independent_nu/hits/hit32.ogg`,
		},
		'03': {
			'01': `${p}/ovani-sounds/Combos Crits and Fails/Punch/Punch Ultimate A.ogg`,
			'02': `${p}/ovani-sounds/Combos Crits and Fails/Punch/Punch Ultimate B.ogg`,
			'03': `${p}/ovani-sounds/Combos Crits and Fails/Punch/Punch Ultimate C.ogg`,
			'04': `${p}/ovani-sounds/Combos Crits and Fails/Punch/Punch Ultimate D.ogg`,
		},
	},
	torch: {
		light: {
			single: {
				'01': `${p}/tom-music/torch/Light Torch 1.ogg`,
				'02': `${p}/tom-music/torch/Light Torch 2.ogg`,
			},
			loop: {
				'03': `${p}/tom-music/torch/Light Torch with Starting Loop 1.ogg`,
				'04': `${p}/tom-music/torch/Light Torch with Starting Loop 2.ogg`,
			},
		},
		attack: {
			'01': `${p}/tom-music/torch/Torch Attack Strike 1.ogg`,
			'02': `${p}/tom-music/torch/Torch Attack Strike 2.ogg`,
		},
		impact: {
			'01': `${p}/tom-music/torch/Torch Impact 1.ogg`,
			'02': `${p}/tom-music/torch/Torch Impact 2.ogg`,
		},
	},
	paper: {
		attack: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Paper 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Paper 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Paper 003.ogg`,
			},
		},
	},
	whip: {
		flame: {
			'01': `${p}/ovani-sounds/Magic/Fire/Fire Whip.ogg`,
		},
	},
	cards: {
		shuffle: {
			'01': {
				'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Deck Reassemble 001.ogg`,
				'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Deck Reassemble 002.ogg`,
				'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Deck Reassemble 003.ogg`,
				'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Deck Reassemble 004.ogg`,
			},
		},
		play: {
			'01': {
				'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard 001.ogg`,
				'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard 002.ogg`,
				'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard 003.ogg`,
				'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard 004.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Dispel 001.ogg`,
				'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Dispel 002.ogg`,
				'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Dispel 003.ogg`,
				'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Dispel 004.ogg`,
			},
			'03': {
				'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Flying Cards 001.ogg`,
				'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Flying Cards 002.ogg`,
				'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Flying Cards 003.ogg`,
				'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Flying Cards 004.ogg`,
			},
		},
		draw: {
			'01': {
				'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard For Gold 001.ogg`,
				'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard For Gold 002.ogg`,
				'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard For Gold 003.ogg`,
				'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Discard For Gold 004.ogg`,
			},
		},
	},
	// #endregion
	// #region Misc
	critical: {
		melee: {
			'01': {
				'01': `${p}/soundflakes/diablo-wrath-weapon/etherael-attack-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-weapon/etherael-attack-02.ogg`,
				'03': `${p}/soundflakes/diablo-wrath-weapon/etherael-attack-03.ogg`,
				'04': `${p}/soundflakes/diablo-wrath-weapon/etherael-attack-04.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Ultimate A.ogg`,
				'02': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Ultimate B.ogg`,
				'03': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Ultimate C.ogg`,
				'04': `${p}/ovani-sounds/Combos Crits and Fails/Sword/Sword Ultimate D.ogg`,
			},
		},
		ranged: {
			'01': {
				'01': `${p}/ovani-sounds/Science Fiction SFX 2/Big Freaking Gun A.ogg`,
				'02': `${p}/ovani-sounds/Science Fiction SFX 2/Big Freaking Gun B.ogg`,
				'03': `${p}/ovani-sounds/Science Fiction SFX 2/Big Freaking Gun C.ogg`,
			},
		},
	},
	misc: {
		detected: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Detected 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Detected 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Detected 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Detected 004.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Heavy Tom 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Heavy Tom 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Heavy Tom 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Heavy Tom 004.ogg`,
			},
		},
		suspense: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Suspense 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Suspense 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Suspense 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Suspense 004.ogg`,
			},
		},
		heartbeat: {
			'01': {
				slow: `${p}/ovani-sounds/Player Status SFX/General/Low HP Heartbeat Slow Loop.ogg`,
				fast: `${p}/ovani-sounds/Player Status SFX/General/Low HP Heartbeat Fast Loop.ogg`,
				middle: `${p}/ovani-sounds/Player Status SFX/General/Low HP Heartbeat Mid Loop.ogg`,
			},
		},
	},
	finisher: {
		'01': {
			'01': `${p}/soundflakes/diablo-wrath-weapon/imperius-last-hit.ogg`,
		},
	},
	containers: {
		unlock: {
			'01': `${p}/tom-music/containers/Lock Unlock.ogg`,
		},
		lock: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Magic Lock 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Magic Lock 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Magic Lock 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Magic Lock 004.ogg`,
				'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Magic Lock 005.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Metal Spring 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Metal Spring 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Metal Spring 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Metal Spring 004.ogg`,
				'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Metal Spring 005.ogg`,
			},
		},
		open: {
			'01': {
				'01': `${p}/ovani-sounds/Crafting SFX/Tool/Toolbox Open A.ogg`,
				'02': `${p}/ovani-sounds/Crafting SFX/Tool/Toolbox Open B.ogg`,
			},
		},
		close: {
			'01': {
				'01': `${p}/ovani-sounds/Crafting SFX/Tool/Toolbox Close A.ogg`,
				'02': `${p}/ovani-sounds/Crafting SFX/Tool/Toolbox Close B.ogg`,
			},
		},
	},
	magic: {
		air: {
			cast: {
				blade: {
					aero: {
						'01': `${p}/ovani-sounds/Magic/Air/Aero Blade Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Air/Aero Blade Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Air/Aero Blade Cast C.ogg`,
					},
					cyclone: {
						'01': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Cast C.ogg`,
					},
					cutter: {
						'01': {
							'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Metal Wind 001.ogg`,
							'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Metal Wind 002.ogg`,
							'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Metal Wind 003.ogg`,
						},
					},
				},
				generic: {
					'01': {
						'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_01.ogg`,
						'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_02.ogg`,
						'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_03.ogg`,
						'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_04.ogg`,
						'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_05.ogg`,
						'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_06.ogg`,
						'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_07.ogg`,
						'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_08.ogg`,
						'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_09.ogg`,
						'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Spell_10.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Turbine 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Turbine 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Turbine 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Turbine 004.ogg`,
						'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Turbine 005.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Air Vibe 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Air Vibe 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Air Vibe 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Air Vibe 004.ogg`,
						'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Air Vibe 005.ogg`,
					},
				},
			},
			impact: {
				blade: {
					aero: {
						'01': `${p}/ovani-sounds/Magic/Air/Aero Blade Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Air/Aero Blade Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Air/Aero Blade Impact C.ogg`,
					},
					cyclone: {
						'01': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Air/Cyclone Blade Impact C.ogg`,
					},
					whoosh: {
						'01': {
							'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Blade 001.ogg`,
							'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Blade 002.ogg`,
							'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Blade 003.ogg`,
							'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Blade 004.ogg`,
							'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Blade 005.ogg`,
						},
					},
				},
				loop: {
					'01': {
						blade: {
							aero: {
								trail: `${p}/ovani-sounds/Magic/Air/Aero Blade Trail Loop.ogg`,
							},
							cyclone: {
								trail: `${p}/ovani-sounds/Magic/Air/Cyclone Blade Trail Loop.ogg`,
							},
						},
					},
				},
			},
			teleport: {
				'01': {
					in: `${p}/ovani-sounds/Magic/Air/Aeroportation In.ogg`,
					out: `${p}/ovani-sounds/Magic/Air/Aeroportation Out.ogg`,
				},
			},
			strike: {
				wind: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Strike 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Strike 002.ogg`,
					},
				},
			},
			gust: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Blow 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Blow 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Air and Thunder/Blow 003.ogg`,
				},
				'02': {
					echoing: {
						cast: `${p}/ovani-sounds/Magic/Air/Echoing Gust Cast.ogg`,
						impact: `${p}/ovani-sounds/Magic/Air/Echoing Gust Impact.ogg`,
					},
					whirlwind: {
						'01': `${p}/ovani-sounds/Magic/Air/Whirlwind Gust.ogg`,
					},
				},
			},
			clear: {
				wind: {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Clearance 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Clearance 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Clearance 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Air and Thunder/Wind Clearance 004.ogg`,
				},
			},
			mist: {
				form: {
					'01': `${p}/ovani-sounds/Magic/Air/Mistform.ogg`,
				},
			},
			surge: {
				'01': {
					'01': `${p}/ovani-sounds/Magic/Air/Sky Surge.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Wind Drum 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Wind Drum 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Wind Drum 003.ogg`,
				},
			},
			zephyr: {
				embrace: `${p}/ovani-sounds/Magic/Air/Zephyrs Embrace.ogg`,
				resonance: `${p}/ovani-sounds/Magic/Air/Zephyrs Resonance.ogg`,
			},
			loop: {
				wind: {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Sparkling Wind Loop.ogg`,
				},
			},
			buff: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Wind/Wind_Buff_05.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Craft Wind Down.ogg`,
				},
			},
			glyph: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Air Glyph 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Air Glyph 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Air and Thunder/Air Glyph 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Air and Thunder/Air Glyph 004.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Wind Craft.ogg`,
				},
			},
			hurricane: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Wind 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Wind 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Wind 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Wind 004.ogg`,
				},
			},
		},
		fire: {
			cast: {
				single: {
					'01': {
						'01': `${p}/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_01.ogg`,
						'02': `${p}/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_02.ogg`,
					},
					'02': {
						'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_01.ogg`,
						'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_02.ogg`,
						'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_03.ogg`,
						'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_04.ogg`,
						'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_05.ogg`,
						'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_06.ogg`,
						'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_07.ogg`,
						'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_08.ogg`,
						'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_09.ogg`,
						'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Spell_10.ogg`,
					},
					'04': {
						small: {
							'01': `${p}/ovani-sounds/Magic/Fire/Small Fireball Cast A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Fire/Small Fireball Cast B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Fire/Small Fireball Cast C.ogg`,
						},
						medium: {
							'01': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Cast A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Cast B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Cast C.ogg`,
						},
						large: {
							'01': `${p}/ovani-sounds/Magic/Fire/Large Fireball Cast A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Fire/Large Fireball Cast B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Fire/Large Fireball Cast C.ogg`,
						},
					},
				},
				loop: {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Fire_Cast_Loop_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Fire_Cast_Loop_02.ogg`,
					'03': {
						small: {
							'01': `${p}/ovani-sounds/Magic/Fire/Small Fireball Trail Loop.ogg`,
						},
						medium: {
							'01': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Trail Loop.ogg`,
						},
						large: {
							'01': `${p}/ovani-sounds/Magic/Fire/Large Fireball Trail Loop.ogg`,
						},
					},
				},
			},
			hold: {
				'01': `${p}/LastDayDreaming/Magic/Fire/EM_FIRE_HOLD_4s.ogg`,
			},
			impact: {
				'01': `${p}/LastDayDreaming/Magic/Fire/EM_FIRE_IMPACT_01.ogg`,
				'02': {
					small: {
						'01': `${p}/ovani-sounds/Magic/Fire/Small Fireball Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Fire/Small Fireball Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Fire/Small Fireball Impact C.ogg`,
					},
					medium: {
						'01': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Fire/Medium Fireball Impact C.ogg`,
					},
					large: {
						'01': `${p}/ovani-sounds/Magic/Fire/Large Fireball Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Fire/Large Fireball Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Fire/Large Fireball Impact C.ogg`,
					},
				},
			},
			launch: {
				'01': {
					'01': `${p}/LastDayDreaming/Magic/Fire/EM_FIRE_LAUNCH_01.ogg`,
				},
				'02': {
					'01': `${p}/tom-music/magic/fire/Fireball 1.ogg`,
					'02': `${p}/tom-music/magic/fire/Fireball 2.ogg`,
					'03': `${p}/tom-music/magic/fire/Fireball 3.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Magic/Fire/Burning Hands.ogg`,
				},
				'04': {
					phoenix: `${p}/ovani-sounds/Magic/Fire/Phoenix Flash.ogg`,
				},
			},
			gust: {
				'01': `${p}/ovani-sounds/Magic II/Fire/Fire Gust 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Fire/Fire Gust 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Fire/Fire Gust 003.ogg`,
			},
			armor: {
				'01': `${p}/ovani-sounds/Magic/Fire/Flame Armor.ogg`,
			},
			enchant: {
				lava: {
					'01': `${p}/ovani-sounds/Magic II/Fire/Lava Enchantment Loop 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Fire/Lava Enchantment Loop 002.ogg`,
				},
			},
			ward: {
				'01': `${p}/ovani-sounds/Magic II/Fire/Fire Ward 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Fire/Fire Ward 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Fire/Fire Ward 003.ogg`,
			},
			miasma: {
				'01': `${p}/ovani-sounds/Magic II/Fire/Miasma 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Fire/Miasma 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Fire/Miasma 003.ogg`,
			},
			comet: {
				'01': `${p}/ovani-sounds/Magic/Fire/Blazing Comet.ogg`,
			},
			pillar: {
				'01': `${p}/ovani-sounds/Magic/Fire/Flame Pillar.ogg`,
			},
			smoke: {
				loop: {
					'01': `${p}/ovani-sounds/Magic II/Fire/Suffocating Smoke Loop 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Fire/Suffocating Smoke Loop 002.ogg`,
				},
				strike: {
					'01': `${p}/ovani-sounds/Magic II/Fire/Smoke Strike 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Fire/Smoke Strike 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Fire/Smoke Strike 003.ogg`,
				},
			},
			summon: {
				'coal-spirit': `${p}/ovani-sounds/Magic II/Fire/Summon Coal Spirit.ogg`,
				'fire-spawn': `${p}/ovani-sounds/Magic II/Fire/Summon Fire Spawn.ogg`,
				'sparkle': `${p}/ovani-sounds/Magic II/Fire/Summon Sparkle.ogg`,
			},
			ignite: {
				'01': {
					'01': `${p}/tom-music/magic/fire/Firebuff 1.ogg`,
					'02': `${p}/tom-music/magic/fire/Firebuff 2.ogg`,
				},
				'02': {
					snap: `${p}/ovani-sounds/Magic/Fire/Combustion.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fire Start 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fire Start 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fire Start 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fire Start 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fire Start 005.ogg`,
				},
			},
			buff: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Fire/Warm Buff 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Fire/Warm Buff 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Fire/Warm Buff 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Fire/Warm Buff 004.ogg`,
				},
				'02': {
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Buff_01.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Buff_02.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Buff_03.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Buff_04.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Fire/Fire_Buff_05.ogg`,
				},
			},
			spray: {
				'01': `${p}/tom-music/magic/fire/Firespray 1.ogg`,
				'02': `${p}/tom-music/magic/fire/Firespray 2.ogg`,
			},
			burst: {
				lava: {
					'01': `${p}/ovani-sounds/Magic/Fire/Lava Burst.ogg`,
				},
				phoenix: {
					'01': `${p}/ovani-sounds/Magic/Fire/Phoenix Burst.ogg`,
				},
			},
		},
		dark: {
			bolt: {
				cast: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Cast C.ogg`,
					},
				},
				impact: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Impact C.ogg`,
					},
				},
				loop: {
					'01': {
						trail: {
							'01': `${p}/ovani-sounds/Magic/Dark/Shadow Bolt Trail Loop.ogg`,
						},
					},
				},
			},
			siphon: {
				'01': `${p}/ovani-sounds/Magic/Dark/Soul Siphon.ogg`,
			},
			shatter: {
				'01': `${p}/ovani-sounds/Magic/Dark/Soul Shatter.ogg`,
			},
			light: {
				'01': `${p}/ovani-sounds/Magic/Dark/Necrotic Touch.ogg`,
			},
			wave: {
				'01': `${p}/ovani-sounds/Magic/Dark/Abyssal Pulse.ogg`,
				'02': `${p}/ovani-sounds/Magic/Dark/Dread Wave.ogg`,
			},
			buff: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Buff_05.ogg`,
				},
			},
			cast: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Shadow/Shadow_Spell_10.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Player Status SFX/General/Abstract Decision 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/General/Abstract Decision 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/General/Abstract Decision 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/General/Abstract Decision 004.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Moor 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Moor 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Moor 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Moor 004.ogg`,
				},
			},
			curse: {
				'01': {
					'01': `${p}/ovani-sounds/Magic/Dark/Nightshade Curse.ogg`,
					'02': `${p}/ovani-sounds/Magic/Dark/Horrify.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Magic II/Dark/Curse 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Dark/Curse 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Dark/Curse 003.ogg`,
				},
				'04': {
					'01': `${p}/ovani-sounds/Magic II/Dark/Hex 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Dark/Hex 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Dark/Hex 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Dark/Hex 004.ogg`,
				},
				'05': {
					'01': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dark Castle 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dark Castle 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dark Castle 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dark Castle 004.ogg`,
				},
				'06': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Space Oddity 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Space Oddity 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Space Oddity 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Space Oddity 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Space Oddity 005.ogg`,
				},
				'07': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Ghost Ship Tier 2 A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Enemies/Ghost Ship Tier 2 B.ogg`,
				},
			},
			bells: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Dark/Unholy Bells 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Dark/Unholy Bells 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Dark/Unholy Bells 003.ogg`,
				},
			},
			loop: {
				bells: {
					grave: {
						'01': `${p}/ovani-sounds/Magic II/Dark/Grave Ringing Loop 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Dark/Grave Ringing Loop 002.ogg`,
						'03': `${p}/ovani-sounds/Magic II/Dark/Grave Ringing Loop 003.ogg`,
					},
				},
				whispering: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Dark/Whispering Horror Loop 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Dark/Whispering Horror Loop 002.ogg`,
					},
				},
				cast: {
					'01': {
						'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Shadow_Cast_Loop_01.ogg`,
						'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Shadow_Cast_Loop_02.ogg`,
					},
				},
			},
			break: {
				mana: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Dark/Mana Break 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Dark/Mana Break 002.ogg`,
					},
				},
				soul: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Dark/Soul Break 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Dark/Soul Break 002.ogg`,
					},
				},
			},
			fear: {
				'02': {
					'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Fear 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Fear 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Fear 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Fear 004.ogg`,
				},
			},
			teleport: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Shadow Teleport 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Shadow Teleport 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Shadow Teleport 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Shadow Teleport 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Shadow Teleport 005.ogg`,
				},
			},
		},
		earth: {
			geokinesis: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Geokinesis Loop 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Geokinesis Loop 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Earth/Geokinesis Loop 003.ogg`,
			},
			stoneskin: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Stoneskin 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Stoneskin 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Earth/Stoneskin 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Earth/Stoneskin 004.ogg`,
			},
			armor: {
				'01': `${p}/ovani-sounds/Magic/Earth/Stone Armor.ogg`,
			},
			quicksand: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Quicksand Loop 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Quicksand Loop 002.ogg`,
			},
			grease: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Grease Loop 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Grease Loop 002.ogg`,
			},
			ranged: {
				single: {
					throw: {
						'01': {
							'01': `${p}/tom-music/magic/earth/Rock Meteor Throw 1.ogg`,
							'02': `${p}/tom-music/magic/earth/Rock Meteor Throw 2.ogg`,
						},
						'02': {
							boulder: {
								'01': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Cast A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Cast B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Cast C.ogg`,
							},
							rock: {
								'01': `${p}/ovani-sounds/Magic/Earth/Rock Throw Cast A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Earth/Rock Throw Cast B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Earth/Rock Throw Cast C.ogg`,
							},
							stone: {
								'01': `${p}/ovani-sounds/Magic/Earth/Stone Throw Cast A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Earth/Stone Throw Cast B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Earth/Stone Throw Cast C.ogg`,
							},
						},
					},
					missile: {
						'01': `${p}/ovani-sounds/Magic II/Earth/Rocky Missile 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Earth/Rocky Missile 002.ogg`,
					},
					impact: {
						boulder: {
							'01': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Impact A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Impact B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Impact C.ogg`,
						},
						rock: {
							'01': `${p}/ovani-sounds/Magic/Earth/Rock Throw Impact A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Earth/Rock Throw Impact B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Earth/Rock Throw Impact C.ogg`,
						},
						stone: {
							'01': `${p}/ovani-sounds/Magic/Earth/Stone Throw Impact A.ogg`,
							'02': `${p}/ovani-sounds/Magic/Earth/Stone Throw Impact B.ogg`,
							'03': `${p}/ovani-sounds/Magic/Earth/Stone Throw Impact C.ogg`,
						},
					},
				},
				barrage: {
					throw: {
						'01': `${p}/tom-music/magic/earth/Rock Meteor Swarm 1.ogg`,
						'02': `${p}/tom-music/magic/earth/Rock Meteor Swarm 2.ogg`,
					},
					missile: `${p}/ovani-sounds/Magic II/Earth/Rocky Missile 003.ogg`,
				},
				storm: `${p}/ovani-sounds/Magic II/Earth/Stonepocalypse.ogg`,
				trail: {
					loop: {
						boulder: {
							'01': `${p}/ovani-sounds/Magic/Earth/Boulder Throw Trail Loop.ogg`,
						},
						rock: {
							'01': `${p}/ovani-sounds/Magic/Earth/Rock Throw Trail Loop.ogg`,
						},
						stone: {
							'01': `${p}/ovani-sounds/Magic/Earth/Stone Trail Loop.ogg`,
						},
					},
				},
			},
			cast: {
				basic: {
					'01': {
						'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage A.ogg`,
						'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage B.ogg`,
						'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage C.ogg`,
						'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage D.ogg`,
						'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage E.ogg`,
						'06': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Battle/Ship Hull Damage F.ogg`,
					},
				},
			},
			ward: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Stone Ward 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Stone Ward 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Earth/Stone Ward 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Earth/Stone Ward 004.ogg`,
			},
			wall: {
				'01': `${p}/tom-music/magic/earth/Rock Wall 1.ogg`,
				'02': `${p}/tom-music/magic/earth/Rock Wall 2.ogg`,
				'03': `${p}/ovani-sounds/Magic/Earth/Stone Wall.ogg`,
			},
			close: {
				'01': `${p}/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-02.ogg`,
				'03': `${p}/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-03.ogg`,
			},
			explosion: {
				'01': {
					'01': `${p}/soundflakes/diablo-wrath-miscellaneous/stone-with-chains-is-destroyed.ogg`,
				},
				'02': {
					'02': `${p}/ovani-sounds/Magic/Earth/Quake Step.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Comet 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Comet 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Comet 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Comet 004.ogg`,
				},
			},
			eruption: {
				'01': `${p}/ovani-sounds/Magic II/Earth/Boulder Eruption 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Earth/Boulder Eruption 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Earth/Boulder Eruption 003.ogg`,
			},
			pulse: {
				'01': `${p}/ovani-sounds/Magic/Earth/Seismic Pulse.ogg`,
			},
			magnet: {
				burst: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Earth/Magnetic Burst.ogg`,
					},
				},
				cast: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Vibro 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Vibro 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Vibro 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Vibro 004.ogg`,
					},
				},
				wave: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Magnet 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Magnet 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Magnet 003.ogg`,
					},
				},
			},
			grab: {
				'01': `${p}/ovani-sounds/Magic/Earth/Earthen Grasp.ogg`,
			},
			meld: {
				'01': `${p}/ovani-sounds/Magic/Earth/Earthmeld.ogg`,
			},
			slide: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Stone Plate 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Stone Plate 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Stone Plate 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Stone Plate 004.ogg`,
				},
			},
		},
		ice: {
			ranged: {
				barrage: {
					'01': `${p}/tom-music/magic/ice/Ice Barrage 1.ogg`,
					'02': `${p}/tom-music/magic/ice/Ice Barrage 2.ogg`,
					'03': `${p}/ovani-sounds/Magic/Ice/Icicle Barrage.ogg`,
				},
				strike: {
					loop: {
						generic: {
							'01': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Loop 001.ogg`,
							'02': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Loop 002.ogg`,
						},
						lance: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Travel Loop.ogg`,
							},
						},
						snowball: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Snow Ball Travel Loop.ogg`,
							},
						},
					},
					cast: {
						lance: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Cast A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Cast B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Cast C.ogg`,
							},
						},
						snowball: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Snow Ball A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Ice/Snow Ball B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Ice/Snow Ball C.ogg`,
							},
						},
					},
					impact: {
						lance: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Impact A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Impact B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Ice/Crystal Lance Impact C.ogg`,
							},
						},
						snowball: {
							'01': {
								'01': `${p}/ovani-sounds/Magic/Ice/Snow Ball Impact A.ogg`,
								'02': `${p}/ovani-sounds/Magic/Ice/Snow Ball Impact B.ogg`,
								'03': `${p}/ovani-sounds/Magic/Ice/Snow Ball Impact C.ogg`,
							},
						},
					},
				},
				frostbourne: {
					'01': `${p}/ovani-sounds/Magic II/Water and Ice/Frostbourne 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Water and Ice/Frostbourne 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Water and Ice/Frostbourne 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Water and Ice/Frostbourne 004.ogg`,
				},
			},
			wall: {
				'01': {
					'01': `${p}/tom-music/magic/ice/Ice Wall 1.ogg`,
					'02': `${p}/tom-music/magic/ice/Ice Wall 2.ogg`,
				},
				'02': {
					'03': `${p}/ovani-sounds/Magic II/Water and Ice/Frost Wall 001.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Water and Ice/Frost Wall 002.ogg`,
					'05': `${p}/ovani-sounds/Magic II/Water and Ice/Frost Wall 003.ogg`,
				},
				'03': {
					'06': `${p}/ovani-sounds/Magic/Ice/Crystal Column.ogg`,
				},
			},
			seal: `${p}/ovani-sounds/Magic II/Water and Ice/Seal Of The Ocean Loop.ogg`,
			iceberg: {
				'01': `${p}/ovani-sounds/Magic II/Water and Ice/Summon Iceberg 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Water and Ice/Summon Iceberg 002.ogg`,
			},
			dispel: {
				magic: {
					'01': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Dispel 003.ogg`,
				},
				iceberg: `${p}/ovani-sounds/Magic II/Water and Ice/Dispel Iceberg.ogg`,
			},
			shield: {
				'01': `${p}/ovani-sounds/Magic/Ice/Glacial Shield.ogg`,
			},
			freeze: {
				'01': `${p}/ovani-sounds/Magic/Ice/Icy Veins.ogg`,

				'02': `${p}/ovani-sounds/Magic/Ice/Frozen Echo.ogg`,
			},
			buff: {
				'01': {
					water_walk: `${p}/ovani-sounds/Magic/Ice/Water Walking.ogg`,
				},
				'02': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Buff_05.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Cold Charm 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Cold Charm 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Cold Charm 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Cold Charm 004.ogg`,
				},
			},
			loop: {
				'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Ice_Cast_Loop_01.ogg`,
				'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Ice_Cast_Loop_02.ogg`,
			},
			cast: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Water and Ice/Ice Strike Cast 003.ogg`,
				},
				'02': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Ice/Ice_Spell_10.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Magic/Ice/Arctic Gale.ogg`,
					'02': `${p}/ovani-sounds/Magic/Ice/Frost Nova.ogg`,
				},
			},
		},
		holy: {
			smite: {
				'01': `${p}/ovani-sounds/Magic II/Light/Smite 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Light/Smite 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Light/Smite 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Light/Smite 004.ogg`,
			},
			flyby: `${p}/soundflakes/diablo-wrath-miscellaneous/angels-flying.ogg`,
			protection: {
				'01': `${p}/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-01.ogg`,
				'02': `${p}/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-02.ogg`,
				'03': `${p}/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-03.ogg`,
				'04': `${p}/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-04.ogg`,
				'05': `${p}/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-05.ogg`,
			},
			ward: {
				'01': `${p}/ovani-sounds/Magic/Light/Holy Ward.ogg`,
			},
			seal: {
				'01': `${p}/ovani-sounds/Magic II/Light/Holy Seal Loop 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Light/Holy Seal Loop 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Light/Holy Seal Loop 003.ogg`,
			},
			bliss: {
				'01': `${p}/ovani-sounds/Magic II/Light/Eternal Bliss 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Light/Eternal Bliss 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Light/Eternal Bliss 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Light/Eternal Bliss 004.ogg`,
			},
			restoration: {
				'01': `${p}/ovani-sounds/Magic II/Light/Divine Restoration 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Light/Divine Restoration 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Light/Divine Restoration 003.ogg`,
			},
			light: {
				'01': `${p}/ovani-sounds/Magic/Light/Illuminate.ogg`,
				'02': `${p}/ovani-sounds/Magic/Light/Holy Light.ogg`,
			},
			attack: {
				shock: {
					'01': `${p}/ovani-sounds/Magic/Light/Holy Shock.ogg`,
				},
				hammer: {
					'01': `${p}/ovani-sounds/Magic/Light/Consecrate.ogg`,
				},
				fire: {
					'01': `${p}/ovani-sounds/Magic/Light/Heavenly Flame.ogg`,
				},
				bell: {
					'01': `${p}/ovani-sounds/Magic/Light/Holy Nova.ogg`,
				},
				blast: {
					'01': `${p}/ovani-sounds/Magic/Light/Heavenly Wrath.ogg`,
				},
			},
			cure: {
				'01': `${p}/ovani-sounds/Magic II/Light/Cure 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Light/Cure 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Light/Cure 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Light/Cure 004.ogg`,
			},
			bless: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Light/Bless 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Light/Bless 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Light/Bless 003.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Bless 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Bless 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Bless 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Bless 004.ogg`,
				},
			},
			bolt: {
				cast: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Light/Light Bolt Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Light/Light Bolt Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Light/Light Bolt Cast C.ogg`,
					},
				},
				impact: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Light/Light Bolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Light/Light Bolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Light/Light Bolt Impact C.ogg`,
					},
				},
				loop: {
					trail: {
						'01': {
							'01': `${p}/ovani-sounds/Magic/Light/Light Bolt Trail Loop.ogg`,
						},
					},
				},
			},
		},
		healing: {
			'01': {
				'01': `${p}/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-1.ogg`,
				'02': `${p}/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-2.ogg`,
				'03': `${p}/EminYILDIRIM/magic/heal/eminyildirim_healing-spell-3.ogg`,
			},
			'02': {
				'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_01.ogg`,
				'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_02.ogg`,
				'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_03.ogg`,
				'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_04.ogg`,
				'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_05.ogg`,
				'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_06.ogg`,
				'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_07.ogg`,
				'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_08.ogg`,
				'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_09.ogg`,
				'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Heal_10.ogg`,
			},
			'03': {
				'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Heal 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Heal 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Heal 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Heal 004.ogg`,
			},
		},
		lightning: {
			cast: {
				'01': {
					'01': `${p}/LastDayDreaming/Magic/Lightning/EM_LIGHT_CAST_01_L.ogg`,
					'02': `${p}/LastDayDreaming/Magic/Lightning/EM_LIGHT_CAST_02_S.ogg`,
				},
				'02': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Spell_10.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Storm Cast 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Storm Cast 002.ogg`,
				},
			},
			hold: {
				'01': `${p}/LastDayDreaming/Magic/Lightning/EM_LIGHT_HOLD_5s.ogg`,
			},
			impact: {
				thunder: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Thunder Strike 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Thunder Strike 002.ogg`,
						'03': `${p}/ovani-sounds/Magic II/Air and Thunder/Thunder Strike 003.ogg`,
						'04': `${p}/ovani-sounds/Magic II/Air and Thunder/Thunder Strike 004.ogg`,
					},
				},
				storm: {
					'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 004.ogg`,
					'05': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 005.ogg`,
					'06': `${p}/ovani-sounds/Magic II/Air and Thunder/Electro Strike 006.ogg`,
				},
				burst: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact C.ogg`,
					},
					'02': {
						'01': `${p}/LastDayDreaming/Magic/Lightning/EM_LIGHT_IMPACT_01.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Electroheart 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Electroheart 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Electroheart 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Electroheart 004.ogg`,
					},
				},
			},
			buff: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Lightning/Lightning_Buff_05.ogg`,
				},
			},
			launch: {
				'01': `${p}/LastDayDreaming/Magic/Lightning/EM_LIGHT_LAUNCH_01.ogg`,
			},
			bolt: {
				cast: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Cast C.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Strike Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Strike Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Strike Cast C.ogg`,
					},
				},
				impact: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Impact C.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Shock/Thunderbolt Impact C.ogg`,
					},
				},
				trail: {
					loop: {
						'01': { '01': `${p}/ovani-sounds/Magic/Shock/Lightning Bolt Trail Loop.ogg` },
					},
				},
			},
			whip: {
				'01': {
					'01': `${p}/ovani-sounds/Magic/Shock/Lightning Whip A.ogg`,
					'02': `${p}/ovani-sounds/Magic/Shock/Lightning Whip B.ogg`,
					'03': `${p}/ovani-sounds/Magic/Shock/Lightning Whip C.ogg`,
				},
			},
			boom: {
				'01': `${p}/ovani-sounds/Magic/Shock/Thunderous Boom.ogg`,
			},
			loop: {
				electric_field: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Electric Field Loop 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Electric Field Loop 002.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Arc Field Loop 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Arc Field Loop 002.ogg`,
					},
				},
				storm: {
					'01': {
						'01': `${p}/ovani-sounds/Magic II/Air and Thunder/Storm Loop 001.ogg`,
						'02': `${p}/ovani-sounds/Magic II/Air and Thunder/Storm Loop 002.ogg`,
					},
				},
				lightning: {
					cast: {
						'01': {
							'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Lightning_Cast_Loop_01.ogg`,
							'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Lightning_Cast_Loop_02.ogg`,
						},
					},
				},
			},
			sparking: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Tool/Long Solder Craft.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Tool/Quick Weld.ogg`,
				},
			},
		},
		water: {
			charm: {
				single: {
					'01': `${p}/ovani-sounds/Magic II/Water and Ice/Mermaid Charm 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Water and Ice/Mermaid Charm 002.ogg`,
				},
				loop: `${p}/ovani-sounds/Magic II/Water and Ice/Mermaid Charm Loop.ogg`,
			},
			cast: {
				'01': {
					'01': `${p}/LastDayDreaming/Magic/Water/EM_WATER_CAST_01.ogg`,
					'02': `${p}/LastDayDreaming/Magic/Water/EM_WATER_CAST_02.ogg`,
				},
				'02': {
					'03': `${p}/ovani-sounds/Magic/Water/Tidal Surge.ogg`,
				},
				'03': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Spell_10.ogg`,
				},
				'04': {
					'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Poison 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Poison 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Poison 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Poison 004.ogg`,
				},
			},
			hold: {
				'01': `${p}/LastDayDreaming/Magic/Water/EM_WATER_HOLD_4s.ogg`,
			},
			impact: {
				splash: {
					'01': {
						'01': `${p}/LastDayDreaming/Magic/Water/EM_WATER_IMPACT_01.ogg`,
					},
				},
				bubble: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Bubble 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Bubble 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Bubble 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Bubble 004.ogg`,
					},
				},
			},
			launch: {
				'01': `${p}/LastDayDreaming/Magic/Water/EM_WATER_LAUNCH_01.ogg`,
			},
			spray: {
				'01': `${p}/tom-music/magic/water/Waterspray 1.ogg`,
				'02': `${p}/tom-music/magic/water/Waterspray 2.ogg`,
			},
			bless: {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Water and Ice/River Blessing.ogg`,
				},
				'02': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Water/Water_Buff_05.ogg`,
				},
			},
			call: `${p}/ovani-sounds/Magic II/Water and Ice/Call Of The Deep.ogg`,
			wave: {
				'01': {
					'01': `${p}/tom-music/magic/water/Wave Attack 1.ogg`,
					'02': `${p}/tom-music/magic/water/Wave Attack 2.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Big A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Big B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Big C.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Small A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Small B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Environment/Waves Hit Hull Small C.ogg`,
				},
			},
			heal: {
				'01': {
					'01': `${p}/ovani-sounds/Magic/Water/Aqua Heal.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Magic/Water/Purify.ogg`,
				},
			},
			bolt: {
				cast: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Cast C.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Jet Cast A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Water/Aqua Jet Cast B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Water/Aqua Jet Cast C.ogg`,
					},
				},
				impact: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Impact C.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Jet Impact A.ogg`,
						'02': `${p}/ovani-sounds/Magic/Water/Aqua Jet Impact B.ogg`,
						'03': `${p}/ovani-sounds/Magic/Water/Aqua Jet Impact C.ogg`,
					},
				},
				loop: {
					'01': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Bolt Trail Loop.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Magic/Water/Aqua Jet Trail Loop.ogg`,
					},
				},
			},
			loop: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Water_Cast_Loop_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/Water_Cast_Loop_02.ogg`,
				},
			},
			bubble: {
				prison: {
					'01': `${p}/ovani-sounds/Magic/Water/Bubble Prison.ogg`,
				},
			},
			tides: `${p}/ovani-sounds/Magic II/Water and Ice/Enchantment Of Tides Loop.ogg`,
			ward: `${p}/ovani-sounds/Magic II/Water and Ice/Wave Ward.ogg`,
			summon: {
				'01': `${p}/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Water and Ice/Summon Water Elemental 003.ogg`,
			},
			rain: {
				wave: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Rain 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Rain 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Rain 003.ogg`,
					},
				},
			},
		},
		movement: {
			blink: {
				'01': `${p}/soundflakes/diablo-wrath-miscellaneous/etherael-blink-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-miscellaneous/etherael-blink-02.ogg`,
			},
			strafe: {
				'01': `${p}/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-02.ogg`,
				'03': `${p}/soundflakes/diablo-wrath-miscellaneous/etherael-strafe-03.ogg`,
			},
			fly: {
				'01': `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-wings-swing-01.ogg`,
				'02': `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-wings-swing-02.ogg`,
			},
		},
		counterspell: {
			'01': {
				'01': `${p}/soundflakes/diablo-wrath-weapon/tyrael-spellbreaking.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fatality 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fatality 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fatality 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Fatality 004.ogg`,
			},
		},
		dispel: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dispel 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dispel 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dispel 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Dispel 004.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Disruption A.ogg`,
				'02': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Disruption B.ogg`,
				'03': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Disruption C.ogg`,
				'04': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Disruption D.ogg`,
			},
		},
		fail: {
			'01': `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-land-on-giant.ogg`,
		},
		weapons: {
			summon: `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-spears-in-the-air.ogg`,
			launch: `${p}/soundflakes/diablo-wrath-miscellaneous/imperius-spears-launch.ogg`,
		},
		arcane: {
			cast: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Cast_07.ogg`,
				},
				'02': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Spell_10.ogg`,
				},
				'03': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_05.ogg`,
					'06': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_06.ogg`,
					'07': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_07.ogg`,
					'08': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_08.ogg`,
					'09': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_09.ogg`,
					'10': `${p}/gamedev-market/Magic_Spells_Sound_Pack/General Magic/Negative_Aura_10.ogg`,
				},
				'04': {
					'01': `${p}/ovani-sounds/Player Status SFX/General/Abstract Change 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/General/Abstract Change 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/General/Abstract Change 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/General/Abstract Change 004.ogg`,
				},
				'05': {
					'01': `${p}/ovani-sounds/Player Status SFX/General/Abstract Reward 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/General/Abstract Reward 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/General/Abstract Reward 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/General/Abstract Reward 004.ogg`,
				},
			},
			buff: {
				'01': {
					'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Buff_01.ogg`,
					'02': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Buff_02.ogg`,
					'03': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Buff_03.ogg`,
					'04': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Buff_04.ogg`,
					'05': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Elemental Types/Arcane/Arcane_Buff_05.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Elven Charm 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Elven Charm 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Elven Charm 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Elven Charm 004.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Area Discovered A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Area Discovered B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Area Discovered C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Area Discovered D.ogg`,
					'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Area Discovered E.ogg`,
				},
				'04': {
					'01': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Boost 001.ogg`,
					'02': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Boost 002.ogg`,
					'03': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Boost 003.ogg`,
					'04': `${p}/ovani-sounds/Decks and Cards SFX/FX/FX Boost 004.ogg`,
				},
			},
			revealing_light: {
				'01': {
					'01': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Fairy Dust 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Fairy Dust 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Fairy Dust 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Fantasy/Fantasy Fairy Dust 004.ogg`,
				},
			},
			light: {
				'01': {
					'01': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Light 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Light 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Light 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Musical/Musical Light 004.ogg`,
				},
			},
			loop: {
				'01': `${p}/gamedev-market/Magic_Spells_Sound_Pack/Cast Loops/General_Cast_Loop_01.ogg`,
			},
			impact: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Anvil 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Anvil 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Anvil 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Anvil 004.ogg`,
				},
			},
			fail: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Fail A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Fail B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Fail C.ogg`,
				},
			},
			channel: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Event A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Event B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Event C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Event D.ogg`,
					'05': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Event E.ogg`,
				},
			},
			slash: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Whoosh A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Whoosh B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Whoosh C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/QTE/QTE Whoosh D.ogg`,
				},
			},
		},
		buff: {
			generic: {
				'01': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Item Use B.ogg`,
				'02': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Item Use A.ogg`,
				'03': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm C.ogg`,
				'04': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm B.ogg`,
				'05': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Charm A.ogg`,
				'06': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet D.ogg`,
				'07': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet C.ogg`,
				'08': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet B.ogg`,
				'09': `${p}/ovani-sounds/Medieval Fantasy SFX 2/Items & Misc/Equip Amulet A.ogg`,
			},
		},
		nature: {
			'whip': {
				vine: {
					'01': `${p}/ovani-sounds/Magic/Nature/Whip Vine A.ogg`,
					'02': `${p}/ovani-sounds/Magic/Nature/Whip Vine B.ogg`,
					'03': `${p}/ovani-sounds/Magic/Nature/Whip Vine C.ogg`,
					'04': `${p}/ovani-sounds/Magic/Nature/Whip Vine D.ogg`,
				},
			},
			'summon': {
				rain: {
					cast: {
						'01': `${p}/ovani-sounds/Magic/Nature/Summon Rain Cast.ogg`,
					},
					start: {
						'01': `${p}/ovani-sounds/Magic/Nature/Summon Rain Start.ogg`,
					},
					end: {
						'01': `${p}/ovani-sounds/Magic/Nature/Summon Rain End.ogg`,
					},
					loop: {
						'01': `${p}/ovani-sounds/Magic/Nature/Summon Rain Loop.ogg`,
					},
				},
				sapling: {
					'01': `${p}/ovani-sounds/Magic/Nature/Summon Sapling.ogg`,
				},
				bramble_trap: {
					'01': `${p}/ovani-sounds/Magic/Nature/Summon Bramble Trap.ogg`,
				},
			},
			'shield': {
				thorn: {
					'01': `${p}/ovani-sounds/Magic/Nature/Thorn Shield.ogg`,
				},
			},
			'burst': {
				bulb: {
					'01': {
						plant: `${p}/ovani-sounds/Magic/Nature/Bulb Burst Plant.ogg`,
						burst: `${p}/ovani-sounds/Magic/Nature/Bulb Burst.ogg`,
					},
				},
				bramble: {
					'01': `${p}/ovani-sounds/Magic/Nature/Bramble Burst.ogg`,
				},
			},
			'healing': {
				'01': {
					'01': `${p}/ovani-sounds/Magic/Nature/Natural Healing.ogg`,
				},
			},
			'moon': {
				beam: {
					'01': `${p}/ovani-sounds/Magic/Nature/Moon Beam.ogg`,
				},
			},
			'sun': {
				beam: {
					'01': `${p}/ovani-sounds/Magic/Nature/Sun Beam.ogg`,
				},
			},
			'growth': {
				'01': `${p}/ovani-sounds/Magic/Nature/Verdant Growth.ogg`,
			},
			'bond': {
				animorphic: `${p}/ovani-sounds/Magic/Nature/Animorphic Bond.ogg`,
			},
			'animate-tree': {
				'01': `${p}/ovani-sounds/Magic II/Nature/Animate Tree 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Nature/Animate Tree 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Nature/Animate Tree 003.ogg`,
				'04': `${p}/ovani-sounds/Magic II/Nature/Animate Tree 004.ogg`,
			},
			'roots': {
				'01': {
					'01': `${p}/ovani-sounds/Magic II/Nature/Deep Roots 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Nature/Deep Roots 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Nature/Deep Roots 003.ogg`,
					'04': `${p}/ovani-sounds/Magic II/Nature/Deep Roots 004.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Magic/Nature/Root Snare.ogg`,
				},
			},
			'charm': {
				single: {
					'01': `${p}/ovani-sounds/Magic II/Nature/Dryad Charm Loop 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Nature/Dryad Charm Loop 002.ogg`,
					'03': `${p}/ovani-sounds/Magic II/Nature/Dryad Charm Loop 003.ogg`,
				},
				loop: `${p}/ovani-sounds/Magic II/Nature/Dryad Charm Loop.ogg`,
			},
			'buff': {
				'bear-rage': `${p}/ovani-sounds/Magic II/Nature/Bear Rage.ogg`,
				'bird-flight': `${p}/ovani-sounds/Magic II/Nature/Bird Flight.ogg`,
				'horse-speed': `${p}/ovani-sounds/Magic II/Nature/Horse Speed.ogg`,
				'lion-courage': `${p}/ovani-sounds/Magic II/Nature/Lion Courage.ogg`,
				'owl-wisdom': `${p}/ovani-sounds/Magic II/Nature/Owl Wisdom.ogg`,
				'barkskin': {
					'01': `${p}/ovani-sounds/Magic/Nature/Barkskin.ogg`,
				},
			},
			'poison-swarm': {
				'01': `${p}/ovani-sounds/Magic II/Nature/Poisonous Swarm 001.ogg`,
				'02': `${p}/ovani-sounds/Magic II/Nature/Poisonous Swarm 002.ogg`,
				'03': `${p}/ovani-sounds/Magic II/Nature/Poisonous Swarm 003.ogg`,
			},
			'seal': {
				loop: {
					'01': `${p}/ovani-sounds/Magic II/Nature/Seal Of The Beasts Loop 001.ogg`,
					'02': `${p}/ovani-sounds/Magic II/Nature/Seal Of The Beasts Loop 002.ogg`,
				},
			},
			'sanctuary': {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Sanctuary 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Sanctuary 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Sanctuary 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Sanctuary 004.ogg`,
					'05': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Sanctuary 005.ogg`,
				},
			},
			'roar': {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Roar 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Roar 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Roar 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Roar 004.ogg`,
				},
			},
			'spirit': {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Topter 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Topter 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Topter 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Topter 004.ogg`,
				},
			},
			'spiders': {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Text Sprawl B.ogg`,
				},
			},
		},
		music: {
			harp: {
				rise: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Magic Harp 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Magic Harp 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Magic Harp 003.ogg`,
						'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Magic Harp 004.ogg`,
					},
				},
			},
			choir: {
				rise: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Choir 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Choir 002.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Choir Tail 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Choir Tail 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Choir Tail 003.ogg`,
					},
				},
			},
			drums: {
				rise: {
					'01': {
						'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Anvil Drums 001.ogg`,
						'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Anvil Drums 002.ogg`,
						'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Anvil Drums 003.ogg`,
					},
				},
			},
			bell: {
				ring: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Anvil Select.ogg`,
					},
				},
			},
		},
		misc: {
			gold: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Gold A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Gold B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Gold C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Gold D.ogg`,
					'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Gold E.ogg`,
				},
			},
			magical_girl: {
				impact: {
					'01': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Crit A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Crit B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Crit C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Crit D.ogg`,
						'05': `${p}/ovani-sounds/Combos Crits and Fails/Gun/Gun Crit E.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Ultimate A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Ultimate B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Ultimate C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Ultimate D.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Combo A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Combo B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Combo C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Combo D.ogg`,
						'05': `${p}/ovani-sounds/Combos Crits and Fails/Magic/Magic Combo E.ogg`,
					},
					'04': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Misc Template/Success Level A.ogg`,
					},
				},
				smite: {
					'01': {
						'01': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ultimate A.ogg`,
						'02': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ultimate B.ogg`,
						'03': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ultimate C.ogg`,
						'04': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ultimate D.ogg`,
					},
				},
			},
			ricochet: {
				'01': {
					'01': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Compression A.ogg`,
					'02': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Compression B.ogg`,
					'03': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Compression C.ogg`,
					'04': `${p}/ovani-sounds/Combos Crits and Fails/Abilities/Ability Compression D.ogg`,
				},
			},
		},
	},
	movement: {
		landing: {
			'01': `${p}/soundflakes/diablo-wrath-miscellaneous/tyrael-landing_footsteps.ogg`,
		},
		dash: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/General/Abstract Dash 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/General/Abstract Dash 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/General/Abstract Dash 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/General/Abstract Dash 004.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Player Status SFX/General/Abstract Move 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/General/Abstract Move 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/General/Abstract Move 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/General/Abstract Move 004.ogg`,
			},
		},
		jump: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Reactive Jump 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Reactive Jump 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Reactive Jump 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Reactive Jump 004.ogg`,
			},
		},
	},
	buff: {
		weapon: {
			generic: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Weapon Power Up.ogg`,
			},
			fire: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Weapon Power Up Fire.ogg`,
			},
			ice: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Weapon Power Up Ice.ogg`,
			},
			lightning: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Weapon Power Up Lightning.ogg`,
			},
			poison: {
				'01': `${p}/gamedev-market/Medieval Fantasy 2 SFX Pack/Weapons/Weapon Power Up Poison.ogg`,
			},
		},
		regen: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Regen 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Regen 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Regen 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Regen 004.ogg`,
			},
		},
	},
	debuffs: {
		hunger: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailment Hunger 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailment Hunger 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailment Hunger 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailment Hunger 004.ogg`,
			},
		},
		bleed: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Bleed 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Bleed 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Bleed 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Bleed 004.ogg`,
			},
		},
		confused: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Confuse 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Confuse 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Confuse 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Confuse 004.ogg`,
			},
		},
		freeze: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Freeze 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Freeze 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Freeze 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Freeze 004.ogg`,
			},
		},
		grease: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Grease 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Grease 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Grease 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Grease 004.ogg`,
				'05': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Grease 005.ogg`,
			},
		},
		restrained: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hold 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hold 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hold 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hold 004.ogg`,
			},
		},
		hypnotize: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hypnotize 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hypnotize 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hypnotize 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Hypnotize 004.ogg`,
			},
		},
		slow: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Slow 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Slow 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Slow 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Slow 004.ogg`,
			},
		},
		stun: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Stun 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Stun 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Stun 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Ailments/Ailments Stun 004.ogg`,
			},
		},
	},
	dodge: {
		'01': `${p}/soundflakes/diablo-wrath-miscellaneous/auriel-avoiding.ogg`,
	},
	crafting: {
		hammer: {
			clumsy: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Hammer/Clumsy Hammer A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Hammer/Clumsy Hammer B.ogg`,
				},
			},
			dull: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Hammer/Dull Hammer A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Hammer/Dull Hammer B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Hammer/Dull Hammer C.ogg`,
				},
			},
			craft: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer C.ogg`,
				},
				'02': {
					alert: `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer Alert.ogg`,
					deny: `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer Deny.ogg`,
					heavy: `${p}/ovani-sounds/Crafting SFX/Hammer/Heavy Hammer Craft.ogg`,
					light: `${p}/ovani-sounds/Crafting SFX/Hammer/Light Hammer.ogg`,
					multiple: `${p}/ovani-sounds/Crafting SFX/Hammer/Hammer Craft Longer.ogg`,
				},
			},
			wood: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Hammer Wood A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Hammer Wood B.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Tap.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Light Hammer Wood Craft.ogg`,
				},
			},
		},
		anvil: {
			'01': {
				'01': `${p}/ovani-sounds/Crafting SFX/Tool/Anvil Deny.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Crafting SFX/Tool/Cheesy Anvil A.ogg`,
				'02': `${p}/ovani-sounds/Crafting SFX/Tool/Cheesy Anvil B.ogg`,
			},
		},
		loops: {
			assemble: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Assemble Loop A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Loops/Assemble Loop C.ogg`,
				},
			},
			chain: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Chain Craft Loop.ogg`,
				},
			},
			cranking: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Cranking Craft Loop.ogg`,
				},
			},
			disassemble: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Disassemble Loop.ogg`,
				},
			},
			heavy_workshop: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Heavy Crafting Workshop Loop.ogg`,
				},
			},
			stone: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Stone Craft Loop.ogg`,
				},
			},
			wood: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Loops/Play Crafting Loop.ogg`,
				},
			},
			fire: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Fire Craft Ambience.ogg`,
				},
			},
		},
		machinery: {
			air_press: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Air Press Machine.ogg`,
				},
			},
			release: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Craft Machine Release.ogg`,
				},
			},
			saw: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Machine Cutter.ogg`,
				},
			},
			press: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Machine Press A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Machinery/Machine Press B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Machinery/Machine Press C.ogg`,
				},
			},
			latch: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Workbench Latch.ogg`,
				},
			},
			drill: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Drill Crafting.ogg`,
				},
			},
			plastic: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Machinery/Plastic Machine.ogg`,
				},
			},
			screwdriver: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Tool/Electric Screwdriver.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Tool/Electric Tool Spin.ogg`,
				},
			},
		},
		magic: {
			nature: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Magic/Nature Craft.ogg`,
				},
			},
			enchantment: {
				craft: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Magic/Enchantment A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/Magic/Enchantment B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/Magic/Enchantment C.ogg`,
						'04': `${p}/ovani-sounds/Crafting SFX/Magic/Enchantment D.ogg`,
					},
				},
				create: {
					'01': {
						basic: `${p}/ovani-sounds/Crafting SFX/Magic/Create Enchantment.ogg`,
						quick: `${p}/ovani-sounds/Crafting SFX/Magic/Create Enchantment Quick.ogg`,
					},
				},
			},
		},
		potions: {
			craft: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Magic/Potion Craft A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Magic/Potion Craft B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Magic/Potion Craft C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Magic/Potion Craft D.ogg`,
				},
			},
			sort: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Magic/Potion Sorting.ogg`,
				},
			},
		},
		materials: {
			paper: {
				cardboard: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Cardboard One-Shot A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/Material/Cardboard One-Shot B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/Material/Cardboard One-Shot C.ogg`,
					},
					'02': {
						fold: `${p}/ovani-sounds/Crafting SFX/Material/Board Folding.ogg`,
					},
				},
				packaging: {
					cut: {
						'01': {
							'01': `${p}/ovani-sounds/Crafting SFX/Material/Packaging Cut A.ogg`,
							'02': `${p}/ovani-sounds/Crafting SFX/Material/Packaging Cut B.ogg`,
							'03': `${p}/ovani-sounds/Crafting SFX/Material/Packaging Cut C.ogg`,
						},
					},
					craft: {
						'01': {
							'01': `${p}/ovani-sounds/Crafting SFX/Material/Package Crafting.ogg`,
						},
						'02': {
							'01': `${p}/ovani-sounds/Crafting SFX/Material/Packaging.ogg`,
						},
					},
					tape: {
						'01': {
							'01': `${p}/ovani-sounds/Crafting SFX/Material/Tape Crack.ogg`,
						},
					},
				},
				origami: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Plastic Origami A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/Material/Plastic Origami B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/Material/Plastic Origami C.ogg`,
						'04': `${p}/ovani-sounds/Crafting SFX/Material/Plastic Origami D.ogg`,
					},
				},
				sheets: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Paper Slide and Fold A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/Material/Paper Slide and Fold B.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Sheet Slide and Fold A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/Material/Sheet Slide and Fold B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/Material/Sheet Slide and Fold C.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Sheet Craft.ogg`,
					},
				},
			},
			fabric: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Material/Fabric One-Shot A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Material/Fabric One-Shot B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Material/Fabric One-Shot C.ogg`,
				},
			},
			marker: {
				'01': {
					scribble: `${p}/ovani-sounds/Crafting SFX/Material/Felt Marker Scribble.ogg`,
					squeek: `${p}/ovani-sounds/Crafting SFX/Material/Felt Marker Squeek.ogg`,
				},
			},
			leather: {
				craft: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Leather Craft.ogg`,
					},
				},
				strip: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Leather Strip.ogg`,
					},
				},
				tan: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Leather Tan.ogg`,
					},
				},
				treat: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Leather Treat.ogg`,
					},
				},
				whip: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Material/Leather Whip.ogg`,
					},
				},
			},
			weaving: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Material/Weaving.ogg`,
				},
			},
		},
		metal: {
			bang: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Loud Metal Bang.ogg`,
				},
			},
			craft: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Craft A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Craft B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Craft C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Craft D.ogg`,
				},
			},
			grind: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Grind A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Grind B.ogg`,
				},
			},
			alert: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Alert A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Alert B.ogg`,
				},
			},
			deny: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Deny.ogg`,
				},
			},
			drop: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Metal Drop.ogg`,
				},
			},
			sharp: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Sharp Craft.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Tool/Scraping Tool.ogg`,
				},
			},
		},
		stone: {
			chisel: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Chisel A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Metal/Chisel B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Metal/Chisel C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Metal/Chisel D.ogg`,
				},
			},
			etching: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Etching.ogg`,
				},
			},
			craft: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Craft A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Craft B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Craft C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Craft D.ogg`,
					'05': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Craft E.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Crafting.ogg`,
				},
			},
			repair: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Metal/Stone Repair.ogg`,
				},
			},
		},
		wood: {
			clumsy: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Clumsy Wood A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Clumsy Wood B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Wood/Clumsy Wood C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Wood/Clumsy Wood D.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Plank A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Plank B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Wood/Plank C.ogg`,
				},
				'03': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Plank Drop A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Plank Drop B.ogg`,
				},
			},
			saw: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Saw A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Saw B.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Saw One-Shot.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Saw B.ogg`,
				},
			},
			shave: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Wood/Lathe.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Wood/Wood Shave.ogg`,
				},
			},
			repair: {
				'01': {
					'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair A.ogg`,
					'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair B.ogg`,
					'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair C.ogg`,
					'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair D.ogg`,
					'05': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair E.ogg`,
					'06': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Repair F.ogg`,
				},
			},
		},
		misc: {
			item: {
				small: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Small Item Craft.ogg`,
					},
				},
				medium: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Medium Item Craft.ogg`,
					},
				},
				large: {

					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Large Item Craft.ogg`,
					},
				},
			},
			miscraft: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Miscraft A.ogg`,
					'02': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Miscraft B.ogg`,
					'03': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Miscraft C.ogg`,
					'04': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Miscraft D.ogg`,
				},
			},
			ui: {
				alert: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Alert Craft.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Ambiguous Craft Alert.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Notification A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/UI/Craft Notification B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/UI/Craft Notification C.ogg`,
					},
					'04': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Sparking Alert.ogg`,
					},
				},
				confirm: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Crafting Confirm.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Crafting Wind Down.ogg`,
					},
				},
				cooldown: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Crafting Cooldown.ogg`,
					},
				},
				countdown: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Crafting Countdown.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Crafting Fade Out Timer.ogg`,
					},
				},
				deny: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Denied A.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Bad Craft.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Error.ogg`,
					},
					'04': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Mistake.ogg`,
					},
				},
				success: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Good Craft A.ogg`,
						'02': `${p}/ovani-sounds/Crafting SFX/UI/Good Craft B.ogg`,
						'03': `${p}/ovani-sounds/Crafting SFX/UI/Good Craft C.ogg`,
						'04': `${p}/ovani-sounds/Crafting SFX/UI/Good Craft D.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Success.ogg`,
					},
					'03': {
						'01': `${p}/ovani-sounds/Crafting SFX/UI/Sanding Success.ogg`,
					},
				},
				upgrade: {
					'03': {
						'01': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Upgrade A.ogg`,
						'02': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Upgrade B.ogg`,
						'03': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Upgrade C.ogg`,
						'04': `${p}/ovani-sounds/Seafaring SFX/Non Loops/Notifications/Ship Upgrade D.ogg`,
					},
				},
				text: {
					'01': {
						'01': `${p}/ovani-sounds/Crafting SFX/Misc Craft/Crafting Text.ogg`,
					},
				},
			},
			generic: {
				'01': {
					fabric: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Fabric Crafting.ogg`,
					felt: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Felt Crafting.ogg`,
					flame: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Flame Craft.ogg`,
					material: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Material Crafting.ogg`,
					mix: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Mix Crafting.ogg`,
					plastic: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Plastic Crafting.ogg`,
					rattle: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Rattle Craft.ogg`,
					scratchy: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Scratchy Craft.ogg`,
					sharp: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Felt Crafting.ogg`,
					sheet: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Sheet Crafting.ogg`,
					stick: `${p}/ovani-sounds/Crafting SFX/Wood/Stick Craft.ogg`,
					whittle: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Whittle Snap Craft.ogg`,
					quick_assemble: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Quick Assemble.ogg`,
					long: `${p}/ovani-sounds/Crafting SFX/Misc Craft/Long Craft.ogg`,
				},
			},
		},
	},
	cooking: {
		loop: {
			'01': {
				'01': `${p}/ovani-sounds/Cooking SFX/Loops/Sizzle Loop.ogg`,
			},
		},
		glass: {
			break: {
				'01': {
					'01': `${p}/ovani-sounds/Cooking SFX/Glass/Glass Break A.ogg`,
					'02': `${p}/ovani-sounds/Cooking SFX/Glass/Glass Break B.ogg`,
					'03': `${p}/ovani-sounds/Cooking SFX/Glass/Glass Break C.ogg`,
				},
			},
			clink: {
				'01': {
					'01': `${p}/ovani-sounds/Cooking SFX/Glass/Glass Clunk.ogg`,
				},
				'02': {
					'01': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Thin Glass Clink.ogg`,
				},
			},
			ui: {
				mistake: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Misc/Big Kitchen Mistake.ogg`,
					},
				},
			},
			pot: {
				general: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Pot A.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Pot B.ogg`,
						'03': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Pot C.ogg`,
					},
				},
				close: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Close Pot.ogg`,
					},
				},
				pick_up: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Pots and Pans/Pick Up Pot.ogg`,
					},
				},
			},
			prep: {
				board: {
					scrape: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Board Scrape A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Board Scrape B.ogg`,
							'03': `${p}/ovani-sounds/Cooking SFX/Prep/Board Scrape C.ogg`,
						},
						'02': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Scrape Off.ogg`,
						},
					},
				},
				boil_water: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Boil Water.ogg`,
					},
				},
				crunch: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Crunch A.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Prep/Crunch B.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Crunching A.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Prep/Crunching B.ogg`,
					},
				},
				cut: {
					chop: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Finished Chopping.ogg`,
						},
						'02': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Simple Chop A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Simple Chop B.ogg`,
							'03': `${p}/ovani-sounds/Cooking SFX/Prep/Simple Chop C.ogg`,
						},
					},
					dice: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Dicing A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Dicing B.ogg`,
						},
					},
					slice: {
						fruit: {
							'01': {
								'01': `${p}/ovani-sounds/Cooking SFX/Prep/Fruit Slice A.ogg`,
								'02': `${p}/ovani-sounds/Cooking SFX/Prep/Fruit Slice B.ogg`,
								'03': `${p}/ovani-sounds/Cooking SFX/Prep/Fruit Slice C.ogg`,
							},
						},
						sharp: {
							'01': {
								'01': `${p}/ovani-sounds/Cooking SFX/Prep/Sharp Slice A.ogg`,
								'02': `${p}/ovani-sounds/Cooking SFX/Prep/Sharp Slice B.ogg`,
							},
						},
						sloppy: {
							'01': {
								'01': `${p}/ovani-sounds/Cooking SFX/Prep/Sloppy Cut A.ogg`,
								'02': `${p}/ovani-sounds/Cooking SFX/Prep/Sloppy Cut B.ogg`,
								'03': `${p}/ovani-sounds/Cooking SFX/Prep/Sloppy Cut C.ogg`,
								'04': `${p}/ovani-sounds/Cooking SFX/Prep/Sloppy Cut D.ogg`,
							},
						},
						vegetable: {
							'01': {
								'01': `${p}/ovani-sounds/Cooking SFX/Prep/Veggie Cut A.ogg`,
								'02': `${p}/ovani-sounds/Cooking SFX/Prep/Veggie Cut B.ogg`,
								'03': `${p}/ovani-sounds/Cooking SFX/Prep/Veggie Cut C.ogg`,
							},
						},
					},
					grate: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Sharp Grate A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Sharp Grate B.ogg`,
							'03': `${p}/ovani-sounds/Cooking SFX/Prep/Sharp Grate C.ogg`,
						},
					},
				},
				drop: {
					vegetables: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Drop Veg.ogg`,
						},
					},
				},
				fry: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Intense Fry.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Prep/Oily Cook.ogg`,
					},
				},
				peel: {
					dry: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Dry Peel A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Dry Peel B.ogg`,
							'03': `${p}/ovani-sounds/Cooking SFX/Prep/Dry Peel C.ogg`,
						},
						'02': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Dry Peeling.ogg`,
						},
					},
					skin: {
						'01': {
							'01': `${p}/ovani-sounds/Cooking SFX/Prep/Tearing Skin A.ogg`,
							'02': `${p}/ovani-sounds/Cooking SFX/Prep/Tearing Skin B.ogg`,
						},
					},
				},
				prep: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Prep A.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Prep/Prep B.ogg`,
					},
					'02': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Prep Chaos A.ogg`,
						'02': `${p}/ovani-sounds/Cooking SFX/Prep/Prep Chaos B.ogg`,
					},
				},
				stir: {
					'01': {
						long: `${p}/ovani-sounds/Cooking SFX/Prep/Long Stir.ogg`,
						single: `${p}/ovani-sounds/Cooking SFX/Prep/Single Stir.ogg`,
					},
				},
				whisk: {
					'01': {
						long: `${p}/ovani-sounds/Cooking SFX/Prep/Long Whisk.ogg`,
						single: `${p}/ovani-sounds/Cooking SFX/Prep/Single Whisk.ogg`,
					},
				},
				tear: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Sachet Tear.ogg`,
					},
				},
				tenderize: {
					'01': {
						'01': `${p}/ovani-sounds/Cooking SFX/Prep/Tenderize.ogg`,
					},
				},
			},
		},
	},
	scifi: {
		device: {
			use: {
				'01': {
					'01': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Device Use 001.ogg`,
					'02': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Device Use 002.ogg`,
					'03': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Device Use 003.ogg`,
					'04': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Device Use 004.ogg`,
				},
			},
		},
		meter_refill: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Meters Refill 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Meters Refill 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Meters Refill 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Meters Refill 004.ogg`,
			},
		},
		overshield: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Overshield 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Overshield 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Overshield 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Overshield 004.ogg`,
			},
		},
		power_up: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Power Up-001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Power Up-002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Power Up-003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Power Up-004.ogg`,
			},
		},
		ready: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Ready To Fly 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Ready To Fly 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Ready To Fly 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/Sci-Fi/Sci-Fi Ready To Fly 004.ogg`,
			},
		},
		stimpack: {
			'01': {
				'01': `${p}/ovani-sounds/Player Status SFX/General/Stimpack 001.ogg`,
				'02': `${p}/ovani-sounds/Player Status SFX/General/Stimpack 002.ogg`,
				'03': `${p}/ovani-sounds/Player Status SFX/General/Stimpack 003.ogg`,
				'04': `${p}/ovani-sounds/Player Status SFX/General/Stimpack 004.ogg`,
			},
		},
		blast: {
			gravity: {
				'01': {
					'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Gravi Blast 001.ogg`,
					'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Gravi Blast 002.ogg`,
					'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Gravi Blast 003.ogg`,
					'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Impacts/Impact Gravi Blast Dry.ogg`,
				},
			},
		},
		teleport: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Jump Pad 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Jump Pad 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Jump Pad 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Riser/Riser Jump Pad 004.ogg`,
			},
		},
		whip: {
			'01': {
				'01': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Gravity Anchor 001.ogg`,
				'02': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Gravity Anchor 002.ogg`,
				'03': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Gravity Anchor 003.ogg`,
				'04': `${p}/ovani-sounds/Motion and Impacts SFX 2/Whoosh/Whoosh Gravity Anchor 004.ogg`,
			},
		},
		ufo: {
			ring: {
				'01': {
					'01': `${p}/ovani-sounds/Crafting SFX/UI/Craft Text Sprawl A.ogg`,
				},
			},
		},
		machine_gun: {
			'01': {
				'01': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine High A.ogg`,
				'02': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine High B.ogg`,
				'03': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine High C.ogg`,
			},
			'02': {
				'01': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine Low A.ogg`,
				'02': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine Low B.ogg`,
				'03': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Guns/Plane Gun Fire Machine Low C.ogg`,
			},
		},
		vehicle: {
			engine: {
				slow_down: {
					'01': {
						'01': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Manoeuvres/Afterburner Slowing A.ogg`,
						'02': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Manoeuvres/Afterburner Slowing B.ogg`,
						'03': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Manoeuvres/Afterburner Slowing C.ogg`,
					},
				},
				speed_up: {
					'01': {
						'01': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Manoeuvres/Afterburner Speed Up A.ogg`,
						'02': `${p}/ovani-sounds/Flying Vehicles SFX/Non Loops/Manoeuvres/Afterburner Speed Up B.ogg`,
					},
				},
			},
		},
	},
	// #endregion
} as const;
