const API=window.YM_API||"",AB="https://abacus.jasoncameron.dev",NS="youmuan-pdm",CH="UCpjChoKuoBGQ368LdINenDg";
const ROSTER=["รำไพ แสงทอง","พร จันทพร","เมย์ จิราพร","ขวัญ พัชรี","จุ๊บแจง เจนจิรา","โชติ ณัฐชัย","นิค สะเลอปี้","วงค์ ชนะกันต์","การ์เนต สะเลอปี้","การ์ฟิวส์ สะเลอปี้"];
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>"&"+"#"+c.charCodeAt(0)+";");
const ls={get:(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch(e){return d}},set:(k,v)=>localStorage[k]=JSON.stringify(v)};
// ---------- white line icons ----------
const P={bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',fire:'<path d="M12 22c4 0 7-2.8 7-7 0-4-3-6.5-4-10-2 2-2.5 4-2.5 5.5C11 9 10 7.5 10 5 7 7.5 5 11 5 15c0 4.2 3 7 7 7z"/>',
gift:'<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M12 8S10.5 3 7.8 3.6C5.5 4.1 6.6 8 12 8zm0 0s1.5-5 4.2-4.4C18.5 4.1 17.4 8 12 8z"/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9 18h6"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
heart:'<path d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/>',
hearts:'<path d="M9 18.5S2.5 14.5 2.5 9.8a3.6 3.6 0 0 1 6.5-2 3.6 3.6 0 0 1 6.5 2"/><path d="M15.5 21s-5-3.2-5-6.8a2.8 2.8 0 0 1 5-1.6 2.8 2.8 0 0 1 5 1.6c0 3.6-5 6.8-5 6.8z"/>',
chat:'<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',share:'<path d="M14 4l7 7-7 7M21 11H10a6 6 0 0 0-6 6v3"/>',
up:'<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
vol:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6"/>',volon:'<path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',play:'<path d="M7 4v16l13-8z"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',logout:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>'};
const I=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24">${P[n]}</svg>`;
// ---------- state ----------
let V=[],S={},cur=null,tok=ls.get("ym_tok",null),me=null,muted=ls.get("ym_muted",true),playing=false;
const dev=ls.get("ym_dev",null)||(ls.set("ym_dev",Math.random().toString(36).slice(2)+Date.now().toString(36)),ls.get("ym_dev"));
const nf=n=>(n=+n||0)>=1e9?(n/1e9).toFixed(1)+"B":n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":String(n);
const artistOf=t=>ROSTER.find(r=>t.includes(r)||t.includes(r.split(" ")[0]))||"พอดีม่วน STUDIO";
const st=id=>S[id]||(S[id]={pts:0,likes:0,spam:0,cm:0});
const yv=v=>v.yid||v.id;const thumb=v=>v.platform=="drive"?(v.poster||""):v.poster?v.poster:v.kind=="link"?"":`https://i.ytimg.com/vi/${yv(v)}/${v.kind=="short"?"oardefault":"hqdefault"}.jpg`;
const hq=id=>`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function toast(t){const x=document.createElement("div");x.textContent=t;x.style.cssText="position:fixed;top:42%;left:50%;transform:translateX(-50%);background:#000;border:1px solid #fff5;padding:10px 18px;border-radius:12px;z-index:99;font:300 14px Kanit;pointer-events:none";document.body.appendChild(x);setTimeout(()=>x.remove(),2000)}
// ---------- backend ----------
async function api(p,o={}){const r=await fetch(API+p,{...o,headers:{"content-type":"application/json",...(tok?{authorization:"Bearer "+tok}:{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||r.status);return j}
const abKey=(k,id)=>(k+"-"+id).replace(/[^A-Za-z0-9_-]/g,"_").slice(0,64);
async function abGet(k,id){try{return (await (await fetch(`${AB}/get/${NS}/${abKey(k,id)}`)).json()).value||0}catch(e){return 0}}
const abHit=(k,id)=>fetch(`${AB}/hit/${NS}/${abKey(k,id)}`).catch(()=>{});
async function loadStats(ids){ids=ids.filter(i=>!S[i]?.loaded);if(!ids.length)return;
 if(API){for(let i=0;i<ids.length;i+=100){const j=await api("/stats?ids="+ids.slice(i,i+100).join(",")).catch(()=>({}));ids.slice(i,i+100).forEach(id=>Object.assign(st(id),j[id]||{},{loaded:1}))}}
 else await Promise.all(ids.map(async id=>{const [p,s,bb]=await Promise.all([abGet("p",id),abGet("s",id),abGet("b",id)]);Object.assign(st(id),{pts:p*10000,spam:s+bb*100,loaded:1})}));
 paintAll()}
const Q={pts:{},spam:{},boost:{}},q=(k,id,n)=>Q[k][id]=(Q[k][id]||0)+n;let abQ=[];
async function flush(){const b={pts:Q.pts,spam:Q.spam,boost:Q.boost};Q.pts={};Q.spam={};Q.boost={};if(!Object.keys(b.pts).length&&!Object.keys(b.spam).length&&!Object.keys(b.boost).length)return;
 if(API){if(tok)api("/batch",{method:"POST",body:JSON.stringify(b),keepalive:true}).then(j=>j.claimable?.length&&celebrate(j.claimable[0])).catch(()=>{})}
 else{for(const id in b.pts)for(let i=0;i<b.pts[id];i++)abQ.push(["p",id]);for(const id in b.spam)for(let i=0;i<Math.min(b.spam[id],200);i++)abQ.push(["s",id]);for(const id in b.boost)for(let i=0;i<Math.min(b.boost[id],200);i++)abQ.push(["b",id])}}
setInterval(flush,5000);addEventListener("pagehide",()=>{flush();sendWatch()});
setInterval(()=>abQ.splice(0,3).forEach(([k,id])=>abHit(k,id)),1000);
// honest แต้มสะสม: send visible+playing seconds; server caps per clip/day and per day
let W={vid:null,secs:0,done:false};
function sendWatch(){if(!API||!tok||!W.vid||(!W.secs&&!W.done))return;const b={vid:W.vid,secs:Math.min(W.secs,20),done:W.done};W.secs=0;W.done=false;
 api("/watch",{method:"POST",body:JSON.stringify(b),keepalive:true}).then(j=>{if(j.gained){me&&(me.points=j.balance);toast("+"+j.gained+" แต้มสะสม")}}).catch(()=>{})}
setInterval(sendWatch,15000);
// ---------- link clips (any platform) ----------
function detect(url){let u;try{u=new URL(url)}catch(e){return {platform:"link"}}const h=u.hostname.replace(/^www\.|^m\./,""),s=u.href;let m;
 if(/youtube\.com|youtu\.be/.test(h)&&(m=s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/)))return {platform:"youtube",yid:m[1],vertical:/shorts/.test(s)};
 if(/tiktok\.com/.test(h)&&(m=s.match(/video\/(\d+)/)))return {platform:"tiktok",embed:"https://www.tiktok.com/embed/v2/"+m[1],vertical:true};
 if(/instagram\.com/.test(h)&&(m=s.match(/\/(p|reel|reels|tv)\/([\w-]+)/)))return {platform:"instagram",embed:"https://www.instagram.com/"+(m[1]=="reels"?"reel":m[1])+"/"+m[2]+"/embed",vertical:true};
 if(/facebook\.com|fb\.watch/.test(h)){const A=String.fromCharCode(38),fm=s.match(/\/(reel|videos)\/(\d+)/)||s.match(/[?&]v=(\d+)/)&&[0,"videos",s.match(/[?&]v=(\d+)/)[1]];
  if(!fm)return {platform:"facebook",vertical:true};const href="https://www.facebook.com/"+(fm[1]=="reel"?"reel/":"watch/?v=")+fm[2];
  return {platform:"facebook",fbembed:"https://www.facebook.com/plugins/video.php?show_text=false"+A+"autoplay=true"+A+"mute=true"+A+"allowfullscreen=true"+A+"href="+encodeURIComponent(href),canon:href,vertical:fm[1]=="reel"}}
 if(/\.(mp4|webm|mov|m3u8)(\?|$)/i.test(u.pathname))return {platform:"mp4",vertical:true};
 return {platform:"link"}}
const PL={upload:"อัปโหลด",drive:"อัปโหลด",youtube:"YouTube",tiktok:"TikTok",instagram:"Instagram",facebook:"Facebook",mp4:"วิดีโอ",link:"ลิงก์"};
// ---------- data ----------
async function loadVideos(){let up=[];if(API)up=(await api("/clips").catch(()=>[])).map(c=>{if(c.public_id=="drive"){const fid=(c.url.match(/\/file\/d\/([\w-]+)/)||[])[1];return {...c,platform:"drive",kind:"upload",vertical:true,fid,url:API+"/media/"+fid,preview:"https://drive.google.com/file/d/"+fid+"/preview",poster:c.thumb||""}}const d=detect(c.url);return d.platform=="youtube"?{...c,...d,kind:d.vertical?"short":"video",artist:c.artist}:{...c,...d,kind:"link"}});
 V=up.map(v=>({...v,artist:v.artist||artistOf(v.title||"")}))}
// ---------- feed ----------
function clipEl(v,i){const d=document.createElement("section");d.className="clip";d.dataset.i=i;d.dataset.id=v.id;
 d.innerHTML=`<div class="bg" style="background-image:url('${thumb(v)}')"></div><div class="media ${v.kind=="video"||(v.kind=="link"&&!v.vertical)?"wide":""}">${v.kind=="link"?`<div class="lcard">${I("share")}<b>${PL[v.platform]}</b><p>${esc(v.title)}</p><a class="btn" href="${esc(v.canon||v.url)}" target="_blank" rel="noopener">${v.platform=="facebook"?"เปิดดูบน Facebook":"เปิดลิงก์"}</a></div>`:(thumb(v)?`<img loading="lazy" src="${thumb(v)}"${isYT(v)?` onerror="this.src='${hq(yv(v))}'"`:` onerror="this.remove()"`}>`:"")}</div><div class="tap"></div><button class="mute"></button>
 <div class="side"><div class="av">${esc(v.artist[0])}</div>
 <button class="sp">${I("hearts")}<b class="ns">0</b><small>หัวใจรัว</small></button>
 <button class="cmb">${I("chat")}<b class="nc">0</b><small>ความเห็น</small></button>
 <button class="sh">${I("share")}<small>แชร์</small></button></div>
 <div class="meta"><div class="ar" onclick="artistPage(this.dataset.a)" data-a="${esc(v.artist)}">@${esc(v.artist)}</div><div class="ti">${esc(v.title)}</div><div class="m">${I("music")}${v.url?"คลิปจากศิลปิน · "+PL[v.platform]:"พอดีม่วน STUDIO"}</div></div>`;
 const tp=d.querySelector(".tap");let pd=null;tp.addEventListener("pointerdown",e=>{pd={x:e.clientX,y:e.clientY,t:Date.now()}});tp.addEventListener("pointercancel",()=>pd=null);tp.addEventListener("pointerup",e=>{if(pd&&Math.hypot(e.clientX-pd.x,e.clientY-pd.y)<12&&Date.now()-pd.t<500)onTap(d,v,e);pd=null});tp.addEventListener("dblclick",e=>e.preventDefault());
 const sp=d.querySelector(".sp");sp.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();const r=sp.getBoundingClientRect();heart(d,v,{clientX:r.left+r.width/2-40+Math.random()*30,clientY:r.top})},{passive:false});sp.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});
 d.querySelector(".cmb").onclick=()=>openCm(v);d.querySelector(".sh").onclick=()=>share(v);const mb=d.querySelector(".mute");mb.addEventListener("pointerdown",e=>e.stopPropagation());mb.onclick=e=>{e.stopPropagation();setMute(!muted)};return d}
function paint(d){const s=st(d.dataset.id);d.querySelector(".ns").textContent=nf(s.spam);d.querySelector(".nc").textContent=nf(s.cm)}
const paintAll=()=>document.querySelectorAll(".clip").forEach(paint);
const ytCmd=(f,fn)=>f?.contentWindow?.postMessage(JSON.stringify({event:"command",func:fn,args:[]}),"*");
// ---------- iOS-first playback: ONE persistent YouTube player (never re-created) ----------
// It sits fixed behind the feed; the current clip becomes transparent over it once the scroll settles.
// Swipes only send loadVideoById (no new iframe = fast start, no iOS autoplay re-checks). Link clips (TikTok/FB/IG/mp4) mount in-clip.
const isYT=v=>!!v&&v.platform=="youtube"&&!!v.yid;let YTP=null,plReady=false,plVid=null,started=sessionStorage.ym_started=="1";
function plEl(){if(YTP)return YTP;const w=document.createElement("div");w.id="player";w.innerHTML='<div class="pm"></div>';document.body.insertBefore(w,document.body.firstChild);
 const f=document.createElement("iframe");f.allow="autoplay;encrypted-media;fullscreen;picture-in-picture";f.setAttribute("playsinline","");
 f.src=`https://www.youtube.com/embed/${yv(cur.v)}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
 plVid=yv(cur.v);f.onload=()=>{f.contentWindow.postMessage('{"event":"listening","id":1}',"*");plReady=true;if(!muted&&started)ytCmd(f,"unMute");ytCmd(f,"playVideo")};
 w.firstChild.appendChild(f);YTP=f;return f}
const plCmd=(fn,args=[])=>YTP?.contentWindow?.postMessage(JSON.stringify({event:"command",func:fn,args}),"*");
function plShow(on){const w=$("#player");if(w)w.classList.toggle("on",on&&!!cur&&isYT(cur.v));document.querySelectorAll(".clip.live").forEach(c=>c.classList.remove("live"));if(on&&cur&&isYT(cur.v))cur.d.classList.add("live")}
function plLoad(v){const id=yv(v);if(!YTP){plEl();$("#player").firstChild.classList.toggle("wide",v.kind=="video");return}$("#player").firstChild.classList.toggle("wide",v.kind=="video");if(plVid!=id){plVid=id;plCmd("loadVideoById",[{videoId:id,startSeconds:0}])}else{plCmd("seekTo",[0,true])}
 plCmd("playVideo");if(!muted&&started)setTimeout(()=>plCmd("unMute"),120)}
function ensurePlayer(d,auto){const v=V[d.dataset.i],m=d.querySelector(".media");if(isYT(v)||m.querySelector("iframe,video"))return false;
 if(v.embed){const f=document.createElement("iframe");f.allow="autoplay;encrypted-media;fullscreen;clipboard-write";f.src=v.embed;m.querySelector(".lcard")?.remove();m.appendChild(f);return true}
 if(v.platform=="link")return false;
 const el=document.createElement("video");el.src=v.url;el.loop=true;el.playsInline=true;el.setAttribute("playsinline","");el.muted=true;el.preload=(auto||d==cur?.d?.nextElementSibling)?"auto":"metadata";el.autoplay=auto;if(v.poster)el.poster=v.poster;if(v.preview)el.onerror=()=>{if(m.querySelector("iframe"))return;el.remove();const f=document.createElement("iframe");f.allow="autoplay;fullscreen";f.src=v.preview;m.appendChild(f)};
 el.onplay=()=>{if(cur?.d==d)playing=true};el.onpause=()=>{if(cur?.d==d)playing=false};el.ontimeupdate=()=>{if(cur?.d==d&&el.duration&&el.currentTime>el.duration-1.2)W.done=true};m.appendChild(el);return true}
function startPlay(d){const vd=d.querySelector("video");if(vd){vd.muted=muted||!started;vd.play().catch(()=>{vd.muted=true;vd.play().catch(()=>{})})}}
function stopPlay(d){const vd=d.querySelector("video");if(vd)vd.pause()}
function mount(d){if(cur?.d==d)return;sendWatch();if(cur)stopPlay(cur.d);const v=V[d.dataset.i];cur={v,d};playing=false;W={vid:v.id,secs:0,done:false};
 const nx=d.nextElementSibling;ringReset(v.id);
 document.querySelectorAll(".clip .media iframe,.clip .media video").forEach(x=>{const c=x.closest(".clip");if(c!=d&&c!=nx)x.remove()});
 if(isYT(v)){plLoad(v);plShow(true)}else{plCmd("pauseVideo");plShow(false);if(!ensurePlayer(d,true))startPlay(d)}
 if(nx&&!isYT(V[nx.dataset.i]))ensurePlayer(nx,false);
 paintMute();if(!started)tapToStart();
 const i=+d.dataset.i;loadStats(V.slice(i,i+4).map(x=>x.id));history.replaceState(null,"","#v="+v.id+(location.hash.match(/ref=\w+/)?"&"+location.hash.match(/ref=\w+/)[0]:""))}
// hide the fixed player while the finger moves the feed; reveal when snapped
let scT=null;function onFeedScroll(){if($("#player")?.classList.contains("on"))plShow(false);clearTimeout(scT);scT=setTimeout(()=>{if(cur&&Math.abs(cur.d.getBoundingClientRect().top)<4)plShow(true)},110)}
addEventListener("message",e=>{if(!/youtube/.test(e.origin)||!YTP||e.source!==YTP.contentWindow)return;if(!cur||!isYT(cur.v))return;try{const j=JSON.parse(e.data),inf=j.info||{};
 if(inf.playerState!==undefined){playing=inf.playerState==1;if(inf.playerState==0){W.done=true;plCmd("seekTo",[0,true]);plCmd("playVideo")}}
 if(inf.currentTime&&inf.duration&&inf.currentTime>inf.duration-1.5)W.done=true}catch(_){}});
// count only while visible + playing + feed shown
setInterval(()=>{if(cur&&playing&&!document.hidden&&$("#feed").style.display!="none"&&$("#promo").style.display!="flex"){st(cur.v.id).pts+=10000;q("pts",cur.v.id,1);W.secs++;paint(cur.d);ringTick()}},1000);
function paintMute(){document.querySelectorAll(".clip .mute").forEach(b=>b.innerHTML=muted||!started?I("vol")+"<span>แตะเพื่อเปิดเสียง</span>":I("volon"))}
function setMute(m){muted=m;ls.set("ym_muted",m);if(!m)markStarted();paintMute();if(!cur)return;
 if(isYT(cur.v)){plCmd(m?"mute":"unMute");plCmd("playVideo")}else{const vd=cur.d.querySelector("video");if(vd){vd.muted=m;vd.play()}}}
// one-time tap-to-start (iOS needs a real tap before sound). Each app launch/session once; the promo tap also counts.
function markStarted(){started=true;sessionStorage.ym_started="1";$("#tts")?.remove()}
function startWithSound(){markStarted();muted=false;ls.set("ym_muted",false);paintMute();if(cur&&isYT(cur.v)){plCmd("unMute");plCmd("playVideo")}else if(cur){startPlay(cur.d)}}
function tapToStart(){if(started||$("#tts")||$("#promo").style.display=="flex")return;const t=document.createElement("div");t.id="tts";
 t.innerHTML=`<img src="logo.svg" alt=""><div class="pl">${I("play","f")}</div><b>แตะเพื่อเริ่มดู</b><span>พร้อมเสียง</span>`;
 t.addEventListener("click",e=>{e.stopPropagation();startWithSound()});document.body.appendChild(t)}
// single tap = pause/play (or unmute first time); double+ tap = หัวใจรัว
// taps on the transparent overlay above the player = หัวใจรัว only (no pause). Sound is the mute button.
function onTap(d,v,e){heart(d,v,{clientX:e.clientX,clientY:e.clientY})}
// หัวใจรัว combo: +1 per tap; 100-tap streak on a clip -> 10 s "ใจเดือด" boost, +100 per tap; then streak resets
const CB={vid:null,streak:0,until:0,combo:0,timer:null};
let pinT=null;function pinFeed(){const f=$("#feed");if(!cur)return;const top=cur.d.offsetTop;f.style.overflowY="hidden";if(Math.abs(f.scrollTop-top)>1)f.scrollTop=top;clearTimeout(pinT);pinT=setTimeout(()=>{f.style.overflowY="";if(cur&&Math.abs(f.scrollTop-cur.d.offsetTop)>1)f.scrollTop=cur.d.offsetTop},600)}
function heart(d,v,e){pinFeed();if(CB.vid!=v.id){endBoost();CB.vid=v.id;CB.streak=0}
 const boost=Date.now()<CB.until,add=boost?100:1;
 tapFX(e.clientX,e.clientY,add,boost);const spb=d.querySelector(".sp");spb.classList.remove("pop");void spb.offsetWidth;spb.classList.add("pop");
 d.querySelector(".sp").classList.add("on");hint(boost);
 st(v.id).spam+=add;if(boost){q("boost",v.id,1);CB.combo++;$("#cbn").textContent="x"+CB.combo+"  +"+nf(CB.combo*100)}else{q("spam",v.id,1);if(++CB.streak>=100)startBoost(d)}
 paint(d)}
let hintT=null;function hint(boost){let h=$("#cbh");if(!h){h=document.createElement("div");h.id="cbh";document.body.appendChild(h)}
 if(boost){h.style.display="none";return}h.innerHTML=`กดครบ 100 ครั้ง เข้าโหมดใจเดือด 🔥 <b>${Math.min(CB.streak+1,100)}/100</b><i style="width:${Math.min(CB.streak+1,100)}%"></i>`;h.style.display="block";
 clearTimeout(hintT);hintT=setTimeout(()=>h.style.display="none",1500)}
// second ใจเดือด trigger: 15 s of play on the current clip (once per clip per view; resets when the clip changes)
let WR={vid:null,t:0,used:false};
function ringEl(){let r=$("#wr");if(!r){r=document.createElement("div");r.id="wr";r.innerHTML=`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" class="trk"/><circle cx="20" cy="20" r="17" class="rng"/></svg><span></span>`;document.body.appendChild(r)}return r}
function ringReset(vid){WR={vid,t:0,used:false};ringPaint()}
function ringPaint(){const r=ringEl(),show=$("#feed").style.display!="none"&&!WR.used;r.style.display=show?"flex":"none";if(!show)return;
 r.querySelector(".rng").style.strokeDashoffset=106.8*(1-WR.t/15);r.querySelector("span").textContent=WR.t<15?`${15-WR.t} วิ ใจเดือด`:""}
function ringTick(){if(!cur)return;if(WR.vid!=cur.v.id)ringReset(cur.v.id);if(WR.used)return;WR.t++;
 if(WR.t>=15){WR.used=true;W.secs&&sendWatch();endBoost();CB.vid=cur.v.id;CB.streak=0;startBoost(cur.d)}ringPaint()}
// ---------- game-feel FX: one canvas particle system (white/mono), capped, rAF only while alive ----------
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
function tapFX(x,y,add,boost){fxInit();const now=performance.now();FX.combo=now-FX.lastTap<700?FX.combo+1:1;FX.lastTap=now;const c=FX.combo;
 const n=boost?34:c>=50?22:c>=25?16:c>=10?12:8;spawn(x,y,n,boost?900:c>=25?650:480,boost||c>=50);
 popText(x,y-30,"+"+add,boost?44:c>=25?30:c>=10?26:22);
 if(boost)FX.r.push({x,y,R:110,w:6,life:0,max:.45});
 const tier=TIERS_FX.find(t=>c==t[0]);if(tier){popText(innerWidth/2,innerHeight*.32,tier[1],tier[0]>=50?52:40,1.1,true);FX.r.push({x:innerWidth/2,y:innerHeight*.32,R:180,w:4,life:0,max:.6})}
 if((c>=10&&c%5==0)||boost)shake(boost?7:3);navigator.vibrate&&navigator.vibrate(boost?20:10);fxKick()}
function shake(px){const m=cur?.d.querySelector(".media");if(!m)return;m.style.setProperty("--sh",px+"px");m.classList.remove("shake");void m.offsetWidth;m.classList.add("shake")}
function boostFX(){fxInit();for(let i=0;i<8;i++)spawn(Math.random()*innerWidth,Math.random()*innerHeight*.8,18,900,true);
 FX.r.push({x:innerWidth/2,y:innerHeight/2,R:Math.max(innerWidth,innerHeight)*.75,w:10,life:0,max:.8});popText(innerWidth/2,innerHeight*.45,"ใจเดือด!",56,1.2,true);shake(10);navigator.vibrate&&navigator.vibrate([30,40,30]);fxKick();
 document.body.classList.add("glow");setTimeout(()=>document.body.classList.remove("glow"),10000)}
function startBoost(d){boostFX();$("#cbh")&&($("#cbh").style.display="none");CB.until=Date.now()+10000;CB.combo=0;let o=$("#cbo");if(!o){o=document.createElement("div");o.id="cbo";document.body.appendChild(o)}
 o.innerHTML=`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="trk"/><circle cx="50" cy="50" r="44" class="rng" id="cbr"/></svg><b id="cbs">10</b><div class="cbt">ใจเดือด!</div><div id="cbn">x0</div>`;o.style.display="flex";
 requestAnimationFrame(()=>{$("#cbr").style.transition="stroke-dashoffset 10s linear";$("#cbr").style.strokeDashoffset="276.5"});
 clearInterval(CB.timer);CB.timer=setInterval(()=>{const s=Math.ceil((CB.until-Date.now())/1000);if(s<=0)return endBoost();$("#cbs").textContent=s},200);toast("ใจเดือด! 10 วินาที กดหัวใจละ +100")}
function endBoost(){document.body.classList.remove("glow");clearInterval(CB.timer);CB.until=0;CB.streak=0;const o=$("#cbo");if(o)o.style.display="none"}
function burst(d,e){const b=document.createElement("div");b.className="burst";b.style.left=e.clientX+"px";b.style.top=e.clientY+"px";
 b.innerHTML=Array.from({length:12},(_,i)=>`<i style="--a:${i*30}deg"></i>`).join("")+I("heart");d.appendChild(b);setTimeout(()=>b.remove(),700)}
function share(v){const u=location.origin+location.pathname+"#v="+v.id+(me?.ref?"&ref="+me.ref:"");
 navigator.share?navigator.share({title:v.title+" | Youม่วน",url:u}).catch(()=>{}):(navigator.clipboard.writeText(u),toast("คัดลอกลิงก์แล้ว"))}
// comments
let cmV=null;async function openCm(v){cmV=v;$("#cm").classList.add("on");
 if(!API){$("#cml").innerHTML='<div class="note">ระบบความคิดเห็นสำหรับซุปเปอร์แฟน เปิดให้ใช้เร็วๆ นี้</div>';return}
 $("#cml").textContent="กำลังโหลด...";const l=await api("/comments?id="+v.id).catch(()=>[]);
 $("#cml").innerHTML=l.map(c=>`<p><b>${esc(c.name)}</b> <span class="m">${c.role!="fan"?"ศิลปิน · ":""}${new Date(c.t).toLocaleString("th")}</span><br>${esc(c.text)}${me?.role=="admin"?` <a class="lnk" onclick="delCm(${+c.id})">ลบ</a>`:""}</p>`).join("")||'<p class="m">ยังไม่มีความคิดเห็น</p>'}
$("#cmf").onsubmit=async e=>{e.preventDefault();if(!API)return;if(!tok)return gate();const t=$("#cmi").value.trim();if(!t)return;
 await api("/comments",{method:"POST",body:JSON.stringify({id:cmV.id,text:t})}).catch(x=>toast(x.message));$("#cmi").value="";st(cmV.id).cm++;openCm(cmV)};
async function delCm(id){await api("/admin/comment",{method:"DELETE",body:JSON.stringify({id})});openCm(cmV)}
$("#cmx").innerHTML=I("x");$("#cmx").onclick=()=>$("#cm").classList.remove("on");
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.55&&$("#feed").style.display!="none")mount(e.target)}),{root:$("#feed"),threshold:[.55]});
function buildFeed(start){const f=$("#feed");if(!f.dataset.sl){f.dataset.sl=1;f.addEventListener("scroll",onFeedScroll,{passive:true})}f.innerHTML="";if(!V.length){cur=null;plShow(false);f.innerHTML=`<div class="empty"><img src="logo.svg" alt=""><h2>ยังไม่มีคลิป</h2><p>ศิลปินกำลังจะมาเร็วๆ นี้</p></div>`;return}V.forEach((v,i)=>{const d=clipEl(v,i);f.appendChild(d);io.observe(d)});if(start>0)f.children[start].scrollIntoView()}
// ---------- promo: top trending, 10s ----------
async function promo(){if(!V.length)return;let t=null;
 if(API)try{const x=(await api("/top"))[0];if(x)t={id:x.vid,points:x.pts}}catch(e){}
 const v=t&&V.find(x=>x.id==t.id)||V[0];if(!v)return;const p=$("#promo");let n=10;
 p.innerHTML=`<div class="pbg" style="background-image:url('${isYT(v)?hq(yv(v)):thumb(v)}')"></div><div class="pg"></div><div class="x"><b id="pn">10</b><span>${I("x")}</span></div>
 <div class="pin"><span class="tag">มาแรง อันดับ 1</span><h1>${esc(v.title)}</h1><div class="m" style="color:#ddd">@${esc(v.artist)}</div>
 <button class="btn" style="margin-top:18px;display:inline-flex;gap:8px;align-items:center" id="pw">${I("play").replace('class="i ','class="i f ').replace("stroke:#fff","")}ดูเลย</button><div class="bar"><i id="pb"></i></div></div>`;
 p.querySelector("#pw svg").style.cssText="stroke:#000;fill:#000;width:16px;height:16px";
 p.style.display="flex";requestAnimationFrame(()=>{$("#pb").style.transition="width 10s linear";$("#pb").style.width="100%"});
 const close=(go2,gesture)=>{clearInterval(T);p.style.display="none";if(gesture)startWithSound();if(go2)openClip(v.id);if(!started)tapToStart()};
 const T=setInterval(()=>{n--;$("#pn").textContent=n;if(n<=0)close(false)},1000);
 p.querySelector(".x").onclick=e=>{e.stopPropagation();close(false,true)};p.onclick=()=>close(true,true)}
// ---------- pages ----------
const head=(t,s)=>`<h2>${t}</h2><div class="rule"></div>${s?`<p class="m">${s}</p>`:""}`;
const rowHtml=(v,i,lab)=>`<a class="row" onclick="openClip('${v.id}')"><div class="rk">${i+1}</div><img src="${thumb(v)||"logo.svg"}" onerror="this.src='logo.svg'"><div class="t">${esc(v.title)}<div class="m">@${esc(v.artist)}${lab?" · "+lab:""}</div></div></a>`;
async function trend(){const p=$("#p-trend");p.innerHTML=head("มาแรง")+'<p class="m">กำลังโหลด...</p>';
 if(API){const t=await api("/top").catch(()=>[]);t.forEach(x=>Object.assign(st(x.vid),x,{pts:x.pts,loaded:1}))}else await loadStats(V.slice(0,60).map(v=>v.id));
 const L=V.filter(v=>st(v.id).pts>0).sort((a,b)=>st(b.id).pts-st(a.id).pts).slice(0,50);
 p.innerHTML=head("มาแรง")+(L.map((v,i)=>rowHtml(v,i,"หัวใจรัว "+nf(st(v.id).spam))).join("")||'<div class="note">ยังไม่มีข้อมูล</div>')}
let boardTab="artist";
async function board(){const p=$("#p-board"),tabs=`<div>${[["artist","ศิลปิน"],["fans","แฟนแต้มสะสม"],["hearts","ซุปเปอร์หัวใจ"]].map(([k,n])=>`<span class="chip ${k==boardTab?"on":""}" onclick="boardTab='${k}';board()">${n}</span>`).join("")}</div>`;
 p.innerHTML=head("อันดับ","หัวใจรัว = กดรัวได้ไม่จำกัด รวมที่ศิลปินกดเองด้วย")+tabs+'<p class="m">กำลังโหลด...</p>';
 if(boardTab!="artist"){if(!API){p.innerHTML=head("อันดับ")+tabs+soon("อันดับซุปเปอร์แฟน","เมื่อเปิดระบบสมาชิก จะแสดงแฟนที่สะสมแต้มและซุปเปอร์หัวใจมากที่สุดที่นี่");return}
  const lb=await api("/leaderboard").catch(()=>({points:[],hearts:[]})),L=boardTab=="fans"?lb.points:lb.hearts;
  p.innerHTML=head("อันดับ")+tabs+(L.map((x,i)=>`<div class="row"><div class="rk">${i+1}</div><div class="av">${esc(x.name[0])}</div><div class="t">${esc(x.name)}<div class="m">${boardTab=="fans"?"แต้มสะสม":"ซุปเปอร์หัวใจ"} ${nf(x.v)}</div></div></div>`).join("")||'<div class="note">ยังไม่มีข้อมูล</div>');return}
 await loadStats(V.slice(0,API?V.length:60).map(v=>v.id));const A={};
 V.forEach(v=>{if(!S[v.id]?.loaded)return;const a=A[v.artist]||(A[v.artist]={pts:0,spam:0}),s=st(v.id);a.pts+=s.pts;a.spam+=s.spam});
 p.innerHTML=head("อันดับ","หัวใจรัว = กดรัวได้ไม่จำกัด รวมที่ศิลปินกดเองด้วย")+tabs+
 Object.entries(A).sort((a,b)=>b[1].pts-a[1].pts).map(([n,a],i)=>`<a class="row" data-a="${esc(n)}" onclick="artistPage(this.dataset.a)"><div class="rk">${i+1}</div><div class="av">${esc(n[0])}</div><div class="t">${esc(n)}<div class="m">หัวใจรัว ${nf(a.spam)}</div></div></a>`).join("")}
async function artistPage(n){if(!n)return;let o=$("#ap");if(!o){o=document.createElement("div");o.id="ap";document.body.appendChild(o)}
 const L=V.filter(v=>v.artist==n);await loadStats(L.map(v=>v.id)).catch(()=>{});const tot=L.reduce((s,v)=>s+st(v.id).pts,0),hs=L.reduce((s,v)=>s+st(v.id).spam,0);
 o.innerHTML=`<div class="aph"><button class="btn o" onclick="$('#ap').style.display='none'">${I("x")}</button></div><div class="apc"><div class="av big">${esc(n[0])}</div><h2>${esc(n)}</h2><div class="apn"><div><b>${nf(tot)}</b><small>วิวม่วนรวม</small></div><div><b>${nf(hs)}</b><small>หัวใจรัว</small></div><div><b>${L.length}</b><small>คลิป</small></div></div><div class="rule"></div>`+
 (L.sort((a,b)=>st(b.id).pts-st(a.id).pts).map((v,i)=>rowHtml(v,i,"วิวม่วน "+nf(st(v.id).pts))).join("")||'<p class="m">ยังไม่มีคลิป</p>')+`</div>`;
 o.querySelectorAll("a.row").forEach(r=>r.addEventListener("click",()=>o.style.display="none"));o.style.display="block"}
const soon=(t,s)=>`<div class="soon"><span class="badge">เร็วๆ นี้</span><h2>${t}</h2><p>${s}</p></div>`;
async function rewards(){const p=$("#p-rewards");
 if(!API){p.innerHTML=head("ของรางวัล")+soon("แลกของรางวัลซุปเปอร์แฟน","ดูคลิปจนจบ สะสมแต้มสะสม แชร์คลิปให้เพื่อนเพื่อรับซุปเปอร์หัวใจ แล้วนำมาแลกของที่ระลึกจากค่ายพอดีม่วน")+
  `<div class="grid2">${["เสื้อยืดพอดีม่วน","ลายเซ็นศิลปิน","บัตรคอนเสิร์ต","วิดีโอคอลกับศิลปิน"].map(n=>`<div class="rw"><div style="aspect-ratio:1;display:grid;place-items:center;background:#0b0b0b">${I("gift")}</div><div>${n}<div class="m">ตัวอย่าง</div></div></div>`).join("")}</div>`;return}
 if(!tok)return gate();const R=await api("/rewards").catch(()=>[]);
 p.innerHTML=head("ของรางวัล",`แต้มสะสมของคุณ: <b style="color:#fff">${nf(me?.points)}</b>`)+`<div class="grid2">${R.map(r=>`<div class="rw">${r.image?`<img src="${esc(r.image)}">`:`<div style="aspect-ratio:1;display:grid;place-items:center">${I("gift")}</div>`}<div>${esc(r.name)}<div class="m">${nf(r.cost)} แต้ม · เหลือ ${r.stock}</div><button class="btn o" style="margin-top:8px;width:100%" onclick="redeem(${+r.id},'${esc(r.name)}')" ${r.stock<1?"disabled":""}>${r.stock<1?"หมดแล้ว":"แลก"}</button></div></div>`).join("")||'<div class="note">ยังไม่มีของรางวัล</div>'}</div>`}
async function redeem(id,name){const a=prompt("แลก "+name+"\nกรอกชื่อ ที่อยู่จัดส่ง และเบอร์โทร");if(!a)return;try{await api("/redeem",{method:"POST",body:JSON.stringify({reward_id:id,address:a})});toast("ส่งคำขอแลกแล้ว");await refreshMe();rewards()}catch(e){toast(e.message)}}
async function refreshMe(){if(API&&tok)try{me=await api("/me")}catch(e){tok=null;me=null;localStorage.removeItem("ym_tok")}}
const TERMS=`<h2 style="font:500 22px Kanit">ข้อกำหนดการใช้งานและประกาศความเป็นส่วนตัว</h2><div class="rule"></div>
<p><b>ผู้ควบคุมข้อมูล:</b> ค่ายเพลงพอดีม่วน (Youม่วน)</p>
<p><b>ข้อมูลที่เก็บ:</b> ชื่อที่แสดง เบอร์โทรหรืออีเมล รหัสผ่าน (เก็บแบบเข้ารหัสทางเดียว PBKDF2 ไม่มีใครอ่านได้) ประวัติการดูคลิป แต้ม ความคิดเห็น การแชร์ และที่อยู่จัดส่งเมื่อแลกของรางวัล</p>
<p><b>วัตถุประสงค์:</b> ให้บริการสมาชิกซุปเปอร์แฟน คำนวณแต้มและของรางวัล ป้องกันการโกง จัดส่งของรางวัล และติดต่อเรื่องบัญชี ฐานทางกฎหมาย: การปฏิบัติตามสัญญาการเป็นสมาชิก และความยินยอมของคุณ</p>
<p><b>การเปิดเผย:</b> ไม่ขายข้อมูล ใช้ผู้ให้บริการระบบ (Cloudflare และแพลตฟอร์มวิดีโอที่ฝังคลิป เช่น YouTube, TikTok, Facebook, Instagram) เท่าที่จำเป็นเท่านั้น</p>
<p><b>ระยะเวลาเก็บ:</b> ตลอดอายุสมาชิก และลบภายใน 90 วันหลังขอลบบัญชี เว้นแต่กฎหมายกำหนดให้เก็บนานกว่า</p>
<p><b>สิทธิของคุณตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA):</b> ขอเข้าถึง ขอสำเนา แก้ไข ลบ ระงับ คัดค้าน ขอโอนย้ายข้อมูล ถอนความยินยอม และร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล ติดต่อค่ายเพลงพอดีม่วนทางเพจสงครามพอดีม่วน</p>
<p><b>กติกา:</b> แต้มสะสมได้จากการดูคลิปจริง มีเพดานต่อคลิปและต่อวัน ห้ามใช้บอทหรือโกงแต้ม ค่ายสงวนสิทธิ์ระงับบัญชีและยกเลิกแต้มที่ได้มาโดยไม่สุจริต วิวม่วนและหัวใจรัวเป็นตัวเลขเพื่อความสนุก แลกของไม่ได้ ของรางวัลมีจำนวนจำกัด</p>
<button class="btn" onclick="$('#modal').style.display='none'">ปิด</button>`;
function showTerms(){$("#modal").innerHTML=`<div class="box">${TERMS}</div>`;$("#modal").style.display="block"}
function gate(){go("me")}
async function mePage(){const p=$("#p-me");
 if(!API){p.innerHTML=head("ซุปเปอร์แฟน ค่ายพอดีม่วน")+soon("สมัครซุปเปอร์แฟน","สะสมแต้มจากการดูคลิปจนจบ รับซุปเปอร์หัวใจเมื่อเพื่อนเปิดลิงก์ที่คุณแชร์ ไต่ระดับ และแลกของรางวัลสุดพิเศษ<br>ระหว่างนี้ดูคลิปและกดหัวใจรัวได้เลย")+
  `<div class="stat"><div><b>${I("star")}</b><span>แต้มสะสม</span></div><div><b>${I("hearts")}</b><span>ซุปเปอร์หัวใจ</span></div><div><b>${I("trophy")}</b><span>ระดับ</span></div></div><p style="text-align:center"><a class="lnk m" onclick="showTerms()">ข้อกำหนดและนโยบายความเป็นส่วนตัว</a></p>`;return}
 if(!tok){if(p.querySelector("#af"))return;p.innerHTML=head("ซุปเปอร์แฟน ค่ายพอดีม่วน","สมัครฟรีเพื่อเข้าใช้งาน สะสมแต้ม และแลกของรางวัล")+`<div><span class="chip on" id="tS">สมัคร</span><span class="chip" id="tL">เข้าสู่ระบบ</span></div><div id="af"></div>`;
  const su=()=>{$("#af").innerHTML=`<input id="fn" placeholder="ชื่อที่แสดง"><input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)" autocomplete="new-password">
   <label class="ck" for="c1"><input type="checkbox" id="c1"><span>ฉันยอมรับข้อกำหนดการใช้งาน</span></label><label class="ck" for="c2"><input type="checkbox" id="c2"><span>ฉันได้อ่านและยินยอมตามประกาศความเป็นส่วนตัว (PDPA)</span></label><p class="m" style="margin:2px 0 14px"><a class="lnk" onclick="showTerms()">อ่านข้อกำหนดและประกาศความเป็นส่วนตัว</a></p><button class="btn" style="width:100%" id="go">สมัครซุปเปอร์แฟน</button>`;
   $("#go").onclick=()=>auth("/signup",{name:$("#fn").value,login:$("#fl").value,password:$("#fp").value,acceptTerms:$("#c1").checked,acceptPrivacy:$("#c2").checked})};
  const li=()=>{$("#af").innerHTML=`<input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน" autocomplete="current-password"><button class="btn" style="width:100%" id="go">เข้าสู่ระบบ</button>`;
   $("#go").onclick=()=>auth("/login",{login:$("#fl").value,password:$("#fp").value})};
  $("#tS").onclick=()=>{$("#tS").classList.add("on");$("#tL").classList.remove("on");su()};$("#tL").onclick=()=>{$("#tL").classList.add("on");$("#tS").classList.remove("on");li()};su();return}
 await refreshMe();if(!me)return mePage();const mem=["singer","admin"].includes(me.role),sn=me.singer_name||me.name;
 const fanBits=`<div class="stat"><div><b>${nf(me.points)}</b><span>แต้มสะสม</span></div><div><b>${nf(me.hearts)}</b><span>ซุปเปอร์หัวใจ</span></div><div><b>${me.tier?esc(me.tier):"-"}</b><span>ระดับ</span></div></div>
  ${me.claimable.map(c=>`<div class="row" onclick='celebrate(${JSON.stringify(c).replace(/'/g,"")})'><div class="t">ครบ ${nf(c.hearts)} หัวใจรัวให้ ${esc(c.artist)}<div class="m">แตะเพื่อรับสิทธิ์</div></div>${I("gift")}</div>`).join("")}
  ${me.myClaims.map(c=>`<div class="row" style="display:block"><div class="t">${esc(c.artist)}<div class="m">${c.reply_url?"ศิลปินส่งคลิปขอบคุณแล้ว":"รอศิลปินตอบกลับ"}</div></div>${c.reply_url?embedHtml(c.reply_url):""}</div>`).join("")}
  ${me.fanArtists.slice(0,3).map(f=>`<div class="m" style="margin:8px 0 4px">${esc(f.artist)} · ${nf(f.hearts)} / ${nf(me.milestone)} หัวใจรัว</div><div class="prog"><i style="width:${Math.min(100,f.hearts/me.milestone*100)}%"></i></div>`).join("")}`;
 const more=`<details class="more"><summary>${I("menu")}เมนูเพิ่มเติม</summary>
  ${mem?`<h3>ซุปเปอร์แฟน</h3>${fanBits}`:""}
  <h3>ประวัติแต้ม</h3>${me.history.slice(0,20).map(h=>`<div class="row"><div class="t">${h.kind=="watch"?"ดูคลิป":h.kind=="complete"?"ดูจนจบ":h.kind=="redeem"?"แลก "+esc(h.note):h.kind=="refund"?esc(h.note):esc(h.kind)}<div class="m">${h.day}</div></div><b>${h.delta>0?"+":""}${h.delta}</b></div>`).join("")||'<p class="m">ยังไม่มี</p>'}
  <h3>การแลกของรางวัล</h3>${me.redemptions.map(r=>`<div class="row"><div class="t">${esc(r.reward)}<div class="m">${({pending:"รออนุมัติ",approved:"อนุมัติแล้ว",shipped:"จัดส่งแล้ว",rejected:"ไม่อนุมัติ (คืนแต้มแล้ว)"})[r.status]||r.status}</div></div></div>`).join("")||'<p class="m">ยังไม่มี</p>'}
  <div class="note">ดูครบ ${me.rules.secsPerPoint} วินาที = 1 แต้มสะสม · ดูจนจบ +${me.rules.completeBonus} · สูงสุด ${me.rules.dailyPointCap} แต้ม/วัน<br>ลิงก์แชร์ของคุณติดรหัส ${esc(me.ref)} อัตโนมัติ</div>
  ${mem?"":`<h3>สมาชิกค่าย</h3><input id="pin" type="password" placeholder="รหัส PIN จากแอดมิน"><button class="btn o" onclick="pinLink()">ยืนยันเป็นศิลปิน</button>`}
  ${me.role=="admin"?'<h3>เครื่องมือแอดมิน</h3><div id="adm"></div>':""}
  <p><button class="btn o" onclick="logout()">ออกจากระบบ</button> <a class="lnk m" onclick="showTerms()">ข้อกำหนดและ PDPA</a></p></details>`;
 if(!mem){p.innerHTML=head(esc(me.name),esc(me.tier||""))+fanBits+more;bell();if(me.claimable?.length)celebrate(me.claimable[0]);return}
 const L=V.filter(v=>me.role=="admin"||v.artist==sn);await loadStats(L.map(v=>v.id)).catch(()=>{});
 const tv=L.reduce((s,v)=>s+st(v.id).pts,0),th=L.reduce((s,v)=>s+st(v.id).spam,0);
 p.innerHTML=`<div class="apc"><div class="av big">${esc(sn[0])}</div><h2>${esc(sn)}</h2><div class="m">${me.role=="admin"?"แอดมินค่าย":"ศิลปินในค่าย"}</div>
  <div class="apn"><div><b>${nf(tv)}</b><small>วิวม่วน</small></div><div><b>${nf(th)}</b><small>หัวใจรัว</small></div><div><b>${L.length}</b><small>คลิป</small></div></div></div>
  <button class="btn big-post" onclick="composer()">+ ลงคลิป</button>
  <a class="row" onclick="inbox()"><div class="av">${I("bell")}</div><div class="t">แฟนครบ 10,000 หัวใจ<div class="m">${me.inboxNew?me.inboxNew+" คำขอใหม่ · แตะเพื่อส่งคลิปขอบคุณ":"ยังไม่มีคำขอใหม่"}</div></div></a>
  <h3>คลิปของฉัน</h3>${L.map((v,i)=>rowHtml(v,i,"วิวม่วน "+nf(st(v.id).pts)+" · หัวใจรัว "+nf(st(v.id).spam))).join("")||'<p class="m">ยังไม่มีคลิป กด "+ ลงคลิป" เพื่อเริ่ม</p>'}`+more;
 if(me.role=="admin")admin();bell()}
// ---------- one-flow composer: file (compressed on device) or pasted link ----------
function composer(){let o=$("#cmp");if(!o){o=document.createElement("div");o.id="cmp";document.body.appendChild(o)}const ad=me?.role=="admin";
 o.innerHTML=`<div class="cmh"><b>ลงคลิป</b><button class="x" onclick="$('#cmp').style.display='none'">${I("x")}</button></div>
 <label class="pick" for="cf" id="cpv"><span>${I("plus")}</span><b>เลือกคลิปจากเครื่อง</b><small>หรือวางลิงก์ด้านล่าง</small></label><input id="cf" type="file" accept="video/*" hidden>
 <input id="cl" placeholder="วางลิงก์ YouTube / TikTok / Facebook / IG (ถ้ามี)" inputmode="url">
 <input id="ct" placeholder="ชื่อคลิป (ไม่บังคับ)">${ad?`<select id="ca">${ROSTER.map(r=>`<option>${r}</option>`).join("")}</select>`:""}
 <div class="prog" id="cbar" style="display:none"><i></i></div><div class="m" id="cst"></div>
 <button class="btn big-post" id="cgo">โพสต์</button>`;o.style.display="block";let file=null;
 const pv=$("#cpv");$("#cf").onchange=e=>{file=e.target.files[0];if(!file)return;$("#cl").value="";pv.innerHTML=`<video src="${URL.createObjectURL(file)}" playsinline muted autoplay loop></video><small class="chg">แตะเพื่อเปลี่ยนคลิป</small>`};
 $("#cl").oninput=e=>{const u=e.target.value.trim();if(!u)return;file=null;const d=detect(u);pv.innerHTML=d.yid?`<img src="https://i.ytimg.com/vi/${d.yid}/hqdefault.jpg"><small class="chg">${PL[d.platform]}</small>`:`<span>${I("share")}</span><b>${PL[d.platform]||"ลิงก์"}</b><small>${esc(u.slice(0,60))}</small>`};
 $("#cgo").onclick=()=>{const ctx=window.AudioContext||window.webkitAudioContext?new (window.AudioContext||window.webkitAudioContext)():null; // created inside the tap (iOS)
  postClip(file,$("#cl").value.trim(),$("#ct").value,ad?$("#ca").value:"",ctx)}}
function setProg(label,q){$("#cbar").style.display="block";$("#cbar").firstChild.style.width=Math.round(q)+"%";$("#cst").textContent=label+" "+Math.round(q)+"%"}
async function postClip(file,url,title,artist,ctx){const btn=$("#cgo"),s=$("#cst");
 if(!file&&!url){s.textContent="เลือกคลิปหรือวางลิงก์ก่อนนะ";return}btn.disabled=true;
 try{if(!file){if(!/^https?:\/\//.test(url))throw new Error("ลิงก์ไม่ถูกต้อง");await api("/clips",{method:"POST",body:JSON.stringify({url,title,artist,platform:detect(url).platform})})}
  else{if(!/^video\//.test(f2t(file)))throw new Error("รองรับเฉพาะไฟล์วิดีโอ");const dur=await vidDur(file);if(dur>181)throw new Error("วิดีโอยาวเกิน 3 นาที");
   setProg("กำลังเตรียมคลิป",0);let up=file;try{const c=await compressVideo(file,dur,q=>setProg("กำลังเตรียมคลิป",q*30),ctx);if(c&&c.size<file.size)up=c}catch(e){console.log("compress skipped",e)}
   if(up.size>100e6)throw new Error("ไฟล์ใหญ่เกิน 100MB");await driveUpload(up,file.name,title,artist,q=>setProg("กำลังอัปโหลด",30+q*70))}
  setProg("โพสต์แล้ว",100);$("#cst").textContent="โพสต์แล้ว ✓";await loadVideos();buildFeed(0);setTimeout(()=>{$("#cmp").style.display="none";mePage()},900)}
 catch(e){s.textContent="ผิดพลาด: "+e.message;$("#cbar").style.display="none"}finally{btn.disabled=false;ctx?.close?.().catch(()=>{})}}
const f2t=f=>f.type||(/\.(mov|mp4|m4v|webm)$/i.test(f.name)?"video/mp4":"");
// re-encode on device: canvas (<=720p) + WebAudio -> MediaRecorder (MP4/H.264 on iOS Safari & recent Chrome). Real-time; falls back to the original.
async function compressVideo(file,dur,onp,ctx){
 if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return null;
 const saf=/Safari/.test(navigator.userAgent)&&!/Chrome|CriOS|Chromium|Android|FxiOS|Edg/.test(navigator.userAgent); // Safari's plain video/mp4 = H.264+AAC
 const mt=["video/mp4;codecs=avc1.42E01E,mp4a.40.2","video/mp4;codecs=avc1.4D401F,mp4a.40.2","video/mp4;codecs=avc1,mp4a.40.2"].concat(saf?["video/mp4"]:[]).find(t=>MediaRecorder.isTypeSupported(t));if(!mt)return null; // webm would not play on iPhone
 if(file.size<3e6)return null; // already small
 const v=document.createElement("video");v.src=URL.createObjectURL(file);v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";
 await new Promise((ok,no)=>{v.onloadedmetadata=ok;v.onerror=()=>no(new Error("decode"))});
 const k=Math.min(1,540/Math.min(v.videoWidth,v.videoHeight)),W=Math.round(v.videoWidth*k/2)*2,H=Math.round(v.videoHeight*k/2)*2;
 const cv=document.createElement("canvas");cv.width=W;cv.height=H;const g=cv.getContext("2d");const vs=cv.captureStream(30);
 if(ctx){try{const src=ctx.createMediaElementSource(v),dst=ctx.createMediaStreamDestination();src.connect(dst);dst.stream.getAudioTracks().forEach(t=>vs.addTrack(t));await ctx.resume()}catch(e){v.muted=true}}else v.muted=true;
 const rec=new MediaRecorder(vs,{mimeType:mt,videoBitsPerSecond:1000000,audioBitsPerSecond:96000}),ch=[];rec.ondataavailable=e=>e.data.size&&ch.push(e.data);
 const done=new Promise(ok=>rec.onstop=ok);let live=true;
 const draw=()=>{if(!live)return;g.drawImage(v,0,0,W,H);onp(Math.min(1,v.currentTime/(dur||v.duration||1)));v.requestVideoFrameCallback?v.requestVideoFrameCallback(draw):requestAnimationFrame(draw)};
 rec.start(1000);await v.play();draw();
 await new Promise(ok=>{v.onended=ok;setTimeout(ok,(dur+5)*1000)});live=false;rec.stop();await done;URL.revokeObjectURL(v.src);
 const b=new Blob(ch,{type:mt.split(";")[0]});return b.size>1000?new File([b],file.name.replace(/\.\w+$/,"")+"_540.mp4",{type:"video/mp4"}):null}
function grabPoster(file){return new Promise(ok=>{const v=document.createElement("video");v.muted=true;v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";v.src=URL.createObjectURL(file);
 const fin=x=>{URL.revokeObjectURL(v.src);ok(x)};setTimeout(()=>fin(""),6000);
 v.onloadeddata=()=>{v.currentTime=Math.min(0.1,(v.duration||1)/2)};v.onseeked=()=>{try{const k=360/Math.max(1,v.videoWidth),c=document.createElement("canvas");c.width=360;c.height=Math.round(v.videoHeight*k);c.getContext("2d").drawImage(v,0,0,c.width,c.height);let q=.7,u=c.toDataURL("image/jpeg",q);while(u.length>80000&&q>.3){q-=.15;u=c.toDataURL("image/jpeg",q)}fin(u)}catch(e){fin("")}};v.onerror=()=>fin("")})}
async function driveUpload(f,name,title,artist,onp){const thumb=await grabPoster(f);const g=await api("/drive/ticket",{method:"POST",body:JSON.stringify({artist})});
 const post=b=>fetch(g.bridge,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...b,ticket:g.ticket})}).then(r=>r.json()).then(j=>{if(j.error)throw new Error(j.error);return j});
 const ini=await post({action:"init",name:f.name||name,size:f.size,mime:f2t(f)});
 const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("PUT",ini.uploadUrl);x.setRequestHeader("Content-Type",f2t(f));x.upload.onprogress=e=>e.lengthComputable&&onp(e.loaded/e.total);x.onload=()=>{try{const j=JSON.parse(x.responseText);x.status<300?ok(j):no(new Error(j.error?.message||"อัปโหลดไม่สำเร็จ"))}catch(e){no(e)}};x.onerror=()=>no(new Error("เครือข่ายขัดข้อง"));x.send(f)});
 const fin=await post({action:"finish",id:r.id});await api("/clips",{method:"POST",body:JSON.stringify({drive:{...fin,uid:g.ticket.uid},title,thumb})})}
const FORM_IDS=["fn","fl","c1","c2","pin","ul","ut","cmi","nn","ni","nc","ns","clm","clc"];
const FS=(()=>{try{return JSON.parse(sessionStorage.ym_form||"{}")}catch(e){return {}}})();
function saveForm(el){if(!el||!FORM_IDS.includes(el.id))return;FS[el.id]=el.type=="checkbox"?el.checked:el.value;try{sessionStorage.ym_form=JSON.stringify(FS)}catch(e){}}
document.addEventListener("input",e=>saveForm(e.target),true);document.addEventListener("change",e=>saveForm(e.target),true);
function restoreForm(root=document){FORM_IDS.forEach(id=>{const el=root.querySelector("#"+id);if(!el||!(id in FS))return;if(el.type=="checkbox")el.checked=!!FS[id];else if(!el.value)el.value=FS[id]})}
function clearForm(ids){ids.forEach(i=>delete FS[i]);try{sessionStorage.ym_form=JSON.stringify(FS)}catch(e){}}
let rfq=0;new MutationObserver(ms=>{if(rfq)return;if(!ms.some(m=>m.target.closest?.(".page,#modal,.sheet")))return;rfq=requestAnimationFrame(()=>{rfq=0;restoreForm()})}).observe(document.body,{childList:true,subtree:true});
async function auth(path,b){try{const j=await api(path,{method:"POST",body:JSON.stringify(b)});tok=j.token;ls.set("ym_tok",tok);clearForm(["fn","fl","c1","c2"]);await refreshMe();bell();sendRef();go("home")}catch(e){toast(e.message)}}
async function pinLink(){try{await api("/pin-link",{method:"POST",body:JSON.stringify({pin:$("#pin").value})});toast("ยืนยันแล้ว");mePage()}catch(e){toast(e.message)}}
async function logout(){await api("/logout",{method:"POST"}).catch(()=>{});tok=null;me=null;localStorage.removeItem("ym_tok");mePage()}
async function addLink(){const url=$("#ul").value.trim(),s=$("#us");if(!/^https?:\/\//.test(url))return s.textContent="ลิงก์ไม่ถูกต้อง";
 try{await api("/clips",{method:"POST",body:JSON.stringify({url,title:$("#ut").value,platform:detect(url).platform})});s.textContent="เพิ่มคลิปแล้ว";$("#ul").value="";$("#ut").value="";await loadVideos();buildFeed(0)}catch(e){s.textContent="ผิดพลาด: "+e.message}}
const upBox=p=>`<h3>อัปโหลดวิดีโอ</h3><p class="m">เลือกวิดีโอจากคลังภาพหรือถ่ายใหม่ · สูงสุด 100MB · ไม่เกิน 3 นาที</p>${p?`<select id="${p}uar">${ROSTER.map(r=>`<option>${r}</option>`).join("")}</select>`:""}<input id="${p}uvt" placeholder="ชื่อคลิป / เพลง"><label class="btn upk" for="${p}uvf">เลือกวิดีโอ</label><input id="${p}uvf" type="file" accept="video/*" style="display:none" onchange="upVideo('${p}',this)"><div class="prog" id="${p}uvp" style="display:none"><i></i></div><div id="${p}uvs" class="m"></div>`;
function vidDur(f){return new Promise(r=>{const v=document.createElement("video");v.preload="metadata";v.onloadedmetadata=()=>{URL.revokeObjectURL(v.src);r(v.duration)};v.onerror=()=>r(0);v.src=URL.createObjectURL(f)})}
async function upVideo(p,inp){const f=inp.files[0],s=$("#"+p+"uvs"),bar=$("#"+p+"uvp");inp.value="";if(!f)return;
 if(!/^video\//.test(f.type))return s.textContent="รองรับเฉพาะไฟล์วิดีโอ";if(f.size>100e6)return s.textContent="ไฟล์ใหญ่เกิน 100MB";
 const dur=await vidDur(f);if(dur>181)return s.textContent="วิดีโอยาวเกิน 3 นาที";
 try{const g=await api("/drive/ticket",{method:"POST",body:JSON.stringify({artist:p?$("#"+p+"uar").value:""})});
  const post=b=>fetch(g.bridge,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...b,ticket:g.ticket})}).then(r=>r.json()).then(j=>{if(j.error)throw new Error(j.error);return j});
  s.textContent="กำลังเตรียมอัปโหลด...";const ini=await post({action:"init",name:f.name,size:f.size,mime:f.type});
  bar.style.display="block";bar.firstChild.style.width="0%";
  const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("PUT",ini.uploadUrl);x.setRequestHeader("Content-Type",f.type);x.upload.onprogress=e=>{if(e.lengthComputable){const q=Math.round(e.loaded/e.total*100);bar.firstChild.style.width=q+"%";s.textContent="กำลังอัปโหลดไป Google Drive "+q+"%"}};x.onload=()=>{try{const j=JSON.parse(x.responseText);x.status<300?ok(j):no(new Error(j.error?.message||"อัปโหลดไม่สำเร็จ"))}catch(e){no(e)}};x.onerror=()=>no(new Error("เครือข่ายขัดข้อง"));x.send(f)});
  s.textContent="กำลังตรวจไฟล์...";const fin=await post({action:"finish",id:r.id});
  await api("/clips",{method:"POST",body:JSON.stringify({drive:{...fin,uid:g.ticket.uid},title:$("#"+p+"uvt").value})});
  s.textContent="อัปโหลดแล้ว (เก็บใน Google Drive)";$("#"+p+"uvt").value="";await loadVideos();buildFeed(0);if(p)admin()}catch(e){s.textContent="ผิดพลาด: "+e.message;bar.style.display="none"}}
async function admAddClip(){const url=$("#aul").value.trim(),s=$("#aus");if(!/^https?:\/\//.test(url))return s.textContent="ลิงก์ไม่ถูกต้อง";
 try{await api("/clips",{method:"POST",body:JSON.stringify({url,title:$("#aut").value,artist:$("#aua").value,platform:detect(url).platform})});s.textContent="เพิ่มคลิปแล้ว";$("#aul").value="";$("#aut").value="";await loadVideos();buildFeed(0);admin()}catch(e){s.textContent="ผิดพลาด: "+e.message}}
async function admin(){const a=$("#adm"),[pins,mem,rw,rd,cl]=await Promise.all(["/admin/pins","/admin/members","/rewards","/admin/redemptions","/clips"].map(x=>api(x).catch(()=>[])));
 a.innerHTML=`<h3>แอดมิน · รหัส PIN ศิลปิน</h3>${pins.map(x=>`<div class="row"><div class="t">${esc(x.name)}<div class="m">PIN ${esc(x.pin)} (ใช้ได้ครั้งเดียว)</div></div><button class="btn o" onclick="adm('/admin/pins','DELETE',{pin:'${esc(x.pin)}'})">ลบ</button></div>`).join("")}
 <select id="sn">${ROSTER.map(r=>`<option>${r}</option>`).join("")}</select><button class="btn" onclick="adm('/admin/pins','POST',{name:$('#sn').value})">สร้าง PIN</button>
 <h3>สมาชิกค่าย</h3>${mem.map(x=>`<div class="row"><div class="t">${esc(x.singer_name||x.name)}<div class="m">${esc(x.role)} · ${esc(x.login)}</div></div>${x.role!="admin"?`<button class="btn o" onclick="adm('/admin/members','DELETE',{id:${+x.id}})">ถอด</button>`:""}</div>`).join("")}
 <h3>ของรางวัล</h3>${rw.map(r=>`<div class="row"><div class="t"><input id="rn${r.id}" value="${esc(r.name)}"><input id="ri${r.id}" value="${esc(r.image)}" placeholder="ลิงก์รูป"><div style="display:flex;gap:6px"><input id="rc${r.id}" type="number" value="${+r.cost}"><input id="rs${r.id}" type="number" value="${+r.stock}"></div>
  <label class="ck"><input type="checkbox" id="ra${r.id}" ${r.active?"checked":""}>แสดง</label><button class="btn o" onclick="saveRw(${+r.id})">บันทึก</button></div></div>`).join("")}
 <input id="nn" placeholder="ชื่อของรางวัล"><input id="ni" placeholder="ลิงก์รูป"><div style="display:flex;gap:6px"><input id="nc" type="number" placeholder="แต้ม"><input id="ns" type="number" placeholder="จำนวน"></div>
 <button class="btn" onclick="adm('/admin/rewards','POST',{name:$('#nn').value,image:$('#ni').value,cost:$('#nc').value,stock:$('#ns').value})">เพิ่มของรางวัล</button>
 <h3>คำขอแลก</h3>${rd.map(r=>`<div class="row"><div class="t">${esc(r.reward)} · ${esc(r.name)} (${esc(r.login)})<div class="m">${esc(r.address)} · ${esc(r.status)}</div>
  <div>${["approved","shipped","rejected"].map(s=>`<span class="chip" onclick="adm('/admin/redemptions','PUT',{id:${+r.id},status:'${s}'})">${({approved:"อนุมัติ",shipped:"จัดส่งแล้ว",rejected:"ปฏิเสธ+คืนแต้ม"})[s]}</span>`).join("")}</div></div></div>`).join("")||'<p class="m">ไม่มี</p>'}
 <h3>คลิปทั้งหมด</h3>${cl.map(x=>`<div class="row"><div class="t">${esc(x.title)}<div class="m">@${esc(x.artist)}</div></div><button class="btn o" onclick="adm('/admin/clip','DELETE',{id:'${esc(x.id)}'})">ลบ</button></div>`).join("")||'<p class="m">ยังไม่มี</p>'}`}
async function adm(p,m,b){if(m=="DELETE"&&!confirm("ยืนยัน?"))return;try{const j=await api(p,{method:m,body:JSON.stringify(b)});if(j.pin)alert("PIN ใหม่: "+j.pin);admin()}catch(e){toast(e.message)}}
const saveRw=id=>adm("/admin/rewards","PUT",{id,name:$("#rn"+id).value,image:$("#ri"+id).value,cost:$("#rc"+id).value,stock:$("#rs"+id).value,active:$("#ra"+id).checked});
// ---------- superfan milestone ----------
const celebrated=new Set();
function celebrate(c){if(celebrated.has(c.artist))return;celebrated.add(c.artist);
 $("#modal").innerHTML=`<div class="box cel"><div class="hearts3">${I("heart")}${I("heart")}${I("heart")}</div><span class="badge">ซุปเปอร์แฟนตัวจริง</span>
 <h2>ครบ ${nf(c.hearts)} หัวใจรัว<br>ให้ ${esc(c.artist)}</h2><p>คุณได้รับสิทธิ์ "รับคลิปขอบคุณ" จากศิลปิน 1 ครั้ง</p>
 <textarea id="clm" rows="3" placeholder="ข้อความถึงศิลปิน (ไม่บังคับ)"></textarea><input id="clc" placeholder="ช่องทางติดต่อ เช่น LINE ID (ไม่บังคับ)">
 <button class="btn" style="width:100%" id="clb">รับคลิปขอบคุณ</button><p><a class="lnk m" onclick="$('#modal').style.display='none'">ไว้ทีหลัง</a></p></div>`;$("#modal").style.display="block";
 $("#clb").onclick=async()=>{try{await api("/claims",{method:"POST",body:JSON.stringify({artist:c.artist,message:$("#clm").value,contact:$("#clc").value})});$("#modal").style.display="none";toast("ส่งคำขอถึง "+c.artist+" แล้ว");refreshMe().then(bell)}catch(e){toast(e.message)}}}
function embedHtml(url){const d=detect(url);
 if(d.platform=="youtube")return `<div class="tv"><iframe allow="autoplay;encrypted-media;fullscreen" allowfullscreen src="https://www.youtube.com/embed/${d.yid}?playsinline=1"></iframe></div>`;
 if(d.embed)return `<div class="tv"><iframe allow="autoplay;encrypted-media;fullscreen" allowfullscreen src="${esc(d.embed)}"></iframe></div>`;
 if(d.platform=="mp4")return `<video src="${esc(url)}" controls playsinline style="width:100%;border-radius:12px"></video>`;
 return `<a class="btn o" href="${esc(url)}" target="_blank" rel="noopener">เปิดคลิปขอบคุณ</a>`}
function bell(){let b=$("#bell");if(!me||me.role=="fan"){b&&b.remove();return}
 if(!b){b=document.createElement("button");b.id="bell";b.className="ib";b.onclick=inbox;$("#top").insertBefore(b,$("#sbtn"))}
 b.innerHTML=I("bell")+(me.inboxNew?`<span class="bdg">${me.inboxNew>99?"99+":me.inboxNew}</span>`:"")}
async function inbox(){go("me");const p=$("#p-me"),l=await api("/inbox").catch(()=>[]);api("/claims/seen",{method:"POST"}).then(()=>{me.inboxNew=0;bell()}).catch(()=>{});
 p.innerHTML=head("กล่องคำขอคลิปขอบคุณ",me.role=="admin"?"แอดมินเห็นคำขอของทุกศิลปิน":"แฟนที่ส่งหัวใจรัวให้คุณครบ 10,000")+(l.map(c=>`<div class="row" style="display:block"><div class="t"><b>${esc(c.fan)}</b> → ${esc(c.artist)} ${c.status=="new"?'<span class="chip on" style="padding:1px 8px">ใหม่</span>':""}<div class="m">${new Date(c.t).toLocaleString("th")}${c.contact?" · ติดต่อ: "+esc(c.contact):""}</div>${c.message?`<p>${esc(c.message)}</p>`:""}</div>
 ${c.reply_url?`<div class="m">ตอบแล้ว: <a class="lnk" href="${esc(c.reply_url)}" target="_blank">${esc(c.reply_url)}</a></div>`:`<input id="rp${+c.id}" placeholder="วางลิงก์คลิปขอบคุณ"><button class="btn" onclick="replyClaim(${+c.id})">ส่งคลิปขอบคุณ</button>`}</div>`).join("")||'<div class="note">ยังไม่มีคำขอ</div>')+'<p><button class="btn o" onclick="mePage()">กลับโปรไฟล์</button></p>'}
async function replyClaim(id){try{await api("/claims/reply",{method:"POST",body:JSON.stringify({id,url:$("#rp"+id).value.trim()})});toast("ส่งแล้ว");inbox()}catch(e){toast(e.message)}}
// ref links
function sendRef(){const m=location.hash.match(/ref=(\w+)/);if(API&&m)api("/ref/visit",{method:"POST",body:JSON.stringify({ref:m[1],device:dev,vid:(location.hash.match(/v=([\w-]+)/)||[])[1]})}).catch(()=>{})}
// search
$("#sbtn").innerHTML=I("search");$("#sx").innerHTML=I("x");$("#sbtn").onclick=()=>{$("#search").style.display="block";$("#q").focus()};$("#sx").onclick=()=>$("#search").style.display="none";
$("#q").oninput=()=>{const q=$("#q").value.trim().toLowerCase();$("#sr").innerHTML=q?V.filter(v=>(v.title+v.artist).toLowerCase().includes(q)).slice(0,40).map((v,i)=>rowHtml(v,i,"")).join("")||'<p class="m">ไม่พบ</p>':""};
function openClip(id){$("#search").style.display="none";go("home");const i=V.findIndex(v=>v.id==id);if(i>=0)$("#feed").children[i].scrollIntoView()}
// nav
const NAV={home:["home","หน้าแรก"],trend:["fire","มาแรง"],rewards:["gift","รางวัล"],board:["trophy","อันดับ"],me:["user","โปรไฟล์"]};
document.querySelectorAll("nav a").forEach(a=>{a.innerHTML=I(NAV[a.dataset.p][0])+NAV[a.dataset.p][1];a.onclick=()=>go(a.dataset.p)});
function go(p){if(API&&!tok&&p!="me")p="me";document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.p==p));document.querySelectorAll(".page").forEach(x=>x.style.display="none");
 $("#feed").style.display=p=="home"?"":"none";
 if(p!="home"){endBoost();plCmd("pauseVideo");plShow(false);$("#wr")&&($("#wr").style.display="none");document.querySelectorAll(".clip .media iframe,.clip .media video").forEach(x=>x.remove());cur=null;$("#p-"+p).style.display="block";({trend,board,rewards,me:mePage})[p]()}
 else{const d=[...document.querySelectorAll(".clip")].find(c=>Math.abs(c.getBoundingClientRect().top)<10);d&&mount(d)}}
(async()=>{await refreshMe();bell();sendRef();await loadVideos();const m=location.hash.match(/v=([\w-]+)/);buildFeed(m?Math.max(0,V.findIndex(v=>v.id==m[1])):0);
 if(API&&!tok)go("me");else if(!m)promo()})();
