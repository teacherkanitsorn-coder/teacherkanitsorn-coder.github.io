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
const avHtml=(u,cls="av")=>u?.avatar?`<div class="${cls}" style="background:center/cover url('${media(u.avatar)}')"></div>`:`<div class="${cls}">${esc(((u?.name||"?").replace(/^[เแโใไ]+/,"")||"?")[0])}</div>`;
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
let FOL=new Set(),SEEN=new Set(),newCnt=0;
async function loadFeed(rand){try{const [j,fl]=await Promise.all([api("/photos"),tok?api("/following").catch(()=>[]):[]]);FOL=new Set(fl);const L=j.photos.filter(x=>x.expires>now());L.forEach(x=>SEEN.add(x.id));newCnt=0;newPill();
 const top=[...L].sort((a,b)=>b.hearts-a.hearts||b.expires-a.expires).slice(0,8),ids=new Set(top.map(x=>x.id));
 const fol=L.filter(x=>!ids.has(x.id)&&FOL.has(x.uid)).sort((a,b)=>b.created-a.created);fol.forEach(x=>ids.add(x.id));
 if(rand){F=[...L];for(let i=F.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[F[i],F[k]]=[F[k],F[i]]}return}F=top.concat(fol,L.filter(x=>!ids.has(x.id)).sort((a,b)=>hsh(a.id)-hsh(b.id)))}catch(e){F=[]}}
async function pollNew(){if(document.hidden||tab!="home")return;const j=await api("/photos?sort=new").catch(()=>null);if(!j)return;newCnt=j.photos.filter(x=>x.expires>now()&&!SEEN.has(x.id)&&x.uid!=me?.id).length;newPill()}
setInterval(pollNew,45000);
function newPill(){let p=$("#newp");if(!newCnt||tab!="home"){p&&p.remove();return}if(!p){p=document.createElement("button");p.id="newp";p.className="glass";p.onclick=homeRefresh;document.body.appendChild(p)}p.textContent=`↑ มีรูปใหม่ ${newCnt} รูป`}
async function homeRefresh(){$("#newp")?.remove();const h=$('#nav a[data-p="home"]');h&&h.classList.add("busy");try{await loadFeed(true);buildFeed();$("#feed").scrollTo({top:0})}finally{setTimeout(()=>h&&h.classList.remove("busy"),350)}}
function postEl(x,i){const d=document.createElement("section");d.className="post";d.dataset.i=i;d.dataset.id=x.id;const src=media(x.fid);
 d.innerHTML=`<div class="glow" style="background-image:url('${x.thumb||src}')"></div><div class="ph"><div class="alb">${[x.fid,...(x.more?x.more.split(","):[])].map((f,k)=>`<img src="${media(f)}" ${i>1||k?'loading="lazy"':""} decoding="async" draggable="false" alt="">`).join("")}</div>${x.more?`<div class="dots">${[x.fid,...x.more.split(",")].map((_,k)=>`<i${k?"":' class="on"'}></i>`).join("")}</div>`:""}</div>
 <div class="timer glass">${I("clock")}<small>หายไปใน</small><span class="tl">--:--</span></div>
 <div class="side"><button class="avb${x.uid!=me?.id&&!FOL.has(x.uid)?" ring":""}">${avHtml({name:x.name,avatar:x.avatar})}${tok&&x.uid!=me?.id&&!FOL.has(x.uid)?`<i class="fol fu${x.uid}" aria-label="ติดตาม"><svg viewBox="0 0 24 24"><path d="M4 17l-1-9 5 4 4-7 4 7 5-4-1 9z" fill="#fff"/></svg><b>+</b></i>`:""}</button><button class="sp"><div class="bub">${I("heart","f")}</div><b class="nh">${nf(x.hearts)}</b>หัวใจ</button>
 <button class="cmb"><div class="bub glass">${I("chat")}</div><b>${nf(x.cm)}</b>ความเห็น</button><button class="shb"><div class="bub glass">${I("share")}</div><b></b>ขอหัวใจ</button><button class="asb${AS.on?" on":""}" aria-label="เลื่อนอัตโนมัติ"><div class="bub glass"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6l5 5 5-5M7 13l5 5 5-5"/></svg></div><b class="ass">${AS.on?AS.sec+" วิ":"อัตโนมัติ"}</b></button></div>
 <div class="meta"><div class="nm">@${esc(x.name)}</div>${x.caption?`<div class="cap">${esc(x.caption)}</div>`:""}${x.prov?`<div class="loc">📍 ${esc(locText(x))}${x.arank&&x.arank<=10?`<span class="arb">🏆 #${x.arank} ของ จ.${esc(x.prov)}</span>`:""}</div>`:""}<div class="gain">อายุรวม ${dur(Math.min(x.expires,now())-x.created)} · 10,000 หัวใจ = +1 ชม.</div></div>`;
 ambient(x.thumb,(a,b)=>d.querySelector(".ph img").style.setProperty("--pc",a.replace("rgb","rgba").replace(")",",.55)")));
 const tp=d.querySelector(".alb");if(x.more)tp.addEventListener("scroll",()=>{const k=Math.round(tp.scrollLeft/tp.clientWidth);d.querySelectorAll(".dots i").forEach((e,j)=>e.classList.toggle("on",j==k))},{passive:true});let pd=null;tp.addEventListener("pointerdown",e=>pd={x:e.clientX,y:e.clientY,t:Date.now()});tp.addEventListener("pointerup",e=>{if(pd&&Math.hypot(e.clientX-pd.x,e.clientY-pd.y)<12&&Date.now()-pd.t<500)heart(d,x,e);pd=null});
 tp.addEventListener("dblclick",e=>e.preventDefault());tp.addEventListener("pointercancel",()=>pd=null);
 const sp=d.querySelector(".sp");sp.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();const r=sp.getBoundingClientRect();heart(d,x,{clientX:r.left+r.width/2-40+Math.random()*30,clientY:r.top})},{passive:false});sp.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});
 asBind(d.querySelector(".asb"));if(x.more)albHint(d,x);d.querySelector(".cmb").onclick=()=>openCm(x);d.querySelector(".shb").onclick=()=>share(x);d.querySelector(".avb").onclick=()=>userPage(x.uid);const fo=d.querySelector(".fol");if(fo)fo.onclick=e=>{e.stopPropagation();feedFollow(x.uid)};d.querySelector(".nm").onclick=()=>userPage(x.uid);
 return d}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.6){const x=F[e.target.dataset.i];if(x){cur={x,d:e.target};ambient(x.thumb,setAmb);tick()}}}),{threshold:[.6]});
function buildFeed(focus){const f=$("#feed");f.innerHTML="";cur=null;
 if(!F.length){f.innerHTML=`<div class="empty"><img src="https://youmuan-api.nickvideo.workers.dev/icons/logo-splash.png" width="168" style="filter:drop-shadow(0 12px 40px rgba(255,47,179,.45))" alt=""><h2>ยังไม่มีรูปที่ยังมีชีวิต</h2><p>โพสต์รูปแรกเลย ได้เวลาฟรี 1 ชั่วโมง<br>ให้เพื่อนกดหัวใจต่อชีวิต!</p><button class="btn" onclick="composer()">+ โพสต์รูป</button></div>`;return}
 F.forEach((x,i)=>{const d=postEl(x,i);f.appendChild(d);io.observe(d)});const k=focus?F.findIndex(x=>x.id==focus):-1;if(k>0)f.children[k].scrollIntoView();tick()}
function tick(){const t=now();document.querySelectorAll(".post").forEach(d=>{const x=F[d.dataset.i];if(!x)return;const ms=x.expires-t;d.querySelector(".tl").textContent=ms>0?left(ms):"หมดเวลา";
 d.classList.toggle("urgent",ms>0&&ms<10*6e4);{const lm=ms>0&&ms<=6e4;let w=d.querySelector(".lastmin");if(lm){if(!w){w=document.createElement("div");w.className="lastmin";w.innerHTML='<b>อีก 1 นาทีจะหายไป 💔</b><span>รัวใจช่วยต่อชีวิตหน่อย!</span><i></i>';d.querySelector(".ph").appendChild(w)}w.querySelector("i").textContent=Math.ceil(ms/1000)+" วินาที"}else if(w)w.remove()}d.classList.toggle("dead",ms<=0);d.querySelector(".nh").textContent=nf(x.hearts)})}
setInterval(tick,1000);
// expired photos leave the feed (owner keeps them in profile)
setInterval(()=>{if(tab!="home")return;const dead=F.filter(x=>x.expires<=now());if(dead.length&&(!cur||cur.x.expires<=now()-4000)){loadFeed().then(()=>buildFeed(cur?.x?.expires>now()?cur.x.id:null))}},5000);
// ---------- hearts: optimistic, batched, server clamps + rate limits ----------
const HQ={};function hq(id,n,k){const q=HQ[id]||(HQ[id]={n:0,k:0});q.n+=n;q.k+=k}
let hfly=false,hLimT=0;async function flushHearts(){if(hfly)return;hfly=true;try{for(const [pid,q] of Object.entries(HQ)){delete HQ[pid];if(!q.n&&!q.k)continue;try{const r=await api("/hearts",{method:"POST",body:JSON.stringify({pid,n:q.n,k:q.k})});const x=F.find(y=>y.id==pid);
  if(x&&r.expires){x.hearts=r.hearts;x.expires=r.expires}if(r.limited&&Date.now()-hLimT>15000){hLimT=Date.now();toast("กดเร็วมาก! บางหัวใจไม่นับ พักแป๊บนะ ❤️")}if(r.expired)toast("รูปนี้หมดเวลาแล้ว")}catch(e){if(/เข้าสู่ระบบ/.test(e.message))go("me")}}}finally{hfly=false}}
setInterval(flushHearts,1000);addEventListener("pagehide",flushHearts);
const CB={pid:null,streak:0,until:0,combo:0,timer:null};
let pinT=null;let pinned=false;function pinFeed(){const f=$("#feed");if(!cur)return;if(!pinned){pinned=true;f.style.overflowY="hidden"}clearTimeout(pinT);pinT=setTimeout(()=>{pinned=false;f.style.overflowY="";if(cur&&Math.abs(f.scrollTop-cur.d.offsetTop)>1)f.scrollTop=cur.d.offsetTop},600)}
function heart(d,x,e){if(!tok){toast("สมัครฟรีก่อน แล้วกดหัวใจได้ไม่จำกัด");return go("me")}if(x.expires<=now())return toast("รูปนี้หมดเวลาแล้ว");pinFeed();
 if(CB.pid!=x.id){endBoost();CB.pid=x.id;CB.streak=0}const boost=Date.now()<CB.until,add=boost?100:1;
 tapFX(e.clientX,e.clientY,add,boost);const sp=d.querySelector(".sp .bub");sp.animate&&sp.animate([{transform:"scale(1)"},{transform:"scale(1.15)"},{transform:"scale(1)"}],{duration:160});hint(boost);
 const h0=Math.floor(x.hearts/1e4);x.hearts+=add;x.expires+=add*MSH;if(Math.floor(x.hearts/1e4)>h0)hourFX(d);else gainFX(d,add);if(boost){hq(x.id,0,1);CB.combo++;$("#cbn").textContent="x"+CB.combo+"  +"+nf(CB.combo*100)}else{hq(x.id,1,0);if(++CB.streak>=100)startBoost()}paintOne(d,x)}
let p1=0;function paintOne(d,x){if(p1)return;p1=requestAnimationFrame(()=>{p1=0;const nh=d.querySelector(".nh");if(nh)nh.textContent=nf(x.hearts);const tl=d.querySelector(".tl");if(tl)tl.textContent=left(x.expires-now())})}
let hintT=null;function hint(boost){let h=$("#cbh");if(!h){h=document.createElement("div");h.id="cbh";document.body.appendChild(h)}
 if(boost){h.style.display="none";return}if(!h._b){h.innerHTML=`กดครบ 100 ครั้ง เข้าโหมดใจเดือด 🔥 <b></b><i></i>`;h._b=h.querySelector("b");h._i=h.querySelector("i")}const s=Math.min(CB.streak+1,100);h._b.textContent=s+"/100";h._i.style.transform=`scaleX(${s/100})`;if(h.style.display!="block")h.style.display="block";clearTimeout(hintT);hintT=setTimeout(()=>h.style.display="none",1500)}
const FX={c:null,x:null,p:[],t:[],r:[],run:false,last:0,combo:0,lastTap:0,MAX:70};
function fxInit(){if(FX.c)return;const c=FX.c=document.createElement("canvas");c.id="fx";document.body.appendChild(c);FX.x=c.getContext("2d");
 const rs=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);c.width=innerWidth*dpr;c.height=innerHeight*dpr;FX.x.setTransform(dpr,0,0,dpr,0,0)};rs();addEventListener("resize",rs)}
function spawn(x,y,n,spd,big){for(let i=0;i<n&&FX.p.length<FX.MAX;i++){const a=Math.random()*Math.PI*2,s=spd*(.35+Math.random()*.9);
 FX.p.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-spd*.35,life:0,max:.55+Math.random()*.55,size:(big?9:5)+Math.random()*(big?12:7),heart:true,rot:Math.random()*6,vr:(Math.random()-.5)*10})}}
function popText(){return;FX.t.push({x,y,s,size,life:0,max:dur,center});if(FX.t.length>6)FX.t.shift()}
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
  g.globalAlpha=1-Math.max(0,(k-.55)/.45);g.font=`700 ${Math.round(t.size*sc)}px Inter,Kanit`;g.fillStyle="#fff";
  g.fillText(t.s,t.x,t.center?t.y:t.y-k*90);}
 g.globalAlpha=1;if(FX.p.length||FX.t.length||FX.r.length)requestAnimationFrame(fxLoop);else{FX.run=false;FX.last=0}}
function fxKick(){if(!FX.run){FX.run=true;requestAnimationFrame(fxLoop)}}
const TIERS_FX=[[100,"x100 ตำนาน!"],[50,"x50!"],[25,"x25 COMBO!"],[10,"x10 COMBO!"]];
function tapFX(x,y,add,boost){fxInit();const t=performance.now();FX.combo=t-FX.lastTap<700?FX.combo+1:1;FX.lastTap=t;const c=FX.combo;
 spawn(x,y,boost?8:c>=25?5:4,boost?900:c>=25?650:480,boost||c>=50);popText(x,y-30,"+"+add,boost?44:c>=25?30:c>=10?26:22);
 const tier=TIERS_FX.find(q=>c==q[0]);if(tier){popText(innerWidth/2,innerHeight*.32,tier[1],tier[0]>=50?52:40,1.1,true);0&&FX.r.push({x:innerWidth/2,y:innerHeight*.32,R:180,w:4,life:0,max:.6})}
 if(c%20==0)shake(2);if(c%10==1&&navigator.vibrate)navigator.vibrate(6);fxKick()}
function shake(px){const m=cur?.d.querySelector(".ph img");if(!m||!m.animate)return;m.animate([{transform:"translate(0,0)"},{transform:`translate(${px}px,0)`},{transform:`translate(-${px}px,0)`},{transform:"translate(0,0)"}],{duration:180})}
function startBoost(){fxInit();for(let i=0;i<4;i++)spawn(Math.random()*innerWidth,Math.random()*innerHeight*.8,8,800,true);0&&FX.r.push({x:innerWidth/2,y:innerHeight/2,R:Math.max(innerWidth,innerHeight)*.75,w:10,life:0,max:.8});
 popText(innerWidth/2,innerHeight*.45,"ใจเดือด!",56,1.2,true);shake(4);navigator.vibrate&&navigator.vibrate(20);fxKick();document.body.classList.add("glow");
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
let RAD=null,radT=null,curYid=null,ytState=-1,durSent={};
async function music(){const j=await api("/radio").catch(()=>null);if(!j||!j.tracks.length){PLS=[];RAD=null;$("#np").className="";YTP&&ytc("stopVideo");return}
 RAD={start:j.start,off:j.now-Date.now()};PLS=j.tracks;radioPlay()}
function radPos(){const t=Date.now()+RAD.off,L=PLS.map(x=>(x.dur||240)*1000),tot=L.reduce((a,b)=>a+b,0);let o=((t-RAD.start)%tot+tot)%tot;
 for(let i=0;i<L.length;i++){if(o<L[i])return{i,off:o/1000,rem:(L[i]-o)/1000};o-=L[i]}return{i:0,off:0,rem:L[0]/1000}}
function radioPlay(){if(!RAD||!PLS.length)return;const p=radPos();PLI=p.i;const s=PLS[p.i];
 if(!YTP){const w=document.createElement("div");w.style.cssText="position:fixed;left:-2px;bottom:0;width:2px;height:2px;overflow:hidden;opacity:.01;pointer-events:none;z-index:-1";
  const f=document.createElement("iframe");f.allow="autoplay;encrypted-media";f.setAttribute("playsinline","");f.width=200;f.height=200;
  f.src=`https://www.youtube.com/embed/${s.yid}?autoplay=1&mute=1&playsinline=1&controls=0&enablejsapi=1&start=${Math.floor(p.off)}&origin=${encodeURIComponent(location.origin)}`;
  f.onload=()=>{f.contentWindow.postMessage('{"event":"listening","id":1}',"*");setTimeout(()=>{const q=radPos();ytc("seekTo",[q.off,true]);ytc("playVideo");if(started&&!musicMuted)ytc("unMute")},400)};w.appendChild(f);document.body.appendChild(w);YTP=f}
 else if(curYid!=s.yid)ytc("loadVideoById",[{videoId:s.yid,startSeconds:p.off}]);else ytc("seekTo",[p.off,true]);
 curYid=s.yid;ytc("playVideo");if(started&&!musicMuted)ytc("unMute");paintNp();clearTimeout(radT);radT=setTimeout(radioPlay,Math.max(1,p.rem+.4)*1000);
 clearTimeout(radioPlay.ck);radioPlay.ck=setTimeout(()=>{if(started&&!musicMuted&&ytState!==1&&!document.hidden)listenTap()},3500)}
function nextSong(){radioPlay()}
addEventListener("message",e=>{if(!/youtube/.test(e.origin)||!YTP||e.source!==YTP.contentWindow)return;try{const j=JSON.parse(e.data),i=j.info||{};
 if(i.playerState!=null){ytState=i.playerState;if(i.playerState===0)radioPlay();if(i.playerState===1)UNL=true}
 const s=PLS[PLI];if(s&&!s.dur&&i.duration>20&&!durSent[s.id]){durSent[s.id]=1;fetch(API+"/radio/dur",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:s.id,dur:i.duration})}).then(()=>music())}}catch(x){}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)music()});addEventListener("pageshow",e=>{if(e.persisted)music()});
// silent unlock: no overlay - first interaction of any kind unmutes and starts the synced radio
let UNL=false;const UEV=["pointerdown","touchstart","touchend","click","keydown","scroll","wheel"];
function unlockAudio(){if(UNL||!PLS.length)return;UNL=true;UEV.forEach(k=>removeEventListener(k,unlockAudio,true));markStarted();if(!ls.get("tt_mute",false)){musicMuted=false;ytc("unMute");ytc("playVideo")}radioPlay();paintNp()}
function listenTap(){UNL=false;UEV.forEach(k=>addEventListener(k,unlockAudio,{capture:true,passive:true}))}
function paintNp(){const n=$("#np");if(!PLS.length){n.className="";return}const s=PLS[PLI];n.className="glass on"+(musicMuted||!started?" mute":"");
 n.innerHTML=`<div class="eq"><b></b><b></b><b></b></div><span class="t">${esc(s.title)}</span><button class="dj" aria-label="ขอเพลง" onclick="event.stopPropagation();djOpen()">${I("music")}</button>${me?.role=="admin"?`<button class="adm" aria-label="เพลงถัดไป" onclick="event.stopPropagation();radioCtl('skip')">⏭</button><button class="adm" aria-label="เล่นทันที" onclick="event.stopPropagation();playNowOpen()">▶︎</button>`:""}<button class="mu" aria-label="เสียง">${I(musicMuted||!started?"mute":"vol")}</button>`;n.querySelector(".mu").onclick=e=>{e.stopPropagation();setMusicMute(started?!musicMuted:false)}}
function setMusicMute(m){musicMuted=m;ls.set("tt_mute",m);markStarted();ytc(m?"mute":"unMute");if(!m)radioPlay();else paintNp()}
function markStarted(){started=true;sessionStorage.tt_started="1";$("#tts")?.remove()}
let TTS_SHOWN=false;function tapToStart(){if(UNL||!PLS.length)return;listenTap();if(TTS_SHOWN)return;TTS_SHOWN=true;
 const t=document.createElement("div");t.id="tts";t.innerHTML=`<div class="pl">${I("vol")}</div><b>แตะเพื่อฟังเพลง</b><span>${esc(PLS[PLI]?.title||"")}</span>`;document.body.appendChild(t)}
// ---------- photo pipeline: compress on phone (<=1080px JPEG ~200-400KB) -> Drive bridge ----------
async function loadBitmap(file){try{return await createImageBitmap(file,{imageOrientation:"from-image"})}catch(e){}
 try{return await createImageBitmap(file)}catch(e){}
 const u=URL.createObjectURL(file);try{const im=new Image();im.src=u;await (im.decode?im.decode():new Promise((ok,no)=>{im.onload=ok;im.onerror=no}));if(!im.naturalWidth)throw 0;return im}catch(e){throw new Error("เปิดรูปไม่ได้ ("+(file.type||"ไม่ทราบชนิด")+")")}}
const toBlob=(c,q)=>new Promise(ok=>c.toBlob(ok,"image/jpeg",q));
async function compressImage(file,max=1080,target=380e3,square=false){const bm=await loadBitmap(file);let sw=bm.naturalWidth||bm.width,sh=bm.naturalHeight||bm.height,sx=0,sy=0;
 if(square){const s=Math.min(sw,sh);sx=(sw-s)/2;sy=(sh-s)/2;sw=sh=s}const k=Math.min(1,max/Math.max(sw,sh)),W=Math.round(sw*k),H=Math.round(sh*k);
 const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(bm,sx,sy,sw,sh,0,0,W,H);
 let q=.82,b=await toBlob(c,q);while(b.size>target&&q>.45){q-=.08;b=await toBlob(c,q)}
 const t=document.createElement("canvas"),tk=48/Math.max(W,H);t.width=Math.max(1,Math.round(W*tk));t.height=Math.max(1,Math.round(H*tk));t.getContext("2d").drawImage(c,0,0,t.width,t.height);
 return {blob:new File([b],"photo.jpg",{type:"image/jpeg"}),w:W,h:H,thumb:t.toDataURL("image/jpeg",.6)}}
async function driveSend(f,onp){const g=await api("/photo/ticket",{method:"POST",body:"{}"});
 const post=b=>fetch(g.bridge,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...b,ticket:g.ticket})}).then(r=>r.text()).then(t=>{try{return JSON.parse(t)}catch(e){throw Object.assign(new Error("ระบบอัปโหลดไม่ตอบ ลองใหม่"),{retry:1})}}).then(j=>{if(j.error)throw new Error(j.error=="ticket"?"ระบบอัปโหลดยังไม่อัปเดต (ติดต่อแอดมิน)":j.error);return j});
 const post2=async(b,n=3)=>{for(let k=1;;k++){try{return await post(b)}catch(e){if(!e.retry&&!(e instanceof TypeError)||k>=n)throw e;await new Promise(r=>setTimeout(r,800*k))}}};
 const ini=await post2({action:"init",name:f.name,size:f.size,mime:f.type});
 const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("PUT",ini.uploadUrl);x.setRequestHeader("Content-Type",f.type);x.upload.onprogress=e=>e.lengthComputable&&onp(e.loaded/e.total);x.onload=()=>{try{const j=JSON.parse(x.responseText);x.status<300?ok(j):no(new Error(j.error?.message||"อัปโหลดไม่สำเร็จ"))}catch(e){no(e)}};x.onerror=()=>no(new Error("เครือข่ายขัดข้อง"));x.send(f)});
 const fin=await post2({action:"finish",id:r.id});return {...fin,uid:g.ticket.uid}}
function composer(){if(!tok){toast("สมัครฟรีก่อน แล้วโพสต์ได้เลย");return go("me")}const s=$("#sheet");s.className="glass on full";const PK=[];
 s.innerHTML=`<div class="hd"><b>โพสต์รูป</b><button onclick="closeSheet()">${I("x")}</button></div><div class="bd">
  <div class="albp" id="albp"></div><input id="cf" type="file" accept="image/*" multiple hidden>
  <input id="ccap" maxlength="150" placeholder="แคปชั่น (ไม่บังคับ)"><div class="locf" id="locf"></div><div class="prog" id="cbar" style="display:none"><i></i></div><div class="m" id="cst"></div>
  <button class="btn w" id="cgo">โพสต์เลย</button></div>`;
 locPicker($("#locf"));const paint=()=>{$("#albp").innerHTML=PK.map((f,k)=>`<div class="at"><img src="${URL.createObjectURL(f)}" alt=""><button data-k="${k}" aria-label="ลบ">${I("x")}</button>${k?"":"<span>ปก</span>"}</div>`).join("")+(PK.length<5?`<label for="cf" class="at add">${I("cam")}<b>${PK.length?"เพิ่มรูป":"เลือกรูป"}</b><small>${PK.length}/5</small></label>`:"")+(PK.length?"":`<p class="m" style="grid-column:1/-1;margin:0">โพสต์ได้ 1-5 รูป ปัดดูในโพสต์เดียว · เริ่มต้นมีชีวิต 1 ชั่วโมง</p>`);
  $("#albp").querySelectorAll("button[data-k]").forEach(b=>b.onclick=e=>{e.preventDefault();PK.splice(+b.dataset.k,1);paint()})};paint();
 $("#cf").onchange=async e=>{const fs=[...e.target.files].slice(0,5-PK.length);e.target.value="";for(const f of fs){try{const c=await cropEditor(f);if(c)PK.push(c);paint()}catch(x){$("#cst").textContent="ผิดพลาด: "+x.message}}};
 $("#cgo").onclick=async()=>{const st=$("#cst"),bar=$("#cbar");if(!PK.length)return st.textContent="เลือกรูปก่อนนะ";const loc=locVal();if(!(loc.prov&&loc.amph&&loc.tamb)){$("#locf").classList.add("nudge");$("#locf").scrollIntoView({block:"center",behavior:"smooth"});return st.textContent="📍 กรุณาเลือกจังหวัด อำเภอ และตำบลก่อนโพสต์ (หมู่บ้านไม่บังคับ)"}ls.set("tt_loc",loc);const btn=$("#cgo");btn.disabled=true;bar.style.display="block";
  const prog=(l,q)=>{bar.firstChild.style.width=Math.round(q)+"%";st.textContent=l+" "+Math.round(q)+"%"};const N=PK.length,D=[];let first=null,kb=0;
  try{for(let k=0;k<N;k++){const base=k*95/N;prog(`กำลังเตรียมรูป ${k+1}/${N}`,base+2);const c=await compressImage(PK[k]);if(!k)first=c;kb+=c.blob.size;
    D.push(await driveSend(c.blob,q=>prog(`กำลังอัปโหลด ${k+1}/${N}`,base+5+q*(95/N-5))))}
   const r=await api("/photos",{method:"POST",body:JSON.stringify({drive:D[0],more:D.slice(1),loc,caption:$("#ccap").value,thumb:first.thumb,w:first.w,h:first.h})});prog("โพสต์แล้ว",100);st.textContent=`โพสต์แล้ว ✓ ${N} รูป (${Math.round(kb/1024)} KB) มีชีวิต 1 ชั่วโมง`;
   setTimeout(async()=>{closeSheet();await loadFeed();go("home");buildFeed(r.id)},700)}catch(e){st.textContent="ผิดพลาด: "+e.message;bar.style.display="none"}finally{btn.disabled=false}}}
function pickAvatar(){let i=$("#avin");if(!i){i=document.createElement("input");i.id="avin";i.type="file";i.accept="image/*";i.style.cssText="position:fixed;left:-9999px;opacity:0";document.body.appendChild(i)}
 i.value="";i.onchange=async()=>{const f=i.files&&i.files[0];if(!f)return;let st="เตรียมรูป";const show=t=>{const m=$("#avst");if(m)m.textContent=t;else toast(t)};
  try{show("กำลังย่อรูป...");const c=await compressImage(f,512,150e3,true);st="อัปโหลด";show("กำลังอัปโหลด...");const d=await driveSend(c.blob,q=>show("กำลังอัปโหลด "+Math.round(q*100)+"%"));
   st="บันทึก";const r=await api("/avatar",{method:"POST",body:JSON.stringify({drive:d})});me.avatar=r.avatar;show("");toast("เปลี่ยนรูปโปรไฟล์แล้ว ✓");mePage()}
  catch(e){const msg=/เปิดรูปไม่ได้|decode|HEIC/i.test(e.message)?"เปิดรูปนี้ไม่ได้ ลองเลือกรูปอื่น (ถ้าเป็นรูป HEIC ให้แคปหน้าจอรูปนั้นแล้วเลือกใหม่)":e.message;show("");modal(`<h3>เปลี่ยนรูปโปรไฟล์ไม่สำเร็จ</h3><p class="m">ขั้นตอน: ${st}</p><p>${esc(msg)}</p><button class="btn w" onclick="$('#modal').style.display='none';pickAvatar()">ลองอีกครั้ง</button>`)}};
 i.click()}
// ---------- อันดับ: most time left (live) + Hall of fame (longest-lived) ----------
let rankTab="live";const prow=(x,i,lab)=>`<a class="row" onclick="openPhoto('${x.id}',${x.expires>now()})"><div class="rk${i==0?" c1":""}">${i+1}</div><img src="${x.thumb||media(x.fid)}" alt=""><div class="t"><div>${esc(x.caption||"รูปของ "+x.name)}</div><div class="m">@${esc(x.name)} · ${lab}</div></div></a>`;
async function rank(){const p=$("#p-rank");if(rankTab=="area")return areaRank();p.innerHTML=`<h2>อันดับ</h2><div class="chips"><span class="chip ${rankTab=="live"?"on":""}" onclick="rankTab='live';rank()">เวลาเหลือมากสุด</span><span class="chip ${rankTab=="hall"?"on":""}" onclick="rankTab='hall';rank()">Hall of Fame</span><span class="chip ${rankTab=="area"?"on":""}" onclick="rankTab='area';rank()">พื้นที่</span></div><p class="m">กำลังโหลด...</p>`;
 const want=rankTab;const j=await api(rankTab=="live"?"/top":"/hall").catch(()=>({photos:[]}));if(rankTab!=want||rankTab=="area")return;
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
  <div class="fc"><b>${nf(j.user.followers)}</b> ผู้ติดตาม · <b>${nf(j.user.following)}</b> กำลังติดตาม</div><div style="display:flex;gap:8px;justify-content:center"><button class="btn ${j.user.isFollowing?"o":""}" id="fb${j.user.id}" onclick="follow(${j.user.id},this)">${j.user.isFollowing?"กำลังติดตาม ✓":"+ ติดตาม"}</button><button class="btn o" onclick="$('#ov').style.display='none';openChat(${j.user.id})">${I("chat")} ส่งข้อความ</button></div></div>${statsOf(j.photos)}${photoGrid(j.photos)}
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
  <h2>${esc(me.name)}</h2><div class="fc" id="myfc"></div><p class="m" id="avst">แตะรูปเพื่อเปลี่ยนรูปโปรไฟล์</p></div>${statsOf(j.photos)}<button class="btn w" onclick="composer()">+ โพสต์รูปใหม่</button><h3>รูปของฉัน</h3>${j.photos.length?photoGrid(j.photos):'<p class="m">ยังไม่มีรูป</p>'}
  <details class="more"><summary>${I("menu")}เมนูเพิ่มเติม</summary>${me.role=="admin"?'<div id="adm"></div>':`<h3>แอดมิน</h3><input id="pin" type="password" placeholder="รหัส PIN แอดมิน"><button class="btn o" onclick="pinLink()">ยืนยัน</button>`}
  <p><button class="btn o" onclick="logout()">ออกจากระบบ</button> <a class="m" onclick="showTerms()" style="text-decoration:underline">ข้อกำหนดและ PDPA</a></p></details>`;if(me.role=="admin")admin()}
async function auth(path,b){try{const j=await api(path,{method:"POST",body:JSON.stringify(b)});tok=j.token;ls.set("tt_tok",tok);me=j.user;if(path=="/signup"&&me?.id)ls.set("tt_new_"+me.id,1);await loadFeed();go("home");buildFeed()}catch(e){toast(e.message)}}
async function pinLink(){try{await api("/pin-link",{method:"POST",body:JSON.stringify({pin:$("#pin").value})});toast("เป็นแอดมินแล้ว");mePage()}catch(e){toast(e.message)}}
async function logout(){await api("/logout",{method:"POST"}).catch(()=>{});tok=null;me=null;localStorage.removeItem("tt_tok");badge();mePage()}
async function blockUser(id,on){if(on&&!confirm("บล็อกสมาชิกนี้? จะไม่เห็นข้อความจากกันอีก"))return;await api("/block",{method:"POST",body:JSON.stringify({id,on})}).catch(e=>toast(e.message));toast(on?"บล็อกแล้ว":"ยกเลิกบล็อกแล้ว");$("#ov").style.display="none";closeSheet()}
async function reportUser(id){const r=prompt("รายงานสมาชิกนี้ เพราะอะไร?");if(r==null)return;await api("/report",{method:"POST",body:JSON.stringify({id,reason:r})}).then(()=>toast("ส่งรายงานถึงแอดมินแล้ว ขอบคุณค่ะ")).catch(e=>toast(e.message))}
// ---------- admin: DJ playlist + reports ----------
async function admin(){const a=$("#adm");if(!a)return;const [pl,rp,dq,cat]=await Promise.all([api("/playlist").catch(()=>[]),api("/admin/reports").catch(()=>[]),api("/admin/dj").catch(()=>[]),api("/admin/catalog").catch(()=>[])]);
 a._pl=pl;a._cat=cat;
 a.innerHTML=`<h3>${I("music")} คำขอเพลง 5 บาท (${dq.length})</h3>${dq.map(r=>`<div class="row"><div class="t"><div>${esc(r.title)}</div><div class="m">${esc(r.name)} · ${r.ref} · <a href="https://drive.google.com/file/d/${r.slip}/view" target="_blank" style="color:#2fe0ff">ดูสลิป</a></div></div><button class="x" onclick="djOk(${r.id},1)">✓</button><button class="x" onclick="djOk(${r.id},0)">${I("x")}</button></div>`).join("")||'<p class="m">ไม่มีคำขอรอตรวจ</p>'}
  <h3>${I("music")} เพลย์ลิสต์ (วิทยุ เล่นตรงกันทุกเครื่อง)</h3><p class="m">ทุกคนได้ยินเพลงเดียวกัน ณ วินาทีเดียวกัน วนซ้ำ · เลือกได้เฉพาะเพลงในคลังพอดีม่วน</p>
  <div class="plq${pl.length>5?" fold":""}" id="plq">${pl.map((s,i)=>{const [t,...ar]=s.title.split(" - ");return `<div class="pq"><span class="rk">${i+1}</span><div class="t"><b>${esc(t)}</b><small>${esc(ar.join(" - ")||"พอดีม่วน")}</small></div><button class="mo" aria-label="ตัวเลือก" onclick="plMenu(event,${i})">⋯</button><button class="xx" aria-label="ลบ" onclick="plDel(${s.id})">${I("x")}</button></div>`}).join("")||'<p class="m">ยังไม่มีเพลง</p>'}</div>
  ${pl.length>5?`<button class="plmore" onclick="$('#plq').classList.toggle('fold');this.textContent=$('#plq').classList.contains('fold')?'ดูทั้งหมด (${pl.length})':'ย่อรายการ'">ดูทั้งหมด (${pl.length})</button>`:""}
  <div class="pls"><input id="plsq" placeholder="ค้นหาเพลงในคลังพอดีม่วน เพื่อเพิ่มเข้าคิว" oninput="plSearch()" autocomplete="off"><div id="plsr"></div></div>
  <details class="more"><summary>${I("menu")} คลังเพลงพอดีม่วน (${cat.filter(c=>c.active).length} เพลง) — เพิ่ม/แก้/ลบ</summary>
   <input id="ctu" placeholder="ลิงก์ YouTube (เวอร์ชันเต็ม ไม่ใช่ MV)"><input id="ctt" placeholder="ชื่อเพลง (ไม่บังคับ)"><button class="btn" onclick="ctAdd()">+ เพิ่มเข้าคลัง</button>
   ${cat.map(c=>`<div class="row" style="${c.active?"":"opacity:.45"}"><div class="t"><div>${esc(c.title)}</div><div class="m">${c.yid}</div></div><button class="x" onclick="ctEdit(${c.id})">✎</button><button class="x" onclick="ctToggle(${c.id},${c.active?0:1})">${c.active?"ซ่อน":"แสดง"}</button><button class="x" onclick="ctDel(${c.id})">${I("x")}</button></div>`).join("")}</details>
  <h3>${I("flag")} รายงานจากสมาชิก</h3>${rp.map(r=>`<div class="row"><div class="t"><div>${esc(r.reporter_name)} → ${esc(r.target_name)}</div><div class="m">${esc(r.reason)}</div></div></div>`).join("")||'<p class="m">ไม่มีรายงาน</p>'}`;a._pl=pl}
async function plAdd(cid){try{await api("/admin/playlist",{method:"POST",body:JSON.stringify({cid})});toast("เพิ่มเพลงแล้ว");admin();music()}catch(e){toast(e.message)}}
async function djOk(id,ok){try{await api("/admin/dj",{method:"POST",body:JSON.stringify({id,ok:!!ok})});toast(ok?"อนุมัติแล้ว เพลงจะเล่นต่อจากเพลงนี้":"ปฏิเสธแล้ว");admin();music()}catch(e){toast(e.message)}}
async function ctAdd(){try{await api("/admin/catalog",{method:"POST",body:JSON.stringify({url:$("#ctu").value,title:$("#ctt").value})});DJC=null;toast("เพิ่มเข้าคลังแล้ว");admin()}catch(e){toast(e.message)}}
async function ctEdit(id){const t=prompt("ชื่อเพลงใหม่");if(t){await api("/admin/catalog",{method:"PUT",body:JSON.stringify({id,title:t})});DJC=null;admin()}}
async function ctToggle(id,on){await api("/admin/catalog",{method:"PUT",body:JSON.stringify({id,active:!!on})});DJC=null;admin()}
async function ctDel(id){if(confirm("ลบเพลงนี้ออกจากคลัง?")){await api("/admin/catalog",{method:"DELETE",body:JSON.stringify({id})});DJC=null;admin()}}
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
let chatBusy=false;async function pollChat(first){if(!chatPeer||!$("#msgs"))return clearInterval(chatT);if(chatBusy&&!first)return;chatBusy=true;const peer=chatPeer;let j;try{j=await api(`/dm/${chatPeer}?after=${chatLast}`).catch(()=>null)}finally{chatBusy=false}if(!j||peer!=chatPeer)return;
 if(first)$("#chh").innerHTML=avHtml(j.peer)+`<b>${esc(j.peer.name)}</b>`;if(j.blocked||j.blockedBy){$("#sheet form").innerHTML=`<p class="m" style="flex:1;text-align:center">${j.blocked?`คุณบล็อกสมาชิกนี้ · <a onclick="blockUser(${chatPeer},false)" style="text-decoration:underline">ยกเลิกบล็อก</a>`:"ส่งข้อความหาสมาชิกนี้ไม่ได้"}</p>`}
 if(!j.msgs.length)return;const box=$("#msgs");j.msgs.forEach(m=>{if(box.querySelector(`[data-id="${m.id}"]`))return;let d=m.cid&&box.querySelector(`[data-cid="${m.cid}"]`);if(!d){d=document.createElement("div");box.appendChild(d)}d.dataset.id=m.id;d.removeAttribute("data-cid");d.className="msg"+(m.from_id==me?.id?" me":"");d.innerHTML=esc(m.text)+`<small>${new Date(m.t).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"})}</small>`});
 chatLast=Math.max(chatLast,j.msgs[j.msgs.length-1].id);box.parentElement.scrollTop=1e9;refreshUnread()}
let dmSending=false;async function sendDm(){const i=$("#dmi"),t=i.value.trim();if(!t||dmSending)return;dmSending=true;const btn=$("#sheet form .btn");btn&&(btn.disabled=true);
 const cid=Date.now().toString(36)+Math.random().toString(36).slice(2,8),box=$("#msgs"),d=document.createElement("div");d.className="msg me pend";d.dataset.cid=cid;d.innerHTML=esc(t)+"<small>กำลังส่ง…</small>";box.appendChild(d);box.parentElement.scrollTop=1e9;i.value="";
 try{await api("/dm",{method:"POST",body:JSON.stringify({to:chatPeer,text:t,cid})});await pollChat()}catch(e){d.remove();toast(e.message);i.value=t}finally{dmSending=false;btn&&(btn.disabled=false)}}
async function refreshUnread(){if(!tok)return;const j=await api("/me").catch(()=>null);if(j){const had=me?.role;me={...j.user,unread:j.unread};badge();if(had!=me.role)paintNp()}}
function badge(){const a=document.querySelector('#nav a[data-p="chat"]');if(!a)return;a.querySelector(".bdg")?.remove();if(me?.unread)a.insertAdjacentHTML("beforeend",`<span class="bdg">${me.unread>99?"99+":me.unread}</span>`)}
setInterval(()=>{if(!document.hidden&&!chatT)refreshUnread()},20000);
// ---------- terms ----------
function showTerms(){modal(`<div class="card glass"><h2>ข้อกำหนดและความเป็นส่วนตัว</h2><p>TopTop เป็นพื้นที่แบ่งปันรูปภาพและพูดคุยระหว่างสมาชิก โพสต์เฉพาะรูปที่คุณมีสิทธิ์ ห้ามโพสต์เนื้อหาผิดกฎหมาย ลามก รุนแรง ละเมิดผู้อื่น หรือภาพบุคคลอื่นโดยไม่ได้รับอนุญาต แอดมินลบเนื้อหาหรือระงับบัญชีได้</p>
 <p><b>ข้อมูลที่เก็บ</b>: ชื่อที่แสดง เบอร์โทรหรืออีเมล (ใช้เข้าสู่ระบบ) รหัสผ่านแบบเข้ารหัสทางเดียว รูปที่คุณโพสต์ ความเห็น ข้อความแชท และจำนวนหัวใจ รูปเก็บใน Google Drive ของผู้ดูแลระบบและเปิดดูได้ผ่านลิงก์ ข้อมูลอื่นเก็บบน Cloudflare</p>
 <p><b>สิทธิ์ของคุณ</b>: ขอดู แก้ไข หรือลบข้อมูลได้โดยติดต่อแอดมิน ลบรูปของตัวเองได้ทุกเมื่อ บล็อกหรือรายงานสมาชิกที่ไม่เหมาะสมได้จากโปรไฟล์ของเขา</p></div>`)}
// ---------- nav ----------
const NAV=[["home","home","หน้าแรก"],["rank","rank","อันดับ"],["plus","plus",""],["chat","chat","สนทนา"],["me","user","โปรไฟล์"]];
$("#nav").innerHTML=NAV.map(([k,ic,t])=>k=="plus"?`<a class="plus" data-p="plus" aria-label="โพสต์รูป"><span class="pb">${I("plus")}</span></a>`:`<a data-p="${k}">${I(ic)}<span>${t}</span></a>`).join("");
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>a.dataset.p=="plus"?composer():a.dataset.p=="home"&&tab=="home"?homeRefresh():(a.dataset.p=="home"?(go("home"),homeRefresh()):go(a.dataset.p)));
if(!$("#p-chat"))document.body.insertAdjacentHTML("beforeend",'<section class="page" id="p-chat"></section>');
function go(p){tab=p;document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.p==p));document.querySelectorAll(".page").forEach(x=>x.style.display="none");$("#ov").style.display="none";
 $("#feed").style.display=p=="home"?"":"none";document.body.classList.toggle("offfeed",p!="home");if(p!="home"){endBoost();$("#p-"+p).style.display="block";({rank,chat:chatPage,me:mePage})[p]()}badge();typeof newPill=="function"&&newPill()}
function sortBar(){let s=$(".sort");if(!s){s=document.createElement("div");s.className="sort glass";document.body.appendChild(s)}
 s.innerHTML=`<span class="${sortBy!="new"?"on":""}" data-s="time">เวลาเหลือ</span><span class="${sortBy=="new"?"on":""}" data-s="new">ใหม่ล่าสุด</span>`;s.querySelectorAll("span").forEach(x=>x.onclick=async()=>{sortBy=x.dataset.s;ls.set("tt_sort",sortBy);sortBar();await loadFeed();buildFeed()})}
(async()=>{$("#srch")&&($("#srch").innerHTML=I("search"));await loadFeed();const m=location.hash.match(/p=([\w-]+)/);go("home");buildFeed(m?m[1]:null);if(tok)refreshUnread();await music();tapToStart()})();

// ---------- time-added FX: big pop at each +1 ชม. (every 10,000 hearts), light pulse otherwise ----------
let gT=0;function gainFX(d,add){const t=performance.now();if(t-gT<(add>1?120:260))return;gT=t;const tm=d.querySelector(".timer");tm&&tm.animate&&tm.animate([{boxShadow:"0 0 0 0 rgba(47,224,255,0)"},{boxShadow:`0 0 ${add>1?26:14}px 2px rgba(47,224,255,.75)`},{boxShadow:"0 0 0 0 rgba(47,224,255,0)"}],{duration:add>1?420:300});
 }
function hourFX(d){const tm=d.querySelector(".timer");if(tm&&tm.animate)tm.animate([{transform:"translateX(-50%) scale(1)",boxShadow:"0 0 0 rgba(255,200,61,0)"},{transform:"translateX(-50%) scale(1.28)",boxShadow:"0 0 40px 6px rgba(255,200,61,.95)",offset:.3},{transform:"translateX(-50%) scale(1)",boxShadow:"0 0 0 rgba(255,200,61,0)"}],{duration:900,easing:"cubic-bezier(.2,.9,.3,1.2)"});
 floatBadge(d,"+1 ชม.",true);navigator.vibrate&&navigator.vibrate(25)}
function floatBadge(d,txt,big){const b=document.createElement("div");b.className="tbadge"+(big?" big":"");b.textContent=txt;d.appendChild(b);
 const an=b.animate([{transform:"translate(-50%,0) scale(.6)",opacity:0},{transform:"translate(-50%,-14px) scale(1.1)",opacity:1,offset:.2},{transform:`translate(-50%,-${big?70:40}px) scale(1)`,opacity:0}],{duration:big?1400:800,easing:"ease-out"});an.onfinish=()=>b.remove()}
// ---------- ขอเพลง (DJ 5฿): pick from the พอดีม่วน catalog -> transfer 5฿ via QR -> slip -> admin approval ----------
let DJC=null;async function djOpen(){if(!tok){toast("สมัครฟรีก่อน แล้วขอเพลงได้");return go("me")}const s=$("#sheet");s.className="glass on full";
 s.innerHTML=`<div class="hd"><b>${I("music")} ขอเพลง 5 บาท</b><button onclick="closeSheet()">${I("x")}</button></div><div class="bd" id="djb"><p class="m">เลือกเพลงจากคลังเพลงค่ายพอดีม่วน (เวอร์ชันเต็ม) แล้วโอน 5 บาท แอดมินตรวจสลิปแล้วเพลงจะเล่นต่อจากเพลงปัจจุบันให้ทุกคนฟัง</p>
 <input id="djq" placeholder="ค้นหาเพลง หรือชื่อศิลปิน" oninput="djList()"><div id="djl"><p class="m">กำลังโหลด...</p></div><div id="djmine"></div></div>`;
 DJC=DJC||await api("/catalog").catch(()=>[]);djList();DJFREE=!!(await api("/dj/free").catch(()=>({}))).free;if(DJFREE){$("#djb").insertAdjacentHTML("afterbegin",`<div class="freeb">🎁 <b>ฟรี 1 ครั้ง</b> คุณได้หัวใจเยอะสุดเมื่อวาน เลือกเพลงได้เลย ไม่ต้องโอน</div>`)}const mine=await api("/dj/mine").catch(()=>[]);if(mine.length)$("#djmine").innerHTML="<h3>คำขอของฉัน</h3>"+mine.map(r=>`<div class="row"><div class="t"><div>${esc(r.title)}</div><div class="m">${r.ref} · ${{pending:"รอตรวจสลิป",approved:"อนุมัติแล้ว ✓",rejected:"ไม่อนุมัติ"}[r.status]||r.status}</div></div></div>`).join("")}
function djList(){const q=($("#djq")?.value||"").trim().toLowerCase(),L=(DJC||[]).filter(c=>!q||c.title.toLowerCase().includes(q)).slice(0,80);
 $("#djl").innerHTML=L.map(c=>`<a class="row" onclick="djPick(${c.id})"><img src="https://i.ytimg.com/vi/${c.yid}/default.jpg" alt=""><div class="t"><div>${esc(c.title)}</div><div class="m">${c.dur?Math.floor(c.dur/60)+":"+String(c.dur%60).padStart(2,"0"):""}</div></div>${I("plus")}</a>`).join("")||'<p class="m">ไม่พบเพลง</p>'}
async function djPick(cid){const b=$("#djb");if(DJFREE){try{const r=await api("/dj/free",{method:"POST",body:JSON.stringify({cid})});DJFREE=false;b.innerHTML=`<div class="card" style="text-align:center"><div style="font-size:44px">🎉</div><h3>${esc(r.title)}</h3><p class="m">ใช้สิทธิ์ฟรีแล้ว! เพลงจะเล่นต่อจากเพลงปัจจุบันให้ทุกคนฟัง</p></div>`;setTimeout(music,1500)}catch(e){toast(e.message)}return}try{const r=await api("/dj",{method:"POST",body:JSON.stringify({cid})});
 b.innerHTML=`<h3 style="margin-top:4px">${esc(r.title)}</h3><div class="card" style="text-align:center"><div style="font:700 30px Prompt;background:var(--g);-webkit-background-clip:text;background-clip:text;color:transparent">โอน ${r.price} บาท</div>
  <img src="${API}/icons/pp-qr.jpg" alt="PromptPay QR" style="width:min(78vw,320px);border-radius:16px;margin:10px auto;display:block;background:#fff">
  <p class="m">ชื่อบัญชี นาย ชนะชัย แก้วกัญญา · สแกนด้วยแอปธนาคาร ใส่ยอด <b>${r.price} บาท</b> เอง</p>
  <p>รหัสอ้างอิง (ใส่ในบันทึกช่วยจำตอนโอน)</p><div style="font:700 26px Inter,Prompt;letter-spacing:2px;user-select:all" onclick="navigator.clipboard&&navigator.clipboard.writeText('${r.ref}');toast('คัดลอกแล้ว')">${r.ref}</div></div>
  <label class="pick" for="djs" id="djsv" style="height:24dvh">${I("up")}<b>แนบสลิปการโอน (จำเป็น)</b></label><input type="file" id="djs" accept="image/*" hidden>
  <div class="prog" id="djbar" style="display:none"><i></i></div><div class="m" id="djst"></div><button class="btn w" id="djgo">ส่งสลิปให้แอดมินตรวจ</button>`;
 let f=null;$("#djs").onchange=e=>{f=e.target.files[0];if(f)$("#djsv").innerHTML=`<img src="${URL.createObjectURL(f)}" alt="">`};
 $("#djgo").onclick=async()=>{const st=$("#djst");if(!f)return st.textContent="กรุณาแนบสลิปก่อน";const bt=$("#djgo");bt.disabled=true;$("#djbar").style.display="block";
  try{st.textContent="กำลังเตรียมสลิป...";const c=await compressImage(f,1280,400e3);const d=await driveSend(c.blob,q=>{$("#djbar").firstChild.style.width=Math.round(q*100)+"%";st.textContent="กำลังส่ง "+Math.round(q*100)+"%"});
   await api("/dj/slip",{method:"POST",body:JSON.stringify({id:r.id,drive:d})});b.innerHTML=`<div class="empty" style="height:auto;padding:40px 10px"><h2>ส่งแล้ว ✓</h2><p>แอดมินจะตรวจสลิป แล้วเพลง "${esc(r.title)}" จะเล่นต่อจากเพลงปัจจุบัน</p><p class="m">อ้างอิง ${r.ref}</p><button class="btn" onclick="closeSheet()">ตกลง</button></div>`}
  catch(e){st.textContent="ผิดพลาด: "+e.message;bt.disabled=false}}}catch(e){toast(e.message)}}

async function follow(id,el){if(!tok){toast("สมัครฟรีก่อน แล้วติดตามได้");return go("me")}const on=!FOL.has(id);try{const r=await api("/follow",{method:"POST",body:JSON.stringify({id,on})});on?FOL.add(id):FOL.delete(id);
 document.querySelectorAll("#fb"+id+",.sfb"+id).forEach(b=>{b.textContent=on?(b.classList.contains("sm")?"ติดตามแล้ว":"กำลังติดตาม ✓"):(b.classList.contains("sm")?"ติดตาม":"+ ติดตาม");b.classList.toggle("o",on)});
 const fc=$("#ov .fc b");if(fc)fc.textContent=nf(r.followers)}catch(e){toast(e.message)}}
setInterval(()=>{const m=$("#myfc");if(m&&!m.dataset.ok&&me){m.dataset.ok=1;api("/user/"+me.id).then(j=>m.innerHTML=`<b>${nf(j.user.followers)}</b> ผู้ติดตาม · <b>${nf(j.user.following)}</b> กำลังติดตาม`).catch(()=>{})}},700);
// ---------- search members (header icon) ----------
function searchOpen(){if(!tok){toast("สมัครฟรีก่อน แล้วค้นหาเพื่อนได้");return go("me")}const s=$("#sheet");s.className="glass on full";
 s.innerHTML=`<div class="hd"><button onclick="closeSheet()">${I("back")}</button><input id="sq" placeholder="ค้นหาชื่อสมาชิก" autocomplete="off" style="margin:0;flex:1"></div><div class="bd" id="sres"></div>`;
 let t=null;$("#sq").oninput=()=>{clearTimeout(t);t=setTimeout(searchRun,220)};setTimeout(()=>$("#sq").focus(),50)}
async function searchRun(){const q=$("#sq")?.value.trim(),r=$("#sres");if(!r)return;if(!q){r.innerHTML="";return}const L=await api("/users?q="+encodeURIComponent(q)).catch(()=>[]);if($("#sq")?.value.trim()!=q)return;
 L.forEach(u=>u.f?FOL.add(u.id):0);r.innerHTML=L.map(u=>`<div class="row" onclick="closeSheet();userPage(${u.id})">${avHtml(u)}<div class="t"><div>${esc(u.name)}</div></div><button class="btn sm sfb${u.id} ${u.f?"o":""}" onclick="event.stopPropagation();follow(${u.id},this)">${u.f?"ติดตามแล้ว":"ติดตาม"}</button></div>`).join("")}
// ---------- DJ nudge toast ----------
let djBack=0,djN=0;function djNudge(){const busy=$("#sheet.on")||$("#tts")||document.hidden||!PLS.length||Date.now()<djBack||tab!="home";let n=$("#djn");
 if(busy){n&&n.classList.remove("on");return}if(!n){n=document.createElement("div");n.id="djn";n.className="glass";n.innerHTML=`<span>อยากเปลี่ยนเพลงไหม? 🎵 เป็นดีเจแค่ 5 บาท</span><button aria-label="ปิด">${I("x")}</button>`;
  n.onclick=()=>{n.classList.remove("on");djOpen()};n.querySelector("button").onclick=e=>{e.stopPropagation();n.classList.remove("on");djBack=Date.now()+300000};document.body.appendChild(n)}
 n.classList.add("on");n.animate([{transform:"translate(-50%,0)"},{transform:"translate(-50%,-14px)"},{transform:"translate(-50%,0)"},{transform:"translate(-50%,-6px)"},{transform:"translate(-50%,0)"}],{duration:700,easing:"ease-out"})}
function djCycle(){let k=0;const b=()=>{if(k++<3){djNudge();setTimeout(b,4000)}else $("#djn")?.classList.remove("on")};b()}
setTimeout(()=>{djCycle();setInterval(djCycle,60000)},20000);
setInterval(()=>{if($("#sheet.on")||$("#tts"))$("#djn")?.classList.remove("on")},500);

// ---------- admin radio control + light sync poll ----------
async function radioCtl(action,cid){try{await api("/admin/radio",{method:"POST",body:JSON.stringify({action,cid})});toast(action=="skip"?"ข้ามเพลงแล้ว ทุกเครื่องจะเปลี่ยนตามในไม่กี่วินาที":"เล่นทันที ✓");closeSheet();await music()}catch(e){toast(e.message)}}
async function playNowOpen(){const s=$("#sheet");s.className="glass on full";s.innerHTML=`<div class="hd"><b>${I("music")} เล่นทันที (แอดมิน)</b><button onclick="closeSheet()">${I("x")}</button></div><div class="bd"><input id="pnq" placeholder="ค้นหาเพลงในคลัง"><div id="pnl"></div></div>`;
 DJC=DJC||await api("/catalog").catch(()=>[]);const f=()=>{const q=$("#pnq").value.trim().toLowerCase();$("#pnl").innerHTML=DJC.filter(c=>!q||c.title.toLowerCase().includes(q)).slice(0,80).map(c=>`<a class="row" onclick="radioCtl('play',${c.id})"><img src="https://i.ytimg.com/vi/${c.yid}/default.jpg" alt=""><div class="t"><div>${esc(c.title)}</div></div>▶︎</a>`).join("")};$("#pnq").oninput=f;f()}
setInterval(async()=>{if(document.hidden||!RAD)return;const j=await api("/radio").catch(()=>null);if(!j)return;const sig=j.start+":"+j.tracks.map(t=>t.id+"/"+t.dur).join(",");if(radioSig&&sig!=radioSig){RAD={start:j.start,off:j.now-Date.now()};PLS=j.tracks;radioPlay()}radioSig=sig},6000);
let radioSig="";

// ---------- follow from the feed (crown-plus badge on the avatar) ----------
async function feedFollow(uid){if(!tok)return go("me");const bs=document.querySelectorAll(".fu"+uid);bs.forEach(b=>{b.classList.add("ok");b.innerHTML="<b>✓</b>"});
 try{await api("/follow",{method:"POST",body:JSON.stringify({id:uid,on:true})});FOL.add(uid);navigator.vibrate&&navigator.vibrate(10);
  setTimeout(()=>bs.forEach(b=>{const an=b.animate([{transform:"translateX(-50%) scale(1)",opacity:1},{transform:"translateX(-50%) scale(1.25)",opacity:1,offset:.3},{transform:"translateX(-50%) scale(0)",opacity:0}],{duration:450,easing:"ease-in"});an.onfinish=()=>{b.closest(".avb")?.classList.remove("ring");b.remove()}}),650)}
 catch(e){bs.forEach(b=>{b.classList.remove("ok");b.innerHTML="<b>+</b>"});toast(e.message)}}
// ---------- crop / position editor (drag, pinch, slider zoom, 9:16 / 4:5 / 1:1) ----------
function cropEditor(file){return new Promise(async(done,fail)=>{let bm;try{bm=await loadBitmap(file)}catch(e){return fail(e)}
 const iw=bm.naturalWidth||bm.width,ih=bm.naturalHeight||bm.height,k=Math.min(1,1600/Math.max(iw,ih)),pc=document.createElement("canvas");pc.width=Math.round(iw*k);pc.height=Math.round(ih*k);pc.getContext("2d").drawImage(bm,0,0,pc.width,pc.height);
 const o=document.createElement("div");o.id="crop";o.innerHTML=`<div class="chd"><button class="x" id="cx">${I("x")}</button><b>จัดตำแหน่งรูป</b><button class="btn sm" id="cok">ใช้รูปนี้</button></div>
  <div class="cst" id="cstage"><div class="cfr" id="cfr"></div></div>
  <div class="cft"><div class="chips" style="justify-content:center">${[["9:16",9/16],["4:5",.8],["1:1",1]].map(([l,v],i)=>`<span class="chip${i?"":" on"}" data-r="${v}">${l}</span>`).join("")}</div>
  <input type="range" id="cz" min="1" max="4" step="0.01" value="1"><p class="m" style="text-align:center;margin:0">ลากเพื่อเลื่อน · ถ่างสองนิ้วหรือเลื่อนแถบเพื่อซูม</p></div>`;
 document.body.appendChild(o);const stg=$("#cstage"),fr=$("#cfr");fr.appendChild(pc);pc.className="cimg";
 let R=9/16,z=1,tx=0,ty=0,W=0,H=0,s0=1;
 const lay=()=>{const sw=stg.clientWidth-24,sh=stg.clientHeight-24;W=Math.min(sw,sh*R);H=W/R;fr.style.width=W+"px";fr.style.height=H+"px";s0=Math.max(W/iw,H/ih);clamp();paint()};
 const clamp=()=>{const s=s0*z,mx=Math.max(0,(iw*s-W)/2),my=Math.max(0,(ih*s-H)/2);tx=Math.max(-mx,Math.min(mx,tx));ty=Math.max(-my,Math.min(my,ty))};
 const paint=()=>{const s=s0*z;pc.style.width=iw*s+"px";pc.style.height=ih*s+"px";pc.style.transform=`translate(-50%,-50%) translate(${tx}px,${ty}px)`};
 o.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{o.querySelectorAll(".chip").forEach(x=>x.classList.remove("on"));c.classList.add("on");R=+c.dataset.r;lay()});
 const zr=$("#cz");zr.oninput=()=>{z=+zr.value;clamp();paint()};
 const P=new Map();let d0=0,z0=1;
 fr.addEventListener("pointerdown",e=>{fr.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size==2){const [a,b]=[...P.values()];d0=Math.hypot(a.x-b.x,a.y-b.y);z0=z}});
 fr.addEventListener("pointermove",e=>{const p=P.get(e.pointerId);if(!p)return;if(P.size==1){tx+=e.clientX-p.x;ty+=e.clientY-p.y}p.x=e.clientX;p.y=e.clientY;
  if(P.size==2){const [a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y);z=Math.max(1,Math.min(4,z0*d/(d0||1)));zr.value=z}clamp();paint()});
 const up=e=>{P.delete(e.pointerId)};fr.addEventListener("pointerup",up);fr.addEventListener("pointercancel",up);
 o.addEventListener("touchmove",e=>e.preventDefault(),{passive:false});
 const close=v=>{o.remove();removeEventListener("resize",lay);done(v)};$("#cx").onclick=()=>close(null);addEventListener("resize",lay);
 $("#cok").onclick=async()=>{const s=s0*z,sw=W/s,sh=H/s,sx=iw/2-tx/s-sw/2,sy=ih/2-ty/s-sh/2,oh=Math.min(1080/Math.max(1,R),Math.round(sh)),OW=Math.round(R>=1?Math.min(1080,sw):Math.min(1080*R,sw)),OH=Math.round(OW/R);
  const c=document.createElement("canvas");c.width=OW;c.height=OH;const g=c.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(bm,sx,sy,sw,sh,0,0,OW,OH);
  const b=await new Promise(ok=>c.toBlob(ok,"image/jpeg",.92));close(new File([b],"crop.jpg",{type:"image/jpeg"}))};
 requestAnimationFrame(lay)})}

// ---------- live room: floating chat overlay + presence ----------
const LV={since:0,join:Date.now(),hide:ls.get("tt_lchide",false),idle:0,t:0,busy:0,muted:false};
function lcBuild(){if($("#lc"))return;const d=document.createElement("div");d.id="lc";
 d.innerHTML=`<div class="lcm" id="lcm"></div><div class="lcb"><button class="lct" id="lct" aria-label="ซ่อนแชท"></button><form id="lcf"><input id="lci" maxlength="120" placeholder="พิมพ์คุยกัน…" enterkeyhint="send" autocomplete="off"><button type="submit" id="lcs" aria-label="ส่ง" disabled><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg></button></form></div>`;
 document.body.appendChild(d);$("#lct").onclick=()=>{LV.hide=!LV.hide;ls.set("tt_lchide",LV.hide);if(LV.hide)$("#lcm").innerHTML="";lcVis();if(!LV.hide){LV.since=0;livePoll()}};
 $("#lcf").onsubmit=async e=>{e.preventDefault();const i=$("#lci"),t=i.value.trim();if(!t||LV.busy)return;if(!tok){toast("สมัครฟรีก่อน แล้วคุยได้เลย");return go("me")}
  LV.busy=1;LV.sync();try{await api("/chat",{method:"POST",body:JSON.stringify({text:t})});i.value="";LV.idle=0;livePoll()}catch(x){toast(x.message)}finally{LV.busy=0;LV.sync()}};
 const inp=$("#lci"),sb=$("#lcs");LV.sync=()=>sb.disabled=LV.busy||!inp.value.trim();inp.oninput=()=>{LV.sync();lcWake()};inp.onfocus=lcWake;d.addEventListener("pointerdown",lcWake,true);lcWake();
 lcVis()}
function lcWake(){const m=$("#lcm");if(!m)return;m.classList.remove("dim");clearTimeout(LV.dt);LV.dt=setTimeout(()=>{if(document.activeElement?.id=="lci"&&$("#lci").value)return lcWake();m.classList.add("dim")},10000)}
function lcVis(){const d=$("#lc");if(!d)return;d.style.display=tab=="home"?"":"none";d.classList.toggle("off",LV.hide);$("#lct").innerHTML=LV.hide?'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5" stroke-linecap="round"/></svg>':I("x")}
function lcAdd(ms){const box=$("#lcm");if(!box||LV.hide)return;for(const x of ms){if(box.querySelector(`[data-i="${x.id}"]`))continue;const e=document.createElement("div");e.className="lcx";e.dataset.i=x.id;
  e.innerHTML=`${avHtml({name:x.name,avatar:x.avatar},"av")}<p><b>${esc(x.name)}</b> ${esc(x.text)}</p>`;if(me?.role=="admin")e.onclick=()=>lcMod(x);box.appendChild(e);LV.fresh=1}
 if(LV.fresh){LV.fresh=0;lcWake()}const all=[...box.children];all.slice(0,Math.max(0,all.length-8)).forEach(e=>e.remove());[...box.children].forEach((e,i,a)=>e.style.opacity=Math.min(1,.35+(i+1)/a.length))}
async function lcMod(x){const c=prompt(`ข้อความของ ${x.name}\n1 = ลบข้อความนี้\n2 = ปิดแชทคนนี้ + ลบข้อความทั้งหมด\n3 = เปิดแชทคืน`,"1");try{
 if(c=="1")await api("/admin/chat",{method:"DELETE",body:JSON.stringify({id:x.id})});else if(c=="2")await api("/admin/chat",{method:"POST",body:JSON.stringify({uid:x.uid,mute:1,purge:1})});else if(c=="3")await api("/admin/chat",{method:"POST",body:JSON.stringify({uid:x.uid,mute:0})});else return;
 toast("เรียบร้อย");$("#lcm").innerHTML="";LV.since=0;livePoll()}catch(e){toast(e.message)}}
async function livePoll(){clearTimeout(LV.t);if(document.hidden)return;lcBuild();lcVis();
 try{const showing=tab=="home"&&!LV.hide,q=showing?LV.since:-1;const j=await api("/live?since="+(q<0?LV.since||1e15:q));
  onlinePaint(j.online);
  if(showing&&j.msgs.length){lcAdd(j.msgs);LV.since=j.msgs[j.msgs.length-1].id;LV.idle=0}else LV.idle++;
}catch(e){LV.idle++}
 const ms=document.hidden?0:(tab=="home"&&!LV.hide?(LV.idle<15?2500:5000):8000);if(ms)LV.t=setTimeout(livePoll,ms)}
document.addEventListener("visibilitychange",()=>{if(!document.hidden){LV.idle=0;livePoll()}else clearTimeout(LV.t)});
// admin dashboard on top of the admin panel
const _admin=admin;admin=async function(){await _admin();const a=$("#adm");if(!a)return;try{const d=await api("/admin/dash");const c=document.createElement("div");c.className="dash";
 c.innerHTML=[["สมาชิกทั้งหมด",d.members],["ออนไลน์ตอนนี้",d.online],["สมัครใหม่วันนี้",d.newToday],["รูปที่ยังมีชีวิต",d.live],["หัวใจวันนี้",d.heartsToday]].map(([l,v])=>`<div><b>${nf(v)}</b><span>${l}</span></div>`).join("");a.prepend(c)}catch(e){}};
const _go=go;go=function(...a){const r=_go.apply(this,a);setTimeout(()=>{lcVis();if(tab=="home"&&!LV.hide){LV.idle=0;livePoll()}},0);return r};
setTimeout(livePoll,1500);

// ---------- online-now pill (top centre, next to the lifetime countdown) ----------
function onlinePaint(n){let p=$("#onl");if(n==null)return;if(!p){p=document.createElement("div");p.id="onl";document.body.appendChild(p)}
 p.innerHTML=`<i></i>ออนไลน์ <b>${nf(Math.max(1,n))}</b> คน`;p.style.display=tab=="home"?"":"none";document.body.classList.toggle("hasonl",tab=="home")}
// ---------- onboarding for brand-new signups (once per account) ----------
const OB=[["👆","ปัดดูรูป","ปัดขึ้น-ลงเพื่อดูรูปของทุกคน รูปไหนชอบ แวะกดหัวใจให้เลย"],["❤️","ใจรัว = ต่อชีวิตรูป","ทุกรูปมีเวลาจำกัด รัวหัวใจให้รูปที่ชอบ ทุก 10,000 หัวใจ = +1 ชม."],["➕","โพสต์รูปของคุณ","กดปุ่ม + ตรงกลาง เลือกรูป จัดกรอบ แล้วโพสต์ เริ่มต้นมีชีวิต 1 ชม."],["🎵","เป็นดีเจแค่ 5 บาท","อยากเปลี่ยนเพลงที่ทุกคนฟังอยู่? กดไอคอนเพลงด้านบน เลือกเพลง โอน 5 บาท"],["💬","แชทสด & ติดตาม","คุยกับทุกคนได้สดๆ ที่ช่องแชทด้านซ้าย และกด + ที่รูปโปรไฟล์เพื่อติดตามคนที่ชอบ"]];
function onboard(){if(!me?.id||!ls.get("tt_new_"+me.id,0)||ls.get("tt_onb_"+me.id,0)||$("#onb"))return;
 const o=document.createElement("div");o.id="onb";o.innerHTML=`<div class="obc"><div class="obs" id="obs">${OB.map(([e,t,d])=>`<section><div class="obe">${e}</div><h3>${t}</h3><p>${d}</p></section>`).join("")}</div>
  <div class="obd">${OB.map((_,i)=>`<i${i?"":' class="on"'}></i>`).join("")}</div><div class="obb"><button id="obk">ข้าม</button><button class="btn" id="obn">ถัดไป</button></div></div>`;
 document.body.appendChild(o);const s=$("#obs"),cur=()=>Math.round(s.scrollLeft/s.clientWidth),done=()=>{ls.set("tt_onb_"+me.id,1);localStorage.removeItem("tt_new_"+me.id);o.classList.add("bye");setTimeout(()=>o.remove(),300)};
 s.onscroll=()=>{const i=cur();o.querySelectorAll(".obd i").forEach((d,k)=>d.classList.toggle("on",k==i));$("#obn").textContent=i==OB.length-1?"เริ่มเลย!":"ถัดไป"};
 $("#obk").onclick=done;$("#obn").onclick=()=>{const i=cur();if(i>=OB.length-1)return done();s.scrollTo({left:(i+1)*s.clientWidth,behavior:"smooth"})}}
const _go2=go;go=function(...a){const r=_go2.apply(this,a);const p=$("#onl");if(p){p.style.display=tab=="home"?"":"none";document.body.classList.toggle("hasonl",tab=="home")}if(tab=="home")setTimeout(onboard,600);return r};

// ---------- compact admin queue: overflow menu + catalog search (songs not already queued) ----------
function plSearch(){const A=$("#adm"),q=$("#plsq").value.trim().toLowerCase(),r=$("#plsr");if(!q){r.innerHTML="";return}const inQ=new Set((A._pl||[]).map(s=>s.yid));
 const L=(A._cat||[]).filter(c=>c.active&&!inQ.has(c.yid)&&c.title.toLowerCase().includes(q)).slice(0,30);
 r.innerHTML=L.map(c=>{const [t,...ar]=c.title.split(" - ");return `<div class="pq"><div class="t"><b>${esc(t)}</b><small>${esc(ar.join(" - "))}</small></div><button class="mo" aria-label="เล่นทันที" onclick="radioCtl('play',${c.id})">▶︎</button><button class="add" aria-label="เพิ่มเข้าคิว" onclick="plAdd(${c.id})">+</button></div>`}).join("")||'<p class="m">ไม่พบเพลงที่ยังไม่อยู่ในคิว</p>'}
function plMenu(e,i){e.stopPropagation();$("#plm")?.remove();const A=$("#adm"),s=A._pl[i],c=(A._cat||[]).find(c=>c.yid==s.yid),m=document.createElement("div");m.id="plm";m.className="glass";
 m.innerHTML=`<button onclick="plMove(${i},-1)">↑ เลื่อนขึ้น</button><button onclick="plMove(${i},1)">↓ เลื่อนลง</button>${c?`<button onclick="radioCtl('play',${c.id})">▶︎ เล่นทันที</button>`:""}<button class="del" onclick="plDel(${s.id})">✕ ลบออกจากคิว</button>`;
 document.body.appendChild(m);const r=e.target.getBoundingClientRect();m.style.top=Math.min(innerHeight-200,r.bottom+4)+"px";m.style.right=(innerWidth-r.right)+"px";setTimeout(()=>addEventListener("click",()=>m.remove(),{once:true}),0)}

// ---------- location (Thai admin dataset, static JSON from kongvut/thai-province-data, MIT) ----------
let TH=null,LOCNUDGED=0,DJFREE=false;const BKK="กรุงเทพมหานคร";
const locText=x=>{const b=x.prov==BKK;return [x.vill&&(x.vill.match(/^(บ้าน|หมู่)/)?x.vill:"บ."+x.vill),x.tamb&&(b?"แขวง":"ต.")+x.tamb,x.amph&&(b?"เขต":"อ.")+x.amph,b?x.prov:"จ."+x.prov].filter(Boolean).join(" ")};
async function locPicker(box){LOCNUDGED=0;box.innerHTML=`<div class="lh">📍 พื้นที่ของคุณ <b class="req">*</b> <small>จังหวัด/อำเภอ/ตำบล จำเป็น · หมู่บ้านไม่บังคับ</small></div><div class="lg"><select id="lp"><option value="">จังหวัด</option></select><select id="la" disabled><option value="">อำเภอ</option></select><select id="lt" disabled><option value="">ตำบล</option></select><input id="lv" maxlength="60" placeholder="หมู่บ้าน (พิมพ์เอง)"></div>`;
 TH=TH||await fetch("thai.json").then(r=>r.json()).catch(()=>[]);const P=$("#lp"),A=$("#la"),T=$("#lt"),V=$("#lv"),o=(L,ph)=>`<option value="">${ph}</option>`+L.map(n=>`<option>${esc(n)}</option>`).join("");
 P.innerHTML=o(TH.map(p=>p[0]),"จังหวัด");const fa=()=>{const p=TH.find(p=>p[0]==P.value);A.innerHTML=o(p?p[1].map(a=>a[0]):[],P.value==BKK?"เขต":"อำเภอ");A.disabled=!p;fa2()},fa2=()=>{const p=TH.find(p=>p[0]==P.value),am=p&&p[1].find(a=>a[0]==A.value);T.innerHTML=o(am?am[1]:[],P.value==BKK?"แขวง":"ตำบล");T.disabled=!am;V.disabled=!T.value};
 const ok=()=>{const b=$("#cgo");if(b)b.disabled=!(P.value&&A.value&&T.value);if(P.value&&A.value&&T.value)box.classList.remove("nudge")};P.onchange=()=>{fa();ok()};A.onchange=()=>{fa2();ok()};T.onchange=()=>{V.disabled=!T.value;ok()};box._ok=ok;
 const d=ls.get("tt_loc",null);if(d&&d.prov){P.value=d.prov;fa();A.value=d.amph||"";fa2();T.value=d.tamb||"";V.disabled=!T.value;V.value=d.vill||""}else fa();ok()}
function locVal(){const g=i=>($(i)?.value||"").trim();const L={prov:g("#lp")};if(L.prov)L.amph=g("#la");if(L.amph)L.tamb=g("#lt");if(L.tamb)L.vill=g("#lv");return L}
// ---------- area ranking ----------
let AR={lvl:1,parent:"",trail:[]};const LV_N=["","จังหวัด","อำเภอ","ตำบล","หมู่บ้าน"];
async function areaRank(){const p=$("#p-rank");
 p.innerHTML=`<h2>อันดับ</h2><div class="chips"><span class="chip" onclick="rankTab='live';rank()">เวลาเหลือมากสุด</span><span class="chip" onclick="rankTab='hall';rank()">Hall of Fame</span><span class="chip on">พื้นที่</span></div>
 <div class="chips sub">${[1,2,3,4].map(l=>`<span class="chip${AR.lvl==l&&!AR.parent?" on":""}" onclick="AR={lvl:${l},parent:'',trail:[]};areaRank()">${LV_N[l]}</span>`).join("")}</div>
 ${AR.parent?`<div class="crumb"><a onclick="AR.trail.pop();const t=AR.trail[AR.trail.length-1];AR.parent=t?t.key:'';AR.lvl=t?t.lvl+1:1;areaRank()">← ย้อนกลับ</a> · ${AR.trail.map(t=>esc(t.name)).join(" › ")}</div>`:""}
 <p class="m">รวมหัวใจทุกโพสต์ในพื้นที่ (นับรวมรูปที่หมดเวลาแล้ว)</p><div id="arl"><p class="m">กำลังโหลด...</p></div>`;
 const L=await api(`/areas?lvl=${AR.lvl}${AR.parent?"&parent="+encodeURIComponent(AR.parent):""}`).catch(()=>[]);
 $("#arl").innerHTML=L.map((r,i)=>{const ctx=r.key.split("|").slice(0,-1).reverse().join(" · ");return `<a class="row arow" ${AR.lvl<4?`onclick='areaDown(${JSON.stringify({key:r.key,name:r.name,lvl:AR.lvl}).replace(/'/g,"&#39;")})'`:""}><div class="rk${i==0?" c1":""}">${i+1}</div><div class="t"><div>${esc(r.name)}</div><div class="m">${esc(ctx)}${ctx?" · ":""}${nf(r.posts)} โพสต์</div></div><div class="ah">❤️ ${nf(r.hearts)}</div></a>`}).join("")||'<div class="card glass">ยังไม่มีพื้นที่ในอันดับ ลองโพสต์พร้อมใส่พื้นที่สิ!</div>'}
function areaDown(t){AR.trail.push(t);AR.parent=t.key;AR.lvl=t.lvl+1;areaRank()}
// ---------- album hint (first time a multi-photo post appears) ----------
const AH=new Set(ls.get("tt_ahint",[]));function albHint(d,x){if(AH.has(x.id))return;const ob=new IntersectionObserver(es=>{if(!es[0].isIntersecting||es[0].intersectionRatio<.6)return;ob.disconnect();AH.add(x.id);ls.set("tt_ahint",[...AH].slice(-200));
 const h=document.createElement("div");h.className="ahint";h.innerHTML="ปัดดูรูปอื่นได้ <span>→</span>";d.querySelector(".ph").appendChild(h);setTimeout(()=>h.classList.add("bye"),2000);setTimeout(()=>h.remove(),2700)},{threshold:[.6]});ob.observe(d)}
// ---------- auto-scroll ----------
const AS={on:false,sec:ls.get("tt_as_sec",5),el:0,last:0,touch:0,raf:0};
function asBind(b){let lp=null,long=false;b.addEventListener("pointerdown",e=>{long=false;lp=setTimeout(()=>{long=true;asMenu(b)},450)});b.addEventListener("pointerup",()=>{clearTimeout(lp);if(!long)asToggle()});b.addEventListener("pointerleave",()=>clearTimeout(lp));b.oncontextmenu=e=>e.preventDefault()}
function asPaint(){document.querySelectorAll(".asb").forEach(b=>{b.classList.toggle("on",AS.on);b.querySelector(".ass").textContent=AS.on?AS.sec+" วิ":"อัตโนมัติ"});let bar=$("#asbar");if(!bar){bar=document.createElement("div");bar.id="asbar";bar.innerHTML="<i></i>";document.body.appendChild(bar)}bar.style.display=AS.on&&tab=="home"?"":"none"}
function asToggle(){AS.on=!AS.on;AS.el=0;AS.last=performance.now();asPaint();toast(AS.on?`เลื่อนอัตโนมัติ ทุก ${AS.sec} วิ (กดค้างเพื่อเปลี่ยนความเร็ว)`:"ปิดเลื่อนอัตโนมัติ");if(AS.on)asLoop()}
function asMenu(b){$("#asm")?.remove();const m=document.createElement("div");m.id="asm";m.className="glass";m.innerHTML="<small>ความเร็ว</small>"+[3,5,8,12].map(s=>`<button class="${s==AS.sec?"on":""}" data-s="${s}">${s} วิ</button>`).join("");document.body.appendChild(m);
 const r=b.getBoundingClientRect();m.style.top=Math.max(60,r.top-40)+"px";m.style.right=(innerWidth-r.left+8)+"px";
 m.querySelectorAll("button").forEach(x=>x.onclick=e=>{e.stopPropagation();AS.sec=+x.dataset.s;ls.set("tt_as_sec",AS.sec);m.remove();if(!AS.on)asToggle();else{AS.el=0;asPaint()}});setTimeout(()=>addEventListener("click",()=>m.remove(),{once:true}),0)}
const asPaused=()=>document.hidden||tab!="home"||AS.touch||document.activeElement?.tagName=="INPUT"||$("#sheet.on")||$("#crop")||$("#onb")||$("#tts")||$("#asm")||($("#ov")&&getComputedStyle($("#ov")).display!="none"&&$("#ov").offsetHeight>0)||$("#modal.on");
function asLoop(){cancelAnimationFrame(AS.raf);const step=t=>{if(!AS.on)return;const dt=Math.min(100,t-(AS.last||t));AS.last=t;if(!asPaused())AS.el+=dt;const q=Math.min(1,AS.el/(AS.sec*1000));const bi=$("#asbar i");if(bi)bi.style.transform=`scaleX(${q})`;
 if(q>=1){AS.el=0;const f=$("#feed"),h=f.clientHeight;AS.auto=1;if(f.scrollTop+h*1.5>=f.scrollHeight)f.scrollTo({top:0,behavior:"smooth"});else f.scrollTo({top:Math.round(f.scrollTop/h+1)*h,behavior:"smooth"});setTimeout(()=>AS.auto=0,900)}AS.raf=requestAnimationFrame(step)};AS.raf=requestAnimationFrame(step)}
addEventListener("pointerdown",e=>{if(e.target.closest?.("#feed"))AS.touch=1},true);addEventListener("pointerup",()=>setTimeout(()=>AS.touch=0,800),true);addEventListener("pointercancel",()=>setTimeout(()=>AS.touch=0,800),true);
setTimeout(()=>{const f=$("#feed");f&&f.addEventListener("scroll",()=>{if(AS.on&&!AS.auto)AS.el=0},{passive:true})},2000);
// ---------- free DJ celebration ----------
setTimeout(async()=>{if(!tok)return;const r=await api("/dj/free").catch(()=>null);if(!r?.free||ls.get("tt_freecel",0)==r.d)return;ls.set("tt_freecel",r.d);
 const o=document.createElement("div");o.id="cele";o.innerHTML=`<div class="obc glass"><div class="cf">🏆</div><h3>คุณได้หัวใจเยอะสุดวันนี้!</h3><p>รับสิทธิ์ <b>เปลี่ยนเพลงฟรี 1 ครั้ง</b> 🎵<br><small>ใช้ได้ถึงเที่ยงคืนวันนี้ (${nf(r.hearts)} หัวใจ)</small></p><button class="btn" id="celgo">เลือกเพลงเลย</button><button class="lnk" id="celx">ไว้ทีหลัง</button></div>`;
 document.body.appendChild(o);$("#celgo").onclick=()=>{o.remove();djOpen()};$("#celx").onclick=()=>o.remove()},2500);
const _go3=go;go=function(...x){const r=_go3.apply(this,x);asPaint();return r};
