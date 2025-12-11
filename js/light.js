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