// <!-- stage-2/messages-Effect -->
let demoStarted = false;
let lastX = 0;
let lastY = 0;
let velocityX = 0;
let velocityY = 0;

function isMobile() {
    return window.innerWidth < 768;
}


// ---------- اجرا فقط یک بار ----------
function startDemo() {
    const messages = [
        "من سینا فیروزیان هستم !",
        `کسی که از ساختن، فکر کردن و تبدیل ایده به نتیجه لذت می‌برد.`,
        "چیزی که برای من جذابه، روند خلق یک محصول از صفره!!",
        "به کارهایی علاقه دارم که ذهن را درگیر می‌کنند",
        "کارهایی که با تمرکز، دقت و کمی وسواس می‌شود آن‌ها را بهتر و بهتر کرد",
        "متولد ۱۶ دی ۱۳۸۵ و زاده‌ی بهشهر هستم",
        "مسیرم را با یادگیری مداوم و تجربه جلو می‌برم و سعی می‌کنم در هر پروژه، کیفیت و تمیزی اجرا را در اولویت قرار بدهم"
    ];

    const create = isMobile() ? createMessageMobile : createMessage;
    let delay = 0;

    messages.forEach((msg, i) => {
        setTimeout(() => requestAnimationFrame(() => create(msg)), 1500 + i * 2000);
    });
}




function isOverlapping(x, y, w, h, elements) {
    return elements.some(el => {
        const ex = el.offsetLeft;
        const ey = el.offsetTop;
        const ew = el.offsetWidth;
        const eh = el.offsetHeight;

        return !(
            x + w <= ex ||
            x >= ex + ew ||
            y + h <= ey ||
            y >= ey + eh
        );
    });
}



// ---------- ایجاد پیام ----------
function createMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'draggable';
    msg.style.position = 'absolute';
    msg.style.opacity = '0';
    msg.style.transition = 'opacity 1s ease';

    const textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.textContent = text;
    msg.appendChild(textEl);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    meta.innerHTML = `<span class="time">${hours}:${minutes}</span><span class="ticks sent">✔✔</span>`;
    msg.appendChild(meta);

    chatBody.appendChild(msg); // اضافه کردن قبل از گرفتن اندازه

    const area = chatBody.getBoundingClientRect();
    const SAFE = { left: 10, right: 10, top: 25, bottom: 25 };
    const maxX = area.width - msg.offsetWidth - SAFE.right;
    const maxY = area.height - msg.offsetHeight - SAFE.bottom;
    const minX = SAFE.left;
    const minY = SAFE.top;

    const existingMessages = [...chatBody.querySelectorAll('.draggable')].filter(m => m !== msg);

    let x, y, attempts = 0;
    const MAX_ATTEMPTS = 100;

    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        attempts++;
    } while (isOverlapping(x, y, msg.offsetWidth, msg.offsetHeight, existingMessages) && attempts < MAX_ATTEMPTS);

    msg.style.left = x + 'px';
    msg.style.top = y + 'px';

    setTimeout(() => {
        msg.style.opacity = '1';
        const ticks = msg.querySelector('.ticks');
        setTimeout(() => ticks.className = 'ticks delivered', 500);
        setTimeout(() => ticks.className = 'ticks seen', 1200);
    }, 50);

    enableDrag(msg);
}

function createMessageMobile(text) {
    const msg = document.createElement('div');
    msg.className = 'draggable mobile-message';
    msg.style.opacity = '0';
    msg.style.transition = 'opacity 0.8s ease';

    const textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.textContent = text;
    msg.appendChild(textEl);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    meta.innerHTML = `<span class="time">${hours}:${minutes}</span><span class="ticks sent">✔✔</span>`;
    msg.appendChild(meta);

    chatBody.appendChild(msg);

    setTimeout(() => {
        msg.style.opacity = '1';
        const ticks = msg.querySelector('.ticks');
        setTimeout(() => ticks.className = 'ticks delivered', 500);
        setTimeout(() => ticks.className = 'ticks seen', 1200);
    }, 50);

}


// ---------- drag موس ----------
let activeDragEl = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let topZIndex = 1;

function enableDrag(el) {
    el.addEventListener('mousedown', e => {
        activeDragEl = el;
        dragOffsetX = e.clientX - el.offsetLeft;
        dragOffsetY = e.clientY - el.offsetTop;
        lastX = e.clientX;
        lastY = e.clientY;
        velocityX = 0;
        velocityY = 0;
        el.style.cursor = 'grabbing';

        topZIndex++;
        el.style.zIndex = topZIndex;

        e.preventDefault();
    });
}

window.addEventListener('mousemove', e => {
    if (!activeDragEl) return;

    // محاسبه‌ی velocity درست
    velocityX = e.clientX - lastX;
    velocityY = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;

    activeDragEl.style.left = (e.clientX - dragOffsetX) + 'px';
    activeDragEl.style.top = (e.clientY - dragOffsetY) + 'px';
});

window.addEventListener('mouseup', e => {
    if (!activeDragEl) return;


    activeDragEl.style.cursor = 'grab';
    activeDragEl = null;
});