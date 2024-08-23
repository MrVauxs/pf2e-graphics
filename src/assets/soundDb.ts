// Start from 01
const p = 'modules/pf2e-graphics/assets/library';
export const database = {
	movement: {
		landing: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/tyrael-landing_footsteps.ogg`,
		},
	},
	dodge: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/auriel-avoiding.ogg`,
	},
	attack: {
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
			'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/imperius-hit-the-giants-eye_flesh.ogg`,
			'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/malthael-weapon-hit.ogg`,
		},
	},
	sword: {
		melee: {
			'01': `${p}/sounds/soniss/SWSH_Sword Slash Impact V2 Assorted 18_DDUMAIS_NONE.ogg`,
			'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/sword-out-of-flesh.ogg`,
			'03': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-01.ogg`,
			'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-02.ogg`,
			'05': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-hit-flesh-03.ogg`,
			'06': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-01.ogg`,
			'07': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-03.ogg`,
			'08': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-04.ogg`,
			'09': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-swoosh-05.ogg`,
			'impale': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-impale-flesh-05.ogg`,
			'take-out': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-out-of-flesh-06.ogg`,
			'slice': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-slice-flesh-02.ogg`,
			'swing': {
				'01': `${p}/sounds/tom-music/sword/Sword Attack 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Attack 2.ogg`,
				'03': `${p}/sounds/tom-music/sword/Sword Attack 3.ogg`,
			},
			'hit': {
				solid: {
					'01': `${p}/sounds/tom-music/sword/Sword Blocked 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Blocked 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Blocked 3.ogg`,
				},
				flesh: {
					'01': `${p}/sounds/tom-music/sword/Sword Impact Hit 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Impact Hit 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Impact Hit 3.ogg`,
				},
				parry: {
					'01': `${p}/sounds/tom-music/sword/Sword Parry 1.ogg`,
					'02': `${p}/sounds/tom-music/sword/Sword Parry 2.ogg`,
					'03': `${p}/sounds/tom-music/sword/Sword Parry 3.ogg`,
				},
			},
			'sheath': {
				'01': `${p}/sounds/tom-music/sword/Sword Sheath 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Sheath 2.ogg`,
			},
			'unsheath': {
				'01': `${p}/sounds/tom-music/sword/Sword Unsheath 1.ogg`,
				'02': `${p}/sounds/tom-music/sword/Sword Unsheath 2.ogg`,
			},
		},
		throw: {
			'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/tyrael-sword-throw-swoosh-02.ogg`,
		},
	},
	magic: {
		fire: {
			cast: {
				'01': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_01.ogg`,
				'02': `${p}/sounds/LastDayDreaming/Magic/Fire/EM_FIRE_CAST_02.ogg`,
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
			effect: {
				buff: {
					'01': `${p}/sounds/tom-music/magic/fire/Firebuff 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/fire/Firebuff 2.ogg`,
				},
			},
			spray: {
				'01': `${p}/sounds/tom-music/magic/fire/Firespray 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/fire/Firespray 2.ogg`,
			},
		},
		earth: {
			ranged: {
				single: {
					'01': `${p}/sounds/tom-music/magic/earth/Rock Meteor Throw 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/earth/Rock Meteor Throw 2.ogg`,
				},
				barrage: {
					'01': `${p}/sounds/tom-music/magic/earth/Rock Meteor Swarm 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/earth/Rock Meteor Swarm 2.ogg`,
				},
			},
			wall: {
				'01': `${p}/sounds/tom-music/magic/earth/Rock Wall 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/earth/Rock Wall 2.ogg`,
			},
			close: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-01.ogg`,
				'02': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-02.ogg`,
				'03': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-door-shuted-03.ogg`,
			},
			explosion: {
				'01': `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/stone-with-chains-is-destroyed.ogg`,
			},
		},
		ice: {
			ranged: {
				barrage: {
					'01': `${p}/sounds/tom-music/magic/ice/Ice Barrage 1.ogg`,
					'02': `${p}/sounds/tom-music/magic/ice/Ice Barrage 2.ogg`,
				},
			},
			wall: {
				'01': `${p}/sounds/tom-music/magic/ice/Ice Wall 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/ice/Ice Wall 2.ogg`,
			},
		},
		holy: {
			flyby: `${p}/sounds/soundflakes/diablo-wrath-miscellaneous/angels-flying.ogg`,
			protection: {
				'01': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-01.ogg`,
				'02': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-02.ogg`,
				'03': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-03.ogg`,
				'04': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-04.ogg`,
				'05': `${p}/sounds/EminYILDIRIM/magic/holy/protection/eminyildirim_holy-protection-05.ogg`,
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
			wave: {
				'01': `${p}/sounds/tom-music/magic/water/Wave Attack 1.ogg`,
				'02': `${p}/sounds/tom-music/magic/water/Wave Attack 2.ogg`,
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
	},
	containers: {
		unlock: {
			'01': `${p}/sounds/tom-music/containers/Lock Unlock.ogg`,
		},
	},
	bow: {
		'01': `${p}/sounds/gamedev-market/BowWhistleShot1.ogg`,
		'02': `${p}/sounds/gamedev-market/BowWhistleShot2.ogg`,
		'03': `${p}/sounds/gamedev-market/BowWhistleShot3.ogg`,
		'04': `${p}/sounds/gamedev-market/BowWhistleShot4.ogg`,
		'05': `${p}/sounds/gamedev-market/BowWhistleShot5.ogg`,
		'06': `${p}/sounds/gamedev-market/BowWhistleShot6.ogg`,
		'07': `${p}/sounds/gamedev-market/BowWhistleShot7.ogg`,
		'attack': {
			'01': `${p}/sounds/tom-music/bow/Bow Attack 1.ogg`,
			'02': `${p}/sounds/tom-music/bow/Bow Attack 2.ogg`,
		},
		'hit': {
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
		'sheath': {
			'01': `${p}/sounds/tom-music/bow/Bow Put Away 1.ogg`,
		},
		'unsheath': {
			'01': `${p}/sounds/tom-music/bow/Bow Take Out 1.ogg`,
		},
	},
	crossbow: {
		'01': `${p}/sounds/gamedev-market/Crossbow Shot A.ogg`,
		'02': `${p}/sounds/gamedev-market/Crossbow Shot B.ogg`,
		'03': `${p}/sounds/gamedev-market/Crossbow Shot C.ogg`,
		'04': `${p}/sounds/gamedev-market/Crossbow Shot D.ogg`,
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
	critical: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-01.ogg`,
		'02': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-02.ogg`,
		'03': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-03.ogg`,
		'04': `${p}/sounds/soundflakes/diablo-wrath-weapon/etherael-attack-04.ogg`,
	},
	finisher: {
		'01': `${p}/sounds/soundflakes/diablo-wrath-weapon/imperius-last-hit.ogg`,
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
};
