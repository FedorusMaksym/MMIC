const $50af397c87ec63f2$var$KEY = "newsletterSignup";
const $50af397c87ec63f2$var$TTL_MS = 3600000; // how long to keep the data (1 hour)
const $50af397c87ec63f2$var$form = document.querySelector(".newletter__form");
const $50af397c87ec63f2$var$nameInput = $50af397c87ec63f2$var$form.querySelector('input[type="text"]');
const $50af397c87ec63f2$var$emailInput = $50af397c87ec63f2$var$form.querySelector('input[type="email"]');
// Get saved data, delete it if too old
function $50af397c87ec63f2$var$loadData() {
    try {
        const raw = localStorage.getItem($50af397c87ec63f2$var$KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (Date.now() > data.expiresAt) {
            localStorage.removeItem($50af397c87ec63f2$var$KEY);
            console.log("Data expired and was deleted.");
            return null;
        }
        return data;
    } catch (err) {
        console.error("Storage error:", err);
        return null;
    }
}
// When the page opens, show saved data and fill the inputs
const $50af397c87ec63f2$var$saved = $50af397c87ec63f2$var$loadData();
if ($50af397c87ec63f2$var$saved) {
    console.log("Loaded:", $50af397c87ec63f2$var$saved);
    $50af397c87ec63f2$var$nameInput.value = $50af397c87ec63f2$var$saved.name;
    $50af397c87ec63f2$var$emailInput.value = $50af397c87ec63f2$var$saved.email;
}
// When the form is sent, save the data
$50af397c87ec63f2$var$form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = {
        name: $50af397c87ec63f2$var$nameInput.value.trim(),
        email: $50af397c87ec63f2$var$emailInput.value.trim(),
        expiresAt: Date.now() + $50af397c87ec63f2$var$TTL_MS
    };
    try {
        localStorage.setItem($50af397c87ec63f2$var$KEY, JSON.stringify(data));
        console.log("Saved:", data);
    } catch (err) {
        console.error("Could not save:", err);
    }
    // Delete it after the time is up
    setTimeout($50af397c87ec63f2$var$loadData, $50af397c87ec63f2$var$TTL_MS + 100);
});


const $7f4b8c0563b96f11$var$cards = document.querySelector('.surf-packages__list');
if ($7f4b8c0563b96f11$var$cards) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    $7f4b8c0563b96f11$var$cards.addEventListener('mousedown', (e)=>{
        isDown = true;
        startX = e.pageX;
        scrollLeft = $7f4b8c0563b96f11$var$cards.scrollLeft;
    });
    $7f4b8c0563b96f11$var$cards.addEventListener('mouseup', ()=>{
        isDown = false;
    });
    $7f4b8c0563b96f11$var$cards.addEventListener('mouseleave', ()=>{
        isDown = false;
    });
    $7f4b8c0563b96f11$var$cards.addEventListener('mousemove', (e)=>{
        if (!isDown) return;
        e.preventDefault();
        const move = e.pageX - startX;
        $7f4b8c0563b96f11$var$cards.scrollLeft = scrollLeft - move;
    });
    $7f4b8c0563b96f11$var$cards.querySelectorAll('img').forEach((img)=>{
        img.addEventListener('dragstart', (e)=>{
            e.preventDefault();
        });
    });
}


const $e9cb09e27f6008b3$var$searchApi = {
    endpoint: "/api/search",
    async options (field) {
        const options = {
            destination: [
                {
                    value: "morocco",
                    label: "Marocco"
                },
                {
                    value: "senegal",
                    label: "Senegal"
                },
                {
                    value: "south-africa",
                    label: "Sudafrica"
                }
            ],
            type: [
                {
                    value: "resort",
                    label: "Resort"
                },
                {
                    value: "camp",
                    label: "Camp"
                }
            ],
            level: [
                {
                    value: "beginner",
                    label: "Principiante"
                },
                {
                    value: "intermediate",
                    label: "Intermedio"
                },
                {
                    value: "advanced",
                    label: "Avanzato"
                }
            ],
            holiday: [
                {
                    value: "surf-camp",
                    label: "Surf Camp"
                },
                {
                    value: "adventure",
                    label: "Adventure",
                    checked: true
                },
                {
                    value: "junior",
                    label: "Junior"
                },
                {
                    value: "resort",
                    label: "Resort",
                    checked: true
                },
                {
                    value: "surf-lodge",
                    label: "Surf Lodge"
                },
                {
                    value: "surf-yoga",
                    label: "Surf & Yoga"
                },
                {
                    value: "boat-trip",
                    label: "Boat Trip"
                },
                {
                    value: "surf-resort",
                    label: "Surf Resort"
                },
                {
                    value: "group",
                    label: "Viaggio di Gruppo"
                }
            ],
            accommodation: [
                {
                    value: "hotel",
                    label: "Hotel"
                },
                {
                    value: "apartment",
                    label: "Appartamento"
                },
                {
                    value: "hostel",
                    label: "Ostello"
                }
            ],
            extras: [
                {
                    value: "yoga",
                    label: "Yoga"
                },
                {
                    value: "snorkeling",
                    label: "Snorkeling"
                },
                {
                    value: "diving",
                    label: "Immersioni"
                }
            ]
        };
        return options[field];
    },
    async search (params) {
        const response = await fetch(`${this.endpoint}?${params}`);
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }
};
const $e9cb09e27f6008b3$var$initSearch = (form, api)=>{
    const template = document.querySelector("[data-filter-template]");
    const fillSelect = async (select)=>{
        const items = await api.options(select.dataset.field);
        items.forEach(({ value: value, label: label })=>select.append(new Option(label, value)));
    };
    const fillList = async (list)=>{
        const name = list.dataset.filterList;
        const items = await api.options(name);
        items.forEach(({ value: value, label: label, checked: checked })=>{
            const item = template.content.cloneNode(true);
            const input = item.querySelector("input");
            input.name = name;
            input.value = value;
            input.checked = Boolean(checked);
            item.querySelector(".filters__option").classList.toggle("is-checked", input.checked);
            item.querySelector(".filters__label").textContent = label;
            list.append(item);
        });
    };
    form.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const params = new URLSearchParams([
            ...new FormData(form)
        ].filter(([, value])=>value));
        try {
            const results = await api.search(params);
            form.dispatchEvent(new CustomEvent("search:results", {
                bubbles: true,
                detail: results
            }));
        } catch (error) {
            form.dispatchEvent(new CustomEvent("search:error", {
                bubbles: true,
                detail: error
            }));
        }
    });
    return Promise.all([
        ...form.querySelectorAll("select[data-field]"),
        ...document.querySelectorAll("[data-filter-list]")
    ].map((element)=>element.matches("select") ? fillSelect(element) : fillList(element)));
};
const $e9cb09e27f6008b3$var$initFilters = (root)=>{
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const toggleGroup = (group)=>{
        const list = group.querySelector(".filters__list");
        const opening = !group.classList.contains("is-open");
        group.animation?.cancel();
        group.classList.toggle("is-open", opening);
        if (reduceMotion.matches) {
            group.open = opening;
            return;
        }
        if (opening) group.open = true;
        const height = list.offsetHeight;
        const frames = opening ? {
            height: [
                "0px",
                `${height}px`
            ],
            opacity: [
                0,
                1
            ]
        } : {
            height: [
                `${height}px`,
                "0px"
            ],
            opacity: [
                1,
                0
            ]
        };
        group.animation = list.animate(frames, {
            duration: 280,
            easing: "ease-out",
            fill: "both"
        });
        group.animation.onfinish = ()=>{
            group.open = opening;
            group.animation.cancel();
            group.animation = null;
        };
    };
    root.querySelectorAll(".filters__group").forEach((group)=>{
        group.classList.toggle("is-open", group.open);
    });
    root.addEventListener("click", (event)=>{
        const summary = event.target.closest(".filters__summary");
        if (summary) {
            event.preventDefault();
            toggleGroup(summary.parentElement);
        }
    });
    root.addEventListener("change", (event)=>{
        const input = event.target.closest(".filters__input");
        if (input) input.closest(".filters__option").classList.toggle("is-checked", input.checked);
    });
};
document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.querySelector("#search-form");
    const filters = document.querySelector(".filters");
    if (form) $e9cb09e27f6008b3$var$initSearch(form, $e9cb09e27f6008b3$var$searchApi);
    if (filters) $e9cb09e27f6008b3$var$initFilters(filters);
});




//# sourceMappingURL=MMIC.b3f6ccaf.js.map
