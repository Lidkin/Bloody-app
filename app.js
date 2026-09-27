const IMG_BACK = "assets/card-back.png";
const ART = [null, "assets/the-magician.png"];
/* ---------- deck data ---------- */
const MAJOR = [
["Шут","Начало пути, спонтанность, безрассудная свобода.","Опрометчивость, страх сделать первый шаг."],
["Маг","Воля, мастерство — все ресурсы уже в ваших руках.","Манипуляция, нереализованный потенциал, обман."],
["Верховная Жрица","Интуиция, тайное знание, тишина перед ответом.","Скрытые мотивы, отрыв от внутреннего голоса."],
["Императрица","Изобилие, творчество, забота и плодородие.","Застой, гиперопека, творческий блок."],
["Император","Структура, власть, стабильность через дисциплину.","Тирания, жёсткость, потеря контроля."],
["Иерофант","Традиция, обучение, духовное наставничество.","Догма, бунт против системы, ложный авторитет."],
["Влюблённые","Выбор, союз, гармония ценностей.","Разлад, неверный выбор, дисбаланс."],
["Колесница","Победа через волю, движение вперёд.","Потеря направления, агрессия, застревание."],
["Сила","Внутренняя стойкость, мягкое укрощение страстей.","Слабость воли, самосомнение, скрытая ярость."],
["Отшельник","Уединение, поиск истины внутри себя.","Изоляция, отрицание помощи, одиночество."],
["Колесо Фортуны","Перемены, циклы судьбы, поворотный момент.","Сопротивление переменам, невезение, застой."],
["Справедливость","Причина и следствие, честность, баланс.","Несправедливость, уклонение от ответственности."],
["Повешенный","Пауза, новый взгляд, жертва ради прозрения.","Бессмысленная жертва, застревание, промедление."],
["Смерть","Завершение, трансформация, освобождение старого.","Сопротивление концу, страх перемен."],
["Умеренность","Гармония, терпение, алхимия противоположностей.","Дисбаланс, крайности, нетерпение."],
["Дьявол","Привязанность, искушение, иллюзия несвободы.","Освобождение от зависимости, прозрение."],
["Башня","Внезапный слом, откровение, освобождающий кризис.","Отложенный крах, страх перемен, избегание."],
["Звезда","Надежда, вдохновение, исцеление после бури.","Отчаяние, потеря веры, истощение."],
["Луна","Неопределённость, подсознание, скрытые страхи.","Прояснение иллюзий, выход из тумана."],
["Солнце","Радость, ясность, успех и жизненная сила.","Временное затмение радости, завышенные ожидания."],
["Суд","Пробуждение, возрождение, итог и призвание.","Самокритика, отказ услышать зов, застревание."],
["Мир","Завершение цикла, целостность, достижение цели.","Незавершённость, задержка финала."]
];
const SUITS = {w:["Жезлов","энергию и действие"],c:["Кубков","чувства и отношения"],s:["Мечей","мысли и конфликты"],p:["Пентаклей","материю и стабильность"]};
const RANKS = ["Туз","Двойка","Тройка","Четвёрка","Пятёрка","Шестёрка","Семёрка","Восьмёрка","Девятка","Десятка","Паж","Рыцарь","Королева","Король"];
const RMEAN = ["новое начало и потенциал","выбор и баланс сил","рост через сотрудничество","передышка и переоценка","испытание и трение",
  "движение к гармонии","переоценка стратегии","сосредоточенное усилие","почти достигнутая цель","итог цикла, полнота",
  "любопытство и весть","решительное движение","зрелое владение темой","полная реализация и власть"];

let DECK = [];
let id=0;
const ROMAN=["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
MAJOR.forEach((m,i)=>DECK.push({id:id++, name:m[0], up:m[1], rev:m[2], art:ART[i]?i:null, major:true, num:ROMAN[i]}));
Object.entries(SUITS).forEach(([k,[label,theme]])=>{
  RANKS.forEach((r,i)=>{
    DECK.push({id:id++, name:r+" "+label, up:RMEAN[i]+" — через призму "+theme+".",
      rev:"блок, задержка или искажение в теме «"+theme+"».", art:null, major:false});
  });
});

/* ---------- theme ---------- */
// 'noir' - the deck's red / black / white; 'gold' - the original gold esoteric look
const THEMES={noir:'Нуар', gold:'Золото'};
let theme=localStorage.getItem('theme') in THEMES ? localStorage.getItem('theme') : 'noir';
const themeToggle=document.getElementById('themeToggle');
function applyTheme(){
  document.body.classList.toggle('noir', theme==='noir');
  themeToggle.textContent='Тема: '+THEMES[theme];
}
themeToggle.addEventListener('click', ()=>{
  theme = theme==='noir' ? 'gold' : 'noir';
  localStorage.setItem('theme', theme); applyTheme();
});
applyTheme();
document.fonts.ready.then(()=>document.body.classList.add('fonts-ready'));

/* ---------- particles ---------- */
const canvas=document.getElementById('dust'), ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth; canvas.height=innerHeight;}
resize(); addEventListener('resize',resize);
const P = Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.3,
  vy:-(Math.random()*.25+.05), vx:(Math.random()-.5)*.15, a:Math.random()*.5+.2,
  mix:Math.random(), flash:0}));
// noir dust: each speck sits somewhere between grey and burgundy and now and then flares bright red
const ASH=[150,138,142], BURGUNDY=[150,38,54], FLARE=[255,34,34], FLASH_FRAMES=70;
const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const noir=theme==='noir';
  P.forEach(p=>{
    p.y+=p.vy; p.x+=p.vx+Math.sin(p.y*.01)*.1;
    if(p.y<-5){p.y=innerHeight+5; p.x=Math.random()*innerWidth;}
    let r=p.r;
    if(!noir){ ctx.fillStyle='#e8cf8a'; ctx.globalAlpha=p.a; ctx.shadowBlur=0; }
    else{
      if(!p.flash && Math.random()<.0003) p.flash=FLASH_FRAMES;
      const f = p.flash ? Math.sin(Math.PI*p.flash/FLASH_FRAMES) : 0; // 0 -> 1 -> 0
      if(p.flash) p.flash--;
      ctx.fillStyle=`rgb(${lerp(lerp(ASH,BURGUNDY,p.mix),FLARE,f)})`;
      ctx.globalAlpha=p.a*.8+(1-p.a*.8)*f;
      ctx.shadowColor='#ff2222'; ctx.shadowBlur=6*f;
      r=p.r*(1+.5*f);
    }
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill();
  });
  requestAnimationFrame(tick);
}
tick();

/* ---------- flow control (GSAP-driven) ---------- */
const openingEl=document.getElementById('opening'), fanScreen=document.getElementById('fanScreen'),
  fan=document.getElementById('fan'), toast=document.getElementById('toast'),
  deckStack=document.getElementById('deckStack'), dimOverlay=document.getElementById('dimOverlay'),
  meaningPanel=document.getElementById('meaningPanel'), spreadOpts=document.getElementById('spreadOpts');
let mode='day', deckOrder=[], activeCard=null, busy=false, cardW=76, cardH=118;
const SHOW_SPREAD_OPTS=false; // spread choice (day / three cards / Celtic cross) is hidden for now
if(!SHOW_SPREAD_OPTS) spreadOpts.style.display='none';

function showToast(msg){toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1600);}

// The ask button starts the shuffle and then turns into "Довольно": the deck keeps shuffling until
// the user stops it, like in a real reading.
const askBtn=document.getElementById('askBtn');
const ASK_HTML=askBtn.innerHTML, STOP_HTML='<span class="orn">✦</span> Довольно <span class="orn">✦</span>';
let shufflePhase='idle'; // idle -> shuffling -> stopping
function hideAskBtn(then){
  // the pulse keyframes would override the inline opacity, so freeze the pulse where it is and fade from there
  gsap.set(askBtn,{opacity:getComputedStyle(askBtn).opacity}); askBtn.style.animation='none';
  gsap.to(askBtn,{opacity:0, duration:.3, onComplete:()=>{ askBtn.style.visibility='hidden'; then&&then(); }});
}
function showAskBtn(html){
  askBtn.innerHTML=html; askBtn.style.visibility='';
  // fade in to the pulse's starting opacity, then hand over to the pulse
  gsap.fromTo(askBtn,{opacity:0},{opacity:.45, duration:.4,
    onComplete:()=>{ gsap.set(askBtn,{clearProps:'opacity'}); askBtn.style.animation=''; }});
}
askBtn.addEventListener('click', ()=>{
  if(shufflePhase==='idle'){
    if(busy) return; busy=true; shufflePhase='shuffling';
    hideAskBtn(()=>gsap.delayedCall(.5, ()=>{ if(shufflePhase==='shuffling') showAskBtn(STOP_HTML); }));
    shuffleDeck(flyToFan);
  } else if(shufflePhase==='shuffling' && askBtn.style.visibility!=='hidden'){
    shufflePhase='stopping'; hideAskBtn();
  }
});

// The deck grows and shuffles (the bottom card slides out to alternating sides and goes back on top)
// until shufflePhase leaves 'shuffling'; then it is cut and settles back to its original size and pose.
const DECK_REST=[{rotation:-4, x:-3, y:1}, {rotation:2, x:2, y:-1}, {rotation:0, x:0, y:0}]; // by DOM order, as in style.css
function shuffleDeck(onDone){
  const imgs=[...deckStack.querySelectorAll('img')], HALF=.2, STEP=.24, GROW=.4;
  const w=deckStack.offsetWidth, h=deckStack.offsetHeight, out=w*.7;
  // the cut needs about 2.3 deck heights of room vertically; shrink the zoom on low screens
  // CLEAR: lift (in deck heights) at which even the corners of the turning part stay above the rest
  // (and on narrow screens the cards sliding out sideways, 0.7 deck widths each way, must stay in view)
  const CLEAR=.5+Math.hypot(w,h)/2/h+.03, HIGHER=CLEAR+.22, span=HIGHER+1;
  const zoom=Math.min(1.4, innerHeight*.85/(span*h), innerWidth*.92/(w*2.4));
  const dip=(span-1)/2*h*zoom;
  let dir=1;

  gsap.to(deckStack,{scale:zoom, duration:GROW, ease:'sine.inOut'});
  gsap.to(imgs,{rotation:0, x:0, y:0, duration:GROW, ease:'sine.inOut'});
  gsap.delayedCall(GROW, pass);

  // STEP > HALF, so the previous card is already on top when the next pass takes the bottom one
  function pass(){
    if(shufflePhase!=='shuffling'){ gsap.delayedCall(2*HALF-STEP, cut); return; } // let the last card land
    const card=deckStack.firstElementChild; dir=-dir;
    gsap.timeline()
      .to(card,{x:dir*out, y:-6, rotation:dir*9, duration:HALF, ease:'sine.out'})
      .call(()=>deckStack.appendChild(card))
      .to(card,{x:0, y:0, rotation:0, duration:HALF, ease:'sine.in'});
    gsap.delayedCall(STEP, pass);
  }

  // cut: the top of the deck slides straight up until it clears the rest, turns upside down, rises a bit
  // more and slides down under the rest; meanwhile the whole deck dips so the cut stays on screen.
  // 1.4 s in all; the stages overlap a little so the motion never stops dead
  function cut(){
    const top=deckStack.lastElementChild;
    // portrait phones get no fan: the card of the day is drawn straight from the deck
    const tl=gsap.timeline({onComplete:()=> isPortraitMobile() ? drawFromDeck(dip) : settleDeck(dip, onDone)});
    tl.to(deckStack,{y:`+=${dip}`, duration:.56, ease:'sine.inOut'}, 0)
      .to(top,{y:-h*CLEAR, duration:.48, ease:'sine.inOut'}, 0)
      .to(top,{rotation:180, duration:.48, ease:'sine.inOut'}, .42) // starts as it clears the rest
      .to(top,{y:-h*HIGHER, duration:.28, ease:'sine.inOut'}, .7)
      .call(()=>deckStack.prepend(top), null, .98)
      .to(top,{y:0, duration:.42, ease:'sine.in'}, .98)
      .set(top,{rotation:0}, 1.4); // hidden under the deck by now; 0 and 180 look the same from outside
  }

}

// the deck shrinks back from the shuffle zoom, rises by the dip and its cards fall back into their loose pose
function settleDeck(dip, onDone){
  const tl=gsap.timeline({onComplete:()=>{ shufflePhase='idle'; onDone(); }});
  tl.to(deckStack,{scale:1, y:`-=${dip}`, duration:.4, ease:'sine.inOut'}, 0);
  [...deckStack.children].forEach((img,i)=>tl.to(img,{...DECK_REST[i], duration:.4, ease:'sine.inOut'}, 0));
}

const isPortraitMobile=()=>matchMedia('(orientation: portrait)').matches &&
  (matchMedia('(pointer: coarse)').matches || innerWidth<600);

// Portrait phones: the deck stays where it is, still enlarged; its top card slowly slides up, then
// grows and flips face up around its vertical axis into the same pose as a card drawn from the fan.
// A real card element takes the place of the top image of the deck for this.
function drawFromDeck(dip){
  fanScreen.hidden=false; gsap.set(spreadOpts,{opacity:0});
  fan.innerHTML=''; fan.appendChild(dimOverlay); dimOverlay.classList.remove('on');
  const topImg=deckStack.lastElementChild, r=topImg.getBoundingClientRect();
  const card=DECK[Math.floor(Math.random()*DECK.length)];
  const el=makeCard(card, 0, 0); el.style.zIndex=1000;
  el._fromDeck={topImg, dip, rest:{x:r.left+r.width/2, y:r.top+r.height/2, rot:0, w:r.width, h:r.height, ry:0}};
  const s=el._state={...el._fromDeck.rest};
  const render=()=>renderCard(el,s);
  render(); fan.appendChild(el); topImg.style.visibility='hidden';
  busy=true; activeCard=el;
  const pose=openedPose(el, card);
  gsap.timeline()
    .to(s,{y:s.y-s.h*.45, duration:.9, ease:'sine.in', onUpdate:render})
    // the deck ends up under the description, so it fades back to keep the text readable
    .call(()=>{ dimOverlay.classList.add('on'); gsap.to(deckStack,{opacity:.3, duration:.8}); })
    .to(s,{...pose, duration:1.3, ease:'power2.out', onUpdate:render,
      onComplete:()=>{ meaningPanel.classList.add('show'); busy=false; }});
}
// the reverse; the deck then settles and the ask button comes back for the next reading
function returnToDeck(el){
  const {topImg, dip, rest}=el._fromDeck, s=el._state, render=()=>renderCard(el,s);
  dimOverlay.classList.remove('on'); gsap.to(deckStack,{opacity:1, duration:.8});
  gsap.timeline()
    .to(s,{...rest, y:rest.y-rest.h*.45, duration:1.1, ease:'power2.inOut', onUpdate:render})
    .to(s,{y:rest.y, duration:.5, ease:'sine.out', onUpdate:render})
    .call(()=>{
      topImg.style.visibility=''; el.remove(); fanScreen.hidden=true; activeCard=null;
      settleDeck(dip, ()=>{ showAskBtn(ASK_HTML); busy=false; });
    });
}

// The deck flies from the velvet to the first slot of the upper arc; dealing starts from there.
function flyToFan(){
  fanScreen.hidden=false; gsap.set(spreadOpts,{opacity:0}); // spreadOpts must be laid out to measure the fan
  const L=layoutFan(), a=L.angleStart*Math.PI/180;
  const tx=L.pivotX+L.rOuter*Math.sin(a), ty=L.pivotY-L.rOuter*Math.cos(a);
  const r=deckStack.getBoundingClientRect();
  // squeeze the loose stack into one card of exactly the fan's size so the hand-off is invisible
  const sx=cardW/deckStack.offsetWidth, sy=cardH/deckStack.offsetHeight;
  gsap.to(deckStack.querySelectorAll('img'),{rotation:0, x:0, y:0, borderRadius:`${7/sx}px / ${7/sy}px`,
    duration:.8, ease:'power2.inOut'});
  gsap.to(deckStack,{x:`+=${tx-(r.left+r.width/2)}`, y:`+=${ty-(r.top+r.height/2)}`,
    rotation:L.angleStart, scaleX:sx, scaleY:sy,
    duration:.8, ease:'power2.inOut',
    onComplete:()=>buildFan(()=>{ openingEl.hidden=true; busy=false; })});
}
document.querySelectorAll('.opt').forEach(o=>o.addEventListener('click',()=>{
  if(o.dataset.mode!=='day'){ showToast('Этот расклад скоро добавим ✦'); return; }
  document.querySelectorAll('.opt').forEach(x=>x.classList.remove('active'));
  o.classList.add('active'); mode='day';
}));

/* Cards deal out from the common centre of two concentric arcs (a downward-opening rainbow):
   the outer band first, then the inner band. */
let fanLayout=null, dealTl=null;
function layoutFan(){
  const n=DECK.length, nOuter=Math.ceil(n/2)+10, nInner=n-nOuter;

  // Rainbow layout: two concentric arcs opening downward around one centre (pivotX,pivotY);
  // each card's centre sits on its arc. The radial distance between the arcs is one card
  // height plus the required gap of 2/3 card height, so the arcs never touch.
  const ASPECT=76/118, GAP=2/3, MIN_STEP=0.28; // MIN_STEP: neighbour spacing on the inner arc, in card widths
  const topMargin = (SHOW_SPREAD_OPTS ? spreadOpts : document.querySelector('h1.title')).getBoundingClientRect().bottom + 40;
  const bottomMargin = 24 + (parseFloat(getComputedStyle(document.documentElement).paddingBottom)||0);
  const sideMargin = 16;
  const availW=innerWidth-sideMargin*2, availH=innerHeight-topMargin-bottomMargin;
  const rad=d=>d*Math.PI/180;

  // Bounding box of both arcs for card height = 1, relative to the centre.
  const layoutFor=A=>{
    const rIn=MIN_STEP*ASPECT*(nInner-1)/rad(2*A), rOut=rIn+1+GAP;
    let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
    [[rIn,nInner],[rOut,nOuter]].forEach(([r,count])=>{
      for(let i=0;i<count;i++){
        const a=rad(-A+2*A*i/(count-1)), s=Math.sin(a), c=Math.cos(a);
        const x=r*s, y=-r*c;
        const ex=Math.abs(ASPECT/2*c)+Math.abs(.5*s), ey=Math.abs(ASPECT/2*s)+Math.abs(.5*c);
        minX=Math.min(minX,x-ex); maxX=Math.max(maxX,x+ex);
        minY=Math.min(minY,y-ey); maxY=Math.max(maxY,y+ey);
      }
    });
    return {A, rIn, rOut, minX, maxX, minY, maxY};
  };
  let best=null;
  for(let A=55;A<=85;A+=5){
    const L=layoutFor(A);
    L.ch=Math.min(availW/(L.maxX-L.minX), availH/(L.maxY-L.minY));
    if(!best || L.ch>best.ch) best=L;
  }
  cardH=Math.max(50, Math.min(best.ch, 200)); cardW=cardH*ASPECT;
  document.documentElement.style.setProperty('--cw', cardW+'px');
  document.documentElement.style.setProperty('--ch', cardH+'px');

  const angleStart=-best.A, angleEnd=best.A;
  const rOuter=best.rOut*cardH, rInner=best.rIn*cardH;
  const pivotX=sideMargin+(availW-(best.maxX-best.minX)*cardH)/2-best.minX*cardH;
  const pivotY=topMargin-best.minY*cardH;
  return fanLayout={nOuter, angleStart, angleEnd, rOuter, rInner, pivotX, pivotY};
}

// A card element (back + face) placed at (pivotX, pivotY); in the fan that is the arcs' centre.
function makeCard(card, pivotX, pivotY){
  const el=document.createElement('div'); el.className='fcard';
  el.style.left=pivotX+'px'; el.style.top=pivotY+'px';
  el.dataset.pivotX=pivotX; el.dataset.pivotY=pivotY;
  const inner=document.createElement('div'); inner.className='fcard-inner';
  inner.innerHTML=`<div class="face back"><img src="${IMG_BACK}"></div><div class="face front"></div>`;
  const front=inner.querySelector('.face.front');
  if(card.art!==null){
    front.innerHTML='<img class="fart">';
    front.querySelector('.fart').src=ART[card.art];
  } else {
    front.innerHTML='<div class="tface fart"><div class="tframe"></div><div class="fnum"></div><div class="ftext"></div></div>';
    front.querySelector('.fnum').textContent=card.num||'';
    front.querySelector('.ftext').textContent=card.name;
  }
  el.appendChild(inner);
  el._card=card;
  return el;
}

function buildFan(onReady){
  hoverCard=null; fan.innerHTML=''; fan.appendChild(dimOverlay); dimOverlay.classList.remove('on');
  meaningPanel.classList.remove('show'); gsap.to(spreadOpts,{opacity:1,duration:.4});
  deckOrder=[...DECK.keys()];
  for(let i=deckOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deckOrder[i],deckOrder[j]]=[deckOrder[j],deckOrder[i]];}
  const {nOuter, angleStart, angleEnd, rOuter, rInner, pivotX, pivotY} = fanLayout || layoutFan();

  // A single "mover" (the deck itself) glides along the upper arc, then on to the lower one;
  // every card it passes is left behind exactly where the mover was at that instant.
  const mover=document.createElement('div'); mover.className='fcard mover';
  mover.style.left=pivotX+'px'; mover.style.top=pivotY+'px'; mover.style.zIndex=999;
  mover.innerHTML=`<div class="fcard-inner"><div class="face back"><img src="${IMG_BACK}"></div></div>`;
  fan.appendChild(mover);
  // the deck landed on the first slot of the upper arc
  const pop={a:angleStart,r:rOuter};
  const setMover=()=>{ mover.style.transform=`rotate(${pop.a}deg) translateY(-${pop.r}px)`; };
  setMover();

  // cards are dropped when the mover actually passes their slot, so an eased sweep stays in sync
  // the whole upper arc stacks above the lower one, so a card leaving the upper arc passes over it
  const dropper=(indices, radius, zBase)=>{
    const n=indices.length; let next=0;
    const slotAngle=i=> n>1 ? angleStart+(angleEnd-angleStart)*i/(n-1) : angleStart;
    return ()=>{
      while(next<n && slotAngle(next)<=pop.a+1e-6){
        const slot=next++, angle=slotAngle(slot);
        const el=makeCard(DECK[indices[slot]], pivotX, pivotY);
        el.dataset.z=zBase+slot; el.style.zIndex=el.dataset.z;
        el.dataset.angle=angle; el.dataset.radius=radius;
        el.style.transform=`rotate(${angle}deg) translateY(-${radius}px)`;
        fan.insertBefore(el, mover);
      }
    };
  };
  const outerIdx = deckOrder.slice(0, nOuter);
  const innerIdx = deckOrder.slice(nOuter).slice().reverse();
  const dropOuter=dropper(outerIdx, rOuter, 100), dropInner=dropper(innerIdx, rInner, 0);
  const sweepDur=count=>Math.max(.7, count*0.045);

  // wait until the mover's image is decoded, otherwise it blinks for a frame on appear
  const img=mover.querySelector('img');
  (img.decode ? img.decode().catch(()=>{}) : Promise.resolve()).then(()=>{
    onReady&&onReady();
    const tl=dealTl=gsap.timeline({onComplete:()=>{
      dealTl=null;
      gsap.to(mover,{opacity:0,duration:.2,onComplete:()=>mover.remove()});
    }});
    tl.to(pop,{a:angleEnd,duration:sweepDur(outerIdx.length),ease:'sine.inOut',
      onStart:dropOuter, onUpdate:()=>{ setMover(); dropOuter(); }, onComplete:dropOuter});
    // the rest of the deck spirals back through the gap between the arcs to the lower arc's start
    tl.to(pop,{a:angleStart,r:rInner,duration:.8,ease:'power2.inOut',onUpdate:setMover});
    tl.to(pop,{a:angleEnd,duration:sweepDur(innerIdx.length),ease:'sine.inOut',
      onStart:dropInner, onUpdate:()=>{ setMover(); dropInner(); }, onComplete:dropInner});
  });
}

/* "Card of the day" interaction:
   hover - the card under the cursor slides half its length out of the arc towards the arc's
   centre, staying between its neighbours; it slides back when the cursor moves on;
   click - the card slides fully out of the arc and, right as it clears the arc, grows to fit
   the viewport minus FIT_MARGIN and flips face up around its own vertical axis. */
const FIT_MARGIN=50;
let hoverCard=null;

// While a card is animated its geometry lives in el._state = {x,y (centre), rot, w, h, ry}.
function arcState(el, lift=0){
  const a=+el.dataset.angle, r=+el.dataset.radius-lift, rad=a*Math.PI/180;
  return {x:+el.dataset.pivotX+r*Math.sin(rad), y:+el.dataset.pivotY-r*Math.cos(rad),
    rot:a, w:cardW, h:cardH, ry:0};
}
function renderCard(el, s){
  el.style.left=s.x+'px'; el.style.top=s.y+'px';
  el.style.setProperty('--cw', s.w+'px'); el.style.setProperty('--ch', s.h+'px');
  el.style.transform=`rotate(${s.rot}deg)`;
  el.firstElementChild.style.transform=`perspective(${s.h*4}px) rotateY(${s.ry}deg)`;
}
function animateCard(el, to, vars){
  const s=el._state || (el._state=arcState(el));
  return gsap.to(s,{...to, ...vars, overwrite:true, onUpdate:()=>renderCard(el,s)});
}
function restoreInArc(el){
  delete el._state;
  el.style.left=el.dataset.pivotX+'px'; el.style.top=el.dataset.pivotY+'px';
  el.style.removeProperty('--cw'); el.style.removeProperty('--ch');
  el.style.transform=`rotate(${el.dataset.angle}deg) translateY(-${el.dataset.radius}px)`;
  el.firstElementChild.style.transform=''; el.style.zIndex=el.dataset.z;
}

// Hit-testing uses the cards' fixed slots in the arcs, not their animated positions: otherwise a
// card sliding out from under the cursor would hand the hover to its neighbour and the two would
// flicker back and forth. Only the part of the slid-out card that sticks out of the arc (where no
// slot is) keeps the hover, so it can be reached and clicked.
function inCard(s, x, y){
  const t=s.rot*Math.PI/180, dx=x-s.x, dy=y-s.y;
  const lx=dx*Math.cos(t)+dy*Math.sin(t), ly=-dx*Math.sin(t)+dy*Math.cos(t);
  return Math.abs(lx)<=s.w/2 && Math.abs(ly)<=s.h/2;
}
function cardAt(x, y){
  let best=null;
  fan.querySelectorAll('.fcard:not(.mover)').forEach(el=>{
    if((!best || +el.dataset.z>+best.dataset.z) && inCard(arcState(el), x, y)) best=el;
  });
  if(!best && hoverCard && inCard(hoverCard._state||arcState(hoverCard), x, y)) return hoverCard;
  return best;
}
function setHover(el){
  if(el===hoverCard) return;
  if(hoverCard){
    const prev=hoverCard;
    animateCard(prev, arcState(prev), {duration:.3, ease:'power2.inOut', onComplete:()=>restoreInArc(prev)});
  }
  hoverCard=el;
  fan.style.cursor = el ? 'pointer' : '';
  if(el) animateCard(el, arcState(el, cardH/2), {duration:.3, ease:'power2.out'});
}
const fanIdle=()=>!busy && !activeCard;
fan.addEventListener('pointermove', e=>{ if(fanIdle() && e.pointerType==='mouse') setHover(cardAt(e.clientX, e.clientY)); });
fan.addEventListener('pointerleave', ()=>{ if(fanIdle()) setHover(null); });
const SKIP_TIME=.4;
fan.addEventListener('click', e=>{
  // a tap while the cards are being dealt fast-forwards the dealing instead of picking a card
  if(dealTl){ dealTl.timeScale(Math.max(1, (dealTl.duration()-dealTl.time())/SKIP_TIME)); return; }
  if(!fanIdle()) return;
  const el=cardAt(e.clientX, e.clientY);
  if(el) openCard(el, el._card);
});

// Draws a random orientation for the card, fills the description and places it; returns the pose
// of the opened card (face up): card + description fit the viewport minus FIT_MARGIN, the
// description right under the card.
function openedPose(el, card){
  const reversed = Math.random()<0.5; el.dataset.reversed=reversed;
  el.querySelector('.fart').classList.toggle('reversed', reversed);
  // fill the description first so its real height is known
  document.getElementById('mName').textContent=card.name;
  document.getElementById('mOrient').textContent=reversed?'Перевёрнутое положение':'Прямое положение';
  document.getElementById('mText').textContent=reversed?card.rev:card.up;
  const GAP=16, panelH=meaningPanel.offsetHeight, ASPECT=76/118;
  const availW=innerWidth-2*FIT_MARGIN, availH=innerHeight-2*FIT_MARGIN-GAP-panelH;
  const h=Math.min(availH, availW/ASPECT), w=h*ASPECT;
  const top=Math.max(FIT_MARGIN, (innerHeight-(h+GAP+panelH))/2);
  meaningPanel.style.top=(top+h+GAP)+'px'; meaningPanel.style.bottom='auto';
  return {x:innerWidth/2, y:top+h/2, rot:0, w, h, ry:180};
}

function openCard(el, card){
  busy=true; activeCard=el; hoverCard=null; fan.style.cursor='';
  const pose=openedPose(el, card);

  // slide fully out of the arc, then - without stopping - grow, straighten and flip
  const s=el._state || (el._state=arcState(el));
  const render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  gsap.timeline()
    .to(s,{...arcState(el, cardH), duration:.35, ease:'power1.in', onUpdate:render})
    .call(()=>{
      // clear of its own arc now, so rising above everything shows no jump
      el.style.zIndex=1000;
      document.querySelectorAll('.fcard').forEach(c=>{ if(c!==el) c.classList.add('dim'); });
      dimOverlay.classList.add('on');
      gsap.to(spreadOpts,{opacity:0,duration:.3});
    })
    .to(s,{...pose, duration:1, ease:'power2.out', onUpdate:render,
      onComplete:()=>{
        meaningPanel.classList.add('show');
        busy=false;
      }});
}

document.getElementById('returnBtn').addEventListener('click', ()=>{
  if(!activeCard || busy) return;
  busy=true; const el=activeCard;
  meaningPanel.classList.remove('show');
  if(el._fromDeck){ returnToDeck(el); return; }
  // the exact reverse: shrink and flip back to just outside the arc, then slide into the slot
  const s=el._state, render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  gsap.timeline()
    .to(s,{...arcState(el, cardH), duration:.9, ease:'power2.inOut', onUpdate:render})
    .call(()=>{
      el.style.zIndex=el.dataset.z;
      document.querySelectorAll('.fcard').forEach(c=>c.classList.remove('dim'));
      dimOverlay.classList.remove('on');
      gsap.to(spreadOpts,{opacity:1,duration:.3});
    })
    .to(s,{...arcState(el), duration:.35, ease:'power2.out', onUpdate:render,
      onComplete:()=>{ restoreInArc(el); activeCard=null; busy=false; }});
});
