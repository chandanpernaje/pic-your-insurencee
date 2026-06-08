// Sourced from official IRDAI Point of Sales Person (POSP) certificate
// issued via Girnar Insurance Brokers Pvt. Ltd. (InsuranceDekho)
export const AGENT = {
  name: "Nandan Kumar Pernaje",
  shortName: "Nandan Kumar Pernaje",
  initials: "NP",
  company: "Pic Your Insurance",
  companyFull: "Pernaje Insurance Services",
  tagline: "Online insurance available from all companies — at the lowest price",
  taglineKn: "ಎಲ್ಲಾ ಕಂಪನಿಗಳ ಆನ್‌ಲೈನ್ ವಿಮೆ — ಅತ್ಯಂತ ಕಡಿಮೆ ಬೆಲೆಯಲ್ಲಿ",
  phone: "918971542643", // +91 89715 42643
  phoneDisplay: "+91 89715 42643",
  email: "contact@picyourinsurance.com",
  designer: "Chandan",
  location: "Dakshina Kannada, Karnataka",
  locationKn: "ದಕ್ಷಿಣ ಕನ್ನಡ, ಕರ್ನಾಟಕ",
  pin: "574223",
  // IRDAI / Broker credentials from the POSP certificate
  credentials: {
    role: "Certified Point of Sales Person (POSP)",
    roleKn: "ಪ್ರಮಾಣೀಕೃತ ಪಾಯಿಂಟ್ ಆಫ್ ಸೇಲ್ಸ್ ಪರ್ಸನ್ (POSP)",
    posCode: "582239",
    broker: "Girnar Insurance Brokers Pvt. Ltd. (InsuranceDekho)",
    irdaiLicense: "588",
    category: "Direct Broker (Life & General)",
  },
  vehicleTypes: ["Bike", "Car", "Bus", "Auto"],
  services: ["New Policy", "Renewal", "Add-ons", "Zero Depreciation"],
  servicesKn: ["ಹೊಸ ಪಾಲಿಸಿ", "ನವೀಕರಣ", "ಆಡ್-ಆನ್‌ಗಳು", "ಶೂನ್ಯ ಸವಕಳಿ"],
  // Partner portals Nandan uses to source & compare quotes
  portals: {
    insuranceDekho: "https://www.insurancedekho.com",
    policyBazaar: "https://www.policybazaar.com",
  },
  // Deep links per category — open the comparison page on each portal
  compareLinks: {
    health: {
      insuranceDekho: "https://www.insurancedekho.com/health-insurance",
      policyBazaar: "https://www.policybazaar.com/health-insurance/",
    },
    car: {
      insuranceDekho: "https://www.insurancedekho.com/car-insurance",
      policyBazaar: "https://www.policybazaar.com/motor-insurance/car-insurance/",
    },
    bike: {
      insuranceDekho: "https://www.insurancedekho.com/two-wheeler-insurance",
      policyBazaar: "https://www.policybazaar.com/two-wheeler-insurance/",
    },
    commercial: {
      insuranceDekho: "https://www.insurancedekho.com/commercial-vehicle-insurance",
      policyBazaar: "https://www.policybazaar.com/commercial-vehicle-insurance/",
    },
  },
};

export function whatsappLink(message: string) {
  return `https://wa.me/${AGENT.phone}?text=${encodeURIComponent(message)}`;
}
