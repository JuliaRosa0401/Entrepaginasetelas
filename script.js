function updateRemoveButtons() {
  const removeButtons = document.querySelectorAll('.ingredient-row .btn-danger');
  const total = document.querySelectorAll('.ingredient-row').length;
  removeButtons.forEach(button => button.disabled = total <= 3);
}

function addIngredient() {
  const ingredientsDiv = document.getElementById('ingredients');
  const ingredientRow = document.createElement('div');
  ingredientRow.className = 'ingredient-row flex items-center space-x-2';

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.className = 'ingredient ingredient-input flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700';
  newInput.placeholder = 'Informe um tema...';

  const removeButton = document.createElement('button');
  removeButton.className = 'btn-danger bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm';
  removeButton.innerText = 'Excluir';
  removeButton.onclick = () => removeIngredient(removeButton);

  ingredientRow.appendChild(newInput);
  ingredientRow.appendChild(removeButton);
  ingredientsDiv.appendChild(ingredientRow);

  updateRemoveButtons();
}

function removeIngredient(button) {
  button.parentElement.remove();
  updateRemoveButtons();
}

async function submitForm() {
  const ingredientInputs = document.getElementsByClassName('ingredient');
  const ingredientes = [];

  for (let input of ingredientInputs) {
    if (input.value.trim()) ingredientes.push(input.value.trim());
  }

  if (ingredientes.length < 3) {
    alert('Por favor, preencha pelo menos três campos!');
    return;
  }

  const data = { ingredientes };
  const responseDiv = document.getElementById('response');
  const generateBtn = document.getElementById('generate-recipe-btn');
  const generateText = document.getElementById('generate-text');
  const spinner = document.getElementById('spinner');

  const frases = [
    '“A vida é como uma caixa de chocolates...” – Forrest Gump',
    '“Não existe lugar como o nosso lar.” – O Mágico de Oz',
    '“Depois de tudo, para isso servem os amigos.” – Harry Potter',
    '“Que a Força esteja com você.” – Star Wars',
    '“Até o infinito... e além!” – Toy Story',
    '“Só se vê bem com o coração.” – O Pequeno Príncipe',
    '“Eu sou o rei do mundo!” — Titanic',
    '“Por vezes, a escuridão é o caminho para a luz.” — Batman: O Cavaleiro das Trevas',
    '“Com grandes poderes vêm grandes responsabilidades.” — Homem-Aranha',
    '“O mundo não é dividido em bons ou maus. Todos nós temos luz e trevas dentro de nós.” — Harry Potter',
    '“Você não pode viver sua vida para os outros.” — O Curioso Caso de Benjamin Button',
    '“Apenas siga seu coração.” — Valente',
    '"Quando acordei hoje de manhã, eu sabia quem eu era, mas acho que já mudei muitas vezes desde então." – Alice no País das Maravilhas'
  ];

  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];

  responseDiv.innerHTML = `
    <div id="loading" class="text-center py-4 animate-fadeIn">
      <p class="text-white font-semibold">Gerando Recomendações com IA...</p>
      <p class="text-purple-300 italic mt-2 transition-opacity duration-500">${fraseAleatoria}</p>
      <p class="text-sm text-purple-200 mt-1">Isso pode levar alguns segundos...</p>
    </div>`;

  spinner.classList.remove('hidden');
  generateText.textContent = 'Gerando...';
  generateBtn.disabled = true;
  responseDiv.classList.remove('hidden');
  
  const temasLower = ingredientes.map(t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

const matrixTrigger = temasLower.includes('pipula azul') && 
                      temasLower.includes('pipula vermelha') && 
                      temasLower.includes('matrix');

if (matrixTrigger) {
  localStorage.setItem('easter-egg', 'matrix');
  alert('💊 Bem-vindo à Matrix...');
  location.reload();
  return;
}


  try {
    const response = await fetch('https://geradoria-topaz.vercel.app/receita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    responseDiv.innerHTML = result;
  } catch (error) {
    responseDiv.innerHTML = `<p class="text-red-600">Erro inesperado: ${error.message}</p>`;
    console.error(error);
  }

  spinner.classList.add('hidden');
  generateText.textContent = 'Gerar Recomendações';
  generateBtn.disabled = false;
}

function applyTheme(theme) {
  const body = document.body;
  const themeBtn = document.getElementById('toggle-theme');

  if (theme === 'dark') {
    body.classList.remove('bg-violet-200', 'light-theme', 'text-purple-950');
    body.classList.add('bg-purple-700', 'text-white');
    themeBtn.textContent = '☀️ Tema Claro';
  } else {
    body.classList.remove('bg-purple-700', 'text-white');
    body.classList.add('bg-violet-200', 'light-theme', 'text-purple-800');
    themeBtn.textContent = '🌙 Tema Escuro';
  }

  localStorage.setItem('theme', theme);

  // Easter Egg: temas especiais
  const ingredientsContainer = document.getElementById('ingredients');
  if (theme === 'dark') {
    if (localStorage.getItem('easter-egg') === 'harry') {
      ingredientsContainer.classList.add('harry-potter-theme');
    } else if (localStorage.getItem('easter-egg') === 'matrix') {
      ingredientsContainer.classList.add('matrix-theme');
    } else if (localStorage.getItem('easter-egg') === 'gatsby') {
      ingredientsContainer.classList.add('gatsby-theme');
    } else if (localStorage.getItem('easter-egg') === 'starwars') {
      ingredientsContainer.classList.add('star-wars-theme');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateRemoveButtons();

  document.getElementById('add-ingredient-btn').addEventListener('click', addIngredient);
  document.getElementById('generate-recipe-btn').addEventListener('click', submitForm);
  document.getElementById('clear-ingredients-btn').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.ingredient-input');
    inputs.forEach(input => input.value = '');
    document.getElementById('response').classList.add('hidden');
  });

  const removeButtons = document.querySelectorAll('.ingredient-row .btn-danger');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => removeIngredient(button));
  });

  const themeBtn = document.getElementById('toggle-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = localStorage.getItem('theme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });

    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);
  }
});

window.addEventListener('load', () => {
  const footer = document.getElementById('site-footer');
  footer.classList.remove('opacity-0', 'translate-y-10');
  footer.classList.add('opacity-100', 'translate-y-0');
});

let clickCount = 0;
const title = document.getElementById('page-title'); // certifique-se que o título tenha esse ID

if (title) {
  title.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 7) {
      localStorage.setItem('easter-egg', 'harry');
      alert('🧙‍♂️ Magia ativada! Tema de Harry Potter carregado.');
      location.reload();
    }
    setTimeout(() => clickCount = 0, 2000); // reseta após 2s sem clicar
  });
}