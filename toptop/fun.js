// ===== TopTop fun features (battle, missions, rescue, titles, duels) =====
let BT=null,DU=null;const BKO=7*36e5;
const btKey=x=>x.prov+"|"+x.amph+"|"+x.tamb;
const btLast=()=>BT?.last&&now()-BT.last.t<6*864e5?BT.last:null;
async function btLoad(){BT=await api("/battle").catch(()=>BT);if(BT)BT.off=BT.now-Date.now();const L=btLast();if(L&&ls.get("tt_btseen",0)!=L.wk&&tab=="home"){ls.set("tt_btseen",L.wk);const [p,a,t]=L.key.split("|");setTimeout(()=>toast(`🏆 แชมป์ศึกตำบลสัปดาห์นี้: ต.${t} อ.${a} จ.${p}`),2500)}}
async function duLoad(){if(document.hidden)return;const j=await api("/duel").catch(()=>null);if(!j)return;DU=j.duel;if(DU){for(const s of [DU.a,DU.b])s.base=s.hearts-s.gain}}
function titlesOf(u){const t=[];if(u.ua)t.push(["⭐ ศิลปิน","art"]);if(u.ut)t.push(["👑 ตัวท็อปประจำอำเภอ","top"]);if(u.uh)t.push([`🦸 ฮีโร่${u.uh>1?" ×"+u.uh:""}`,"hero"]);if((u.ug||0)>=1e4)t.push(["💘 นักรัวใจ","love"]);if((u.us||0)>=7)t.push(["🔥 ขาประจำ 7 วัน","streak"]);return t}
const _postEl=postEl;postEl=function(x,i){const d=_postEl(x,i),ph=d.querySelector(".ph"); const t=titlesOf(x)[0];if(t)d.querySelector(".nm .pmore").insertAdjacentHTML("beforebegin",`<span class="ttl ${t[1]}">${t[0]}</span>`);fxPaint(d,x);return d};
function fxPaint(d,x){let r=d.querySelector(".fxr");if(!r){const w=d.querySelector(".rbs");if(!w)return;r=document.createElement("div");r.className="fxr";w.appendChild(r)}const t=now(),ms=x.expires-t,h=[];
 if(ms>0&&ms<6e5)h.push(`<span class="fx sos">🚑 ช่วยด่วน!</span>`);
 if(BT?.active)h.push(`<span class="fx bt">⚔️ ศึกตำบล x2 · ${left(BT.ends-Date.now()-BT.off)}</span>`);
 const L=btLast();if(L&&x.tamb&&btKey(x)==L.key)h.push(`<span class="fx champ">🏆 ตำบลแชมป์</span>`);
 if(x.av)h.push(`<span class="fx star">ศิลปินมาเยือน ⭐</span>`);
 const s=h.join("");if(r._h!==s){r.innerHTML=s;r._h=s}
 let b=d.querySelector(".duelbar");const me2=DU&&(DU.a.id==x.id?"a":DU.b.id==x.id?"b":null);
 if(me2&&DU.end>Date.now()-3000){const op=me2=="a"?"b":"a",g=k=>{const s=DU[k],f=F.find(y=>y.id==s.id);return Math.max(0,(f?f.hearts:s.hearts)-s.base)},ga=g(me2),gb=g(op);
  if(!b){b=document.createElement("div");b.className="duelbar";b.onclick=e=>{e.stopPropagation();const k=F.findIndex(y=>y.id==DU[op].id);if(k>=0)document.querySelectorAll(".post")[k]?.scrollIntoView({behavior:"smooth"})};d.querySelector(".ph").appendChild(b)}
  b.innerHTML=`<div class="dt">⚔️ ดวลภาพ! ชนะได้ +30 นาที · ${left(DU.end-Date.now())}</div><div class="ds"><span class="me${ga>=gb?" lead":""}">รูปนี้ <b>${nf(ga)}</b></span><i>VS</i><span class="op${gb>ga?" lead":""}"><b>${nf(gb)}</b> @${esc(DU[op].name)} ›</span></div><div class="dbar"><u style="width:${ga+gb?Math.round(ga/(ga+gb)*100):50}%"></u></div>`}
 else if(b)b.remove()}
setInterval(()=>{document.querySelectorAll(".post").forEach(d=>{const x=F[d.dataset.i];if(x)fxPaint(d,x)});if(BT&&(BT.active?Date.now()+BT.off>BT.ends:Date.now()+BT.off>=BT.next))btLoad();const rb=$("#btban .cd");if(rb&&BT)rb.textContent=left((BT.active?BT.ends:BT.next)-Date.now()-BT.off)},1000);
setInterval(()=>{if(tab=="home")duLoad()},10000);
// missions
async function missions(){if(!tok){toast("สมัครฟรีก่อน แล้วทำภารกิจได้");return go("me")}sheet('<p class="m">กำลังโหลด...</p>');$("#sheet .hd b").textContent="🎯 ภารกิจวันนี้";const j=await api("/missions").catch(()=>null);if(!j)return;
 $("#sheet .sbd").innerHTML=`<p class="m">ทำครบแล้วกดรับรางวัล: <b>+15 นาที</b> ให้รูปที่ยังมีชีวิตของคุณ (ถ้ายังไม่มีรูป ได้ <b>กล่องสุ่ม</b> แทน) · รีเซ็ตทุกเที่ยงคืน</p>`+j.missions.map(m=>`<div class="mis${m.n>=m.goal?" ok":""}"><div class="mt"><b>${esc(m.t)}</b><span>${m.n}/${m.goal}</span></div><div class="mbar"><u style="width:${Math.round(m.n/m.goal*100)}%"></u></div>${m.claimed?'<button class="btn o" disabled>รับแล้ว ✓</button>':m.n>=m.goal?`<button class="btn" onclick="claimMis('${m.k}',this)">รับรางวัล 🎁</button>`:""}</div>`).join("")+`<p class="m">🔥 เปิดแอปติดกัน ${j.streak||1} วัน · 🦸 ฮีโร่ ${j.hero||0} ครั้ง</p>`}
async function claimMis(k,b){b.disabled=true;try{const r=await api("/missions",{method:"POST",body:JSON.stringify({k})});toast("🎉 ได้รับ "+r.prize);missions()}catch(e){toast(e.message);b.disabled=false}}
// profile titles + entries
function titleBlock(u){const t=titlesOf(u);return `<div class="ttls">${t.map(([n,c])=>`<span class="ttl big ${c}">${n}</span>`).join("")}</div><div class="fc">🦸 ฮีโร่ช่วยชีวิตรูป <b>${nf(u.uh||0)}</b> ครั้ง</div>`}
const _mePage=mePage;mePage=async function(){await _mePage();if(!me||!$("#avst"))return;$("#avst").insertAdjacentHTML("afterend",titleBlock(me)+`<div class="funb"><button class="btn o" onclick="missions()">🎯 ภารกิจ</button>${typeof boxOpen=="function"?`<button class="btn o" onclick="boxOpen()">🎁 กล่องสุ่ม${me.boxes?` <b class="bdg">${me.boxes}</b>`:""}</button>`:""}${typeof recap=="function"?`<button class="btn o${new Date(Date.now()+BKO).getUTCDay()==0?" sun":""}" onclick="recap()">📊 สรุปสัปดาห์</button>`:""}</div>`)};
const _userPage=userPage;userPage=async function(uid){await _userPage(uid);const o=$("#ov"),h=o?.querySelector("h2");if(!h||!me&&!uid)return;const j=await api("/user/"+uid).catch(()=>null);if(j&&o.querySelector("h2")===h)h.insertAdjacentHTML("afterend",titleBlock(j.user))};
// rank page: battle banner + champion badge
const _areaRank=areaRank;areaRank=async function(){await _areaRank();const p=$("#p-rank"),h=p?.querySelector(".arh");if(!h)return;if(!BT)await btLoad();if(!BT)return;const L=btLast();let s="";
 if(BT.active)s=`<div id="btban" class="btban on"><b>⚔️ ศึกตำบลกำลังดุเดือด! หัวใจนับ x2</b><span>เหลือ <i class="cd">${left(BT.ends-Date.now()-BT.off)}</i></span>${(BT.top||[]).slice(0,3).map((r,i)=>{const [pv,a,t]=r.key.split("|");return `<div class="m">${["🥇","🥈","🥉"][i]} ต.${esc(t)} อ.${esc(a)} จ.${esc(pv)} · ❤️ ${nf(r.hearts)}</div>`}).join("")}</div>`;
 else{const nx=`<span>ศึกครั้งหน้า ศุกร์ 20:00–22:00 · เริ่มใน <i class="cd">${left(BT.next-Date.now()-BT.off)}</i></span>`;if(L){const [pv,a,t]=L.key.split("|");s=`<div id="btban" class="btban"><b>🏆 แชมป์ศึกตำบลสัปดาห์นี้</b><div class="bw">ต.${esc(t)} อ.${esc(a)} จ.${esc(pv)}</div><div class="m">❤️ ${nf(L.hearts)} หัวใจช่วงศึก</div>${nx}</div>`}else s=`<div id="btban" class="btban"><b>⚔️ ศึกตำบล</b><div class="m">ทุกวันศุกร์ 20:00–22:00 หัวใจนับ 2 เท่า ตำบลที่ได้หัวใจมากสุดเป็นแชมป์ประจำสัปดาห์</div>${nx}</div>`}
 h.insertAdjacentHTML("beforebegin",s);if(L)p.querySelectorAll(".arow").forEach(a=>{const k=(a.getAttribute("onclick")||"").match(/areaDown\((.*)\)/);try{if(k&&JSON.parse(k[1].replace(/&#39;/g,"'"))==L.key)a.querySelector(".t div").insertAdjacentHTML("beforeend",' <span class="ttl champ">🏆 แชมป์ศึกตำบล</span>')}catch(e){}})};
// notifications (artist visits, duel wins)
async function notifs(){const L=await api("/notifs").catch(()=>[]);L.forEach((n,i)=>setTimeout(()=>toast(n.text),i*3200))}
btLoad();duLoad();if(tok)setTimeout(()=>{api("/missions").catch(()=>{});notifs()},1500);
// ===== batch 2: mystery box, artist admin, song dedication, weekly recap =====
async function boxOpen(){if(!tok)return go("me");sheet('<p class="m">กำลังโหลด...</p>');$("#sheet .hd b").textContent="🎁 กล่องสุ่ม";const j=await api("/missions").catch(()=>null);if(!j)return;const n=j.boxes||0,pr=(j.box_prog||0)%1000;
 $("#sheet .sbd").innerHTML=`<div class="boxw"><div class="gift${n?" ready":""}" id="gift">🎁</div><div class="bxn">มีกล่อง <b>${n}</b> กล่อง</div><div class="mbar"><u style="width:${pr/10}%"></u></div><p class="m">กดหัวใจให้รูปคนอื่นครบทุก 1,000 ดวง ได้ 1 กล่อง (อีก ${nf(1000-pr)} ดวง)<br>รางวัล: เวลาเพิ่มให้รูปของคุณ · หัวใจโบนัส · หรือลุ้น <b>สิทธิ์ขอเพลงฟรี</b> (หายาก!)</p>${n?'<button class="btn w" id="gbtn" onclick="boxGo()">เปิดกล่อง!</button>':""}<div id="gres"></div></div>`}
async function boxGo(){const g=$("#gift"),b=$("#gbtn");b.disabled=true;g.classList.add("shake");try{const [r]=await Promise.all([api("/box/open",{method:"POST",body:"{}"}),new Promise(s=>setTimeout(s,RM.matches?100:1400))]);
  g.classList.remove("shake");g.classList.add("pop");g.textContent=r.prize.type=="dj"?"🎧":r.prize.type=="time"?"⏱️":"💖";$("#gres").innerHTML=`<div class="prize${r.prize.rare?" rare":""}">${esc(r.prize.label)}</div>`;if(me)me.boxes=r.boxes;
  $(".bxn b").textContent=r.boxes;if(r.boxes>0){b.disabled=false;b.textContent="เปิดอีกกล่อง";b.onclick=()=>{g.className="gift ready";g.textContent="🎁";$("#gres").innerHTML="";boxGo()}}else b.remove();burst()}catch(e){g.classList.remove("shake");toast(e.message);b.disabled=false}}
function burst(){if(RM.matches)return;const w=$("#sheet .boxw");if(!w)return;for(let i=0;i<18;i++){const s=document.createElement("i");s.className="cf";s.textContent=["✨","❤️","⭐","🎉"][i%4];s.style.setProperty("--x",(Math.random()*240-120)+"px");s.style.setProperty("--y",(-60-Math.random()*140)+"px");w.appendChild(s);setTimeout(()=>s.remove(),1200)}}
// admin: artist toggle
const ROSTER=["รำไพ แสงทอง","พร จันทพร","เมย์ จิราพร","ขวัญ พัชรี","จุ๊บแจง เจนจิรา","โชติ ณัฐชัย","นิค สะเลอปี้","วงค์ ชนะกันต์","การ์เนต สะเลอปี้","การ์ฟิวส์ สะเลอปี้"];
const _adminArt=admin;admin=async function(){await _adminArt();const a=$("#adm");if(!a)return;const L=await api("/admin/members").catch(()=>[]);const hint=n=>ROSTER.some(r=>{const f=r.split(" ")[0];return n.includes(f)||n.toLowerCase().includes(f)})&&!/ถิ่น/.test(n);
 const d=document.createElement("div");d.className="card";d.innerHTML=`<h3>⭐ ศิลปินของค่าย</h3><p class="m">ศิลปินที่ติ๊กไว้ เมื่อกดหัวใจ/คอมเมนต์รูปแฟนคลับ รูปจะได้ป้าย “ศิลปินมาเยือน ⭐” และแฟนได้รับแจ้งเตือน<br>รายชื่อ: ${ROSTER.join(", ")}</p><input id="artq" placeholder="ค้นหาสมาชิก" oninput="artList()"><div id="artl"></div>`;a.prepend(d);
 window.ARTM=L.map(m=>({...m,hint:hint(m.name)}));artList()};
function artList(){const q=($("#artq")?.value||"").trim(),L=(window.ARTM||[]).filter(m=>!q||m.name.includes(q)).sort((x,y)=>(y.artist-x.artist)||(y.hint-x.hint)).slice(0,30);
 $("#artl").innerHTML=L.map(m=>`<div class="artr"><span><b>${esc(m.name)}</b> ${m.hint&&!m.artist?'<span class="ttl">แนะนำ</span>':""}<small>#${m.id}</small></span><input type="checkbox" ${m.artist?"checked":""} onchange="artSet(${m.id},this)"></div>`).join("")}
async function artSet(id,el){try{await api("/admin/artist",{method:"POST",body:JSON.stringify({id,on:el.checked})});const m=ARTM.find(x=>x.id==id);m.artist=el.checked?1:0;toast(el.checked?"ตั้งเป็นศิลปินแล้ว ⭐":"ยกเลิกศิลปินแล้ว")}catch(e){toast(e.message);el.checked=!el.checked}}
// DJ: dedication message input
const _djOpen=djOpen;djOpen=async function(){await _djOpen();const q=$("#djq");if(q&&!$("#djmsg"))q.insertAdjacentHTML("beforebegin",`<input id="djmsg" maxlength="60" placeholder="💌 ข้อความอุทิศเพลง (ไม่บังคับ, 60 ตัวอักษร)"><div class="m" style="text-align:right;margin:-6px 0 6px"><span id="djmc">0</span>/60 · จะวิ่งบนจอทุกคนตอนเพลงเล่น</div>`),$("#djmsg").oninput=e=>$("#djmc").textContent=e.target.value.length};
// dedication marquee while the dedicated song is playing
setInterval(()=>{const s=typeof PLS!="undefined"&&PLS.length&&PLS[PLI],m=s&&s.msg;let w=$("#dedi");if(m&&!document.hidden){if(!w){w=document.createElement("div");w.id="dedi";w.innerHTML="<span></span>";document.body.appendChild(w)}const t=`💌 ${m} · 🎵 ${s.title}`;if(w._t!=t){w._t=t;w.firstChild.textContent=t}}else if(w)w.remove()},2000);
// weekly recap card (canvas -> share/save)
function ldImg(src){return new Promise(r=>{if(!src)return r(null);const i=new Image();i.crossOrigin="anonymous";i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src})}
async function recap(){if(!tok)return go("me");sheet('<p class="m">กำลังสร้างการ์ด...</p>');$("#sheet .hd b").textContent="📊 สรุปสัปดาห์ของฉัน";const j=await api("/recap").catch(()=>null);if(!j)return;
 await document.fonts?.load?.('700 64px Prompt').catch(()=>{});const W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d"),F_="Prompt, sans-serif";
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#2a0b5e");g.addColorStop(.55,"#7a1a8c");g.addColorStop(1,"#ff2fb3");x.fillStyle=g;x.fillRect(0,0,W,H);
 const [logo,best]=await Promise.all([ldImg(API+"/icons/logo-splash.png"),ldImg(j.best?thumbUrl(j.best.fid,800):null)]);
 if(logo){const lw=300,lh=lw*logo.height/logo.width;x.drawImage(logo,W/2-lw/2,40,lw,lh)}x.textAlign="center";x.fillStyle="#fff";
 const end=new Date(Date.now()+BKO),st=new Date(end-6*864e5),fd=d=>d.getUTCDate()+"/"+(d.getUTCMonth()+1);x.font=`700 58px ${F_}`;x.fillText("สรุปสัปดาห์ของฉัน",W/2,330);x.font=`400 34px ${F_}`;x.fillText(`${j.name} · ${fd(st)}–${fd(end)}`,W/2,384);
 const box=(bx,by,bw,bh,ic,v,l)=>{x.fillStyle="rgba(255,255,255,.14)";x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,28):x.rect(bx,by,bw,bh);x.fill();x.fillStyle="#fff";x.font=`700 60px ${F_}`;x.fillText(ic+" "+v,bx+bw/2,by+bh/2+8);x.font=`400 30px ${F_}`;x.fillStyle="rgba(255,255,255,.85)";x.fillText(l,bx+bw/2,by+bh/2+52)};
 box(60,430,465,170,"❤️",nf(j.given),"หัวใจที่ให้ไป");box(555,430,465,170,"💖",nf(j.received),"หัวใจที่ได้รับ");
 box(60,630,465,170,"🏅",j.ra?"#"+j.ra:"–",j.amph?"อันดับใน อ."+j.amph:"อันดับในอำเภอ");box(555,630,465,170,"🏆",j.rp?"#"+j.rp:"–",j.prov?"อันดับใน จ."+j.prov:"อันดับในจังหวัด");
 if(best){const s=380,bx=W/2-s/2,by=840;x.save();x.beginPath();x.roundRect?x.roundRect(bx,by,s,s,30):x.rect(bx,by,s,s);x.clip();const r=Math.max(s/best.width,s/best.height);x.drawImage(best,bx+(s-best.width*r)/2,by+(s-best.height*r)/2,best.width*r,best.height*r);x.restore();
  x.font=`700 34px ${F_}`;x.fillStyle="#fff";x.fillText(`โพสต์เด่น · ❤️ ${nf(j.best.hearts)}`,W/2,by+s+48)}else{x.font=`400 36px ${F_}`;x.fillText(`🦸 ฮีโร่ ${j.hero} ครั้ง · 🔥 ติดกัน ${j.streak} วัน`,W/2,1000)}
 x.font=`700 30px ${F_}`;x.fillStyle="#ffd54a";x.fillText("เล่น TopTop ด้วยกัน 👉 teacherkanitsorn-coder.github.io/toptop",W/2,H-40);
 const blob=await new Promise(r=>c.toBlob(r,"image/png")),url=URL.createObjectURL(blob);window.RCB=blob;
 $("#sheet .sbd").innerHTML=`<img src="${url}" class="rcimg" alt="recap"><div class="funb"><button class="btn" onclick="recapShare()">📤 แชร์</button><a class="btn o" href="${url}" download="toptop-recap.png">💾 บันทึกรูป</a></div><p class="m">แชร์ไป Facebook, LINE หรือ Instagram ได้จากปุ่มแชร์</p>`}
async function recapShare(){const f=new File([RCB],"toptop-recap.png",{type:"image/png"}),d={files:[f],title:"สรุปสัปดาห์ TopTop",text:"สรุปสัปดาห์ของฉันบน TopTop ❤️ มาเล่นด้วยกัน!",url:"https://teacherkanitsorn-coder.github.io/toptop/"};
 try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share(d);else if(navigator.share)await navigator.share({title:d.title,text:d.text,url:d.url});else{const a=document.createElement("a");a.href=URL.createObjectURL(RCB);a.download="toptop-recap.png";a.click()}}catch(e){}}
if(tok&&new Date(Date.now()+BKO).getUTCDay()==0){const wk=Math.floor((Date.now()+BKO)/864e5);if(ls.get("tt_recap",0)!=wk){ls.set("tt_recap",wk);setTimeout(()=>toast("📊 สรุปสัปดาห์ของคุณพร้อมแล้ว! ดูได้ที่หน้าโปรไฟล์"),4000)}}
