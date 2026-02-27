// Ensure custom fullpage loading-box exists so our loader CSS always applies
;(function ensureCustomLoadingBox(){
    const existing = document.getElementById('loading-box')
    const spinnerHTML = `
        <div id="loading-box" class="show">
            <div class="spinner-box">
                <div class="blue-orbit leo"></div>
                <div class="green-orbit leo"></div>
                <div class="red-orbit leo"></div>
                <div class="white-orbit w1 leo"></div>
                <div class="white-orbit w2 leo"></div>
                <div class="white-orbit w3 leo"></div>
            </div>
        </div>`

    try {
        // If already present, replace outerHTML to ensure our structure and add `show`
        if (existing) {
            existing.outerHTML = spinnerHTML
            // ensure visible
            const newBox = document.getElementById('loading-box')
            if (newBox) newBox.classList.add('show')
            return
        }

        // Insert early in the document so CSS applies and theme scripts can find it
        const insert = () => {
            if (document.body) {
                document.body.insertAdjacentHTML('afterbegin', spinnerHTML)
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.insertAdjacentHTML('afterbegin', spinnerHTML)
                })
            }
        }

        insert()
    } catch (e) {
        console.error('inject loading-box failed', e)
    }
})()

// 霓虹灯效果

// 应用霓虹灯效果
function applyNeonEffect() {
    const elements = [
        document.getElementById("site-name"),
        document.getElementById("site-title"),
        document.getElementById("site-subtitle"),
        document.getElementById("post-info"),
        ...document.getElementsByClassName("author-info__name"),
        ...document.getElementsByClassName("author-info__description")
    ];

    elements.forEach(element => {
        if (element) {
            element.style.outline = 'none';
            element.style.setProperty('--c', 'lightseagreen');
            element.style.textShadow = `
                0 0 10px var(--c),
                0 0 20px var(--c),
                0 0 40px var(--c),
                0 0 80px var(--c),
                0 0 160px var(--c)
            `;
            element.style.animation = 'animate 5s linear infinite';
        }
    });
}

// 添加CSS动画
const style = document.createElement('style');
style.innerHTML = `
    @keyframes animate {
        to {
            filter: hue-rotate(360deg);
        }
    }
    .navbar-title {
        outline: none;
        --c: lightseagreen;
        text-shadow: 0 0 10px var(--c), 0 0 20px var(--c), 0 0 40px var(--c), 0 0 80px var(--c), 0 0 160px var(--c);
        animation: animate 5s linear infinite;
    }
`;
document.head.appendChild(style);

// 确保在DOM完全加载后执行，并兼容 PJAX 重载
(() => {
    const syncHeaderLinks = () => {
        const article = document.getElementById('article-container');
        if (!article) return;

        const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const id = heading.id;
            const headerLink = heading.querySelector('.headerlink');
            if (!headerLink || !id) return;
            const href = `#${encodeURI(id)}`;
            headerLink.setAttribute('href', href);
            headerLink.setAttribute('aria-label', heading.textContent.trim());
        });
    };

    const init = () => {
        applyNeonEffect();
        // 设置定时器，每隔1秒应用一次霓虹灯效果
        setInterval(applyNeonEffect, 1000);
        syncHeaderLinks();
    };

    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('pjax:complete', () => {
        syncHeaderLinks();
    });
})();