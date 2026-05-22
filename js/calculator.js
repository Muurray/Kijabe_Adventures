// ======================================
// 🔥 CENTRAL PRICING ENGINE
// ======================================

const PricingEngine = {

  BOOKING_FEE_RATE: 0.3,
  PARKING_PER_CAR: 300,

  prices: {
    resident: {
      adult: 2000,
      student: 1500,
      child: 1000
    },

    nonresident: {
      adult: 3000,
      student: 2500,
      child: 2000
    }
  },

  getPrice(type, residency) {

    if (!this.prices[residency]) return 0;
    return this.prices[residency][type] || 0;
  },

  calculateParking(people, enabled) {

    if (!enabled) {
      return {
        cars: 0,
        parkingCost: 0
      };
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
// 🔥 REUSABLE CALCULATOR
// ======================================

function initBookingCalculator(config) {

  const name = document.querySelector(config.name);
  const people = document.querySelector(config.people);
  const type = document.querySelector(config.type);
  const residency = document.querySelector(config.residency);
  const parking = document.querySelector(config.parking);

  const totalEl = document.querySelector(config.total);
  const depositEl = document.querySelector(config.deposit);
  const btn = document.querySelector(config.button);

  if (!name || !people || !type || !residency) return;

  function update() {

    const customerName = name.value.trim();
    const hikers = parseInt(people.value);
    const hikeType = type.value;
    const residentType = residency.value;

    if (
      !customerName ||
      !hikers ||
      !hikeType ||
      !residentType
    ) {

      totalEl.innerText = "KES 0";
      depositEl.innerText = "KES 0";

      btn.classList.add("disabled");
      btn.href = "#";

      return;
    }

    // PRICE
    const pricePerPerson =
      PricingEngine.getPrice(hikeType, residentType);

    let total = pricePerPerson * hikers;

    // PARKING
    const parkingData =
      PricingEngine.calculateParking(
        hikers,
        parking?.checked
      );

    total += parkingData.parkingCost;

    // DEPOSIT
    const deposit =
      PricingEngine.calculateDeposit(total);

    // UI
    totalEl.innerText =
      `KES ${total.toLocaleString()}`;

    depositEl.innerText =
      `KES ${deposit.toLocaleString()}`;

    // WHATSAPP MESSAGE
    const message = `Hello Kijabe Adventures 👋🏾

My name is ${customerName}.

I want to book a hike.

👥 People: ${hikers}
👤 Type: ${hikeType}
🌍 Residency: ${residentType}

🚗 Cars: ${parkingData.cars}
🅿️ Parking: KES ${parkingData.parkingCost}

💰 Total: KES ${total.toLocaleString()}
💳 Deposit (30%): KES ${deposit.toLocaleString()}

I will pay via Till Number 5440810.`;

    btn.href =
      `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;

    btn.classList.remove("disabled");
  }

  // EVENTS
  name.addEventListener("input", update);
  people.addEventListener("input", update);
  type.addEventListener("change", update);
  residency.addEventListener("change", update);
  parking?.addEventListener("change", update);
}

// ======================================
// 🚀 INIT ALL CALCULATORS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  // EVENT BANNER
  initBookingCalculator({

    name: "#eventName",
    people: "#eventPeople",
    type: "#eventType",
    residency: "#eventResidency",
    parking: "#eventParking",

    total: "#eventTotal",
    deposit: "#eventDeposit",
    button: "#eventWhatsapp"
  });

  // EVENT MODAL
  initBookingCalculator({

    name: "#modalEventName",
    people: "#modalEventPeople",
    type: "#modalEventType",
    residency: "#modalEventResidency",
    parking: "#modalEventParking",

    total: "#modalEventTotal",
    deposit: "#modalEventDeposit",
    button: "#modalEventWhatsapp"
  });

  // PRIVATE BOOKING
  initBookingCalculator({

    name: "#customerName",
    people: "#hikers",
    type: "#hikeType",
    residency: "#residency",
    parking: "#parking",

    total: "#total",
    deposit: "#deposit",
    button: "#whatsappLink"
  });

});
