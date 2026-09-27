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

/* ---------- particles ---------- */
const canvas=document.getElementById('dust'), ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth; canvas.height=innerHeight;}
resize(); addEventListener('resize',resize);
const P = Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.3,
  vy:-(Math.random()*.25+.05), vx:(Math.random()-.5)*.15, a:Math.random()*.5+.2}));
function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#e8cf8a';
  P.forEach(p=>{
    p.y+=p.vy; p.x+=p.vx+Math.sin(p.y*.01)*.1;
    if(p.y<-5){p.y=innerHeight+5; p.x=Math.random()*innerWidth;}
    ctx.globalAlpha=p.a; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill();
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

function showToast(msg){toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1600);}

// The deck flies from the velvet to the first slot of the upper arc; dealing starts from there.
document.getElementById('askBtn').addEventListener('click', ()=>{
  if(busy) return; busy=true;
  fanScreen.hidden=false; gsap.set(spreadOpts,{opacity:0}); // spreadOpts must be laid out to measure the fan
  const L=layoutFan(), a=L.angleStart*Math.PI/180;
  const tx=L.pivotX+L.rOuter*Math.sin(a), ty=L.pivotY-L.rOuter*Math.cos(a);
  const r=deckStack.getBoundingClientRect();
  gsap.to('#askBtn',{opacity:0,duration:.3});
  // squeeze the loose stack into one card of exactly the fan's size so the hand-off is invisible
  const sx=cardW/deckStack.offsetWidth, sy=cardH/deckStack.offsetHeight;
  gsap.to(deckStack.querySelectorAll('img'),{rotation:0, x:0, y:0, borderRadius:`${7/sx}px / ${7/sy}px`,
    duration:.8, ease:'power2.inOut'});
  gsap.to(deckStack,{x:`+=${tx-(r.left+r.width/2)}`, y:`+=${ty-(r.top+r.height/2)}`,
    rotation:L.angleStart, scaleX:sx, scaleY:sy,
    duration:.8, ease:'power2.inOut',
    onComplete:()=>buildFan(()=>{ openingEl.hidden=true; busy=false; })});
});
document.querySelectorAll('.opt').forEach(o=>o.addEventListener('click',()=>{
  if(o.dataset.mode!=='day'){ showToast('Этот расклад скоро добавим ✦'); return; }
  document.querySelectorAll('.opt').forEach(x=>x.classList.remove('active'));
  o.classList.add('active'); mode='day';
}));

/* Cards deal out from the common centre of two concentric arcs (a downward-opening rainbow):
   the outer band first, then the inner band. */
let fanLayout=null;
function layoutFan(){
  const n=DECK.length, nOuter=Math.ceil(n/2)+10, nInner=n-nOuter;

  // Rainbow layout: two concentric arcs opening downward around one centre (pivotX,pivotY);
  // each card's centre sits on its arc. The radial distance between the arcs is one card
  // height plus the required gap of 2/3 card height, so the arcs never touch.
  const ASPECT=76/118, GAP=2/3, MIN_STEP=0.28; // MIN_STEP: neighbour spacing on the inner arc, in card widths
  const topMargin = spreadOpts.getBoundingClientRect().bottom + 12;
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

function buildFan(onReady){
  fan.innerHTML=''; fan.appendChild(dimOverlay); dimOverlay.classList.remove('on');
  meaningPanel.classList.remove('show'); gsap.to(spreadOpts,{opacity:1,duration:.4});
  deckOrder=[...DECK.keys()];
  for(let i=deckOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deckOrder[i],deckOrder[j]]=[deckOrder[j],deckOrder[i]];}
  const {nOuter, angleStart, angleEnd, rOuter, rInner, pivotX, pivotY} = fanLayout || layoutFan();

  const makeCard=(card)=>{
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
    el.addEventListener('click', ()=>{ if(!busy) pickCard(el, card); });
    return el;
  };

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
  const dropper=(indices, radius)=>{
    const n=indices.length; let next=0;
    const slotAngle=i=> n>1 ? angleStart+(angleEnd-angleStart)*i/(n-1) : angleStart;
    return ()=>{
      while(next<n && slotAngle(next)<=pop.a+1e-6){
        const slot=next++, angle=slotAngle(slot);
        const el=makeCard(DECK[indices[slot]]); el.style.zIndex=slot;
        el.dataset.angle=angle; el.dataset.radius=radius; el.dataset.slot=slot;
        el.style.transform=`rotate(${angle}deg) translateY(-${radius}px)`;
        fan.insertBefore(el, mover);
      }
    };
  };
  const outerIdx = deckOrder.slice(0, nOuter);
  const innerIdx = deckOrder.slice(nOuter).slice().reverse();
  const dropOuter=dropper(outerIdx, rOuter), dropInner=dropper(innerIdx, rInner);
  const sweepDur=count=>Math.max(.9, count*0.065);

  // wait until the mover's image is decoded, otherwise it blinks for a frame on appear
  const img=mover.querySelector('img');
  (img.decode ? img.decode().catch(()=>{}) : Promise.resolve()).then(()=>{
    onReady&&onReady();
    const tl=gsap.timeline({onComplete:()=>{
      gsap.to(mover,{opacity:0,duration:.2,onComplete:()=>mover.remove()});
    }});
    tl.to(pop,{a:angleEnd,duration:sweepDur(outerIdx.length),ease:'sine.inOut',
      onStart:dropOuter, onUpdate:()=>{ setMover(); dropOuter(); }, onComplete:dropOuter});
    // the rest of the deck spirals back through the gap between the arcs to the lower arc's start
    tl.to(pop,{a:angleStart,r:rInner,duration:1,ease:'power2.inOut',onUpdate:setMover});
    tl.to(pop,{a:angleEnd,duration:sweepDur(innerIdx.length),ease:'sine.inOut',
      onStart:dropInner, onUpdate:()=>{ setMover(); dropInner(); }, onComplete:dropInner});
  });
}

/* "Card of the day" interaction:
   1st click - the card slides half its length out of the arc towards the arc's centre
   (a previously slid-out card goes back);
   2nd click on the same card - it leaves the arc, grows to fit the viewport minus FIT_MARGIN
   on every side and at the same time flips face up around its own vertical axis. */
const FIT_MARGIN=50;
let extendedCard=null;

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
  el.firstElementChild.style.transform=''; el.style.zIndex=el.dataset.slot;
}

function pickCard(el, card){
  if(el!==extendedCard){
    if(extendedCard){
      const prev=extendedCard;
      animateCard(prev, arcState(prev), {duration:.35, ease:'power2.inOut', onComplete:()=>restoreInArc(prev)});
    }
    // keeps its own z-index, so it slides out between its neighbours instead of over them
    extendedCard=el;
    animateCard(el, arcState(el, cardH/2), {duration:.4, ease:'power2.out'});
    return;
  }
  openCard(el, card);
}

function openCard(el, card){
  busy=true; extendedCard=null; activeCard=el; el.style.zIndex=100;
  document.querySelectorAll('.fcard').forEach(c=>{ if(c!==el) c.classList.add('dim'); });
  dimOverlay.classList.add('on');
  gsap.to(spreadOpts,{opacity:0,duration:.3});
  const reversed = Math.random()<0.5; el.dataset.reversed=reversed;
  el.querySelector('.fart').classList.toggle('reversed', reversed);

  // fill the description first so its real height is known, then fit card + description
  // into the viewport minus FIT_MARGIN; the description sits right under the card
  document.getElementById('mName').textContent=card.name;
  document.getElementById('mOrient').textContent=reversed?'Перевёрнутое положение':'Прямое положение';
  document.getElementById('mText').textContent=reversed?card.rev:card.up;
  const GAP=16, panelH=meaningPanel.offsetHeight;
  const availW=innerWidth-2*FIT_MARGIN, availH=innerHeight-2*FIT_MARGIN-GAP-panelH;
  const h=Math.min(availH, availW*cardH/cardW), w=h*cardW/cardH;
  const top=Math.max(FIT_MARGIN, (innerHeight-(h+GAP+panelH))/2);
  meaningPanel.style.top=(top+h+GAP)+'px'; meaningPanel.style.bottom='auto';
  animateCard(el, {x:innerWidth/2, y:top+h/2, rot:0, w, h, ry:180}, {duration:1.1, ease:'power2.inOut',
    onComplete:()=>{
      meaningPanel.classList.add('show');
      let drip=el.querySelector('.drip');
      if(!drip){ drip=document.createElement('div'); drip.className='drip'; el.querySelector('.face.front').appendChild(drip); }
      drip.classList.add('run');
      busy=false;
    }});
}

document.getElementById('returnBtn').addEventListener('click', ()=>{
  if(!activeCard || busy) return;
  busy=true; const el=activeCard;
  meaningPanel.classList.remove('show');
  const drip=el.querySelector('.drip'); if(drip) drip.classList.remove('run');
  animateCard(el, arcState(el), {duration:.9, ease:'power2.inOut',
    onComplete:()=>{
      restoreInArc(el);
      document.querySelectorAll('.fcard').forEach(c=>c.classList.remove('dim'));
      dimOverlay.classList.remove('on');
      gsap.to(spreadOpts,{opacity:1,duration:.3});
      activeCard=null; busy=false;
    }});
});
