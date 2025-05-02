// Elementos del DOM
const yearsCounter = document.getElementById('yearsCounter');
const monthsCounter = document.getElementById('monthsCounter');
const weeksCounter = document.getElementById('weeksCounter');
const daysCounter = document.getElementById('daysCounter');
const anniversaryMessage = document.getElementById('anniversaryMessage');
const saveMessageBtn = document.getElementById('saveMessageBtn');
const notificationBtn = document.getElementById('notificationBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const nextNotificationDate = document.getElementById('nextNotificationDate');
const anniversaryModal = document.getElementById('anniversaryModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const yearBadge = document.getElementById('yearBadge');

// Fecha de inicio - 14 de abril
const startDate = new Date();
startDate.setMonth(3); // Abril (0-11)
startDate.setDate(14);
startDate.setHours(0, 0, 0, 0);

// Cargar mensaje guardado
function loadSavedMessage() {
const savedMessage = localStorage.getItem('anniversaryMessage');
if (savedMessage) {
anniversaryMessage.value = savedMessage;
}
}

// Calcular tiempo transcurrido
function calculateTime() {
const now = new Date();
const diffTime = Math.abs(now - startDate);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

// Calcular años, meses, semanas y días restantes
const years = Math.floor(diffDays / 365);
const remainingDaysAfterYears = diffDays % 365;

// Meses aproximados (no exactos para simplificar)
const monthsTotal = Math.floor(diffDays / 30.44);
const months = monthsTotal % 12;

// Semanas y días (0-6)
const weeksTotal = Math.floor(diffDays / 7);
const weeks = weeksTotal % 52; // Mostrar semanas dentro del año actual
const days = diffDays % 7; // Días adicionales (0-6)

return {
years: years,
months: months,
weeks: weeks,
days: days,
totalMonths: monthsTotal,
totalDays: diffDays
};
}

// Actualizar contadores
function updateCounters() {
const time = calculateTime();

// Actualizar displays
yearsCounter.textContent = time.years;
monthsCounter.textContent = time.months;
weeksCounter.textContent = time.weeks;
daysCounter.textContent = time.days;

// Resaltar años completos
if (time.years > 0) {
yearsCounter.classList.add('special');
yearBadge.style.display = 'block';
} else {
yearsCounter.classList.remove('special');
yearBadge.style.display = 'none';
}

// Verificar si hoy es aniversario (mes o año)
const today = new Date();
const isAnniversaryDay = today.getDate() === 14;
const isMonthAnniversary = isAnniversaryDay && time.totalMonths > 0;
const isYearAnniversary = isAnniversaryDay && time.totalDays % 365 === 0 && time.totalDays > 0;

if (isMonthAnniversary || isYearAnniversary) {
showAnniversaryModal(isYearAnniversary, time.years);
}

// Calcular próxima fecha de notificación
updateNextNotificationDate();
}

// Mostrar modal de aniversario
function showAnniversaryModal(isYearAnniversary, years) {
// Verificar si ya mostramos el modal hoy
const lastShown = localStorage.getItem('lastAnniversaryShown');
const today = new Date().toDateString();

if (lastShown === today) return;

// Configurar el modal según el tipo de aniversario
let title, message;

if (isYearAnniversary) {
title = `¡Feliz ${years} Aniversario!`;
message = anniversaryMessage.value || `¡${years} año${years > 1 ? 's' : ''} juntos! Mi amor por ti crece cada día más. ❤`;

// Efecto especial para aniversario
yearsCounter.classList.add('special');
createConfetti(true);
} else {
const time = calculateTime();
title = `¡Feliz Mesiversario! (${time.totalMonths} meses)`;
message = anniversaryMessage.value || '¡Otro mes más juntos! Cada día te amo más. ❤';
createConfetti(false);
}

modalTitle.textContent = title;
modalMessage.textContent = message;
anniversaryModal.style.display = 'flex';

// Guardar que ya mostramos el modal hoy
localStorage.setItem('lastAnniversaryShown', today);

// Mostrar notificación si está permitido
if (Notification.permission === 'granted') {
showNotification(title, message);
}
}

// Crear efecto de confeti
function createConfetti(isGolden) {
const modal = document.querySelector('.modal-content');
const colors = isGolden ?
['#ffd700', '#ffecb3', '#fff9c4', '#ffc107', '#ffeb3b'] :
['#ff4d6d', '#ff8fa3', '#ffb3c1', '#c9184a', '#ff758f'];

for (let i = 0; i < 50; i++) {
const confetti = document.createElement('div');
confetti.className = 'confetti ' + (isGolden ? 'gold-confetti' : '');
confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
confetti.style.left = Math.random() * 100 + '%';
confetti.style.top = -10 + 'px';
confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

modal.appendChild(confetti);

setTimeout(() => {
confetti.style.opacity = 1;
confetti.style.top = Math.random() * 100 + '%';
confetti.style.left = Math.random() * 100 + '%';
}, 10);

setTimeout(() => {
confetti.remove();
}, 3000);
}
}

// Mostrar notificación
function showNotification(title, body) {
if (!('Notification' in window)) return;

if (Notification.permission === 'granted') {
new Notification(title, {
body: body,
icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff4d6d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
});
}
}

// Actualizar estado de notificaciones
function updateNotificationStatus() {
if (!('Notification' in window)) {
statusText.textContent = 'No soportado en este navegador';
notificationBtn.style.display = 'none';
return;
}

if (Notification.permission === 'granted') {
statusIndicator.classList.add('active');
statusText.textContent = 'Notificaciones activadas';
notificationBtn.textContent = 'Desactivar';
notificationBtn.onclick = disableNotifications;
} else {
statusIndicator.classList.remove('active');
statusText.textContent = 'Notificaciones desactivadas';
notificationBtn.textContent = 'Activar';
notificationBtn.onclick = enableNotifications;
}
}

// Activar notificaciones
function enableNotifications() {
Notification.requestPermission().then(permission => {
updateNotificationStatus();
if (permission === 'granted') {
showNotification('Notificaciones activadas', 'Recibirás una notificación cada mes el día 14.');
}
});
}

// Desactivar notificaciones
function disableNotifications() {
statusIndicator.classList.remove('active');
statusText.textContent = 'Notificaciones desactivadas';
notificationBtn.textContent = 'Activar';
notificationBtn.onclick = enableNotifications;
}

// Actualizar próxima fecha de notificación
function updateNextNotificationDate() {
const today = new Date();
let nextDate = new Date(today.getFullYear(), today.getMonth(), 14);

if (today.getDate() >= 14) {
nextDate.setMonth(nextDate.getMonth() + 1);
}

const options = { day: 'numeric', month: 'long' };
nextNotificationDate.textContent = nextDate.toLocaleDateString('es-ES', options);
}

// Event listeners
saveMessageBtn.addEventListener('click', () => {
localStorage.setItem('anniversaryMessage', anniversaryMessage.value);
showNotification('Mensaje guardado', 'Tu mensaje especial se mostrará cada mes.');
});

closeModal.addEventListener('click', () => {
anniversaryModal.style.display = 'none';
});

closeModalBtn.addEventListener('click', () => {
anniversaryModal.style.display = 'none';
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
loadSavedMessage();
updateCounters();
updateNotificationStatus();

// Verificar si hoy es 14 al cargar la página
const today = new Date();
if (today.getDate() === 14) {
const time = calculateTime();
const isYearAnniversary = time.totalDays % 365 === 0 && time.totalDays > 0;
setTimeout(() => showAnniversaryModal(isYearAnniversary, time.years), 2000);
}

// Actualizar contador diariamente
setInterval(updateCounters, 86400000);
});
// Función para formatear la próxima fecha de aniversario
function getNextAnniversaryDate() {
    const today = new Date();
    let nextMonth;
    
    // Si ya pasó el 14 de este mes
    if (today.getDate() >= 14) {
    nextMonth = today.getMonth() + 1; // Siguiente mes
    } else {
    nextMonth = today.getMonth(); // Este mes
    }
    
    const nextDate = new Date(today.getFullYear(), nextMonth, 14);
    
    // Formatear a "14 de [mes]" en español
    const options = { month: 'long' };
    const monthName = nextDate.toLocaleDateString('es-ES', options);
    return `14 de ${monthName}`;
    }
    
    // Actualizar el elemento HTML
    document.getElementById('nextNotificationDate').textContent = getNextAnniversaryDate();