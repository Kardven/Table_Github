document.addEventListener("DOMContentLoaded", function () {
  const inputSearch = document.getElementById("input-search");
  const tableBody = document.querySelector("tbody");
  let favorites = JSON.parse(localStorage.getItem("githubFavorites")) || [];

  // Função para renderizar a tabela
  function renderTable() {
      tableBody.innerHTML = "";

      favorites.forEach((user, index) => {
          const row = document.createElement("tr");

          row.innerHTML = `
              <td class="user">
                  <a href="${user.html_url}" target="_blank">
                      <img src="${user.avatar_url}" alt="Imagem de ${user.login}">
                      <div class="user-info">
                          <p>${user.name || user.login}</p>
                          <span>${user.login}</span>
                      </div>
                  </a>
              </td>
              <td class="repositories">${user.public_repos}</td>
              <td class="followers">${user.followers}</td>
              <td class="remove" data-index="${index}">Remover</td>
          `;

          tableBody.appendChild(row);
      });

      // Adiciona evento de remoção a cada botão "Remover"
      document.querySelectorAll(".remove").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");
              favorites.splice(index, 1);
              saveFavorites();
              renderTable();
          });
      });
  }

  // Função para adicionar um novo favorito
  async function addFavorite(username) {
      if (favorites.some(user => user.login.toLowerCase() === username.toLowerCase())) {
          alert("Usuário já está na lista de favoritos.");
          return;
      }

      try {
          const response = await fetch(`https://api.github.com/users/${username}`);
          if (!response.ok) throw new Error("Usuário não encontrado");

          const userData = await response.json();
          favorites.push(userData);
          saveFavorites();
          renderTable();
      } catch (error) {
          alert(error.message);
      }
  }

  // Função para salvar os favoritos no localStorage
  function saveFavorites() {
      localStorage.setItem("githubFavorites", JSON.stringify(favorites));
  }

  // Evento de busca ao clicar no botão ou pressionar Enter
  document.querySelector(".search img").addEventListener("click", () => {
      const username = inputSearch.value.trim();
      if (username) {
          addFavorite(username);
          inputSearch.value = "";
      }
  });

  inputSearch.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
          const username = inputSearch.value.trim();
          if (username) {
              addFavorite(username);
              inputSearch.value = "";
          }
      }
  });

  // Renderizar a tabela ao carregar a página
  renderTable();
});
