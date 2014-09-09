D&D Random Character Generator
====================
Written in 2013 by Derric Atzrott <zellfaze@zellfaze.org> and Vin

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty. 

_You should have received a copy of the CC0 Public Domain Dedication along with
this software. If not, see [CreativeCommons.org][1]._

Description of Software
====================
This is a D&D Random Character Generator.  Given some set constants (or none at
all) it will go ahead and generate the rest of a player character for you.  The
original goal in conceiving this software was to put together a generator that
would help a rushed DM create fleshed out high level NPCs for player characters
to encounter.

The generator though is equally useful for those that need to quickly roll up a
character in order to join a game, or for those that do not care about some or
all of the details of their character.  The generator is designed so that you
can fill in the details that you care about and let it fill in the rest.

Browser Support
====================
This application does NOT support older versions of Internet Explorer, namely
IE6, IE7, and IE8.  If you are using an older browser, you will have to upgrade
to make use of this software.  I encourage you to check out Mozilla Firefox,
which is a great modern alternative to older versions of Internet Explorer (and
for that matter Internet Explorer in general).  You can find Mozilla Firefox at
the following URL:
  http://www.getfirefox.com/

Understanding Extras
====================
Due to the constraints of the Open Game License there is a lot of content that
I would like to support in this application that can not be directly distributed
with the application.  These include things such as the gods from the Player's
Handbook or the backstory generation from the Hero Builder's guide.

The extras folder contains a number of JSON files that can be used to define
data for this application to pull in during its initial loading.  You could use
the dieties.json file, for example, to define all of the gods from the Player's
Handbook or alternatively your own campaign setting.

There are numerous tutorials online for how to edit JSON files.  Sample files
are included in this distribution as well.  For more information on editting
each of the JSON files, please see extras/jsonREADME.txt.

Each of the JSON files are described below:
* dieties.json:
    Sample Licensed OGL (c) Sean K Reynolds et al.
    Defines dieties to be used by the application.  Each diety has a name, an
    alignment, and a power level.  The available power levels are Demi, Lesser,
    and Major.
* names.json:
    Sample Licensed CC-0
    Defines names for every race used by the application.  Each race has its
    own section, and each racial section is divided into given names and
    surnames.  Given names are further divided into male and female.  Any race
    that doesn't have a name list will use the human list.  If given names are
    the same for both male and female members of a race, just define the male
    names.
* languages.json:
    Sample Licensed OGL (c) Wizards
    Defines languages that are available for the Speak Languages skill.  Each
    language has a name and an alphabet.  The sample file includes all of the
    languages from the System Reference Document.
* skills.json:
    Sample Licensed OGL (c) Wizards
    Defines all of the skills available for the generator to use.  Each skill
    has a name, whether or not it may be used untrained, whether or not it
    incurs an armor check penalty, what ability score it uses, whether or not
    magic users should favour it, whether or not psionic users should favour it,
    and what skills it gives synergy bonuses to.  If "Speak Languages" is not in
    this file, the Languages section will not be available.
* Classes.json:
    Sample Licensed OGL (c) Wizards
    Defines the classes and features that are available to characters.  Each
    class is defined up to level 20.  The sample file includes all of the
    classes from the System Reference Document.
* feats.json
    Sample Licensed OGL (c) Wizards
    Defines the feats available to characters.  Feats are defined using their
    numeric bonuses along with their less mechanical bonuses.  The sample file
    includes all of the feats from the System Reference Document.
* spell_list.json
    Sample Licensed OGL (c) Wizards
    Defines spell lists that are used by the various classes.  Many classes have
    their own spells lists, but some, like Wizard and Sorcerer, share a spell
    list.  Some spell lists are domain lists and become available to characters
    as additional lists to their usual one.  This sample file includes all spell
    lists from the System Reference Document.
* spells.json
    Sample Licensed OGL (c) Wizards
    Defines all spells that are referencable in the spell list file.  This
    sample file includes all spells from the System Reference Document.
  
Help By Section
====================

Ability Scores
---------------------
Under the options for ability scores there are two options Roll Method and
Placement method that determine how scores are rolled and placed.  Each of these
options are described in more detail below.

Roll Method: Determines how the dice are rolled for the ability scores.
* 3d6 x6:
    Three six sided dice are rolled and totaled 6 times, once for each ability
    score.  Produces average characters.
* 4d6 Drop x6:
    Four six sided dice are rolled, the lowest roll is dropped.  This is
    repeated a total of six times, once for each ability score.  Produces
    slightly above average characters.
* 4d6 Drop x7 Drop:
    Four six sided dice are rolled, the lowest roll is dropped.  This is
    repeated a total of seven times.  The lowest of the seven totals is dropped
    to give six totals, one for each ability score.  Produces well above average
    characters.
    
Placement Method: Determines how the rolled ability scores are alocated.
* Random:
    The six rolled totals are placed into ability scores randomly.
* Pick:
    The six rolled totals are placed into ability scores randomly, but weighted
    based on the selected class and race.
    
[1]: http://creativecommons.org/publicdomain/zero/1.0/    "CreativeCommons.org"