class LibvueMainpage {

    constructor(){

        this.logo = new Vue({
            el: 'header>.logo',
            data: {
                PAGE_LOADER: 'fa fa-spinner faa-spin animated fa-3x'
            }
        });

        this.content = new Vue({
            el: 'header>.content',
            data: {
                PAGE_HEADER: 'Last.fm Youtbe Radio',
                PAGE_WELCOME: 'under construction'
            }
        });

        this.menu = new Vue({
            el: 'header>nav',
            data: {
                TITLE: '',
                TEXT: '',
                MENUS: [{
                    URL: '',
                    NAME: '',
                    ARGS: '',
                    PLAYLIST: ''
                }]
            },
            methods: {
                loadMenu(menu) {
                    if (!$player.isReady) return;
                    $page.setPageLoading(true);
                    let playlist = 'default';


                    if (typeof menu.ARGS !== 'undefined' && ('PLAYLIST' in menu.ARGS)) {
                        playlist = menu.ARGS['PLAYLIST'];
                    }

                    let showPage = function (success) {
                        $page.setPageLoading();
                        if (!success) return;
                        window.location.href = menu.URL;
                    };


                    console.error('main menu load playlist: ', playlist, $page.PLAYLIST);
                    if (playlist != null) {
                        $page.setCurrentPlayList(playlist);
                        $playlist.loadPlaylistPage(1, null, showPage, playlist);
                        return;
                    }
                    showPage(true);
                }
            }
        });        
    }
    
    
    update(json) {
        
        if(!Vue.prototype.$isUndefined(json)) {
            this.content.$data.PAGE_HEADER = json.TITLE;
            this.content.$data.PAGE_WELCOME = json.TEXT;            
        }        

        if(!Vue.prototype.$isUndefined(json.MENU)) {
            this.menu.$data.MENUS = json.MENU;    
        }        
    }
}