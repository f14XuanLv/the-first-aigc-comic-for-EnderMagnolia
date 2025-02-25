// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    let currentPage = 0;
    const totalPages = pages.length;
    
    // 创建页面指示器点
    function createPageDots() {
        pageIndicator.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('page-dot');
            dot.setAttribute('data-page', i);
            if (i === currentPage) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', function() {
                const pageIndex = parseInt(this.getAttribute('data-page'));
                goToPage(pageIndex);
            });
            pageIndicator.appendChild(dot);
        }
    }
    
    // 创建粒子效果
    function createParticles() {
        const particleContainers = document.querySelectorAll('.particles');
        
        particleContainers.forEach(container => {
            // 清空现有粒子
            container.innerHTML = '';
            
            // 生成新粒子
            const particleCount = Math.floor(Math.random() * 8) + 12; // 12-20粒子
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // 随机尺寸
                const size = Math.random() * 2.5 + 0.8;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // 随机位置
                const posX = Math.random() * 100;
                particle.style.left = `${posX}%`;
                particle.style.bottom = `-10px`;
                
                // 随机动画延迟
                const delay = Math.random() * 15;
                particle.style.animationDelay = `${delay}s`;
                
                // 随机动画持续时间
                const duration = Math.random() * 8 + 12;
                
                // 设置终点X坐标偏移
                const endX = (Math.random() - 0.5) * 150;
                
                // 创建并应用自定义动画
                const keyframesName = `float-${Date.now()}-${i}`;
                const keyframes = `
                    @keyframes ${keyframesName} {
                        0% { transform: translateY(0) translateX(0); opacity: 0; }
                        10% { opacity: 0.8; }
                        90% { opacity: 0.8; }
                        100% { transform: translateY(-100vh) translateX(${endX}px); opacity: 0; }
                    }
                `;
                
                const styleSheet = document.createElement('style');
                styleSheet.innerHTML = keyframes;
                document.head.appendChild(styleSheet);
                
                particle.style.animation = `${keyframesName} ${duration}s infinite linear`;
                
                // 添加到容器
                container.appendChild(particle);
            }
        });
    }
    
    // 更新页面状态
    function updatePageStatus() {
        // 更新按钮状态
        prevBtn.classList.toggle('disabled', currentPage === 0);
        nextBtn.classList.toggle('disabled', currentPage === totalPages - 1);
        
        // 更新页面类
        pages.forEach((page, index) => {
            page.classList.remove('active', 'prev');
            if (index === currentPage) {
                page.classList.add('active');
            } else if (index === currentPage - 1) {
                page.classList.add('prev');
            }
        });
        
        // 更新指示器
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        
        // 当到达新页面时重新生成粒子
        if (pages[currentPage].querySelector('.particles')) {
            createParticles();
        }
    }
    
    // 下一页
    function goToNextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePageStatus();
        }
    }
    
    // 上一页
    function goToPrevPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePageStatus();
        }
    }
    
    // 跳转到指定页
    function goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            currentPage = pageIndex;
            updatePageStatus();
        }
    }
    
    // 按钮事件监听
    nextBtn.addEventListener('click', goToNextPage);
    prevBtn.addEventListener('click', goToPrevPage);
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goToNextPage();
        } else if (e.key === 'ArrowLeft') {
            goToPrevPage();
        }
    });
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 40;
        if (touchEndX < touchStartX - swipeThreshold) {
            // 左滑
            goToNextPage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // 右滑
            goToPrevPage();
        }
    }
    
    // 防止iOS中的滚动问题
    document.addEventListener('touchmove', function(e) {
        const target = e.target;
        const isPageContent = target.closest('.page-content');
        
        if (!isPageContent) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 点击封面开始故事
    document.querySelector('.cover-page').addEventListener('click', function() {
        goToNextPage();
    });
    
    // 初始化页面指示器
    createPageDots();
    
    // 初始化页面状态
    updatePageStatus();
    
    // 初始化粒子
    createParticles();
    
    // 为动画效果设置随机间隔刷新粒子
    setInterval(createParticles, 20000);
    
    // 适配移动设备高度
    function setMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // 初始设置和窗口大小变化时重设
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);
});