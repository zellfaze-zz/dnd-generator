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

classes lay out
  {
    "Class": "",
    "base": ,
    "hitDice": "",
    "SkillPoints": "",
    "KeyStat": "",
    "SecStat": "",
    "ClassSkill": 
     [],
    "level1":
     [
       "BAB": "", "Fort": "", "Ref": "", "Will": ""
     ],
    "level2":
     [
       "BAB": "", "Fort": "", "Ref": "", "Will": ""
     ],
    "level3":
     [
       "BAB": "", "Fort": "", "Ref": "", "Will": ""
     ],
    (continue til end of class)
    "CasterType": "",
    "SLevel1":
     [],
    "SLevel2":
     [],
    "SLevel3":
     []
  }
	Class: self explainitory
	Base: is it a base class or prestige. if prestige is yes, then the requirements array will be needed
	hitdice: the hit dice for that class, d4, d6, d8, d10, or d12
	Skill points: the number of skill points per level (if its a new character, this will have to be multiplied by 4)
	KeyStat: the stat that is most important to the class
	SecStat: the second most important stat for the class
	level 1:
		this has 4 items in each array, BAB (base attack bonus) Fort (Fortitude), Ref (Reflex), Will (Will
		any extra ability is also added after this.  each level will have to be compaired to the previous
		new items will be added, old items will be overwritten.  if you add 2 classes together, do not overwrite, but merge
		special abilities will always start at array[4] (always the 5th item in the array)
        CasterType: if they are a caster, they will have this, specifiying caster type (Arcane, Divine, or Psionic)
	SLevel 1: for Spell casters, SLevel(then number) will show what spells they get that level