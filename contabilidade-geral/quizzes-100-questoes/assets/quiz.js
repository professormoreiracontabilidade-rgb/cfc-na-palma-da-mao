(() => {
  "use strict";

  const dataNode = document.getElementById("quiz-data");
  if (!dataNode) return;

  const quiz = JSON.parse(dataNode.textContent);
  const storageKey = `pmQuizMoreiraV1:${quiz.quiz}`;
  const questionNumbers = quiz.questions.map((question) => String(question.number));
  const screens = {
    start: document.querySelector('[data-screen="start"]'),
    question: document.querySelector('[data-screen="question"]'),
    result: document.querySelector('[data-screen="result"]'),
  };
  const role = (name) => document.querySelector(`[data-role="${name}"]`);

  const defaultState = () => ({
    started: false,
    completed: false,
    current: 0,
    answers: {},
  });

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey));
      if (!parsed || typeof parsed !== "object") return defaultState();
      const answers = {};
      Object.entries(parsed.answers || {}).forEach(([number, letter]) => {
        if (questionNumbers.includes(number) && ["A", "B", "C", "D"].includes(letter)) {
          answers[number] = letter;
        }
      });
      return {
        started: Boolean(parsed.started),
        completed: Boolean(parsed.completed) && Object.keys(answers).length === 10,
        current: Math.max(0, Math.min(9, Number(parsed.current) || 0)),
        answers,
      };
    } catch {
      return defaultState();
    }
  }

  let state = readState();

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // O quiz continua funcionando mesmo quando o navegador bloqueia o armazenamento.
    }
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => {
      element.classList.toggle("is-hidden", key !== name);
    });
  }

  function correctCount() {
    return quiz.questions.reduce(
      (total, question) => total + (state.answers[question.number] === question.correct ? 1 : 0),
      0,
    );
  }

  function answeredCount() {
    return Object.keys(state.answers).length;
  }

  function updateStartScreen() {
    const startButton = document.querySelector('[data-screen="start"] [data-action="start"]');
    const restartButton = document.querySelector('[data-screen="start"] [data-action="restart"]');
    if (state.completed) {
      startButton.textContent = "Ver meu resultado";
    } else if (state.started && answeredCount() > 0) {
      startButton.textContent = `Continuar — ${answeredCount()}/10`;
    } else {
      startButton.textContent = "Começar agora";
    }
    restartButton.classList.toggle("is-hidden", answeredCount() === 0);
  }

  function optionButton(letter, copy, selected, correct) {
    const classes = ["quiz-option"];
    if (selected === letter) classes.push("is-selected");
    if (selected && letter === correct) classes.push("is-correct");
    if (selected === letter && selected !== correct) classes.push("is-wrong");

    return `
      <button class="${classes.join(" ")}" type="button" data-answer="${letter}" ${selected ? "disabled" : ""}>
        <span class="option-letter">${letter}</span>
        <span class="option-copy">${copy}</span>
      </button>`;
  }

  function renderPalette() {
    role("palette").innerHTML = quiz.questions
      .map((question, index) => {
        const selected = state.answers[question.number];
        const classes = ["palette-button"];
        if (index === state.current) classes.push("is-current");
        if (selected === question.correct) classes.push("is-correct");
        if (selected && selected !== question.correct) classes.push("is-wrong");
        return `<button class="${classes.join(" ")}" type="button" data-index="${index}" aria-label="Ir para a questão ${index + 1}">${index + 1}</button>`;
      })
      .join("");
  }

  function renderQuestion({ scroll = false } = {}) {
    const question = quiz.questions[state.current];
    const selected = state.answers[question.number];
    const isCorrect = selected === question.correct;
    const answered = Boolean(selected);

    role("question-count").textContent = `Questão ${state.current + 1} de 10`;
    role("live-score").textContent = String(correctCount() * 10);
    role("progress").style.width = `${((state.current + 1) / 10) * 100}%`;
    role("category").textContent = question.category;
    role("question-number").textContent = String(question.number).padStart(2, "0");
    role("title").textContent = question.title;
    role("prompt").innerHTML = question.promptHtml;
    role("options").innerHTML = ["A", "B", "C", "D"]
      .map((letter) => optionButton(letter, question.options[letter], selected, question.correct))
      .join("");

    const feedback = role("feedback");
    const resolution = role("resolution");
    feedback.classList.toggle("is-hidden", !answered);
    feedback.classList.toggle("is-correct", answered && isCorrect);
    feedback.classList.toggle("is-wrong", answered && !isCorrect);
    if (answered) {
      feedback.innerHTML = isCorrect
        ? `<strong>Resposta correta.</strong> Você marcou a alternativa ${selected}.`
        : `<strong>Resposta incorreta.</strong> Você marcou ${selected}; o gabarito é ${question.correct}.`;
      role("resolution-content").innerHTML = question.resolutionHtml;
      resolution.classList.remove("is-hidden", "is-collapsed");
      const toggle = document.querySelector('[data-action="toggle-resolution"]');
      toggle.textContent = "Ocultar";
      toggle.setAttribute("aria-expanded", "true");
    } else {
      feedback.textContent = "";
      resolution.classList.add("is-hidden");
    }

    const previous = document.querySelector('[data-action="previous"]');
    const next = document.querySelector('[data-action="next"]');
    previous.disabled = state.current === 0;
    next.disabled = !answered;
    if (state.current < 9) {
      next.textContent = "Próxima →";
    } else if (answeredCount() === 10) {
      next.textContent = "Finalizar";
    } else {
      next.textContent = "Ver pendentes";
    }

    renderPalette();
    saveState();

    if (scroll) {
      document.querySelector(".quiz-status").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderResult() {
    state.completed = answeredCount() === 10;
    saveState();
    const correct = correctCount();
    const score = correct * 10;
    role("result-score").textContent = String(score);
    role("correct-total").textContent = String(correct);
    role("wrong-total").textContent = String(10 - correct);

    let title = "Continue treinando";
    let message = "Revise os comentários e refaça o quiz para consolidar os pontos mais difíceis.";
    if (score === 100) {
      title = "Excelente desempenho!";
      message = "Você acertou todas as questões. Ótimo domínio deste bloco.";
    } else if (score >= 70) {
      title = "Muito bom!";
      message = "Seu resultado é consistente. Revise os erros para elevar ainda mais a pontuação.";
    } else if (score >= 50) {
      title = "Bom caminho";
      message = "Você já construiu uma base. Use as resoluções detalhadas para corrigir as lacunas.";
    }
    role("result-title").textContent = title;
    role("result-message").textContent = message;

    role("result-review").innerHTML = quiz.questions
      .map((question, index) => {
        const correctAnswer = state.answers[question.number] === question.correct;
        return `<button class="${correctAnswer ? "is-correct" : "is-wrong"}" type="button" data-review-index="${index}" aria-label="Revisar questão ${index + 1}">${index + 1}</button>`;
      })
      .join("");

    showScreen("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz() {
    if (state.completed) {
      renderResult();
      return;
    }
    state.started = true;
    showScreen("question");
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetQuiz() {
    if (answeredCount() > 0 && !window.confirm("Apagar as respostas deste quiz e começar novamente?")) {
      return;
    }
    state = defaultState();
    state.started = true;
    saveState();
    showScreen("question");
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-answer]");
    if (answer) {
      const question = quiz.questions[state.current];
      if (!state.answers[question.number]) {
        state.answers[question.number] = answer.dataset.answer;
        renderQuestion();
      }
      return;
    }

    const palette = event.target.closest("[data-index]");
    if (palette) {
      state.current = Number(palette.dataset.index);
      renderQuestion({ scroll: true });
      return;
    }

    const reviewItem = event.target.closest("[data-review-index]");
    if (reviewItem) {
      state.current = Number(reviewItem.dataset.reviewIndex);
      showScreen("question");
      renderQuestion();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;

    if (action === "start") startQuiz();
    if (action === "restart") resetQuiz();
    if (action === "previous" && state.current > 0) {
      state.current -= 1;
      renderQuestion({ scroll: true });
    }
    if (action === "next") {
      if (!state.answers[quiz.questions[state.current].number]) return;
      if (state.current < 9) {
        state.current += 1;
        renderQuestion({ scroll: true });
      } else if (answeredCount() === 10) {
        renderResult();
      } else {
        const pending = quiz.questions.findIndex((question) => !state.answers[question.number]);
        state.current = Math.max(0, pending);
        renderQuestion({ scroll: true });
      }
    }
    if (action === "review") {
      state.current = 0;
      showScreen("question");
      renderQuestion();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (action === "toggle-resolution") {
      const resolution = role("resolution");
      const collapsed = resolution.classList.toggle("is-collapsed");
      actionButton.textContent = collapsed ? "Mostrar" : "Ocultar";
      actionButton.setAttribute("aria-expanded", String(!collapsed));
    }
  });

  updateStartScreen();
  showScreen("start");
})();
