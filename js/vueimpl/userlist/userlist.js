/*******************************************************************************
 * Created 2017, 2018 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class LibvueUser {

    constructor(elementId) {
    	
    	this.elementId = elementId;
    	
        this.header = {
            title: new Vue({
                el: '#'+elementId+'>.page-header-title>h2',
                data: {
                    HEADER: '',
                    TEXT: '',
                    TYPE: '',
                    LOADING: false
                },
                
                computed: {
                    LOGO: function () {
                        let icon = $page.icons.getPlaylistIcon(this.$data.TYPE);
                        return this.$data.LOADING ? icon.animatedBig : icon.big;
                    }
                },
                
                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.$applyData(json.HEADER);
                        }
                    }
                }
            }),

            menu: new Vue({
                el: '#'+elementId+'>.page-header-nav',
                data: {
                    TYPE: ''
                },
                computed: {
                    MENUS: function () {
                        return $page.menu.getMenu(this.TYPE);
                    }
                },

                methods: {
                    update: function (json) {
                        if (typeof json.HEADER !== 'undefined') {
                            this.TYPE = json.HEADER.TYPE;
                        }
                    }
                }
            })
        };


        this.content = new Vue({
            el: '#'+elementId+'>.page-content',
            data: {
                USER_NR: 'Nr',
                USER_NAME: 'Name',
                USER_PLAYCOUNT: 'Played',
                USER_LASTPLAY: 'Last Played',

                USER: [{
                    NR: '',
                    NAME: '',
                    LASTPLAY: '',
                    PLAYCOUNT: '',
                    PLAY_CONTROL: '',
                    PLAYCOUNT_CHANGE: ''
                }]
            },

            methods: {
                update: function (json) {
                    if (typeof json.LIST_HEADER !== 'undefined') {
                        this.$applyData(json.LIST_HEADER);
                    }
                    if (typeof json.USER !== 'undefined') {
                        this.$applyData(json);
                    }
                },

                loadUser: function (user) {
                    if (user.PLAY_CONTROL !== 'play') return;

                    let openurl = function (success) {
                        if (success) {
                            let article = $('article[name=playlist-container]');
                            $page.setCurrentPlaylist('lastfm');
                            user.PLAY_CONTROL = '';
                            $page.myVues.userlist.header.title.$data.LOADING = false;
                            location.replace('#' + $(article).attr('id'));
                            return;
                        }
                        user.PLAY_CONTROL = '';
                        $page.myVues.userlist.header.title.$data.LOADING = false;
                        
                    };
                    
                    user.PLAY_CONTROL = 'loading';
                    $page.myVues.userlist.header.title.$data.LOADING = true;
                    $page.loadList(1, user.NAME, openurl, 'lastfm');
                }
            }
        });
    }


    update(json) {
        this.content.update(json);
        this.header.title.update(json);
        this.header.menu.update(json);
    }
}
