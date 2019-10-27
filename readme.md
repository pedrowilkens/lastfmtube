Author | Jonny Rimkus &lt;jonny@rimkus.it&gt;
------ | ---------------------------
Website | https://www.rimkus.it
License | http://www.wtfpl.net/
Demo | https://lastfm.rimkus.it

# Requirements
* PHP >= 5.6 (last test with 7.3)
* PHP PDO SQLite tested (any PDO DB should work, but untested)
* Composer (See `composer.json`)
* [Lastf.fm](https://last.fm) Account with [API Support](https://www.last.fm/api/)
* [Youtube](https://youtube.com) Account with [API Supprt](https://developers.google.com/youtube/v3/)

# Installation
1. Place this folder somewhere under your document Root e.g.: http://example.com/lfmtube
2. run `composer install`
3. copy the file `conf/example.settings.json` to `conf/settings.json`
4. create a [Last.fm User](https://www.last.fm/user/ravermeister) with a [Developer API](https://www.last.fm/api/) key
5. create a [Youtube User](https://www.youtube.com) with a [Developer API](https://developers.google.com/youtube/v3) Key
6. enter the API keys in the `settings.json`
7. open http://example.com/lfmtube and enjoy

# About
The [Last.fm Youtube Radio](https://lastfm.rimkus.it) searches and plays the listened tracks of a given [Last.fm User](https://www.last.fm/user/ravermeister)  on [YouTube](https://youtube.com). It is possible to search for alternative Youtube Videos or enter a video url directly. The Tracks which have a fixed Video Id will have a **'*'** prefixed. You can create your own playlist via menu 'add to playlist'. Additionally there is a Chart list which will be updated each time a song is heared. The Chart Counter works as follows:

  * get the length of the Song divided by 2. 
  if it is greater than 2 minutes use 2 minutes as timeout, 
  otherwise use calculated length. 
  * when the Timeout is reached, increase playcount for Song.

The Timer is designed to stop when player is paused, and will continue when the player continues to play. 

## Hotkeys

The forward/rewind amount of time is increased when the functions is called fast in a row, and resetted to default afterwards. Currently following Hotkeys are supported:

Key binding | Command 
----------- | --------
enter | Play/Pause
left | Rewind Track 
right | Fast Forward Track 
ctrl+left | Previous Track 
ctrl+right | Next Track 

## Personal Songlist
You can send any Title to your personal song list (will be stored in browser cache), which is saved during a browser restart.

## Listen to other Last.fm User's Song Timeline
You can sarch any [Last.fm User](https://www.last.fm/user/ravermeister) and listen to the Song Timeline.

## Admin interface
There is an admin php cli Interface for Importing the replacement.csv Files and generating the sitemap.xml file.  
Call `php admin.php` inside the lastfmtube Folder for more info.

## replacements.csv
You can use [Regular Expressions](https://www.php.net/manual/de/function.preg-match.php) for Replacing Artist and Title information if the Song information is messy, sothat the search string that is send to youtube can be corrected in an efficient way. The csv is stored in the database after importing through the admin cli Interface. New- and Changed Files can be (re-)Imported with the admin interface at any time. See the `init.replacement.example.csv` for more details.

# Directory Structure:
  - __conf__ Configuration Files and [SQLite Database](https://sqlite.org)
  - __conf/settings.json__ copy from `settings.example.json`, here you have to adjust the Youtube/Last.fm settings for the player.
  - __conf/init.replacements.csv__ copy from `init.replacements.example.csv`, this file is checked when parsing the Song Title and Artist for searching the Song on YouTube. You can define replacements for a specific part of a song e.g. remove [unnknown] from all Song Titles.
  - __conf/lasttube.db__ this is the sqlite Database (will be created automatically)
  - __themes__ place new themes into this directory. (theming is untested)
simply copy an existing theme directory and rename it to your new theme name (and adjust `settings.json` as needed)
  - __locale__ here you can localize the Strings. currently supported langs: english and german
to create a new language, copy an existing language file and rename it to the country specific code, e.g. `locale_nl.json` for netherland. 
  - __js__ all js Controller (player,page,playlist)  
  - __js/lib__ all required js dependecies e.g [JQuery](https://jquery.com/)/[Vuejs](https://vuejs.org/) files
  - __js/lib/libvue__ all [Vuejs](https://vuejs.org/) instances
  - __php/json__ all required php json handler
  - __php/api__ all API handlers (youtube/last.fm API)
  - __php/util__ all other php libs
  - __tmp__ temp folder for generated templates
