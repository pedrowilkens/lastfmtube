/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class PageLoader {

	constructor() {
		
		this.currentPage = null;
		
		this.pages = {
			
			base: {
				value: 'base',
				selector: 'header',
				element: $('header[id='+selector+']')
			},
			
			userlist: {
				topuser: {
					value: 'userlist.topuser',
					selector: 'userlist-topuser-container',
					element: $('header[id='+selector+']')					
				}
			},
			
			playlist: {
				lastfm: {
					value: 'playlist.lastfm',
					selector: 'playlist-lastfm-container',
					element: $('article[id='+selector+']')
				},
				
				search: {
					value: 'playlist.search',
					selector: 'playlist-search-container',
					element: $('article[id='+selector+']')
				},
					
				topsongs: {
					value: 'playlist.topsongs',
					selector: 'playlist-topsongs-container',
					element: $('article[id='+selector+']')
				},
				
				user: {
					value: 'playlist.user',
					selector: 'playlist-user-container',
					element: $('article[id='+selector+']')
				}
			},
			
			getByValue: function(aValue) {
				switch(aValue) {
					case 'playlist.lastfm':
						return this.pages.playlist.lastfm;
					case 'playlist.search':
						return this.pages.playlist.search;
					case 'playlist.topsongs':
						return this.pages.playlist.topsongs;
					case 'playlist.user':
						return this.pages.playlist.topsongs;
					case 'userlist.topuser':
						return this.pages.userlist.topuser;
					case 'base':
						return this.pages.base;
					default:
						return null;
				}
			},
		}
		
	}
	
	setLoading(currentPage = null, active = false) {
		
		if(currentPage === null) {
			currentPage = this.currentPage;
		}
		
		if(currentPage === null || $(this.pages.base.element).is(currentPage.element)) {			
			$page.myVues.main.logo.$data.PAGE_LOADER = active ?
					$page.icons.loader.bigger : $page.icons.diamond.bigger;
		} else if ($(this.pages.userlist.topuser.element).is(currentPage.element)) {
            this.myVues.userlist.topuser.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.user.element).is(currentPage.element)) {
            this.myVues.playlist.user.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.lastfm.element).is(currentPage.element)) {
            this.myVues.playlist.lastfm.header.title.$data.LOADING = active;
        } else if ($(this.pages.playlist.search.element).is(currentPage.element)) {
            this.myVues.playlist.search.header.title.$data.LOADING = active;
        } else if ($(this.pages.video.youtube.element).is(currentPage.element)) {
            this.myVues.video.youtube.header.title.$data.LOADING = active;
        }
	}

	isCurrentPage(page) {
		if(page === null || page === '') return false;		
		return this.currentPage === page;
	}
	
	loadPage(page = 'video', callBack = null) {
		
		let thePage = this.pages.getByValue(page);
		if(thePage === null) return;	
		
		let lastPage = this.currentPage;
        this.setLoading(lastPage, true);
        
		switch(thePage.value) {
			case 'playlist.topsongs':
				let sortBy = $page.myVues.playlist.topsongs.menu.$data.SORTBY.SELECTED;
				$playlist.loadTopSongs(1, function(result, data){
					if(result) {						
						$page.myVues.playlist.topsongs.update(json.data.value);
					}
				});
				
				$page.load('playlist-topsongs-container' ,'topsongs', function(){	
					$page.changeUrl('Top Songs', '/#topsongs');	
					if('function' === typeof callBack) {
						callBack();
					}
				});
			break;
		}
		
		this.setLoading(lastPage);
		if(typeof callBack === 'function') {
			callBack(success);
		}
	}
}