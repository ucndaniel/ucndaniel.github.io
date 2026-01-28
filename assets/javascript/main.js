// Modal functionality
const modal = document.getElementById("caseModal");
const modalTitle = document.getElementById("caseModalTitle");
const modalDescription = document.getElementById("caseModalDescription");
const modalImage = document.getElementById("caseModalImage");
const modalVisit = document.getElementById("caseModalVisit");
const modalVisitLabel = modalVisit?.querySelector("span") || null;
const modalContent = modal?.querySelector(".modal-content");
const triggers = document.querySelectorAll(".case-trigger");
const closeButtons = document.querySelectorAll("[data-modal-close]");

const openModal = (card) => {
    modalTitle.textContent = card.dataset.title || "";
    modalDescription.textContent = card.dataset.description || "";
    modalImage.src = card.dataset.image || "";
    modalImage.alt = card.dataset.title || "";

    if (modalVisit) {
        const title = card.dataset.title || "projekt";
        const url = card.dataset.url || "https://example.com";
        modalVisit.href = url;
        modalVisit.setAttribute("aria-label", `Besøg ${title} (nyt faneblad)`);
        if (modalVisitLabel) modalVisitLabel.textContent = "Besøg website";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
};

const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    if (modalContent) modalContent.classList.remove("is-media-zoom");
    document.body.style.overflow = "";
};

if (modalVisit && modalContent) {
    const enableZoom = () => modalContent.classList.add("is-media-zoom");
    const disableZoom = () => modalContent.classList.remove("is-media-zoom");
    modalVisit.addEventListener("mouseenter", enableZoom);
    modalVisit.addEventListener("mouseleave", disableZoom);
    modalVisit.addEventListener("focus", enableZoom);
    modalVisit.addEventListener("blur", disableZoom);
}

triggers.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(card);
        }
    });
});

closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
    }
});

// Reveal animations on scroll
const revealTargets = document.querySelectorAll(
    ".hero-text, .hero-card, .section-heading, .featured-grid .card, .projects-grid .card, #about > div, #about .about-details > div, .footer > div, .footer-actions"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    },
    { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Panel navigation system
const panels = Array.from(
    document.querySelectorAll("#home, #work, #projects, #about, #contact")
);

const panelMeta = [
    { id: "home", label: "Intro" },
    { id: "work", label: "Udvalgte" },
    { id: "projects", label: "Alle projekter" },
    { id: "about", label: "Om mig" },
    { id: "contact", label: "Kontakt" },
];

const panelRail = document.getElementById("panelRail");

const schemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

const getEffectivePrefersDark = () => {
    const forced = root.dataset.userScheme;
    if (forced === "dark") return true;
    if (forced === "light") return false;
    return schemeMedia.matches;
};

const syncEffectiveScheme = () => {
    root.dataset.scheme = getEffectivePrefersDark() ? "dark" : "light";
    setPanelTheme();
    renderPanelRail();
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
};

const storedScheme = window.localStorage.getItem("userScheme");
if (storedScheme === "dark" || storedScheme === "light") {
    root.dataset.userScheme = storedScheme;
}

const setPanelTheme = () => {
    const activeId = panelMeta[activePanelIndex]?.id;
    const prefersDark = getEffectivePrefersDark();
    const theme = activeId === "contact" ? "dark" : prefersDark ? "dark" : "light";
    document.documentElement.dataset.panelTheme = theme;
};

// Create all rail items once on initialization
const initializePanelRail = () => {
    if (!panelRail) return;
    panelRail.innerHTML = "";

    panelMeta.forEach((meta, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rail-item";
        btn.dataset.index = String(index);
        btn.style.opacity = "0";
        btn.style.visibility = "hidden";

        btn.innerHTML = `
            <span class="rail-dot" aria-hidden="true"></span>
            <span class="rail-label">${meta.label}</span>
        `;

        btn.addEventListener("click", () => {
            scrollToPanel(index);
            if (history.pushState) {
                history.pushState(null, "", `#${meta.id}`);
            } else {
                window.location.hash = meta.id;
            }
        });

        panelRail.appendChild(btn);
    });
};

const renderPanelRail = () => {
    if (!panelRail) return;
    
    const items = panelRail.querySelectorAll('.rail-item');
    const indices = [activePanelIndex - 1, activePanelIndex, activePanelIndex + 1].filter(
        (i) => i >= 0 && i < panelMeta.length
    );

    items.forEach((item, index) => {
        const isVisible = indices.includes(index);
        const isActive = index === activePanelIndex;
        const isAdjacent = indices.includes(index) && !isActive;

        // Update classes
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('is-adjacent', isAdjacent);
        
        // Update accessibility
        if (isActive) {
            item.setAttribute("aria-current", "true");
        } else {
            item.removeAttribute("aria-current");
        }

        // Show/hide with smooth transition
        if (isVisible) {
            item.style.opacity = "1";
            item.style.visibility = "visible";
        } else {
            item.style.opacity = "0";
            item.style.visibility = "hidden";
        }
    });
};

let activePanelIndex = 0;
let isPanelScrolling = false;
let lastPanelScrollAt = 0;
const panelScrollLockMs = 950;

const clampIndex = (index) => Math.max(0, Math.min(panels.length - 1, index));

const setActivePanelIndex = (nextIndex) => {
    const clamped = clampIndex(nextIndex);
    if (clamped === activePanelIndex) return;
    activePanelIndex = clamped;
    setPanelTheme();
    renderPanelRail();
};

const updateActiveIndexFromScroll = () => {
    if (!panels.length) return;

    const probeY = window.innerHeight * 0.42;
    let hitIndex = -1;

    for (let i = 0; i < panels.length; i++) {
        const rect = panels[i].getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
            hitIndex = i;
            break;
        }
    }

    if (hitIndex < 0) {
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        panels.forEach((panel, index) => {
            const rect = panel.getBoundingClientRect();
            const distance = Math.abs(rect.top - probeY);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        hitIndex = closestIndex;
    }

    setActivePanelIndex(hitIndex);
};

const scrollToPanel = (nextIndex, behavior = "smooth") => {
    const targetIndex = clampIndex(nextIndex);
    const target = panels[targetIndex];
    if (!target) return;
    if (targetIndex === activePanelIndex) return;

    isPanelScrolling = true;
    setActivePanelIndex(targetIndex);
    target.scrollIntoView({ behavior, block: "start" });
    window.setTimeout(() => {
        isPanelScrolling = false;
    }, panelScrollLockMs);
};

const getPanelIndexById = (id) => panelMeta.findIndex((m) => m.id === id);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (href === "#") return;
        if (!href.startsWith("#")) return;

        const id = href.slice(1);
        if (!id) return;

        const index = getPanelIndexById(id);
        if (index < 0) return;

        event.preventDefault();
        lastPanelScrollAt = performance.now();
        scrollToPanel(index);

        if (history.pushState) {
            history.pushState(null, "", `#${id}`);
        } else {
            window.location.hash = id;
        }
    });
});

const canScrollElement = (el, direction) => {
    if (!el) return false;
    if (el.scrollHeight <= el.clientHeight) return false;

    const maxScrollTop = el.scrollHeight - el.clientHeight;
    if (direction > 0) return el.scrollTop < maxScrollTop - 1;
    return el.scrollTop > 1;
};

const getProjectsScroller = (eventTarget) => {
    if (!(eventTarget instanceof Element)) return null;
    return eventTarget.closest("#projects .projects-grid");
};

// Header background on scroll
const siteHeader = document.querySelector('.site-header');
const scrollThreshold = 50;

const updateHeaderOnScroll = () => {
    if (!siteHeader) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY > scrollThreshold) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
};

// Keep the left rail in sync even if scrolling happens inside a nested scroll container.
// `scroll` doesn't bubble, but it *can* be observed during capture on `document`.
let railScrollRaf = 0;
const requestRailSync = () => {
    if (railScrollRaf) return;
    railScrollRaf = requestAnimationFrame(() => {
        railScrollRaf = 0;
        updateActiveIndexFromScroll();
        updateHeaderOnScroll();
    });
};

// Check initial scroll state
updateHeaderOnScroll();

document.addEventListener("scroll", requestRailSync, { passive: true, capture: true });

const getIdFromLocationHash = () => {
    const raw = window.location.hash || "";
    if (!raw || raw === "#") return "";
    try {
        return decodeURIComponent(raw.replace(/^#/, ""));
    } catch {
        return raw.replace(/^#/, "");
    }
};

let lastHandledHash = "";
const handleLocationHashNavigation = (behavior = "smooth") => {
    const id = getIdFromLocationHash();
    const nextHash = id ? `#${id}` : "";
    if (nextHash === lastHandledHash) return;
    lastHandledHash = nextHash;

    if (!id) {
        scrollToPanel(0, behavior);
        return;
    }

    const index = getPanelIndexById(id);
    if (index < 0) return;
    lastPanelScrollAt = performance.now();
    scrollToPanel(index, behavior);
};

const initialHashId = getIdFromLocationHash();
const initialHashIndex = initialHashId ? getPanelIndexById(initialHashId) : -1;
// Initialize the panel rail once
initializePanelRail();

if (initialHashIndex >= 0) {
    activePanelIndex = initialHashIndex;
    setPanelTheme();
    renderPanelRail();
    lastHandledHash = `#${initialHashId}`;
    requestAnimationFrame(() => {
        const target = panels[initialHashIndex];
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    });
} else {
    updateActiveIndexFromScroll();
    setPanelTheme();
    renderPanelRail();
    lastHandledHash = window.location.hash || "";
}

window.addEventListener("hashchange", () => handleLocationHashNavigation("smooth"));
window.addEventListener("popstate", () => handleLocationHashNavigation("smooth"));

if (schemeMedia.addEventListener) {
    schemeMedia.addEventListener("change", () => {
        if (!document.documentElement.dataset.userScheme) {
            syncEffectiveScheme();
        }
    });
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const next = getEffectivePrefersDark() ? "light" : "dark";
        document.documentElement.dataset.userScheme = next;
        window.localStorage.setItem("userScheme", next);
        syncEffectiveScheme();
    });
}

syncEffectiveScheme();

// Render Lucide icons (including featured case external-link icons)
if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
}
