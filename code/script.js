var css = '\
html, body {\
	padding: 0;\
	margin: 0;\
	overflow: hidden;\
	-webkit-user-select: none;\
}\
body {\
	width : 200px;\
	padding: 3px;\
	display : -webkit-box;\
	background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#eee));\
}\
#left {\
	-webkit-box-flex: 1;\
	overflow: hidden;\
	margin-right: 3px;\
}\
#right {\
	overflow: hidden;\
	width: 32px;\
}\
a {\
	display: block;\
	float: left;\
	padding: 4px;\
	margin: 4px;\
	border-radius: 3px;\
	-webkit-box-shadow: 1px 1px 5px #666;\
	background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#eee));\
}\
a:hover {\
	background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#eee), to(#ddd));\
}\
img {\
	width: 16px;\
	height: 16px;\
	display: block;\
}\
';

window.addEventListener("load", function(){
	var style = document.createElement("style");
	style.innerHTML = css;
	document.head.appendChild(style);
	
	var left = document.createElement("div");
	left.id = "left";
	document.body.appendChild(left);
	
	var right = document.createElement("div");
	right.id = "right";
	document.body.appendChild(right);
	
	(function(){
		right.appendChild(hoge("chrome-extension://eemcgdkfndhakfknompkggombfjjjeno/main.html", "Bookmarks"));
		right.appendChild(hoge("chrome://history/", "History"));
		right.appendChild(hoge("chrome://downloads/", "Downloads"));
		right.appendChild(hoge("chrome://extensions/", "Extensions"));
	})();
	
	chrome.bookmarks.getTree(function(tree){
		tree[0].children[0].children.forEach(function(val){
			if("url" in val){
				left.appendChild(hoge(val.url, val.title));
			}
		});
	});
	
	document.body.addEventListener("click", function(e){
		if(e.target.webkitMatchesSelector("a")){
			var url = e.target.href;
		}
		else if(e.target.webkitMatchesSelector("a > img")){
			var url = e.target.parentNode.href;
		}
		else{
			return;
		}
		e.preventDefault();
		
		var cb = function(){
			close();
		};
		chrome.windows.getCurrent(function(window){
			chrome.tabs.getSelected(window.id, function(tab){
				if(e.which === 1 && !e.shiftKey && !e.ctrlKey){
					chrome.tabs.update(tab.id, {url : url}, cb);
				}
				else if(
					(e.which === 1 && e.ctrlKey) ||
					(e.which === 2)
				){
					chrome.tabs.create({
						url : url,
						index : tab.index + 1,
						//selected : e.shiftKey
						selected : true
					}, cb);
				}
				else if(e.which === 1 && e.shiftKey && !e.ctrlKey){
					chrome.windows.create({url : url}, cb);
				}
			});
		});
	}, false);
}, false);

function hoge(url, title){
	var img = document.createElement("img");
	img.src = "chrome://favicon/" + url;
	var a = document.createElement("a");
	a.href = url;
	a.title = title;
	a.appendChild(img);
	return a;
}
