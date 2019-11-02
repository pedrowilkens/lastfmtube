/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class HotKeys {
	
	constructor(){
		this.globalInit = false;
	}
		
	static init() {
		
		if(HotKeys.globalInit === true) return;
		
		let toggleLoading = function(loading = false) {			
    		$page.setLoading(PageController.article.user.dom(), loading);
    		$page.setLoading(PageController.article.playlist.dom(), loading);
    		$page.setLoading(PageController.article.video.dom(), loading);
		};
		
		// always use hotkeys for all elements.
		// see https://www.npmjs.com/package/hotkeys-js#filter
		hotkeys.filter = function(event){
			  return true;
		};
		
    	hotkeys('left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault();     		
    		$player.rewind();    		
    	});
    	
    	hotkeys('ctrl+left', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadPreviousSong();    		
    	});
    	
    	hotkeys('right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.fastForward();    		
    	});
    	
    	hotkeys('ctrl+right', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.loadNextSong();    		
    	});    	
    	
    	hotkeys('up', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.volumeUp();    		
    	});
    	
    	hotkeys('down', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.volumeDown();    		
    	});
    	
    	hotkeys('space', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		$player.togglePlay();    		
    	});

    	hotkeys('ctrl+1', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault();    		

    		toggleLoading(true);    		
    		$page.loadPage('video', function(){
    			toggleLoading();
    		});
    	});
    	
    	hotkeys('ctrl+2', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 

    		toggleLoading(true);
    		$page.loadPage('lastfm', function(){
    			toggleLoading();
    		});
    	});
    	
    	hotkeys('ctrl+3', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		
    		toggleLoading(true);
    		$page.loadPage('personal', function(){
    			toggleLoading();
    		});    		
    	});
    	
    	hotkeys('ctrl+4', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 
    		
    		toggleLoading(true);
    		$page.loadPage('topsongs', function(){
    			toggleLoading();
    		});    		
    	});
    	
    	hotkeys('ctrl+5', function(event, handler){
    		// Prevent the default refresh event under WINDOWS system
    		event.preventDefault(); 

    		toggleLoading(true);
    		$page.loadPage('users', function(){
    			toggleLoading();
    		});    		
    	});
    	
    	/**
		 * TODO: add hotkeys for search, and find out how to override youtube
		 * iframe key capturing
		 */
    	
		HotKeys.globalInit = true;
	}
}