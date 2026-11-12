/* ==========================================================================
   红途 · 档案页脚本
   负责：类别筛选、关键词检索与档案弹窗
   ========================================================================== */

(function () {
  "use strict";

  const archiveData = {
    nanliang: {
      code: "ARCHIVE NO. 001 / SITE",
      title: "南梁：山沟里的苏维埃",
      meta: ["类别：旧址", "时间：1934", "地点：庆阳市华池县"],
      img: "",
      alt: "",
      text:
        "以南梁为中心的陕甘边革命根据地，是土地革命战争时期中国共产党在西北地区创建的重要根据地。1934 年 11 月，陕甘边区苏维埃政府成立。刘志丹、谢子长、习仲勋等共产党人在这里开展武装斗争、土地革命和政权建设。",
      quote: "它像一簇藏在黄土高原深处的火。后来，这簇火成了长征的落脚点，也成了奔赴抗日前线的出发点。",
      source: "参考资料：公开地方党史资料、南梁革命纪念馆展陈资料。"
    },
    huining: {
      code: "ARCHIVE NO. 002 / SITE",
      title: "会师门：一场漫长的抵达",
      meta: ["类别：旧址", "时间：1936 年 10 月", "地点：白银市会宁县"],
      img: "../images/huishi-gate.webp",
      alt: "会宁红军会师旧址的会师门",
      text:
        "会师门原为会宁旧城西门。1936 年 10 月，红军三大主力先后在会宁、静宁将台堡等地会师，标志长征胜利结束。今天的会师门与红军会师纪念塔、革命文物陈列馆共同组成会宁红军会师旧址。",
      quote: "门洞不高，但很多人从这里走过。他们中的一些人，比今天的我们还要年轻。",
      source: "影像：DarthVachel，CC BY-SA 3.0，Wikimedia Commons；资料：公开党史资料。"
    },
    lanzhou: {
      code: "ARCHIVE NO. 003 / BATTLE",
      title: "1949.08.26：兰州解放",
      meta: ["类别：战役", "时间：1949 年 8 月", "地点：兰州"],
      img: "../images/lanzhou-bridge.webp",
      alt: "1949 年 8 月 26 日解放军进入兰州黄河铁桥",
      text:
        "1949 年 8 月，中国人民解放军第一野战军发起兰州战役。8 月 25 日总攻开始，经过激烈战斗，8 月 26 日兰州解放。中山桥横跨黄河，是这场城市转折的重要见证。",
      quote: "桥这头的清晨，是很多人用黑夜换来的。",
      source: "影像：Public Domain，Wikimedia Commons；资料：公开党史与兰州地方史资料。"
    },
    shenjialing: {
      code: "ARCHIVE NO. 004 / BATTLE",
      title: "沈家岭：打开兰州的一把钥匙",
      meta: ["类别：战役", "时间：1949 年 8 月", "地点：兰州沈家岭"],
      img: "../images/lanzhou-battle.webp",
      alt: "兰州战役中解放军战士向阵地攻击",
      text:
        "沈家岭是兰州战役中最激烈的战场之一。解放军战士在陡峭的山梁上反复争夺，付出巨大牺牲。拿下沈家岭等外围阵地后，兰州城内的解放进程得以加快。",
      quote: "山梁上一寸一寸的推进，换来城内的天亮。",
      source: "影像：Public Domain，Wikimedia Commons；资料：公开党史资料。"
    },
    founded: {
      code: "ARCHIVE NO. 005 / SCHOOL",
      title: "1946：一间兽医学院的起点",
      meta: ["类别：校史", "时间：1946 年 10 月", "地点：兰州"],
      img: "",
      alt: "",
      text:
        "甘肃农业大学的前身，是 1946 年 10 月创建于兰州的国立兽医学院。首任院长盛彤笙先生提出“臻进人类健康、裨益国民生计”的办学初心。1950 年学校更名为西北兽医学院，1951 年更名为西北畜牧兽医学院。",
      quote: "一所学校的起点，往往藏着一群人想为国家解决什么问题。",
      source: "资料：甘肃农业大学官网《学校简介》《校史总览》。"
    },
    renamed: {
      code: "ARCHIVE NO. 006 / SCHOOL",
      title: "1958：甘肃农业大学成立",
      meta: ["类别：校史", "时间：1958 年", "地点：兰州"],
      img: "../images/campus-aerial.webp",
      alt: "甘肃农业大学校园航拍",
      text:
        "1958 年，西北畜牧兽医学院与筹建中的甘肃农学院合并，成立甘肃农业大学。此后学校历经“三易其址、四更其名”，逐步发展为以农业学科为优势特色、多学科协调发展的教学研究型大学。",
      quote: "校名在变，地点在变，但“把学问做进土地里”的方向没有变。",
      source: "影像：甘肃农业大学官网；资料：甘肃农业大学官网《学校简介》。"
    },
    flag: {
      code: "ARCHIVE NO. 007 / YOUTH",
      title: "国旗下的青春",
      meta: ["类别：青年", "时间：今天", "地点：甘农校园"],
      img: "../images/campus-flag.webp",
      alt: "甘肃农业大学校园升国旗仪式",
      text:
        "升旗仪式是校园里最日常的仪式之一。国歌响起时，所有人停下脚步，目光追随旗帜。对今天的青年来说，爱国不是一句口号，而是把个人选择放进国家需要的方向里。",
      quote: "我们站在旗杆下，也站在前人走过的路上。",
      source: "影像：甘肃农业大学官网。"
    },
    notes: {
      code: "ARCHIVE NO. 008 / YOUTH",
      title: "一页行走笔记",
      meta: ["类别：青年", "记录者：一名甘农青年", "时间：2026 年秋"],
      img: "",
      alt: "",
      text:
        "这份笔记没有宏大的结论，只有一些具体的瞬间：南梁的风、会宁城门下的对话、中山桥头的傍晚，以及回到学校后看见的第一盏灯。历史最终要落到“我该怎么做”这个问题上。",
      quote: "我不敢说自己读懂了历史，但我愿意从今天开始，认真对待脚下的土地。",
      source: "文字：红途行走笔记，第一人称原创。"
    }
  };

  const dialog = document.getElementById("archive-modal");
  const closeButton = dialog ? dialog.querySelector("[data-modal-close]") : null;
  const modalCode = document.getElementById("archive-modal-code");
  const modalTitle = document.getElementById("archive-modal-title");
  const modalMeta = document.getElementById("archive-modal-meta");
  const modalText = document.getElementById("archive-modal-text");
  const modalQuote = document.getElementById("archive-modal-quote");
  const modalSource = document.getElementById("archive-modal-source");
  const modalImage = document.getElementById("archive-modal-image");

  function openArchive(key) {
    const data = archiveData[key];
    if (!data || !dialog) return;

    modalCode.textContent = data.code;
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    modalSource.textContent = data.source;

    modalMeta.replaceChildren();
    data.meta.forEach(function (item) {
      const span = document.createElement("span");
      span.textContent = item;
      modalMeta.appendChild(span);
    });

    if (data.quote) {
      modalQuote.textContent = "“" + data.quote + "”";
      modalQuote.hidden = false;
    } else {
      modalQuote.hidden = true;
    }

    if (data.img) {
      modalImage.src = data.img;
      modalImage.alt = data.alt;
      modalImage.hidden = false;
    } else {
      modalImage.removeAttribute("src");
      modalImage.alt = "";
      modalImage.hidden = true;
    }

    document.body.classList.add("is-locked");
    dialog.showModal();
  }

  function closeArchive() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  document.querySelectorAll("[data-archive]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openArchive(trigger.dataset.archive);
    });
  });

  if (dialog) {
    if (closeButton) closeButton.addEventListener("click", closeArchive);

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeArchive();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("is-locked");
    });
  }

  /* ---------- 筛选与检索 ---------- */

  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll(".archive-card"));
  const searchInput = document.querySelector("[data-archive-search]");
  const emptyState = document.querySelector("[data-archive-empty]");
  let activeFilter = "all";

  function applyFilter() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    cards.forEach(function (card) {
      const category = card.dataset.category || "";
      const haystack = (
        (card.dataset.keywords || "") +
        " " +
        (card.textContent || "")
      ).toLowerCase();
      const matchCategory = activeFilter === "all" || category === activeFilter;
      const matchKeyword = keyword === "" || haystack.indexOf(keyword) !== -1;
      const isVisible = matchCategory && matchKeyword;

      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }
})();
