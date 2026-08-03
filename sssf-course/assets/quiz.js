document.querySelectorAll('[data-quiz]').forEach((quiz) => {
  const answer = quiz.dataset.answer;
  const feedback = quiz.querySelector('[data-feedback]');
  quiz.querySelectorAll('button[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const correct = button.dataset.choice === answer;
      quiz.querySelectorAll('button[data-choice]').forEach((item) => {
        item.classList.remove('correct', 'wrong');
        item.removeAttribute('aria-current');
      });
      button.classList.add(correct ? 'correct' : 'wrong');
      button.setAttribute('aria-current', 'true');
      feedback.textContent = correct
        ? quiz.dataset.correct
        : quiz.dataset.wrong;
      feedback.style.color = correct ? 'var(--green)' : 'var(--red)';
    });
  });
});
