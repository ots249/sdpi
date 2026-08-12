/* =========================================
   SDPI Widget System v2.0
   Enhanced & Optimized
   ========================================= */

(function () {
    "use strict";

    /* ---------- Configuration ---------- */
    const CONFIG = {
        scrollProgressHeight: '3px',
        scrollProgressColor: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
        toastDuration: 2800,
        backToTopThreshold: 400,
        clockUpdateInterval: 1000,
        darkModeClass: 'sdpi-dark'
    };

    /* ---------- Utility Functions ---------- */
    const utils = {
        debounce(fn, delay = 100) {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        throttle(fn, limit = 100) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        getScrollPercent() {
            const scrollTop = window.scrollY;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            return height > 0 ? (scrollTop / height) * 100 : 0;
        },

        formatTime(date) {
            return {
                time: date.toLocaleTimeString('en-BD', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                date: date.toLocaleDateString('en-BD', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            };
        }
    };

    /* ---------- Inject CSS ---------- */
    const style = document.createElement('style');
    style.textContent = `
        /* Scroll Progress */
        #sdpi-scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: ${CONFIG.scrollProgressHeight};
            background: ${CONFIG.scrollProgressColor};
            z-index: 99999;
            transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
        }

        /* Floating Buttons */
        .sdpi-widget-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }

        .sdpi-widget-btn {
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background: #ffffff;
            color: #1f2937;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            touch-action: manipulation;
        }

        .sdpi-widget-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .sdpi-widget-btn:active {
            transform: scale(0.95);
        }

        .sdpi-widget-btn .tooltip {
            position: absolute;
            right: calc(100% + 12px);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            backdrop-filter: blur(4px);
        }

        .sdpi-widget-btn:hover .tooltip {
            opacity: 1;
        }

        /* Clock */
        #sdpi-clock {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9997;
            background: rgba(255, 255, 255, 0.92);
            color: #1f2937;
            padding: 10px 16px;
            border-radius: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            font-size: 14px;
            font-weight: 600;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            line-height: 1.4;
            text-align: center;
        }

        /* Online Status */
        #sdpi-online-status {
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9997;
            padding: 8px 14px;
            border-radius: 24px;
            background: #e8f5e9;
            color: #16803c;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
            border: 1px solid rgba(22, 128, 60, 0.1);
        }

        #sdpi-online-status.offline {
            background: #ffebee;
            color: #d32f2f;
            border-color: rgba(211, 47, 47, 0.1);
        }

        /* Toast */
        #sdpi-toast-container {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none;
            width: 100%;
            max-width: 500px;
        }

        .sdpi-toast {
            min-width: 200px;
            max-width: 90%;
            padding: 14px 24px;
            margin-bottom: 8px;
            border-radius: 14px;
            background: rgba(31, 41, 55, 0.95);
            color: #fff;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: sdpiToastIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes sdpiToastIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .sdpi-toast.success {
            background: rgba(22, 128, 60, 0.95);
        }

        .sdpi-toast.error {
            background: rgba(211, 47, 47, 0.95);
        }

        /* Dark Mode */
        body.sdpi-dark {
            background: #111827 !important;
            color: #f3f4f6 !important;
        }

        body.sdpi-dark #sdpi-clock,
        body.sdpi-dark .sdpi-widget-btn {
            background: #1f2937;
            color: #f3f4f6;
            border-color: rgba(255, 255, 255, 0.05);
        }

        body.sdpi-dark .sdpi-widget-btn:hover {
            background: #374151;
        }

        body.sdpi-dark #sdpi-online-status {
            background: #1a2a1a;
            color: #4caf50;
            border-color: rgba(76, 175, 80, 0.2);
        }

        body.sdpi-dark #sdpi-online-status.offline {
            background: #2a1a1a;
            color: #ef5350;
            border-color: rgba(239, 83, 80, 0.2);
        }

        body.sdpi-dark input,
        body.sdpi-dark textarea,
        body.sdpi-dark select {
            background: #1f2937;
            color: #f3f4f6;
            border-color: #374151;
        }

        /* Back To Top */
        #sdpi-back-top {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #sdpi-back-top.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* Responsive */
        @media (max-width: 600px) {
            #sdpi-clock {
                top: 12px;
                right: 12px;
                font-size: 12px;
                padding: 8px 12px;
            }

            .sdpi-widget-container {
                right: 12px;
                bottom: 12px;
                gap: 10px;
            }

            .sdpi-widget-btn {
                width: 44px;
                height: 44px;
                font-size: 18px;
            }

            #sdpi-online-status {
                left: 12px;
                bottom: 12px;
                font-size: 11px;
                padding: 6px 12px;
            }

            #sdpi-toast-container {
                top: 60px;
            }

            .sdpi-toast {
                padding: 12px 20px;
                font-size: 13px;
            }
        }
    `;

    document.head.appendChild(style);

    /* ---------- Scroll Progress ---------- */
    const progress = document.createElement('div');
    progress.id = 'sdpi-scroll-progress';
    document.body.appendChild(progress);

    const updateProgress = utils.throttle(() => {
        progress.style.width = utils.getScrollPercent() + '%';
    }, 20);

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    /* ---------- Clock ---------- */
    const clock = document.createElement('div');
    clock.id = 'sdpi-clock';
    document.body.appendChild(clock);

    function updateClock() {
        const { time, date } = utils.formatTime(new Date());
        clock.innerHTML = `🕒 ${time}<br>📅 ${date}`;
    }

    updateClock();
    setInterval(updateClock, CONFIG.clockUpdateInterval);

    /* ---------- Online Status ---------- */
    const status = document.createElement('div');
    status.id = 'sdpi-online-status';
    document.body.appendChild(status);

    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        status.textContent = isOnline ? '● Online' : '● Offline';
        status.classList.toggle('offline', !isOnline);
    }

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    /* ---------- Floating Buttons ---------- */
    const container = document.createElement('div');
    container.className = 'sdpi-widget-container';

    // Helper to create buttons with tooltips
    function createButton(html, tooltip, id = '') {
        const btn = document.createElement('button');
        btn.className = 'sdpi-widget-btn';
        btn.innerHTML = html;
        if (id) btn.id = id;

        const tip = document.createElement('span');
        tip.className = 'tooltip';
        tip.textContent = tooltip;
        btn.appendChild(tip);

        return btn;
    }

    // Dark Mode Button
    const darkBtn = createButton('🌙', 'Toggle Theme');
    container.appendChild(darkBtn);

    // Share Button
    const shareBtn = createButton('🔗', 'Share Page');
    container.appendChild(shareBtn);

    // Back to Top Button
    const topBtn = createButton('↑', 'Back to Top', 'sdpi-back-top');
    container.appendChild(topBtn);

    document.body.appendChild(container);

    /* ---------- Dark Mode Logic ---------- */
    const savedTheme = localStorage.getItem('sdpi-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add(CONFIG.darkModeClass);
        darkBtn.innerHTML = '☀️';
    }

    darkBtn.addEventListener('click', function () {
        document.body.classList.toggle(CONFIG.darkModeClass);
        const isDark = document.body.classList.contains(CONFIG.darkModeClass);
        localStorage.setItem('sdpi-theme', isDark ? 'dark' : 'light');
        darkBtn.innerHTML = isDark ? '☀️' : '🌙';
        showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 2000);
    });

    /* ---------- Share ---------- */
    shareBtn.addEventListener('click', async function () {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: document.title,
                    text: 'Check out this page!',
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast('✅ Link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share error:', error);
                showToast('❌ Could not share', 2000);
            }
        }
    });

    /* ---------- Back To Top ---------- */
    const handleScroll = utils.throttle(() => {
        topBtn.classList.toggle('show', window.scrollY > CONFIG.backToTopThreshold);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    topBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ---------- Toast System ---------- */
    const toastContainer = document.createElement('div');
    toastContainer.id = 'sdpi-toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, duration = CONFIG.toastDuration, type = '') {
        const toast = document.createElement('div');
        toast.className = `sdpi-toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Handle overlapping toasts
        const existingToasts = toastContainer.children;
        if (existingToasts.length > 3) {
            const oldestToast = existingToasts[0];
            oldestToast.style.opacity = '0';
            setTimeout(() => oldestToast.remove(), 300);
        }

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px) scale(0.95)';
            toast.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    /* Make Toast globally available */
    window.SDPIToast = showToast;

    /* ---------- Copy Helper ---------- */
    window.SDPICopy = async function (text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('✅ Copied successfully!', 2000, 'success');
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            showToast('❌ Copy failed!', 2000, 'error');
            return false;
        }
    };

    /* ---------- Additional Features ---------- */

    // Initialize Counter with better UX
    window.SDPICounter = {
        count: 0,
        increment() {
            this.count++;
            showToast(`Count: ${this.count}`, 1500);
            return this.count;
        },
        reset() {
            this.count = 0;
            showToast('Counter reset', 1500);
            return this.count;
        }
    };

    // Console welcome message
    console.log(
        '%c✨ SDPI Widget System v2.0 Loaded ✨',
        'color:#2563eb;font-weight:bold;font-size:16px;padding:8px 12px;border-radius:8px;background:#f0f4ff;'
    );

    console.log(
        '%c📦 Available Commands:\n%c- SDPIToast(message, duration, type)\n- SDPICopy(text)\n- SDPICounter.increment()\n- SDPICounter.reset()',
        'color:#1f2937;font-weight:bold;',
        'color:#6b7280;font-size:12px;'
    );

})();