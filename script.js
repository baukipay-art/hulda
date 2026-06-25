/* ── PAGE NAVIGATION (Handles Mobile Scroll & Desktop SPA) ── */
const ALL=['home','about','philo','edu','port','resume','contact'];
let cur='';

function go(id){
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Mobile: Scroll down to section smoothly
    const target = document.getElementById('pg-' + id);
    if(target) {
      // Adjust offset for fixed nav, taking home to absolute top
      const offset = id === 'home' ? 0 : target.offsetTop - 50; 
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  } else {
    // Desktop: Standard SPA hide/show
    ALL.forEach(p => { const e = document.getElementById('pg-' + p); if(e) e.classList.remove('show'); });
    const t = document.getElementById('pg-' + id);
    if(t) { t.classList.add('show'); cur = id; }
    window.scrollTo(0, 0);
    document.getElementById('footer').classList.toggle('show', id !== 'home');
  }

  // Update nav buttons
  document.querySelectorAll('.n-links button[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === id));
  document.querySelectorAll('#mob button[data-mob]').forEach(b => b.classList.toggle('on', b.dataset.mob === id));
  
  setTimeout(runReveals, 60);
  closeSrch();
  closemob();
}

/* ── REVEAL ANIMATIONS ── */
function runReveals(){
  // Select all pages on mobile, or just the showing page on desktop
  const targets = window.innerWidth <= 768 ? document.querySelectorAll('.pg') : document.querySelectorAll('.pg.show');
  
  targets.forEach(pg => {
    pg.querySelectorAll('.rv').forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight + 60) el.classList.add('in');
    });
  });
}
window.addEventListener('scroll', runReveals, {passive: true});

/* ── DEEP SEARCH ── */
function openSrch(){
  document.getElementById('srch-overlay').classList.add('open');
  setTimeout(() => document.getElementById('srch-input').focus(), 100);
}
function closeSrch(){
  document.getElementById('srch-overlay').classList.remove('open');
  document.getElementById('srch-input').value = '';
  document.getElementById('srch-results').innerHTML = '';
}

function doSearch(q){
  const box = document.getElementById('srch-results');
  q = q.trim().toLowerCase();
  if(!q){ box.innerHTML = ''; return; }
  
  const results = [];
  
  // Scan through all elements marked with class "search-target"
  document.querySelectorAll('.search-target').forEach(container => {
    const text = container.innerText.toLowerCase();
    if(text.includes(q)) {
      // Find which page this block belongs to
      const parentPage = container.closest('.pg');
      if (parentPage) {
        const pageId = parentPage.id.replace('pg-', '');
        const pageTitle = parentPage.querySelector('.stitle') ? parentPage.querySelector('.stitle').innerText.replace(/\n/g, ' ') : (pageId === 'home' ? 'Home' : pageId);
        
        // Prevent duplicates
        if(!results.some(r => r.id === pageId)) {
          results.push({ id: pageId, title: pageTitle });
        }
      }
    }
  });
  
  if(!results.length){
    box.innerHTML = '<div class="srch-result"><div class="sr-txt" style="color:rgba(247,243,236,.4)">No matching words found. Try another term.</div></div>';
    return;
  }
  
  box.innerHTML = results.map(r => `
    <div class="srch-result" onclick="go('${r.id}')">
      <div class="sr-page">${r.id.toUpperCase()} SECTION</div>
      <div class="sr-txt">Match found in: ${r.title} →</div>
    </div>
  `).join('');
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeSrch(); if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); openSrch(); } });

/* ── PRELOADER & SETUP ── */
window.addEventListener('DOMContentLoaded', () => {
  go('home');
  setTimeout(() => { document.getElementById('preloader').classList.add('gone'); runReveals(); }, 2350);

  // Anti-Theft Script for Certificates
  document.querySelectorAll('.cert-prev').forEach(el => {
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('selectstart', e => e.preventDefault());
  });
});

/* ── PROGRESS BAR & SCROLL STATES ── */
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('prog').style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
  document.getElementById('nav').classList.toggle('shr', window.scrollY > 50);
  document.getElementById('btt').classList.toggle('show', window.scrollY > 400);
}, {passive: true});

/* ── HAMBURGER ── */
const hbg = document.getElementById('hbg'), mob = document.getElementById('mob');
hbg.addEventListener('click', () => { hbg.classList.toggle('open'); mob.classList.toggle('open'); });
function closemob() { hbg.classList.remove('open'); mob.classList.remove('open'); }

/* ── PHILOSOPHY TOGGLE ── */
function togglePhilosophy() {
  const v1 = document.getElementById('philo-view-1');
  const v2 = document.getElementById('philo-view-2');
  
  if (v1.style.display !== 'none') {
    v1.style.display = 'none';
    v2.style.display = 'block';
    document.getElementById('philo-main-title').style.display = 'none';
  } else {
    v1.style.display = 'block';
    v2.style.display = 'none';
    document.getElementById('philo-main-title').style.display = 'block';
  }
  
  // Re-trigger animations in the new view
  setTimeout(runReveals, 50);
  // Scroll to top of section for better UX
  const target = document.getElementById('pg-philo');
  if(target && window.innerWidth > 768) { window.scrollTo({ top: target.offsetTop - 50, behavior: 'smooth' }); }
}

/* ── CANVAS BACKGROUND ANIMATION ── */
(function(){
  const cv=document.getElementById('hCanvas'),ctx=cv.getContext('2d');
  let W,H,nodes=[],raf;
  function resize(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight}
  function init(){nodes=[];const n=Math.floor(W*H/11000);for(let i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.8+.4,c:Math.random()>.55?'g':'t'})}
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,255,255,.018)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=65){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=65){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){const a=(1-d/120)*.18;ctx.beginPath();ctx.strokeStyle=nodes[i].c==='g'?`rgba(212,152,42,${a})`:`rgba(193,122,90,${a})`;ctx.lineWidth=.7;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke()}
    }
    nodes.forEach(n=>{ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=n.c==='g'?'rgba(212,152,42,.55)':'rgba(193,122,90,.5)';ctx.fill();n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1});
    raf=requestAnimationFrame(draw);
  }
  function start(){cancelAnimationFrame(raf);resize();init();draw()}
  window.addEventListener('resize',start);
  setTimeout(start,200);
})();

/* ── EMBED TOGGLE ── */
function toggleEmb(panelId, btnId) {
  const panel = document.getElementById(panelId);
  const btn = document.getElementById(btnId);
  const card = panel.closest('.pj-card'); // Find the parent card for expansion logic
  
  panel.classList.toggle('open');
  
  if (panel.classList.contains('open')) {
    card.classList.add('expanded'); // Make the card span the entire grid row smoothly
    if(btnId === 'grBtn') btn.textContent = '✦ Close Report ▴';
    else btn.textContent = '✦ Close Project ▴';
  } else {
    card.classList.remove('expanded'); // Revert back to regular grid card size
    if(btnId === 'grBtn') btn.textContent = '✦ View Impact Report ▾';
    else btn.textContent = '✦ View Project ▾';
  }
}

/* ── CONTACT FORM ── */
function sendForm(){
  const n=document.getElementById('fn').value.trim();
  const e=document.getElementById('fe').value.trim();
  const m=document.getElementById('fm').value.trim();
  if(!n||!e||!m){alert('Please fill in your name, email, and message.');return}
  window.location.href=`mailto:huldawaswa@gmail.com?subject=${encodeURIComponent('Enquiry from '+n)}&body=${encodeURIComponent('Name: '+n+'\nEmail: '+e+'\n\n'+m)}`;
  document.getElementById('fok').style.display='block';
}