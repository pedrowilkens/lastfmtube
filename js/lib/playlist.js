class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
    }


    loadTopUser(pageNum = 1, callBack = null) {

        let request = 'php/json/page/Playlist.php?list=topuser&page=' + pageNum;

        $.getJSON(request, function (json) {

            $page.myVues.userlist.update(json.data.value);

            try {
                if (typeof callBack === 'function') {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {
            $.logXhr(xhr);
        });
    }

    loadSearchResult(needle, result, pageNum = 1, callBack = null) {

        let trackCnt = result.data.value.length;
        let maxPages = 1;
        let tracks = [];
        let savedVid = needle.videoId;
        if (trackCnt > 0) {
            maxPages = trackCnt / PageController.TRACKS_PER_PAGE | 0;
            if (trackCnt % PageController.TRACKS_PER_PAGE > 1) maxPages++;

            for (let cnt = 0; cnt < trackCnt; cnt++) {
                let ytvid = result.data.value[cnt];
                let track = {
                    NR: (cnt + 1) + '',
                    ARTIST: '',
                    TITLE: ytvid.TITLE,
                    VIDEO_ID: ytvid.VIDEO_ID,
                    PLAYLIST: 'search',
                    PLAYCOUNT: null,
                    PLAYSTATE: '',
                    PLAY_CONTROL: ''
                };
                if ($player.isCurrentTrack(track)) {
                    track.PLAYSTATE = $player.currentTrackData.track.PLAYSTATE;
                    track.PLAY_CONTROL = $player.currentTrackData.track.PLAY_CONTROL;
                    $player.setCurrentTrack(track);
                }
                tracks[cnt] = track;
            }
        }

//        $page.setCurrentPlaylist('search');
        let playlistArticle = $('article[name=playlist-container]');
        $(playlistArticle).attr('id', 'search');
        $page.myVues.playlist.update({
            HEADER: {
                TEXT: 'Search Results'
            },

            LIST_MENU: {
                CUR_PAGE: pageNum,
                MAX_PAGES: maxPages,
                PLAYLIST: 'search',
                SAVED_VIDEO_ID: savedVid,
                SEARCH_NEEDLE: needle,
                SEARCH_RESULT: tracks
            },

            TRACKS: tracks.slice(0, PageController.TRACKS_PER_PAGE)
        });

        if (typeof callBack === 'function') {
            callBack(true);
        }
    }

    loadTopSongs(pageNum = 1, sortBy = null, callBack = null) {
    	
    	if(sortBy === null) {
    		sortBy = $page.myVues.playlist.menu.$data.SORTBY.SELECTED;
    	}
    	
        $.getJSON('php/json/page/Playlist.php?list=topsongs' + 
        		'&page=' + pageNum + 
        		'&sortby=' + sortBy, 
        		function (json) {
					$page.myVues.playlist.update(json.data.value);
					
					try {
					    if (typeof callBack === 'function') {
					        callBack(true);
					    }
					
					} catch (e) {
					    console.error('error in load topsongs list callback function', e);
					    console.error('Callback: ', callBack);
					    console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
					}
            }).fail(function (xhr) {

            $.logXhr(xhr);

            try {
                if (typeof callBack === 'function') {
                    callBack(false);
                }
            } catch (e) {
                console.error('error in load topsongs list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        });
    }

    loadCustomerList(pageNum = 1, callBack = null) {

        let tracks = this.getUserTracks();

        let tracksPerPage = PageController.TRACKS_PER_PAGE;
        pageNum = this.updateUserListPages(pageNum, tracks);
        let endIndex = pageNum * tracksPerPage;
        let startIndex = endIndex - tracksPerPage;

        if (endIndex < tracks.length) {
            tracks = tracks.slice(startIndex, endIndex);
        } else {
            tracks = tracks.slice(startIndex);
        }

        for (let cnt = 0; cnt < tracks.length; cnt++) {
            let track = tracks[cnt];
            track.NR = ((pageNum - 1) * tracksPerPage) + (cnt + 1);
        }

        $page.myVues.playlist.update({
            HEADER: {
                PLAYLIST: $page.menu.getMenuItem('userlist').PLAYLIST,
                TEXT: $page.menu.getMenuItem('userlist').TEXT,
                URL: $page.menu.getMenuItem('userlist').LDATA
            },

            TRACKS: tracks
        });


        if (typeof callBack === 'function') {
            callBack(true);
        }
    }
    

    loadVideoCommentList(videoId, pagetoken=false) {
    	
    	let request = null;    	
    	if(pagetoken===false &&
    			$page.myVues.youtube.comments.$data.videoId == videoId) {
    		console.log('Comments for Video {} %s already loaded', videoId);
    		return;
    	}
    	$page.myVues.youtube.comments.$data.videoId = videoId;
    	
    	request = 'php/json/page/YouTube.php?action=videoComments' + 
        		'&videoId=' + videoId;
    	if(pagetoken!==false) {
    		request += '&pageToken=' + pagetoken;
    	}
    	
    	$.getJSON(request, function(json){
    		if(pagetoken===false) {    			
    			$page.myVues.youtube.comments.update(json.data.value);   		
    		} else {
    			$page.myVues.youtube.comments.append(json.data.value);
    		}
    	}).fail(function (xhr) {
    		console.error('request failed');
            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
        
    }
    
    isValidUser(user = null) {
        return user !== null && (user + '').trim().length > 0;
    }

    loadLastFmList(pageNum = 1, user = null, callBack = null) {

        let request = null;

        if (this.isValidUser(user)) {
            request = 'php/json/page/Playlist.php?list=playlist' +
                '&user=' + user +
                '&page=' + pageNum
            ;
        } else {
            request = 'php/json/page/Playlist.php?list=playlist' +
                '&page=' + pageNum
            ;
        }

        $.getJSON(request, function (json) {

            try {
                $page.myVues.playlist.update(json.data.value);

                /**
				 * Vue.nextTick() .then(function () { // DOM updated
				 * $page.myVues.playlist.update(json.data.value, ignoreTitle);
				 * });
				 */

                if (typeof callBack === 'function') {
                    callBack(true);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {

            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false);
            }
        });
    }

    getUserTracks() {
        let userStore = this.userStore;
        if (!userStore.isSet('userlist.tracks')) userStore.set('userlist.tracks', []);
        return userStore.get('userlist.tracks');
    }

    setUserTracks(tracks = []) {
        this.userStore.set('userlist.tracks', tracks);
    }

    addUserTrack(track) {
        let tracks = this.getUserTracks();
        let newTrack = {
            NR: (tracks.length + 1),
            ARTIST: track.ARTIST,
            TITLE: track.TITLE,
            LASTPLAY: track.LASTPLAY,
            VIDEO_ID: track.VIDEO_ID,
            PLAY_CONTROL: '',
            PLAYLIST: 'userlist',
            PLAYSTATE: ''
        };


        tracks.push(newTrack);
        this.setUserTracks(tracks);
    }

    removeUserTrack(index = -1) {
        let tracks = this.getUserTracks();
        if (index >= tracks.length || index < 0 || tracks.length === 0) return;
        
        let pageNum = $page.myVues.playlist.menu.$data.CUR_PAGE;
        let offset = ((pageNum - 1) * PageController.TRACKS_PER_PAGE);
        tracks.splice(offset + index, 1);
        this.setUserTracks(tracks);
    }

    updateUserListPages(pageNum = null, tracks = null) {

        $page.myVues.playlist.menu.$data.LASTFM_USER_NAME = '';
        $page.myVues.playlist.menu.$data.PLAYLIST = 'userlist';

        if (tracks === null) tracks = this.getUserTracks();
        if (tracks.length <= 0) {
            $page.myVues.playlist.menu.$data.CUR_PAGE = 1;
            $page.myVues.playlist.menu.$data.MAX_PAGES = 1;
            return 1;
        }

        let tracksPerPage = PageController.TRACKS_PER_PAGE;

        let pageCount = (tracks.length / tracksPerPage) | 0;

        if ((tracks.length % tracksPerPage) > 0) pageCount++;
        $page.myVues.playlist.menu.$data.MAX_PAGES = pageCount;

        if (pageNum === null) {
            pageNum = ($page.myVues.playlist.menu.$data.CUR_PAGE) | 0;
        }

        if (pageNum > pageCount) pageNum = pageCount;
        else if (pageNum < 1) pageNum = 1;

        $page.myVues.playlist.menu.$data.CUR_PAGE = pageNum;

        return pageNum;
    }
}