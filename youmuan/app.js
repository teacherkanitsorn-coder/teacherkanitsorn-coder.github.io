const API=window.YM_API||"",AB="https://abacus.jasoncameron.dev",NS="youmuan-pdm",CH="UCpjChoKuoBGQ368LdINenDg";
const ROSTER=["รำไพ แสงทอง","พร จันทพร","เมย์ จิราพร","ขวัญ พัชรี","จุ๊บแจง เจนจิรา","โชติ ณัฐชัย","นิค สะเลอปี้","วงค์ ชนะกันต์","การ์เนต สะเลอปี้","การ์ฟิวส์ สะเลอปี้"];
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>"&"+"#"+c.charCodeAt(0)+";");
const ls={get:(k,d)=>{try{return JSON.parse(localStorage[k])??d}catch(e){return d}},set:(k,v)=>localStorage[k]=JSON.stringify(v)};
// ---------- white line icons ----------
const P={home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',fire:'<path d="M12 22c4 0 7-2.8 7-7 0-4-3-6.5-4-10-2 2-2.5 4-2.5 5.5C11 9 10 7.5 10 5 7 7.5 5 11 5 15c0 4.2 3 7 7 7z"/>',
gift:'<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M12 8S10.5 3 7.8 3.6C5.5 4.1 6.6 8 12 8zm0 0s1.5-5 4.2-4.4C18.5 4.1 17.4 8 12 8z"/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9 18h6"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
heart:'<path d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/>',
hearts:'<path d="M9 18.5S2.5 14.5 2.5 9.8a3.6 3.6 0 0 1 6.5-2 3.6 3.6 0 0 1 6.5 2"/><path d="M15.5 21s-5-3.2-5-6.8a2.8 2.8 0 0 1 5-1.6 2.8 2.8 0 0 1 5 1.6c0 3.6-5 6.8-5 6.8z"/>',
chat:'<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',share:'<path d="M14 4l7 7-7 7M21 11H10a6 6 0 0 0-6 6v3"/>',
up:'<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
vol:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6"/>',play:'<path d="M7 4v16l13-8z"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',logout:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>'};
const I=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24">${P[n]}</svg>`;
// ---------- state ----------
let V=[],S={},cur=null,tok=ls.get("ym_tok",null),me=null,muted=true,playing=false;
const dev=ls.get("ym_dev",null)||(ls.set("ym_dev",Math.random().toString(36).slice(2)+Date.now().toString(36)),ls.get("ym_dev"));
const nf=n=>(n=+n||0)>=1e9?(n/1e9).toFixed(1)+"B":n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":String(n);
const artistOf=t=>ROSTER.find(r=>t.includes(r)||t.includes(r.split(" ")[0]))||"พอดีม่วน STUDIO";
const st=id=>S[id]||(S[id]={pts:0,likes:0,spam:0,cm:0});
const thumb=v=>v.kind=="upload"?(v.thumb||""):`https://i.ytimg.com/vi/${v.id}/${v.kind=="short"?"oardefault":"hqdefault"}.jpg`;
const hq=id=>`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function toast(t){const x=document.createElement("div");x.textContent=t;x.style.cssText="position:fixed;top:42%;left:50%;transform:translateX(-50%);background:#000;border:1px solid #fff5;padding:10px 18px;border-radius:12px;z-index:99;font:300 14px Kanit";document.body.appendChild(x);setTimeout(()=>x.remove(),2000)}
// ---------- backend ----------
async function api(p,o={}){const r=await fetch(API+p,{...o,headers:{"content-type":"application/json",...(tok?{authorization:"Bearer "+tok}:{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||r.status);return j}
const abKey=(k,id)=>(k+"-"+id).replace(/[^A-Za-z0-9_-]/g,"_").slice(0,64);
async function abGet(k,id){try{return (await (await fetch(`${AB}/get/${NS}/${abKey(k,id)}`)).json()).value||0}catch(e){return 0}}
const abHit=(k,id)=>fetch(`${AB}/hit/${NS}/${abKey(k,id)}`).catch(()=>{});
async function loadStats(ids){ids=ids.filter(i=>!S[i]?.loaded);if(!ids.length)return;
 if(API){for(let i=0;i<ids.length;i+=100){const j=await api("/stats?ids="+ids.slice(i,i+100).join(",")).catch(()=>({}));ids.slice(i,i+100).forEach(id=>Object.assign(st(id),j[id]||{},{loaded:1}))}}
 else await Promise.all(ids.map(async id=>{const [p,l,s]=await Promise.all([abGet("p",id),abGet("l",id),abGet("s",id)]);Object.assign(st(id),{pts:p*1000,likes:l,spam:s,loaded:1})}));
 paintAll()}
const Q={pts:{},spam:{}},q=(k,id,n)=>Q[k][id]=(Q[k][id]||0)+n;let abQ=[];
async function flush(){const b={pts:Q.pts,spam:Q.spam};Q.pts={};Q.spam={};if(!Object.keys(b.pts).length&&!Object.keys(b.spam).length)return;
 if(API){if(tok)api("/batch",{method:"POST",body:JSON.stringify(b),keepalive:true}).catch(()=>{})}
 else{for(const id in b.pts)for(let i=0;i<b.pts[id];i++)abQ.push(["p",id]);for(const id in b.spam)for(let i=0;i<Math.min(b.spam[id],200);i++)abQ.push(["s",id])}}
setInterval(flush,5000);addEventListener("pagehide",()=>{flush();sendWatch()});
setInterval(()=>abQ.splice(0,3).forEach(([k,id])=>abHit(k,id)),1000);
// honest แต้มสะสม: send visible+playing seconds; server caps per clip/day and per day
let W={vid:null,secs:0,done:false};
function sendWatch(){if(!API||!tok||!W.vid||(!W.secs&&!W.done))return;const b={vid:W.vid,secs:Math.min(W.secs,20),done:W.done};W.secs=0;W.done=false;
 api("/watch",{method:"POST",body:JSON.stringify(b),keepalive:true}).then(j=>{if(j.gained){me&&(me.points=j.balance);toast("+"+j.gained+" แต้มสะสม")}}).catch(()=>{})}
setInterval(sendWatch,15000);
// ---------- data ----------
async function loadVideos(){const yt=await fetch("videos.json?"+Date.now()).then(r=>r.json());
 let up=[];if(API)up=(await api("/clips").catch(()=>[])).map(c=>({...c,kind:"upload"}));
 const sh=yt.filter(v=>v.kind=="short"),lg=yt.filter(v=>v.kind!="short"),out=[];let a=0,b=0,u=0;
 while(a<sh.length||b<lg.length||u<up.length){if(u<up.length)out.push(up[u++]);for(let k=0;k<3&&a<sh.length;k++)out.push(sh[a++]);if(b<lg.length)out.push(lg[b++])}
 V=out.map(v=>({...v,artist:v.artist||artistOf(v.title)}))}
// ---------- feed ----------
function clipEl(v,i){const d=document.createElement("section");d.className="clip";d.dataset.i=i;d.dataset.id=v.id;
 d.innerHTML=`<div class="bg" style="background-image:url('${thumb(v)}')"></div><div class="media ${v.kind=="video"?"wide":""}"><img loading="lazy" src="${thumb(v)}" onerror="this.src='${hq(v.id)}'"></div><div class="tap"></div><div class="pz">${I("play","f")}</div>
 <div class="mute">${I("vol")}แตะเพื่อเปิดเสียง</div>
 <div class="side"><div class="av">${esc(v.artist[0])}</div>
 <button class="lk">${I("heart")}<b class="nl">0</b><small>ถูกใจ</small></button>
 <button class="sp">${I("hearts")}<b class="ns">0</b><small>หัวใจรัว</small></button>
 <button class="cmb">${I("chat")}<b class="nc">0</b><small>ความเห็น</small></button>
 <button class="sh">${I("share")}<small>แชร์</small></button>
 <div class="pts"><b class="np">0</b><small>แต้มม่วน</small></div></div>
 <div class="meta"><div class="ar">@${esc(v.artist)}</div><div class="ti">${esc(v.title)}</div><div class="m">${I("music")}${v.kind=="upload"?"คลิปจากศิลปิน":"พอดีม่วน STUDIO"}</div></div>`;
 d.querySelector(".tap").addEventListener("pointerup",e=>onTap(d,v,e));
 d.querySelector(".sp").onclick=e=>heart(d,v,{clientX:innerWidth/2,clientY:innerHeight/2});
 d.querySelector(".lk").onclick=()=>like(v,d);d.querySelector(".cmb").onclick=()=>openCm(v);d.querySelector(".sh").onclick=()=>share(v);return d}
function paint(d){const s=st(d.dataset.id);d.querySelector(".nl").textContent=nf(s.likes);d.querySelector(".ns").textContent=nf(s.spam);d.querySelector(".nc").textContent=nf(s.cm);d.querySelector(".np").textContent=nf(s.pts);
 d.querySelector(".lk").classList.toggle("liked",!!ls.get("ym_liked",{})[d.dataset.id])}
const paintAll=()=>document.querySelectorAll(".clip").forEach(paint);
const ytCmd=(f,fn)=>f?.contentWindow?.postMessage(JSON.stringify({event:"command",func:fn,args:[]}),"*");
function mount(d){if(cur?.d==d)return;sendWatch();const v=V[d.dataset.i],m=d.querySelector(".media");cur={v,d};playing=false;W={vid:v.id,secs:0,done:false};
 document.querySelectorAll(".clip iframe,.clip video").forEach(x=>x.remove());document.querySelectorAll(".clip.paused").forEach(x=>x.classList.remove("paused"));
 if(v.kind=="upload"){const el=document.createElement("video");el.src=v.url;el.loop=el.playsInline=el.autoplay=true;el.muted=muted;el.onplay=()=>playing=true;el.onpause=()=>playing=false;
  el.ontimeupdate=()=>{if(el.duration&&el.currentTime>el.duration-1.2)W.done=true};m.appendChild(el)}
 else{const f=document.createElement("iframe");f.allow="autoplay;encrypted-media;fullscreen";
  f.src=`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=${muted?1:0}&playsinline=1&loop=1&playlist=${v.id}&controls=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
  f.onload=()=>f.contentWindow.postMessage('{"event":"listening","id":1}',"*");m.appendChild(f)}
 document.querySelectorAll(".mute").forEach(x=>x.style.display=muted?"":"none");
 const i=+d.dataset.i;loadStats(V.slice(i,i+4).map(x=>x.id));history.replaceState(null,"","#v="+v.id+(location.hash.match(/ref=\w+/)?"&"+location.hash.match(/ref=\w+/)[0]:""))}
addEventListener("message",e=>{if(!/youtube/.test(e.origin))return;try{const j=JSON.parse(e.data),inf=j.info||{};
 if(inf.playerState!==undefined)playing=inf.playerState==1,inf.playerState==0&&(W.done=true);
 if(inf.currentTime&&inf.duration&&inf.currentTime>inf.duration-1.5)W.done=true}catch(_){}});
// count only while visible + playing + feed shown
setInterval(()=>{if(cur&&playing&&!document.hidden&&$("#feed").style.display!="none"&&$("#promo").style.display!="flex"){st(cur.v.id).pts+=1000;q("pts",cur.v.id,1);W.secs++;paint(cur.d)}},1000);
function unmute(d){muted=false;document.querySelectorAll(".mute").forEach(x=>x.style.display="none");const f=d.querySelector("iframe");ytCmd(f,"unMute");ytCmd(f,"playVideo");const vd=d.querySelector("video");if(vd){vd.muted=false;vd.play()}}
function togglePlay(d){const f=d.querySelector("iframe"),vd=d.querySelector("video"),p=d.classList.toggle("paused");
 if(vd)p?vd.pause():vd.play();else ytCmd(f,p?"pauseVideo":"playVideo");if(f)playing=!p}
// single tap = pause/play (or unmute first time); double+ tap = หัวใจรัว
let tapT=null,lastTap=0;
function onTap(d,v,e){const now=Date.now();
 if(now-lastTap<300){clearTimeout(tapT);tapT=null;heart(d,v,e);lastTap=now;return}
 lastTap=now;const ev={clientX:e.clientX,clientY:e.clientY};
 tapT=setTimeout(()=>{tapT=null;if(muted)unmute(d);else togglePlay(d)},300)}
function heart(d,v,e){const h=document.createElement("div");h.className="heart";h.innerHTML=I("heart");h.style.left=e.clientX+"px";h.style.top=e.clientY+"px";h.style.setProperty("--r",(Math.random()*40-20)+"deg");d.appendChild(h);setTimeout(()=>h.remove(),1000);
 st(v.id).spam++;q("spam",v.id,1);paint(d)}
async function like(v,d){const L=ls.get("ym_liked",{});if(L[v.id])return toast("ถูกใจไปแล้ว (1 คน 1 ครั้ง)");
 if(API){if(!tok)return gate();try{st(v.id).likes=(await api("/like",{method:"POST",body:JSON.stringify({id:v.id})})).likes}catch(e){return toast(e.message)}}else{st(v.id).likes++;abHit("l",v.id)}
 L[v.id]=1;ls.set("ym_liked",L);paint(d)}
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
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.6&&$("#feed").style.display!="none")mount(e.target)}),{threshold:[.6]});
function buildFeed(start){const f=$("#feed");f.innerHTML="";V.forEach((v,i)=>{const d=clipEl(v,i);f.appendChild(d);io.observe(d)});if(start>0)f.children[start].scrollIntoView()}
// ---------- promo: top trending, 10s ----------
async function promo(){let t=null;try{t=(await fetch("top.json?"+Date.now()).then(r=>r.json()))[0]}catch(e){}
 if(API)try{const x=(await api("/top"))[0];if(x)t={id:x.vid,points:x.pts}}catch(e){}
 const v=t&&V.find(x=>x.id==t.id)||V[0];if(!v)return;const p=$("#promo");let n=10;
 p.innerHTML=`<div class="pbg" style="background-image:url('${hq(v.id)}')"></div><div class="pg"></div><div class="x"><b id="pn">10</b><span>${I("x")}</span></div>
 <div class="pin"><span class="tag">มาแรง อันดับ 1</span><h1>${esc(v.title)}</h1><div class="m" style="color:#ddd">@${esc(v.artist)} · แต้มม่วน ${nf(t?.points||st(v.id).pts)}</div>
 <button class="btn" style="margin-top:18px;display:inline-flex;gap:8px;align-items:center" id="pw">${I("play").replace('class="i ','class="i f ').replace("stroke:#fff","")}ดูเลย</button><div class="bar"><i id="pb"></i></div></div>`;
 p.querySelector("#pw svg").style.cssText="stroke:#000;fill:#000;width:16px;height:16px";
 p.style.display="flex";requestAnimationFrame(()=>{$("#pb").style.transition="width 10s linear";$("#pb").style.width="100%"});
 const close=go2=>{clearInterval(T);p.style.display="none";if(go2)openClip(v.id)};
 const T=setInterval(()=>{n--;$("#pn").textContent=n;if(n<=0)close(false)},1000);
 p.querySelector(".x").onclick=e=>{e.stopPropagation();close(false)};p.onclick=()=>close(true)}
// ---------- pages ----------
const head=(t,s)=>`<h2>${t}</h2><div class="rule"></div>${s?`<p class="m">${s}</p>`:""}`;
const rowHtml=(v,i,lab)=>`<a class="row" onclick="openClip('${v.id}')"><div class="rk">${i+1}</div><img src="${thumb(v)}" onerror="this.src='${hq(v.id)}'"><div class="t">${esc(v.title)}<div class="m">@${esc(v.artist)}${lab?" · "+lab:""}</div></div></a>`;
async function trend(){const p=$("#p-trend");p.innerHTML=head("มาแรง","จัดอันดับด้วยแต้มม่วน · ฟัง 1 วินาที = 1,000 แต้ม")+'<p class="m">กำลังโหลด...</p>';
 if(API){const t=await api("/top").catch(()=>[]);t.forEach(x=>Object.assign(st(x.vid),x,{pts:x.pts,loaded:1}))}else await loadStats(V.slice(0,60).map(v=>v.id));
 const L=V.filter(v=>st(v.id).pts>0).sort((a,b)=>st(b.id).pts-st(a.id).pts).slice(0,50);
 p.innerHTML=head("มาแรง","จัดอันดับด้วยแต้มม่วน · ฟัง 1 วินาที = 1,000 แต้ม")+(L.map((v,i)=>rowHtml(v,i,"แต้มม่วน "+nf(st(v.id).pts))).join("")||'<div class="note">ยังไม่มีข้อมูล</div>')}
let boardTab="artist";
async function board(){const p=$("#p-board"),tabs=`<div>${[["artist","ศิลปิน"],["fans","แฟนแต้มสะสม"],["hearts","ซุปเปอร์หัวใจ"]].map(([k,n])=>`<span class="chip ${k==boardTab?"on":""}" onclick="boardTab='${k}';board()">${n}</span>`).join("")}</div>`;
 p.innerHTML=head("อันดับ","♥ ถูกใจ = ผู้ชม 1 คน 1 ครั้ง · หัวใจรัว = กดรัวได้ไม่จำกัด รวมที่ศิลปินกดเอง จึงไม่ใช่ยอดถูกใจจริง")+tabs+'<p class="m">กำลังโหลด...</p>';
 if(boardTab!="artist"){if(!API){p.innerHTML=head("อันดับ")+tabs+soon("อันดับซุปเปอร์แฟน","เมื่อเปิดระบบสมาชิก จะแสดงแฟนที่สะสมแต้มและซุปเปอร์หัวใจมากที่สุดที่นี่");return}
  const lb=await api("/leaderboard").catch(()=>({points:[],hearts:[]})),L=boardTab=="fans"?lb.points:lb.hearts;
  p.innerHTML=head("อันดับ")+tabs+(L.map((x,i)=>`<div class="row"><div class="rk">${i+1}</div><div class="av">${esc(x.name[0])}</div><div class="t">${esc(x.name)}<div class="m">${boardTab=="fans"?"แต้มสะสม":"ซุปเปอร์หัวใจ"} ${nf(x.v)}</div></div></div>`).join("")||'<div class="note">ยังไม่มีข้อมูล</div>');return}
 await loadStats(V.slice(0,API?V.length:60).map(v=>v.id));const A={};
 V.forEach(v=>{if(!S[v.id]?.loaded)return;const a=A[v.artist]||(A[v.artist]={pts:0,likes:0,spam:0}),s=st(v.id);a.pts+=s.pts;a.likes+=s.likes;a.spam+=s.spam});
 p.innerHTML=head("อันดับ","♥ ถูกใจ = ผู้ชม 1 คน 1 ครั้ง · หัวใจรัว = กดรัวได้ไม่จำกัด รวมที่ศิลปินกดเอง จึงไม่ใช่ยอดถูกใจจริง")+tabs+
 Object.entries(A).sort((a,b)=>b[1].pts-a[1].pts).map(([n,a],i)=>`<div class="row"><div class="rk">${i+1}</div><div class="av">${esc(n[0])}</div><div class="t">${esc(n)}<div class="m">แต้มม่วน ${nf(a.pts)} · ถูกใจ ${nf(a.likes)} · หัวใจรัว ${nf(a.spam)}</div></div></div>`).join("")}
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
<p><b>การเปิดเผย:</b> ไม่ขายข้อมูล ใช้ผู้ให้บริการระบบ (Cloudflare, Cloudinary, YouTube) เท่าที่จำเป็นเท่านั้น</p>
<p><b>ระยะเวลาเก็บ:</b> ตลอดอายุสมาชิก และลบภายใน 90 วันหลังขอลบบัญชี เว้นแต่กฎหมายกำหนดให้เก็บนานกว่า</p>
<p><b>สิทธิของคุณตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA):</b> ขอเข้าถึง ขอสำเนา แก้ไข ลบ ระงับ คัดค้าน ขอโอนย้ายข้อมูล ถอนความยินยอม และร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล ติดต่อค่ายเพลงพอดีม่วนทางเพจสงครามพอดีม่วน</p>
<p><b>กติกา:</b> แต้มสะสมได้จากการดูคลิปจริง มีเพดานต่อคลิปและต่อวัน ห้ามใช้บอทหรือโกงแต้ม ค่ายสงวนสิทธิ์ระงับบัญชีและยกเลิกแต้มที่ได้มาโดยไม่สุจริต แต้มม่วนและหัวใจรัวเป็นตัวเลขเพื่อความสนุก แลกของไม่ได้ ของรางวัลมีจำนวนจำกัด</p>
<button class="btn" onclick="$('#modal').style.display='none'">ปิด</button>`;
function showTerms(){$("#modal").innerHTML=`<div class="box">${TERMS}</div>`;$("#modal").style.display="block"}
function gate(){go("me")}
async function mePage(){const p=$("#p-me");
 if(!API){p.innerHTML=head("ซุปเปอร์แฟน ค่ายพอดีม่วน")+soon("สมัครซุปเปอร์แฟน","สะสมแต้มจากการดูคลิปจนจบ รับซุปเปอร์หัวใจเมื่อเพื่อนเปิดลิงก์ที่คุณแชร์ ไต่ระดับ และแลกของรางวัลสุดพิเศษ<br>ระหว่างนี้ดูคลิป กดถูกใจ และกดหัวใจรัวได้เลย")+
  `<div class="stat"><div><b>${I("star")}</b><span>แต้มสะสม</span></div><div><b>${I("hearts")}</b><span>ซุปเปอร์หัวใจ</span></div><div><b>${I("trophy")}</b><span>ระดับ</span></div></div><p style="text-align:center"><a class="lnk m" onclick="showTerms()">ข้อกำหนดและนโยบายความเป็นส่วนตัว</a></p>`;return}
 if(!tok){p.innerHTML=head("ซุปเปอร์แฟน ค่ายพอดีม่วน","สมัครฟรีเพื่อเข้าใช้งาน สะสมแต้ม และแลกของรางวัล")+`<div><span class="chip on" id="tS">สมัคร</span><span class="chip" id="tL">เข้าสู่ระบบ</span></div><div id="af"></div>`;
  const su=()=>{$("#af").innerHTML=`<input id="fn" placeholder="ชื่อที่แสดง"><input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)" autocomplete="new-password">
   <label class="ck"><input type="checkbox" id="c1">ฉันยอมรับ<a class="lnk" onclick="showTerms()">ข้อกำหนดการใช้งาน</a></label><label class="ck"><input type="checkbox" id="c2">ฉันได้อ่านและยินยอมตาม<a class="lnk" onclick="showTerms()">ประกาศความเป็นส่วนตัว (PDPA)</a></label><button class="btn" style="width:100%" id="go">สมัครซุปเปอร์แฟน</button>`;
   $("#go").onclick=()=>auth("/signup",{name:$("#fn").value,login:$("#fl").value,password:$("#fp").value,acceptTerms:$("#c1").checked,acceptPrivacy:$("#c2").checked})};
  const li=()=>{$("#af").innerHTML=`<input id="fl" placeholder="เบอร์โทรหรืออีเมล" autocomplete="username"><input id="fp" type="password" placeholder="รหัสผ่าน" autocomplete="current-password"><button class="btn" style="width:100%" id="go">เข้าสู่ระบบ</button>`;
   $("#go").onclick=()=>auth("/login",{login:$("#fl").value,password:$("#fp").value})};
  $("#tS").onclick=()=>{$("#tS").classList.add("on");$("#tL").classList.remove("on");su()};$("#tL").onclick=()=>{$("#tL").classList.add("on");$("#tS").classList.remove("on");li()};su();return}
 await refreshMe();if(!me)return mePage();const mem=["singer","admin"].includes(me.role);
 p.innerHTML=head(esc(me.name),`${esc(me.tier)}${mem?" · ศิลปินในค่าย":""}`)+`<div class="stat"><div><b>${nf(me.points)}</b><span>แต้มสะสม</span></div><div><b>${nf(me.hearts)}</b><span>ซุปเปอร์หัวใจ</span></div><div><b>${nf(me.today)}/${me.rules.dailyPointCap}</b><span>แต้มวันนี้</span></div></div>
 <div class="note">ดูครบ ${me.rules.secsPerPoint} วินาที = 1 แต้มสะสม · ดูจนจบ +${me.rules.completeBonus} · สูงสุด ${me.rules.dailyPointCap} แต้ม/วัน<br>ระดับ: ${me.tiers.map(t=>t[1]+" ("+t[0]+" หัวใจ)").join(" · ")}<br>ลิงก์แชร์ของคุณจะติดรหัส ${esc(me.ref)} อัตโนมัติ</div>
 ${mem&&!me.uploads?`<h3>อัปโหลดคลิปแนวตั้ง</h3><div class="note">ระบบอัปโหลดคลิปสำหรับศิลปินจะเปิดให้ใช้เร็วๆ นี้ ขออภัยในความไม่สะดวก</div>`:mem?`<h3>อัปโหลดคลิปแนวตั้ง</h3><p class="m">ไม่เกิน 100MB และ 3 นาที</p><input type="file" id="uf" accept="video/*"><input id="ut" placeholder="ชื่อคลิป / เพลง"><button class="btn" onclick="upload()">${"อัปโหลด"}</button><div id="us" class="m"></div>`:
  `<h3>สมาชิกค่าย</h3><input id="pin" type="password" placeholder="รหัส PIN จากแอดมิน"><button class="btn o" onclick="pinLink()">ยืนยันเป็นศิลปิน</button>`}
 <h3>ประวัติแต้ม</h3>${me.history.map(h=>`<div class="row"><div class="t">${h.kind=="watch"?"ดูคลิป":h.kind=="complete"?"ดูจนจบ":h.kind=="redeem"?"แลก "+esc(h.note):h.kind=="refund"?esc(h.note):esc(h.kind)}<div class="m">${h.day}</div></div><b>${h.delta>0?"+":""}${h.delta}</b></div>`).join("")||'<p class="m">ยังไม่มี</p>'}
 <h3>การแลกของรางวัล</h3>${me.redemptions.map(r=>`<div class="row"><div class="t">${esc(r.reward)}<div class="m">${({pending:"รออนุมัติ",approved:"อนุมัติแล้ว",shipped:"จัดส่งแล้ว",rejected:"ไม่อนุมัติ (คืนแต้มแล้ว)"})[r.status]||r.status}</div></div></div>`).join("")||'<p class="m">ยังไม่มี</p>'}
 ${me.role=="admin"?'<div id="adm"></div>':""}<p><button class="btn o" onclick="logout()">ออกจากระบบ</button> <a class="lnk m" onclick="showTerms()">ข้อกำหนดและ PDPA</a></p>`;if(me.role=="admin")admin()}
async function auth(path,b){try{const j=await api(path,{method:"POST",body:JSON.stringify(b)});tok=j.token;ls.set("ym_tok",tok);me=j.user;sendRef();go("home")}catch(e){toast(e.message)}}
async function pinLink(){try{await api("/pin-link",{method:"POST",body:JSON.stringify({pin:$("#pin").value})});toast("ยืนยันแล้ว");mePage()}catch(e){toast(e.message)}}
async function logout(){await api("/logout",{method:"POST"}).catch(()=>{});tok=null;me=null;localStorage.removeItem("ym_tok");mePage()}
async function upload(){const f=$("#uf").files[0],s=$("#us");if(!f)return;if(f.size>100*1024*1024)return s.textContent="ไฟล์ใหญ่เกิน 100MB";
 const dur=await new Promise(r=>{const v=document.createElement("video");v.preload="metadata";v.onloadedmetadata=()=>r(v.duration);v.onerror=()=>r(0);v.src=URL.createObjectURL(f)});if(dur>180)return s.textContent="คลิปยาวเกิน 3 นาที";
 try{const sg=await api("/upload-sign",{method:"POST"}),fd=new FormData();fd.append("file",f);for(const k in sg.params)fd.append(k,sg.params[k]);
  const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("POST",sg.url);x.upload.onprogress=e=>s.textContent="กำลังอัปโหลด "+Math.round(e.loaded/e.total*100)+"%";x.onload=()=>x.status<300?ok(JSON.parse(x.responseText)):no(new Error(x.responseText));x.onerror=no;x.send(fd)});
  await api("/clips",{method:"POST",body:JSON.stringify({public_id:r.public_id,url:r.secure_url,duration:r.duration,title:$("#ut").value})});s.textContent="อัปโหลดสำเร็จ";await loadVideos();buildFeed(0)}catch(e){s.textContent="ผิดพลาด: "+e.message}}
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
 <h3>คลิปที่อัปโหลด</h3>${cl.map(x=>`<div class="row"><div class="t">${esc(x.title)}<div class="m">@${esc(x.artist)}</div></div><button class="btn o" onclick="adm('/admin/clip','DELETE',{id:'${esc(x.id)}'})">ลบ</button></div>`).join("")||'<p class="m">ยังไม่มี</p>'}`}
async function adm(p,m,b){if(m=="DELETE"&&!confirm("ยืนยัน?"))return;try{const j=await api(p,{method:m,body:JSON.stringify(b)});if(j.pin)alert("PIN ใหม่: "+j.pin);admin()}catch(e){toast(e.message)}}
const saveRw=id=>adm("/admin/rewards","PUT",{id,name:$("#rn"+id).value,image:$("#ri"+id).value,cost:$("#rc"+id).value,stock:$("#rs"+id).value,active:$("#ra"+id).checked});
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
 if(p!="home"){document.querySelectorAll(".clip iframe,.clip video").forEach(x=>x.remove());cur=null;$("#p-"+p).style.display="block";({trend,board,rewards,me:mePage})[p]()}
 else{const d=[...document.querySelectorAll(".clip")].find(c=>Math.abs(c.getBoundingClientRect().top)<10);d&&mount(d)}}
(async()=>{await refreshMe();sendRef();await loadVideos();const m=location.hash.match(/v=([\w-]+)/);buildFeed(m?Math.max(0,V.findIndex(v=>v.id==m[1])):0);
 if(API&&!tok)go("me");else if(!m)promo()})();
