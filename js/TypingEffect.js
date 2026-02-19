// <!-- #typing Effect/stage-1 -->
const texts = [
    "من برنامه نویس وب هستم",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 100;
const deleteSpeed = 50;
const delayBetweenTexts = 1500;

function typeEffect() {
    const element = document.getElementById("typing-text");
    const currentText = texts[textIndex];

    if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex--);
    } else {
        element.textContent = currentText.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, delayBetweenTexts);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(typeEffect, isDeleting ? deleteSpeed : speed);
}

typeEffect();