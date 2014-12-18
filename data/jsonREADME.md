This read me file is to help explain how the json files are set up and their lay out
Please use this file as a guide to formating entries and update all edited entries when done.

classes layout:
====================
```json
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
      "1": {
        "BAB": 1,
        "Fort": 1,
        "Ref": 1,
        "Will": 1,
        "Abilities": [],
        "SpellCasting": [],
        "SpellsKnown": [],
	"Misc": {}
      },
      "2": {
        "BAB": 1,
        "Fort": 1,
        "Ref": 1,
        "Will": 1,
        "Abilities": [],
        "SpellCasting": [],
        "SpellsKnown": [],
	"Misc": {}
      },
      "3": {
        "BAB": 1,
        "Fort": 1,
        "Ref": 1,
        "Will": 1,
        "Abilities": [],
        "SpellCasting": [],
        "SpellsKnown": [],
	"Misc": {}
      }
    },
    "BookSource": "",
    "Misc": [],
    "Bonus languages": [],
    "Weapon and armor proficiency": [],
    "Alignment": ""
  }
]
```

about entries:
--------------------

* Class		: self explainitory
* Base		: is it a base class or prestige. if prestige is yes, then the requirements array will be needed
* hitdice		: the hit dice for that class, d4, d6, d8, d10, or d12
* Skill points	: the number of base skill points per level (if its a new character, this will have to be multiplied by 4)
* KeyStat		: the stat that is most important to the class
* SecStat		: the second most important stat for the class
* SpellCaster	: a boolean to see if this class can cast spells or not
* PsionicClass	: a boolean to see if this class can manifest powers or not
* ClassSkill	: an array of all skills that are skills for this class
* ClassAbilities	: an array of abilities granted as the character takes levels in this class
    they are ordered and keyed by level granted.  each entry has a BAB (Base attack bonus), a Fort (Fortitude)
    a Ref (Reflex), a will, an array of Abilities, and an array called SpellCasting.  The array of Class abilities
    will hold any abilities granted at that level, it is the programs job to handle if an ability overwrites another.
    
    Example: barbarains get rage multiple times a day, as they level up they get more. at 1 they get it once
    a day, at level 4, they get it twice. at level 4 they will need to have that overwritten so
    that the higher value is taken.
    
    The array also has a spell casting array that will have the number of spells per day that they get.  this should be an
    array of int's. SpellsKnown holds the number of spells that class should know at that level.  some classes have spells
    known based on the spell level and others have them based on a total number. any class that has access to all, it will
    say here. Misc is an object that holds any extra abilities that level grants that class
* Book Source	: the book the class comes from
* Misc		: any extra information that doesnt really belong anywhere else
* Bonus languages	: any extra languages this class offers to that character
* Weapon and armor proficiency : an array of weapons and armor that class can use
* Alignment	: the typical alignment this class is


feats layout:
====================
```json
  {
    "Name": "",
    "Type": "",
    "Prerequisites": [],
    "Benefits": {
      "Numeric": {
        "Skills": {},
        "CharacterAbilities": {}
      },
      "Other": {
        "Ability":[],
        "Misc":[]
      }
    },
    "Short Text": "",
    "Long Text": "",
    "Book Source": ""
  }
```

about entries:
--------------------

* Name		: Self explaintory
* Type		: This is the type of feat this is, general, item creation, metamagic, etc.
* prerequisites	: list of all required feats that has to be checked before this feat can be taken
    None means this feat can be taken without any others
* benefits	: what the feat gives you, this can be 2 types, Numeric or other
    Both Numeric and Other are broken down into 2 subtypes.  For Numeric its Skills and CharacterAbilities.  Skills is for
    any of the skill that the feat boosts or subtracts from.  character abilities is for any special traits the feat effects
    Such as increase general caster level, increase the number of times per day a skill can be used.  Etc.
    Other is broken down int Ability and Misc.  basically this is for feats that need to be handled or not.  If the feat just
    gives a general ability such as cleave does, then that goes in to Misc.  If the ability gives a spell, access to a school,
    Spell or access to a new character ability, that goes in Ability.
* Short Text	: text from the quick feat entry
* Long Text	: text from the feat entry
* Book Source	: the book the feat comes from


magic items layout:
====================
```json
  {
    "Name": "",
    "Cost": "",
    "Location": "",
    "Description": "",
    "Benefits": {
      "numeric": {
         "skills": {},
         "CharacterAbilities": {}
      },
      "other": []
    },
    "Source Book": "",
    "Weight": ""
    }
```

about entries:
--------------------

* Name		: Self explaintory
* Cost		: the price to buy the item
* Location	: location the item is stored on the body, n/a means it can be stored anywhere
* Desciption	: entry from the book
* Benefits	: the benefit the item can grant, like with feats the item can give different types.
    such as a stat boost, skill boost or speed boost.  this information is stored here.
* Source Book	: the book the item came from
* Weight		: the weight of the item


mundane items layout:
====================
```json
    {
        "Name": "",
        "Type": "",
        "Weight": 1,
        "Cost": "",
        "Damage": "",
        "Text": "",
        "Source Book": ""
    }
```

about entries:
--------------------

* Name		: Self explaintory
* Type		: the catagory of item
* Weight		: the weight of the item
* Cost		: the price for the item
* Damage		: the damage of the item, if any
* Text		: entry from the book
* Source book	: the book the item came from


races layout:
====================
```json
  {
    "Name": "",
    "Languages": [],
    "Bonus Languages": [],
    "Size": "",
    "Speed": 30,
    "Age": [],
    "Height": [],
    "Base Weight": [],
    "Weight Modifier": "",
    "Alignment": "",
    "Religion": [""],
    "Favored Class": "",
    "Traits": {
      "Stats": {},
      "Skills": {},
      "Spells": [],
      "Abilities": [],
      "Misc": {}
    }
  }
```

about entries:
--------------------

* Name		: Self explaintory
* Languages	: an array of basic languages this race starts with
* Bonus Languages	: an array of extra languages this race can normally get
* Size		: the size category for the race
* Speed		: the speed (in feet) the race can move
* Age		: an array of the age ranges for the race (in order)
    [ 0 = adulthood, 1 = middle age, 2 = old age, 3 = venerable age, 4 = max possible age ]
* Height		: an array of min and max heights for both males and females (first 2 are males, second 2 are females)
    [ 0 = min male height, 1 = max male height, 2 = min female height, 3 = max female height ]
* Base Weight	: an array with the base weights for males and females (in that order)
* Weight Modifier : the modifier that is to be multiplied by the difference from actual height - minimum height.
    this is added to the base weight to find actual weight
* Alignment	: the general alignment this race normally is
* Religion	: the general religion this race follows
* Favored Class	: the class this race tends to become
* Traits 		: this is the abilities and stats the class gives
  * Stats 	: the stat changes (normally its 1 +2 and 1 -2 to 2 different stats
  * Skills	: any bonuses to a skill the race gives
  * Spells	: any spells or spell like abilities the class grants
  * Abilities:any abilities the class grants
  * Misc	: things the class grants that affect the character as a whole or cant be categorized


spell layout:
====================
```json
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
```

about entries:
--------------------

* Name		: Self explaintory
* School		: Source school of spell
* Level		: array that holds the multiple types with spell level and/or spell source/Domain
* Components	: Any spell components required to cast the spell, possible entries: V, S, M, F, DF, F/DF, M/DF, XP
    V: Verbal, S: Somatic, M: Materal, F: Focus, DF: Divine Focus, F/DF: Focus divine focus, M/DF: Materal Divine focus, XP: Experience 
* Cast Time	: the time it taks to cast the spell
* Range		: the length at which the spell can be cast
* Duration	: how long the spell will last
* Saving throw	: boolean to show if the spell gives a saving throw
* Spell resistance: boolean to show if the spell is effected by spell resistance
* Target		: the number of targets that can be hit by the spell (single, multiple, self, or N/A)
* Effect		: general effect of the spell
* Type		: Array holding the types of the spell
* Size		: the area of which the spell hits
* Damage		: the ammount of damage, if any
* Short Text	: text from the quick spell list
* Long Text	: text from the spell entry
* Material component: spell component if any
* Book Source	: the book the spell comes from


spell_list layout:
====================
```json
    {
        "Source": "",
        "Type": "",
        "Source Book": "",
        "Level 0": [],
	"Level 1": []
    }
```

about entries:
--------------------

* Source		: the type of caster that will get this (ie. sor/wiz, ranger, cleric, etc)
* Type		: Arcane, Divine, Psionic, other (artificer)
* Source Book	: the book this list comes from
* Level 0		: 0-9, the spells that are granted themselves


Issues, Ideas and Idiocracy 
====================