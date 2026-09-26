// ======================================
// 🔥 CENTRAL PRICING ENGINE
// ======================================

const PricingEngine = {

  BOOKING_FEE_RATE: 0.3,
  PARKING_PER_CAR: 300,

  transportFees: {
    self: 0,
    nairobi: 9800,
    westlands: 8700,
    kikuyu: 7500,
    thika: 15000,
    coaster: 0,
    bus: 0
  },

  prices: {
    resident: {
      adult: 1573,
      student: 1275,
      child: 1000
    },
    nonresident: {
      adult: 3000,
      student: 2500,
      child: 2000
    }
  },

  getPrice(type, residency) {
    return this.prices?.[residency]?.[type] || 0;
  },

  getTransportFee(option) {
    return this.transportFees?.[option] || 0;
  },

  calculateParking(people, enabled) {
    if (!enabled) {
      return { cars: 0, parkingCost: 0 };
    }

    const cars = Math.ceil(people / 4);

    return {
      cars,
      parkingCost: cars * this.PARKING_PER_CAR
    };
  },

  calculateDeposit(total) {
    return Math.round(total * this.BOOKING_FEE_RATE);
  }
};

// ======================================
// 🚐 TRANSPORT RULES
// ======================================

const TransportRules = {
  getAvailableOptions(hikers) {
    const n = Number(hikers) || 0;

    const base = ["self", "nairobi", "westlands", "kikuyu"];

    if (n <= 0) return base;
    if (n <= 4) return base;
    if (n <= 10) return [...base, "thika"];
    if (n <= 20) return ["self", "nairobi", "westlands", "kikuyu", "thika", "coaster"];

    return ["self", "coaster", "bus"];
  }
};

// ======================================
// 🚀 MIXED GROUP BOOKING CALCULATOR
// ======================================

function initBookingCalculator(config) {
  const name = document.querySelector(config.name);
  const residency = document.querySelector(config.residency);
  const hikerType = document.querySelector(config.hikerType);
  const groupInputs = Object.fromEntries(
    Object.entries(config.categories).map(([key, selector]) => [key, document.querySelector(selector)])
  );
  const transport = document.querySelector(config.transport);
  const groupWrapper = config.groupWrapper ? document.querySelector(config.groupWrapper) : null;
  const transportWrapper = config.transportWrapper ? document.querySelector(config.transportWrapper) : null;
  const parking = document.querySelector(config.parking);
  const date = config.date ? document.querySelector(config.date) : null;

  const totalEl = document.querySelector(config.total);
  const depositEl = document.querySelector(config.deposit);
  const btn = document.querySelector(config.button);
  const resultCard = document.querySelector(config.resultCard);
  const totalHikersEl = document.querySelector(config.totalHikers);
  const breakdownEl = config.breakdown ? document.querySelector(config.breakdown) : null;

  const parkingBox = document.querySelector(config.parkingBox);
  const pickupInfoBox = document.querySelector(config.pickupInfoBox);
  const pickupInfo = document.querySelector(config.pickupInfo);

  if (date) date.min = new Date().toISOString().split("T")[0];

  function getCounts() {
    return Object.fromEntries(
      Object.entries(groupInputs).map(([key, input]) => [
        key,
        Math.max(0, parseInt(input?.value, 10) || 0)
      ])
    );
  }

  function totalHikers() {
    return Object.values(getCounts()).reduce((sum, count) => sum + count, 0);
  }

  function getVisibleFieldKeys() {
    const currentResidency = residency?.value || "";
    const currentType = hikerType?.value || "";

    if (!currentResidency || !currentType) {
      return [];
    }

    const map = {
      resident: {
        adult: ["residentAdult"],
        student: ["residentStudent"],
        child: ["residentChild"],
        mixed: ["residentAdult", "residentStudent", "residentChild"]
      },
      nonresident: {
        adult: ["nonresidentAdult"],
        student: ["nonresidentStudent"],
        child: ["nonresidentChild"],
        mixed: ["nonresidentAdult", "nonresidentStudent", "nonresidentChild"]
      },
      mixed: {
        adult: ["residentAdult", "nonresidentAdult"],
        student: ["residentStudent", "nonresidentStudent"],
        child: ["residentChild", "nonresidentChild"],
        mixed: [
          "residentAdult",
          "residentStudent",
          "residentChild",
          "nonresidentAdult",
          "nonresidentStudent",
          "nonresidentChild"
        ]
      }
    };

    return map[currentResidency]?.[currentType] || [];
  }

  function updateGroupAndTransportState() {
    const hasSelection = Boolean(residency?.value && hikerType?.value);
    const visibleKeys = new Set(getVisibleFieldKeys());

    Object.entries(groupInputs).forEach(([key, input]) => {
      const row = input?.closest(".pricing-row");
      if (!row) return;

      const shouldShow = visibleKeys.has(key);
      row.style.display = shouldShow ? "grid" : "none";
      if (!shouldShow) input.value = "0";
    });

    if (groupWrapper) {
      groupWrapper.classList.toggle("is-collapsed", !hasSelection);
    }

    if (transportWrapper) {
      transportWrapper.classList.toggle("is-collapsed", !hasSelection);
    }

    if (parkingBox) {
      parkingBox.classList.toggle("is-collapsed", !hasSelection || !transport?.value || transport.value !== "self");
    }

    if (pickupInfoBox) {
      pickupInfoBox.classList.toggle("is-collapsed", !hasSelection || !transport?.value || transport.value === "self");
    }

    if (transport) {
      transport.disabled = !hasSelection;
      if (!hasSelection) {
        transport.innerHTML = '<option value="">Select Transport</option>';
        transport.value = "";
      }
    }
  }

  function updateTransportOptions() {
    const selectedResidency = residency?.value || "";
    const selectedType = hikerType?.value || "";

    if (!selectedResidency || !selectedType) {
      updateGroupAndTransportState();
      return;
    }

    if (transport) transport.disabled = false;

    const previousValue = transport?.value || "";
    const labels = {
      self: "Self Drive / Own Transport",
      nairobi: "Nairobi Pickup",
      westlands: "Westlands Pickup",
      kikuyu: "Kikuyu Pickup",
      thika: "Thika Pickup",
      coaster: "Coaster Bus",
      bus: "Large Bus"
    };

    const allowed = TransportRules.getAvailableOptions(totalHikers());
    transport.innerHTML = '<option value="">Select Transport</option>';

    allowed.forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = labels[key] || key;
      transport.appendChild(option);
    });

    transport.value = allowed.includes(previousValue) ? previousValue : "";
    updateGroupAndTransportState();
  }

  function updateTransportUI() {
    if (!transport) return;

    const value = transport.value;

    if (value === "self") {
      if (parkingBox) parkingBox.classList.remove("is-collapsed");
      if (pickupInfoBox) pickupInfoBox.classList.add("is-collapsed");
      return;
    }

    if (value) {
      if (parkingBox) parkingBox.classList.add("is-collapsed");
      if (pickupInfoBox) pickupInfoBox.classList.remove("is-collapsed");

      const infoMap = {
        nairobi: "🚐 Pickup: Nairobi CBD — 6:00 AM",
        westlands: "🚐 Pickup: Westlands — 6:20 AM",
        kikuyu: "🚐 Pickup: Kikuyu — 7:00 AM",
        thika: "🚐 Pickup: Thika — 5:30 AM",
        coaster: "🚌 Coaster Bus Pickup — details shared later",
        bus: "🚌 Large Bus Pickup — details shared later"
      };

      if (pickupInfo) pickupInfo.innerHTML = infoMap[value] || "";
      if (parking) parking.checked = false;
      return;
    }

    if (parkingBox) parkingBox.classList.add("is-collapsed");
    if (pickupInfoBox) pickupInfoBox.classList.add("is-collapsed");
  }

  function update() {
    const customerName = name?.value?.trim() || "";
    const selectedResidency = residency?.value || "";
    const selectedType = hikerType?.value || "";
    const hikers = totalHikers();
    const transportType = transport?.value || "";
    const selectedDate = date?.value || "To be confirmed";
    const isValid = customerName && hikers > 0 && selectedResidency && selectedType && transportType;

    if (!isValid) {
      if (resultCard) {
        resultCard.style.display = "none";
        resultCard.hidden = true;
      }
      if (totalEl) totalEl.innerText = "0";
      if (depositEl) depositEl.innerText = "0";
      if (totalHikersEl) totalHikersEl.innerText = "0";
      if (breakdownEl) breakdownEl.innerHTML = "";
      if (btn) {
        btn.classList.add("disabled");
        btn.href = "#";
      }
      return;
    }

    const priceMap = {
      residentAdult: ["adult", "resident", "Resident Adults"],
      residentStudent: ["student", "resident", "Resident Students"],
      residentChild: ["child", "resident", "Resident Children"],
      nonresidentAdult: ["adult", "nonresident", "Non-resident Adults"],
      nonresidentStudent: ["student", "nonresident", "Non-resident Students"],
      nonresidentChild: ["child", "nonresident", "Non-resident Children"]
    };

    const counts = getCounts();
    const pricing = Object.fromEntries(
      Object.entries(priceMap).map(([key, [type, category, label]]) => {
        const price = PricingEngine.getPrice(type, category);
        return [key, {
          count: counts[key],
          price,
          label,
          subtotal: counts[key] * price
        }];
      })
    );

    const hikingTotal = Object.values(pricing).reduce((sum, item) => sum + item.subtotal, 0);
    const carsNeeded = Math.ceil(hikers / 4);
    const transportFee = PricingEngine.getTransportFee(transportType);
    const transportCost = transportFee === 0 ? 0 : transportFee * carsNeeded;
    const parkingData = PricingEngine.calculateParking(
      hikers,
      transportType === "self" && parking?.checked
    );
    const total = hikingTotal + transportCost + parkingData.parkingCost;
    const deposit = PricingEngine.calculateDeposit(total);

    if (resultCard) {
      resultCard.style.display = "block";
      resultCard.hidden = false;
    }
    if (totalHikersEl) totalHikersEl.innerText = hikers;
    if (totalEl) totalEl.innerText = total.toLocaleString();
    if (depositEl) depositEl.innerText = deposit.toLocaleString();

    let message = `Hello Kijabe Adventures 👋🏾\n\nMy name is ${customerName}.\n\n📅 Date: ${selectedDate}\n\n👥 Total Hikers: ${hikers}\n\n👤 GROUP BREAKDOWN`;

    Object.values(pricing).forEach(item => {
      if (item.count > 0) {
        message += `\n${item.label}: ${item.count}`;
      }
    });

    message += `\n\n💰 HIKING COST: KES ${hikingTotal.toLocaleString()}\n\n🚐 Transport: ${transportType}\n`;

    if (transportCost > 0) {
      message += `Transport Cost: KES ${transportCost.toLocaleString()}\n`;
    }

    if (parkingData.parkingCost > 0) {
      message += `🅿️ Parking: ${parkingData.cars} car(s) = KES ${parkingData.parkingCost.toLocaleString()}\n`;
    }

    message += `\n💰 TOTAL: KES ${total.toLocaleString()}\n\n💳 Booking Fee (30%): KES ${deposit.toLocaleString()}\n\nI will pay via Till Number 5440810.`;

    if (btn) {
      btn.href = `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;
      btn.classList.remove("disabled");
    }
  }

  Object.values(groupInputs).forEach(input => {
    input?.addEventListener("input", () => {
      updateTransportOptions();
      updateTransportUI();
      update();
    });
  });

  name?.addEventListener("input", update);
  residency?.addEventListener("change", () => {
    updateGroupAndTransportState();
    updateTransportOptions();
    updateTransportUI();
    update();
  });
  hikerType?.addEventListener("change", () => {
    updateGroupAndTransportState();
    updateTransportOptions();
    updateTransportUI();
    update();
  });
  transport?.addEventListener("change", () => {
    updateTransportUI();
    update();
  });
  parking?.addEventListener("change", update);
  date?.addEventListener("change", update);

  updateGroupAndTransportState();
  updateTransportOptions();
  updateTransportUI();
  update();
}

// ======================================
// 🚀 INIT BOTH CALCULATORS
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  initBookingCalculator({
    name: "#customerName",
    residency: "#customerResidency",
    hikerType: "#customerHikerType",
    categories: {
      residentAdult: "#residentAdults",
      residentStudent: "#residentStudents",
      residentChild: "#residentChildren",
      nonresidentAdult: "#nonresidentAdults",
      nonresidentStudent: "#nonresidentStudents",
      nonresidentChild: "#nonresidentChildren"
    },
    transport: "#transportOption",
    groupWrapper: ".group-pricing",
    transportWrapper: "#transportOptionWrapper",
    parking: "#parking",
    date: "#hikeDate",

    total: "#total",
    deposit: "#deposit",
    button: "#whatsappLink",

    resultCard: "#resultCard",
    totalHikers: "#totalHikers",
    breakdown: "#priceBreakdown",

    parkingBox: "#parkingBox",
    pickupInfoBox: "#pickupInfoBox",
    pickupInfo: "#pickupInfo"
  });

  initBookingCalculator({
    name: "#eventName",
    residency: "#eventResidency",
    hikerType: "#eventHikerType",
    categories: {
      residentAdult: "#eventResidentAdults",
      residentStudent: "#eventResidentStudents",
      residentChild: "#eventResidentChildren",
      nonresidentAdult: "#eventNonresidentAdults",
      nonresidentStudent: "#eventNonresidentStudents",
      nonresidentChild: "#eventNonresidentChildren"
    },
    transport: "#eventTransport",
    groupWrapper: ".group-pricing",
    transportWrapper: "#eventTransportWrapper",
    parking: "#eventParking",
    date: null,

    total: "#eventTotal",
    deposit: "#eventDeposit",
    button: "#eventWhatsapp",

    resultCard: "#eventResultCard",
    totalHikers: "#eventTotalHikers",
    breakdown: "#eventPriceBreakdown",

    parkingBox: "#eventParkingBox",
    pickupInfoBox: "#eventPickupInfoBox",
    pickupInfo: "#eventPickupInfo"
  });
});