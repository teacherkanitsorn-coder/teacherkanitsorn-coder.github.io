const API=window.YM_API||"", AB="https://abacus.jasoncameron.dev", NS="youmuan-pdm";
const CH="UCpjChoKuoBGQ368LdINenDg";
const ROSTER=["รำไพ แสงทอง","พร จันทพร","เมย์ จิราพร","ขวัญ พัชรี","จุ๊บแจง เจนจิรา","โชติ ณัฐชัย","นิค สะเลอปี้","วงค์ ชนะกันต์","การ์เนต สะเลอปี้","การ์ฟิวส์ สะเลอปี้"];
const $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"]/g,c=>"&"+"#"+c.charCodeAt(0)+";");
const ls={get:(k,d)=>{try{return JSON.parse(localStorage[k])}catch(e){return d}},set:(k,v)=>localStorage[k]=JSON.stringify(v)};
let V=[],S={},cur=null,me=ls.get("ym_me",null);
const nf=n=>n>=1e9?(n/1e9).toFixed(1)+"B":n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":String(n|0);
const artistOf=t=>ROSTER.find(r=>t.includes(r)||t.includes(r.split(" ")[0]))||"พอดีม่วน STUDIO";
const st=id=>S[id]||(S[id]={pts:0,likes:0,spam:0,cm:0});
// ---------- backend ----------
async function api(p,o={}){const r=await fetch(API+p,{...o,headers:{"content-type":"application/json",...(me?.token?{authorization:"Bearer "+me.token}:{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||r.status);return j}
const abKey=(k,id)=>(k+"-"+id).replace(/[^A-Za-z0-9_-]/g,"_").slice(0,64);
async function abGet(k,id){try{const r=await fetch(`${AB}/get/${NS}/${abKey(k,id)}`);return (await r.json()).value||0}catch(e){return 0}}
async function abHit(k,id){try{const r=await fetch(`${AB}/hit/${NS}/${abKey(k,id)}`);return (await r.json()).value}catch(e){}}
async function loadStats(ids){ids=ids.filter(i=>!S[i]?.loaded);if(!ids.length)return;
  if(API){for(let i=0;i<ids.length;i+=100){const j=await api("/stats?ids="+ids.slice(i,i+100).join(","));for(const id in j)Object.assign(st(id),j[id],{loaded:1})}}
  else await Promise.all(ids.map(async id=>{const [p,l,s]=await Promise.all([abGet("p",id),abGet("l",id),abGet("s",id)]);Object.assign(st(id),{pts:p*1000,likes:l,spam:s,loaded:1})}));
  paintAll()}
// batched writes: points (1 unit = 1,000 แต้ม per second) + spam taps, flushed every 5s
const Q={pts:{},spam:{}};
function q(kind,id,n){Q[kind][id]=(Q[kind][id]||0)+n}
let abQ=[];
async function flush(){const b={pts:Q.pts,spam:Q.spam};Q.pts={};Q.spam={};
  if(!Object.keys(b.pts).length&&!Object.keys(b.spam).length)return;
  if(API){try{await api("/batch",{method:"POST",body:JSON.stringify(b),keepalive:true})}catch(e){}}
  else{for(const id in b.pts)for(let i=0;i<b.pts[id];i++)abQ.push(["p",id]);for(const id in b.spam)for(let i=0;i<Math.min(b.spam[id],200);i++)abQ.push(["s",id])}}
setInterval(flush,5000);addEventListener("pagehide",flush);
setInterval(()=>{const x=abQ.splice(0,3);x.forEach(([k,id])=>abHit(k,id))},1000); // fallback: drip 3 req/s max
// ---------- data ----------
async function loadVideos(){const yt=await fetch("videos.json?"+Date.now()).then(r=>r.json());
  let up=[];if(API)try{up=(await api("/clips")).map(c=>({...c,kind:"upload"}))}catch(e){}
  const sh=yt.filter(v=>v.kind=="short"),lg=yt.filter(v=>v.kind!="short");
  // mix: uploads first-ish, then shorts with a long video every 3
  const out=[];let a=0,b=0,u=0;while(a<sh.length||b<lg.length||u<up.length){if(u<up.length)out.push(up[u++]);for(let k=0;k<3&&a<sh.length;k++)out.push(sh[a++]);if(b<lg.length)out.push(lg[b++])}
  V=out.map(v=>({...v,artist:v.artist||artistOf(v.title)}))}
const thumb=v=>v.kind=="upload"?(v.thumb||""):`https://i.ytimg.com/vi/${v.id}/${v.kind=="short"?"oardefault":"hqdefault"}.jpg`;
// ---------- feed ----------
function clipEl(v,i){const d=document.createElement("section");d.className="clip";d.dataset.i=i;d.dataset.id=v.id;
 d.innerHTML=`<div class="bg" style="background-image:url('${thumb(v)}')"></div><div class="media ${v.kind=="video"?"wide":""}"><img src="${thumb(v)}" onerror="this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'"></div><div class="tap"></div>
 <div class="mute">🔇 แตะเพื่อเปิดเสียง</div>
 <div class="side"><div class="av">${esc(v.artist[0])}</div>
 <button class="lk"><span class="ic">♥</span><b class="nl">0</b><small>ถูกใจ</small></button>
 <button class="sp" disabled><span class="ic">💗</span><b class="ns">0</b><small>หัวใจรัว</small></button>
 <button class="cmb"><span class="ic">💬</span><b class="nc">0</b></button>
 <button class="sh"><span class="ic">↪</span>แชร์</button>
 <div class="pts">แต้มม่วน<br><b class="np">0</b></div></div>
 <div class="meta"><div class="ar">@${esc(v.artist)}</div><div class="ti">${esc(v.title)}</div><div class="m">${v.kind=="upload"?"📱 คลิปจากศิลปิน":"🎵 พอดีม่วน STUDIO"}</div></div>`;
 d.querySelector(".tap").addEventListener("pointerdown",e=>tapHeart(d,v,e));
 d.querySelector(".lk").onclick=()=>like(v,d);d.querySelector(".cmb").onclick=()=>openCm(v);d.querySelector(".sh").onclick=()=>share(v);
 return d}
function paint(d){const s=st(d.dataset.id);d.querySelector(".nl").textContent=nf(s.likes);d.querySelector(".ns").textContent=nf(s.spam);d.querySelector(".nc").textContent=nf(s.cm);d.querySelector(".np").textContent=nf(s.pts);
 d.querySelector(".lk").classList.toggle("liked",!!ls.get("ym_liked",{})[d.dataset.id])}
function paintAll(){document.querySelectorAll(".clip").forEach(paint)}
let muted=true,playing=false;
function mount(d){const v=V[d.dataset.i],m=d.querySelector(".media");cur={v,d};playing=false;
 document.querySelectorAll(".clip iframe,.clip video").forEach(x=>x.remove());
 if(v.kind=="upload"){const el=document.createElement("video");el.src=v.url;el.loop=el.playsInline=el.autoplay=true;el.muted=muted;el.onplay=()=>playing=true;el.onpause=()=>playing=false;m.appendChild(el)}
 else{const f=document.createElement("iframe");f.allow="autoplay;encrypted-media;fullscreen";
  f.src=`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=${muted?1:0}&playsinline=1&loop=1&playlist=${v.id}&controls=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
  f.onload=()=>f.contentWindow.postMessage('{"event":"listening","id":1}',"*");m.appendChild(f)}
 d.querySelector(".mute").style.display=muted?"":"none";
 const i=+d.dataset.i;loadStats(V.slice(i,i+4).map(x=>x.id));history.replaceState(null,"","#v="+v.id)}
addEventListener("message",e=>{if(!/youtube/.test(e.origin))return;try{const j=JSON.parse(e.data);const ps=j.info?.playerState;if(ps!==undefined)playing=ps==1}catch(_){}});
setInterval(()=>{if(cur&&playing&&!document.hidden&&$("#feed").style.display!="none"){st(cur.v.id).pts+=1000;q("pts",cur.v.id,1);paint(cur.d)}},1000);
function unmute(d){if(!muted)return;muted=false;d.querySelectorAll(".mute").forEach(x=>x.style.display="none");document.querySelectorAll(".mute").forEach(x=>x.style.display="none");
 const f=d.querySelector("iframe");if(f){f.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}',"*");f.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}',"*")}
 const vd=d.querySelector("video");if(vd){vd.muted=false;vd.play()}}
function tapHeart(d,v,e){unmute(d);const h=document.createElement("div");h.className="heart";h.textContent="♥";h.style.left=e.clientX+"px";h.style.top=e.clientY+"px";h.style.setProperty("--r",(Math.random()*50-25)+"deg");d.appendChild(h);setTimeout(()=>h.remove(),1000);
 st(v.id).spam++;q("spam",v.id,1);paint(d)}
async function like(v,d){const L=ls.get("ym_liked",{});if(L[v.id])return toast("ถูกใจไปแล้ว (1 คน = 1 ถูกใจ)");
 if(API){if(!me)return needLogin();try{const j=await api("/like",{method:"POST",body:JSON.stringify({id:v.id})});st(v.id).likes=j.likes}catch(e){return toast(e.message)}}
 else{st(v.id).likes++;abHit("l",v.id)}
 L[v.id]=1;ls.set("ym_liked",L);paint(d)}
function share(v){const u=location.origin+location.pathname+"#v="+v.id;navigator.share?navigator.share({title:v.title,url:u}).catch(()=>{}):(navigator.clipboard.writeText(u),toast("คัดลอกลิงก์แล้ว"))}
function toast(t){const x=document.createElement("div");x.textContent=t;x.style.cssText="position:fixed;top:40%;left:50%;transform:translateX(-50%);background:#000c;padding:10px 16px;border-radius:10px;z-index:99";document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
// comments
let cmV=null;async function openCm(v){cmV=v;$("#cm").classList.add("on");$("#cml").innerHTML="กำลังโหลด...";
 if(!API){$("#cml").innerHTML='<div class="note">ระบบคอมเมนต์จะเปิดเมื่อเชื่อมหลังบ้านแล้ว</div>';return}
 const l=await api("/comments?id="+v.id).catch(()=>[]);$("#cml").innerHTML=l.map(c=>`<p><b>${esc(c.name)}</b>${c.singer?" 🎤":""} <span class="m">${new Date(c.t).toLocaleString("th")}</span><br>${esc(c.text)}${me?.admin?` <a style="color:#f66" onclick="delCm('${c.k}')">ลบ</a>`:""}</p>`).join("")||"ยังไม่มีความคิดเห็น"}
async function sendCm(e){e.preventDefault();if(!API)return;if(!me)return needLogin();const t=$("#cmi").value.trim();if(!t)return;
 await api("/comments",{method:"POST",body:JSON.stringify({id:cmV.id,text:t})}).catch(x=>toast(x.message));$("#cmi").value="";st(cmV.id).cm++;openCm(cmV)}
async function delCm(k){await api("/admin/comment",{method:"DELETE",body:JSON.stringify({k})});openCm(cmV)}
function needLogin(){toast("กรุณาเข้าสู่ระบบก่อน");go("me")}
// feed observer
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.6)mount(e.target)}),{threshold:[.6]});
function buildFeed(start){const f=$("#feed");f.innerHTML="";V.forEach((v,i)=>{const d=clipEl(v,i);f.appendChild(d);io.observe(d)});
 if(start>0)f.children[start].scrollIntoView()}
// ---------- pages ----------
function rowHtml(v,i,val,lab){return `<a class="row" onclick="openClip('${v.id}')"><div class="rk">${i+1}</div><img src="${thumb(v)}" onerror="this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'"><div class="t">${esc(v.title)}<div class="m">@${esc(v.artist)}</div><div class="m">${lab}: <b style="color:#fff">${nf(val)}</b></div></div></a>`}
async function trend(){const p=$("#p-trend");p.innerHTML="<h2>🔥 มาแรง</h2><p class='m'>เรียงตามแต้มม่วน (ฟัง 1 วินาที = 1,000 แต้ม นับทุกครั้งที่ฟังซ้ำ)</p>กำลังโหลด...";
 await loadStats(V.slice(0,API?V.length:120).map(v=>v.id));
 const L=[...V].filter(v=>S[v.id]).sort((a,b)=>st(b.id).pts-st(a.id).pts).slice(0,50);
 p.innerHTML="<h2>🔥 มาแรง</h2><p class='m'>เรียงตามแต้มม่วน (ฟัง 1 วินาที = 1,000 แต้ม นับทุกครั้งที่ฟังซ้ำ)</p>"+L.map((v,i)=>rowHtml(v,i,st(v.id).pts,"แต้มม่วน")).join("")}
async function board(){const p=$("#p-board");p.innerHTML="<h2>🏆 อันดับศิลปิน</h2>กำลังโหลด...";await loadStats(V.slice(0,API?V.length:120).map(v=>v.id));
 const A={};V.forEach(v=>{if(!S[v.id])return;const a=A[v.artist]||(A[v.artist]={pts:0,likes:0,spam:0});const s=st(v.id);a.pts+=s.pts;a.likes+=s.likes;a.spam+=s.spam});
 p.innerHTML="<h2>🏆 อันดับศิลปิน</h2><p class='m'>♥ ถูกใจ = ผู้ชม 1 คน 1 ครั้ง · 💗 หัวใจรัว = กดรัวได้ไม่จำกัด (รวมที่ศิลปินกดเอง) ไม่ใช่ยอดถูกใจจริง</p>"+
 Object.entries(A).sort((a,b)=>b[1].pts-a[1].pts).map(([n,a],i)=>`<div class="row"><div class="rk">${i+1}</div><div class="av">${esc(n[0])}</div><div class="t"><b>${esc(n)}</b><div class="m">แต้มม่วน ${nf(a.pts)} · ♥ ถูกใจ ${nf(a.likes)} · 💗 หัวใจรัว ${nf(a.spam)}</div></div></div>`).join("")}
function upPage(){const p=$("#p-up");
 if(!API){p.innerHTML='<h2>อัปโหลดคลิป</h2><div class="note">ระบบอัปโหลดสำหรับศิลปินยังไม่เปิด (รอเชื่อมหลังบ้าน)</div>';return}
 if(!me?.singer&&!me?.admin){p.innerHTML='<h2>อัปโหลดคลิป</h2><div class="note">เฉพาะศิลปินในค่ายเท่านั้น เข้าสู่ระบบด้วยรหัสศิลปินที่หน้าโปรไฟล์</div>';return}
 p.innerHTML=`<h2>อัปโหลดคลิปแนวตั้ง</h2><p class="m">ไม่เกิน 100MB และไม่เกิน 3 นาที</p><input type="file" id="uf" accept="video/*" capture="environment"><input id="ut" placeholder="ชื่อคลิป / เพลง"><button class="btn" id="ub">อัปโหลด</button><div id="us" class="m"></div>`;
 $("#ub").onclick=upload}
async function upload(){const f=$("#uf").files[0],s=$("#us");if(!f)return;if(f.size>100*1024*1024)return s.textContent="ไฟล์ใหญ่เกิน 100MB";
 const dur=await new Promise(r=>{const v=document.createElement("video");v.preload="metadata";v.onloadedmetadata=()=>r(v.duration);v.onerror=()=>r(0);v.src=URL.createObjectURL(f)});
 if(dur>180)return s.textContent="คลิปยาวเกิน 3 นาที";
 try{s.textContent="กำลังเตรียม...";const sg=await api("/upload-sign",{method:"POST"});
  const fd=new FormData();fd.append("file",f);for(const k in sg.params)fd.append(k,sg.params[k]);
  const r=await new Promise((ok,no)=>{const x=new XMLHttpRequest();x.open("POST",sg.url);x.upload.onprogress=e=>s.textContent="กำลังอัปโหลด "+Math.round(e.loaded/e.total*100)+"%";x.onload=()=>x.status<300?ok(JSON.parse(x.responseText)):no(new Error(x.responseText));x.onerror=no;x.send(fd)});
  await api("/clips",{method:"POST",body:JSON.stringify({public_id:r.public_id,url:r.secure_url,duration:r.duration,title:$("#ut").value})});s.textContent="อัปโหลดสำเร็จ 🎉";await loadVideos();buildFeed(0)}catch(e){s.textContent="ผิดพลาด: "+e.message}}
function mePage(){const p=$("#p-me");
 if(!API){p.innerHTML=`<h2>โปรไฟล์</h2><div class="note">ตอนนี้ดูคลิป กดถูกใจ กดหัวใจรัว และสะสมแต้มม่วนได้เลยโดยไม่ต้องล็อกอิน<br>ระบบล็อกอิน คอมเมนต์ และอัปโหลดของศิลปิน จะเปิดเมื่อเชื่อมหลังบ้านแล้ว</div><a class="btn" style="display:inline-block;text-decoration:none" href="https://www.youtube.com/channel/${CH}?sub_confirmation=1" target="_blank">ติดตามช่อง YouTube</a>`;return}
 if(me){p.innerHTML=`<h2>สวัสดี ${esc(me.name)} ${me.singer?"🎤":""}${me.admin?" 👑":""}</h2><button class="btn" onclick="logout()">ออกจากระบบ</button>${me.admin?'<div id="adm"></div>':""}`;if(me.admin)admin();return}
 p.innerHTML=`<h2>เข้าสู่ระบบ</h2><h3>ผู้ชม</h3><input id="nn" placeholder="ชื่อเล่น"><button class="btn" onclick="login('viewer')">เข้าใช้งาน</button>
 <h3 style="margin-top:28px">ศิลปิน / แอดมิน</h3><input id="pin" type="password" placeholder="รหัส PIN / รหัสเชิญ"><button class="btn" onclick="login('pin')">เข้าสู่ระบบด้วย PIN</button>`}
async function login(k){try{me=k=="viewer"?await api("/register",{method:"POST",body:JSON.stringify({name:$("#nn").value})}):await api("/pin-login",{method:"POST",body:JSON.stringify({pin:$("#pin").value})});ls.set("ym_me",me);mePage()}catch(e){toast(e.message)}}
function logout(){me=null;localStorage.removeItem("ym_me");mePage()}
async function admin(){const a=$("#adm"),s=await api("/admin/singers"),c=await api("/clips");
 a.innerHTML=`<h3>👑 จัดการศิลปิน</h3>${s.map(x=>`<div class="row"><div class="t">${esc(x.name)} <span class="m">PIN: ${esc(x.pin)}</span></div><button class="btn" onclick="rmSinger('${x.pin}')">ลบ</button></div>`).join("")}
 <select id="sn">${ROSTER.map(r=>`<option>${r}</option>`).join("")}</select><button class="btn" onclick="addSinger()">+ สร้าง PIN ให้ศิลปิน</button>
 <h3>คลิปที่อัปโหลด</h3>${c.map(x=>`<div class="row"><video src="${x.url}" style="width:60px" muted></video><div class="t">${esc(x.title)}<div class="m">@${esc(x.artist)}</div></div><button class="btn" onclick="rmClip('${x.id}')">ลบ</button></div>`).join("")||"ยังไม่มี"}`}
async function addSinger(){await api("/admin/singers",{method:"POST",body:JSON.stringify({name:$("#sn").value})});admin()}
async function rmSinger(pin){if(confirm("ลบศิลปินนี้?")){await api("/admin/singers",{method:"DELETE",body:JSON.stringify({pin})});admin()}}
async function rmClip(id){if(confirm("ลบคลิปนี้?")){await api("/admin/clip",{method:"DELETE",body:JSON.stringify({id})});await loadVideos();admin()}}
// search
function openSearch(){const s=$("#search");s.style.display=s.style.display=="block"?"none":"block";$("#q").focus()}
function doSearch(){const q=$("#q").value.trim().toLowerCase();$("#sr").innerHTML=q?V.filter(v=>(v.title+v.artist).toLowerCase().includes(q)).slice(0,30).map((v,i)=>rowHtml(v,i,0,"").replace(/<div class="m">: .*?<\/div>/,"")).join("")||"<p>ไม่พบ</p>":""}
function openClip(id){$("#search").style.display="none";go("home");const i=V.findIndex(v=>v.id==id);if(i>=0)$("#feed").children[i].scrollIntoView()}
// nav
function go(p){document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.p==p));document.querySelectorAll(".page").forEach(x=>x.style.display="none");
 $("#feed").style.display=p=="home"?"":"none";if(p!="home"){document.querySelectorAll(".clip iframe,.clip video").forEach(x=>x.remove());cur=null;$("#p-"+p).style.display="block";({trend,board,up:upPage,me:mePage})[p]()}
 else if(cur===null){const d=[...document.querySelectorAll(".clip")].find(c=>Math.abs(c.getBoundingClientRect().top)<10);d&&mount(d)}}
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>go(a.dataset.p));
loadVideos().then(()=>{const m=location.hash.match(/v=([\w-]+)/);buildFeed(m?Math.max(0,V.findIndex(v=>v.id==m[1])):0)});
