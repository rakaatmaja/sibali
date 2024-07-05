const detailContainer = document.getElementById('detail-container');
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments-list');
const editCommentFormContainer = document.getElementById('edit-comment-form-container');
const editCommentForm = document.getElementById('edit-comment-form');
let editCommentId = null;

// Fungsi untuk mendapatkan parameter ID dari URL
function getParameterByName(name) {
  const url = new URL(window.location.href);
  const paramValue = url.searchParams.get(name);
  return paramValue;
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function isLoggedIn() {
  const token = localStorage.getItem('access_token');
  return token !== null;
}

// Fungsi untuk menambahkan header Authorization ke setiap permintaan fetch
function fetchWithAuthorization(url, options = {}) {
  const token = localStorage.getItem('access_token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Fungsi untuk mengambil dan menampilkan detail konten
function fetchContentDetail(contentId) {
  fetchWithAuthorization(`http://127.0.0.1:8000/api/konten/${contentId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(item => {
      const localImagePath = `E:/KULIAH UNDIKSHA/Semester 4/SisBus/API_Sistem-Tersdistribusi-master/storage/app/${item.gambar_konten}`;
      console.log('Content Detail:', item);
      detailContainer.innerHTML = `
        <div class="thumbnail">
          <img src="${localImagePath}" alt="" class="img-responsive">
          <div class="caption">
            <h3>${item.title}</h3>
            <p>${item.deskripsi}</p>
          </div>
        </div>
      `;
    })
    .catch(error => console.error('Error fetching content detail:', error));
}

// Fungsi untuk mengambil dan menampilkan komentar
function fetchComments(contentId) {
  fetchWithAuthorization(`http://127.0.0.1:8000/api/komen/konten/${contentId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(comments => {
      console.log('Comments:', comments);
      commentsContainer.innerHTML = '';
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
          <p>${comment.komen}</p>
          <button class="btn btn-secondary" onclick="showEditForm(${comment.id_komen}, '${comment.komen}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteComment(${comment.id_komen}, ${contentId})">Delete</button>
        `;
        commentsContainer.appendChild(commentDiv);
      });
    })
    .catch(error => console.error('Error fetching comments:', error));
}

// Fungsi untuk membuat komentar baru
function createComment(contentId, komen) {
  fetchWithAuthorization(`http://127.0.0.1:8000/api/komen/create/${contentId}`, {
    method: 'POST',
    body: JSON.stringify({
      komen: komen
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(comment => {
      console.log('New Comment:', comment);
      fetchComments(contentId); // Refresh comments
    })
    .catch(error => console.error('Error creating comment:', error));
}

// Fungsi untuk mengupdate komentar
function updateComment(commentId, komen, contentId) {
  fetchWithAuthorization(`http://127.0.0.1:8000/api/komen/update/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      komen: komen
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(comment => {
      console.log('Updated Comment:', comment);
      fetchComments(contentId); // Refresh comments
      editCommentFormContainer.style.display = 'none'; // Hide the edit form
    })
    .catch(error => console.error('Error updating comment:', error));
}

// Fungsi untuk menghapus komentar
function deleteComment(commentId, contentId) {
  fetchWithAuthorization(`http://127.0.0.1:8000/api/komen/delete/${commentId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(comment => {
      console.log('Deleted Comment:', comment);
      fetchComments(contentId); // Refresh comments
    })
    .catch(error => console.error('Error deleting comment:', error));
}

// Fungsi untuk menampilkan formulir edit
function showEditForm(commentId, currentComment) {
  editCommentFormContainer.style.display = 'block';
  document.getElementById('edit-comment-content').value = currentComment;
  editCommentId = commentId;
}

// Fungsi untuk menangani pengiriman form komentar
commentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const komen = document.getElementById('comment-content').value;
  const contentId = getParameterByName('id');

  if (contentId && komen) {
    createComment(contentId, komen);
    commentForm.reset(); // Reset form setelah pengiriman
  }
});

// Fungsi untuk menangani pengiriman form edit komentar
editCommentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const komen = document.getElementById('edit-comment-content').value;
  const contentId = getParameterByName('id');

  if (editCommentId && komen) {
    updateComment(editCommentId, komen, contentId);
    editCommentForm.reset(); // Reset form setelah pengiriman
  }
});

// Ambil detail konten dan komentar jika pengguna sudah login
if (isLoggedIn()) {
  const contentId = getParameterByName('id');
  if (contentId) {
    fetchContentDetail(contentId);
    fetchComments(contentId);
  } else {
    console.error('No content ID found in URL.');
  }
} else {
  console.log('Pengguna belum login atau token tidak valid.');
}
