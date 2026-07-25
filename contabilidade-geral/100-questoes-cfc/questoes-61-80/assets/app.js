
(() => {
  const storage = {
    get: (key) => {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set: (key, value) => {
      try { localStorage.setItem(key, value); } catch {}
    },
    remove: (key) => {
      try { localStorage.removeItem(key); } catch {}
    }
  };

  const shell = document.querySelector(".app-shell");
  if (shell) {
    const number = shell.dataset.question;
    const correct = shell.dataset.correct;
    const slides = [...document.querySelectorAll(".slide")];
    const dots = [...document.querySelectorAll(".progress i")];
    const previous = document.querySelector('[data-action="previous"]');
    const next = document.querySelector('[data-action="next"]');
    const restart = document.querySelector('[data-action="restart"]');
    const result = document.querySelector(".result-strip");
    const options = [...document.querySelectorAll(".option")];
    let current = 0;
    let selected = storage.get("pm_question_" + number + "_answer");

    const paintSelection = () => {
      options.forEach((option) => {
        const chosen = option.dataset.letter === selected;
        option.classList.toggle("selected", chosen);
        option.setAttribute("aria-pressed", chosen ? "true" : "false");
      });
    };

    const showResult = () => {
      result.className = "result-strip show";
      if (!selected) {
        result.classList.add("neutral");
        result.textContent = "Você não marcou uma alternativa. Gabarito: " + correct + ".";
      } else if (selected === correct) {
        result.classList.add("correct");
        result.textContent = "Muito bem! Você marcou " + selected + " e acertou.";
      } else {
        result.classList.add("wrong");
        result.textContent = "Você marcou " + selected + ". O gabarito correto é " + correct + ".";
      }
      storage.set("pm_question_" + number + "_completed", "1");
    };

    const render = () => {
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach((dot, index) => dot.classList.toggle("active", index <= current));
      previous.disabled = current === 0;
      next.innerHTML = current === slides.length - 1
        ? 'Reiniciar <span aria-hidden="true">↻</span>'
        : 'Avançar <span aria-hidden="true">→</span>';
      if (current === slides.length - 1) showResult();
      else result.className = "result-strip";
    };

    options.forEach((option) => option.addEventListener("click", () => {
      selected = option.dataset.letter;
      storage.set("pm_question_" + number + "_answer", selected);
      paintSelection();
    }));

    previous.addEventListener("click", () => {
      if (current > 0) { current -= 1; render(); }
    });
    next.addEventListener("click", () => {
      if (current < slides.length - 1) { current += 1; render(); }
      else { current = 0; render(); }
    });
    restart.addEventListener("click", () => {
      current = 0;
      selected = null;
      storage.remove("pm_question_" + number + "_answer");
      storage.remove("pm_question_" + number + "_completed");
      paintSelection();
      render();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") next.click();
      if (event.key === "ArrowLeft") previous.click();
    });

    let startX = 0;
    document.querySelector(".deck").addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });
    document.querySelector(".deck").addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - startX;
      if (Math.abs(distance) < 65) return;
      if (distance < 0) next.click();
      else previous.click();
    }, { passive: true });

    paintSelection();
    render();
  }

  const cards = [...document.querySelectorAll(".index-card")];
  if (cards.length) {
    const completed = cards.filter((card) => {
      const number = card.dataset.number;
      const done = storage.get("pm_question_" + number + "_completed") === "1";
      const selected = storage.get("pm_question_" + number + "_answer");
      if (done) {
        card.classList.add("completed");
        if (selected && selected !== card.dataset.correct) card.classList.add("incorrect");
        const status = card.querySelector(".index-status");
        status.innerHTML = selected === card.dataset.correct ? "Acertou ✓" : "Revisar ↻";
      }
      return done;
    }).length;
    const count = document.querySelector("[data-completed-count]");
    const bar = document.querySelector("[data-index-progress]");
    if (count) count.textContent = completed;
    if (bar) bar.style.width = (completed / cards.length * 100) + "%";

    document.querySelector("[data-reset-progress]")?.addEventListener("click", () => {
      cards.forEach((card) => {
        const number = card.dataset.number;
        storage.remove("pm_question_" + number + "_answer");
        storage.remove("pm_question_" + number + "_completed");
      });
      location.reload();
    });
  }
})();
