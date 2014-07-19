This read me file is to help explain how the json files are set up and their lay out

feats layout:
  {
    "name": "",
    "prerequisites": 
      [],
    "benefits":
      [],
    "archtype":
      []
  },

	name: Self explaintory
	prerequisites (list of all required feats that has to be checked before this feat can be taken)
		false means this feat can be taken without any others
	benefits: what the feat gives you
		if its a base bonus, that skill, stats, or skill level is shown and incremented
		if its a combat ability that is given, then it is listed as a string that is added to a combat options string
		all others are misc
	archtype: the types of classes that would take this feat
		suggested that we make a file that is used by the AI to determine what feats should be used
		this file would define the archtypes more thoroughly, maybe even rating them."
archtypes:
	theif		:	focuses on taking items from others
	fighter		:	as fighter base class
	melee		:	focuses on using melee weaponary
	stealth		:	focuses on staying out of sight
	skill_monkey	:	focuses on buffing skills