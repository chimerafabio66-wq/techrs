const progress = document.querySelector('.scroll-progress');
const nav = document.querySelector('.navbar');
const glow = document.querySelector('.cursor-glow');
const reveals = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  nav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

if(glow && !reduceMotion){
  window.addEventListener('mousemove',(event)=>{
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  },{passive:true});
}

if(!reduceMotion){
  document.querySelectorAll('.magnetic').forEach(button=>{
    button.addEventListener('mousemove',(event)=>{
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x*.08}px,${y*.08}px)`;
    });
    button.addEventListener('mouseleave',()=>button.style.transform='');
  });

  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove',(event)=>{
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

const parallax = document.querySelector('[data-parallax]');
let parallaxTick = false;
function updateParallax(){
  if(parallax && !reduceMotion){
    const image = parallax.querySelector('img');
    const rect = parallax.getBoundingClientRect();
    const shift = (window.innerHeight / 2 - rect.top) * .12;
    image.style.transform = `translate3d(0,${shift}px,0) scale(1.08)`;
  }
  document.querySelectorAll('[data-parallax-gallery]').forEach(card=>{
    const image = card.querySelector('img');
    const media = card.querySelector('.gallery-media');
    if(!image || !media || reduceMotion) return;
    const rect = media.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / Math.max(window.innerHeight,rect.height);
    const speed = Number(card.dataset.speed || .12);
    const shift = Math.max(-34,Math.min(34,-progress*190*speed));
    image.style.transform = `translate3d(0,${shift}px,0) scale(1.045)`;
  });
  parallaxTick = false;
}
window.addEventListener('scroll',()=>{
  if(!parallaxTick){requestAnimationFrame(updateParallax);parallaxTick=true;}
},{passive:true});
window.addEventListener('resize',updateParallax);
updateParallax();

const menuButton = document.querySelector('.menu-btn');
const navElement = document.querySelector('nav');
menuButton?.addEventListener('click',()=>{
  const open = navElement.classList.toggle('mobile-open');
  menuButton.setAttribute('aria-expanded',String(open));
});
navElement?.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click',()=>navElement.classList.remove('mobile-open'));
});
