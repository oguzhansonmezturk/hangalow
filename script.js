/* ===========================
   Hangalow - JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbar();
    initScrollAnimations();
    initGalleryLightbox();
    initCalendar();
    initBookingForm();
    initMobileMenu();
    initLanguage();
});

let mobileMenuScrollY = 0;

function setMenuOpenState(isOpen) {
    const body = document.body;
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const langSelector = document.querySelector('.lang-selector');

    if (!navLinks || !navToggle) return;

    if (isOpen) {
        mobileMenuScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        body.style.top = `-${mobileMenuScrollY}px`;
        body.classList.add('menu-open');
        navLinks.classList.add('active');
        navToggle.classList.add('active');
        langSelector?.classList.remove('active');
        return;
    }

    const wasOpen = body.classList.contains('menu-open');
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    langSelector?.classList.remove('active');
    body.classList.remove('menu-open');
    body.style.top = '';

    if (wasOpen) {
        window.scrollTo(0, mobileMenuScrollY);
    }
}

/* ===========================
   Preloader
   =========================== */

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    let hidden = false;

    const hidePreloader = () => {
        if (hidden) return;
        hidden = true;
        preloader.classList.add('hide');
        window.setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('preload-active');
        }, 900);
    };

    if (document.readyState === 'complete') {
        window.setTimeout(hidePreloader, 1600);
        return;
    }

    window.addEventListener('load', () => {
        window.setTimeout(hidePreloader, 1600);
    }, { once: true });

    // Fallback in case the load event is delayed unexpectedly.
    window.setTimeout(hidePreloader, 4000);
}

/* ===========================
   Navbar
   =========================== */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const langSelector = document.querySelector('.lang-selector');

    const closeMobileMenu = () => {
        setMenuOpenState(false);
    };

    const scrollToTarget = (target) => {
        closeMobileMenu();
        window.requestAnimationFrame(() => {
            const navOffset = (navbar?.offsetHeight || 0) + 12;
            const anchorTarget =
                target.querySelector('.section-header') ||
                target.querySelector('.section-title') ||
                target.querySelector('h2, h3') ||
                target;
            const breathingRoom = target.id === 'about' ? 28 : 22;
            const targetTop = Math.max(
                0,
                anchorTarget.getBoundingClientRect().top + window.pageYOffset - navOffset - breathingRoom
            );

            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    };

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();

            if (href === '#hero') {
                closeMobileMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) scrollToTarget(target);
        });
    });
}

/* ===========================
   Mobile Menu
   =========================== */

function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const langSelector = document.querySelector('.lang-selector');

    if (!toggle || !links) return;

    const closeMenu = () => {
        setMenuOpenState(false);
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        langSelector?.classList.remove('active');
        setMenuOpenState(!links.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 768) return;
        if (!navbar?.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* ===========================
   Scroll Animations
   =========================== */

function initScrollAnimations() {
    const reveals = Array.from(document.querySelectorAll('.reveal'));

    const assignRevealStyles = () => {
        reveals.forEach((el, index) => {
            el.classList.remove('reveal-left', 'reveal-right', 'reveal-up');

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const viewportWidth = window.innerWidth;

            if (viewportWidth <= 768 || el.classList.contains('section-header')) {
                el.classList.add('reveal-up');
            } else if (centerX < viewportWidth * 0.38) {
                el.classList.add('reveal-left');
            } else if (centerX > viewportWidth * 0.62) {
                el.classList.add('reveal-right');
            } else {
                el.classList.add('reveal-up');
            }

            if (
                el.classList.contains('review-card') ||
                el.classList.contains('policy-card') ||
                el.classList.contains('booking-container') ||
                el.classList.contains('location-split')
            ) {
                el.classList.add('reveal-soft');
            }

            el.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 70, 210)}ms`);
        });
    };

    assignRevealStyles();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, {
        threshold: 0.14,
        rootMargin: '0px 0px -10% 0px'
    });

    reveals.forEach(el => observer.observe(el));
    window.addEventListener('resize', assignRevealStyles);
}

/* ===========================
   Gallery Lightbox
   =========================== */

function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const galleryItems = document.querySelectorAll('.gallery-item');
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

/* ===========================
   Calendar & Booking
   =========================== */

function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonth = document.getElementById('calendarMonth');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');
    const checkinDisplay = document.getElementById('checkinDisplay');
    const checkoutDisplay = document.getElementById('checkoutDisplay');
    const bookingNights = document.getElementById('bookingNights');
    const nightCount = document.getElementById('nightCount');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let checkinDate = null;
    let checkoutDate = null;
    let selectionStep = 0; // 0 = select checkin, 1 = select checkout

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function renderCalendar() {
        const t = getTranslationPack();
        calendarDays.innerHTML = '';
        calendarMonth.textContent = `${t.months[currentMonth]} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        let startDay = firstDay.getDay() - 1; // Monday = 0
        if (startDay < 0) startDay = 6;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Empty cells
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            calendarDays.appendChild(empty);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const date = new Date(currentYear, currentMonth, day);
            date.setHours(0, 0, 0, 0);

            // Disable past dates
            if (date < today) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.addEventListener('click', () => handleDateClick(date, dayEl));

                // Today marker
                if (date.getTime() === today.getTime()) {
                    dayEl.classList.add('today');
                }

                // Selection states
                if (checkinDate && date.getTime() === checkinDate.getTime()) {
                    dayEl.classList.add('selected', 'range-start');
                }
                if (checkoutDate && date.getTime() === checkoutDate.getTime()) {
                    dayEl.classList.add('selected', 'range-end');
                }
                if (checkinDate && checkoutDate && date > checkinDate && date < checkoutDate) {
                    dayEl.classList.add('in-range');
                }
            }

            calendarDays.appendChild(dayEl);
        }

        // Add transition animation
        calendarDays.style.animation = 'none';
        calendarDays.offsetHeight; // reflow
        calendarDays.style.animation = 'fadeUp 0.3s ease';
    }

    function handleDateClick(date) {
        if (selectionStep === 0) {
            // Select check-in date
            checkinDate = date;
            checkoutDate = null;
            selectionStep = 1;
            checkinDisplay.textContent = formatDate(date);
            checkoutDisplay.textContent = getTranslationPack().selectDate;
            bookingNights.style.display = 'none';
        } else {
            // Select check-out date
            if (date <= checkinDate) {
                // If selected date is before checkin, reset
                checkinDate = date;
                checkoutDate = null;
                selectionStep = 1;
                checkinDisplay.textContent = formatDate(date);
                checkoutDisplay.textContent = getTranslationPack().selectDate;
                bookingNights.style.display = 'none';
            } else {
                checkoutDate = date;
                selectionStep = 0;
                checkoutDisplay.textContent = formatDate(date);
                
                // Calculate nights
                const diffTime = checkoutDate - checkinDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                nightCount.textContent = diffDays;
                bookingNights.lastChild.textContent = ` ${getTranslationPack().nightsSuffix}`;
                bookingNights.style.display = 'block';
            }
        }
        renderCalendar();
    }

    function formatDate(date) {
        const months = getTranslationPack().months;
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    calendarPrev.addEventListener('click', () => {
        const now = new Date();
        if (currentYear === now.getFullYear() && currentMonth === now.getMonth()) return;
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    calendarNext.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();

    window.refreshCalendarLanguage = () => {
        const t = getTranslationPack();
        if (!checkinDate) checkinDisplay.textContent = t.selectDate;
        if (!checkoutDate) checkoutDisplay.textContent = t.selectDate;
        if (checkinDate && checkoutDate) {
            bookingNights.lastChild.textContent = ` ${t.nightsSuffix}`;
        }
        renderCalendar();
    };

    // Expose dates for form validation
    window.getBookingDates = () => ({ checkinDate, checkoutDate });
}

/* ===========================
   Booking Form
   =========================== */

function initBookingForm() {
    const submitBtn = document.getElementById('bookingSubmit');
    const modal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');

    submitBtn.addEventListener('click', () => {
        const dates = window.getBookingDates();
        const name = document.getElementById('guestName').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();

        // Validate
        if (!dates.checkinDate || !dates.checkoutDate) {
            shakeElement(document.querySelector('.booking-calendar'));
            return;
        }
        if (!name) {
            shakeElement(document.getElementById('guestName'));
            document.getElementById('guestName').focus();
            return;
        }
        if (!phone) {
            shakeElement(document.getElementById('guestPhone'));
            document.getElementById('guestPhone').focus();
            return;
        }

        // Build WhatsApp message
        const guestCount = document.getElementById('guestCount').value;
        const note = document.getElementById('guestNote').value.trim();

        const t = getTranslationPack();
        const checkinStr = dates.checkinDate.toLocaleDateString(t.locale);
        const checkoutStr = dates.checkoutDate.toLocaleDateString(t.locale);

        const message = `${t.bookingMessage.intro}
*${t.bookingMessage.name}:* ${name}
*${t.bookingMessage.phone}:* ${phone}
*${t.bookingMessage.checkin}:* ${checkinStr}
*${t.bookingMessage.checkout}:* ${checkoutStr}
*${t.bookingMessage.guests}:* ${guestCount}
*${t.bookingMessage.note}:* ${note ? note : t.bookingMessage.none}`;

        const whatsappUrl = `https://wa.me/905461955300?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Optional: still show the modal or just redirect. We will just redirect.

    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.5s ease';
    el.style.border = '2px solid #e74c3c';
    setTimeout(() => {
        el.style.border = '';
        el.style.animation = '';
    }, 2000);
}

const translations = {
    tr: {
        locale: 'tr-TR',
        code: 'TR',
        flag: '🇹🇷',
        langName: 'Türkçe',
        title: 'Hangalow | Ardeşen, Rize - Doğanın Kalbinde Huzur',
        description: "Hangalow - Rize Ardeşen'de doğayla iç içe, modern bungalow konaklama. Jakuzi, şömine, havuz, ücretsiz kahvaltı ve eşsiz deniz manzarası.",
        nav: ['Hakkımızda', 'Olanaklar', 'Galeri', 'Konum', 'Yorumlar', 'İletişim', 'Rezervasyon'],
        heroLocation: 'Ardeşen / Rize',
        heroTagline: "Karadeniz'in Kalbinde Huzurlu Bir Kaçış",
        heroExplore: 'KEŞFET',
        heroAlt: 'Hangalow teras ve deniz manzarası',
        logoAlt: 'Hangalow Logo',
        aboutTag: 'Hakkımızda',
        aboutTitle: "Yeşil ve Mavi'nin<br>Buluştuğu Nokta",
        aboutTexts: [
            "Doğanın tüm renklerini barındıran, Karadeniz'in eşsiz maviliğine karşı konumlanmış Hangalow'da, huzuru ve konforu bir arada sunuyoruz. Her sabah kuş sesleri ve deniz serinliği ile uyanacağınız unutulmaz bir deneyim sizi bekliyor.",
            '3 katlı özenle tasarlanmış bungalowumuzda, doğanın seslerine eşlik eden modern detaylar, sıcak atmosfer ve manzaraya açılan yaşam alanları ile keyifli bir konaklama sunuyoruz.',
            'Bungalowumuz, her katında ayrı yatak odası ve oturma alanı ile tasarlanmış olup, jakuzi, şömine, özel mutfak ve muhteşem deniz manzarasıyla misafirlerimize ev konforunu sunar.'
        ],
        aboutSlideAlts: ['Hangalow dış mekan', 'Hangalow iç mekan', 'Hangalow oturma alanı', 'Hangalow detay', 'Hangalow manzara', 'Hangalow akşam görünümü'],
        amenitiesTag: 'Olanaklar',
        amenitiesTitle: 'Konfor ve Hizmetler',
        amenitiesDesc: 'Konaklamayı kolaylaştıran temel detayları sade ve net bir düzende topladık; içerideki konfor ve dış mekandaki keyif birlikte akıyor.',
        amenitiesCards: [
            ['Özel Jakuzi', 'Manzara eşliğinde sakin bir rahatlama alanı sunar.'],
            ['Şömine', 'Akşam saatlerine sıcaklık katan sade iç mekan detayı.'],
            ['Isıtmalı Havuz', 'Dört mevsim kullanılabilen dış mekan keyfi sağlar.'],
            ['Ücretsiz Kahvaltı', 'Güne rahat ve düzenli bir başlangıç eşlik eder.'],
            ['Donanımlı Mutfak', 'Tabak, tencere ve hazırlık alanı bir arada sunulur.'],
            ['Wi-Fi', 'Hızlı ve kesintisiz internet bağlantısı.'],
            ['Özel Banyo', 'Kozmetik ürünleri ve saç kurutma ile tamamlanır.'],
            ['Klima', 'Her mevsime uygun oda sıcaklığı.'],
            ['Ücretsiz Otopark', 'Kolay giriş çıkış için tesis içinde alan sunar.']
        ],
        galleryTag: 'Galeri',
        galleryTitle: 'Anılarınızı Birlikte Oluşturalım',
        galleryFilters: [
            ['Tüm Galeri', '10 Kare'],
            ['İç Mekan', '5 Kare'],
            ['Dış Mekan & Manzara', '5 Kare']
        ],
        galleryZoom: 'Büyüt',
        galleryAlts: ['Yatak odası', 'Jakuzi', 'Banyo', 'Oturma alanı', 'Yatak odası 2', 'Teras manzarası', 'Kış manzarası', 'Teras', 'Kahvaltı', 'Dış görünüm'],
        policiesTitle: 'Giriş & Çıkış',
        policyEntry: 'Giriş Saati:',
        policyExit: 'Çıkış Saati:',
        policyImportant: 'Önemli Bilgiler',
        policyItems: [
            '18 yaş ve üzeri misafirler check-in işlemi yapabilir.',
            'Portatif/ilave yatak veya beşik (çocuk yatağı) mevcut değildir.',
            'Tesisimize evcil hayvan kabul edilmemektedir.',
            'Tüm odalarımızda ve kapalı alanlarımızda sigara kullanımı yasaktır.'
        ],
        locationTag: 'Konum & Çevre',
        locationTitle: 'Keşfedilecek Çok Yer Var',
        locationDesc: 'Hangalow; Ardeşen merkezine, doğa rotalarına ve bölgenin en sevilen manzaralarına kısa sürüş mesafesinde yer alır.',
        locationKicker: 'Deniz, dere ve yayla rotaları aynı hatta',
        locationHeader: 'Merkezi Noktalara Uzaklıklar',
        locationCopy: 'Güne sahilde başlayıp gün içinde Fırtına Vadisi, Ayder ve Kaçkar hattına uzanabileceğiniz dengeli bir konumda konaklayın.',
        locationNearby: [
            ['Ardeşen Limanı', 'Sahil hattı'],
            ['Fırtına Deresi', 'Doğa rotası'],
            ['Kız Kalesi', 'Tarihi durak'],
            ['Rize Havalimanı (RZV)', 'Kolay ulaşım'],
            ['Ayder Yaylası', 'Yayla kaçamağı'],
            ['Zil Kale', 'Panoramik rota'],
            ['Kaçkar Dağları Milli Parkı', 'Doğa keşfi']
        ],
        mapCardLabel: 'Konaklama Konumu',
        mapCardTitle: 'Merkeze yakın, manzaraya hakim bir başlangıç noktası',
        mapCardText: 'Karadeniz kıyısı, Fırtına Vadisi ve yayla rotaları arasında pratik bir geçiş sunar.',
        mapButton: 'Haritada Yol Tarifi Al',
        mapIframeTitle: 'Hangalow konumu',
        reviewsTag: 'Yorumlar',
        reviewsTitle: 'Misafirlerimiz Ne Diyor?',
        reviews: [
            ['"Geçirdiğimiz harika tatil için çok teşekkürler! Bungalovun manzarası gerçekten büyüleyiciydi, her sabah bu güzelliğe uyanmak inanılmazdı. İşletme sahibi son derece güler yüzlü ve ilgiliydi, kendimizi evimizde gibi hissettik. İlk fırsatta tekrar geleceğiz!"', 'Google · 1 yıl önce'],
            ['"Çay bahçelerinin tam arasında deniz manzarasına karşı konaklamak tarifsiz bir huzur verdi. Bungalov tertemizdi, ihtiyacımız olan her şey en ince ayrıntısına kadar düşünülmüştü. Isıtmalı havuz sayesinde yağmur yağarken bile yüzmek inanılmaz keyifliydi."', 'Google · 5 ay önce'],
            ['"İç mekanın tasarımı gerçekten büyüleyiciydi. Jakuzi oldukça büyük ve kaliteli. İçerideki soba, soğuk günlerde içimizi ısıttı. Bungalovun sahibi Han Bey, bizimle sürekli ilgilendi. İhtiyacımız olan her şey bir telefon kadar yakındı."', 'Google · 1 yıl önce'],
            ['"Hafta sonu kaçamağı için geldik, beklentimizin çok üzerinde bir yerdi. Bungalowlar temiz, rahat ve her şey düşünülmüş. Sessiz, huzurlu ve doğayla baş başa kalabileceğiniz harika bir ortam. Kesinlikle tekrar geleceğiz."', 'Google · 4 ay önce'],
            ['"Doğa ile iç içe bir yer. Tam aradığımız gibi. Ev sahibi çok anlayışlı ve yardımsever. Ulaşımı da kolay. İyi ki tercih etmişiz. Kesinlikle tavsiye ederim."', 'Google · 3 ay önce'],
            ['"Nevşehirden Hangalow için geldim ve geldiğime her anlamda değdi 🤍 Bölgede bu tip çok fazla ev var ama gördüğüm kadarıyla hiçbirinde böyle manzara ve huzur yok. Ruhunuz dinlensin istiyorsanız tercih edeceğiniz tek yer 🤍"', 'Google · 1 yıl önce']
        ],
        contactTag: 'İLETİŞİM',
        contactTitle: 'Bize Ulaşın',
        contactTypes: ['TELEFON', 'WHATSAPP', 'E-POSTA', 'INSTAGRAM'],
        bookingTag: 'Rezervasyon',
        bookingTitle: 'Huzurunuzu Planlayın',
        bookingDesc: 'Tarihinizi seçin ve unutulmaz bir konaklama deneyimi yaşayın',
        weekdays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        legend: ['Müsait', 'Seçili', 'Aralık'],
        checkinDate: 'Giriş Tarihi',
        checkoutDate: 'Çıkış Tarihi',
        selectDate: 'Tarih seçin',
        nightsSuffix: 'gece konaklama',
        bookingIntro: 'Tarihlerinizi seçin, iletişim bilgilerinizi bırakın; uygunluk ve detaylar için size kısa sürede dönüş yapalım.',
        formLabels: ['Ad Soyad', 'Telefon', 'E-posta', 'Misafir Sayısı', 'Not (İsteğe Bağlı)'],
        placeholders: ['Adınız ve soyadınız', '+90 5XX XXX XX XX', 'ornek@email.com', 'Özel istekleriniz varsa belirtebilirsiniz...'],
        guestOptions: ['1 Misafir', '2 Misafir', '3 Misafir', '4 Misafir', '5 Misafir', '6 Misafir'],
        bookingSubmit: 'Rezervasyon Talebi Gönder',
        bookingNote: '* Rezervasyon talebiniz en kısa sürede değerlendirilecek ve size dönüş yapılacaktır.',
        modalTitle: 'Rezervasyon Talebiniz Alındı!',
        modalText: 'En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.',
        modalButton: 'Tamam',
        footerLocationLabel: 'Konum',
        footerAddress: 'Merkez Mahallesi, Ardeşen / Rize',
        footerPhoneLabel: 'Telefon',
        footerEmailLabel: 'E-posta',
        footerCopy: '© 2026 Hangalow. Tüm hakları saklıdır.',
        bookingMessage: {
            intro: 'Merhaba Hangalow, bir rezervasyon talebim var:',
            name: 'İsim',
            phone: 'Telefon',
            checkin: 'Giriş Tarihi',
            checkout: 'Çıkış Tarihi',
            guests: 'Misafir Sayısı',
            note: 'Not',
            none: 'Yok'
        },
        aria: {
            language: 'Dil Seçimi',
            menu: 'Menü',
            prevMonth: 'Önceki Ay',
            nextMonth: 'Sonraki Ay',
            close: 'Kapat',
            prev: 'Önceki',
            next: 'Sonraki'
        },
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    },
    en: {
        locale: 'en-GB',
        code: 'EN',
        flag: '🇬🇧',
        langName: 'English',
        title: 'Hangalow | Ardesen, Rize - A Peaceful Stay in Nature',
        description: 'Hangalow - a stylish bungalow stay in Ardesen, Rize with a private jacuzzi, fireplace, heated pool, complimentary breakfast, and sweeping sea views.',
        nav: ['About', 'Amenities', 'Gallery', 'Location', 'Reviews', 'Contact', 'Booking'],
        heroLocation: 'Ardesen / Rize',
        heroTagline: 'A Restful Escape on the Black Sea Coast',
        heroExplore: 'EXPLORE',
        heroAlt: 'Hangalow terrace and sea view',
        logoAlt: 'Hangalow logo',
        aboutTag: 'About',
        aboutTitle: 'Where Green Meets Blue',
        aboutTexts: [
            'Set against the deep blue of the Black Sea and surrounded by lush nature, Hangalow brings together calm, comfort, and a view you will not forget. Each morning begins with birdsong, fresh air, and the quiet rhythm of the coast.',
            'Our thoughtfully designed three-level bungalow pairs warm interiors with modern comforts, creating a stay that feels both relaxed and refined.',
            'With separate bedrooms and lounge areas across each floor, plus a private jacuzzi, fireplace, kitchen, and open sea view, Hangalow offers the ease of home in a more memorable setting.'
        ],
        aboutSlideAlts: ['Hangalow exterior', 'Hangalow interior', 'Hangalow lounge area', 'Hangalow detail', 'Hangalow view', 'Hangalow evening view'],
        amenitiesTag: 'Amenities',
        amenitiesTitle: 'Comfort & Essentials',
        amenitiesDesc: 'Everything you need for a well-balanced stay, brought together in a calm and easy-to-read layout.',
        amenitiesCards: [
            ['Private Jacuzzi', 'A peaceful place to unwind with an open view.'],
            ['Fireplace', 'A warm interior touch for slower, quieter evenings.'],
            ['Heated Pool', 'Outdoor comfort that can be enjoyed in every season.'],
            ['Complimentary Breakfast', 'An easy and pleasant start to the day.'],
            ['Equipped Kitchen', 'Cookware, tableware, and prep space in one place.'],
            ['Wi-Fi', 'Fast and reliable internet throughout your stay.'],
            ['Private Bathroom', 'Finished with toiletries and a hair dryer.'],
            ['Air Conditioning', 'Comfortable room temperature in every season.'],
            ['Free Parking', 'On-site parking for an easy arrival and departure.']
        ],
        galleryTag: 'Gallery',
        galleryTitle: 'Moments Worth Keeping',
        galleryFilters: [['All Photos', '10 Images'], ['Interior', '5 Images'], ['Exterior & Views', '5 Images']],
        galleryZoom: 'Enlarge',
        galleryAlts: ['Bedroom', 'Jacuzzi', 'Bathroom', 'Lounge area', 'Bedroom 2', 'Terrace view', 'Winter view', 'Terrace', 'Breakfast', 'Exterior view'],
        policiesTitle: 'Check-in & Check-out',
        policyEntry: 'Check-in Time:',
        policyExit: 'Check-out Time:',
        policyImportant: 'Good to Know',
        policyItems: [
            'Guests aged 18 and over can complete check-in.',
            'Portable/extra beds or baby cots are not available.',
            'Pets are not allowed at the property.',
            'Smoking is prohibited in all rooms and indoor areas.'
        ],
        locationTag: 'Location & Surroundings',
        locationTitle: 'Plenty to Discover Nearby',
        locationDesc: 'Hangalow is just a short drive from Ardesen centre, nature routes, and some of the region’s best-loved viewpoints.',
        locationKicker: 'Sea, river, and highland routes within easy reach',
        locationHeader: 'Distances to Key Spots',
        locationCopy: 'Stay in a well-placed setting where you can begin the day by the coast and head out toward Firtina Valley, Ayder, and the Kackar Mountains with ease.',
        locationNearby: [
            ['Ardesen Port', 'Coastline'],
            ['Firtina River', 'Nature route'],
            ["Kiz Castle", 'Historic landmark'],
            ['Rize Airport (RZV)', 'Easy access'],
            ['Ayder Plateau', 'Highland escape'],
            ['Zil Castle', 'Panoramic route'],
            ['Kackar Mountains National Park', 'Nature escape']
        ],
        mapCardLabel: 'Property Location',
        mapCardTitle: 'A scenic base close to the centre',
        mapCardText: 'Well positioned between the Black Sea coast, Firtina Valley, and the surrounding highland routes.',
        mapButton: 'Get Directions',
        mapIframeTitle: 'Hangalow location',
        reviewsTag: 'Reviews',
        reviewsTitle: 'What Our Guests Say',
        reviews: [
            ['"Thank you so much for such a wonderful holiday! The view from the bungalow was truly breathtaking, and waking up to it every morning was incredible. The host was exceptionally kind and attentive, and we felt completely at home. We will definitely come back at the first opportunity!"', 'Google · 1 year ago'],
            ['"Staying among tea gardens with a sea view brought a kind of peace that is hard to describe. The bungalow was spotless, and every detail we needed had been carefully considered. Thanks to the heated pool, swimming even in the rain was an amazing experience."', 'Google · 5 months ago'],
            ['"The interior design was truly stunning. The jacuzzi was large and high quality. The stove kept us warm on cold days. The owner, Mr. Han, stayed in touch with us throughout our stay. Everything we needed was just one phone call away."', 'Google · 1 year ago'],
            ['"We came for a weekend getaway and it exceeded our expectations. The bungalows were clean, comfortable, and thoughtfully prepared. It is peaceful, quiet, and perfect if you want to be alone with nature. We will definitely return."', 'Google · 4 months ago'],
            ['"A place immersed in nature, exactly what we were looking for. The host was very understanding and helpful. It was easy to reach as well. We are so glad we chose it and would absolutely recommend it."', 'Google · 3 months ago'],
            ['"I came from Nevsehir for Hangalow and it was worth it in every way 🤍 There are many houses of this type in the area, but none of them seem to have this kind of view and peace. If you want your soul to rest, this is the only place to choose 🤍"', 'Google · 1 year ago']
        ],
        contactTag: 'CONTACT',
        contactTitle: 'Contact Us',
        contactTypes: ['PHONE', 'WHATSAPP', 'EMAIL', 'INSTAGRAM'],
        bookingTag: 'Booking',
        bookingTitle: 'Plan Your Stay',
        bookingDesc: 'Choose your dates and start planning a memorable stay at Hangalow.',
        weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        legend: ['Available', 'Selected', 'Range'],
        checkinDate: 'Check-in Date',
        checkoutDate: 'Check-out Date',
        selectDate: 'Select a date',
        nightsSuffix: 'nights',
        bookingIntro: 'Choose your dates and leave your contact details; we will get back to you shortly with availability and the next steps.',
        formLabels: ['Full Name', 'Phone', 'Email', 'Guest Count', 'Note (Optional)'],
        placeholders: ['Your full name', '+90 5XX XXX XX XX', 'example@email.com', 'If you have any special requests, you can mention them here...'],
        guestOptions: ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests'],
        bookingSubmit: 'Send Booking Request',
        bookingNote: '* We will review your request shortly and get back to you as soon as possible.',
        modalTitle: 'Your Booking Request Has Been Received!',
        modalText: 'We will contact you as soon as possible. Thank you.',
        modalButton: 'OK',
        footerLocationLabel: 'Location',
        footerAddress: 'Merkez Neighbourhood, Ardesen / Rize',
        footerPhoneLabel: 'Phone',
        footerEmailLabel: 'Email',
        footerCopy: '© 2026 Hangalow. All rights reserved.',
        bookingMessage: {
            intro: 'Hello Hangalow, I would like to make a booking request:',
            name: 'Name',
            phone: 'Phone',
            checkin: 'Check-in Date',
            checkout: 'Check-out Date',
            guests: 'Guest Count',
            note: 'Note',
            none: 'None'
        },
        aria: {
            language: 'Language Selection',
            menu: 'Menu',
            prevMonth: 'Previous Month',
            nextMonth: 'Next Month',
            close: 'Close',
            prev: 'Previous',
            next: 'Next'
        },
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    de: {
        locale: 'de-DE',
        code: 'DE',
        flag: '🇩🇪',
        langName: 'Deutsch',
        title: 'Hangalow | Ardesen, Rize - Ruhe mitten in der Natur',
        description: 'Hangalow - ein stilvoller Bungalow-Aufenthalt in Ardesen, Rize mit privatem Whirlpool, Kamin, beheiztem Pool, kostenlosem Frühstück und weitem Meerblick.',
        nav: ['Über uns', 'Ausstattung', 'Galerie', 'Lage', 'Bewertungen', 'Kontakt', 'Reservierung'],
        heroLocation: 'Ardesen / Rize',
        heroTagline: 'Ein ruhiger Rückzugsort an der Schwarzmeerküste',
        heroExplore: 'ENTDECKEN',
        heroAlt: 'Hangalow Terrasse mit Meerblick',
        logoAlt: 'Hangalow Logo',
        aboutTag: 'Über uns',
        aboutTitle: 'Wo Grün auf Blau trifft',
        aboutTexts: [
            'Im Hangalow treffen Ruhe, Komfort und Natur auf ganz natürliche Weise zusammen. Zwischen sattem Grün und dem tiefen Blau des Schwarzen Meeres beginnt jeder Morgen mit Vogelstimmen, frischer Luft und einem offenen Blick ins Freie.',
            'Unser liebevoll gestalteter Bungalow auf drei Ebenen verbindet warme Atmosphäre mit modernen Details und schafft so einen Aufenthalt, der entspannt und stilvoll zugleich wirkt.',
            'Mit separaten Schlaf- und Wohnbereichen auf jeder Etage, dazu Whirlpool, Kamin, privater Küche und weitem Meerblick bietet Hangalow den Komfort eines Zuhauses in besonderer Lage.'
        ],
        aboutSlideAlts: ['Hangalow Außenbereich', 'Hangalow Innenbereich', 'Hangalow Sitzbereich', 'Hangalow Detail', 'Hangalow Aussicht', 'Hangalow Abendansicht'],
        amenitiesTag: 'Ausstattung',
        amenitiesTitle: 'Komfort & Ausstattung',
        amenitiesDesc: 'Alles, was einen angenehmen Aufenthalt ausmacht, in einer klaren und ruhigen Struktur zusammengefasst.',
        amenitiesCards: [
            ['Privater Whirlpool', 'Ein ruhiger Ort zum Abschalten mit freiem Ausblick.'],
            ['Kamin', 'Ein warmer Akzent für lange, ruhige Abende.'],
            ['Beheizter Pool', 'Außenbereichskomfort, der zu jeder Jahreszeit passt.'],
            ['Kostenloses Frühstück', 'Ein angenehmer und unkomplizierter Start in den Tag.'],
            ['Ausgestattete Küche', 'Kochgeschirr, Geschirr und Arbeitsfläche an einem Ort.'],
            ['WLAN', 'Schnelles und verlässliches Internet während des gesamten Aufenthalts.'],
            ['Privates Bad', 'Mit Pflegeprodukten und Haartrockner ausgestattet.'],
            ['Klimaanlage', 'Angenehme Raumtemperatur in jeder Jahreszeit.'],
            ['Kostenloser Parkplatz', 'Parken auf dem Gelände für eine entspannte An- und Abreise.']
        ],
        galleryTag: 'Galerie',
        galleryTitle: 'Momente, die bleiben',
        galleryFilters: [['Alle Fotos', '10 Bilder'], ['Innenbereich', '5 Bilder'], ['Außenbereich & Aussicht', '5 Bilder']],
        galleryZoom: 'Vergrößern',
        galleryAlts: ['Schlafzimmer', 'Whirlpool', 'Badezimmer', 'Sitzbereich', 'Schlafzimmer 2', 'Terrassenblick', 'Winterblick', 'Terrasse', 'Frühstück', 'Außenansicht'],
        policiesTitle: 'An- & Abreise',
        policyEntry: 'Anreise ab:',
        policyExit: 'Abreise bis:',
        policyImportant: 'Wichtige Informationen',
        policyItems: [
            'Gäste ab 18 Jahren können einchecken.',
            'Zusatzbetten oder Babybetten sind nicht verfügbar.',
            'Haustiere sind nicht erlaubt.',
            'Rauchen ist in allen Zimmern und Innenbereichen verboten.'
        ],
        locationTag: 'Lage & Umgebung',
        locationTitle: 'Vieles zu entdecken',
        locationDesc: 'Hangalow liegt nur wenige Fahrminuten vom Zentrum von Ardesen, Naturwegen und den beliebtesten Aussichtspunkten der Region entfernt.',
        locationKicker: 'Meer, Fluss und Hochland ganz nah beieinander',
        locationHeader: 'Entfernungen zu wichtigen Orten',
        locationCopy: 'Ein gut gelegener Ausgangspunkt, von dem aus Sie am Meer starten und weiter ins Firtina-Tal, nach Ayder und in die Kackar-Berge aufbrechen können.',
        locationNearby: [
            ['Hafen von Ardesen', 'Küstenlinie'],
            ['Firtina-Fluss', 'Naturroute'],
            ['Mädchenschloss', 'Historischer Halt'],
            ['Flughafen Rize (RZV)', 'Leichte Anreise'],
            ['Ayder-Hochebene', 'Ausflug in die Hochebene'],
            ['Zil-Burg', 'Panoramaroute'],
            ['Nationalpark Kackar-Gebirge', 'Naturerlebnis']
        ],
        mapCardLabel: 'Lage der Unterkunft',
        mapCardTitle: 'Ein aussichtsreicher Ausgangspunkt nahe dem Zentrum',
        mapCardText: 'Praktisch gelegen zwischen Schwarzmeerküste, Firtina-Tal und den Routen in die Hochebenen.',
        mapButton: 'Route anzeigen',
        mapIframeTitle: 'Hangalow Standort',
        reviewsTag: 'Bewertungen',
        reviewsTitle: 'Was unsere Gäste sagen',
        reviews: [
            ['"Vielen Dank für diesen wunderbaren Urlaub! Die Aussicht vom Bungalow war wirklich atemberaubend, und jeden Morgen damit aufzuwachen war unglaublich. Der Gastgeber war äußerst freundlich und aufmerksam, sodass wir uns wie zu Hause fühlten. Wir kommen bei der nächsten Gelegenheit wieder!"', 'Google · vor 1 Jahr'],
            ['"Zwischen den Teegärten mit Meerblick zu übernachten war eine unbeschreibliche Ruhe. Der Bungalow war makellos sauber, und an jedes Detail war gedacht. Dank des beheizten Pools war sogar das Schwimmen im Regen ein großartiges Erlebnis."', 'Google · vor 5 Monaten'],
            ['"Das Innendesign war wirklich beeindruckend. Der Jacuzzi war groß und hochwertig. Der Ofen hielt uns an kalten Tagen warm. Der Eigentümer, Herr Han, kümmerte sich ständig um uns. Alles, was wir brauchten, war nur einen Anruf entfernt."', 'Google · vor 1 Jahr'],
            ['"Wir kamen für einen Wochenendausflug und es war weit besser als erwartet. Die Bungalows waren sauber, komfortabel und durchdacht. Ruhig, friedlich und perfekt, um mit der Natur allein zu sein. Wir werden definitiv wiederkommen."', 'Google · vor 4 Monaten'],
            ['"Ein Ort mitten in der Natur, genau wie wir es gesucht haben. Der Gastgeber war sehr verständnisvoll und hilfsbereit. Auch die Anreise war einfach. Wir sind sehr froh, dass wir uns dafür entschieden haben, und empfehlen es auf jeden Fall weiter."', 'Google · vor 3 Monaten'],
            ['"Ich bin extra aus Nevsehir für Hangalow gekommen und es hat sich in jeder Hinsicht gelohnt 🤍 In der Region gibt es viele ähnliche Häuser, aber keines davon scheint diese Aussicht und diese Ruhe zu haben. Wenn Ihre Seele zur Ruhe kommen soll, ist dies der richtige Ort 🤍"', 'Google · vor 1 Jahr']
        ],
        contactTag: 'KONTAKT',
        contactTitle: 'Kontakt',
        contactTypes: ['TELEFON', 'WHATSAPP', 'E-MAIL', 'INSTAGRAM'],
        bookingTag: 'Reservierung',
        bookingTitle: 'Aufenthalt planen',
        bookingDesc: 'Wählen Sie Ihre Daten und planen Sie eine unvergessliche Auszeit im Hangalow.',
        weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        legend: ['Verfügbar', 'Ausgewählt', 'Zeitraum'],
        checkinDate: 'Anreisedatum',
        checkoutDate: 'Abreisedatum',
        selectDate: 'Datum wählen',
        nightsSuffix: 'Nächte',
        bookingIntro: 'Wählen Sie Ihre Daten und hinterlassen Sie Ihre Kontaktdaten; wir melden uns zeitnah mit Verfügbarkeit und den nächsten Schritten.',
        formLabels: ['Vor- und Nachname', 'Telefon', 'E-Mail', 'Anzahl Gäste', 'Notiz (Optional)'],
        placeholders: ['Ihr Vor- und Nachname', '+90 5XX XXX XX XX', 'beispiel@email.com', 'Falls Sie besondere Wünsche haben, können Sie sie hier angeben...'],
        guestOptions: ['1 Gast', '2 Gäste', '3 Gäste', '4 Gäste', '5 Gäste', '6 Gäste'],
        bookingSubmit: 'Reservierungsanfrage senden',
        bookingNote: '* Wir prüfen Ihre Anfrage schnellstmöglich und melden uns zeitnah bei Ihnen.',
        modalTitle: 'Ihre Reservierungsanfrage wurde erhalten!',
        modalText: 'Wir werden uns so schnell wie möglich bei Ihnen melden. Danke.',
        modalButton: 'OK',
        footerLocationLabel: 'Lage',
        footerAddress: 'Stadtteil Merkez, Ardesen / Rize',
        footerPhoneLabel: 'Telefon',
        footerEmailLabel: 'E-Mail',
        footerCopy: '© 2026 Hangalow. Alle Rechte vorbehalten.',
        bookingMessage: {
            intro: 'Hallo Hangalow, ich möchte eine Reservierungsanfrage senden:',
            name: 'Name',
            phone: 'Telefon',
            checkin: 'Anreise',
            checkout: 'Abreise',
            guests: 'Anzahl Gäste',
            note: 'Notiz',
            none: 'Keine'
        },
        aria: {
            language: 'Sprachauswahl',
            menu: 'Menü',
            prevMonth: 'Vorheriger Monat',
            nextMonth: 'Nächster Monat',
            close: 'Schließen',
            prev: 'Zurück',
            next: 'Weiter'
        },
        months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    },
    ru: {
        locale: 'ru-RU',
        code: 'RU',
        flag: '🇷🇺',
        langName: 'Русский',
        title: 'Hangalow | Ардешен, Ризе - спокойный отдых среди природы',
        description: 'Hangalow - стильное бунгало в Ардешене, Ризе с частным джакузи, камином, бассейном с подогревом, бесплатным завтраком и просторным видом на море.',
        nav: ['О нас', 'Удобства', 'Галерея', 'Локация', 'Отзывы', 'Контакты', 'Бронирование'],
        heroLocation: 'Ардешен / Ризе',
        heroTagline: 'Спокойный отдых на побережье Чёрного моря',
        heroExplore: 'ОТКРЫТЬ',
        heroAlt: 'Терраса Hangalow с видом на море',
        logoAlt: 'Логотип Hangalow',
        aboutTag: 'О нас',
        aboutTitle: 'Где встречаются зелень и море',
        aboutTexts: [
            'В Hangalow природа, тишина и комфорт складываются в по-настоящему цельный отдых. Здесь, среди зелени и рядом с Чёрным морем, каждое утро начинается с пения птиц, свежего воздуха и чувства спокойствия.',
            'Наш трёхуровневый бунгало продуман до мелочей: тёплая атмосфера, современные детали и жилые пространства с видом создают расслабленный и уютный ритм отдыха.',
            'Отдельные спальни и зоны отдыха на каждом этаже, а также джакузи, камин, собственная кухня и открытый вид на море дарят ощущение домашнего комфорта в особенной локации.'
        ],
        aboutSlideAlts: ['Внешний вид Hangalow', 'Интерьер Hangalow', 'Зона отдыха Hangalow', 'Деталь Hangalow', 'Вид Hangalow', 'Вечерний вид Hangalow'],
        amenitiesTag: 'Удобства',
        amenitiesTitle: 'Комфорт и удобства',
        amenitiesDesc: 'Всё, что делает отдых удобным и приятным, собрано здесь в спокойной и понятной подаче.',
        amenitiesCards: [
            ['Частное джакузи', 'Спокойное место для отдыха с открытым видом.'],
            ['Камин', 'Тёплый акцент интерьера для уютных вечеров.'],
            ['Бассейн с подогревом', 'Комфорт на открытом воздухе в любое время года.'],
            ['Бесплатный завтрак', 'Приятное и лёгкое начало дня.'],
            ['Оснащённая кухня', 'Посуда, кухонная утварь и место для приготовления в одном пространстве.'],
            ['Wi‑Fi', 'Быстрый и стабильный интернет на всём протяжении отдыха.'],
            ['Собственная ванная', 'С косметическими принадлежностями и феном.'],
            ['Кондиционер', 'Комфортная температура в любое время года.'],
            ['Бесплатная парковка', 'Парковка на территории для удобного заезда и выезда.']
        ],
        galleryTag: 'Галерея',
        galleryTitle: 'Моменты, которые хочется сохранить',
        galleryFilters: [['Все фото', '10 фото'], ['Интерьер', '5 фото'], ['Экстерьер и виды', '5 фото']],
        galleryZoom: 'Увеличить',
        galleryAlts: ['Спальня', 'Джакузи', 'Ванная', 'Зона отдыха', 'Спальня 2', 'Вид с террасы', 'Зимний вид', 'Терраса', 'Завтрак', 'Внешний вид'],
        policiesTitle: 'Заезд и выезд',
        policyEntry: 'Время заезда:',
        policyExit: 'Время выезда:',
        policyImportant: 'Важная информация',
        policyItems: [
            'Заселение доступно для гостей от 18 лет.',
            'Дополнительные кровати и детские кроватки не предоставляются.',
            'Размещение с домашними животными не допускается.',
            'Курение запрещено во всех номерах и закрытых помещениях.'
        ],
        locationTag: 'Локация и окрестности',
        locationTitle: 'Рядом так много интересного',
        locationDesc: 'Hangalow находится всего в нескольких минутах езды от центра Ардешена, природных маршрутов и самых красивых панорам региона.',
        locationKicker: 'Море, река и высокогорные маршруты рядом друг с другом',
        locationHeader: 'Расстояния до ключевых мест',
        locationCopy: 'Удобная точка для отдыха, откуда легко начать день у побережья, а затем отправиться в долину Фыртына, Айдер и к горам Качкар.',
        locationNearby: [
            ['Порт Ардешен', 'Береговая линия'],
            ['Река Фыртына', 'Природный маршрут'],
            ['Девичья крепость', 'Историческая остановка'],
            ['Аэропорт Ризе (RZV)', 'Удобный доступ'],
            ['Плато Айдер', 'Поездка в горы'],
            ['Крепость Зил', 'Панорамный маршрут'],
            ['Национальный парк Качкар', 'Отдых на природе']
        ],
        mapCardLabel: 'Расположение проживания',
        mapCardTitle: 'Удобная точка рядом с центром и лучшими видами',
        mapCardText: 'Хорошее расположение между побережьем Чёрного моря, долиной Фыртына и маршрутами к плато.',
        mapButton: 'Маршрут на карте',
        mapIframeTitle: 'Расположение Hangalow',
        reviewsTag: 'Отзывы',
        reviewsTitle: 'Что говорят наши гости',
        reviews: [
            ['"Большое спасибо за прекрасный отдых! Вид из бунгало был действительно потрясающим, и просыпаться с ним каждое утро было невероятно. Хозяин был очень дружелюбным и внимательным, и мы чувствовали себя как дома. Обязательно приедем снова при первой возможности!"', 'Google · 1 год назад'],
            ['"Остановиться среди чайных садов с видом на море было невероятно умиротворяюще. Бунгало было безупречно чистым, и каждая деталь была продумана. Благодаря бассейну с подогревом плавать под дождём было особенно приятно."', 'Google · 5 месяцев назад'],
            ['"Дизайн интерьера был действительно впечатляющим. Джакузи большое и качественное. Печь согревала нас в холодные дни. Хозяин, господин Хан, всегда был на связи. Всё, что нам было нужно, находилось на расстоянии одного звонка."', 'Google · 1 год назад'],
            ['"Мы приехали на выходные, и место превзошло все ожидания. Бунгало были чистыми, удобными, и было видно, что всё продумано. Тихое, спокойное место для отдыха наедине с природой. Мы обязательно вернёмся."', 'Google · 4 месяца назад'],
            ['"Место полностью среди природы, именно то, что мы искали. Хозяин очень понимающий и отзывчивый. Добраться тоже легко. Очень рады, что выбрали именно это место, и точно рекомендуем его."', 'Google · 3 месяца назад'],
            ['"Я приехал из Невшехира ради Hangalow, и это полностью того стоило 🤍 В этом регионе много похожих домов, но ни в одном из них, насколько я видел, нет такого вида и покоя. Если вы хотите отдохнуть душой, это именно то место 🤍"', 'Google · 1 год назад']
        ],
        contactTag: 'КОНТАКТЫ',
        contactTitle: 'Связаться с нами',
        contactTypes: ['ТЕЛЕФОН', 'WHATSAPP', 'ЭЛ. ПОЧТА', 'INSTAGRAM'],
        bookingTag: 'Бронирование',
        bookingTitle: 'Планируйте отдых',
        bookingDesc: 'Выберите даты и начните планировать незабываемый отдых в Hangalow.',
        weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        legend: ['Свободно', 'Выбрано', 'Период'],
        checkinDate: 'Дата заезда',
        checkoutDate: 'Дата выезда',
        selectDate: 'Выберите дату',
        nightsSuffix: 'ночей',
        bookingIntro: 'Выберите даты и оставьте контактные данные; мы скоро свяжемся с вами по поводу наличия мест и дальнейших деталей.',
        formLabels: ['Имя и фамилия', 'Телефон', 'Эл. почта', 'Количество гостей', 'Примечание (необязательно)'],
        placeholders: ['Ваше имя и фамилия', '+90 5XX XXX XX XX', 'example@email.com', 'Если у вас есть особые пожелания, можете указать их здесь...'],
        guestOptions: ['1 гость', '2 гостя', '3 гостя', '4 гостя', '5 гостей', '6 гостей'],
        bookingSubmit: 'Отправить запрос на бронирование',
        bookingNote: '* Мы рассмотрим ваш запрос в ближайшее время и свяжемся с вами как можно скорее.',
        modalTitle: 'Ваш запрос на бронирование получен!',
        modalText: 'Мы свяжемся с вами как можно скорее. Спасибо.',
        modalButton: 'ОК',
        footerLocationLabel: 'Локация',
        footerAddress: 'Район Меркез, Ардешен / Ризе',
        footerPhoneLabel: 'Телефон',
        footerEmailLabel: 'Эл. почта',
        footerCopy: '© 2026 Hangalow. Все права защищены.',
        bookingMessage: {
            intro: 'Здравствуйте, Hangalow, я хотел(а) бы отправить запрос на бронирование:',
            name: 'Имя',
            phone: 'Телефон',
            checkin: 'Дата заезда',
            checkout: 'Дата выезда',
            guests: 'Количество гостей',
            note: 'Примечание',
            none: 'Нет'
        },
        aria: {
            language: 'Выбор языка',
            menu: 'Меню',
            prevMonth: 'Предыдущий месяц',
            nextMonth: 'Следующий месяц',
            close: 'Закрыть',
            prev: 'Предыдущий',
            next: 'Следующий'
        },
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    },
    ar: {
        locale: 'ar',
        code: 'AR',
        flag: '🇸🇦',
        langName: 'العربية',
        title: 'Hangalow | أرديشن، ريزه - إقامة هادئة وسط الطبيعة',
        description: 'Hangalow - إقامة أنيقة في بنغالو بأرديشن، ريزه مع جاكوزي خاص ومدفأة ومسبح دافئ وفطور مجاني وإطلالة بحرية واسعة.',
        nav: ['من نحن', 'المرافق', 'المعرض', 'الموقع', 'التقييمات', 'التواصل', 'الحجز'],
        heroLocation: 'أرديشن / ريزه',
        heroTagline: 'ملاذ هادئ على ساحل البحر الأسود',
        heroExplore: 'اكتشف',
        heroAlt: 'تراس Hangalow مع إطلالة على البحر',
        logoAlt: 'شعار Hangalow',
        aboutTag: 'من نحن',
        aboutTitle: 'حيث يلتقي الأخضر بالأزرق',
        aboutTexts: [
            'في Hangalow تجتمع الطبيعة والهدوء والراحة في تجربة إقامة متوازنة ومريحة. بين الخضرة الكثيفة وزرقة البحر الأسود، يبدأ كل صباح بأصوات الطيور والهواء المنعش وإحساس واضح بالسكينة.',
            'البنغالو المصمم بعناية على ثلاثة طوابق يجمع بين التفاصيل الحديثة والأجواء الدافئة ومساحات المعيشة المفتوحة على الإطلالة.',
            'ومع غرف نوم مستقلة ومساحات جلوس في كل طابق، إلى جانب الجاكوزي والمدفأة والمطبخ الخاص والإطلالة البحرية المفتوحة، يمنحك Hangalow راحة المنزل في موقع مميز.'
        ],
        aboutSlideAlts: ['الواجهة الخارجية لـ Hangalow', 'الداخل في Hangalow', 'منطقة الجلوس في Hangalow', 'تفاصيل Hangalow', 'إطلالة Hangalow', 'إطلالة Hangalow المسائية'],
        amenitiesTag: 'المرافق',
        amenitiesTitle: 'الراحة والمرافق',
        amenitiesDesc: 'كل ما يجعل الإقامة مريحة ومتكاملة، ضمن عرض هادئ وواضح وسهل القراءة.',
        amenitiesCards: [
            ['جاكوزي خاص', 'مساحة هادئة للاسترخاء مع إطلالة مفتوحة.'],
            ['مدفأة', 'لمسة داخلية دافئة لأمسيات أكثر هدوءاً.'],
            ['مسبح دافئ', 'راحة خارجية يمكن الاستمتاع بها في جميع الفصول.'],
            ['فطور مجاني', 'بداية مريحة ولطيفة لليوم.'],
            ['مطبخ مجهز', 'أوانٍ وأدوات ومساحة تحضير في مكان واحد.'],
            ['Wi‑Fi', 'اتصال سريع ومستقر طوال فترة الإقامة.'],
            ['حمام خاص', 'مجهز بمستلزمات العناية ومجفف للشعر.'],
            ['تكييف', 'درجة حرارة مريحة في كل الفصول.'],
            ['موقف مجاني', 'موقف داخل المنشأة لسهولة الوصول والمغادرة.']
        ],
        galleryTag: 'المعرض',
        galleryTitle: 'لحظات تستحق أن تبقى',
        galleryFilters: [['كل المعرض', '10 صور'], ['الداخل', '5 صور'], ['الخارج والإطلالة', '5 صور']],
        galleryZoom: 'تكبير',
        galleryAlts: ['غرفة نوم', 'جاكوزي', 'حمام', 'منطقة جلوس', 'غرفة نوم 2', 'إطلالة التراس', 'إطلالة شتوية', 'تراس', 'فطور', 'المظهر الخارجي'],
        policiesTitle: 'الدخول والخروج',
        policyEntry: 'وقت الدخول:',
        policyExit: 'وقت الخروج:',
        policyImportant: 'معلومات مهمة',
        policyItems: [
            'يمكن للضيوف بعمر 18 سنة فما فوق إتمام تسجيل الدخول.',
            'لا تتوفر أسرّة إضافية أو أسرّة أطفال.',
            'لا يُسمح بالحيوانات الأليفة.',
            'التدخين ممنوع في جميع الغرف والأماكن الداخلية.'
        ],
        locationTag: 'الموقع والمحيط',
        locationTitle: 'هناك الكثير لاكتشافه',
        locationDesc: 'يقع Hangalow على بعد مسافة قصيرة بالسيارة من مركز أرديشن ومسارات الطبيعة وأجمل الإطلالات في المنطقة.',
        locationKicker: 'البحر والنهر والمرتفعات ضمن نطاق سهل الوصول',
        locationHeader: 'المسافات إلى النقاط الرئيسية',
        locationCopy: 'موقع مريح يتيح لك بدء يومك على الساحل ثم متابعة الطريق بسهولة نحو وادي فيرتينا وآيدر وجبال كاتشكار.',
        locationNearby: [
            ['ميناء أرديشن', 'الخط الساحلي'],
            ['نهر فرتينا', 'مسار طبيعي'],
            ['قلعة الفتاة', 'محطة تاريخية'],
            ['مطار ريزه (RZV)', 'وصول سهل'],
            ['هضبة آيدر', 'رحلة إلى المرتفعات'],
            ['قلعة زيل', 'مسار بانورامي'],
            ['الحديقة الوطنية لجبال كاتشكار', 'تجربة طبيعية']
        ],
        mapCardLabel: 'موقع الإقامة',
        mapCardTitle: 'نقطة إقامة قريبة من المركز ومفتوحة على الإطلالة',
        mapCardText: 'موقع عملي بين ساحل البحر الأسود ووادي فيرتينا وطرق المرتفعات.',
        mapButton: 'الحصول على الاتجاهات',
        mapIframeTitle: 'موقع Hangalow',
        reviewsTag: 'التقييمات',
        reviewsTitle: 'ماذا يقول ضيوفنا؟',
        reviews: [
            ['"شكراً جزيلاً على هذه العطلة الرائعة! كان منظر البنغالو مذهلاً حقاً، والاستيقاظ عليه كل صباح كان تجربة لا تُنسى. كان صاحب المكان ودوداً للغاية ومهتماً بكل التفاصيل، وشعرنا وكأننا في منزلنا. سنعود بالتأكيد في أول فرصة!"', 'Google · منذ سنة'],
            ['"الإقامة بين مزارع الشاي مع إطلالة على البحر منحتنا هدوءاً لا يوصف. كان البنغالو نظيفاً جداً، وكل ما نحتاجه كان مدروساً بعناية. وبفضل المسبح الدافئ، كان السباحة أثناء المطر ممتعاً للغاية."', 'Google · منذ 5 أشهر'],
            ['"كان تصميم الداخل مبهراً فعلاً. الجاكوزي كبير وعالي الجودة. والمدفأة جعلتنا نشعر بالدفء في الأيام الباردة. كان صاحب المكان، السيد هان، على تواصل دائم معنا. كل ما احتجناه كان قريباً جداً."', 'Google · منذ سنة'],
            ['"جئنا لعطلة نهاية أسبوع وكان المكان أفضل بكثير مما توقعنا. البنغالو نظيف ومريح وكل شيء مدروس. مكان هادئ ومريح ومثالي لمن يريد قضاء وقت مع الطبيعة. سنعود بالتأكيد."', 'Google · منذ 4 أشهر'],
            ['"مكان وسط الطبيعة تماماً كما كنا نبحث عنه. صاحب المكان متفهم ومتعاون جداً. كما أن الوصول إليه سهل. نحن سعداء جداً باختيارنا له ونوصي به بالتأكيد."', 'Google · منذ 3 أشهر'],
            ['"جئت من نوشهير من أجل Hangalow وكان الأمر يستحق ذلك بكل معنى الكلمة 🤍 هناك الكثير من البيوت المشابهة في المنطقة، لكن لا شيء منها يملك هذا المنظر وهذا الهدوء. إذا كنتم تريدون راحة الروح فهذا هو المكان الوحيد المناسب 🤍"', 'Google · منذ سنة']
        ],
        contactTag: 'تواصل',
        contactTitle: 'تواصل معنا',
        contactTypes: ['الهاتف', 'واتساب', 'البريد الإلكتروني', 'إنستغرام'],
        bookingTag: 'الحجز',
        bookingTitle: 'خطط لإقامتك',
        bookingDesc: 'اختر تواريخك وابدأ التخطيط لإقامة لا تُنسى في Hangalow.',
        weekdays: ['الإث', 'الث', 'الأر', 'الخ', 'الجم', 'الس', 'الأح'],
        legend: ['متاح', 'محدد', 'نطاق'],
        checkinDate: 'تاريخ الدخول',
        checkoutDate: 'تاريخ الخروج',
        selectDate: 'اختر التاريخ',
        nightsSuffix: 'ليالٍ للإقامة',
        bookingIntro: 'اختر تواريخك واترك معلومات التواصل؛ وسنعود إليك قريباً بالتوفر والتفاصيل التالية.',
        formLabels: ['الاسم الكامل', 'الهاتف', 'البريد الإلكتروني', 'عدد الضيوف', 'ملاحظة (اختياري)'],
        placeholders: ['اسمك الكامل', '+90 5XX XXX XX XX', 'example@email.com', 'إذا كانت لديكم طلبات خاصة يمكنكم كتابتها هنا...'],
        guestOptions: ['ضيف 1', 'ضيفان 2', '3 ضيوف', '4 ضيوف', '5 ضيوف', '6 ضيوف'],
        bookingSubmit: 'إرسال طلب الحجز',
        bookingNote: '* سنراجع طلبك ونتواصل معك في أقرب وقت ممكن.',
        modalTitle: 'تم استلام طلب الحجز!',
        modalText: 'سنتواصل معكم في أقرب وقت ممكن. شكراً لكم.',
        modalButton: 'حسناً',
        footerLocationLabel: 'الموقع',
        footerAddress: 'حي المركز، أرديشن / ريزه',
        footerPhoneLabel: 'الهاتف',
        footerEmailLabel: 'البريد الإلكتروني',
        footerCopy: '© 2026 Hangalow. جميع الحقوق محفوظة.',
        bookingMessage: {
            intro: 'مرحباً Hangalow، أود إرسال طلب حجز:',
            name: 'الاسم',
            phone: 'الهاتف',
            checkin: 'تاريخ الدخول',
            checkout: 'تاريخ الخروج',
            guests: 'عدد الضيوف',
            note: 'ملاحظة',
            none: 'لا يوجد'
        },
        aria: {
            language: 'اختيار اللغة',
            menu: 'القائمة',
            prevMonth: 'الشهر السابق',
            nextMonth: 'الشهر التالي',
            close: 'إغلاق',
            prev: 'السابق',
            next: 'التالي'
        },
        months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    }
};

function getCurrentLanguage() {
    return window.__currentLanguage || 'tr';
}

function getTranslationPack(lang = getCurrentLanguage()) {
    return translations[lang] || translations.tr;
}

function initLanguage() {
    const params = new URLSearchParams(window.location.search);
    const saved = localStorage.getItem('hangalow-language');
    const requested = params.get('lang');
    const initialLang = translations[requested] ? requested : (translations[saved] ? saved : 'tr');

    document.querySelectorAll('.lang-menu a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href') || '';
            const linkLang = new URLSearchParams(href.split('?')[1] || '').get('lang') || 'tr';
            applyLanguage(linkLang);
            history.replaceState({}, '', `${window.location.pathname}?lang=${linkLang}`);
            document.querySelector('.lang-selector')?.classList.remove('active');
        });
    });

    applyLanguage(initialLang);
}

function applyLanguage(lang) {
    const t = getTranslationPack(lang);
    window.__currentLanguage = lang;
    localStorage.setItem('hangalow-language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    document.title = t.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t.description);

    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.setAttribute('aria-label', t.aria.language);
        const svg = langBtn.querySelector('svg');
        langBtn.innerHTML = `<span class="lang-flag">${t.flag}</span> ${t.code}`;
        if (svg) langBtn.appendChild(svg);
    }

    const navToggle = document.getElementById('navToggle');
    if (navToggle) navToggle.setAttribute('aria-label', t.aria.menu);

    document.querySelectorAll('.lang-menu a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const linkLang = new URLSearchParams(href.split('?')[1] || '').get('lang') || 'tr';
        link.classList.toggle('active', linkLang === lang);
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    t.nav.forEach((text, index) => {
        if (navLinks[index]) navLinks[index].textContent = text;
    });

    setText('.hero-location', t.heroLocation);
    setText('.hero-tagline', t.heroTagline);
    setText('.hero-scroll span', t.heroExplore);
    const heroImage = document.querySelector('.hero-bg img');
    if (heroImage) heroImage.alt = t.heroAlt;
    document.querySelectorAll('.preloader-logo, .logo-img, .footer-logo-img').forEach((img) => {
        img.alt = t.logoAlt;
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        setText('#about .section-tag', t.aboutTag);
        setHTML('#about .section-title', t.aboutTitle);
        const aboutTexts = aboutSection.querySelectorAll('.about-text');
        t.aboutTexts.forEach((text, index) => {
            if (aboutTexts[index]) aboutTexts[index].textContent = text;
        });
        const aboutImages = aboutSection.querySelectorAll('.swiper-slide img');
        t.aboutSlideAlts?.forEach((text, index) => {
            if (aboutImages[index]) aboutImages[index].alt = text;
        });
    }

    const amenitiesSection = document.getElementById('amenities');
    if (amenitiesSection) {
        setText('#amenities .section-tag', t.amenitiesTag);
        setText('#amenities .section-title', t.amenitiesTitle);
        setText('#amenities .section-desc', t.amenitiesDesc);
        const cards = amenitiesSection.querySelectorAll('.amenity-feature-card');
        t.amenitiesCards.forEach(([title, desc], index) => {
            if (!cards[index]) return;
            const heading = cards[index].querySelector('h3');
            const body = cards[index].querySelector('p');
            if (heading) heading.textContent = title;
            if (body) body.textContent = desc;
        });
    }

    setText('#gallery .section-tag', t.galleryTag);
    setText('#gallery .section-title', t.galleryTitle);
    document.querySelectorAll('.gallery-filters .filter-btn').forEach((btn, index) => {
        const text = t.galleryFilters[index];
        if (!text) return;
        const span = btn.querySelector('span');
        const small = btn.querySelector('small');
        if (span) span.textContent = text[0];
        if (small) small.textContent = text[1];
    });
    document.querySelectorAll('.gallery-overlay span').forEach((el) => {
        el.textContent = t.galleryZoom;
    });
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        if (t.galleryAlts?.[index]) img.alt = t.galleryAlts[index];
    });

    setText('.policies .policy-card:first-child h3', t.policiesTitle);
    const timeLabels = document.querySelectorAll('.times strong');
    if (timeLabels[0]) timeLabels[0].textContent = t.policyEntry;
    if (timeLabels[1]) timeLabels[1].textContent = t.policyExit;
    setText('.policies .policy-card:last-child h3', t.policyImportant);
    document.querySelectorAll('.policies .policy-card:last-child li').forEach((item, index) => {
        if (t.policyItems[index]) item.textContent = t.policyItems[index];
    });

    setText('#location .section-tag', t.locationTag);
    setText('#location .section-title', t.locationTitle);
    setText('#location .section-desc', t.locationDesc);
    setText('.location-kicker', t.locationKicker);
    setText('.nearby-header', t.locationHeader);
    setText('.location-copy', t.locationCopy);
    document.querySelectorAll('.nearby-item').forEach((item, index) => {
        const nearby = t.locationNearby?.[index];
        if (!nearby) return;
        const name = item.querySelector('.nearby-name');
        const type = item.querySelector('.nearby-type');
        if (name) name.textContent = nearby[0];
        if (type) type.textContent = nearby[1];
    });
    setText('.map-card-label', t.mapCardLabel);
    setText('.map-card h3', t.mapCardTitle);
    setText('.map-card p', t.mapCardText);
    setText('.map-link', t.mapButton);
    const mapFrame = document.querySelector('.location-map iframe');
    if (mapFrame) {
        mapFrame.title = t.mapIframeTitle;
        const mapLang = lang === 'en' ? 'en' : lang === 'de' ? 'de' : lang === 'ru' ? 'ru' : lang === 'ar' ? 'ar' : 'tr';
        mapFrame.src = mapFrame.src.replace(/!1s[a-z]{2}!2s[a-z]{2}/g, `!1s${mapLang}!2s${mapLang}`);
    }

    setText('#reviews .section-tag', t.reviewsTag);
    setText('#reviews .section-title', t.reviewsTitle);
    document.querySelectorAll('.review-card').forEach((card, index) => {
        const review = t.reviews[index];
        if (!review) return;
        const body = card.querySelector('p');
        const meta = card.querySelector('.reviewer-meta');
        if (body) body.textContent = review[0];
        if (meta) meta.textContent = review[1];
    });

    setText('#contact .section-tag', t.contactTag);
    setText('#contact .section-title', t.contactTitle);
    document.querySelectorAll('.contact-card .contact-type').forEach((type, index) => {
        if (t.contactTypes[index]) type.textContent = t.contactTypes[index];
    });

    setText('#booking .section-tag', t.bookingTag);
    setText('#booking .section-title', t.bookingTitle);
    setText('#booking .section-desc', t.bookingDesc);
    document.querySelectorAll('.calendar-weekdays span').forEach((day, index) => {
        if (t.weekdays[index]) day.textContent = t.weekdays[index];
    });
    document.querySelectorAll('.calendar-legend .legend-item span:last-child').forEach((label, index) => {
        if (t.legend[index]) label.textContent = t.legend[index];
    });
    const dateLabels = document.querySelectorAll('.booking-dates label');
    if (dateLabels[0]) dateLabels[0].textContent = t.checkinDate;
    if (dateLabels[1]) dateLabels[1].textContent = t.checkoutDate;
    setText('.booking-form-intro', t.bookingIntro);

    const formLabels = document.querySelectorAll('.booking-form .form-group > label');
    t.formLabels.forEach((text, index) => {
        if (formLabels[index]) formLabels[index].textContent = text;
    });

    const guestName = document.getElementById('guestName');
    const guestPhone = document.getElementById('guestPhone');
    const guestEmail = document.getElementById('guestEmail');
    const guestNote = document.getElementById('guestNote');
    if (guestName) guestName.placeholder = t.placeholders[0];
    if (guestPhone) guestPhone.placeholder = t.placeholders[1];
    if (guestEmail) guestEmail.placeholder = t.placeholders[2];
    if (guestNote) guestNote.placeholder = t.placeholders[3];

    document.querySelectorAll('#guestCount option').forEach((option, index) => {
        if (t.guestOptions[index]) option.textContent = t.guestOptions[index];
    });

    setText('#bookingSubmit span', t.bookingSubmit);
    setText('.booking-note', t.bookingNote);
    setText('#bookingModal h3', t.modalTitle);
    setText('#bookingModal p', t.modalText);
    setText('#modalClose', t.modalButton);

    setText('.footer-kicker', t.heroLocation);
    const footerStrongs = document.querySelectorAll('.footer-info-col strong');
    const footerSpans = document.querySelectorAll('.footer-info-col span');
    if (footerStrongs[0]) footerStrongs[0].textContent = t.footerLocationLabel;
    if (footerStrongs[1]) footerStrongs[1].textContent = t.footerPhoneLabel;
    if (footerStrongs[2]) footerStrongs[2].textContent = t.footerEmailLabel;
    if (footerSpans[0]) footerSpans[0].textContent = t.footerAddress;
    setText('.footer-copy', t.footerCopy);

    document.getElementById('calendarPrev')?.setAttribute('aria-label', t.aria.prevMonth);
    document.getElementById('calendarNext')?.setAttribute('aria-label', t.aria.nextMonth);
    document.getElementById('lightboxClose')?.setAttribute('aria-label', t.aria.close);
    document.getElementById('lightboxPrev')?.setAttribute('aria-label', t.aria.prev);
    document.getElementById('lightboxNext')?.setAttribute('aria-label', t.aria.next);

    if (typeof window.refreshCalendarLanguage === 'function') {
        window.refreshCalendarLanguage();
    }
}

function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
}

function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
}

// Shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Language Selector Toggle
const langBtn = document.querySelector('.lang-btn');
const langSelector = document.querySelector('.lang-selector');

if (langBtn) {
    langBtn.addEventListener('click', (e) => {
        e.preventDefault();
        langSelector.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!langSelector.contains(e.target)) {
            langSelector.classList.remove('active');
        }
    });
}


// Init Swiper
if (typeof Swiper !== 'undefined') {
    new Swiper('.aboutSwiper', {
        loop: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
}

// Gallery Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('.filter-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            filterItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}
