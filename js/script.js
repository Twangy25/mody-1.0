// // авторизация


// const modal = document.getElementById('authModal');
// const openBtn = document.getElementById('profileBtn');
// const form = document.getElementById('authForm');

// function openModal() {
//     modal.classList.add('is-open');
//     modal.setAttribute('aria-hidden', 'false');
//     document.body.classList.add('modal-open');

//     const firstInput = form.querySelector('input');
//     if (firstInput) firstInput.focus();
// }

// function closeModal() {
//     modal.classList.remove('is-open');
//     modal.setAttribute('aria-hidden', 'true');
//     document.body.classList.remove('modal-open');
// }


// openBtn.addEventListener('click', openModal);


// modal.querySelectorAll('[data-close]').forEach(el => {
//     el.addEventListener('click', closeModal);
// });


// document.addEventListener('keydown', e => {
//     if (e.key === 'Escape' && modal.classList.contains('is-open')) {
//         closeModal();
//     }
// });

// // сабмит формы
// form.addEventListener('submit', e => {
//     e.preventDefault();
//     const data = Object.fromEntries(new FormData(form));

    
//     if (data.password !== data.password2) {
//         alert('Пароли не совпадают');
//         return;
//     }

//     console.log('Регистрация:', data);
//     alert(`Привет, ${data.username}! Аккаунт создан (заглушка).`);
//     form.reset();
//     closeModal();
// });


// // общие функции загр мода
// function openModal(modal) {
//     modal.classList.add('is-open');
//     modal.setAttribute('aria-hidden', 'false');
//     document.body.classList.add('modal-open');
//     const firstInput = modal.querySelector('input, select, textarea');
//     if (firstInput) setTimeout(() => firstInput.focus(), 50);
// }

// function closeModal(modal) {
//     modal.classList.remove('is-open');
//     modal.setAttribute('aria-hidden', 'true');

//     if (!document.querySelector('.modal.is-open')) {
//         document.body.classList.remove('modal-open');
//     }
// }

// function initModal(modal) {

//     modal.querySelectorAll('[data-close]').forEach(el => {
//         el.addEventListener('click', () => closeModal(modal));
//     });
// }


// const authModal = document.getElementById('authModal');
// const profileBtn = document.getElementById('profileBtn');
// const authForm = document.getElementById('authForm');

// initModal(authModal);
// profileBtn.addEventListener('click', () => openModal(authModal));

// authForm.addEventListener('submit', e => {
//     e.preventDefault();
//     const data = Object.fromEntries(new FormData(authForm));

//     if (data.password !== data.password2) {
//         alert('Пароли не совпадают');
//         return;
//     }

//     console.log('Регистрация:', data);
//     alert(`Привет, ${data.username}! Аккаунт создан (заглушка).`);
//     authForm.reset();
//     closeModal(authModal);
// });

// // окно загрузки мода
// const uploadModal = document.getElementById('uploadModal');
// const uploadBtn = document.getElementById('uploadBtn');
// const uploadForm = document.getElementById('uploadForm');

// initModal(uploadModal);
// uploadBtn.addEventListener('click', e => {
//     e.preventDefault();
//     openModal(uploadModal);
// });

// uploadForm.addEventListener('submit', e => {
//     e.preventDefault();

//     const formData = new FormData(uploadForm);
//     const data = Object.fromEntries(formData);

//     const file = formData.get('modFile');

//     if (!file || file.size === 0) {
//         alert('Прикрепи файл мода');
//         return;
//     }

//     console.log('Загрузка мода:', { ...data, modFile: file.name });

//     alert(
//         `Мод «${data.modName}» для игры "${data.game}" отправлен на проверку.\n` +
//         `Файл: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} МБ)`
//     );

//     uploadForm.reset();
//     closeModal(uploadModal);
// });

// document.addEventListener('keydown', e => {
//     if (e.key === 'Escape') {
//         document.querySelectorAll('.modal.is-open').forEach(closeModal);
//     }
// });

// --- МОДАЛЬНЫЕ ОКНА ---
const authModal = document.getElementById('authModal');
const uploadModal = document.getElementById('uploadModal');
const authBtn = document.getElementById('authBtn');
const uploadBtn = document.getElementById('uploadBtn');

function openModal(modal) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    modal.classList.remove('is-open');
    if (!document.querySelector('.modal.is-open')) {
        document.body.classList.remove('modal-open');
    }
}

// Обработчики кнопок
authBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(authModal); });
uploadBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(uploadModal); });

// Закрытие (крестик и оверлей)
document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.modal')));
});

// --- СКАЧИВАНИЕ ЛАУНЧЕРА ---
const downloadBtn = document.getElementById('downloadLauncher');
downloadBtn.addEventListener('click', () => {
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Загрузка...';
    downloadBtn.style.opacity = '0.7';
    downloadBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        // Симуляция скачивания файла
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Это тестовый файл лаунчера MODY.';
        link.download = 'ModHubLauncher.exe';
        link.click();

        downloadBtn.textContent = originalText;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.pointerEvents = 'auto';
    }, 1000);
});

// --- ОБРАБОТКА ФОРМ ---
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Профиль успешно создан! (Демо)');
    closeModal(authModal);
    e.target.reset();
});

document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Мод отправлен на модерацию! (Демо)');
    closeModal(uploadModal);
    e.target.reset();
});