/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PlaylistController {

    constructor() {
        this.userStore = Storages.localStorage;
    }


    loadTopUser(pageNum = 1, callBack = null) {

        let request = 'php/json/page/Playlist.php?list=topuser&page=' + pageNum;

        $.getJSON(request, function (json) {

            $page.myVues.userlist.topuser.update(json.data.value);

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

    loadSearchResult(needle, pageNum = 1, callBack = null) {

        let request =
            'php/json/page/YouTube.php?action=search' +
            '&size=50&needle=' + needle.asVar();
        
        $.getJSON(request, function (json) {

            let trackCnt = json.data.value.length;
            let maxPages = 1;
            let tracks = [];
            let savedVid = needle.videoId;
            if (trackCnt > 0) {
                maxPages = trackCnt / $page.settings.general.tracksPerPage | 0;
                if (trackCnt % $page.settings.general.tracksPerPage > 1) maxPages++;

                for (let cnt = 0; cnt < trackCnt; cnt++) {
                    let ytvid = json.data.value[cnt];
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
            if(pageNum === null || pageNum < 1) {
            	pageNum = 1
            } else if(pageNum > maxPages) {
            	pageNum = maxPages;
            }

            let perPage = parseInt($page.settings.general.tracksPerPage);
            let startPos = (pageNum - 1) * perPage;
            let endPos = startPos + perPage;
    
            let searchData = {
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

                TRACKS: tracks.slice(startPos, endPos)
            };
           
            
            if (typeof callBack === 'function') {
                callBack(true, searchData);
            } else {
            	$page.myVues.playlist.search.update(searchData);
            }

        }).fail(function (xhr) {
            if (typeof xhr === 'object' && xhr !== null) {
                console.error(
                    'request: ', request,
                    '\n\nresponse: ', xhr.responseText,
                    '\n\nstatus: ', xhr.status,
                    '\n\nerror: ', xhr.statusText
                );
            } else {
                console.log('request: ', request, 'error');
            }
            
            callBack(false, null);
        });
    }

    loadTopSongs(pageNum = 1, callBack = null) {

    	let sortBy = $page.myVues.playlist.topsongs.menu.$data.SORTBY.SELECTED;
    	
        $.getJSON('php/json/page/Playlist.php?list=topsongs' + 
        		'&page=' + pageNum + 
        		'&sortby=' + sortBy, 
        		function (json) {					
					try {
					    if (typeof callBack === 'function') {
					        callBack(true, json.data.value);
					    } else {
							$page.myVues.playlist.topsongs.update(json.data.value);
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
                    callBack(false, null);
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
        let tracksPerPage = $page.settings.general.tracksPerPage;
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

        let data = {
	        HEADER: {
	            PLAYLIST: $page.menu.getMenuItem('userlist').PLAYLIST,
	            TEXT: $page.menu.getMenuItem('userlist').TEXT,
	            URL: $page.menu.getMenuItem('userlist').LDATA
	        },
	
	        TRACKS: tracks
        };
        
        if (typeof callBack === 'function') {
            callBack(true, data);
        } else {
            $page.myVues.playlist.update(data);
        }
    }
    

    loadVideoCommentList(videoId, pagetoken=false) {
    	if(pagetoken===false && $player.commentsLoaded &&
    			$player.currentTrackData.videoId === videoId) {
// console.log('Comments for Video {} %s already loaded', videoId);
    		return;
    	}    	
// console.log('load comments for video', videoId);
    	
    	let request = 'php/json/page/YouTube.php?action=videoComments' +
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
    		
    		$player.commentsLoaded = true;
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
                if (typeof callBack === 'function') {
                    callBack(true, json.data.value);
                } else {                	
                	$page.myVues.playlist.lastfm.update(json.data.value);
                }
            } catch (e) {
                console.error('error in load default list callback function', e);
                console.error('Callback: ', callBack);
                console.error('page: ', pageNum, ' user: ', user, ' callback ', callBack);
            }
        }).fail(function (xhr) {

            $.logXhr(xhr);

            if (typeof callBack === 'function') {
                callBack(false, null);
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
        let offset = ((pageNum - 1) * $page.settings.general.tracksPerPage);
        tracks.splice(offset + index, 1);
        this.setUserTracks(tracks);
    }

    updateUserListPages(pageNum = null, tracks = null) {

        $page.myVues.playlist.user.menu.$data.LASTFM_USER_NAME = '';
        $page.myVues.playlist.user.menu.$data.PLAYLIST = 'userlist';

        if (tracks === null) tracks = this.getUserTracks();
        if (tracks.length <= 0) {
            $page.myVues.playlist.user.menu.$data.CUR_PAGE = 1;
            $page.myVues.playlist.user.menu.$data.MAX_PAGES = 1;
            return 1;
        }

        let tracksPerPage = $page.settings.general.tracksPerPage;

        let pageCount = (tracks.length / tracksPerPage) | 0;

        if ((tracks.length % tracksPerPage) > 0) pageCount++;
        $page.myVues.playlist.user.menu.$data.MAX_PAGES = pageCount;

        if (pageNum === null) {
            pageNum = ($page.myVues.playlist.user.menu.$data.CUR_PAGE) | 0;
        }

        if (pageNum > pageCount) pageNum = pageCount;
        else if (pageNum < 1) pageNum = 1;

        $page.myVues.playlist.user.menu.$data.CUR_PAGE = pageNum;
        return pageNum;
    }
    
    
    saveVideo(needle = null) {

        if (needle === null || !needle.isValid()) return;

        let updateVue = function (vue) {
            if (vue !== $page.myVues.playlist.search) {
            	if(vue.content.$data.TRACKS === null) return;
            	
                vue.content.$data.TRACKS.forEach(function (track) {
                    if (track.VIDEO_ID === needle.videoId) {
                        track.VIDEO_ID = needle.videoId;
                    }
                });
            } else {
                vue.menu.SAVED_VIDEO_ID = needle.videId;
            }           
        };

        $.ajax('php/json/page/YouTube.php?action=save-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title,
                videoId: needle.videoId
            }
        }).done(function (json) {

            let userTracks = $playlist.getUserTracks();
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = json.data.value.url;
                }
            }
            $playlist.setUserTracks(userTracks);
            $page.setLoading();
            $page.myVues.playlist.user.update({
                TRACKS: userTracks
            });            
            updateVue($page.myVues.playlist.lastfm);
            updateVue($page.myVues.playlist.topsongs); 
            
        }).fail(function (xhr) {
        	$page.setLoading();
            $.logXhr(xhr);
        });
    }
    
    deleteVideo(needle = null) {

        if (needle === null || !needle.isValid()) return;

        let updateVue = function (vue) {
            if (vue !== $page.myVues.playlist.search) {
            	if(vue.content.$data.TRACKS === null) return;
            	
                vue.content.$data.TRACKS.forEach(function (track) {
                    if (track.VIDEO_ID === needle.videoId) {
                        track.VIDEO_ID = '';
                    }
                });
            } else {
                vue.menu.SAVED_VIDEO_ID = '';
            }           
        };
        
        $page.loader.setLoading(null, true);
        $.ajax('php/json/page/YouTube.php?action=delete-video', {
            dataType: 'json',
            method: 'POST',
            data: {
                artist: needle.artist,
                title: needle.title
            }
        }).done(function (json) {
            let userTracks = $playlist.getUserTracks();
            let curTrack = null;
            for (let cnt = 0; cnt < userTracks.length; cnt++) {
                let uTrack = userTracks[cnt];
                if (
                    uTrack.TITLE === needle.title &&
                    uTrack.ARTIST === needle.artist
                ) {
                    uTrack.VIDEO_ID = '';
                }
                if ($player.isCurrentTrack(uTrack)) {
                    $player.currentTrackData.track.VIDEO_ID = '';
                    curTrack = uTrack;
                }
            }
            $playlist.setUserTracks(userTracks);
            $page.setLoading();
            $page.myVues.playlist.user.update({
                TRACKS: userTracks
            });            
            updateVue($page.myVues.playlist.lastfm);
            updateVue($page.myVues.playlist.topsongs);            
            
        }).fail(function (xhr) {
            $page.setLoading();
            $.logXhr(xhr);
        });
    }
}