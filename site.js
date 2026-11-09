// SYRO landing — small behaviours: Auto/Manual, cover colours, reveal on scroll, early-access form.
(function () {
  // Google Form that collects early-access emails (filled in when the form exists).
  var FORM = {
    action: "",          // https://docs.google.com/forms/d/e/<id>/formResponse
    emailField: ""       // entry.<number>
  };

  // Auto / Manual
  var seg = document.querySelectorAll('.seg button[data-mode]');
  seg.forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-mode');
      seg.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.querySelectorAll('.mode-text').forEach(function (p) {
        p.hidden = p.getAttribute('data-for') !== m;
      });
    });
  });

  // Cover colours
  var img = document.getElementById('cover-img');
  document.querySelectorAll('.sw button').forEach(function (b, _i, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      if (img) {
        var n = img.cloneNode();
        n.src = b.getAttribute('data-src');
        n.alt = 'Generated vinyl-label cover, ' + b.getAttribute('data-name');
        img.parentNode.replaceChild(n, img);   // restarts the entry animation
        img = n;
      }
    });
  });

  // Reveal on scroll where CSS scroll timelines are not supported (Firefox and older Safari)
  var cssTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (!cssTimeline && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('rv-io'); io.observe(el); });
  }

  // Early-access form → Google Form
  var form = document.getElementById('access-form');
  var thanks = document.getElementById('thanks');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = (form.querySelector('input[type=email]') || {}).value || '';
      if (!email) { return; }
      var done = function () { form.hidden = true; if (thanks) { thanks.hidden = false; } };
      if (!FORM.action || !FORM.emailField) { done(); return; }
      var body = new URLSearchParams();
      body.append(FORM.emailField, email);
      fetch(FORM.action, { method: 'POST', mode: 'no-cors', body: body }).then(done, done);
    });
  }
})();
