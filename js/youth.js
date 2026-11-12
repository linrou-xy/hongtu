/* ==========================================================================
   红途 · 青年回声页脚本
   负责：五题知识小测、写一封保存在本地的信
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 知识小测 ---------- */

  const quizData = [
    {
      question: "1936 年 10 月，红军三大主力会师的主要地点是？",
      options: ["南梁", "会宁", "兰州", "延安"],
      answer: 1,
      explanation: "1936 年 10 月，红军三大主力先后在会宁、静宁将台堡等地会师，长征胜利结束。"
    },
    {
      question: "以甘肃南梁为中心的陕甘边革命根据地，主要创建者包括？",
      options: [
        "李大钊、陈独秀",
        "刘志丹、谢子长、习仲勋等",
        "邓稼先、钱学森",
        "王进喜、焦裕禄"
      ],
      answer: 1,
      explanation: "刘志丹、谢子长、习仲勋等共产党人，在陇东一带创建并发展了陕甘边革命根据地。"
    },
    {
      question: "兰州解放的日子是哪一天？",
      options: ["1949 年 5 月 20 日", "1949 年 8 月 25 日", "1949 年 8 月 26 日", "1949 年 10 月 1 日"],
      answer: 2,
      explanation: "1949 年 8 月 25 日兰州战役总攻开始，8 月 26 日兰州解放。"
    },
    {
      question: "甘肃农业大学的前身是哪所学校？",
      options: ["国立兽医学院", "甘肃农学院", "西北农学院", "兰州农学院"],
      answer: 0,
      explanation: "学校前身是 1946 年 10 月创建于兰州的国立兽医学院，1958 年成立甘肃农业大学。"
    },
    {
      question: "“自强不息、奋发有为”在甘农指的是？",
      options: ["校训", "校风", "学风", "甘农精神"],
      answer: 3,
      explanation: "校训是“敦品励学、笃志允能”，校风是“勤奋、严谨、求实、创新”，甘农精神是“自强不息、奋发有为”。"
    }
  ];

  const quiz = document.querySelector("[data-quiz]");
  const live = quiz ? quiz.querySelector("[data-quiz-live]") : null;
  const result = quiz ? quiz.querySelector("[data-quiz-result]") : null;
  const questionEl = quiz ? quiz.querySelector("[data-quiz-question]") : null;
  const optionsEl = quiz ? quiz.querySelector("[data-quiz-options]") : null;
  const feedbackEl = quiz ? quiz.querySelector("[data-quiz-feedback]") : null;
  const currentEl = quiz ? quiz.querySelector("[data-quiz-current]") : null;
  const progressEl = quiz ? quiz.querySelector("[data-quiz-progress]") : null;
  const scoreEl = quiz ? quiz.querySelector("[data-quiz-score]") : null;
  const nextButton = quiz ? quiz.querySelector("[data-quiz-next]") : null;
  const restartButton = quiz ? quiz.querySelector("[data-quiz-restart]") : null;
  const finalEl = quiz ? quiz.querySelector("[data-quiz-final]") : null;
  const resultTitle = quiz ? quiz.querySelector("[data-quiz-title]") : null;
  const resultSummary = quiz ? quiz.querySelector("[data-quiz-summary]") : null;

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    if (!quiz || !questionEl || !optionsEl) return;

    const item = quizData[currentIndex];
    answered = false;

    if (currentEl) currentEl.textContent = String(currentIndex + 1).padStart(2, "0");
    if (progressEl) progressEl.style.width = ((currentIndex + 1) / quizData.length) * 100 + "%";
    if (scoreEl) scoreEl.textContent = String(score);
    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.classList.remove("is-visible");
    }
    if (nextButton) {
      nextButton.disabled = true;
      nextButton.textContent = currentIndex === quizData.length - 1 ? "查看结果 →" : "下一题 →";
    }

    questionEl.textContent = item.question;
    optionsEl.replaceChildren();

    item.options.forEach(function (option, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.dataset.index = String(index);

      const badge = document.createElement("span");
      badge.textContent = String.fromCharCode(65 + index);

      const text = document.createElement("em");
      text.textContent = option;
      text.style.fontStyle = "normal";

      button.append(badge, text);
      button.addEventListener("click", function () {
        selectAnswer(index, button);
      });
      optionsEl.appendChild(button);
    });
  }

  function selectAnswer(index, selectedButton) {
    if (answered) return;
    answered = true;

    const item = quizData[currentIndex];
    const optionButtons = Array.from(optionsEl.querySelectorAll(".quiz-option"));
    const isCorrect = index === item.answer;

    optionButtons.forEach(function (button) {
      const buttonIndex = Number(button.dataset.index);
      button.disabled = true;
      if (buttonIndex === item.answer) button.classList.add("is-correct");
      if (buttonIndex === index && !isCorrect) button.classList.add("is-wrong");
    });

    if (isCorrect) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      if (feedbackEl) {
        feedbackEl.innerHTML = "<strong>答对了。</strong> " + item.explanation;
      }
    } else {
      if (selectedButton) selectedButton.classList.add("is-wrong");
      if (feedbackEl) {
        feedbackEl.innerHTML = "<strong>再想一步。</strong> " + item.explanation;
      }
    }

    if (feedbackEl) feedbackEl.classList.add("is-visible");
    if (nextButton) nextButton.disabled = false;
  }

  function showResult() {
    if (!quiz || !live || !result) return;

    live.hidden = true;
    result.classList.add("is-visible");

    if (finalEl) finalEl.textContent = String(score);

    let title = "行走结束，思考继续。";
    let summary = "没关系，历史不是用来考试的。再走一遍，也许会有新的发现。";

    if (score === quizData.length) {
      title = "这条路，你真正走了一遍。";
      summary = "你记住了五个路标。更重要的是，愿意继续把问题带在身上。";
    } else if (score >= 3) {
      title = "大部分路标，你都记住了。";
      summary = "还有几处细节可以再确认。把不确定的地方记下来，下一次实地走一走。";
    } else if (score >= 1) {
      title = "走过，但还可以再走深一点。";
      summary = "分数只是提醒。回到行迹页，重新看看那些年份背后的故事。";
    }

    if (resultTitle) resultTitle.textContent = title;
    if (resultSummary) resultSummary.textContent = summary;
  }

  function goNext() {
    if (!answered) return;
    if (currentIndex < quizData.length - 1) {
      currentIndex += 1;
      renderQuestion();
      return;
    }
    showResult();
  }

  function restartQuiz() {
    currentIndex = 0;
    score = 0;
    if (live) live.hidden = false;
    if (result) result.classList.remove("is-visible");
    renderQuestion();
  }

  if (quiz) {
    renderQuestion();
    if (nextButton) nextButton.addEventListener("click", goNext);
    if (restartButton) restartButton.addEventListener("click", restartQuiz);
  }

  /* ---------- 写给一年后的自己 ---------- */

  const form = document.querySelector("[data-letter-form]");
  const input = document.querySelector("[data-letter-input]");
  const countEl = document.querySelector("[data-letter-count]");
  const resultBox = document.querySelector("[data-letter-result]");
  const resultText = document.querySelector("[data-letter-text]");
  const resultDate = document.querySelector("[data-letter-date]");
  const clearButton = document.querySelector("[data-letter-clear]");
  const resetButton = document.querySelector("[data-letter-reset]");
  const storageKey = "hongtu-letter-v1";

  function getSavedLetter() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveLetter(value) {
    const letter = {
      text: value,
      date: new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(letter));
    } catch (error) {
      return null;
    }
    return letter;
  }

  function showLetter(letter) {
    if (!letter || !resultBox) return;
    if (resultText) resultText.textContent = letter.text;
    if (resultDate) resultDate.textContent = letter.date;
    resultBox.classList.add("is-visible");
  }

  function updateCount() {
    if (!input || !countEl) return;
    countEl.textContent = String(input.value.length);
  }

  if (input) {
    updateCount();
    input.addEventListener("input", function () {
      input.removeAttribute("aria-invalid");
      updateCount();
    });

    const saved = getSavedLetter();
    if (saved && saved.text) {
      input.value = saved.text;
      updateCount();
      showLetter(saved);
    }
  }

  if (form && input) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();

      if (!value) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      const letter = saveLetter(value);
      if (letter) showLetter(letter);
    });
  }

  if (resetButton && input) {
    resetButton.addEventListener("click", function () {
      input.value = "";
      input.removeAttribute("aria-invalid");
      updateCount();
      input.focus();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        /* 本地存储不可用时，仅关闭展示 */
      }
      if (resultBox) resultBox.classList.remove("is-visible");
      if (input) {
        input.value = "";
        updateCount();
        input.focus();
      }
    });
  }
})();
