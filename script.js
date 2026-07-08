const sports = [
  {
    name: 'BMX Park Final',
    options: [
      'M. Reynolds — gold',
      'Kai Tanaka — top-3',
      'Luna Costa — best run score',
      'XC LA — club winner'
    ]
  },
  {
    name: 'Skateboarding Street',
    options: [
      'Ari Novak — gold',
      'T. Santos — top-3',
      'Score выше 92.5',
      'Tokyo — club winner'
    ]
  },
  {
    name: 'Surfing Showcase',
    options: [
      'Maya Brooks — heat winner',
      'Roxy team — most points',
      'Новая best wave score',
      'Brazil — most medals'
    ]
  },
  {
    name: 'Inline Skating Best Trick',
    options: [
      'Nico Vale — gold',
      'Eva Stone — breakout athlete',
      'Будет новый trick record',
      'Score 88–92'
    ]
  }
];

const pickTypes = [
  'Gold winner',
  'Top-3 athlete',
  'Score range',
  'Fan prop',
  'XGL club winner'
];

const rosterSlots = [
  {
    label: 'Skateboarder',
    options: ['Ari Novak', 'T. Santos', 'Mila Chen']
  },
  {
    label: 'BMX rider',
    options: ['M. Reynolds', 'Kai Tanaka', 'Luna Costa']
  },
  {
    label: 'Surfer',
    options: ['Maya Brooks', 'Noa Silva', 'Riley Moore']
  },
  {
    label: 'Underdog',
    options: ['Eva Stone', 'Nico Vale', 'Sam Ortega']
  },
  {
    label: 'XGL Club',
    options: ['New York', 'Tokyo', 'Los Angeles', 'São Paulo']
  }
];

const sportSelect = document.querySelector('#sportSelect');
const pickTypeSelect = document.querySelector('#pickTypeSelect');
const optionList = document.querySelector('#optionList');
const savePick = document.querySelector('#savePick');
const savedPicks = document.querySelector('#savedPicks');
const fantasyBuilder = document.querySelector('#fantasyBuilder');
const saveRoster = document.querySelector('#saveRoster');
const rosterSummary = document.querySelector('#rosterSummary');
const previewPoints = document.querySelector('#previewPoints');

let selectedOption = '';
let picks = JSON.parse(localStorage.getItem('pickme:picks') || '[]');
let roster = JSON.parse(localStorage.getItem('pickme:roster') || '{}');

function fillSelect(select, items) {
  select.innerHTML = items
    .map((item, index) => `<option value="${index}">${item.name || item}</option>`)
    .join('');
}

function renderOptions() {
  const sport = sports[Number(sportSelect.value)];

  selectedOption = sport.options[0];

  optionList.innerHTML = sport.options
    .map((option, index) => `
      <button
        class="option-pill ${index === 0 ? 'active' : ''}"
        type="button"
        data-option="${option}"
      >
        ${option}
      </button>
    `)
    .join('');
}

function renderPicks() {
  if (!picks.length) {
    savedPicks.innerHTML = `
      <li class="empty-state">
        Пока нет прогнозов. Выбери соревнование и нажми “Сохранить прогноз”.
      </li>
    `;
    return;
  }

  savedPicks.innerHTML = picks
    .map((pick) => `
      <li>
        <span>${pick.sport}</span>
        <b>${pick.type}</b>
        <em>${pick.option}</em>
      </li>
    `)
    .join('');
}

function renderFantasy() {
  fantasyBuilder.innerHTML = rosterSlots
    .map((slot) => `
      <article class="fantasy-slot">
        <label>${slot.label}</label>
        <select data-slot="${slot.label}">
          ${slot.options
            .map((option) => `
              <option ${roster[slot.label] === option ? 'selected' : ''}>
                ${option}
              </option>
            `)
            .join('')}
        </select>
      </article>
    `)
    .join('');

  renderRosterSummary();
}

function renderRosterSummary() {
  const values = rosterSlots.map((slot) => {
    return `${slot.label}: ${roster[slot.label] || slot.options[0]}`;
  });

  rosterSummary.textContent = `Текущая команда — ${values.join(' · ')}`;
}

fillSelect(sportSelect, sports);
fillSelect(pickTypeSelect, pickTypes);
renderOptions();
renderPicks();
renderFantasy();

sportSelect.addEventListener('change', renderOptions);

optionList.addEventListener('click', (event) => {
  const button = event.target.closest('.option-pill');

  if (!button) {
    return;
  }

  selectedOption = button.dataset.option;

  document.querySelectorAll('.option-pill').forEach((item) => {
    item.classList.remove('active');
  });

  button.classList.add('active');
});

savePick.addEventListener('click', () => {
  const sport = sports[Number(sportSelect.value)].name;
  const type = pickTypes[Number(pickTypeSelect.value)];

  picks.unshift({
    sport,
    type,
    option: selectedOption
  });

  picks = picks.slice(0, 5);

  localStorage.setItem('pickme:picks', JSON.stringify(picks));

  previewPoints.textContent = String(Number(previewPoints.textContent) + 8);

  renderPicks();
});

fantasyBuilder.addEventListener('change', (event) => {
  const select = event.target.closest('select[data-slot]');

  if (!select) {
    return;
  }

  roster[select.dataset.slot] = select.value;

  renderRosterSummary();
});

saveRoster.addEventListener('click', () => {
  rosterSlots.forEach((slot) => {
    roster[slot.label] = roster[slot.label] || slot.options[0];
  });

  localStorage.setItem('pickme:roster', JSON.stringify(roster));

  renderRosterSummary();

  saveRoster.textContent = 'Команда сохранена ✓';

  setTimeout(() => {
    saveRoster.textContent = 'Сохранить fantasy-команду';
  }, 1600);
});
