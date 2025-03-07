# 📊 CRM-Система "Skillbox Clients"  
**Учебный проект для управления контактами клиентов** | [Скачать ТЗ](Практикум.%20ТЗ.pdf)

---

## 🎯 Основная цель  
Реализация веб-интерфейса CRM-системы с базовым функционалом:  
- Просмотр списка клиентов
- Добавление/редактирование/удаление клиентов
- Поиск и сортировка данных
- Управление контактами клиентов

---

## ✅ Реализованные требования ТЗ  
| Функционал            | Реализация                                                                 |
|-----------------------|----------------------------------------------------------------------------|
| Работа с API          | Fetch-запросы с обработкой ошибок                                          |
| Валидация форм        | Проверка обязательных полей и формата контактов                            |
| Сортировка таблицы    | Клиентская сортировка по всем колонкам                                     |
| Дебаунс для поиска    | Задержка 300мс перед отправкой запроса                                     |
| Модальные окна        | Хэш-роутинг для прямых ссылок                                              |
| Визуальные подсказки  | Тултипы для контактов и спиннеры загрузки                                  |

---

## 🛠 Стек технологий  
- **Frontend**: Vanilla JS (ES6+), HTML5, CSS3  
- **Инструменты**: Figma (дизайн), Webpack (сборка)  
- **API**: Работа с готовым backend-сервером через REST  
- **Дополнительно**:  
  - Обработка hash-изменений (`window.onhashchange`)  
  - Динамическая генерация DOM-элементов  
  - Полная анимация состояний (загрузка, ошибки, успех)

---

## 🚀 Запуск проекта  
1. **Клонирование**:  
   ```bash
   git clone https://github.com/danon47/CRM.git

2. **Запуск сервера**:  
   ```bash
   cd crm-backend
   npm install
   npm run dev

3. **Запуск CRM**:  
   ```bash
   cd ../crm-frontend
   npm install
   npm run dev
