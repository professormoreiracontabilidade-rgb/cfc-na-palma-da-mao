(() => {
  "use strict";

  const quizzes = Array.from({ length: 10 }, (_, index) => index + 1);
  const keyFor = (quiz) => `pmQuizMoreiraV1:${quiz}`;

  function readQuiz(quiz) {
    try {
      const parsed = JSON.parse(localStorage.getItem(keyFor(quiz)));
      if (!parsed || typeof parsed !== "object") return { answers: {}, completed: false };
      return {
        answers: parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {},
        completed: Boolean(parsed.completed),
      };
    } catch {
      return { answers: {}, completed: false };
    }
  }

  function updateIndex() {
    let totalAnswered = 0;
    let completedQuizzes = 0;

    quizzes.forEach((quiz) => {
      const state = readQuiz(quiz);
      const answered = Math.min(10, Object.keys(state.answers).length);
      const card = document.querySelector(`[data-quiz-card="${quiz}"]`);
      const status = card.querySelector('[data-role="card-status"]');
      const count = card.querySelector('[data-role="card-count"]');
      const score = card.querySelector('[data-role="card-score"]');
      const progress = card.querySelector('[data-role="card-progress"]');
      const action = card.querySelector('[data-role="card-action"]');

      totalAnswered += answered;
      if (state.completed && answered === 10) completedQuizzes += 1;

      card.classList.toggle("is-complete", state.completed && answered === 10);
      count.textContent = `${answered}/10 respondidas`;
      progress.style.width = `${answered * 10}%`;

      if (state.completed && answered === 10) {
        status.textContent = "Concluído";
        action.textContent = "Ver resultado";
        score.textContent = "Finalizado";
      } else if (answered > 0) {
        status.textContent = "Em andamento";
        action.textContent = "Continuar";
        score.textContent = `${answered * 10}% feito`;
      } else {
        status.textContent = "Não iniciado";
        action.textContent = "Começar";
        score.textContent = "—";
      }
    });

    document.querySelector('[data-role="overall-completed"]').textContent = String(totalAnswered);
    document.querySelector('[data-role="overall-progress"]').style.width = `${totalAnswered}%`;
    const message = document.querySelector('[data-role="overall-message"]');
    if (totalAnswered === 100) {
      message.textContent = "Todos os quizzes foram respondidos. Parabéns!";
    } else if (totalAnswered > 0) {
      message.textContent = `${completedQuizzes} de 10 quizzes concluídos. Continue avançando.`;
    } else {
      message.textContent = "Escolha um quiz para começar.";
    }
  }

  document.addEventListener("click", (event) => {
    const clear = event.target.closest('[data-action="clear-all"]');
    if (!clear) return;
    if (!window.confirm("Apagar o progresso dos 10 quizzes neste navegador?")) return;
    quizzes.forEach((quiz) => localStorage.removeItem(keyFor(quiz)));
    updateIndex();
  });

  updateIndex();
})();
