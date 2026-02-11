let skillTimeouts = [];
let demoStage2Started = false;
let isTransitioning = false;
let current = 0;
let pendingIndex = null;

const stages = [...document.querySelectorAll('.stage')];
const radios = [...document.querySelectorAll('.switcher__input')];

function showStage(index) {
    if (isTransitioning) {
        pendingIndex = index;
        return;
    }

    isTransitioning = true;

    // cleanup Stage قبلی
    cleanupStage(current);

    stages.forEach((stage, i) => {
        if (i === index) {
            stage.classList.add('active');
            initStage(i);
        } else {
            stage.classList.remove('active');
        }
    });

    if (radios[index]) radios[index].checked = true;

    setTimeout(() => {
        isTransitioning = false;

        if (pendingIndex !== null && pendingIndex !== current) {
            const next = pendingIndex;
            pendingIndex = null;
            current = next;
            showStage(current);
        }
    }, 600);

    current = index;
}

function initStage(i) {
    if (i === 1 && !demoStage2Started) {
        demoStage2Started = true;
        startDemo();
        playBgVideo();
    }

    if (i === 2) {
        const stage = stages[i];
        animateSkills(stage);
    }
}

function cleanupStage(i) {
    const stage = stages[i];
    if (!stage) return;

    // لغو تمام timeoutهای مهارت‌ها
    skillTimeouts.forEach(t => clearTimeout(t));
    skillTimeouts = [];

    const skills = stage.querySelectorAll('.skill');
    skills.forEach(skill => {
        const box = skill.querySelector('.skill-box');
        const fill = skill.querySelector('.fill');

        box.style.transform = 'translateX(-120px)';
        box.style.opacity = '0';
        box.style.width = '70px';
        fill.style.width = '0';
    });
}

function animateSkills(container) {
    const skills = container.querySelectorAll('.skill');

    skills.forEach((skill, index) => {
        const box = skill.querySelector('.skill-box');
        const fill = skill.querySelector('.fill');
        const percent = skill.dataset.percent;

        skillTimeouts.push(setTimeout(() => {
            box.style.transform = 'translateX(0)';
            box.style.opacity = '1';
        }, index * 350));

        skillTimeouts.push(setTimeout(() => {
            box.style.width = '100%';
        }, skills.length * 350 + index * 250));

        skillTimeouts.push(setTimeout(() => {
            fill.style.width = percent + '%';
        }, skills.length * 350 + index * 250 + 600));
    });
}

function playBgVideo() {
    const video = document.querySelector('.bg-video');
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Video play failed:', error);
        });
    }
}

/* ---------- radio navigation ---------- */
radios.forEach(radio => {
    radio.addEventListener('change', function () {
        const target = +this.getAttribute('c-option') - 1;
        showStage(target);
    });
});



/* ---------- mouse wheel ---------- */
window.addEventListener('wheel', e => {
    const dir = Math.sign(e.deltaY);

    // اگر در آخرین استیج هستیم
    if (current === stages.length - 1) {
        const lastStage = stages[current];
        const atTop = lastStage.scrollTop === 0;

        if (dir > 0) {
            // اسکرول به پایین => مرورگر آزاد
            return;
        } else if (dir < 0 && atTop) {
            // اسکرول به بالا و در بالای استیج آخر => برو استیج قبلی
            e.preventDefault();
            if (!isTransitioning && current > 0) {
                showStage(current - 1);
            }
            return;
        } else {
            // در غیر این صورت => مرورگر آزاد
            return;
        }
    }

    // اگر در استیج‌های قبل هستیم
    e.preventDefault();
    if (isTransitioning) return;
    if (dir === 0) return;

    const next = current + dir;
    if (next < 0 || next >= stages.length) return;

    showStage(next);
}, { passive: false });


/* ---------- touch ---------- */
/*        let startY = 0;
        window.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        });
        window.addEventListener('touchend', e => {
            if (isTransitioning) return;
 
            const delta = startY - e.changedTouches[0].clientY;
            if (Math.abs(delta) < 50) return;
 
            const dir = delta > 0 ? 1 : -1;
            const next = current + dir;
            if (next < 0 || next >= stages.length) return;
 
            showStage(next);
        });
*/
// شروع اولیه
showStage(current);
