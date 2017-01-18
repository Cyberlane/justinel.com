const searchArea = document.querySelector('.search');
const searchInput = document.querySelector('.search input');
const searchResults = document.querySelector('.search ul');

let searchCache = [];

const clearResults = () => {
  searchResults.innerHTML = '';
};

const renderEmptyResults = () => {
  searchResults.innerHTML = '<li><a href="#">No results.</a></li>';
};

const filterSearchResults = (posts, term) => {
  const regex = new RegExp(`\\b${term}\\b`, 'gi');
  return posts.filter(post =>
    (regex.test(post.title) || regex.test(post.content) ?
      post :
      null));
};

const renderSearchResults = (posts) => {
  clearResults();
  if (posts.length === 0) {
    renderEmptyResults();
    return;
  }
  posts
    .map(post => ({
      url: post.url,
      title: post.title.replace(/\&amp\;/, '&'),
    }))
    .map(post =>
      `<li>
      <a href="${post.url}">${post.title}</a>
    </li>`)
    .map((post) => {
      const node = document.createElement('div');
      node.innerHTML = post;
      return node.childNodes[0];
    })
    .forEach(post =>
      searchResults.appendChild(post),
    );
};

const search = () => {
  const term = searchInput.value;
  if (!term) {
    clearResults();
    return;
  }

  if (searchCache.length > 0) {
    renderSearchResults(filterSearchResults(searchCache, term));
    return;
  }

  fetch('/posts.json')
    .then(result => result.json())
    .then((posts) => {
      searchCache = posts;
      return posts;
    })
    .then(posts => filterSearchResults(posts, term))
    .then(renderSearchResults);
};

const isChild = (element, parent) => {
  let node = element.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

const searchOffClick = (e) => {
  if (!isChild(e.target, searchArea)) {
    clearResults();
  }
};

searchInput.addEventListener('focus', search, false);
searchInput.addEventListener('input', () => search(), false);
searchArea.addEventListener('submit', e => e.preventDefault(), false);
document.addEventListener('click', searchOffClick, false);
