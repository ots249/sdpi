/* =========================================
   SDPI Widget System v3.0
   Premium UI Design
   ========================================= */

(function () {
    "use strict";

    /* ---------- Configuration ---------- */
    const CONFIG = {
        scrollProgressHeight: '4px',
        scrollProgressColor: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
        toastDuration: 3000,
        backToTopThreshold: 300,
        animationDuration: '0.4s'
    };

    /* ---------- Utility Functions ---------- */
    const utils = {
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

        debounce(fn, delay = 200) {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        getScrollPercent() {
            const scrollTop = window.scrollY;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            return height > 0 ? (scrollTop / height) * 100 : 0;
        }
    };

    /* ---------- Inject CSS ---------- */
    const style = document.createElement('style');
    style.textContent = `
        /* ===== Scroll Progress ===== */
        #sdpi-scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: ${CONFIG.scrollProgressHeight};
            background: ${CONFIG.scrollProgressColor};
            z-index: 99999;
            transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 20px rgba(99, 102, 241, 0.4);
            border-radius: 0 2px 2px 0;
        }

        #sdpi-scroll-progress::after {
            content: '';
            position: absolute;
            right: -10px;
            top: -4px;
            width: 12px;
            height: 12px;
            background: #6366f1;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            opacity: 0.7;
            animation: pulse-dot 1.5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.4); opacity: 1; }
        }

        /* ===== Floating Buttons Container ===== */
        .sdpi-widget-container {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
        }

        /* ===== Floating Buttons ===== */
        .sdpi-widget-btn {
            width: 52px;
            height: 52px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            color: #1f2937;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            touch-action: manipulation;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sdpi-widget-btn::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        .sdpi-widget-btn:hover {
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
            color: #fff;
            background: rgba(99, 102, 241, 0.15);
            border-color: #6366f1;
        }

        .sdpi-widget-btn:hover::before {
            opacity: 1;
        }

        .sdpi-widget-btn:active {
            transform: scale(0.92);
        }

        .sdpi-widget-btn .tooltip {
            position: absolute;
            right: calc(100% + 16px);
            background: rgba(15, 23, 42, 0.95);
            color: #f1f5f9;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(10px);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            letter-spacing: 0.3px;
        }

        .sdpi-widget-btn .tooltip::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border: 6px solid transparent;
            border-left-color: rgba(15, 23, 42, 0.95);
        }

        .sdpi-widget-btn:hover .tooltip {
            opacity: 1;
            transform: translateX(0);
        }

        /* ===== Back to Top Button ===== */
        #sdpi-back-top {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
            pointer-events: none;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #sdpi-back-top.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        #sdpi-back-top .icon-arrow {
            display: inline-block;
            transition: transform 0.3s ease;
        }

        #sdpi-back-top:hover .icon-arrow {
            transform: translateY(-3px);
        }

        /* ===== Online Status ===== */
        #sdpi-online-status {
            position: fixed;
            left: 24px;
            bottom: 24px;
            z-index: 9997;
            padding: 10px 18px;
            border-radius: 30px;
            background: rgba(236, 253, 245, 0.95);
            color: #065f46;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
            backdrop-filter: blur(12px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(6, 95, 70, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: 0.3px;
        }

        #sdpi-online-status .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            animation: status-pulse 2s ease-in-out infinite;
        }

        #sdpi-online-status.offline {
            background: rgba(254, 242, 242, 0.95);
            color: #991b1b;
            border-color: rgba(153, 27, 27, 0.1);
        }

        #sdpi-online-status.offline .status-dot {
            background: #ef4444;
            animation: status-pulse-offline 1s ease-in-out infinite;
        }

        @keyframes status-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.9); }
        }

        @keyframes status-pulse-offline {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* ===== Toast Notifications ===== */
        #sdpi-toast-container {
            position: fixed;
            top: 80px;
            right: 24px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none;
            width: auto;
            max-width: 420px;
            gap: 10px;
        }

        .sdpi-toast {
            min-width: 280px;
            max-width: 100%;
            padding: 16px 24px;
            border-radius: 16px;
            background: rgba(15, 23, 42, 0.95);
            color: #f1f5f9;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
            animation: sdpiToastIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: auto;
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            overflow: hidden;
        }

        .sdpi-toast::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #6366f1, #a855f7);
        }

        .sdpi-toast .toast-icon {
            font-size: 20px;
            flex-shrink: 0;
        }

        .sdpi-toast .toast-message {
            flex: 1;
        }

        .sdpi-toast.success::before {
            background: linear-gradient(180deg, #10b981, #34d399);
        }

        .sdpi-toast.error::before {
            background: linear-gradient(180deg, #ef4444, #f87171);
        }

        .sdpi-toast.success .toast-icon {
            color: #10b981;
        }

        .sdpi-toast.error .toast-icon {
            color: #ef4444;
        }

        @keyframes sdpiToastIn {
            from {
                opacity: 0;
                transform: translateX(40px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        .sdpi-toast-out {
            animation: sdpiToastOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes sdpiToastOut {
            from {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateX(40px) scale(0.95);
            }
        }

        /* ===== Responsive Design ===== */
        @media (max-width: 768px) {
            .sdpi-widget-container {
                right: 16px;
                bottom: 16px;
                gap: 12px;
            }

            .sdpi-widget-btn {
                width: 48px;
                height: 48px;
                font-size: 20px;
            }

            #sdpi-online-status {
                left: 16px;
                bottom: 16px;
                font-size: 12px;
                padding: 8px 14px;
            }

            #sdpi-toast-container {
                top: 60px;
                right: 16px;
                left: 16px;
                max-width: 100%;
            }

            .sdpi-toast {
                min-width: 0;
                width: 100%;
                padding: 14px 18px;
                font-size: 13px;
            }

            .sdpi-widget-btn .tooltip {
                display: none;
            }
        }

        @media (max-width: 480px) {
            .sdpi-widget-btn {
                width: 44px;
                height: 44px;
                font-size: 18px;
            }

            #sdpi-online-status {
                font-size: 11px;
                padding: 6px 12px;
            }

            .sdpi-toast {
                padding: 12px 16px;
                font-size: 12px;
            }

            #sdpi-scroll-progress {
                height: 3px;
            }
        }
    `;

    document.head.appendChild(style);

    /* ===== Scroll Progress ===== */
    const progress = document.createElement('div');
    progress.id = 'sdpi-scroll-progress';
    document.body.appendChild(progress);

    const updateProgress = utils.throttle(() => {
        progress.style.width = utils.getScrollPercent() + '%';
    }, 20);

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    /* ===== Online Status ===== */
    const status = document.createElement('div');
    status.id = 'sdpi-online-status';
    status.innerHTML = `<span class="status-dot"></span><span class="status-text">Online</span>`;
    document.body.appendChild(status);

    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        const statusText = status.querySelector('.status-text');
        statusText.textContent = isOnline ? 'Online' : 'Offline';
        status.classList.toggle('offline', !isOnline);
    }

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    /* ===== Floating Buttons ===== */
    const container = document.createElement('div');
    container.className = 'sdpi-widget-container';

    // Helper to create buttons with tooltips
    function createButton(html, tooltip, id = '', extraClass = '') {
        const btn = document.createElement('button');
        btn.className = `sdpi-widget-btn ${extraClass}`;
        btn.innerHTML = html;
        if (id) btn.id = id;

        const tip = document.createElement('span');
        tip.className = 'tooltip';
        tip.textContent = tooltip;
        btn.appendChild(tip);

        return btn;
    }

    // Back to Top Button with custom icon
    const topBtn = createButton(
        '<span class="icon-arrow">↑</span>',
        'Back to Top',
        'sdpi-back-top'
    );
    container.appendChild(topBtn);

    document.body.appendChild(container);

    /* ===== Back to Top ===== */
    const handleScroll = utils.throttle(() => {
        const shouldShow = window.scrollY > CONFIG.backToTopThreshold;
        topBtn.classList.toggle('show', shouldShow);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    topBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ===== Toast System ===== */
    const toastContainer = document.createElement('div');
    toastContainer.id = 'sdpi-toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, duration = CONFIG.toastDuration, type = '') {
        const toast = document.createElement('div');
        toast.className = `sdpi-toast ${type}`;

        // Add icon based on type
        let icon = '📌';
        if (type === 'success') icon = '✅';
        else if (type === 'error') icon = '❌';
        else if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Remove old toasts if too many
        const existingToasts = toastContainer.children;
        if (existingToasts.length > 5) {
            const oldestToast = existingToasts[0];
            oldestToast.classList.add('sdpi-toast-out');
            setTimeout(() => oldestToast.remove(), 400);
        }

        // Auto dismiss
        const timeoutId = setTimeout(() => {
            toast.classList.add('sdpi-toast-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 400);
        }, duration);

        // Hover pause
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });

        toast.addEventListener('mouseleave', () => {
            const newTimeoutId = setTimeout(() => {
                toast.classList.add('sdpi-toast-out');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 400);
            }, 1000);
            toast._timeoutId = newTimeoutId;
        });
    }

    /* Make Toast globally available */
    window.SDPIToast = showToast;

    /* ===== Copy Helper ===== */
    window.SDPICopy = async function (text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 2000, 'success');
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            showToast('Copy failed!', 2000, 'error');
            return false;
        }
    };

    /* ===== Counter Helper ===== */
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

    /* ===== Console Welcome ===== */
    console.log(
        '%c✨ SDPI Widget System v3.0 ✨',
        'color: #6366f1; font-weight: bold; font-size: 20px; padding: 12px 16px; border-radius: 12px; background: linear-gradient(135deg, #eef2ff, #ede9fe);'
    );

    console.log(
        '%c📦 Available Commands:\n' +
        '%c  • SDPIToast(message, duration, type)\n' +
        '%c  • SDPICopy(text)\n' +
        '%c  • SDPICounter.increment()\n' +
        '%c  • SDPICounter.reset()',
        'color: #1f2937; font-weight: bold; font-size: 14px;',
        'color: #6b7280; font-size: 13px;',
        'color: #6b7280; font-size: 13px;',
        'color: #6b7280; font-size: 13px;',
        'color: #6b7280; font-size: 13px;'
    );

    console.log(
        '%c🎨 Features:\n' +
        '%c  • Gradient scroll progress with pulse\n' +
        '%c  • Premium floating buttons with glassmorphism\n' +
        '%c  • Animated online status indicator\n' +
        '%c  • Modern toast notifications\n' +
        '%c  • Smooth back to top with icon animation',
        'color: #1f2937; font-weight: bold; font-size: 13px;',
        'color: #6b7280; font-size: 12px;',
        'color: #6b7280; font-size: 12px;',
        'color: #6b7280; font-size: 12px;',
        'color: #6b7280; font-size: 12px;',
        'color: #6b7280; font-size: 12px;'
    );

})();