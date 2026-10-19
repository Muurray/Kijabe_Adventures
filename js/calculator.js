// ======================================
// 🔥 CENTRAL PRICING ENGINE
// ======================================

const PricingEngine = {

  BOOKING_FEE_RATE: 0.3,
  PARKING_PER_CAR: 300,

  transportFees: {
    self: 0,
    nairobi: 5929,
    westlands: 4959,
    kikuyu: 3591,
    thika: 7219,
    coaster: 0,
    bus: 0
  },

  prices: {
    resident: {
      adult: 1083,
      student: 785,
      child: 685
    },
    nonresident: {
      adult: 1633,
      student: 985,
      child: 885
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

  calculateDeposit(total, rate = this.BOOKING_FEE_RATE) {
    return Math.round(total * rate);
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
  const phone = config.phone ? document.querySelector(config.phone) : null;
  const residency = document.querySelector(config.residency);
  const hikerType = document.querySelector(config.hikerType);
  const destination = config.destination ? document.querySelector(config.destination) : null;
  const groupInputs = Object.fromEntries(
    Object.entries(config.categories).map(([key, selector]) => [key, document.querySelector(selector)])
  );
  const transport = document.querySelector(config.transport);
  const transportMode = config.transportMode ? document.querySelector(config.transportMode) : null;
  const sharedPickup = config.sharedPickup ? document.querySelector(config.sharedPickup) : null;
  const meetingPoint = config.meetingPoint ? document.querySelector(config.meetingPoint) : null;
  const groupWrapper = config.groupWrapper ? document.querySelector(config.groupWrapper) : null;
  const transportWrapper = config.transportWrapper ? document.querySelector(config.transportWrapper) : null;
  const privateTransportWrapper = config.privateTransportWrapper ? document.querySelector(config.privateTransportWrapper) : null;
  const sharedTransportWrapper = config.sharedTransportWrapper ? document.querySelector(config.sharedTransportWrapper) : null;
  const meetingPointWrapper = config.meetingPointWrapper ? document.querySelector(config.meetingPointWrapper) : null;
  const parking = document.querySelector(config.parking);
  const date = config.date ? document.querySelector(config.date) : null;

  const totalEl = document.querySelector(config.total);
  const depositEl = document.querySelector(config.deposit);
  const balanceEl = config.balance ? document.querySelector(config.balance) : null;
  const btn = document.querySelector(config.button);
  const resultCard = document.querySelector(config.resultCard);
  const totalHikersEl = document.querySelector(config.totalHikers);

  const parkingBox = document.querySelector(config.parkingBox);
  const pickupInfoBox = document.querySelector(config.pickupInfoBox);
  const pickupInfo = document.querySelector(config.pickupInfo);
  let currentBooking = null;

  if (date) {
    const today = new Date();
    date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }

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
      const isSelfDrive = transportMode ? transportMode.value === "self-drive" : transport?.value === "self";
      parkingBox.classList.toggle("is-collapsed", !hasSelection || !isSelfDrive);
    }

    if (pickupInfoBox) {
      const hasPickup = transportMode ? transportMode.value === "private" && transport?.value && transport.value !== "self" : transport?.value && transport.value !== "self";
      pickupInfoBox.classList.toggle("is-collapsed", !hasSelection || !hasPickup);
    }

    if (transportMode) {
      transportMode.disabled = !hasSelection;
      if (!hasSelection) transportMode.value = "";
    }

    if (privateTransportWrapper) {
      privateTransportWrapper.classList.toggle("is-collapsed", !hasSelection || transportMode?.value !== "private");
    }

    if (sharedTransportWrapper) {
      sharedTransportWrapper.classList.toggle("is-collapsed", !hasSelection || transportMode?.value !== "shared");
    }

    if (meetingPointWrapper) {
      meetingPointWrapper.classList.toggle("is-collapsed", !hasSelection || transportMode?.value !== "meeting-point");
    }

    if (transport) {
      transport.disabled = !hasSelection || Boolean(transportMode && transportMode.value !== "private");
      if (!hasSelection) {
        transport.innerHTML = '<option value="">Select Transport</option>';
        transport.value = "";
      }
    }

    if (sharedPickup) {
      sharedPickup.disabled = !hasSelection || transportMode?.value !== "shared";
      if (!hasSelection || transportMode?.value !== "shared") sharedPickup.value = "";
    }

    if (meetingPoint) {
      meetingPoint.disabled = !hasSelection || transportMode?.value !== "meeting-point";
      if (!hasSelection || transportMode?.value !== "meeting-point") meetingPoint.value = "";
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

    const options = TransportRules.getAvailableOptions(totalHikers());
    const allowed = transportMode ? options.filter(key => key !== "self") : options;
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

    if (transportMode?.value === "shared" || transportMode?.value === "meeting-point") {
      if (parkingBox) parkingBox.classList.add("is-collapsed");
      if (pickupInfoBox) pickupInfoBox.classList.add("is-collapsed");
      return;
    }

    if (transportMode?.value === "self-drive") {
      if (parkingBox) parkingBox.classList.remove("is-collapsed");
      if (pickupInfoBox) pickupInfoBox.classList.add("is-collapsed");
      return;
    }

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
        nairobi: "🚐 Pickup: Nairobi CBD — time to be agreed",
        westlands: "🚐 Pickup: Westlands — time to be agreed",
        kikuyu: "🚐 Pickup: Kikuyu — time to be agreed",
        thika: "🚐 Pickup: Thika — time to be agreed",
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
    const customerPhone = phone?.value?.trim() || "";
    const validPhone = /^(?:(?:\+?254)|0)?[17]\d{8}$/.test(customerPhone.replace(/[\s()-]/g, ""));
    const selectedResidency = residency?.value || "";
    const selectedType = hikerType?.value || "";
    const selectedDestination = destination?.value || config.destination || "";
    const hikers = totalHikers();
    const transportType = transport?.value || "";
    const selectedTransportMode = transportMode?.value || "";
    const selectedSharedPickup = sharedPickup?.value || "";
    const hasTransportSelection = transportMode
      ? selectedTransportMode === "shared"
        ? Boolean(selectedSharedPickup)
        : selectedTransportMode === "private"
          ? Boolean(transportType)
          : selectedTransportMode === "meeting-point"
            ? Boolean(meetingPoint?.value)
            : selectedTransportMode === "self-drive"
      : Boolean(transportType);
    const selectedDate = date?.value || config.preferredDate || "";
    const isValidDate = date || config.preferredDate
      ? Boolean(selectedDate && (!date?.min || selectedDate >= date.min))
      : true;
    const canEstimate = hikers > 0 && selectedResidency && selectedType && hasTransportSelection;
    const canConfirm = Boolean(canEstimate && customerName && validPhone && isValidDate && selectedDestination);

    if (!canEstimate) {
      if (resultCard) {
        resultCard.style.display = "none";
        resultCard.hidden = true;
      }
      if (totalEl) totalEl.innerText = "0";
      if (depositEl) depositEl.innerText = "0";
      if (balanceEl) balanceEl.innerText = "0";
      if (totalHikersEl) totalHikersEl.innerText = "0";
      if (btn) {
        btn.classList.add("disabled");
        btn.href = "#";
        btn.setAttribute("aria-disabled", "true");
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
        const price = config.prices?.[category]?.[type] ?? PricingEngine.getPrice(type, category);
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
    const transportFee = selectedTransportMode === "shared"
      ? Number(config.sharedTransportFares?.[selectedSharedPickup]) || 0
      : PricingEngine.getTransportFee(transportType);
    const transportCost = selectedTransportMode === "shared"
      ? transportFee * hikers
      : transportFee === 0 ? 0 : transportFee * carsNeeded;
    const parkingData = PricingEngine.calculateParking(
      hikers,
      (selectedTransportMode === "self-drive" || (!transportMode && transportType === "self")) && parking?.checked
    );
    const total = hikingTotal + transportCost + parkingData.parkingCost;
    const bookingFeeRate = config.bookingFeeRate ?? PricingEngine.BOOKING_FEE_RATE;
    const bookingFeePercent = Math.round(bookingFeeRate * 100);
    const deposit = PricingEngine.calculateDeposit(total, bookingFeeRate);

    if (resultCard) {
      resultCard.style.display = "block";
      resultCard.hidden = false;
    }
    if (totalHikersEl) totalHikersEl.innerText = hikers;
    if (totalEl) totalEl.innerText = total.toLocaleString();
    if (depositEl) depositEl.innerText = deposit.toLocaleString();
    if (balanceEl) balanceEl.innerText = (total - deposit).toLocaleString();

    if (!canConfirm) {
      currentBooking = null;
      if (btn) {
        btn.classList.add("disabled");
        btn.href = "#";
        btn.setAttribute("aria-disabled", "true");
      }
      return;
    }

    const meetingPointLabel = meetingPoint?.selectedOptions?.[0]?.textContent.trim() || "";
    const transportLabel = selectedTransportMode === "shared"
      ? `Shared Transport - ${selectedSharedPickup.charAt(0).toUpperCase()}${selectedSharedPickup.slice(1)}`
      : selectedTransportMode === "self-drive"
        ? "Self-drive / Own Transport"
        : selectedTransportMode === "meeting-point"
          ? `Meet at ${meetingPointLabel}`
          : transport?.selectedOptions?.[0]?.textContent.trim() || "";

    currentBooking = {
      bookingType: config.bookingType || "Private Group Hike",
      activity: config.bookingActivity || selectedDestination,
      preferredDate: selectedDate,
      participants: hikers,
      customerName,
      phone: customerPhone,
      email: "",
      transport: transportLabel,
      totalCost: total,
      bookingFee: deposit,
      remainingBalance: total - deposit,
      paymentOption: "M-Pesa Till 5440810"
    };

    let message = `Hello Kijabe Adventures 👋🏾\n\nMy name is ${customerName}.\nPhone: ${customerPhone}\nDestination: ${selectedDestination}\n📅 Date: ${selectedDate}\n\n👥 Total Hikers: ${hikers}\n\n👤 GROUP BREAKDOWN`;

    Object.values(pricing).forEach(item => {
      if (item.count > 0) {
        message += `\n${item.label}: ${item.count}`;
      }
    });

    const transportMessage = selectedTransportMode === "shared"
      ? `${transportLabel} (KES ${transportFee.toLocaleString()} per person)`
      : transportLabel || transportType;
    message += `\n\n🥾 Hiking Cost: KES ${hikingTotal.toLocaleString()}`;
    message += `\n\n🚐 Transport: ${transportMessage}\n`;

    if (transportCost > 0) {
      message += `Transport Cost: KES ${transportCost.toLocaleString()}\n`;
    }

    if (parkingData.parkingCost > 0) {
      message += `🅿️ Parking: ${parkingData.cars} car(s) = KES ${parkingData.parkingCost.toLocaleString()}\n`;
    }

    message += `\n💰 TOTAL: KES ${total.toLocaleString()}\n\n💳 Booking Fee (${bookingFeePercent}%): KES ${deposit.toLocaleString()}\n💵 Remaining Balance: KES ${(total - deposit).toLocaleString()}\n\nI will pay via Till Number 5440810.`;

    if (config.bookingMessage) {
      message += `\n\n${config.bookingMessage}`;
    }

    if (btn) {
      btn.href = `https://wa.me/254743980340?text=${encodeURIComponent(message)}`;
      btn.classList.remove("disabled");
      btn.setAttribute("aria-disabled", "false");
    }
  }

  btn?.addEventListener("click", async event => {
    if (!currentBooking || btn.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const whatsappUrl = btn.href;
    btn.classList.add("disabled");
    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("aria-busy", "true");

    try {
      await window.saveBookingToGoogleSheet(currentBooking);
    } catch (error) {
      console.error("Could not send booking to Google Sheets.", error);
      window.alert("We could not confirm that your booking details were saved. Please continue in WhatsApp and send your booking details there.");
    } finally {
      window.location.assign(whatsappUrl);
    }
  });

  Object.values(groupInputs).forEach(input => {
    input?.addEventListener("input", () => {
      updateTransportOptions();
      updateTransportUI();
      update();
    });
  });

  name?.addEventListener("input", update);
  phone?.addEventListener("input", update);
  destination?.addEventListener("change", update);
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
  transportMode?.addEventListener("change", () => {
    if (transport) transport.value = "";
    if (sharedPickup) sharedPickup.value = "";
    if (meetingPoint) meetingPoint.value = "";
    updateGroupAndTransportState();
    updateTransportUI();
    update();
  });
  sharedPickup?.addEventListener("change", update);
  meetingPoint?.addEventListener("change", update);
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
    phone: "#customerPhone",
    destination: "#destination",
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
    balance: "#balance",
    button: "#whatsappLink",

    resultCard: "#resultCard",
    totalHikers: "#totalHikers",

    parkingBox: "#parkingBox",
    pickupInfoBox: "#pickupInfoBox",
    pickupInfo: "#pickupInfo",
    bookingType: "Private Group Hike",
    bookingFeeRate: 0.5,
    prices: {
      resident: {
        adult: 1183,
        student: 885,
        child: 785
      },
      nonresident: {
        adult: 1883,
        student: 1285,
        child: 985
      }
    },
    bookingMessage: "I understand my booking is confirmed after the 50% booking fee or full payment is received. Meeting point or arranged pick-up point details are shared after the 50% fee is received. I will meet my assigned guides there and, if I paid the 50% fee, pay the remaining balance after meeting them and before the hike begins. Full payment in advance is also accepted."
  });

  initBookingCalculator({
    name: "#eventName",
    phone: "#eventPhone",
    preferredDate: new Date(SITE_CONFIG.eventDate).toISOString().slice(0, 10),
    bookingType: "Upcoming Group Hike",
    bookingActivity: SITE_CONFIG.eventTitle,
    destination: SITE_CONFIG.destination,
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
    transportMode: "#eventTransportMode",
    sharedPickup: "#eventSharedPickup",
    meetingPoint: "#eventMeetingPoint",
    sharedTransportFares: {
      thika: 1500,
      nairobi: 1000,
      kikuyu: 800
    },
    groupWrapper: ".group-pricing",
    transportWrapper: "#eventTransportWrapper",
    privateTransportWrapper: "#eventPrivateTransportWrapper",
    sharedTransportWrapper: "#eventSharedTransportWrapper",
    meetingPointWrapper: "#eventMeetingPointWrapper",
    parking: "#eventParking",
    date: null,

    total: "#eventTotal",
    deposit: "#eventDeposit",
    balance: "#eventBalance",
    button: "#eventWhatsapp",

    resultCard: "#eventResultCard",
    totalHikers: "#eventTotalHikers",

    parkingBox: "#eventParkingBox",
    pickupInfoBox: "#eventPickupInfoBox",
    pickupInfo: "#eventPickupInfo"
  });
});