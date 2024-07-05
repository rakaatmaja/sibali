document.addEventListener('DOMContentLoaded', function () {
    if (isLoggedIn()) {
        fetchKontenData();
    } else {
        console.log('Pengguna belum login atau token tidak valid.');
    }

    function isLoggedIn() {
        const token = localStorage.getItem('access_token');
        return token !== null;
    }

    // FETCH Konten
    function fetchWithAuthorization(url, options = {}) {
        const token = localStorage.getItem('access_token');
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
        return fetch(url, options);
    }

    function fetchKontenData(page = 1) {
        fetchWithAuthorization(`http://127.0.0.1:8000/api/konten?page=${page}`)
            .then(response => response.json())
            .then(data => {
                const kontenBody = document.getElementById('kontenBody');
                kontenBody.innerHTML = '';
                data.forEach(konten => {
                    const localImagePath = `E:/KULIAH UNDIKSHA/Semester 4/SisBus/API_Sistem-Tersdistribusi/storage/app/${konten.gambar_konten}`;
                    const tr = document.createElement('tr');
                    tr.classList.add('text-gray-700', 'dark:text-gray-400');
                    tr.innerHTML = `
                        <td class="px-4 py-3">
                            <div class="flex items-center text-sm">
                                <div>
                                    <p class="font-semibold">${konten.title}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            ${konten.deskripsi}
                        </td>
                        <td class="px-4 py-3 text-xs">
                            <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                ${konten.kategori_konten}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <img class="object-cover w-20 h-20" src="${localImagePath}" alt="" loading="lazy" />
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center space-x-4 text-sm">
                              
                                <button onclick="showEditForm(${konten.id_konten}, '${konten.title.replace("'", "\\'")}', '${konten.deskripsi.replace("'", "\\'")}', '${konten.kategori_konten}', '${konten.gambar_konten}')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Edit">
                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                    </svg>
                                </button>
                                <button onclick="deleteKonten(${konten.id_konten})" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">
                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;




                    kontenBody.appendChild(tr);
                });


            })
            .catch(error => console.error('Error fetching konten data:', error));
    }
    // END FETCH

    // DELETE
    window.deleteKonten = function (id) {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Anda belum login. Silakan login terlebih dahulu.');
            return;
        }

        if (!confirm('Are you sure you want to delete this konten?')) return;

        fetch(`http://127.0.0.1:8000/api/konten/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    alert('Konten berhasil dihapus');
                    fetchKontenData();
                } else {
                    console.error('Error deleting konten:', response.statusText);
                    alert('Gagal menghapus konten. Silakan coba lagi.');
                }
            })
            .catch(error => console.error('Error deleting konten:', error));
    }
    // END DELETE

    // UPDATE
    window.showEditForm = function (id, title, deskripsi, kategori_konten, gambar_konten) {
        document.getElementById('editId').value = id; // Menyimpan ID konten untuk digunakan dalam pembaruan
        document.getElementById('editTitle').value = title;
        document.getElementById('editDeskripsi').value = deskripsi;
        document.getElementById('editKategoriKonten').value = kategori_konten;
        // Menampilkan nama file yang sudah ada, jika ada
        const editGambarKonten = document.getElementById('editGambarKonten');
        const filenameDisplay = editGambarKonten.nextElementSibling;

        if (gambar_konten) {
            // Jika gambar_konten ada, split untuk mendapatkan nama file
            const filename = gambar_konten.split('\\').pop().split('/').pop();
            filenameDisplay.textContent = filename;
        } else {
            // Jika tidak ada gambar dipilih, tampilkan placeholder
            filenameDisplay.textContent = 'Pilih gambar...';
        }

        document.getElementById('editFormContainer').style.display = 'block'; // Mengubah dari 'absolute' menjadi 'block'
    }

    window.hideEditForm = function () {
        document.getElementById('editFormContainer').style.display = 'none';
    }

    document.getElementById('editForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const id = document.getElementById('editId').value; // Mengambil ID konten dari form tersembunyi
        const title = document.getElementById('editTitle').value;
        const deskripsi = document.getElementById('editDeskripsi').value;
        const kategori_konten = document.getElementById('editKategoriKonten').value;
        const gambar_konten = document.getElementById('editGambarKonten').files[0]; // Mengambil file yang dipilih

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Anda belum login. Silakan login terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('deskripsi', deskripsi);
        formData.append('kategori_konten', kategori_konten);
        if (gambar_konten) {
            formData.append('gambar_konten', gambar_konten);
        }

        fetch(`http://127.0.0.1:8000/api/konten/update/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert('Konten berhasil diperbarui');
                    fetchKontenData();
                    hideEditForm();
                } else {
                    return response.text().then(text => { throw new Error(text) });
                }
            })
            .catch(error => {
                console.error('Error updating konten:', error);
                alert('Gagal memperbarui konten. Silakan coba lagi.');
            });
    });
    // END UPDATE

    // CREATE
    window.showCreateForm = function () {
        // Reset form values
        document.getElementById('createTitle').value = '';
        document.getElementById('createDeskripsi').value = '';
        document.getElementById('createKategoriKonten').value = '';
        document.getElementById('createGambarKonten').value = '';
        document.getElementById('filenameDisplay').textContent = 'Pilih gambar...';

        document.getElementById('createFormContainer').style.display = 'block'; // Show form
    }

    window.hideCreateForm = function () {
        document.getElementById('createFormContainer').style.display = 'none';
    }

    document.getElementById('createForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('createTitle').value;
        const deskripsi = document.getElementById('createDeskripsi').value;
        const kategori_konten = document.getElementById('createKategoriKonten').value;
        const gambar_konten = document.getElementById('createGambarKonten').files[0]; // Mengambil file yang dipilih

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Anda belum login. Silakan login terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('deskripsi', deskripsi);
        formData.append('kategori_konten', kategori_konten);
        if (gambar_konten) {
            formData.append('gambar_konten', gambar_konten);
        }

        fetch(`http://127.0.0.1:8000/api/konten/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert('Konten berhasil dibuat');
                    fetchKontenData();
                    hideCreateForm();
                } else {
                    return response.text().then(text => { throw new Error(text) });
                }
            })
            .catch(error => {
                console.error('Error creating konten:', error);
                alert('Gagal membuat konten. Silakan coba lagi.');
            });
    });
    // END CREATE


});
