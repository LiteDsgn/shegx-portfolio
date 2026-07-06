/* ==========================================================================
   Shegx / Olusegun Adewole portfolio
   Vanilla JS: scroll progress, hero slideshow, role filter, audience tabs,
   Substack feed, copy-to-clipboard toast, lightbox (photos + video),
   match-tapes playlist (dormant until MATCH_TAPES has entries).
   ========================================================================== */
(function () {
  'use strict';

  var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */

  var ROLES = [
    {
      id: 'firecrackers',
      active: true,
      num: '01',
      category: 'football',
      title: 'Firecrackers FC',
      tag1: 'Captain',
      tag2: 'Winger · No. 7',
      focus: 'Match leadership',
      image: 'assets/dsc-0390.jpg',
      alt: 'Shegx leading Firecrackers FC teammates on the pitch',
      summary: 'I\'m the current captain and a winger in the No. 7 for Firecrackers FC. Wide play, leadership and match-day standards, and I set the tone through the daily team culture.',
      detail: 'This is the core of who I am: an active footballer who leads on the pitch and sets the standard every session.'
    },
    {
      id: 'training',
      active: true,
      num: '02',
      category: 'training',
      title: 'Personal Football Training',
      tag1: 'Personal Trainer',
      tag2: 'Young Talents',
      focus: 'Player growth',
      image: 'assets/dsc-0410.jpg',
      alt: 'Shegx winning an aerial challenge during training',
      summary: 'I run personal football training for young talents, not an academy. I turn real on-field experience into tailored coaching, skill development and mentorship that helps young players grow.',
      detail: 'One player at a time. Train hard, play smart, grow stronger.'
    },
    {
      id: 'reborn',
      active: true,
      num: '03',
      category: 'creative',
      title: 'The Reborn Brand',
      tag1: 'CEO',
      tag2: 'Creative Director',
      focus: 'Creative direction',
      image: 'assets/logos/the-reborn-brand.jpeg',
      alt: 'The Reborn Brand logo',
      logo: true,
      summary: 'I\'m the founder, CEO and Creative Director. I lead creative direction and brand identity built on courage, class and confidence, not photography: art direction and storytelling for a clear, confident visual voice.',
      detail: 'My active brand: creative direction, art direction and visual storytelling.'
    },
    {
      id: 'talent50',
      active: true,
      num: '04',
      category: 'operations',
      title: 'Talent 50',
      tag1: 'Head of Operations',
      tag2: 'Founding Team',
      focus: 'Operations',
      image: 'assets/logos/talent-50.jpeg',
      alt: 'Talent 50 logo',
      logo: true,
      summary: 'I manage operations with an eye for talent across sport, music and entertainment: seamless coordination, structure and effective talent development.',
      detail: 'As Head of Operations, I keep the people and moving parts organised.'
    },
    {
      id: 'bigben',
      active: true,
      num: '05',
      category: 'operations',
      title: 'Big Ben Socials',
      tag1: 'Head of Operations',
      tag2: 'Events',
      focus: 'Event delivery',
      image: 'assets/bigben01.jpeg',
      alt: 'Shegx at a Big Ben Socials event',
      pos: '50% 12%',
      summary: 'I head operations, overseeing planning, execution and organizational efficiency for events and community activations.',
      detail: 'I handle community activations and people-heavy events that need structure without losing energy.'
    },
    {
      id: 'kunta',
      active: true,
      num: '06',
      category: 'creative',
      title: 'Kunta Nation',
      tag1: 'A&R',
      tag2: 'Music & Talent',
      focus: 'Talent development',
      summary: 'I\'m an A&R at Kunta Nation, where I identify, develop and support emerging creative talent.',
      detail: 'Active role: finding and backing the next wave of creative talent.'
    }
  ];

  var ROLE_FILTERS = [
    { id: 'all', label: 'All roles' },
    { id: 'football', label: 'Football' },
    { id: 'training', label: 'Training' },
    { id: 'creative', label: 'Creative' },
    { id: 'operations', label: 'Operations' }
  ];

  var AUDIENCES = [
    {
      id: 'players',
      label: 'Young Players',
      kicker: 'Development',
      focus: 'Personal training',
      brings: 'I give young talents one-to-one football training, not an academy. I turn real match experience into tailored coaching, skill work and mentorship built around each player.',
      formats: ['1:1 sessions', 'Skill development', 'Mentorship', 'Match prep'],
      strengths: ['Active footballer', 'Patient coach', 'Growth focused']
    },
    {
      id: 'clubs',
      label: 'Clubs',
      kicker: 'Leadership',
      focus: 'Squad culture',
      brings: 'I\'m an active winger and captain. I bring communication, standards and composure built from real match responsibility.',
      formats: ['Playing roles', 'Captaincy', 'Squad culture'],
      strengths: ['Communicator', 'Team builder', 'Composed winger']
    },
    {
      id: 'brands',
      label: 'Brands',
      kicker: 'Creative',
      focus: 'Creative direction',
      brings: 'I bring creative direction (not photography), operations and marketing that connect sport and culture with a confident visual voice. At Kunta Nation I work A&R, identifying and developing emerging creative talent.',
      formats: ['Creative direction', 'Campaigns', 'Activations', 'A&R'],
      strengths: ['Creative director', 'Adaptable', 'Operations ready', 'Talent developer']
    },
    {
      id: 'media',
      label: 'Media',
      kicker: 'Narrative',
      focus: 'Football story',
      brings: 'I bring a real footballer voice to football content: interviews, features and commentary grounded in my time on the pitch.',
      formats: ['Interviews', 'Features', 'Podcasting', 'Commentary'],
      strengths: ['Clear voice', 'Insightful', 'Authentic']
    }
  ];

  /* Shown until the live Substack feed loads (and whenever the fetch fails). */
  var DEFAULT_POSTS = [
    {
      title: 'When I Die, I Want to Be Dead.',
      link: 'https://shegx07.substack.com/p/when-i-die-i-want-to-be-dead',
      date: 'Jun 30, 2026',
      image: 'https://substackcdn.com/image/fetch/$s_!Lem5!,f_auto,q_auto:good,fl_progressive:steep/https://substack-post-media.s3.amazonaws.com/public/images/026c009a-376b-4959-a594-16e3bbdcd17b_1122x1402.png',
      snippet: 'I have said this before, and I\'ll say it again: I have never found comfort in the idea of heaven or hell.'
    },
    {
      title: 'Cristiano Ronaldo: The Price of Outlasting Everyone',
      link: 'https://shegx07.substack.com/p/cristiano-ronaldo-the-price-of-outlasting',
      date: 'Jun 30, 2026',
      image: 'https://substackcdn.com/image/fetch/$s_!R6BW!,f_auto,q_auto:good,fl_progressive:steep/https://substack-post-media.s3.amazonaws.com/public/images/4c1d6ca7-0f3a-4298-8214-4068df8f73ef_1536x1024.png',
      snippet: 'There is a strange punishment reserved for people who refuse to disappear.'
    },
    {
      title: 'The Cruel Timing of Success',
      link: 'https://shegx07.substack.com/p/the-cruel-timing-of-success',
      date: 'Jun 29, 2026',
      image: 'https://substackcdn.com/image/fetch/$s_!nity!,f_auto,q_auto:good,fl_progressive:steep/https://substack-post-media.s3.amazonaws.com/public/images/fdf26384-d900-4fda-b7d4-71c66e9dcd8e_1402x1122.png',
      snippet: 'On success, and the strange moments it chooses to arrive.'
    },
    {
      title: 'Your Childhood Can Explain You. It Cannot Represent You Forever.',
      link: 'https://shegx07.substack.com/p/your-childhood-can-explain-you-it',
      date: 'Jun 29, 2026',
      image: 'https://substackcdn.com/image/fetch/$s_!EsHv!,w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https://substack-post-media.s3.amazonaws.com/public/images/db44ed22-782f-4946-ba74-d51518ab8246_958x1113.jpeg',
      snippet: 'One of the easiest things to do is trace a person\'s flaws back to their childhood.'
    }
  ];

  /* Match tapes: the "Match tapes" block in the highlights section stays hidden
     until this has entries. Drop MP4s in assets/videos/ (see its README), then
     list them here. `poster` and `detail` are optional. */
  var MATCH_TAPES = [
    // { title: 'Solo run and finish', detail: 'big sunday game', src: 'assets/videos/highlight-01.mp4', poster: 'assets/videos/highlight-01.jpg' }
  ];

  var SUBSTACK_URL = 'https://shegx07.substack.com';
  var FEED_ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=' +
    encodeURIComponent(SUBSTACK_URL + '/feed');
  var POSTS_CACHE_KEY = 'shegx-substack-posts-v1';

  /* ---------- Helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- Scroll progress ---------- */

  function initProgress() {
    var fill = document.getElementById('progress-fill');
    if (!fill) return;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0;
      fill.style.width = pct.toFixed(1) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Hero slideshow ---------- */

  function initHero() {
    var media = document.getElementById('hero-media');
    var dotsWrap = document.getElementById('hero-dots');
    if (!media || !dotsWrap) return;

    var slides = media.querySelectorAll('.hero__slide');
    var index = 0;
    var paused = false;

    var dots = Array.prototype.map.call(slides, function (_, i) {
      var dot = el('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show photo ' + (i + 1));
      dot.addEventListener('click', function () { show(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function show(i) {
      index = i;
      slides.forEach(function (slide, n) { slide.classList.toggle('is-active', n === i); });
      dots.forEach(function (dot, n) { dot.classList.toggle('is-active', n === i); });
    }

    show(0);

    media.addEventListener('mouseenter', function () { paused = true; });
    media.addEventListener('mouseleave', function () { paused = false; });

    if (!REDUCE_MOTION) {
      setInterval(function () {
        if (!paused && !document.hidden) show((index + 1) % slides.length);
      }, 5000);
    }
  }

  /* ---------- Roles: filter + featured panel + cards ---------- */

  function initRoles() {
    var filtersWrap = document.getElementById('role-filters');
    var grid = document.getElementById('roles-grid');
    if (!filtersWrap || !grid) return;

    var state = { filter: 'all', roleId: ROLES[0].id };

    var featured = {
      num: document.getElementById('role-feature-num'),
      title: document.getElementById('role-feature-title'),
      detail: document.getElementById('role-feature-detail'),
      focus: document.getElementById('role-feature-focus'),
      tag: document.getElementById('role-feature-tag')
    };

    ROLE_FILTERS.forEach(function (f) {
      var btn = el('button', null, f.label);
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.dataset.filter = f.id;
      btn.addEventListener('click', function () {
        state.filter = f.id;
        render();
      });
      filtersWrap.appendChild(btn);
    });

    function visibleRoles() {
      return ROLES.filter(function (r) {
        return state.filter === 'all' || r.category === state.filter;
      });
    }

    function buildCard(role, isActive) {
      var card = el('button', 'role-card' + (isActive ? ' is-active' : ''));
      card.type = 'button';
      card.setAttribute('aria-pressed', String(isActive));
      if (role.active) card.appendChild(el('span', 'role-card__status', 'active'));
      card.addEventListener('click', function () {
        state.roleId = role.id;
        render();
      });

      if (role.image) {
        var img = el('img', 'role-card__media' + (role.logo ? ' role-card__media--logo' : ''));
        img.src = role.image;
        img.alt = role.alt || '';
        img.loading = 'lazy';
        if (role.pos) img.style.objectPosition = role.pos;
        card.appendChild(img);
      } else {
        card.appendChild(el('div', 'role-card__media role-card__media--placeholder', role.title));
      }

      var body = el('div', 'role-card__body');
      var chips = el('div', 'chip-row');
      chips.appendChild(el('span', 'chip chip--tiny chip--blue', role.tag1));
      chips.appendChild(el('span', 'chip chip--tiny', role.tag2));
      body.appendChild(chips);
      body.appendChild(el('h3', 'role-card__title', role.title));
      body.appendChild(el('p', 'role-card__summary', role.summary));
      body.appendChild(el('div', 'role-card__focus', 'Focus: ' + role.focus));
      card.appendChild(body);
      return card;
    }

    function render() {
      var visible = visibleRoles();
      var active = visible.find(function (r) { return r.id === state.roleId; }) || visible[0] || ROLES[0];
      state.roleId = active.id;

      filtersWrap.querySelectorAll('button').forEach(function (btn) {
        var selected = btn.dataset.filter === state.filter;
        btn.classList.toggle('is-active', selected);
        btn.setAttribute('aria-selected', String(selected));
      });

      featured.num.textContent = active.num;
      featured.title.textContent = active.title;
      featured.detail.textContent = active.detail;
      featured.focus.textContent = active.focus;
      featured.tag.textContent = active.tag1;

      grid.textContent = '';
      visible.forEach(function (role) {
        grid.appendChild(buildCard(role, role.id === active.id));
      });
    }

    render();
  }

  /* ---------- Best fit: audience tabs ---------- */

  function initAudiences() {
    var tabsWrap = document.getElementById('fit-tabs');
    if (!tabsWrap) return;

    var detail = {
      label: document.getElementById('fit-label'),
      kicker: document.getElementById('fit-kicker'),
      focus: document.getElementById('fit-focus'),
      brings: document.getElementById('fit-brings'),
      formats: document.getElementById('fit-formats'),
      strengths: document.getElementById('fit-strengths')
    };

    var activeId = AUDIENCES[0].id;

    AUDIENCES.forEach(function (a) {
      var btn = el('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.dataset.audience = a.id;
      btn.appendChild(el('span', 'fit__tab-label', a.label));
      btn.appendChild(el('span', 'fit__tab-kicker', a.kicker));
      btn.addEventListener('click', function () {
        activeId = a.id;
        render();
      });
      tabsWrap.appendChild(btn);
    });

    function render() {
      var active = AUDIENCES.find(function (a) { return a.id === activeId; }) || AUDIENCES[0];

      tabsWrap.querySelectorAll('button').forEach(function (btn) {
        var selected = btn.dataset.audience === active.id;
        btn.classList.toggle('is-active', selected);
        btn.setAttribute('aria-selected', String(selected));
      });

      detail.label.textContent = active.label;
      detail.kicker.textContent = active.kicker;
      detail.focus.textContent = active.focus;
      detail.brings.textContent = active.brings;

      detail.formats.textContent = '';
      active.formats.forEach(function (f) {
        detail.formats.appendChild(el('span', 'chip', f));
      });

      detail.strengths.textContent = '';
      active.strengths.forEach(function (s) {
        detail.strengths.appendChild(el('span', 'chip', s));
      });
    }

    render();
  }

  /* ---------- Writing: Substack feed ---------- */

  function initWriting() {
    var grid = document.getElementById('writing-grid');
    if (!grid) return;

    function render(posts) {
      grid.textContent = '';

      var featured = posts[0];
      var featuredCard = el('a', 'post-featured');
      featuredCard.href = featured.link;
      featuredCard.target = '_blank';
      featuredCard.rel = 'noopener';

      if (featured.image) {
        var img = el('img', 'post-featured__img');
        img.src = featured.image;
        img.alt = '';
        img.loading = 'lazy';
        featuredCard.appendChild(img);
      }

      var body = el('div', 'post-featured__body');
      var meta = el('div', 'post-featured__meta');
      meta.appendChild(el('span', 'post-featured__badge', 'Latest'));
      meta.appendChild(el('span', 'post-date', featured.date));
      body.appendChild(meta);
      body.appendChild(el('h3', 'post-featured__title', featured.title));
      body.appendChild(el('p', 'post-featured__snippet', featured.snippet));
      body.appendChild(el('div', 'post-featured__link', 'Read on Substack →'));
      featuredCard.appendChild(body);
      grid.appendChild(featuredCard);

      var list = el('div', 'writing__list');
      posts.slice(1, 4).forEach(function (post) {
        var row = el('a', 'post-row');
        row.href = post.link;
        row.target = '_blank';
        row.rel = 'noopener';

        if (post.image) {
          var thumb = el('img', 'post-row__img');
          thumb.src = post.image;
          thumb.alt = '';
          thumb.loading = 'lazy';
          row.appendChild(thumb);
        }

        var rowBody = el('div', 'post-row__body');
        rowBody.appendChild(el('span', 'post-date', post.date));
        rowBody.appendChild(el('h3', 'post-row__title', post.title));
        row.appendChild(rowBody);
        list.appendChild(row);
      });

      var more = el('div', 'writing__more');
      more.appendChild(el('div', 'writing__more-title', 'New essays land here automatically.'));
      var moreLink = el('a', null, 'All posts →');
      moreLink.href = SUBSTACK_URL;
      moreLink.target = '_blank';
      moreLink.rel = 'noopener';
      more.appendChild(moreLink);
      list.appendChild(more);
      grid.appendChild(list);
    }

    // Render immediately: cached feed if present, bundled defaults otherwise.
    var initial = DEFAULT_POSTS;
    try {
      var cached = JSON.parse(localStorage.getItem(POSTS_CACHE_KEY) || 'null');
      if (cached && Array.isArray(cached.posts) && cached.posts.length) {
        initial = cached.posts;
      }
    } catch (e) { /* corrupted cache, fall back to defaults */ }
    render(initial);

    // Then refresh from the live feed.
    fetch(FEED_ENDPOINT)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) return;
        var posts = data.items.slice(0, 4).map(function (item) {
          var tmp = document.createElement('div');
          tmp.innerHTML = item.description || '';
          var text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
          var date = '';
          try {
            date = new Date((item.pubDate || '').replace(' ', 'T'))
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch (e) { /* leave date empty */ }
          return {
            title: item.title || 'Untitled',
            link: item.link || SUBSTACK_URL,
            date: date,
            image: (item.enclosure && item.enclosure.link) || item.thumbnail || '',
            snippet: text.slice(0, 150) + (text.length > 150 ? '…' : '')
          };
        });
        render(posts);
        try {
          localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify({ posts: posts, t: Date.now() }));
        } catch (e) { /* storage full or unavailable, skip caching */ }
      })
      .catch(function () { /* offline or feed down, defaults stay up */ });
  }

  /* ---------- Copy-to-clipboard + toast ---------- */

  function initCopy() {
    var toast = document.getElementById('toast');
    var toastTimer;

    function showToast(message) {
      if (!toast) return;
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('is-visible');
      toastTimer = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 2200);
    }

    function copyFallback(text) {
      var helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      helper.remove();
      showToast(ok ? text + ' copied' : 'Copy failed');
    }

    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.dataset.copy;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { showToast(text + ' copied'); },
            function () { copyFallback(text); }
          );
        } else {
          copyFallback(text);
        }
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var imgEl = document.getElementById('lightbox-img');
    if (!lightbox || !imgEl) return;

    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    var thumbsWrap = document.getElementById('lightbox-thumbs');
    var lastFocused = null;
    var group = [];
    var index = 0;
    var videoEl = null;

    function ensureVideo() {
      if (videoEl) return videoEl;
      videoEl = el('video', 'lightbox__video');
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      imgEl.parentNode.insertBefore(videoEl, imgEl.nextSibling);
      return videoEl;
    }

    function stopVideo() {
      if (!videoEl) return;
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
      videoEl.hidden = true;
    }

    function render() {
      var item = group[index];
      if (!item) return;
      if (item.video) {
        imgEl.hidden = true;
        var v = ensureVideo();
        v.hidden = false;
        if (item.poster) v.poster = item.poster;
        v.src = item.src;
      } else {
        stopVideo();
        imgEl.hidden = false;
        imgEl.src = item.src;
        imgEl.alt = item.alt || '';
      }

      var multi = group.length > 1;
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;
      thumbsWrap.hidden = !multi;

      var thumbs = thumbsWrap.children;
      for (var i = 0; i < thumbs.length; i++) {
        var active = i === index;
        thumbs[i].classList.toggle('is-active', active);
        if (active) {
          thumbs[i].setAttribute('aria-current', 'true');
          thumbs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else {
          thumbs[i].removeAttribute('aria-current');
        }
      }
    }

    function buildThumbs() {
      thumbsWrap.textContent = '';
      group.forEach(function (item, i) {
        var t = el('button', 'lightbox__thumb');
        t.type = 'button';
        t.setAttribute('aria-label', 'Photo ' + (i + 1) + ' of ' + group.length);
        var timg = el('img');
        timg.src = item.src;
        timg.alt = '';
        t.appendChild(timg);
        t.addEventListener('click', function () { index = i; render(); });
        thumbsWrap.appendChild(t);
      });
    }

    function open(items, startIndex) {
      group = items;
      index = startIndex;
      lastFocused = document.activeElement;
      buildThumbs();
      render();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      stopVideo();
      imgEl.src = '';
      thumbsWrap.textContent = '';
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function go(delta) {
      if (group.length < 2) return;
      index = (index + delta + group.length) % group.length;
      render();
    }

    // Each gallery grid is its own navigable group.
    document.querySelectorAll('.gallery__grid').forEach(function (grid) {
      var items = [].map.call(grid.querySelectorAll('.gallery__item'), function (node) {
        var img = node.querySelector('img');
        return { src: node.dataset.full || (img && img.src), alt: img ? img.alt : '' };
      });
      grid.querySelectorAll('.gallery__item').forEach(function (node, i) {
        node.addEventListener('click', function () { open(items, i); });
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });

    return open;
  }

  /* ---------- Match tapes ---------- */

  function initTapes(openLightbox) {
    var wrap = document.getElementById('match-tapes');
    var list = document.getElementById('tapes-list');
    if (!wrap || !list || !MATCH_TAPES.length || !openLightbox) return;

    wrap.hidden = false;
    MATCH_TAPES.forEach(function (tape) {
      var row = el('button', 'tape-row');
      row.type = 'button';
      row.appendChild(el('span', 'tape-row__play', '▶'));
      if (tape.poster) {
        var thumb = el('img', 'tape-row__thumb');
        thumb.src = tape.poster;
        thumb.alt = '';
        thumb.loading = 'lazy';
        row.appendChild(thumb);
      }
      row.appendChild(el('span', 'tape-row__title', tape.title));
      if (tape.detail) row.appendChild(el('span', 'tape-row__detail', tape.detail));
      row.addEventListener('click', function () {
        openLightbox([{ video: true, src: tape.src, poster: tape.poster }], 0);
      });
      list.appendChild(row);
    });
  }

  /* ---------- Boot ---------- */

  initProgress();
  initHero();
  initRoles();
  initAudiences();
  initWriting();
  initCopy();
  initTapes(initLightbox());
})();
