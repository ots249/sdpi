/* =========================================
   SDPI Widget System
   Version: 1.0
   ========================================= */

(function () {
    "use strict";

    /* ---------- Inject CSS ---------- */
    const style = document.createElement("style");

    style.textContent = `
        /* Scroll Progress */
        #sdpi-scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            z-index: 99999;
            transition: width .1s linear;
        }

        /* Floating Buttons */
        .sdpi-widget-container {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }

        .sdpi-widget-btn {
            width: 44px;
            height: 44px;
            border: 0;
            border-radius: 50%;
            background: #ffffff;
            color: #222;
            box-shadow: 0 4px 18px rgba(0,0,0,.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: .25s ease;
        }

        .sdpi-widget-btn:hover {
            transform: translateY(-3px);
        }

        /* Clock */
        #sdpi-clock {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 9997;
            background: rgba(255,255,255,.9);
            color: #222;
            padding: 8px 13px;
            border-radius: 12px;
            box-shadow: 0 3px 15px rgba(0,0,0,.12);
            font-size: 13px;
            font-weight: 600;
            backdrop-filter: blur(10px);
        }

        /* Online Status */
        #sdpi-online-status {
            position: fixed;
            left: 15px;
            bottom: 15px;
            z-index: 9997;
            padding: 7px 11px;
            border-radius: 20px;
            background: #e8f5e9;
            color: #16803c;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 3px 12px rgba(0,0,0,.1);
        }

        #sdpi-online-status.offline {
            background: #ffebee;
            color: #d32f2f;
        }

        /* Toast */
        #sdpi-toast-container {
            position: fixed;
            top: 65px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
        }

        .sdpi-toast {
            min-width: 220px;
            max-width: 90vw;
            padding: 12px 17px;
            margin-bottom: 10px;
            border-radius: 12px;
            background: #222;
            color: #fff;
            text-align: center;
            font-size: 13px;
            box-shadow: 0 5px 25px rgba(0,0,0,.2);
            animation: sdpiToastIn .3s ease;
        }

        @keyframes sdpiToastIn {
            from {
                opacity: 0;
                transform: translateY(-15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Dark Mode */
        body.sdpi-dark {
            background: #111827 !important;
            color: #f3f4f6 !important;
        }

        body.sdpi-dark #sdpi-clock,
        body.sdpi-dark .sdpi-widget-btn {
            background: #1f2937;
            color: #fff;
        }

        body.sdpi-dark input,
        body.sdpi-dark textarea,
        body.sdpi-dark select {
            background: #1f2937;
            color: #fff;
            border-color: #374151;
        }

        /* Back To Top */
        #sdpi-back-top {
            display: none;
        }

        #sdpi-back-top.show {
            display: flex;
        }

        @media (max-width: 600px) {
            #sdpi-clock {
                top: 10px;
                right: 10px;
                font-size: 11px;
            }

            .sdpi-widget-container {
                right: 12px;
                bottom: 12px;
            }

            .sdpi-widget-btn {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }
        }
    `;

    document.head.appendChild(style);


    /* ---------- Scroll Progress ---------- */

    const progress = document.createElement("div");
    progress.id = "sdpi-scroll-progress";
    document.body.appendChild(progress);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const percent = height > 0
            ? (scrollTop / height) * 100
            : 0;

        progress.style.width = percent + "%";
    }

    window.addEventListener("scroll", updateProgress);


    /* ---------- Clock ---------- */

    const clock = document.createElement("div");
    clock.id = "sdpi-clock";

    document.body.appendChild(clock);

    function updateClock() {
        const now = new Date();

        const time = now.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const date = now.toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        clock.innerHTML = `🕒 ${time}<br>📅 ${date}`;
    }

    updateClock();
    setInterval(updateClock, 1000);


    /* ---------- Online Status ---------- */

    const status = document.createElement("div");
    status.id = "sdpi-online-status";

    document.body.appendChild(status);

    function updateOnlineStatus() {
        if (navigator.onLine) {
            status.textContent = "● Online";
            status.classList.remove("offline");
        } else {
            status.textContent = "● Offline";
            status.classList.add("offline");
        }
    }

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);


    /* ---------- Floating Buttons ---------- */

    const container = document.createElement("div");
    container.className = "sdpi-widget-container";

    /* Dark Mode */

    const darkBtn = document.createElement("button");
    darkBtn.className = "sdpi-widget-btn";
    darkBtn.innerHTML = "🌙";
    darkBtn.title = "Dark Mode";

    container.appendChild(darkBtn);

    /* Share */

    const shareBtn = document.createElement("button");
    shareBtn.className = "sdpi-widget-btn";
    shareBtn.innerHTML = "🔗";
    shareBtn.title = "Share";

    container.appendChild(shareBtn);

    /* Back To Top */

    const topBtn = document.createElement("button");
    topBtn.className = "sdpi-widget-btn";
    topBtn.id = "sdpi-back-top";
    topBtn.innerHTML = "↑";
    topBtn.title = "Back to Top";

    container.appendChild(topBtn);

    document.body.appendChild(container);


    /* ---------- Dark Mode Logic ---------- */

    const savedTheme = localStorage.getItem("sdpi-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("sdpi-dark");
        darkBtn.innerHTML = "☀️";
    }

    darkBtn.addEventListener("click", function () {

        document.body.classList.toggle("sdpi-dark");

        const isDark =
            document.body.classList.contains("sdpi-dark");

        localStorage.setItem(
            "sdpi-theme",
            isDark ? "dark" : "light"
        );

        darkBtn.innerHTML = isDark ? "☀️" : "🌙";

        showToast(
            isDark
                ? "Dark mode enabled"
                : "Light mode enabled"
        );
    });


    /* ---------- Share ---------- */

    shareBtn.addEventListener("click", async function () {

        const shareData = {
            title: document.title,
            text: "Check this website:",
            url: window.location.href
        };

        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast("Link copied!");
            }

        } catch (error) {
            console.log("Share cancelled");
        }
    });


    /* ---------- Back To Top ---------- */

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {
            topBtn.classList.add("show");
        } else {
            topBtn.classList.remove("show");
        }

    });

    topBtn.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* ---------- Toast System ---------- */

    const toastContainer = document.createElement("div");

    toastContainer.id = "sdpi-toast-container";

    document.body.appendChild(toastContainer);


    function showToast(message, duration = 2500) {

        const toast = document.createElement("div");

        toast.className = "sdpi-toast";

        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {

            toast.style.opacity = "0";

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

            showToast("Copied successfully!");

        } catch (error) {

            showToast("Copy failed!");

        }
    };


    /* ---------- Console ---------- */

    console.log(
        "%cSDPI Widget System Loaded",
        "color:#2563eb;font-weight:bold;font-size:14px"
    );

})();