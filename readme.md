Author | Jonny Rimkus &lt;jonny@rimkus.it&gt;
------ | ---------------------------
Website | https://www.rimkus.it
License | http://www.wtfpl.net/

Demo: http://lastfm.rimkus.it

# About

The last.fm Youtube Radio searches and plays the listened tracks of a given last.fm user on YouTube.
It is possible to search for alternative Youtube Videos or enter a video url directly.
You can create your own playlist via menu 'Add to playlist'.
additionally there is a Chart list which will be updated each time a song is heared.

  * get the length of the Song divided by 2. 
  if it is greater than 2 minutes use 2 minutes as timeout, 
  otherwise use calculated length. 
  * when Timeout is reached, increase playcount for Song.

The Timer is designed to stop when player is paused,
and will continue when the player continues to play. 

## replacements.csv

you can use Regular Expressions for Replacing artist and title information if the Song information is messy, 
sothat the search string that is send to youtube can be corrected in an efficient way. 
The csv is stored in a database after first load, and re-imported automoically if changed. 
See the `init.replacement.example.csv` for more details 

## Directory Structure:
  - __conf__ Configuration Files and sqlite Database
  - __conf/settings.json__ copy from settings.example.json, here you have to adjust the Youtube/Last.fm settings for the player.
  - __conf/init.replacements.csv__ copy from `init.replacements.example.csv`, this file is checked when parsing the Song Title and Artist for searching the Song on YouTube. 
You can define replacements for a specific part of a song here, 
e.g. remove [unnknown] from all Song Titles.
  - __conf/lasttube.db__ this is the sqlite Database (will be created automatically)
  - __themes__ place new themes into this directory. (theming is untested)
simply copy an existing theme directory and rename it to your new theme name (and adjust settings.ini as needed)
  - __locale__ here you can localize the Strings. currently supported langs: english and german
to create a new language, copy an existing language file and 
rename it to the country specific code, e.g. locale_nl.properties for netherland. 
Translate all Strings and add it to the locale.info file in the format: nl netherlands
  - __js__ all js Controller (player,page,playlist)  
  - __js/lib__ all required js dependecies e.g jquery/vuejs files
  - __js/lib/libvue__ all Vuejs instances
  - __php/json__ all required php json handler
  - __php/api__ all API handlers (youtube/last.fm API)
  - __php/util__ all required php libs youtube/last.fm
  - __tmp__ temp folder for generated templates

# requirements

* PHP >= 5.6
* PHP PDO SQLite or Mysql (any PDO DB should work, but untested)
* Composer (See [composer.json](file://./composer.json]))

# Installation

1. Place this folder somewhere under your document Root e.g.: http://example.com/lfmtube
2. run composer install
3. copy the file conf/example.settings.json to conf/settings.json
4. create a last.fm user with a Developer API key
5. create a youtube user with a Developer API Key
6. enter the API keys in the settings.json
7. open http://example.com/lfmtube and enjoy
