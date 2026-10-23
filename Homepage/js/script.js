(function () {
  const slidesWrap = document.querySelector(".slides");
  const dotsWrap = document.querySelector(".slide-dots");
  const prevBtn = document.querySelector(".slide-btn.prev");
  const nextBtn = document.querySelector(".slide-btn.next");
  if (!slidesWrap || !dotsWrap) return;

  let names = [];
  if (typeof SLIDES !== "undefined" && Array.isArray(SLIDES) && SLIDES.length) {
    names = SLIDES;
  } else {
    const existing = document.querySelectorAll(".slide img");
    existing.forEach(function (img) {
      names.push(img.getAttribute("src"));
    });
  }
  if (!names.length) return;

  const slides = [];
  names.forEach(function (name) {
    const div = document.createElement("div");
    div.className = "slide";
    const img = document.createElement("img");
    img.src = name.indexOf("/") !== -1 || name.indexOf("\\") !== -1
      ? name
      : "images/slides/" + name;
    img.alt = name;
    div.appendChild(img);
    slidesWrap.appendChild(div);
    slides.push(div);
  });

  slides[0].classList.add("active");
  const dots = [];

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "スライド " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  let current = 0;
  let timer = null;
  const INTERVAL = 5000;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () {
      goTo(current + 1);
    }, INTERVAL);
  }

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
    restart();
  });

  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
    restart();
  });

  restart();
})();

(function () {
  const groups = {
    rule: Array.prototype.slice.call(document.querySelectorAll("details.rule-ch")),
    region: Array.prototype.slice.call(document.querySelectorAll("details.region"))
  };
  const all = groups.rule.concat(groups.region);
  if (!all.length) return;

  const groupOf = {};
  Object.keys(groups).forEach(function (key) {
    groups[key].forEach(function (d) {
      groupOf[d] = key;
    });
  });

  const state = {};
  all.forEach(function (d) {
    state[d] = { opened: d.open };
  });

  function bodyOf(details) {
    return details.querySelector(":scope > summary + *");
  }

  function measure(body) {
    const details = body.parentElement;
    const wasOpen = details.open;
    details.open = true;
    const h = body.scrollHeight;
    details.open = wasOpen;
    return h;
  }

  function closeItem(details) {
    return new Promise(function (resolve) {
      const body = bodyOf(details);
      if (!details.open || !body) {
        state[details].opened = false;
        resolve();
        return;
      }
      body.style.height = body.scrollHeight + "px";
      void body.offsetHeight;
      body.style.height = "0px";
      const done = function () {
        details.open = false;
        body.style.height = "";
        body.removeEventListener("transitionend", done);
        state[details].opened = false;
        resolve();
      };
      body.addEventListener("transitionend", done);
      setTimeout(done, 400);
    });
  }

  function openItem(details) {
    return new Promise(function (resolve) {
      const body = bodyOf(details);
      const h1 = measure(body);
      details.open = true;
      body.style.height = "0px";
      void body.offsetHeight;
      body.style.height = h1 + "px";
      const done = function () {
        body.style.height = "";
        body.removeEventListener("transitionend", done);
        state[details].opened = true;
        resolve();
      };
      body.addEventListener("transitionend", done);
      setTimeout(done, 400);
    });
  }

  all.forEach(function (details) {
    const summary = details.querySelector(":scope > summary");
    if (!summary || !bodyOf(details)) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      const g = groupOf[details];
      const opening = !state[details].opened;
      const others = (groups[g] || []).filter(function (d) {
        return d !== details;
      });

      if (opening) {
        Promise.all(others.map(closeItem)).then(function () {
          openItem(details);
        });
      } else {
        closeItem(details);
      }
    });
  });
})();

(function () {
  const tabs = document.querySelectorAll(".ip-tab");
  const boxes = document.querySelectorAll(".ip-box");
  if (!tabs.length || !boxes.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const key = tab.getAttribute("data-ipkey");
      tabs.forEach(function (t) {
        t.classList.toggle("active", t === tab);
      });
      boxes.forEach(function (b) {
        b.hidden = b.getAttribute("data-ipbox") !== key;
      });
    });
  });
})();