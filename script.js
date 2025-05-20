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

  // Ativa spinner e muda texto
  spinner.classList.remove('hidden');
  generateText.textContent = 'Gerando...';
  generateBtn.disabled = true;

  // Mostra loading animado
  responseDiv.innerHTML = `
    <div id="loading" class="text-center py-4">
      <p class="text-white mt-2">Gerando Recomendações...</p>
    </div>`;
  responseDiv.classList.remove('hidden');

  try {
    const response = await fetch('https://geradoria-topaz.vercel.app/receita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.text();

    // Substitui loading pelo conteúdo gerado
    responseDiv.innerHTML = result;
  } catch (error) {
    responseDiv.innerHTML = `<p class="text-red-600">Erro: ${error.message}</p>`;
  }

  // Desativa spinner e restaura botão
  spinner.classList.add('hidden');
  generateText.textContent = 'Gerar Recomendações';
  generateBtn.disabled = false;
}



function applyTheme(theme) {
  const body = document.body;
  const themeBtn = document.getElementById('toggle-theme');

  if (theme === 'dark') {
    body.classList.remove(
      'bg-violet-400',
      'light-theme', 'text-purple-950'
    );
    body.classList.add(
      'bg-purple-700', 'text-white'
    );
    themeBtn.textContent = '☀️ Tema Claro';
  } else {
    body.classList.remove(
      'bg-purple-700',  'text-white'
    );
    body.classList.add(
      'bg-violet-400', 
      'light-theme', 'text-purple-800'
    );
    themeBtn.textContent = '🌙 Tema Escuro';
  }

  localStorage.setItem('theme', theme);
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

  // Alternância de tema
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

