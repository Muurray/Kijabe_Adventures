// ======================================
// 🔥 CENTRAL PRICING ENGINE
// ======================================

const PricingEngine = {

  BOOKING_FEE_RATE: 0.3,
  PARKING_PER_CAR: 300,

  transportFees: {
    self: 0,
    nairobi: 800,
    westlands: 700,
    kikuyu: 500,
    thika: 1000,
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
    if (!enabled) return { cars: 0, parkingCost: 0 };

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

    if (n <= 0) return ["self", "nairobi", "westlands", "kikuyu"];

    if (n <= 4) return ["self", "nairobi", "westlands", "kikuyu"];

    if (n <= 10) return ["nairobi", "westlands", "kikuyu", "thika"];

    if (n <= 20) return ["coaster"];

    return ["bus"];
  }
};


// ======================================
// 🚀 BOOKING CALCULATOR
// ======================================

function initBookingCalculator(config) {

  // ================= INPUTS =================
  const name = document.querySelector(config.name);
  const people = document.querySelector(config.people);
  const type = document.querySelector(config.type);
  const residency = document.querySelector(config.residency);
  const transport = document.querySelector(config.transport);
  const parking = document.querySelector(config.parking);
  const date = document.querySelector(config.date);

  // ================= OUTPUTS =================
  const totalEl = document.querySelector(config.total);
  const depositEl = document.querySelector(config.deposit);
  const btn = document.querySelector(config.button);
  const resultCard = document.querySelector(config.resultCard);
  const totalHikersEl = document.querySelector(config.totalHikers);

  // ================= UI =================
  const parkingBox = document.querySelector(config.parkingBox);
  const pickupInfoBox = document.querySelector(config.pickupInfoBox);
  const pickupInfo = document.querySelector(config.pickupInfo);

  // ================= DATE LIMIT =================
  if (date) {
    date.min = new Date().toISOString().split("T")[0];
  }

  // ======================================
  // 🚐 TRANSPORT OPTIONS (WORKS FOR BOTH)
  // ======================================

  function updateTransportOptions() {

    const hikers = parseInt(people?.value, 10) || 0;
    const select = transport;

    if (!select) return;

    const labels = {
      self: "Own Transport",
      nairobi: "Nairobi Pickup",
      westlands: "Westlands Pickup",
      kikuyu: "Kikuyu Pickup",
      thika: "Thika Pickup",
      coaster: "Coaster Bus",
      bus: "Large Bus"
    };

    const allowed = TransportRules.getAvailableOptions(hikers);

    select.innerHTML = `<option value="">Select Transport</option>`;

    allowed.forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = labels[key] || key;
      select.appendChild(opt);
    });

    if (!allowed.includes(select.value)) {
      select.value = "";
    }
  }

  // ======================================
  // 🚐 TRANSPORT UI
  // ======================================

  function updateTransportUI() {

    if (!transport) return;

    const value = transport.value;

    if (value === "self") {
      if (parkingBox) parkingBox.style.display = "block";
      if (pickupInfoBox) pickupInfoBox.style.display = "none";
    }

    else if (value) {

      if (parkingBox) parkingBox.style.display = "none";
      if (pickupInfoBox) pickupInfoBox.style.display = "block";

      const infoMap = {
        nairobi: "🚐 Pickup: Nairobi CBD — 6:00 AM",
        westlands: "🚐 Pickup: Westlands — 6:20 AM",
        kikuyu: "🚐 Pickup: Kikuyu — 7:00 AM",
        thika: "🚐 Pickup: Thika — 5:30 AM",
        coaster: "🚌 Coaster Bus Pickup — details shared later",
        bus: "🚌 Large Bus Pickup — details shared later"
      };

      if (pickupInfo) {
        pickupInfo.innerHTML = infoMap[value] || "";
      }

      if (parking) parking.checked = false;
    }

    else {
      if (parkingBox) parkingBox.style.display = "none";
      if (pickupInfoBox) pickupInfoBox.style.display = "none";
    }
  }

  // ======================================
  // 🧠 MAIN UPDATE
  // ======================================

  function update() {

    const customerName = name?.value?.trim() || "";
    const hikers = parseInt(people?.value, 10) || 0;
    const hikeType = type?.value || "";
    const residentType = residency?.value || "";
    const transportType = transport?.value || "";
    const selectedDate = date?.value || "";

    const isValid =
      customerName &&
      hikers > 0 &&
      hikeType &&
      residentType &&
      transportType;

    if (!isValid) {

      if (resultCard) resultCard.style.display = "none";

      if (totalEl) totalEl.innerText = "0";
      if (depositEl) depositEl.innerText = "0";

      if (btn) {
        btn.classList.add("disabled");
        btn.href = "#";
      }

      return;
    }

    // ================= BASE PRICE =================
    const pricePerPerson =
      PricingEngine.getPrice(hikeType, residentType);

    let total = pricePerPerson * hikers;

    // ================= TRANSPORT =================
    const seatsPerCar = 4;
    const carsNeeded = Math.ceil(hikers / seatsPerCar);

    const transportFee =
      PricingEngine.getTransportFee(transportType);

    total += transportFee === 0 ? 0 : transportFee * carsNeeded;

    // ================= PARKING =================
    const parkingEnabled =
      transportType === "self" && parking?.checked;

    const parkingData =
      PricingEngine.calculateParking(hikers, parkingEnabled);

    total += parkingData.parkingCost;

    // ================= DEPOSIT =================
    const deposit =
      PricingEngine.calculateDeposit(total);

    // ================= UI =================
    if (resultCard) resultCard.style.display = "block";
    if (totalHikersEl) totalHikersEl.innerText = hikers;

    totalEl.innerText = total.toLocaleString();
    depositEl.innerText = deposit.toLocaleString();

    // ================= WHATSAPP =================
    const message = `
Hello Kijabe Adventures 👋🏾

My name is ${customerName}.

📅 Date: ${selectedDate}

👥 Hikers: ${hikers}
👤 Type: ${hikeType}
🌍 Residency: ${residentType}

🚐 Transport: ${transportType}

💰 Total: KES ${total.toLocaleString()}
💳 Booking Fee (30%): KES ${deposit.toLocaleString()}

I will pay via Till Number 5440810.
`;

    btn.href =
      `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;

    btn.classList.remove("disabled");
  }

  // ======================================
  // 🎯 EVENTS
  // ======================================

  name?.addEventListener("input", update);

  people?.addEventListener("input", () => {
    updateTransportOptions();
    update();
  });

  type?.addEventListener("change", update);
  residency?.addEventListener("change", update);

  transport?.addEventListener("change", () => {
    updateTransportUI();
    update();
  });

  date?.addEventListener("change", update);
  parking?.addEventListener("change", update);

  // ================= INIT =================
  updateTransportOptions();
  updateTransportUI();
  update();
}


// ======================================
// 🚀 INIT BOTH CALCULATORS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  // PRIVATE
  initBookingCalculator({
    name: "#customerName",
    people: "#hikers",
    type: "#hikeType",
    residency: "#residency",
    transport: "#transportOption",
    parking: "#parking",
    date: "#hikeDate",

    total: "#total",
    deposit: "#deposit",
    button: "#whatsappLink",

    resultCard: "#resultCard",
    totalHikers: "#totalHikers",

    parkingBox: "#parkingBox",
    pickupInfoBox: "#pickupInfoBox",
    pickupInfo: "#pickupInfo"
  });

  // EVENT (FIXED)
  initBookingCalculator({
    name: "#eventName",
    people: "#eventPeople",
    type: "#eventType",
    residency: "#eventResidency",
    transport: "#eventTransport",
    parking: "#eventParking",
    date: null, // optional

    total: "#eventTotal",
    deposit: "#eventDeposit",
    button: "#eventWhatsapp",

    resultCard: "#eventResultCard",
    totalHikers: "#eventTotalHikers",

    parkingBox: "#eventParkingBox",
    pickupInfoBox: "#eventPickupInfoBox",
    pickupInfo: "#eventPickupInfo"
  });

});