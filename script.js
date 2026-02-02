/* script.js - النسخة النهائية الشاملة */

const translations = {
    ar: {
        "nav-home": "الرئيسية", "nav-offers": "العروض", "nav-services": "خدماتنا", "nav-contact": "اتصل بنا",
        "cta-btn": "تواصل معنا", "lang-btn": "English", "offers-title": "عروض المنيو الحصرية", "footer-desc": "جميع الحقوق محفوظة © 2026",
        "discount-lbl": "خصم", "add-cart-btn": "إضافة للسلة", "currency": "ر.س", "offer-wa-btn": "طلب العرض", "footer-contact-title": "تواصل معنا"
    },
    en: {
        "nav-home": "Home", "nav-offers": "Offers", "nav-services": "Services", "nav-contact": "Contact",
        "cta-btn": "Contact Us", "lang-btn": "العربية", "offers-title": "Exclusive Menu Offers", "footer-desc": "All Rights Reserved © 2026",
        "discount-lbl": "OFF", "add-cart-btn": "Add to Cart", "currency": "SAR", "offer-wa-btn": "Order Offer", "footer-contact-title": "Contact Us"
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';
const sunIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
const moonIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;

// --- دوال جلب البيانات (العمود الفقري للموقع) ---
function getData(key) {
    // 1. الأولوية لملف data.js (للاستخدام العام)
    if (typeof siteData !== 'undefined' && siteData && siteData[key] !== undefined) {
        return siteData[key];
    }
    // 2. ثم الذاكرة المحلية (للمعاينة)
    return localStorage.getItem(key);
}

function getJSON(key) {
    if (typeof siteData !== 'undefined' && siteData && siteData[key]) {
        // إذا كانت البيانات في الملف نصية (String)، حولها لـ JSON، وإذا كانت كائن (Object) أعدها كما هي
        return typeof siteData[key] === 'string' ? JSON.parse(siteData[key]) : siteData[key];
    }
    return JSON.parse(localStorage.getItem(key)) || [];
}

function initializeDefaults() {}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

function toggleLang() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    updateUI();
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-btn');
    const isDark = document.documentElement.classList.contains('dark');
    if(btn) btn.innerHTML = isDark ? sunIcon : moonIcon;
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = "bg-gray-900/90 text-white dark:bg-white/90 dark:text-black px-6 py-3 rounded-full shadow-2xl backdrop-blur-md font-bold text-sm mb-3 flex items-center gap-3 toast-enter border border-white/10 dark:border-black/5";
    toast.innerHTML = `<span class="bg-green-500 rounded-full p-1 text-xs text-white">✓</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// --- تحديث الواجهة ---
function updateUI() {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = currentLang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[currentLang][key]) el.innerText = translations[currentLang][key];
    });
    
    const langBtn = document.getElementById('lang-btn');
    if(langBtn) langBtn.innerText = translations[currentLang]['lang-btn'];

    // العناوين والشعارات
    const sTitleAr = getData('siteTitleAr');
    const sTitleEn = getData('siteTitleEn');
    const displayTitle = currentLang === 'ar' ? (sTitleAr || sTitleEn || 'SamaBrand') : (sTitleEn || sTitleAr || 'SamaBrand');

    const sLogo = getData('siteLogo');
    const sHero = getData('heroImage');

    if(displayTitle) {
        if(document.getElementById('nav-logo-text')) document.getElementById('nav-logo-text').innerText = displayTitle;
        if(document.getElementById('footer-logo')) document.getElementById('footer-logo').innerText = displayTitle;
        document.title = `${displayTitle} | ${currentLang === 'ar' ? 'القائمة' : 'Menu'}`;
    }
    
    if(sLogo && document.getElementById('main-logo')) {
        const logo = document.getElementById('main-logo');
        logo.src = sLogo;
        logo.classList.remove('hidden');
    }

    // منطق عنوان الهيرو المحسن
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');

    if(heroTitle) {
        // الأولوية: عنوان هيرو مخصص -> اسم الموقع -> الافتراضي
        const customHeroTitle = currentLang === 'ar' ? getData('heroTitleAr') : getData('heroTitleEn');
        heroTitle.innerText = customHeroTitle || displayTitle;
        
        const tSize = getData('heroTitleSize');
        if(tSize) heroTitle.style.fontSize = tSize + "px";
    }

    if(heroDesc) {
        heroDesc.innerText = currentLang === 'ar' 
            ? (getData('heroDescAr') || "تجربة طعام استثنائية وعروض مميزة")
            : (getData('heroDescEn') || "Exceptional dining experience and special offers");
    }

    if(sHero && document.getElementById('hero-bg')) document.getElementById('hero-bg').src = sHero;

    // تشغيل باقي الأجزاء
    renderHeaderLinks();
    generateDynamicSections();
    renderOffers();
    renderFooter();
    renderSocials();
    renderAppButtons(); // دالة جديدة لزر التطبيق
    updateThemeIcon();
}

function renderAppButtons() {
    const appHero = document.getElementById('app-btn-hero');
    const appFooter = document.getElementById('app-btn-footer');
    
    // التعامل مع القيم البوليانية سواء كانت نصية أو حقيقية
    const checkBool = (val) => val === true || val === 'true';
    
    const showHero = checkBool(getData('showAppHero'));
    const showFooter = checkBool(getData('showAppFooter'));
    const appLink = getData('appLink');
    const appText = currentLang === 'ar' 
        ? (getData('appTextAr') || "حمل التطبيق") 
        : (getData('appTextEn') || "Download App");

    if(appHero) {
        if(showHero && appLink) {
            appHero.href = appLink;
            appHero.querySelector('.app-btn-text').innerText = appText;
            appHero.classList.remove('hidden');
            appHero.classList.add('inline-flex');
        } else {
            appHero.classList.add('hidden');
            appHero.classList.remove('inline-flex');
        }
    }

    if(appFooter) {
        if(showFooter && appLink) {
            appFooter.href = appLink;
            appFooter.querySelector('.app-btn-text').innerText = appText;
            appFooter.classList.remove('hidden');
            appFooter.classList.add('inline-flex');
        } else {
            appFooter.classList.add('hidden');
            appFooter.classList.remove('inline-flex');
        }
    }
}

function renderFooter() {
    // 1. النصوص
    const fTitle = document.getElementById('footer-logo');
    const fDesc = document.getElementById('footer-desc');
    
    const titleAr = getData('footerTitleAr') || getData('siteTitleAr') || 'SamaBrand';
    const titleEn = getData('footerTitleEn') || getData('siteTitleEn') || 'SamaBrand';
    const descAr = getData('footerDescAr') || 'مطعم متميز يقدم أشهى الأطباق...';
    const descEn = getData('footerDescEn') || 'A premium restaurant serving delicious dishes...';

    if (fTitle) fTitle.innerText = currentLang === 'ar' ? titleAr : titleEn;
    if (fDesc) fDesc.innerText = currentLang === 'ar' ? descAr : descEn;

    // 2. حقوق الملكية (مع الرابط)
    const copyEl = document.querySelector('[data-i18n="footer-desc"]');
    if(copyEl) {
        const copyTextAr = getData('siteCopyAr') || "جميع الحقوق محفوظة © 2026";
        const copyTextEn = getData('siteCopyEn') || "All Rights Reserved © 2026";
        const copyLink = getData('siteCopyLink');
        const finalText = currentLang === 'ar' ? copyTextAr : copyTextEn;

        if(copyLink && copyLink.trim() !== "") {
            copyEl.innerHTML = `<a href="${copyLink}" target="_blank" class="hover:text-purple-400 transition hover:underline decoration-dotted underline-offset-4">${finalText}</a>`;
        } else {
            copyEl.innerText = finalText;
        }
    }

    // 3. الخريطة والتواصل
    const mapUrl = getData('mapUrl');
    const mapFrame = document.getElementById('footer-map');
    if(mapFrame && mapUrl) mapFrame.src = mapUrl;

    const contacts = getJSON('siteContacts');
    const contactsContainer = document.getElementById('footer-contacts');
    if(contactsContainer) {
        contactsContainer.innerHTML = contacts.map(c => {
            const icon = c.type === 'phone' 
                ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.25 0 2.45.2 3.57.57.35.13.44.52.24 1.02l-2.2 2.2z"/></svg>'
                : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>';
            return `
                <div class="flex items-center gap-3 text-gray-300 hover:text-white transition group">
                    <div class="bg-zinc-800 p-2 rounded-full text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">${icon}</div>
                    <span class="dir-ltr font-mono text-sm">${c.value}</span>
                </div>`;
        }).join('');
    }
}

function renderHeaderLinks() {
    const navs = getJSON('siteNavs');
    const desktopContainer = document.getElementById('main-nav-links');
    const mobileContainer = document.getElementById('mobile-nav-links');
    let linksHTML = '';
    navs.forEach(n => {
        if(!n.isHidden) {
            const title = currentLang === 'ar' ? n.titleAr : n.titleEn;
            linksHTML += `<a href="${n.link}" class="hover:text-purple-600 dark:hover:text-purple-400 transition" onclick="if(window.innerWidth < 768) toggleMobileMenu()">${title}</a>`;
        }
    });
    if(desktopContainer) desktopContainer.innerHTML = linksHTML;
    if(mobileContainer) mobileContainer.innerHTML = linksHTML;
}

function generateDynamicSections() {
    const navs = getJSON('siteNavs');
    const mainContainer = document.getElementById('dynamic-content'); 
    if(!mainContainer) return;
    mainContainer.innerHTML = '';
    if(navs.length === 0) {
        mainContainer.innerHTML = `<div class="text-center py-20 text-gray-400">لا توجد أقسام للعرض حالياً..</div>`;
        return;
    }
    const waveDivider = `<div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] opacity-10 dark:opacity-5 pointer-events-none"><svg class="relative block w-[calc(100%+1.3px)] h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path></svg></div>`;
    navs.forEach((nav, index) => {
        if (nav.isHidden) return;
        if(nav.link && nav.link.startsWith('#')) {
            const sectionId = nav.link.substring(1);
            const title = currentLang === 'ar' ? nav.titleAr : nav.titleEn;
            const bgClass = index % 2 === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-gray-50 dark:bg-zinc-900';
            mainContainer.innerHTML += `
                <section id="${sectionId}" class="relative py-20 ${bgClass} transition-colors duration-300">
                    <div class="container mx-auto px-4 relative z-10">
                        <div class="flex items-center justify-center mb-10 gap-4">
                            <span class="h-1 w-12 bg-purple-600 rounded-full"></span>
                            <h2 class="text-3xl md:text-4xl font-black text-[#423064] dark:text-white uppercase tracking-wider">${title}</h2>
                            <span class="h-1 w-12 bg-purple-600 rounded-full"></span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="container-${sectionId}"></div>
                    </div>
                    ${index % 2 === 0 ? waveDivider.replace('fill="currentColor"', 'class="fill-gray-50 dark:fill-zinc-900"') : ''}
                </section>`;
        }
    });
}

function renderOffers() {
    const offers = getJSON('siteOffers');
    const txtDiscount = translations[currentLang]['discount-lbl'];
    const currency = translations[currentLang]['currency'];
    document.querySelectorAll('[id^="container-"]').forEach(c => c.innerHTML = '');
    offers.forEach(offer => {
        let displayName = currentLang === 'en' ? (offer.nameEn || offer.nameAr) : (offer.nameAr || offer.name);
        let displayDesc = currentLang === 'en' ? (offer.descEn || offer.descAr) : (offer.descAr || offer.desc);
        let basePrice = parseFloat(offer.price);
        let finalPrice = basePrice;
        let priceDisplayHTML = `<span class="text-2xl font-black text-purple-600 dark:text-purple-400">${basePrice} <span class="text-sm font-bold text-gray-500">${currency}</span></span>`;
        let discountBadge = '';
        if(offer.discount && !isNaN(parseFloat(offer.discount))) {
            const discountVal = parseFloat(offer.discount);
            finalPrice = basePrice - (basePrice * (discountVal / 100));
            finalPrice = parseFloat(finalPrice.toFixed(2));
            priceDisplayHTML = `<div class="flex flex-col items-end"><span class="text-sm text-gray-400 line-through font-bold">${basePrice} ${currency}</span><span class="text-2xl font-black text-red-600 dark:text-red-400">${finalPrice} <span class="text-sm">${currency}</span></span></div>`;
            discountBadge = `<div class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-xl font-bold text-xs shadow-lg z-10 animate-pulse">${txtDiscount} ${offer.discount}%</div>`;
        }
        const targetId = offer.section ? offer.section.substring(1) : 'offers';
        const container = document.getElementById(`container-${targetId}`);
        if (container) {
            container.innerHTML += `
                <div class="bg-white dark:bg-zinc-800/50 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-zinc-700/50 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                    <div class="relative h-64 overflow-hidden shrink-0">
                        ${discountBadge}
                        <img src="${offer.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        <div class="absolute bottom-4 right-4 text-white font-bold text-lg drop-shadow-md">${displayName}</div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <!-- تم إضافة كلاس meal-desc لتوسيع الوصف -->
                        <p class="meal-desc text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">${displayDesc || ''}</p>
                        <div class="mt-auto flex justify-between items-end border-t dark:border-zinc-700 pt-4">
                            ${priceDisplayHTML}
                            <button onclick="addToCart('${displayName}', '${finalPrice}')" class="w-12 h-12 flex items-center justify-center bg-[#423064] text-white rounded-full font-bold shadow-lg hover:bg-purple-700 hover:scale-110 transition active:scale-95"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                        </div>
                    </div>
                </div>`;
        }
    });
}

const socialIcons = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24"><path d="M12.005 1.78c-4.321 0-7.75 3.036-7.75 7.03 0 .193.023.38.033.57.068 1.05-.623 1.944-1.272 2.668-.616.65-1.285 1.156-1.144 2.146.126.852.88 1.052 1.498 1.18.577.126 1.185.225 1.07 1.026-.118.841-1.206 1.734-1.206 2.872 0 1.252 1.258 1.745 2.243 1.996 1.163.303 2.91.314 3.73.415.545.068 1.112.546 1.71.693.356.084.723.136 1.092.136.357 0 .714-.042 1.07-.126.609-.136 1.196-.64 1.74-.693.83-.115 2.578-.115 3.742-.425 1.103-.304 2.132-.82 2.132-1.996 0-1.127-1.078-2.02-1.186-2.872-.126-.821.504-.922 1.102-1.037.587-.115 1.343-.293 1.48-1.158.157-.99-.546-1.52-1.176-2.178-.639-.713-1.32-1.606-1.258-2.657.01-.19.031-.378.031-.57.011-3.986-3.418-7.02-7.74-7.02z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.212 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'
};

function renderSocials() {
    const data = getJSON('siteSocialSettings') || { showTop: false, showBottom: false, links: [] };
    if (Array.isArray(data)) return; 
    
    const containerTop = document.getElementById('social-section-top');
    const containerBottom = document.getElementById('social-section-bottom');
    if(containerTop) containerTop.innerHTML = '';
    if(containerBottom) containerBottom.innerHTML = '';

    if(!data.links || data.links.length === 0) return;

    let iconsHTML = data.links.map(link => {
        const iconSVG = socialIcons[link.platform] || socialIcons['website'];
        const iconClass = `icon-${link.platform}`;
        return `<a href="${link.url}" target="_blank" class="social-link" aria-label="${link.platform}"><div class="social-icon text-gray-700 dark:text-gray-300 ${iconClass}">${iconSVG}</div></a>`;
    }).join('');

    const barHTML = `<div class="social-glass-bar shadow-xl">${iconsHTML}</div>`;

    if(data.showTop && containerTop) {
        containerTop.innerHTML = barHTML;
        containerTop.classList.remove('hidden');
    }
    if(data.showBottom && containerBottom) {
        containerBottom.innerHTML = barHTML;
        containerBottom.classList.remove('hidden');
    }
}

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) existingItem.qty += 1;
    else cart.push({ name: name, price: parseFloat(price), qty: 1 });
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartCount();
    const badge = document.getElementById('cart-count');
    if(badge) {
        badge.classList.add('scale-150', 'bg-green-500');
        setTimeout(() => badge.classList.remove('scale-150', 'bg-green-500'), 200);
    }
    showToast(`تمت إضافة <b>${name}</b> للسلة`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;
}

window.onscroll = function() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            btn.classList.add('opacity-0', 'pointer-events-none');
        }
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDefaults();
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
    updateCartCount();
    updateUI();
});