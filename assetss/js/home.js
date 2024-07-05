const contentContainer = document.getElementById('content-container');
const contentTemplate = document.getElementById('content-template');

function isLoggedIn() {
  const token = localStorage.getItem('access_token');
  return token !== null;
}

function fetchWithAuthorization(url) {
  const token = localStorage.getItem('access_token');
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

function addItemToContainer(item, category) {
  const templateClone = contentTemplate.content.cloneNode(true);
  const imageElement = templateClone.querySelector('img');
  imageElement.src = `E:/KULIAH UNDIKSHA/Semester 4/SisBus/API_Sistem-Tersdistribusi-master/storage/app/${item.gambar_konten}`;
  imageElement.alt = item.title; // Set alt attribute for accessibility

  templateClone.querySelector('h3').textContent = item.title;
  templateClone.querySelector('p').textContent = item.deskripsi;
  templateClone.querySelector('a').href = `detail.html?id=${item.id_konten}`; // Update URL to item's details page

  const categoryContainer = document.getElementById(category + '-container');
  if (!categoryContainer) {
    const newCategoryContainer = document.createElement('div');
    newCategoryContainer.id = category + '-container';
    newCategoryContainer.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
    newCategoryContainer.className = 'row';
    contentContainer.appendChild(newCategoryContainer);
    newCategoryContainer.appendChild(templateClone);
  } else {
    categoryContainer.appendChild(templateClone);
  }
}


if (isLoggedIn()) {
  fetchWithAuthorization('http://127.0.0.1:8000/api/konten')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const foodItems = data.filter(item => item.kategori_konten === 'food');
      const newsItems = data.filter(item => item.kategori_konten === 'news');
      const travelItems = data.filter(item => item.kategori_konten === 'travel');

      foodItems.forEach(item => addItemToContainer(item, 'food'));
      newsItems.forEach(item => addItemToContainer(item, 'news'));
      travelItems.forEach(item => addItemToContainer(item, 'travel'));
    })
    .catch(error => console.error('Error fetching data:', error));
} else {
  console.log('Pengguna belum login atau token tidak valid.');
}
