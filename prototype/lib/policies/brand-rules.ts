export const POLICY_RULESET_VERSION = "brand-guardian-1.0.0" as const;

export const BRAND_RULES = {
  rights: {
    id: "RIGHTS-001",
    message: "Unlicensed match footage, event marks, and commentary audio are prohibited.",
    remediation: "Replace with original creator-led content without match footage, marks, or commentary audio.",
  },
  claims: {
    id: "CLAIMS-001",
    prohibitedTerms: ["guaranteed", "stops sweat", "medical sweat prevention"],
    message: "The copy contains a prohibited or unsubstantiated performance claim.",
    remediation: "Use the configured confidence or substantiated odour-protection territory.",
  },
  disclosure: {
    id: "DISCLOSURE-001",
    message: "Paid or synthetic-demo content needs an explicit disclosure.",
    remediation: "Add #ad or an explicit synthetic competition-demo disclosure.",
  },
  inclusion: {
    id: "INCLUSION-001",
    message: "The variant fails the configured inclusion and body-shaming safeguard.",
    remediation: "Remove fear, shame, exclusion, or appearance-anxiety framing.",
  },
  expiry: {
    id: "EXPIRY-001",
    message: "The configured rights window is missing or expired.",
    remediation: "Use a variant with a current, explicit rights window.",
  },
} as const;
