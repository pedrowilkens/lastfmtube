class ChartTimer {

}

class PlayerController {

    constructor() {
        this.ytPlayer = null;
        this.isReady = false;
        this.autoPlay = false;
        this.CURRENT_TRACK = null;
        this.ytStatus = new Object();

        this.ytStatus.UNSTARTED = new Object();
        this.ytStatus.UNSTARTED.ID = -1;
        this.ytStatus.UNSTARTED.NAME = 'unstarted';

        this.ytStatus.ENDED = new Object();
        this.ytStatus.ENDED.ID = 0;
        this.ytStatus.ENDED.NAME = 'ended';

        this.ytStatus.PLAYING = new Object();
        this.ytStatus.PLAYING.ID = 1;
        this.ytStatus.PLAYING.NAME = 'playing';

        this.ytStatus.PAUSED = new Object();
        this.ytStatus.PAUSED.ID = 2;
        this.ytStatus.PAUSED.NAME = 'paused';

        this.ytStatus.BUFFERING = new Object();
        this.ytStatus.BUFFERING.ID = 3;
        this.ytStatus.BUFFERING.NAME = 'buffering';

        this.ytStatus.CUED = new Object();
        this.ytStatus.CUED.ID = 5;
        this.ytStatus.CUED.NAME = 'vide cued';

    }

    initPlayer() {

        //$.getScript('//www.youtube.com/iframe_api');
        let tag = document.createElement('script');
        tag.src = '//www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        let startvideo = '';//'9RMHHwJ9Eqk';
        let ytplayerwidth = '100%';
        let ytplayerheight = ($(document).height() - 325) + 'px';

        window.onYouTubeIframeAPIReady = function () {


            let onReady = function (event) {
                $player.isReady = true;
                if ($player.autoPlay) {
                    $player.loadNextSong();
                }
                console.log('youtube player ready');
            };

            let onStateChange = function (event) {

                switch (event.data) {
                    case $player.ytStatus.UNSTARTED.ID:
                        break;
                    case $player.ytStatus.ENDED.ID:
                        if ($player.CURRENT_TRACK != null) $player.CURRENT_TRACK.PLAYSTATE = '';
                        $player.loadNextSong();
                        break;

                    case $player.ytStatus.PLAYING.ID:
                        $page.myVues.youtube.header.$data.NOW_PLAYING = $player.ytPlayer.getVideoData().title;                        
                        if ($player.CURRENT_TRACK != null) $player.CURRENT_TRACK.PLAYSTATE = 'play';
                        break;

                    case $player.ytStatus.PAUSED.ID:
                        if ($player.CURRENT_TRACK != null) $player.CURRENT_TRACK.PLAYSTATE = 'pause';
                        break;

                    case $player.ytStatus.BUFFERING.ID:
                        if ($player.CURRENT_TRACK != null) $player.CURRENT_TRACK.PLAYSTATE = 'load';
                        break;

                    case $player.ytStatus.CUED.ID:
                        break;
                }
            };
            let onError = function (event) {
                console.log('youtube player error');
            };


            $player.ytPlayer = new YT.Player('player', {

                height: ytplayerheight,
                width: ytplayerwidth,
                videoId: startvideo,
                crossDomain: true,

                playerVars: {
                    'allowfullscreen': 1,
                    'allowscriptaccess': 'always',
                    'webkitallowfullscreen': 1,
                    'mozallowfullscreen': 1,
                    'autoplay': 1,
                    'html5': 1,
                    'enablejsapi': 1,
                    'fs': 1,
                    'playerapiid': 'lastfmtube'
                },

                events: {
                    'onReady': onReady,
                    'onStateChange': onStateChange,
                    'onError': onError
                }
            });
        };
    }


    loadNextSong() {

        let tracks = $page.myVues.playlist.content.$data.TRACKS;
        let nextIndex = this.CURRENT_TRACK != null ? tracks.indexOf(this.CURRENT_TRACK) + 1 : 0;

        if ((nextIndex) >= tracks.length) {
            let playlist = $page.myVues.playlist.menu;
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage + 1) > maxPages) curPage = 1;
            else curPage++;

            $player.loadPlaylistPage(user, curPage, 'default', function (success) {
                if (!success) return;

                let tracks = $page.myVues.playlist.content.$data.TRACKS;
                $player.loadSong(tracks[0]);
            });

            return;
        } else if (nextIndex < 0) {
            nextIndex = 0;
        }

        this.loadSong(tracks[nextIndex]);
    }

    loadPreviousSong() {
        if (this.CURRENT_TRACK == null) return;
        let tracks = $page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
        let index = tracks.indexOf(this.CURRENT_TRACK);

        if ((index - 1) < 0) {
            let playlist = $page.vueMap['PLAYLIST_NAV'];
            let curPage = playlist.$data.CUR_PAGE;
            let maxPages = playlist.$data.MAX_PAGES;
            let user = playlist.$data.LASTFM_USER_NAME;
            if ((curPage - 1) > maxPages) curPage = maxPages;
            else curPage--;

            $player.loadPlaylistPage(user, curPage, 'default', function (success) {
                if (!success) return;

                let tracks = $page.vueMap['PLAYLIST_TRACKS'].$data.TRACKS;
                $player.loadSong(tracks[tracks.length - 1]);
            });


            index = tracks.length - 1;
        } else if (index < 0) {
            index = 0;
        } else {
            index--;
        }

        this.loadSong(tracks[index]);
    }

    setCurrentTrack(track) {
        
        if (this.CURRENT_TRACK != null) {
            this.CURRENT_TRACK.PLAYSTATE = '';
            this.CURRENT_TRACK = null;
        }
        track.PLAYSTATE = 'load';
        this.CURRENT_TRACK = track;
    }

    loadSong(track) {
        //console.log(artist);
        //console.log(title);
        //console.log(this.ytPlayer);
        if (this.ytPlayer == null) return;
        
        this.setCurrentTrack(track);


        let needle = $page.createNeedle(track);
        if (needle.videoId != null && needle.videoId.length > 0) {
            needle.videoId = vars.data.value.VALUE;
            $player.loadVideoByNeedle(needle);
            return;
        }

        let request = './php/json/JsonHandler.php?api=vars&data=search&name=' + needle.asVar();
        

        $.ajax(request, {
            dataType: 'json'
        }).done(function (vars) {

            if (!vars.data.value.EXISTS) {
                request = './php/json/JsonHandler.php?api=videos&data=search&needle=' + needle.asVar();
                $.ajax(request, {
                    dataType: 'json'
                }).done(function (search) {

                    needle.videoId = (search.data.value.length > 0 && search.data.value[0].video_id !== 'undefined') ?
                        search.data.value[0].video_id : '';

                    if (needle.videoId != null && needle.videoId.length == 0) {
                        console.log('load next song no video was found');
                        return;
                    }

                    $player.loadVideoByNeedle(needle);
                });
            } else {
                needle.videoId = vars.data.value.VALUE;
                $player.loadVideoByNeedle(needle);
            }
        });
    }

    loadVideoByNeedle(needle) {
        if (typeof needle !== 'undefined' && typeof needle.videoId !== 'undefined' && needle.videoId.length > 0) {

            $player.ytPlayer.loadVideoById(needle.videoId);
        } else {
            console.error('invalid parameter for loadVideoByNeedle');
            console.error(needle);
        }
    }


    isCurrentTrack(track) {
        return this.CURRENT_TRACK != null &&
            this.CURRENT_TRACK == track || (
                this.CURRENT_TRACK_NR == track.NR &&
                this.CURRENT_TRACK.PLAYLIST == track.PLAYLIST
            );
    }

    isPlaying() {
        return this.ytPlayer.getPlayerState() == this.ytStatus.PLAYING.ID;
    }

    isPaused() {
        return this.ytPlayer.getPlayerState() == this.ytStatus.PAUSED.ID;
    }
}
