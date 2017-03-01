document.addEventListener("DOMContentLoaded", function() {
	var url = window.location.href;
	var anchorName = window.location.hash;
	
	if(anchorName) {
		setVisiblePage(anchorName.slice(3));
	} else {
		setVisiblePage();
	}
	
	var menuBtns = document.getElementsByClassName('menu-btns');
	[].forEach.call( menuBtns, function(el) {
		el.onclick = menuBtnClickHandle;
	});
	
	
	
	var anchors = document.getElementsByClassName('scroller');
	[].forEach.call( anchors, function(el) {
		el.onclick = anchorClickHandle;
	});
});

// ANIMATE DOCUMENT SCROLL TO ANCHORS
function animate(target, time) {
	var elem = document.documentElement;
	var from = elem.scrollTop;
	var to = target.offsetTop - 90;
	
	if (!elem) {
		return;
	}
	var start = new Date().getTime(),
		timer = setInterval(function () {
			var step = Math.min(1, (new Date().getTime() - start) / time);
			
			elem["scrollTop"] = (from + step * (to - from));
			
			if (step === 1) {
				clearInterval(timer);
			}
		}, 25);
		
	elem["scrollTop"] = from;
}

function menuBtnClickHandle(e){
	//e.preventDefault();
	removeMainActiveMenu();
	this.classList.add('active');
	setVisiblePage(this.dataset.page);
}

function removeMainActiveMenu(){
	var menuBtns = document.getElementsByClassName('menu-btns');
	[].forEach.call( menuBtns, function(el) {
		el.classList.remove('active');
	});
}

function anchorClickHandle(e){
	e.preventDefault();
	var anchor = this;
	var target = document.getElementById(anchor.getAttribute('href').slice(1));
	
	animate(target, 300);
}

function setVisiblePage(pageId){
	if(typeof pageId === 'undefined'){
		pageId = 'home';	
	}
	
	document.getElementById('btn-' + pageId).classList.add('active');
	
	hideAllPages();
	
	var page = document.getElementById(pageId);
	var sidePage = document.getElementById('side-' + pageId);
	
	page.style.display = 'block';
	sidePage.style.display = 'block';
	
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}
function hideAllPages(){
	var allPages = document.getElementsByClassName('page');
	var allSidePages = document.getElementsByClassName('side-page');
	[].forEach.call( allPages, function(el) {
		el.style.display = '';
	});
	[].forEach.call( allSidePages, function(el) {
		el.style.display = '';
	});
}