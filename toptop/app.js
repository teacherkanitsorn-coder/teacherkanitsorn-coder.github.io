// TopTop — photos that live on hearts. 10,000 hearts = +1 hour. New photo = 1 hour. Music by the admin DJ.
const API=window.TT_API||"",$=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[<>"'&]/g,c=>"&"+"#"+c.charCodeAt(0)+";");
const ls={get:(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch(e){return d}},set:(k,v)=>localStorage[k]=JSON.stringify(v)};
const HOUR=3600e3,MSH=HOUR/10000;
const P={home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',rank:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',plus:'<path d="M12 5v14M5 12h14"/>',
chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',heart:'<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.3 5c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2C17 5 18.7 8.4 17.2 11.4 15 15.6 12 20 12 20z" transform="translate(1 0)"/>',
share:'<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/>',clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
vol:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9zM22 9l-6 6M16 9l6 6"/>',play:'<path d="M7 4v16l13-8z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/>',
cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',back:'<path d="M15 5l-7 7 7 7"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',ban:'<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>',music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'};
const I=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24">${P[n]}</svg>`;
let tok=ls.get("tt_tok",null),me=null,F=[],cur=null,sortBy=ls.get("tt_sort","time"),NOW_OFF=0,tab="home";
const now=()=>Date.now()+NOW_OFF;
const nf=n=>(n=+n||0)>=1e6?(n/1e6).toFixed(1)+"M":n>=1e4?(n/1e3).toFixed(1)+"K":n.toLocaleString("en-US");
const media=fid=>fid?API+"/media/"+fid:"";
const avHtml=(u,cls="av")=>u?.avatar?`<div class="${cls}" style="background:center/cover url('${media(u.avatar)}')"></div>`:`<div class="${cls}">${esc((u?.name||"?")[0])}</div>`;
function left(ms){ms=Math.max(0,ms);const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(x).padStart(2,"0")}
function dur(ms){const m=Math.round(ms/6e4);return m>=60?Math.floor(m/60)+" ชม. "+(m%60)+" นาที":m+" นาที"}
function toast(t){const x=$("#toast")||Object.assign(document.createElement("div"),{id:"toast",className:"glass"});document.body.appendChild(x);x.textContent=t;x.style.display="block";clearTimeout(x._t);x._t=setTimeout(()=>x.style.display="none",2200)}
async function api(p,o={}){const r=await fetch(API+p,{...o,headers:{"content-type":"application/json",...(tok?{authorization:"Bearer "+tok}:{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||"ผิดพลาด");if(j.now)NOW_OFF=j.now-Date.now();return j}
// ---------- ambient color from a photo (tiny thumb, same-origin data URL => readable) ----------
function ambient(src,cb){if(!src)return;const im=new Image();im.onload=()=>{try{const c=document.createElement("canvas");c.width=c.height=8;const g=c.getContext("2d");g.drawImage(im,0,0,8,8);const d=g.getImageData(0,0,8,8).data;
 const pick=(x0,y0)=>{let r=0,gg=0,b=0,n=0;for(let y=y0;y<y0+4;y++)for(let x=x0;x<x0+8;x++){const i=(y*8+x)*4;r+=d[i];gg+=d[i+1];b+=d[i+2];n++}const k=Math.max(r,gg,b)/n||1,s=200/k;return `rgb(${Math.min(255,r/n*s)|0},${Math.min(255,gg/n*s)|0},${Math.min(255,b/n*s)|0})`};
 cb(pick(0,0),pick(0,4))}catch(e){}};im.src=src}
function setAmb(a,b){const r=document.documentElement.style;r.setProperty("--a1",a);r.setProperty("--a2",b)}
// ---------- feed ----------
// order: top 8 live photos by hearts first, then the rest shuffled with a per-session seed (stable within a session, no repeats)
const SEED=sessionStorage.tt_seed||(sessionStorage.tt_seed=Math.random().toString(36).slice(2));
const hsh=s=>{let h=2166136261;for(const c of s+SEED)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
async function loadFeed(){try{const j=await api("/photos");const L=j.photos.filter(x=>x.expires>now()),top=[...L].sort((a,b)=>b.hearts-a.hearts||b.expires-a.expires).slice(0,8),ids=new Set(top.map(x=>x.id));
 F=top.concat(L.filter(x=>!ids.has(x.id)).sort((a,b)=>hsh(a.id)-hsh(b.id)))}catch(e){F=[]}}
function postEl(x,i){const d=document.createElement("section");d.className="post";d.dataset.i=i;d.dataset.id=x.id;const src=media(x.fid);
 d.innerHTML=`<div class="glow" style="background-image:url('${x.thumb||src}')"></div><div class="ph"><img src="${src}" ${i>1?'loading="lazy"':""} decoding="async" alt=""></div><div class="tap"></div>
 <div class="timer glass">${I("clock")}<span class="tl">--:--</span><small>เหลือ</small></div>
 <div class="side"><button class="avb">${avHtml({name:x.name,avatar:x.avatar})}</button><button class="sp"><div class="bub">${I("heart","f")}</div><b class="nh">${nf(x.hearts)}</b>หัวใจ</button>
 <button class="cmb"><div class="bub glass">${I("chat")}</div><b>${nf(x.cm)}</b>ความเห็น</button><button class="shb"><div class="bub glass">${I("share")}</div><b></b>ขอหัวใจ</button></div>
 <div class="meta"><div class="nm">@${esc(x.name)}</div>${x.caption?`<div class="cap">${esc(x.caption)}</div>`:""}<div class="gain">อายุรวม ${dur(Math.min(x.expires,now())-x.created)} · 10,000 หัวใจ = +1 ชม.</div></div>`;
 ambient(x.thumb,(a,b)=>d.querySelector(".ph img").style.setProperty("--pc",a.replace("rgb","rgba").replace(")",",.55)")));
 const tp=d.querySelector(".tap");let pd=null;tp.addEventListener("pointerdown",e=>pd={x:e.clientX,y:e.clientY,t:Date.now()});tp.addEventListener("pointerup",e=>{if(pd&&Math.hypot(e.clientX-pd.x,e.clientY-pd.y)<12&&Date.now()-pd.t<500)heart(d,x,e);pd=null});
 tp.addEventListener("dblclick",e=>e.preventDefault());
 const sp=d.querySelector(".sp");sp.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();const r=sp.getBoundingClientRect();heart(d,x,{clientX:r.left+r.width/2-40+Math.random()*30,clientY:r.top})},{passive:false});sp.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});
 d.querySelector(".cmb").onclick=()=>openCm(x);d.querySelector(".shb").onclick=()=>share(x);d.querySelector(".avb").onclick=()=>userPage(x.uid);d.querySelector(".nm").onclick=()=>userPage(x.uid);
 return d}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.6){const x=F[e.target.dataset.i];if(x){cur={x,d:e.target};ambient(x.thumb,setAmb);tick()}}}),{threshold:[.6]});
function buildFeed(focus){const f=$("#feed");f.innerHTML="";cur=null;
 if(!F.length){f.innerHTML=`<div class="empty"><img src="https://youmuan-api.nickvideo.workers.dev/icons/logo-splash.png" width="168" style="filter:drop-shadow(0 12px 40px rgba(255,47,179,.45))" alt=""><h2>ยังไม่มีรูปที่ยังมีชีวิต</h2><p>โพสต์รูปแรกเลย ได้เวลาฟรี 1 ชั่วโมง<br>ให้เพื่อนกดหัวใจต่อชีวิต!</p><button class="btn" onclick="composer()">+ โพสต์รูป</button></div>`;return}
 F.forEach((x,i)=>{const d=postEl(x,i);f.appendChild(d);io.observe(d)});const k=focus?F.findIndex(x=>x.id==focus):-1;if(k>0)f.children[k].scrollIntoView();tick()}
function tick(){const t=now();document.querySelectorAll(".post").forEach(d=>{const x=F[d.dataset.i];if(!x)return;const ms=x.expires-t;d.querySelector(".tl").textContent=ms>0?left(ms):"หมดเวลา";
 d.classList.toggle("urgent",ms>0&&ms<10*6e4);d.classList.toggle("dead",ms<=0);d.querySelector(".nh").textContent=nf(x.hearts)})}
setInterval(tick,1000);
// expired photos leave the feed (owner keeps them in profile)
setInterval(()=>{if(tab!="home")return;const dead=F.filter(x=>x.expires<=now());if(dead.length&&(!cur||cur.x.expires<=now()-4000)){loadFeed().then(()=>buildFeed(cur?.x?.expires>now()?cur.x.id:null))}},5000);
// ---------- hearts: optimistic, batched, server clamps + rate limits ----------
const HQ={};function hq(id,n,k){const q=HQ[id]||(HQ[id]={n:0,k:0});q.n+=n;q.k+=k}
async function flushHearts(){for(const [pid,q] of Object.entries(HQ)){delete HQ[pid];if(!q.n&&!q.k)continue;try{const r=await api("/hearts",{method:"POST",body:JSON.stringify({pid,n:q.n,k:q.k})});const x=F.find(y=>y.id==pid);
  if(x&&r.expires){x.hearts=r.hearts;x.expires=r.expires}if(r.limited)toast("กดเร็วเกินไป พักหายใจแป๊บ ❤️");if(r.expired)toast("รูปนี้หมดเวลาแล้ว")}catch(e){if(/เข้าสู่ระบบ/.test(e.message))go("me")}}}
setInterval(flushHearts,1200);addEventListener("pagehide",flushHearts);
const CB={pid:null,streak:0,until:0,combo:0,timer:null};
let pinT=null;function pinFeed(){const f=$("#feed");if(!cur)return;const top=cur.d.offsetTop;f.style.overflowY="hidden";if(Math.abs(f.scrollTop-top)>1)f.scrollTop=top;clearTimeout(pinT);pinT=setTimeout(()=>{f.style.overflowY="";if(cur&&Math.abs(f.scrollTop-cur.d.offsetTop)>1)f.scrollTop=cur.d.offsetTop},600)}
function heart(d,x,e){if(!tok){toast("สมัครฟรีก่อน แล้วกดหัวใจได้ไม่จำกัด");return go("me")}if(x.expires<=now())return toast("รูปนี้หมดเวลาแล้ว");pinFeed();
 if(CB.pid!=x.id){endBoost();CB.pid=x.id;CB.streak=0}const boost=Date.now()<CB.until,add=boost?100:1;
 tapFX(e.clientX,e.clientY,add,boost);const sp=d.querySelector(".sp");sp.classList.remove("pop");void sp.offsetWidth;sp.classList.add("pop");hint(boost);
 x.hearts+=add;x.expires+=add*MSH;if(boost){hq(x.id,0,1);CB.combo++;$("#cbn").textContent="x"+CB.combo+"  +"+nf(CB.combo*100)}else{hq(x.id,1,0);if(++CB.streak>=100)startBoost()}tick()}
let hintT=null;function hint(boost){let h=$("#cbh");if(!h){h=document.createElement("div");h.id="cbh";h.className="glass";document.body.appendChild(h)}
 if(boost){h.style.display="none";return}h.innerHTML=`กดครบ 100 ครั้ง เข้าโหมดใจเดือด 🔥 <b>${Math.min(CB.streak+1,100)}/100</b><i style="width:${Math.min(CB.streak+1,100)}%"></i>`;h.style.display="block";clearTimeout(hintT);hintT=setTimeout(()=>h.style.display="none",1500)}
const FX={c:null,x:null,p:[],t:[],r:[],run:false,last:0,combo:0,lastTap:0,MAX:450};
function fxInit(){if(FX.c)return;const c=FX.c=document.createElement("canvas");c.id="fx";document.body.appendChild(c);FX.x=c.getContext("2d");
 const rs=()=>{const dpr=Math.min(devicePixelRatio||1,2);c.width=innerWidth*dpr;c.height=innerHeight*dpr;FX.x.setTransform(dpr,0,0,dpr,0,0)};rs();addEventListener("resize",rs)}
function spawn(x,y,n,spd,big){for(let i=0;i<n&&FX.p.length<FX.MAX;i++){const a=Math.random()*Math.PI*2,s=spd*(.35+Math.random()*.9);
 FX.p.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-spd*.35,life:0,max:.55+Math.random()*.55,size:(big?9:5)+Math.random()*(big?12:7),heart:Math.random()<.55,rot:Math.random()*6,vr:(Math.random()-.5)*10})}}
function popText(x,y,s,size,dur=.8,center=false){FX.t.push({x,y,s,size,life:0,max:dur,center});if(FX.t.length>24)FX.t.shift()}
function heartPath(g,s){g.beginPath();g.moveTo(0,s*.35);g.bezierCurveTo(-s*1.1,-s*.35,-s*.45,-s*1.05,0,-s*.45);g.bezierCurveTo(s*.45,-s*1.05,s*1.1,-s*.35,0,s*.35);g.fill()}
function fxLoop(ts){const g=FX.x,dt=Math.min(.05,(ts-(FX.last||ts))/1000);FX.last=ts;g.clearRect(0,0,innerWidth,innerHeight);
 for(let i=FX.p.length-1;i>=0;i--){const p=FX.p[i];p.life+=dt;if(p.life>=p.max){FX.p.splice(i,1);continue}p.vy+=1100*dt;p.vx*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
  const k=1-p.life/p.max;g.globalAlpha=k;g.fillStyle="#fff";g.strokeStyle="#fff";
  if(p.heart){g.save();g.translate(p.x,p.y);g.rotate(p.rot*.2);heartPath(g,p.size*(.6+.4*k));g.restore()}
  else{g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);g.stroke()}}
 for(let i=FX.r.length-1;i>=0;i--){const r=FX.r[i];r.life+=dt;if(r.life>=r.max){FX.r.splice(i,1);continue}const k=r.life/r.max;
  g.globalAlpha=(1-k)*.9;g.strokeStyle="#fff";g.lineWidth=r.w*(1-k)+1;g.beginPath();g.arc(r.x,r.y,r.R*(1-Math.pow(1-k,3)),0,Math.PI*2);g.stroke()}
 g.textAlign="center";g.textBaseline="middle";
 for(let i=FX.t.length-1;i>=0;i--){const t=FX.t[i];t.life+=dt;if(t.life>=t.max){FX.t.splice(i,1);continue}const k=t.life/t.max,sc=k<.15?.6+k/.15*.6:1.2-(k-.15)*.3;
  g.globalAlpha=1-Math.max(0,(k-.55)/.45);g.font=`700 ${Math.round(t.size*sc)}px Inter,Kanit`;g.fillStyle="#fff";g.shadowColor="rgba(255,255,255,.6)";g.shadowBlur=t.center?18:6;
  g.fillText(t.s,t.x,t.center?t.y:t.y-k*90);g.shadowBlur=0}
 g.globalAlpha=1;if(FX.p.length||FX.t.length||FX.r.length)requestAnimationFrame(fxLoop);else{FX.run=false;FX.last=0}}
function fxKick(){if(!FX.run){FX.run=true;requestAnimationFrame(fxLoop)}}
const TIERS_FX=[[100,"x100 ตำนาน!"],[50,"x50!"],[25,"x25 COMBO!"],[10,"x10 COMBO!"]];
function tapFX(x,y,add,boost){fxInit();const t=performance.now();FX.combo=t-FX.lastTap<700?FX.combo+1:1;FX.lastTap=t;const c=FX.combo;
 spawn(x,y,boost?34:c>=50?22:c>=25?16:c>=10?12:8,boost?900:c>=25?650:480,boost||c>=50);popText(x,y-30,"+"+add,boost?44:c>=25?30:c>=10?26:22);
 if(boost)FX.r.push({x,y,R:110,w:6,life:0,max:.45});const tier=TIERS_FX.find(q=>c==q[0]);if(tier){popText(innerWidth/2,innerHeight*.32,tier[1],tier[0]>=50?52:40,1.1,true);FX.r.push({x:innerWidth/2,y:innerHeight*.32,R:180,w:4,life:0,max:.6})}
 if((c>=10&&c%5==0)||boost)shake(boost?7:3);navigator.vibrate&&navigator.vibrate(boost?20:10);fxKick()}
function shake(px){const m=cur?.d.querySelector(".ph");if(!m)return;m.style.setProperty("--sh",px+"px");m.classList.remove("shake");void m.offsetWidth;m.classList.add("shake")}
function startBoost(){fxInit();for(let i=0;i<8;i++)spawn(Math.random()*innerWidth,Math.random()*innerHeight*.8,18,900,true);FX.r.push({x:innerWidth/2,y:innerHeight/2,R:Math.max(innerWidth,innerHeight)*.75,w:10,life:0,max:.8});
 popText(innerWidth/2,innerHeight*.45,"ใจเดือด!",56,1.2,true);shake(10);navigator.vibrate&&navigator.vibrate([30,40,30]);fxKick();document.body.classList.add("glow");
 $("#cbh")&&($("#cbh").style.display="none");CB.until=Date.now()+10000;CB.combo=0;let o=$("#cbo");if(!o){o=document.createElement("div");o.id="cbo";document.body.appendChild(o)}
 o.innerHTML=`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="trk"/><circle cx="50" cy="50" r="44" class="rng" id="cbr"/></svg><b id="cbs">10</b><div class="cbt">ใจเดือด!</div><div id="cbn">x0</div>`;o.style.display="flex";
 requestAnimationFrame(()=>{$("#cbr").style.transition="stroke-dashoffset 10s linear";$("#cbr").style.strokeDashoffset="276.5"});
 clearInterval(CB.timer);CB.timer=setInterval(()=>{const s=Math.ceil((CB.until-Date.now())/1000);if(s<=0)return endBoost();$("#cbs").textContent=s},200);toast("ใจเดือด! 10 วินาที กดละ +100 หัวใจ")}
function endBoost(){document.body.classList.remove("glow");clearInterval(CB.timer);CB.until=0;CB.streak=0;const o=$("#cbo");if(o)o.style.display="none"}
// ---------- share: ask friends for hearts ----------
function share(x){const u=location.origin+location.pathname+"#p="+x.id,t=`ช่วยกดหัวใจให้รูปของ ${x.name} บน TopTop หน่อย! เหลือเวลาอีก ${left(x.expires-now())} ทุก 10,000 หัวใจ = +1 ชั่วโมง`;
 if(navigator.share)navigator.share({title:"TopTop",text:t,url:u}).catch(()=>{});else{navigator.clipboard?.writeText(t+" "+u);toast("คัดลอกลิงก์แล้ว ส่งให้เพื่อนเลย")}}
// ---------- comments ----------
let cmX=null;async function openCm(x){cmX=x;const s=$("#sheet");s.className="glass on";
 s.innerHTML=`<div class="hd"><b>ความเห็น</b><button onclick="closeSheet()">${I("x")}</button></div><div class="bd" id="cml"><p class="m">กำลังโหลด...</p></div><form onsubmit="event.preventDefault();sendCm()"><input id="cmi" maxlength="300" placeholder="${tok?"เขียนความเห็น...":"เข้าสู่ระบบเพื่อแสดงความเห็น"}"><button class="btn">${I("send")}</button></form>`;
 const l=await api("/comments?pid="+x.id).catch(()=>[]);$("#cml").innerHTML=l.map(c=>`<div class="cm"><b>${esc(c.name)}</b> ${esc(c.text)}${me?.role=="admin"?` <a class="m" onclick="delCm(${c.id})">ลบ</a>`:""}</div>`).join("")||'<p class="m">ยังไม่มีความเห็น เป็นคนแรกเลย</p>'}
async function sendCm(){if(!tok){closeSheet();return go("me")}const t=$("#cmi").value.trim();if(!t)return;try{await api("/comments",{method:"POST",body:JSON.stringify({pid:cmX.id,text:t})});cmX.cm=(cmX.cm||0)+1;openCm(cmX)}catch(e){toast(e.message)}}
async function delCm(id){await api("/admin/comment",{method:"DELETE",body:JSON.stringify({id})}).catch(()=>{});openCm(cmX)}
function closeSheet(){$("#sheet").className="glass";clearInterval(chatT)}
// ---------- music: admin DJ playlist, audio-only hidden YouTube player, loops in order ----------
let PLS=[],PLI=ls.get("tt_pli",0),YTP=null,musicMuted=ls.get("tt_mute",false),started=sessionStorage.tt_started=="1";
const ytc=(fn,args=[])=>YTP?.contentWindow?.postMessage(JSON.stringify({event:"command",func:fn,args}),"*");
async function music(){PLS=await api("/playlist").catch(()=>[]);if(!PLS.length){$("#np").className="";if(YTP){ytc("stopVideo")}return}PLI=PLI%PLS.length;
 if(!YTP){const w=document.createElement("div");w.style.cssText="position:fixed;left:-2px;bottom:0;width:2px;height:2px;overflow:hidden;opacity:.01;pointer-events:none;z-index:-1";
  const f=document.createElement("iframe");f.allow="autoplay;encrypted-media";f.setAttribute("playsinline","");f.width=200;f.height=200;
  f.src=`https://www.youtube.com/embed/${PLS[PLI].yid}?autoplay=1&mute=1&playsinline=1&controls=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
  f.onload=()=>{f.contentWindow.postMessage('{"event":"listening","id":1}',"*");ytc("playVideo");if(started&&!musicMuted)setTimeout(()=>ytc("unMute"),150)};w.appendChild(f);document.body.appendChild(w);YTP=f}
 paintNp()}
function nextSong(){if(!PLS.length)return;PLI=(PLI+1)%PLS.length;ls.set("tt_pli",PLI);if(PLS.length==1)ytc("seekTo",[0,true]);else ytc("loadVideoById",[{videoId:PLS[PLI].yid,startSeconds:0}]);ytc("playVideo");if(started&&!musicMuted)ytc("unMute");paintNp()}
addEventListener("message",e=>{if(!/youtube/.test(e.origin)||!YTP||e.source!==YTP.contentWindow)return;try{const j=JSON.parse(e.data),s=j.info?.playerState;if(s===0)nextSong();if(s===-1||s===5)ytc("playVideo")}catch(x){}});
function paintNp(){const n=$("#np");if(!PLS.length){n.className="";return}const s=PLS[PLI];n.className="glass on"+(musicMuted||!started?" mute":"");
 n.innerHTML=`<div class="eq"><b></b><b></b><b></b></div><span class="t">${esc(s.title)}</span><button aria-label="เสียง">${I(musicMuted||!started?"mute":"vol")}</button>`;n.querySelector("button").onclick=e=>{e.stopPropagation();setMusicMute(started?!musicMuted:false)}}
function setMusicMute(m){musicMuted=m;ls.set("tt_mute",m);markStarted();ytc(m?"mute":"unMute");ytc("playVideo");paintNp()}
function markStarted(){started=true;sessionStorage.tt_started="1";$("#tts")?.remove()}
function tapToStart(){if(started||$("#tts")||!PLS.length)return;const t=document.createElement("div");t.id="tts";t.innerHTML=`<img src="https://youmuan-api.nickvideo.workers.dev/icons/logo-splash.png" width="180" style="filter:drop-shadow(0 16px 50px rgba(255,47,179,.5))" alt=""><div class="pl">${I("play","f")}</div><b>แตะเพื่อเริ่ม</b><span>พร้อมเพลงประกอบ</span>`;
 t.onclick=()=>{markStarted();musicMuted=false;ls.set("tt_mute",false);ytc("unMute");ytc("playVideo");paintNp()};document.body.appendChild(t)}
// ---------- photo pipeline: compress on phone (<=1080px JPEG ~200-400KB) -> Drive bridge ----------
async function loadBitmap(file){try{return await createImageBitmap(file,{imageOrientation:"from-image"})}catch(e){return await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>no(new Error("เปิดรูปไม่ได้"));im.src=URL.createObjectURL(file)})}}
const toBlob=(c,q)=>new Promise(ok=>c.toBlob(ok,"image/jpeg",q));
async function compressImage(file,max=1080,target=380e3,square=false){const bm=await loadBitmap(file);let sw=bm.width,sh=bm.height,sx=0,sy=0;
 if(square){const s=Math.min(sw,sh);sx=(sw-s)/2;sy=(sh-s)/2;sw=sh=s}const k=Math.min(1,max/Math.max(sw,sh)),W=Math.round(sw*k),H=Math.round(sh*k);
 const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(bm,sx,sy,sw,sh,0,0,W,H);
 let q=.82,b=await toBlob(c,q);while(b.size>target&&q>.45){q-=.08;b=await toBlob(c,q)}
 const t=document.createElement("canvas"),tk=48/Math.max(W,H);t.width=Math.max(1,Math.round(W*tk));t.height=Math.max(1,Math.round(H*tk));t.getContext("2d").drawImage(c,0,0,t.width,t.height);
 return {blob:new File([b],"photo.jpg",{type:"image/jpeg"}),w:W,h:H,thumb:t.toDataURL("image/jpeg",.6)}}
async function driveSend(f,onp){const g=await api("/photo/ticket",{method:"POST",body:"{}"});
 const post=b=>fetch(g.bridge,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...b,ticket:g.ticket})}).then(r=>r.json()).then(j=>{if(j.error)throw new Error(j.error=="ticket"?"ระบบอัปโหลดยังไม่อัปเดต (ติดต่อแอดมิน)":j.error);return j});
 const ini=await post({action:"init",name:f.name,size:f.size,mime:f.type});
 const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("PUT",ini.uploadUrl);x.setRequestHeader("Content-Type",f.type);x.upload.onprogress=e=>e.lengthComputable&&onp(e.loaded/e.total);x.onload=()=>{try{const j=JSON.parse(x.responseText);x.status<300?ok(j):no(new Error(j.error?.message||"อัปโหลดไม่สำเร็จ"))}catch(e){no(e)}};x.onerror=()=>no(new Error("เครือข่ายขัดข้อง"));x.send(f)});
 const fin=await post({action:"finish",id:r.id});return {...fin,uid:g.ticket.uid}}
function composer(){if(!tok){toast("สมัครฟรีก่อน แล้วโพสต์ได้เลย");return go("me")}const s=$("#sheet");s.className="glass on full";let pk=null;
 s.innerHTML=`<div class="hd"><b>โพสต์รูป</b><button onclick="closeSheet()">${I("x")}</button></div><div class="bd">
  <label class="pick" for="cf" id="cpv">${I("cam")}<b>เลือกรูปจากเครื่อง</b><span class="m">รูปตัวเองหรืออะไรก็ได้ · เริ่มต้นมีชีวิต 1 ชั่วโมง</span></label><input id="cf" type="file" accept="image/*" hidden>
  <input id="ccap" maxlength="150" placeholder="แคปชั่น (ไม่บังคับ)"><div class="prog" id="cbar" style="display:none"><i></i></div><div class="m" id="cst"></div>
  <button class="btn w" id="cgo">โพสต์เลย</button></div>`;
 $("#cf").onchange=e=>{pk=e.target.files[0];if(pk)$("#cpv").innerHTML=`<img src="${URL.createObjectURL(pk)}" alt=""><span class="chg">แตะเพื่อเปลี่ยนรูป</span>`};
 $("#cgo").onclick=async()=>{const st=$("#cst"),bar=$("#cbar");if(!pk)return st.textContent="เลือกรูปก่อนนะ";const btn=$("#cgo");btn.disabled=true;bar.style.display="block";
  const prog=(l,q)=>{bar.firstChild.style.width=Math.round(q)+"%";st.textContent=l+" "+Math.round(q)+"%"};
  try{prog("กำลังเตรียมรูป",5);const c=await compressImage(pk);prog("กำลังอัปโหลด",20);const d=await driveSend(c.blob,q=>prog("กำลังอัปโหลด",20+q*75));
   const r=await api("/photos",{method:"POST",body:JSON.stringify({drive:d,caption:$("#ccap").value,thumb:c.thumb,w:c.w,h:c.h})});prog("โพสต์แล้ว",100);st.textContent=`โพสต์แล้ว ✓ (${Math.round(c.blob.size/1024)} KB) มีชีวิต 1 ชั่วโมง`;
   setTimeout(async()=>{closeSheet();await loadFeed();go("home");buildFeed(r.id)},700)}catch(e){st.textContent="ผิดพลาด: "+e.message;bar.style.display="none"}finally{btn.disabled=false}}}
function pickAvatar(){const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=async()=>{const f=i.files[0];if(!f)return;toast("กำลังอัปโหลดรูปโปรไฟล์...");
 try{const c=await compressImage(f,512,120e3,true);const d=await driveSend(c.blob,()=>{});const r=await api("/avatar",{method:"POST",body:JSON.stringify({drive:d})});me.avatar=r.avatar;toast("เปลี่ยนรูปโปรไฟล์แล้ว");mePage()}catch(e){toast("ผิดพลาด: "+e.message)}};i.click()}
// ---------- อันดับ: most time left (live) + Hall of fame (longest-lived) ----------
let rankTab="live";const prow=(x,i,lab)=>`<a class="row" onclick="openPhoto('${x.id}',${x.expires>now()})"><div class="rk${i==0?" c1":""}">${i+1}</div><img src="${x.thumb||media(x.fid)}" alt=""><div class="t"><div>${esc(x.caption||"รูปของ "+x.name)}</div><div class="m">@${esc(x.name)} · ${lab}</div></div></a>`;
async function rank(){const p=$("#p-rank");p.innerHTML=`<h2>อันดับ</h2><div class="chips"><span class="chip ${rankTab=="live"?"on":""}" onclick="rankTab='live';rank()">เวลาเหลือมากสุด</span><span class="chip ${rankTab=="hall"?"on":""}" onclick="rankTab='hall';rank()">Hall of Fame</span></div><p class="m">กำลังโหลด...</p>`;
 const j=await api(rankTab=="live"?"/top":"/hall").catch(()=>({photos:[]}));
 p.innerHTML=p.innerHTML.replace('<p class="m">กำลังโหลด...</p>',"")+(rankTab=="live"?'<p class="m">รูปที่ยังมีชีวิต เรียงตามเวลาที่เหลือ</p>':'<p class="m">รูปที่มีชีวิตยาวนานที่สุดตลอดกาล</p>')+
  (j.photos.map((x,i)=>prow(x,i,rankTab=="live"?"เหลือ "+left(x.expires-now())+" · "+nf(x.hearts)+" หัวใจ":"อยู่มา "+dur(Math.min(x.expires,now())-x.created)+(x.expires>now()?" · ยังมีชีวิต":" · หมดเวลา"))).join("")||'<div class="card glass">ยังไม่มีรูป</div>')}
async function openPhoto(id,live){$("#ov").style.display="none";if(live){if(!F.find(x=>x.id==id))await loadFeed();go("home");buildFeed(id)}else{const j=await api("/photo/"+id).catch(()=>null);if(!j)return;
 const x=j.photo;modal(`<div style="text-align:center"><img src="${media(x.fid)}" style="max-width:100%;max-height:60dvh;border-radius:20px" alt=""><h3>รูปของ ${esc(x.name)} · หมดเวลาแล้ว</h3><p class="m">อยู่มา ${dur(x.expires-x.created)} · ${nf(x.hearts)} หัวใจ</p></div>`)}}
function modal(h){const m=$("#modal");m.innerHTML=`<div style="display:flex;justify-content:flex-end"><button class="x" onclick="$('#modal').style.display='none'">${I("x")}</button></div>`+h;m.style.display="block"}
// ---------- profile / user page ----------
const photoGrid=ps=>`<div class="grid">${ps.map(x=>{const lv=x.expires>now();return `<a class="${lv?"":"dead"}" onclick="openPhoto('${x.id}',${lv})"><img src="${x.thumb||media(x.fid)}" loading="lazy" alt=""><span>${lv?"⏳ "+left(x.expires-now()):"หมดเวลา · "+dur(x.expires-x.created)}</span></a>`}).join("")}</div>`;
const statsOf=ps=>{const lv=ps.filter(x=>x.expires>now());return `<div class="stat"><div class="glass"><b>${lv.length}/${ps.length}</b><span>รูปมีชีวิต</span></div><div class="glass"><b>${nf(ps.reduce((s,x)=>s+x.hearts,0))}</b><span>หัวใจรวม</span></div><div class="glass"><b>${ps.length?dur(Math.max(...ps.map(x=>Math.min(x.expires,now())-x.created))):"-"}</b><span>อายุยาวสุด</span></div></div>`};
async function userPage(uid){if(me&&uid==me.id){$("#ov").style.display="none";return go("me")}const o=$("#ov");o.style.display="block";o.innerHTML='<p class="m">กำลังโหลด...</p>';const j=await api("/user/"+uid).catch(()=>null);if(!j)return o.style.display="none";
 o.innerHTML=`<div style="display:flex;justify-content:space-between"><button class="x" onclick="$('#ov').style.display='none'">${I("back")}</button></div><div style="text-align:center">${avHtml(j.user,"av big")}<h2>${esc(j.user.name)}</h2>
  <button class="btn" onclick="$('#ov').style.display='none';openChat(${j.user.id})">${I("chat")} ส่งข้อความ</button></div>${statsOf(j.photos)}${photoGrid(j.photos)}
  <details class="more"><summary>${I("menu")}เพิ่มเติม</summary><button class="btn o" onclick="blockUser(${j.user.id},true)">${I("ban")} บล็อก</button> <button class="btn o" onclick="reportUser(${j.user.id})">${I("flag")} รายงาน</button></details>`}
async function mePage(){const p=$("#p-me");
 if(!tok){if(p.querySelector("#af"))return;p.innerHTML=`<div style="text-align:center;margin-top:10px"><img src="https://youmuan-api.nickvideo.workers.dev/icons/logo-header.png" height="44" alt=""><p class="m">โพสต์รูป ให้เพื่อนกดหัวใจต่อชีวิต<br>ทุก 10,000 หัวใจ = +1 ชั่วโมง</p></div><div class="chips"><span class="chip on" id="tS">สมัครฟรี</span><span class="chip" id="tL">เข้าสู่ระบบ</span></div><div id="af"></div>`;
  const su=()=>{$("#af").innerHTML=`<input id="fn" placeholder="ชื่อที่แสดง" maxlength="40"><input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)" autocomplete="new-password">
   <label class="ck" for="c1"><input type="checkbox" id="c1"><span>ยอมรับข้อกำหนดการใช้งาน</span></label><label class="ck" for="c2"><input type="checkbox" id="c2"><span>ยินยอมตามประกาศความเป็นส่วนตัว (PDPA)</span></label><p class="m"><a onclick="showTerms()" style="text-decoration:underline">อ่านข้อกำหนดและความเป็นส่วนตัว</a></p><button class="btn w" id="go">สมัครสมาชิก</button>`;
   $("#go").onclick=()=>auth("/signup",{name:$("#fn").value,login:$("#fl").value,password:$("#fp").value,acceptTerms:$("#c1").checked,acceptPrivacy:$("#c2").checked})};
  const li=()=>{$("#af").innerHTML=`<input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน" autocomplete="current-password"><button class="btn w" id="go">เข้าสู่ระบบ</button>`;$("#go").onclick=()=>auth("/login",{login:$("#fl").value,password:$("#fp").value})};
  $("#tS").onclick=()=>{$("#tS").classList.add("on");$("#tL").classList.remove("on");su()};$("#tL").onclick=()=>{$("#tL").classList.add("on");$("#tS").classList.remove("on");li()};su();return}
 const j=await api("/me").catch(e=>{if(/เข้าสู่ระบบ/.test(e.message)){tok=null;localStorage.removeItem("tt_tok")}return null});if(!j)return mePage();me={...j.user,unread:j.unread};badge();
 p.innerHTML=`<div style="text-align:center"><a onclick="pickAvatar()" style="position:relative;display:inline-block">${avHtml(me,"av big")}<span class="glass" style="position:absolute;right:-4px;bottom:6px;border-radius:50%;width:32px;height:32px;display:grid;place-items:center">${I("cam")}</span></a>
  <h2>${esc(me.name)}</h2><p class="m">แตะรูปเพื่อเปลี่ยนรูปโปรไฟล์</p></div>${statsOf(j.photos)}<button class="btn w" onclick="composer()">+ โพสต์รูปใหม่</button><h3>รูปของฉัน</h3>${j.photos.length?photoGrid(j.photos):'<p class="m">ยังไม่มีรูป</p>'}
  <details class="more"><summary>${I("menu")}เมนูเพิ่มเติม</summary>${me.role=="admin"?'<div id="adm"></div>':`<h3>แอดมิน</h3><input id="pin" type="password" placeholder="รหัส PIN แอดมิน"><button class="btn o" onclick="pinLink()">ยืนยัน</button>`}
  <p><button class="btn o" onclick="logout()">ออกจากระบบ</button> <a class="m" onclick="showTerms()" style="text-decoration:underline">ข้อกำหนดและ PDPA</a></p></details>`;if(me.role=="admin")admin()}
async function auth(path,b){try{const j=await api(path,{method:"POST",body:JSON.stringify(b)});tok=j.token;ls.set("tt_tok",tok);me=j.user;await loadFeed();go("home");buildFeed()}catch(e){toast(e.message)}}
async function pinLink(){try{await api("/pin-link",{method:"POST",body:JSON.stringify({pin:$("#pin").value})});toast("เป็นแอดมินแล้ว");mePage()}catch(e){toast(e.message)}}
async function logout(){await api("/logout",{method:"POST"}).catch(()=>{});tok=null;me=null;localStorage.removeItem("tt_tok");badge();mePage()}
async function blockUser(id,on){if(on&&!confirm("บล็อกสมาชิกนี้? จะไม่เห็นข้อความจากกันอีก"))return;await api("/block",{method:"POST",body:JSON.stringify({id,on})}).catch(e=>toast(e.message));toast(on?"บล็อกแล้ว":"ยกเลิกบล็อกแล้ว");$("#ov").style.display="none";closeSheet()}
async function reportUser(id){const r=prompt("รายงานสมาชิกนี้ เพราะอะไร?");if(r==null)return;await api("/report",{method:"POST",body:JSON.stringify({id,reason:r})}).then(()=>toast("ส่งรายงานถึงแอดมินแล้ว ขอบคุณค่ะ")).catch(e=>toast(e.message))}
// ---------- admin: DJ playlist + reports ----------
async function admin(){const a=$("#adm");if(!a)return;const [pl,rp]=await Promise.all([api("/playlist").catch(()=>[]),api("/admin/reports").catch(()=>[])]);
 a.innerHTML=`<h3>${I("music")} เพลย์ลิสต์ (ดีเจ)</h3><p class="m">ทุกคนได้ยินเพลงตามลำดับนี้ วนซ้ำ · มีเพลงเดียว = เล่นซ้ำเพลงนั้น</p>
  ${pl.map((s,i)=>`<div class="row"><div class="rk">${i+1}</div><div class="t"><div>${esc(s.title)}</div><div class="m">${esc(s.yid)}</div></div><button class="x" onclick="plMove(${i},-1)">${I("up")}</button><button class="x" onclick="plMove(${i},1)">${I("down")}</button><button class="x" onclick="plDel(${s.id})">${I("x")}</button></div>`).join("")||'<p class="m">ยังไม่มีเพลง</p>'}
  <input id="plu" placeholder="วางลิงก์ YouTube"><button class="btn" onclick="plAdd()">+ เพิ่มเพลง</button><h3>${I("flag")} รายงานจากสมาชิก</h3>${rp.map(r=>`<div class="row"><div class="t"><div>${esc(r.reporter_name)} → ${esc(r.target_name)}</div><div class="m">${esc(r.reason)}</div></div></div>`).join("")||'<p class="m">ไม่มีรายงาน</p>'}`;a._pl=pl}
async function plAdd(){try{await api("/admin/playlist",{method:"POST",body:JSON.stringify({url:$("#plu").value})});toast("เพิ่มเพลงแล้ว");admin();music()}catch(e){toast(e.message)}}
async function plDel(id){await api("/admin/playlist",{method:"DELETE",body:JSON.stringify({id})});admin();music()}
async function plMove(i,d){const pl=$("#adm")._pl,j=i+d;if(j<0||j>=pl.length)return;[pl[i],pl[j]]=[pl[j],pl[i]];await api("/admin/playlist",{method:"PUT",body:JSON.stringify({order:pl.map(s=>s.id)})});admin();music()}
// ---------- สนทนา: 1:1 chat (polling every 3 s while open) ----------
let chatT=null,chatPeer=null,chatLast=0;
async function chatPage(){const p=$("#p-chat");if(!tok)return go("me");p.innerHTML=`<h2>สนทนา</h2><div style="position:relative"><input id="us" placeholder="ค้นหาสมาชิกเพื่อเริ่มแชท" oninput="userSearch(this.value)"></div><div id="usr"></div><h3>ข้อความ</h3><div id="cvl"><p class="m">กำลังโหลด...</p></div>`;
 const l=await api("/dm/list").catch(()=>[]);$("#cvl").innerHTML=l.map(c=>`<a class="row" onclick="openChat(${c.peer})">${avHtml(c)}<div class="t"><div>${esc(c.name)}</div><div class="m">${c.from_id==me?.id?"คุณ: ":""}${esc(c.text)}</div></div>${c.unread?`<span class="bdg" style="position:static">${c.unread}</span>`:""}</a>`).join("")||'<div class="card glass m">ยังไม่มีบทสนทนา ค้นหาสมาชิกหรือแตะ "ส่งข้อความ" ในโปรไฟล์ของเขา</div>'}
let usT=null;function userSearch(q){clearTimeout(usT);usT=setTimeout(async()=>{const l=q.trim()?await api("/users?q="+encodeURIComponent(q.trim())).catch(()=>[]):[];$("#usr").innerHTML=l.map(u=>`<a class="row" onclick="openChat(${u.id})">${avHtml(u)}<div class="t"><div>${esc(u.name)}</div><div class="m">แตะเพื่อแชท</div></div></a>`).join("")},300)}
async function openChat(peer){if(!tok)return go("me");chatPeer=peer;chatLast=0;const s=$("#sheet");s.className="glass on full";
 s.innerHTML=`<div class="hd"><button onclick="closeSheet();if(tab=='chat')chatPage()">${I("back")}</button><span id="chh" style="display:flex;gap:10px;align-items:center;flex:1"></span><button onclick="userPage(chatPeer)">${I("user")}</button></div><div class="bd"><div class="msgs" id="msgs"></div></div>
  <form onsubmit="event.preventDefault();sendDm()"><input id="dmi" maxlength="500" placeholder="พิมพ์ข้อความ..." autocomplete="off"><button class="btn">${I("send")}</button></form>`;await pollChat(true);clearInterval(chatT);chatT=setInterval(()=>pollChat(),3000)}
async function pollChat(first){if(!chatPeer||!$("#msgs"))return clearInterval(chatT);const j=await api(`/dm/${chatPeer}?after=${chatLast}`).catch(()=>null);if(!j)return;
 if(first)$("#chh").innerHTML=avHtml(j.peer)+`<b>${esc(j.peer.name)}</b>`;if(j.blocked||j.blockedBy){$("#sheet form").innerHTML=`<p class="m" style="flex:1;text-align:center">${j.blocked?`คุณบล็อกสมาชิกนี้ · <a onclick="blockUser(${chatPeer},false)" style="text-decoration:underline">ยกเลิกบล็อก</a>`:"ส่งข้อความหาสมาชิกนี้ไม่ได้"}</p>`}
 if(!j.msgs.length)return;const box=$("#msgs");j.msgs.forEach(m=>{const d=document.createElement("div");d.className="msg"+(m.from_id==me?.id?" me":"");d.innerHTML=esc(m.text)+`<small>${new Date(m.t).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"})}</small>`;box.appendChild(d)});
 chatLast=j.msgs[j.msgs.length-1].id;box.parentElement.scrollTop=1e9;refreshUnread()}
async function sendDm(){const i=$("#dmi"),t=i.value.trim();if(!t)return;i.value="";try{await api("/dm",{method:"POST",body:JSON.stringify({to:chatPeer,text:t})});pollChat()}catch(e){toast(e.message);i.value=t}}
async function refreshUnread(){if(!tok)return;const j=await api("/me").catch(()=>null);if(j){me={...j.user,unread:j.unread};badge()}}
function badge(){const a=document.querySelector('#nav a[data-p="chat"]');if(!a)return;a.querySelector(".bdg")?.remove();if(me?.unread)a.insertAdjacentHTML("beforeend",`<span class="bdg">${me.unread>99?"99+":me.unread}</span>`)}
setInterval(()=>{if(!document.hidden&&!chatT)refreshUnread()},20000);
// ---------- terms ----------
function showTerms(){modal(`<div class="card glass"><h2>ข้อกำหนดและความเป็นส่วนตัว</h2><p>TopTop เป็นพื้นที่แบ่งปันรูปภาพและพูดคุยระหว่างสมาชิก โพสต์เฉพาะรูปที่คุณมีสิทธิ์ ห้ามโพสต์เนื้อหาผิดกฎหมาย ลามก รุนแรง ละเมิดผู้อื่น หรือภาพบุคคลอื่นโดยไม่ได้รับอนุญาต แอดมินลบเนื้อหาหรือระงับบัญชีได้</p>
 <p><b>ข้อมูลที่เก็บ</b>: ชื่อที่แสดง เบอร์โทรหรืออีเมล (ใช้เข้าสู่ระบบ) รหัสผ่านแบบเข้ารหัสทางเดียว รูปที่คุณโพสต์ ความเห็น ข้อความแชท และจำนวนหัวใจ รูปเก็บใน Google Drive ของผู้ดูแลระบบและเปิดดูได้ผ่านลิงก์ ข้อมูลอื่นเก็บบน Cloudflare</p>
 <p><b>สิทธิ์ของคุณ</b>: ขอดู แก้ไข หรือลบข้อมูลได้โดยติดต่อแอดมิน ลบรูปของตัวเองได้ทุกเมื่อ บล็อกหรือรายงานสมาชิกที่ไม่เหมาะสมได้จากโปรไฟล์ของเขา</p></div>`)}
// ---------- nav ----------
const NAV=[["home","home","หน้าแรก"],["rank","rank","อันดับ"],["plus","plus",""],["chat","chat","สนทนา"],["me","user","โปรไฟล์"]];
$("#nav").innerHTML=NAV.map(([k,ic,t])=>k=="plus"?`<a class="plus" data-p="plus" aria-label="โพสต์รูป"><span class="pb">${I("plus")}</span></a>`:`<a data-p="${k}">${I(ic)}<span>${t}</span></a>`).join("");
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>a.dataset.p=="plus"?composer():go(a.dataset.p));
if(!$("#p-chat"))document.body.insertAdjacentHTML("beforeend",'<section class="page" id="p-chat"></section>');
function go(p){tab=p;document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.p==p));document.querySelectorAll(".page").forEach(x=>x.style.display="none");$("#ov").style.display="none";
 $("#feed").style.display=p=="home"?"":"none";document.body.classList.toggle("offfeed",p!="home");if(p!="home"){endBoost();$("#p-"+p).style.display="block";({rank,chat:chatPage,me:mePage})[p]()}badge()}
function sortBar(){let s=$(".sort");if(!s){s=document.createElement("div");s.className="sort glass";document.body.appendChild(s)}
 s.innerHTML=`<span class="${sortBy!="new"?"on":""}" data-s="time">เวลาเหลือ</span><span class="${sortBy=="new"?"on":""}" data-s="new">ใหม่ล่าสุด</span>`;s.querySelectorAll("span").forEach(x=>x.onclick=async()=>{sortBy=x.dataset.s;ls.set("tt_sort",sortBy);sortBar();await loadFeed();buildFeed()})}
(async()=>{await loadFeed();const m=location.hash.match(/p=([\w-]+)/);go("home");buildFeed(m?m[1]:null);if(tok)refreshUnread();await music();tapToStart()})();
