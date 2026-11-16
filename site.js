(function(){
  // Always open a page at the top (or at its #section), even inside previews that keep scroll position.
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  function top(){var h=location.hash&&document.getElementById(location.hash.slice(1));if(h)h.scrollIntoView();else window.scrollTo(0,0)}
  top();window.addEventListener('load',top);window.addEventListener('pageshow',top);
  // Links to another page: reset scroll as we leave, so the next page never inherits it.
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var u=a.getAttribute('href');
    if(u.charAt(0)!=='#'&&!/^(mailto|tel):/.test(u)&&!a.target)window.scrollTo(0,0)});
})();
(function(){
  var b=document.querySelector('.burger'),n=document.getElementById('nav');
  if(b&&n)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  var boxes=document.querySelectorAll('.ck input');
  if(!boxes.length)return;
  var KEY='safarifive-checklist',st={};
  try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
  function upd(){
    var c=0;boxes.forEach(function(x){if(x.checked)c++});
    document.getElementById('ckN').textContent=c;
    document.getElementById('ckDone').hidden=c<5;
  }
  boxes.forEach(function(x){
    x.checked=!!st[x.dataset.k];
    x.addEventListener('change',function(){st[x.dataset.k]=x.checked;try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}upd()});
  });
  document.getElementById('ckPrint').addEventListener('click',function(){window.print()});
  document.getElementById('ckReset').addEventListener('click',function(){st={};boxes.forEach(function(x){x.checked=false});try{localStorage.removeItem(KEY)}catch(e){}upd()});
  upd();
})();
// center the map on the Zambia / Zimbabwe region on small screens
(function(){var m=document.querySelector('.s5map-scroll');if(m&&m.scrollWidth>m.clientWidth){m.scrollLeft=(m.scrollWidth-m.clientWidth)*0.55}})();
// "Share the app" uses the phone's own share sheet where available, otherwise copies the link
(function(){var b=document.querySelector('.share-app');if(!b)return;b.hidden=false;var u=b.dataset.url;
b.addEventListener('click',function(){var t='The Safari Five: five experiences that make a safari. Get the free app:';
 if(navigator.share){navigator.share({title:'The Safari Five app',text:t,url:u}).catch(function(){})}
 else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){b.textContent='Link copied: safarifive.com/app'})}
 else{window.prompt('Copy this link',u)}})})();

// "Share the link" on the film page: phone share sheet where available, otherwise copy the link
(function(){var b=document.querySelector('.share-film');if(!b)return;b.hidden=false;var u=b.dataset.url;
b.addEventListener('click',function(){var t='The Safari Five: the five experiences at the heart of the classic African safari.';
 if(navigator.share){navigator.share({title:'The Safari Five',text:t,url:u}).catch(function(){})}
 else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){b.textContent='Link copied'})}
 else{window.prompt('Copy this link',u)}})})();
