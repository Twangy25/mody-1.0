// ==========================================
// ЛОГИКА
// ==========================================
const authModal = document.getElementById('authModal');
const uploadModal = document.getElementById('uploadModal');
const authBtn = document.getElementById('authBtn');
const uploadBtn = document.getElementById('uploadBtn');

// Функции открытия/закрытия
function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    // Убираем блокировку скролла, только если нет других открытых окон
    if (!document.querySelector('.modal.is-open')) {
        document.body.classList.remove('modal-open');
    }
}

// Обработчики кнопок
authBtn.addEventListener('click', () => openModal(authModal));
uploadBtn.addEventListener('click', () => openModal(uploadModal));

// Закрытие по крестику, оверлею и кнопке "Отмена"
document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal);
    });
});

// Переключение Вход / Регистрация
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const registerView = document.getElementById('registerView');
const loginView = document.getElementById('loginView');

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerView.classList.add('hidden');
    loginView.classList.remove('hidden');
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
});

// Глазок для пароля
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            btn.style.color = 'var(--accent)';
        } else {
            input.type = 'password';
            btn.style.color = 'var(--text-muted)';
        }
    });
});

// Обработка отправки форм (заглушки)
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Профиль создан! (Демо)');
    closeModal(authModal);
    e.target.reset();
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Успешный вход! (Демо)');
    closeModal(authModal);
    e.target.reset();
    // Возвращаем окно в состояние регистрации для следующего раза
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
});

document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Мод отправлен на модерацию! (Демо)');
    closeModal(uploadModal);
    e.target.reset();
});

// ==========================================
// DRAG AND DROP ДЛЯ ЗАГРУЗКИ МОДА
// ==========================================
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('modFileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');

if (dropzone && fileInput) {
    // Предотвращаем стандартное поведение браузера
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Подсветка зоны при наведении файла
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('is-dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('is-dragover'), false);
    });

    // Обработка броска файла (Drop)
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            // Подставляем файл в скрытый input
            fileInput.files = files;
            handleFileSelected(files[0]);
        }
    }, false);

    // Обработка обычного клика по зоне (выбор через проводник)
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFileSelected(this.files[0]);
        }
    });

    // Функция обновления интерфейса
    function handleFileSelected(file) {
        // Ограничение на размер (2 ГБ = 2 * 1024 * 1024 * 1024 байт)
        const maxSize = 2 * 1024 * 1024 * 1024;
        
        if (file.size > maxSize) {
            alert('Файл слишком большой! Максимум 2 ГБ.');
            fileInput.value = ''; // Очищаем инпут
            fileNameDisplay.textContent = 'ZIP, RAR или 7Z – до 2 ГБ';
            return;
        }

        // Выводим имя файла и его размер в МБ
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
        fileNameDisplay.textContent = `${file.name} (${sizeInMB} МБ)`;
        fileNameDisplay.style.color = 'var(--accent)';
        
        // Можно скрыть иконку, чтобы было аккуратнее
        const icon = dropzone.querySelector('.dropzone-icon');
        if (icon) icon.style.display = 'none';
    }
}

// ==========================================
// ЛОГИКА ЗАГРУЗКИ И СОХРАНЕНИЯ МОДОВ
// ==========================================

// Функция для создания HTML-карточки мода
// Функция создания карточки
function createModCard(mod) {
    const gradients = {
        'Cyberpunk 2077': 'linear-gradient(135deg, #0e3a47, #07151a)',
        'The Elder Scrolls V: Skyrim': 'linear-gradient(135deg, #064e3b, #022c22)',
        'Minecraft': 'linear-gradient(135deg, #4c1d95, #2e1065)',
        'S.T.A.L.K.E.R. 2': 'linear-gradient(135deg, #450a0a, #1a0505)',
        'The Witcher 3': 'linear-gradient(135deg, #1e3a8a, #172554)',
        "Baldur's Gate 3": 'linear-gradient(135deg, #854d0e, #422006)'
    };
    const bg = gradients[mod.game] || 'linear-gradient(135deg, #1e293b, #0f172a)';

    // Если данных нет, ставим заглушки
    const game = mod.game || 'Неизвестная игра';
    const category = mod.category || 'Разное';
    const title = mod.title || 'Без названия';
    const desc = mod.description || 'Описание отсутствует.';

    return `
        <article class="mod-card" data-id="${mod.id}" style="cursor: pointer;">
            <div class="mod-card__img" style="background: ${bg};">
                <span class="badge badge--accent">НОВИНКА</span>
                <button class="bookmark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
            </div>
            <div class="mod-card__content">
                <div class="mod-card__top">
                    <span class="game">${game}</span>
                    <span class="category">${category}</span>
                </div>
                <h3>${title}</h3>
                <p>${desc}</p>
                <div class="mod-card__footer">
                    <span class="author">${mod.author || 'Вы'}</span>
                    <div class="stats"><span>↓ 0</span><span>★ 0.0</span></div>
                </div>
            </div>
        </article>
    `;
}

// Обработка формы
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Внимание: Проверь, чтобы эти id были в HTML!
    const newMod = {
        id: Date.now().toString(), // Уникальный ID
        game: document.getElementById('modGame').value,
        title: document.getElementById('modTitle').value,
        description: document.getElementById('modDesc').value,
        category: document.getElementById('modCategory').value,
        version: document.getElementById('modVersion').value,
        author: 'Вы'
    };

    const savedMods = JSON.parse(localStorage.getItem('mody_database')) || [];
    savedMods.push(newMod);
    localStorage.setItem('mody_database', JSON.stringify(savedMods));

    const grid = document.querySelector('.mods-grid');
    grid.insertAdjacentHTML('afterbegin', createModCard(newMod));

    // Очистка формы
    e.target.reset();
    document.getElementById('fileNameDisplay').textContent = 'ZIP, RAR или 7Z – до 2 ГБ';
    document.getElementById('fileNameDisplay').style.color = '';
    document.querySelector('#dropzone .dropzone-icon').style.display = 'block';

    closeModal(uploadModal);
    document.querySelector('.mods-section').scrollIntoView({ behavior: 'smooth' });
});

// Загрузка сохраненных модов при старте страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedMods = JSON.parse(localStorage.getItem('mody_database')) || [];
    const grid = document.querySelector('.mods-grid');
    
    // Вставляем сохраненные моды в начало сетки (чтобы новые были сверху)
    savedMods.reverse().forEach(mod => {
        grid.insertAdjacentHTML('afterbegin', createModCard(mod));
    });
});

// Обработка отправки формы
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Собираем данные из формы
    const newMod = {
        id: Date.now(),
        game: document.getElementById('modGame').value,
        title: document.getElementById('modTitle').value,
        description: document.getElementById('modDesc').value,
        category: document.getElementById('modCategory').value,
        version: document.getElementById('modVersion').value,
        author: 'Вы' // Или можно брать имя авторизованного пользователя
    };

    // 1. Сохраняем в "Базу Данных" (LocalStorage)
    const savedMods = JSON.parse(localStorage.getItem('mody_database')) || [];
    savedMods.push(newMod);
    localStorage.setItem('mody_database', JSON.stringify(savedMods));

    // 2. Добавляем карточку на страницу (в начало сетки)
    const grid = document.querySelector('.mods-grid');
    grid.insertAdjacentHTML('afterbegin', createModCard(newMod));

    // 3. Очищаем форму и закрываем окно
    e.target.reset();
    
    // Сброс визуала Drag-and-Drop зоны
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    fileNameDisplay.textContent = 'ZIP, RAR или 7Z – до 2 ГБ';
    fileNameDisplay.style.color = '';
    const icon = document.querySelector('#dropzone .dropzone-icon');
    if (icon) icon.style.display = 'block';

    closeModal(uploadModal);
    
    // Небольшой скролл к каталогу, чтобы пользователь увидел свой мод
    document.querySelector('.mods-section').scrollIntoView({ behavior: 'smooth' });
});

// ==========================================
// ОТКРЫТИЕ ДЕТАЛЬНОЙ СТРАНИЦЫ МОДА
// ==========================================
const modDetailModal = document.getElementById('modDetailModal');
const modsGrid = document.querySelector('.mods-grid');

// Делегирование событий: ловим клик по любой карточке в сетке
modsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.mod-card');
    if (!card) return;

    // Получаем ID мода из атрибута data-id (у новых карточек он есть)
    const modId = card.dataset.id;
    
    // Пытаемся найти мод в LocalStorage
    let modData = null;
    if (modId) {
        const savedMods = JSON.parse(localStorage.getItem('mody_database')) || [];
        modData = savedMods.find(m => m.id === modId);
    }

    // Если мод не найден в БД (например, это старая захардкоженная карточка),
    // берем данные прямо из HTML карточки.
    if (!modData) {
        modData = {
            title: card.querySelector('h3').textContent,
            desc: card.querySelector('p').textContent,
            game: card.querySelector('.game')?.textContent || 'Игра',
            category: card.querySelector('.category')?.textContent || 'Категория',
            author: card.querySelector('.author')?.textContent || 'Автор',
            version: '1.0.0'
        };
    }

    // Заполняем модальное окно
    document.getElementById('detailTitle').textContent = modData.title;
    document.getElementById('detailBreadcrumbTitle').textContent = modData.title;
    document.getElementById('detailDesc').textContent = modData.desc;
    document.getElementById('detailGame').textContent = modData.game;
    document.getElementById('detailCategory').textContent = modData.category;
    document.getElementById('detailAuthor').textContent = modData.author;
    document.getElementById('detailVersion').textContent = modData.version;
    document.getElementById('widgetGame').textContent = modData.game;
    document.getElementById('widgetAuthor').textContent = modData.author;

    // Открываем модалку
    openModal(modDetailModal);
});