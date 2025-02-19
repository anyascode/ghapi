const autoCompleteInput = document.querySelector(".autocompleteInput");
const dropdownList = document.querySelector(".dropdownList");
const repoList = document.querySelector(".repoList");

async function fetchRepos(query) {
  const url = `https://api.github.com/search/repositories?q=${query}&per_page=5`;
  try {
    const response = await fetch(url);
    const getResponse = await response.json();
    const items = getResponse.items || [];
    return items.map((repo) => ({
      name: repo.full_name,
      login: repo.owner.login,
      stars: repo.stargazers_count,
    }));
  } catch (error) {
    console.error("Ошибка загрузки:", error);
  }
}

const debounce = (fn, debounceTime) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(context, args), debounceTime);
  };
};

autoCompleteInput.addEventListener("input", debounce(onInputChange, 500));

async function onInputChange() {
  const value = autoCompleteInput.value.trim().toLowerCase();

  if (value.length === 0) {
    createAutoCompleteDropdown([]);
    return;
  }

  const repos = await fetchRepos(value);

  createAutoCompleteDropdown(repos);
}

function createAutoCompleteDropdown(list) {
  dropdownList.innerHTML = "";

  list.forEach((repo) => {
    const li = document.createElement("li");
    li.classList.add("dropdownItem");
    const nameBtn = document.createElement("button");
    nameBtn.classList.add("dropdownItemButton");
    nameBtn.innerHTML = repo.name;
    nameBtn.addEventListener("click", async function () {
      autoCompleteInput.value = "";
      dropdownList.innerHTML = "";
      const repository = document.createElement("li");
      repository.classList.add("repository");
      const repositoryName = document.createElement("p");
      const repositoryOwner = document.createElement("p");
      const repositoryStars = document.createElement("p");
      const closeButton = document.createElement("button");

      repositoryName.innerHTML = `Name: ${repo.name}`;
      repository.append(repositoryName);
      repositoryOwner.innerHTML = `Login: ${repo.login}`;
      repository.append(repositoryOwner);
      repositoryStars.innerHTML = `Stars: ${repo.stars}`;
      repository.append(repositoryStars);

      closeButton.classList.add("closeButton");
      repository.append(closeButton);
      repoList.prepend(repository);

      closeButton.addEventListener("click", () => {
        repository.remove();
      });
    });

    li.append(nameBtn);
    dropdownList.append(li);
  });
}
