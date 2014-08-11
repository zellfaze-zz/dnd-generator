This read me file is to help explain how the json files are set up and their lay out
Please use this file as a guide to formating entries and update all edited entries when done.

=================================================================================
classes layout:
=================================================================================
    {
        "Class": "",
        "Base": true,
        "HitDice": "",
        "SkillPoints": 4,
        "KeyStat": "",
        "SecStat": "",
	"SpellCaster": false,
	"PsionicClass": false,
        "ClassSkill": [],
        "ClassAbilities": {
			"1":
			{
				"BAB": 1,
                		"Fort": 1,
        		        "Ref": 1,
             			"Will": 1,
       			        "Abilities": [],
				"SpellCasting": []
			},
			"2":
			{
				"BAB": 1,
                		"Fort": 1,
                		"Ref": 1,
                		"Will": 1,
                		"Abilities": [],
				"SpellCasting": []
			},
			"3":
			{
				"BAB": 1,
                		"Fort": 1,
                		"Ref": 1,
                		"Will": 1,
                		"Abilities": [],
				"SpellCasting": []
			}
		},
		"BookSource": ""
	}

---------------------------------------------------------------------------------
about entries:

	Class		: self explainitory
	Base		: is it a base class or prestige. if prestige is yes, then the requirements array will be needed
	hitdice		: the hit dice for that class, d4, d6, d8, d10, or d12
	Skill points	: the number of base skill points per level (if its a new character, this will have to be multiplied by 4)
	KeyStat		: the stat that is most important to the class
	SecStat		: the second most important stat for the class
	ClassSkill	: an array of all skills that are skills for this class
	ClassAbilities	: an array of abilities granted as the character takes levels in this class
		they are ordered and keyed by level granted.  each entry has a BAB (Base attack bonus), a Fort (Fortitude)
		a Ref (Reflex), a will, an array of Abilities, and an array called SpellCasting.  The array of Class abilities
		will hold any abilities granted at that level, it is the programs job to handle if an ability overwrites another.
			Example: barbarains get rage multiple times a day, as they level up they get more. at 1 they get it once
				 a day, at level 4, they get it twice. at level 4 they will need to have that overwritten so
			         that the higher value is taken
		The array also has a spell casting array that will have the number of spells per day that they get.  this should be an
		array of int's
	Book Source	: the book the class comes from

=================================================================================
feats layout:
=================================================================================
    {
        "Name": "",
        "Prerequisites": [],
        "Benefits": {
            "numeric": {
                "skills": {},
                "CharacterAbilities": {}
            },
            "other": []
        },
        "Short Text": "",
        "Long Text": "",
        "Book Source": ""
    }

---------------------------------------------------------------------------------
about entries:

	Name		: Self explaintory
	prerequisites	: list of all required feats that has to be checked before this feat can be taken
		false means this feat can be taken without any others
	benefits	: what the feat gives you, this can be 2 types, Numeric or other
		Numeric includes bonuses to some kind of stat.  Most of them are either a skill or to some kind of class
		ability.  Other is for abilities that can not be measured in terms of numbers
	Short Text	: text from the quick feat entry
	Long Text	: text from the feat entry
	Book Source	: the book the feat comes from

=================================================================================
spell layout:
=================================================================================
    {
        "Name": "",
        "School": "",
        "Components": [],
        "Cast Time": "",
        "Range": "",
        "Duration": "",
        "Saving throw": false,
        "Spell resistance": false,
        "Target": "",
        "Effect": "",
        "Type": [],
        "Size": "",
        "Damage": "",
        "Short Text": "",
        "Long Text": "",
        "Material component": "",
        "Book Source": ""
    }

---------------------------------------------------------------------------------
about entries:

	Name		: Self explaintory
	School		: Source school of spell
	Level		: array that holds the multiple types with spell level and/or spell source/Domain
	Components	: Any spell components required to cast the spell, possible entries: V, S, M, F, DF, F/DF, M/DF, XP
		V: Verbal, S: Somatic, M: Materal, F: Focus, DF: Divine Focus, F/DF: Focus divine focus, M/DF: Materal Divine focus, XP: Experience 
	Cast Time	: the time it taks to cast the spell
	Range		: the length at which the spell can be cast
	Duration	: how long the spell will last
	Saving throw	: boolean to show if the spell gives a saving throw
	Spell resistance: boolean to show if the spell is effected by spell resistance
	Target		: the number of targets that can be hit by the spell (single, multiple, self, or N/A)
	Effect		: general effect of the spell
	Type		: Array holding the types of the spell
	Size		: the area of which the spell hits
	Damage		: the ammount of damage, if any
	Short Text	: text from the quick spell list
	Long Text	: text from the spell entry
	Material component: spell component if any
	Book Source	: the book the spell comes from

=================================================================================
spell_list layout:
=================================================================================
    {
        "Source": "",
        "Type": "",
        "Source Book": "",
        "Level 0": [],
	"Level 1": []
    }

---------------------------------------------------------------------------------
about entries:

	Source		: the type of caster that will get this (ie. sor/wiz, ranger, cleric, etc)
	Type		: Arcane, Divine, Psionic, other (artificer)
	Source Book	: the book this list comes from
	Level 0		: 0-9, the spells that are granted themselves

+:-----------------------------------------:+
	 Issues, Ideas and Idiocracy 
+:-----------------------------------------:+

Issue: Sorcercers
	They have spells per day AND spells 
	known we need to update the class 
	lay out to handle these for spell 
	casters, some are spontantous others 
	Prepared. 
		*could turn the SpellCaster 
		entry from boolean into a 
		string that holds the type 
		they are

Issue: Specialized spell casting
	Wizard/psion problem, (well not so 
	much psion because they have other 
	stuffs) specialized wizards get an 
	extra spell per spell level, how do 
	we address this?

Issue: over writing
	just making sure, the program is 
	going to deal with over writing of 
	abilities granted from ClassAbilities?
	basically if a barbarian levels up 
	to level 4, he will lose rage/1 day 
	and gain rage/2 day

Idea: have synergy (from the alignment, 
	synergy, archetype files) handle 
	blocking of other items basically 
	if taking of a feat or such blocks 
	you from another, have this 
	information stored in synergy.