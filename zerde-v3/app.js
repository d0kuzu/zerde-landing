'use strict';

// Standalone design prototype. No analytics, storage, API calls, or form delivery.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const industries = {
  tours: {
    label: 'TOURS & EXPERIENCES', business: 'Evergreen Adventures',
    title: ['You’re wrapping up a tour.', 'Your next one is filling up.'],
    description: 'A guest has a question. Your assistant has the answer — and two spots on Saturday’s sunset tour.',
    notification: 'A new adventure is on the calendar.',
    caption: 'A new adventure. One conversation away.',
    question: 'Hi! Can I book a sunset kayak tour for two this Saturday?',
    answer: 'Absolutely! A little adventure sounds perfect. Which time works for you?',
    confirmation: (time) => `You’re all set! Two spots, Saturday at ${time}. See you on the water. ↗`,
    event: 'Sunset kayak tour', details: 'Jamie + 1 · 2 guests', times: ['5:00 PM', '6:30 PM']
  },
  beauty: {
    label: 'HEALTH & BEAUTY', business: 'Bloom Beauty Studio',
    title: ['You’re giving clients your best.', 'Your next appointment is booked.'],
    description: 'A new client wants to book a facial. Your assistant explains the options and finds a time that fits.',
    notification: 'A little self-care. All booked in.',
    caption: 'A moment of self-care. Already on the calendar.',
    question: 'Hi! Do you have any appointments for a facial this Saturday?',
    answer: 'We do! Our signature facial is a lovely place to start. Which time suits you?',
    confirmation: (time) => `You’re booked for Saturday at ${time}. We look forward to welcoming you!`,
    event: 'Signature facial', details: 'Jamie Lewis · First visit', times: ['10:00 AM', '2:30 PM']
  },
  home: {
    label: 'HOME SERVICES', business: 'Oak & Home Services',
    title: ['You’re finishing the job.', 'Your next visit is lined up.'],
    description: 'A homeowner needs an estimate. Your assistant gets the details and schedules a visit while you finish your day.',
    notification: 'Your next estimate is on the calendar.',
    caption: 'Another home. Another happy customer in the making.',
    question: 'Hi! Can someone come out to quote a bathroom remodel on Saturday?',
    answer: 'We’d be happy to take a look. We have two estimate visits available. Which works best?',
    confirmation: (time) => `Your estimate visit is booked for Saturday at ${time}. We’ll be in touch with the next steps.`,
    event: 'Bathroom remodel estimate', details: 'Jamie Lewis · Site visit', times: ['9:00 AM', '1:00 PM']
  },
  professional: {
    label: 'PROFESSIONAL SERVICES', business: 'Northline Consulting',
    title: ['You’re focused on your clients.', 'Your next introduction is ready.'],
    description: 'A business owner wants to learn more. Your assistant answers the first questions and books an introductory call.',
    notification: 'A new conversation is on the calendar.',
    caption: 'A good introduction. The beginning of something bigger.',
    question: 'Hi! I’d like to talk about help with my business. Are you free Saturday?',
    answer: 'Of course. A 15-minute introduction is a great first step. Which time works for you?',
    confirmation: (time) => `Your introduction is booked for Saturday at ${time}. Looking forward to meeting you!`,
    event: 'Business introduction', details: 'Jamie Lewis · 15-minute call', times: ['11:00 AM', '3:00 PM']
  }
};
let selectedIndustry = 'tours';
let activeScene = 'booking';
let currentStep = 0;
let timer = null;
let timerStarted = 0;
let remaining = 1000;
let pausedByUser = false;
let hasStarted = false;
let selectedTime = industries.tours.times[1];
const stepDelays = [850, 1200, 1900, 1500];
const panel = $('#panel-booking');
const pauseButton = $('#pause-demo');

function stopTimer() {
  if (timer !== null) {
    clearTimeout(timer);
    remaining = Math.max(0, remaining - (performance.now() - timerStarted));
    timer = null;
  }
}
function renderStep(step) {
  currentStep = step;
  $$('[data-step]').forEach((node) => {
    const visible = Number(node.dataset.step) <= step;
    node.classList.toggle('step-hidden', !visible);
    node.inert = !visible;
    node.setAttribute('aria-hidden', String(!visible));
  });
  $('#calendar-empty').hidden = step >= 3;
  $('#agent-state').textContent = ['Always here. Always helpful.', 'A helpful answer, right away.', 'Finding the perfect time.', 'Making room for one more.', 'Another customer, taken care of.'][step];
  $$('[data-time]').forEach(button => button.setAttribute('aria-pressed', String(step >= 3 && button.dataset.time === selectedTime)));
}
function updatePlayback() {
  const paused = pausedByUser || activeScene !== 'booking' || document.hidden;
  panel.classList.toggle('is-paused', paused);
  pauseButton.setAttribute('aria-label', pausedByUser ? 'Resume demo animation' : 'Pause demo animation');
  pauseButton.querySelector('use').setAttribute('href', pausedByUser ? '#i-play' : '#i-pause');
  if (paused) { stopTimer(); return; }
  if (!hasStarted || currentStep >= 4 || timer !== null || reducedMotion.matches) return;
  timerStarted = performance.now();
  timer = setTimeout(() => {
    timer = null;
    renderStep(currentStep + 1);
    remaining = stepDelays[currentStep] || 0;
    updatePlayback();
  }, remaining);
}
function applyBooking(time) {
  selectedTime = time;
  $('#confirmation-message').textContent = industries[selectedIndustry].confirmation(time);
  const [clock, period] = time.split(' ');
  const small = document.createElement('small');
  small.textContent = period;
  $('#calendar-time').replaceChildren(document.createTextNode(clock), document.createElement('br'), small);
}
function replayDemo() {
  stopTimer();
  hasStarted = true;
  pausedByUser = false;
  applyBooking(industries[selectedIndustry].times[1]);
  remaining = stepDelays[0];
  renderStep(reducedMotion.matches ? 4 : 0);
  updatePlayback();
}
$('#replay-demo').addEventListener('click', replayDemo);
pauseButton.addEventListener('click', () => { pausedByUser = !pausedByUser; updatePlayback(); });
document.addEventListener('visibilitychange', updatePlayback);
$$('[data-time]').forEach(button => button.addEventListener('click', () => {
  stopTimer();
  applyBooking(button.dataset.time);
  renderStep(4);
}));
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { stopTimer(); renderStep(4); }
  updatePlayback();
});

function selectScene(scene, focus = false) {
  activeScene = scene;
  $$('.demo-tab').forEach(tab => {
    const selected = tab.dataset.scene === scene;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    if (focus && selected) tab.focus();
  });
  updatePlayback();
}
$$('.demo-tab').forEach((tab, index, tabs) => {
  tab.addEventListener('click', () => selectScene(tab.dataset.scene));
  tab.addEventListener('keydown', event => {
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== null) { event.preventDefault(); selectScene(tabs[next].dataset.scene, true); }
  });
});
function scrollToDemo() { $('#demo').scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'}); }
$$('[data-open-scene]').forEach(button => button.addEventListener('click', () => {
  selectScene(button.dataset.openScene, true);
  scrollToDemo();
}));

function setIndustry(industry) {
  selectedIndustry = industry;
  const data = industries[industry];
  $$('[data-industry]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.industry === industry)));
  $('#story-category').textContent = `A DAY IN THE LIFE / ${data.label}`;
  $('#story-title').replaceChildren(document.createTextNode(data.title[0]), document.createElement('br'), document.createTextNode(data.title[1]));
  $('#story-description').textContent = data.description;
  $('#story-notification').textContent = data.notification;
  $('#demo-business').textContent = data.business;
  $('#scenario-caption').textContent = data.caption;
  $('#customer-message').textContent = data.question;
  $('#assistant-message').textContent = data.answer;
  $('#calendar-event-name').textContent = data.event;
  $('#calendar-event-details').textContent = data.details;
  $$('[data-time]').forEach((button, index) => {
    button.dataset.time = data.times[index];
    button.textContent = data.times[index];
  });
  stopTimer();
  applyBooking(data.times[1]);
  renderStep(4);
}
$$('[data-industry]').forEach(button => button.addEventListener('click', () => setIndustry(button.dataset.industry)));
$('#try-industry').addEventListener('click', () => {
  selectScene('booking', true);
  replayDemo();
  scrollToDemo();
});

let videoTimer = null;
$('#generate-video').addEventListener('click', () => {
  const button = $('#generate-video');
  const reel = $('.reel-preview');
  button.disabled = true;
  button.textContent = 'Finding your story…';
  $('#video-status').textContent = 'Selecting moments and shaping the story…';
  $('#video-badge').textContent = 'BRINGING IT TOGETHER';
  reel.classList.remove('is-generated');
  reel.classList.add('generating');
  clearTimeout(videoTimer);
  videoTimer = setTimeout(() => {
    reel.classList.remove('generating');
    reel.classList.add('is-generated');
    $('#video-badge').textContent = 'YOUR NEXT GREAT STORY';
    $('#video-status').textContent = 'Sample transformation complete · Ready to inspire';
    button.textContent = 'Create it again ↗';
    button.disabled = false;
  }, reducedMotion.matches ? 0 : 2600);
});

const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
});
window.matchMedia('(min-width: 681px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = $('#audit-dialog');
const form = $('#audit-form');
let dialogTrigger = null;
function openAudit(website = '', trigger = document.activeElement) {
  dialogTrigger = trigger;
  closeMenu();
  $('#audit-form-view').hidden = false;
  $('#audit-success').hidden = true;
  dialog.setAttribute('aria-labelledby', 'audit-title');
  $('#audit-website').value = website;
  $('#audit-website').setCustomValidity('');
  $('#audit-interest').value = activeScene === 'booking' ? 'explore' : activeScene;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
$$('[data-audit]').forEach(button => button.addEventListener('click', () => openAudit('', button)));
$('.dialog-close').addEventListener('click', () => dialog.close());
$('#close-success').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  form.reset();
  if (dialogTrigger && document.contains(dialogTrigger)) dialogTrigger.focus({preventScroll: true});
});
function validWebsite(input) {
  let valid = false;
  try {
    const raw = input.value.trim();
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    valid = ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.') && !/\s/.test(raw) && url.hostname.split('.').every(part => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part));
  } catch { valid = false; }
  input.setCustomValidity(valid ? '' : 'Please enter a business website, like yourbusiness.com.');
  return valid;
}
[$('#quick-website'), $('#audit-website')].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
$('#audit-name').addEventListener('input', event => event.target.setCustomValidity(''));
$('#quick-audit').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#quick-website');
  if (!validWebsite(input)) { input.reportValidity(); return; }
  openAudit(input.value.trim(), $('#quick-audit button'));
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#audit-name');
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  validWebsite($('#audit-website'));
  if (!form.reportValidity()) return;
  $('#audit-form-view').hidden = true;
  $('#audit-success').hidden = false;
  $('#audit-success h2').id = 'audit-success-title';
  dialog.setAttribute('aria-labelledby', 'audit-success-title');
  $('#success-message').textContent = `Thanks, ${name.value.trim().split(/\s/)[0]}. Your details for ${$('#audit-website').value.trim()} look ready for a fresh perspective.`;
  $('#close-success').focus();
});

$('#year').textContent = new Date().getFullYear();
applyBooking(selectedTime);
renderStep(reducedMotion.matches ? 4 : 0);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      hasStarted = true;
      updatePlayback();
      observer.disconnect();
    }
  }, {threshold: 0.15});
  observer.observe(panel);
} else { hasStarted = true; updatePlayback(); }
