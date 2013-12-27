--------------------------------------------------------------------------------
D&D Random Character Generator
Written in 2013 by Derric Atzrott <zellfaze@zellfaze.org> 

To the extent possible under law, the author(s) have dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty. 

You should have received a copy of the CC0 Public Domain Dedication along with
this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>. 
--------------------------------------------------------------------------------

==Description of Software==
This is a D&D Random Character Generator.  Given some set constants (or none at
all) it will go ahead and generate the rest of a player character for you.  The
original goal in conceiving this software was to put together a generator that
would help a rushed DM create fleshed out high level NPCs for player characters
to encounter.

The generator though is equally useful for those that need to quickly roll up a
character in order to join a game, or for those that do not care about some or
all of the details of their character.  The generator is designed so that you
can fill in the details that you care about and let it fill in the rest.

==Browser Support==
This application does NOT support older versions of Internet Explorer, namely
IE6, IE7, and IE8.  If you are using an older browser, you will have to upgrade
to make use of this software.  I encourage you to check out Mozilla Firefox,
which is a great modern alternative to older versions of Internet Explorer (and
for that matter Internet Explorer in general).  You can find Mozilla Firefox at
the following URL:
  http://www.getfirefox.com/

==Help By Section==  
===Ability Scores===
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