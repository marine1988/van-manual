/**
 * Traduções do Manual da Campervan
 * PT (default) — o HTML já contém o texto em português como fallback
 * EN, FR, ES, DE — traduções completas
 */
const translations = {
  pt: {}, // português é o default (texto no HTML)

  en: {
    "site.title": "🚐 Campervan Manual",

    "hero.title": "Rogério's Converted Van",
    "hero.subtitle": "Renault Master 2.5 dCi — Complete Tour",
    "hero.cta": "🚐 Rent on Yescapa",

    "video.title": "Complete Video Tour",
    "video.intro": "See everything about the van in a ~23 minute guided tour by Rogério Figueiredo.",
    "video.caption": "🎥 <strong>Complete tour</strong> by Rogério Figueiredo (~23 min)",

    "about.title": "About this Van",
    "about.intro": "Converted van (van aménagée), with all the comfort of a motorhome on an agile 3.3-ton chassis — standard driving licence.",
    "about.descriptionTitle": "Yescapa Listing Description",
    "about.description.p1": "This campervan is a <strong>Renault Master 2.5 dCi</strong> from <strong>2010</strong>, fully converted for off-grid travel. It has <strong>3 seatbelt seats</strong> and <strong>3 berths</strong>, with a convertible bed from the dining area.",
    "about.description.p2": "The van is equipped with <strong>590 W</strong> solar panels, <strong>315 Ah</strong> lithium battery, diesel heating, hot water, full kitchen, bathroom with shower, and multiple charging options (solar, alternator, and 220 V mains). Ideal for those wanting freedom without sacrificing comfort.",
    "about.description.p3": "The rental listing is published on <strong>Yescapa</strong>, a platform that handles insurance, 24/7 assistance, and secure payment.",
    "about.specsTitle": "Technical Data",
    "about.specs.model": "<strong>Model:</strong> Renault Master 2.5 dCi 100 hp",
    "about.specs.year": "<strong>Year:</strong> 2010",
    "about.specs.weight": "<strong>Gross weight:</strong> 3300 kg",
    "about.specs.license": "<strong>Driving licence:</strong> B",
    "about.specs.seats": "<strong>Seatbelt seats:</strong> 3",
    "about.specs.beds": "<strong>Berths:</strong> 3",
    "about.specs.bedSize": "<strong>Bed:</strong> 145 × 184 cm (transverse)",
    "about.specs.height": "<strong>Height:</strong> ~1.9 m",
    "about.conditionsTitle": "Rental Conditions",
    "about.conditions.pets": "<strong>Pets:</strong> allowed",
    "about.conditions.smoking": "<strong>Smoking:</strong> not allowed",
    "about.conditions.abroad": "<strong>Travel abroad:</strong> allowed",
    "about.conditions.deposit": "<strong>Deposit:</strong> €500",
    "about.cta": "🚐 Rent this campervan on Yescapa",
    "about.ctaNote": "Rental securely managed by Yescapa — insurance included, 24/7 assistance, secure payment.",

    "nav.eletrico": "Electrical",
    "nav.agua": "Water",
    "nav.aquecimento": "Heating",
    "nav.cozinha": "Kitchen",
    "nav.cama": "Bed",
    "nav.wc": "Toilet",
    "nav.ventilacao": "Ventilation",
    "nav.exterior": "Exterior",
    "nav.controlo": "Controls",

    "sections.eletrico.title": "Electrical System",
    "sections.eletrico.p1": "The campervan has three ways to charge the battery: solar panels (590 W), vehicle alternator, and 220 V mains connection.",
    "sections.eletrico.usbTitle": "USB and Sockets",
    "sections.eletrico.usb.1": "20 USB ports total, 8 of which are USB-C.",
    "sections.eletrico.usb.2": "USB-C and USB-A sets near the bed and in the kitchen.",
    "sections.eletrico.usb.3": "Type-C, micro USB, and other cables available for immediate use.",
    "sections.eletrico.usb.4": "Some USB sockets have an on/off button.",
    "sections.eletrico.lightsTitle": "Lights",
    "sections.eletrico.lights.1": "Interior lights: red, blue, and orange (ambient).",
    "sections.eletrico.lights.2": "Dedicated kitchen light.",
    "sections.eletrico.lights.3": "Exterior light.",
    "sections.eletrico.lights.4": "Light in the shoe compartment and water panel.",
    "sections.eletrico.socketsTitle": "220 V / 12 V Sockets",
    "sections.eletrico.sockets.1": "220 V sockets for coffee machine, electric stove, and microwave.",
    "sections.eletrico.sockets.2": "Only one of these appliances can run at a time.",
    "sections.eletrico.sockets.3": "12 V socket available in the bathroom.",

    "sections.agua.title": "Water & Shower",
    "sections.agua.cleanTitle": "Clean Water Tank",
    "sections.agua.clean.1": "Always delivered full.",
    "sections.agua.clean.2": "Fill through the exterior inlet until water starts coming out — do not fill to the top to avoid leaks.",
    "sections.agua.clean.3": "Pump safety button: turns off the pump if it runs dry or doesn't stop.",
    "sections.agua.hotTitle": "Hot Water",
    "sections.agua.hot.1": "Turn on the water heater on the interior panel.",
    "sections.agua.hot.2": "Takes about 1 hour to heat up.",
    "sections.agua.hot.3": "Turn off after showering, unless there's plenty of sun and battery.",
    "sections.agua.showerTitle": "Showers",
    "sections.agua.shower.1": "Indoor shower with hot and cold water in the bathroom.",
    "sections.agua.shower.2": "Outdoor cold-water shower in the rear trunk (optional rental).",
    "sections.agua.shower.3": "Use the bathroom curtain to keep the interior dry.",
    "sections.agua.greyTitle": "Grey Water",
    "sections.agua.grey.1": "Grey water tank at the lower rear right side.",
    "sections.agua.grey.2": "Open the valve to drain.",

    "sections.aquecimento.title": "Heating",
    "sections.aquecimento.p1": "Diesel heater with hot air outlet inside.",
    "sections.aquecimento.1": "Press the button for about 5 seconds to turn on.",
    "sections.aquecimento.2": "Adjust room temperature on the controller.",
    "sections.aquecimento.3": "Hot air comes out from the bottom.",
    "sections.aquecimento.4": "It may take a few seconds to start; the outside pump noise is normal.",
    "sections.aquecimento.5": "To turn off, press until \"off\" appears — the fan may run 1-2 minutes longer, which is normal.",

    "sections.cozinha.title": "Kitchen",
    "sections.cozinha.fridgeTitle": "Fridge",
    "sections.cozinha.fridge.1": "93 L fridge at 220 V.",
    "sections.cozinha.fridge.2": "Bottom part for refrigerated items, top part for frozen.",
    "sections.cozinha.fridge.3": "Has a safety strap — fasten before driving.",
    "sections.cozinha.coffeeTitle": "Coffee Machine",
    "sections.cozinha.coffee.1": "Uses specific capsules (Continente brand).",
    "sections.cozinha.coffee.2": "Some capsules provided to get started; you can buy more.",
    "sections.cozinha.cookerTitle": "Electric Stove",
    "sections.cozinha.cooker.1": "2 electric burners.",
    "sections.cozinha.cooker.2": "If using both burners, set to level 3 (maximum).",
    "sections.cozinha.cooker.3": "If using one burner, you can go up to level 4 or 5.",
    "sections.cozinha.cooker.4": "Never set to maximum — the electricity may cut out and you'll need to wait for it to come back.",
    "sections.cozinha.utensilsTitle": "Dishes and Utensils",
    "sections.cozinha.utensils.1": "Complete cutlery: forks, knives, spoons, etc.",
    "sections.cozinha.utensils.2": "Glasses and bowls.",
    "sections.cozinha.utensils.3": "Wine opener, cutters, and other accessories.",
    "sections.cozinha.utensils.4": "Kitchen paper and cleaning products.",
    "sections.cozinha.powerTitle": "Power Restrictions",
    "sections.cozinha.power.1": "Coffee machine, electric stove, and microwave work one at a time.",
    "sections.cozinha.power.2": "Watch the battery level when using these appliances.",

    "sections.cama.title": "Bed & Table",
    "sections.cama.tableTitle": "Table",
    "sections.cama.table.1": "The table can be removed to convert the space into a bed.",
    "sections.cama.table.2": "Loosen, press, and rotate the mechanism to release the tabletop.",
    "sections.cama.table.3": "Remove the leg and store the parts.",
    "sections.cama.bedTitle": "How to Make the Bed",
    "sections.cama.bed.1": "Remove the tabletop and place it in the gap between the sofas.",
    "sections.cama.bed.2": "The larger sofa is on the water side; the smaller one on the electrical side.",
    "sections.cama.bed.3": "Place the wooden boards, then the sheets.",
    "sections.cama.bed.4": "The bed should be unmade during the day to allow use of the table.",

    "sections.wc.title": "Toilet",
    "sections.wc.toiletTitle": "Toilet",
    "sections.wc.toilet.1": "Open the toilet before use.",
    "sections.wc.toilet.2": "Use the blue liquid for flushing and odour control.",
    "sections.wc.toilet.3": "Toilet paper provided.",
    "sections.wc.showerTitle": "Shower",
    "sections.wc.shower.1": "Indoor shower with hot and cold water.",
    "sections.wc.shower.2": "Use the curtain to keep water within the shower area.",
    "sections.wc.shower.3": "The shower area walls are waterproof; the others are not.",
    "sections.wc.storageTitle": "Storage",
    "sections.wc.storage.1": "Hooks for towels and items.",
    "sections.wc.storage.2": "Shelf for shampoo and products.",
    "sections.wc.storage.3": "Bin and cleaning products.",

    "sections.ventilacao.title": "Ventilation",
    "sections.ventilacao.roofTitle": "Skylight",
    "sections.ventilacao.roof.1": "Skylight with electric fan and remote control.",
    "sections.ventilacao.roof.2": "Large button to open to the desired position.",
    "sections.ventilacao.roof.3": "Air intake mode (inside) or exhaust mode (outside).",
    "sections.ventilacao.roof.4": "Recommended exhaust mode when showering; intake mode when cooking (with window open).",
    "sections.ventilacao.roof.5": "Blackout mode to block exterior light.",
    "sections.ventilacao.roof.6": "Mesh mode to keep open without insects.",
    "sections.ventilacao.windowsTitle": "Windows",
    "sections.ventilacao.windows.1": "Windows with two clickable opening positions.",
    "sections.ventilacao.windows.2": "Blackout mode and insect screen mode.",
    "sections.ventilacao.windows.3": "To close, pull up instead of pushing.",

    "sections.exterior.title": "Exterior",
    "sections.exterior.connectionsTitle": "Connections",
    "sections.exterior.connections.1": "220 V connector for mains power (cable and adapters in the trunk).",
    "sections.exterior.connections.2": "Clean water inlet.",
    "sections.exterior.connections.3": "Diesel inlet — do not confuse with the water inlet.",
    "sections.exterior.connections.4": "Rear-view camera.",
    "sections.exterior.trunkTitle": "Rear Trunk",
    "sections.exterior.trunk.1": "Foldable table and chairs (3 chairs: 1 small + 2 large).",
    "sections.exterior.trunk.2": "Wheel chocks for levelling.",
    "sections.exterior.trunk.3": "Ropes for external cargo transport (e.g., scooter).",
    "sections.exterior.trunk.4": "Tent (new, optional rental) and outdoor shower.",
    "sections.exterior.trunk.5": "Shovel, basic tools, and water/electricity accessories.",
    "sections.exterior.trunk.6": "Sun umbrella.",

    "sections.controlo.title": "Electrical Control",
    "sections.controlo.p1": "Electrical control panel on the right side of the vehicle, near the sofas.",
    "sections.controlo.1": "Shows consumption, solar production, and battery level (315 Ah).",
    "sections.controlo.2": "Main cut-off (red button): turns off all electricity in the campervan in an emergency.",
    "sections.controlo.3": "220 V inverter button: turn on/off the 220 V and solar section.",
    "sections.controlo.4": "If there's an error on the solar panel/inverter, turn off and back on.",
    "sections.controlo.5": "Smoke and water sensors installed.",

    "footer.madeBy": "Made by Rogério",
    "footer.copyright": "Campervan Manual — 2025",
  },

  fr: {},
  es: {},
  de: {},
};

// Apply translations on page load
function applyTranslations(lang) {
  const dict = translations[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : lang === 'en' ? 'en-GB' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'de-DE';
  localStorage.setItem('van-manual-lang', lang);
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('van-manual-lang') || 'pt';
  applyTranslations(saved);
});
