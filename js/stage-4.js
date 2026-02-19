const toggleBtn = document.getElementById("toggleComments");
const commentsView = document.getElementById("commentsView");
const commentWrite = document.getElementById("commentWrite");
const socialBox = document.getElementById("socialBox");

toggleBtn.addEventListener("click", () => {
    commentsView.classList.toggle("active");
    commentWrite.classList.toggle("active");
    socialBox.classList.toggle("shift");

    const colorClosed = "#ffffff";
    const colorOpen = "#ffffff";

    const txtDiv = toggleBtn.querySelector('.txt');

    if (commentsView.classList.contains("active")) {
        txtDiv.textContent = "بستن نظرات";
        txtDiv.style.color = colorOpen;
        toggleBtn.style.backgroundColor = "#E63946";
    } else {
        txtDiv.textContent = "بازخورد و نظرات";
        txtDiv.style.color = colorClosed;
        toggleBtn.style.backgroundColor = "rgba(0, 0, 0, 0.92)";
    }
});
// درگ برای scroll
let isDown = false;
let startY;
let scrollTop;

commentsView.addEventListener('mousedown', (e) => {
    isDown = true;
    startY = e.pageY - commentsView.offsetTop;
    scrollTop = commentsView.scrollTop;
    commentsView.style.cursor = 'grabbing';
});

commentsView.addEventListener('mouseleave', () => {
    isDown = false;
    commentsView.style.cursor = 'default';
});

commentsView.addEventListener('mouseup', () => {
    isDown = false;
    commentsView.style.cursor = 'default';
});

commentsView.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.pageY - commentsView.offsetTop;
    const walk = (y - startY) * 1; // سرعت scroll، 1 برای طبیعی
    commentsView.scrollTop = scrollTop - walk;
});

// touch devices
let startTouchY;
let startScrollTop;
commentsView.addEventListener('touchstart', (e) => {
    startTouchY = e.touches[0].pageY;
    startScrollTop = commentsView.scrollTop;
});

commentsView.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    const walk = (y - startTouchY);
    commentsView.scrollTop = startScrollTop - walk;
});
