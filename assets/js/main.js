(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Navegación ─────────────────────────────── */
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function setMenu(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    setMenu(!links.classList.contains('is-open'));
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a:not(.btn)'));

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Kiosco de demostración ─────────────────── */
  var destinations = {
    lab:    { name: 'Laboratorio', title: 'Laboratorio · Planta baja', hint: 'Siga el pasillo central y gire a la izquierda.', eta: '1 min', room: 'room-lab', path: [[200, 214], [200, 115], [94, 115], [94, 96]] },
    pedi:   { name: 'Pediatría', title: 'Pediatría · Consultorio 104', hint: 'Siga el pasillo central y gire a la derecha.', eta: '1 min', room: 'room-pedi', path: [[200, 214], [200, 115], [306, 115], [306, 96]] },
    rx:     { name: 'Rayos X', title: 'Rayos X · Planta baja', hint: 'Gire a la derecha al llegar al pasillo principal.', eta: '1 min', room: 'room-rx', path: [[200, 214], [200, 115], [306, 115], [306, 136]] },
    farm:   { name: 'Farmacia', title: 'Farmacia · Planta baja', hint: 'Gire a la izquierda y siga hasta el fondo.', eta: '2 min', room: 'room-farm', path: [[200, 214], [200, 115], [59, 115], [59, 136]] },
    cardio: { name: 'Cardiología', title: 'Cardiología · Consultorio 204', hint: 'Tome el ascensor al piso 2 y salga a la derecha.', eta: '3 min', room: 'room-cardio', path: [[200, 214], [200, 115], [147, 115], [147, 136]] }
  };

  var route = document.getElementById('route');
  var routeShadow = document.getElementById('routeShadow');
  var dest = document.getElementById('dest');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.kiosk-chip'));
  var query = document.getElementById('kioskQuery');
  var kTitle = document.getElementById('kioskTitle');
  var kHint = document.getElementById('kioskHint');
  var kEta = document.getElementById('kioskEta');
  var currentRoom = null;

  function showRoute(key) {
    var d = destinations[key];
    if (!d) return;
    var dAttr = d.path.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
    route.setAttribute('d', dAttr);
    routeShadow.setAttribute('d', dAttr);

    var last = d.path[d.path.length - 1];
    dest.setAttribute('cx', last[0]);
    dest.setAttribute('cy', last[1]);

    if (currentRoom) currentRoom.classList.remove('is-target');
    currentRoom = document.getElementById(d.room);
    currentRoom.classList.add('is-target');

    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.dest === key)); });
    query.textContent = d.name;
    kTitle.textContent = d.title;
    kHint.textContent = d.hint;
    kEta.textContent = d.eta;

    if (!reduceMotion && route.getTotalLength) {
      var len = route.getTotalLength();
      route.style.transition = 'none';
      route.style.strokeDasharray = len;
      route.style.strokeDashoffset = len;
      route.getBoundingClientRect();
      route.style.transition = 'stroke-dashoffset 1.1s ease';
      route.style.strokeDashoffset = 0;
    }
  }

  var userPicked = false;
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      userPicked = true;
      showRoute(chip.dataset.dest);
    });
  });
  showRoute('lab');

  // Recorre los destinos solo mientras nadie interactúe
  var demoKeys = Object.keys(destinations);
  var demoIndex = 0;
  if (!reduceMotion) {
    setInterval(function () {
      if (userPicked || document.hidden) return;
      demoIndex = (demoIndex + 1) % demoKeys.length;
      showRoute(demoKeys[demoIndex]);
    }, 4200);
  }

  // Reloj del kiosco
  var clock = document.getElementById('kioskClock');
  function tick() {
    var now = new Date();
    clock.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  }
  tick();
  setInterval(tick, 30000);

  // Anuncios de ejemplo en la franja del kiosco
  var ads = [
    ['Óptica · Planta baja', 'Examen visual el mismo día de su cita'],
    ['Farmacia · Junto a recepción', 'Retire su receta sin hacer fila'],
    ['Laboratorio clínico aliado', 'Resultados en su correo en 24 horas'],
    ['Cafetería · Nivel 1', 'Café y desayuno mientras espera']
  ];
  var adBox = document.getElementById('kioskAd');
  var adIndex = 0;
  if (!reduceMotion) {
    setInterval(function () {
      if (document.hidden) return;
      adIndex = (adIndex + 1) % ads.length;
      adBox.style.opacity = 0;
      setTimeout(function () {
        adBox.querySelector('strong').textContent = ads[adIndex][0];
        adBox.querySelector('span').textContent = ads[adIndex][1];
        adBox.style.opacity = 1;
      }, 400);
    }, 3800);
  }

  // Código QR decorativo (patrón ilustrativo, no codifica datos)
  var qr = document.getElementById('kioskQr');
  if (qr && qr.getContext) {
    var ctx = qr.getContext('2d');
    var n = 25;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, n, n);
    ctx.fillStyle = '#0b0b3d';
    var seed = 7;
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function inFinder(x, y) {
      return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    }
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (!inFinder(x, y) && rand() > 0.52) ctx.fillRect(x, y, 1, 1);
      }
    }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (p) {
      ctx.fillRect(p[0], p[1], 7, 7);
      ctx.fillStyle = '#fff';
      ctx.fillRect(p[0] + 1, p[1] + 1, 5, 5);
      ctx.fillStyle = '#0b0b3d';
      ctx.fillRect(p[0] + 2, p[1] + 2, 3, 3);
    });
  }

  /* ─── Carrusel ───────────────────────────────── */
  var carousel = document.getElementById('heroCarousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var current = 0;
    var timer = null;
    var AUTOPLAY_MS = 6000;

    var goTo = function (i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };
    var stop = function () { clearInterval(timer); carousel.classList.add('is-paused'); };
    var start = function () {
      if (reduceMotion) return;
      clearInterval(timer);
      carousel.classList.remove('is-paused');
      timer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
    };
    var restart = function () {
      // reinicia la barra de progreso del punto activo
      dots[current].classList.remove('active');
      void dots[current].offsetWidth;
      dots[current].classList.add('active');
      start();
    };

    carousel.querySelector('.carousel-next').addEventListener('click', function () { goTo(current + 1); restart(); });
    carousel.querySelector('.carousel-prev').addEventListener('click', function () { goTo(current - 1); restart(); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i); restart(); }); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    var touchX = 0;
    carousel.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].screenX; stop(); }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      restart();
    }, { passive: true });

    if (reduceMotion) carousel.classList.add('is-paused');
    start();
  }

  /* ─── Simulador de ingresos publicitarios ────── */
  var calc = document.getElementById('adCalc');
  if (calc) {
    var fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    var q = function (v) { return 'Q ' + fmt.format(v); };
    var $ = function (id) { return document.getElementById(id); };
    var HOURS_PER_DAY = 10;
    var SPOT_SECONDS = 10;
    var DAYS_PER_MONTH = 26;

    var update = function () {
      var screens = +$('calcScreens').value;
      var slots = +$('calcSlots').value;
      var rate = +$('calcRate').value;
      var fill = +$('calcFill').value / 100;
      var visitors = +$('calcVisitors').value;

      $('outScreens').textContent = screens;
      $('outSlots').textContent = slots;
      $('outRate').textContent = q(rate);
      $('outFill').textContent = Math.round(fill * 100) + ' %';
      $('outVisitors').textContent = fmt.format(visitors);

      var monthly = screens * slots * rate * fill;
      $('resMonthly').textContent = q(monthly);
      $('resYearly').textContent = q(monthly * 12);
      $('resAudience').textContent = fmt.format(visitors * DAYS_PER_MONTH);
      $('resPlays').textContent = fmt.format(Math.floor((HOURS_PER_DAY * 3600) / (slots * SPOT_SECONDS)));
    };
    calc.addEventListener('input', update);
    update();
  }

  /* ─── Aparición al hacer scroll ──────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.indexOf.call(entry.target.parentElement.children, entry.target);
        setTimeout(function () { entry.target.classList.add('visible'); }, Math.min(siblings, 4) * 80);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
