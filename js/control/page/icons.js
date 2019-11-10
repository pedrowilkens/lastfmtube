/*******************************************************************************
 * Created 2017,2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
/***/
class Icon {
    constructor(name) {

        this.name = name;
        this.big = this.name + ' fa-2x';
        this.bigger = this.name + ' fa-3x';

        this.animated = this.name + ' faa-flash animated';
        this.animatedBig = this.animated + ' fa-2x';
        this.animatedBigger = this.animated + ' fa-3x';
    }

    isIcon(elem, big = false) {
        return $(elem).hasClass(big ? this.big : this.name);
    }
}

class Icons {
	constructor(pageController){	
		this.pageControl = pageController;
		
        this.play = new Icon('fa-play');
        this.pause = new Icon('fa-pause');
        this.stop = new Icon('fa-stop');
        this.youtube = new Icon('fa fa-youtube');
        this.search = new Icon('fa fa-search');
        this.plus = new Icon('fa-plus');
        this.minus = new Icon('fa-minus');
        this.diamond = new Icon('fa fa-diamond');
        this.headphones = new Icon('fas fa-headphones');
        this.check = new Icon('fas fa-check');
        this.loader = new Icon('fa fa-spinner faa-spin animated');
        this.star = new Icon('fas fa-star');
        this.trophy = new Icon('fas fa-trophy');
        this.user = new Icon('fas fa-user');
        this.trash = new Icon('fas fa-trash-alt');
        this.save = new Icon('fas fa-save');
        
        this.list = [
            this.play,
            this.pause,
            this.stop,
            this.youtube,
            this.search,
            this.plus,
            this.minus,
            this.diamond,
            this.headphones,
            this.check,
            this.loader,
            this.star,
            this.trophy,
            this.user,
            this.trash,
            this.save
        ];
	}
	
	getIcon (elem, big) {
        for (let cnt = 0; cnt < this.list.length; cnt++) {
            if (this.list[cnt].isIcon(elem, big)) {
                return this.list[cnt];
            }
        }
        return null;
    }
	
	 getPageIcon(selector = null) {

		 let icon = this.diamond.big;
		 if (selector !== null) {			 
			 switch (selector) {        	
				 case this.pageControl.loader.pages.playlist.topsongs.value:
				 case this.pageControl.loader.pages.playlist.topsongs.selecor:
					 icon = this.star;
					 break;
				 case this.pageControl.loader.pages.userlist.topuser.value:
				 case this.pageControl.loader.pages.userlist.topuser.selecor:
					 icon = this.trophy;
					 break;
				 case this.pageControl.loader.pages.playlist.user.value:
				 case this.pageControl.loader.pages.playlist.user.selector:
					 icon = this.user;
					 break;
				 case this.pageControl.loader.pages.video.youtube.value:
				 case this.pageControl.loader.pages.video.youtube.selector:
					 icon = this.youtube;
					 break;
				 case this.pageControl.loader.pages.playlist.search.value:
				 case this.pageControl.loader.pages.playlist.search.selector:
					 if($page.SEARCH_RETURN_PLAYLIST !== null) {
						 icon = this.getPageIcon($page.SEARCH_RETURN_PLAYLIST);
					 } else {						 
						 icon = this.search;
					 }
					 break;
				 default:
					 console.log('selector default');
					 icon = this.headphones;
					 break;
			 }
			 
			 console.log('selector', selector, 'icon', icon, 'topsongs', this.pageControl.loader.pages.playlist.topsongs.value);
			 return icon;
		 }

    }
}