/**
 * In-memory database seeded from the existing mock constants.
 * Swap this out for a real Prisma/Drizzle/pg client without touching
 * any repository or service code.
 */

import type {
  AgencyRow,
  ServiceRow,
  StepRow,
  RequirementRow,
  UserProgressRow,
} from "@/src/lib/db-types";

// ── Seed data ─────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

export const agencies: AgencyRow[] = [
  { id: "1", slug: "dfa", name: "Department of Foreign Affairs", acronym: "DFA", description: "Handles passport applications and authentication of documents.", logo_url: null, website: "https://dfa.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "2", slug: "lto", name: "Land Transportation Office", acronym: "LTO", description: "Regulates land transportation, licenses drivers, and registers vehicles.", logo_url: null, website: "https://lto.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "3", slug: "bir", name: "Bureau of Internal Revenue", acronym: "BIR", description: "Administers and enforces internal revenue laws.", logo_url: null, website: "https://bir.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "4", slug: "psa", name: "Philippine Statistics Authority", acronym: "PSA", description: "Issues birth, marriage, and death certificates and national IDs.", logo_url: null, website: "https://psa.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "5", slug: "sss", name: "Social Security System", acronym: "SSS", description: "Provides social insurance programs for private sector workers.", logo_url: null, website: "https://sss.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "6", slug: "philhealth", name: "Philippine Health Insurance Corporation", acronym: "PhilHealth", description: "Provides health insurance coverage and affordable healthcare.", logo_url: null, website: "https://philhealth.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "7", slug: "pagibig", name: "Home Development Mutual Fund", acronym: "Pag-IBIG", description: "Provides housing loans and savings programs.", logo_url: null, website: "https://pagibigfund.gov.ph", is_active: true, created_at: now, updated_at: now },
  { id: "8", slug: "nbi", name: "National Bureau of Investigation", acronym: "NBI", description: "Issues NBI clearance certificates for employment and legal purposes.", logo_url: null, website: "https://nbi.gov.ph", is_active: true, created_at: now, updated_at: now },
];

export const services: ServiceRow[] = [
  { id: "1", slug: "passport-new", agency_id: "1", title: "New Passport Application", description: "Apply for a new Philippine passport for travel abroad.", category: "travel", total_fee: 950, processing_time: "10-15 working days", is_featured: true, is_active: true, tags: ["passport", "travel", "DFA"], created_at: now, updated_at: now },
  { id: "2", slug: "drivers-license-new", agency_id: "2", title: "New Driver's License", description: "Get your first Philippine driver's license from LTO.", category: "vehicle", total_fee: 1000, processing_time: "1-3 working days", is_featured: true, is_active: true, tags: ["license", "driving", "LTO"], created_at: now, updated_at: now },
  { id: "3", slug: "nbi-clearance", agency_id: "8", title: "NBI Clearance", description: "Obtain NBI clearance for employment, travel, or legal purposes.", category: "identity", total_fee: 155, processing_time: "1-3 working days", is_featured: true, is_active: true, tags: ["NBI", "clearance", "background check"], created_at: now, updated_at: now },
  { id: "4", slug: "psa-birth-certificate", agency_id: "4", title: "PSA Birth Certificate", description: "Request an official copy of your birth certificate from PSA.", category: "identity", total_fee: 365, processing_time: "3-5 working days", is_featured: true, is_active: true, tags: ["PSA", "birth certificate", "civil registry"], created_at: now, updated_at: now },
  { id: "5", slug: "sss-membership", agency_id: "5", title: "SSS Membership Registration", description: "Register as an SSS member to access social insurance benefits.", category: "social-services", total_fee: 0, processing_time: "1-2 working days", is_featured: true, is_active: true, tags: ["SSS", "social security", "membership"], created_at: now, updated_at: now },
  { id: "6", slug: "philhealth-registration", agency_id: "6", title: "PhilHealth Membership", description: "Register for PhilHealth to access healthcare benefits.", category: "healthcare", total_fee: 0, processing_time: "1 working day", is_featured: true, is_active: true, tags: ["PhilHealth", "health insurance", "membership"], created_at: now, updated_at: now },
];

export const steps: StepRow[] = [
  // Passport
  { id: "s1-1", service_id: "1", order: 1, title: "Online Appointment", description: "Book an appointment via DFA website", duration: "15 minutes", fee: null, location: null, created_at: now, updated_at: now },
  { id: "s1-2", service_id: "1", order: 2, title: "Personal Appearance", description: "Visit DFA office on your scheduled date", duration: "2-4 hours", fee: 950, location: "DFA Office", created_at: now, updated_at: now },
  { id: "s1-3", service_id: "1", order: 3, title: "Biometrics & Photo", description: "Have your biometrics and photo captured", duration: "30 minutes", fee: null, location: null, created_at: now, updated_at: now },
  { id: "s1-4", service_id: "1", order: 4, title: "Receive Passport", description: "Receive via courier or pick up", duration: "10-15 working days", fee: null, location: null, created_at: now, updated_at: now },
  // Driver's License
  { id: "s2-1", service_id: "2", order: 1, title: "Complete Student Permit", description: "Hold student permit for required period", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s2-2", service_id: "2", order: 2, title: "Take Driving School", description: "Complete NTSC-accredited driving school", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s2-3", service_id: "2", order: 3, title: "Written Exam", description: "Pass the LTO written examination", duration: null, fee: 200, location: "LTO Office", created_at: now, updated_at: now },
  { id: "s2-4", service_id: "2", order: 4, title: "Practical Exam", description: "Pass the driving skills test", duration: null, fee: 200, location: "LTO Driving Range", created_at: now, updated_at: now },
  { id: "s2-5", service_id: "2", order: 5, title: "License Issuance", description: "Pay fees and receive your license", duration: null, fee: 600, location: "LTO Office", created_at: now, updated_at: now },
  // NBI Clearance
  { id: "s3-1", service_id: "3", order: 1, title: "Online Registration", description: "Register and fill out form at nbi-clearance.com", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s3-2", service_id: "3", order: 2, title: "Online Payment", description: "Pay ₱155 via e-payment channels", duration: null, fee: 155, location: null, created_at: now, updated_at: now },
  { id: "s3-3", service_id: "3", order: 3, title: "Appointment", description: "Choose your preferred NBI branch and date", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s3-4", service_id: "3", order: 4, title: "Personal Appearance", description: "Visit NBI with your IDs and receipt", duration: null, fee: null, location: "NBI Branch", created_at: now, updated_at: now },
  { id: "s3-5", service_id: "3", order: 5, title: "Receive Clearance", description: "Clearance released same day or within 3 days", duration: "1-3 days", fee: null, location: null, created_at: now, updated_at: now },
  // PSA
  { id: "s4-1", service_id: "4", order: 1, title: "Online Request", description: "Request via PSA Serbilis website or physical office", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s4-2", service_id: "4", order: 2, title: "Payment", description: "Pay ₱365 per copy", duration: null, fee: 365, location: null, created_at: now, updated_at: now },
  { id: "s4-3", service_id: "4", order: 3, title: "Delivery", description: "Receive via courier within 3-5 working days", duration: "3-5 working days", fee: null, location: null, created_at: now, updated_at: now },
  // SSS
  { id: "s5-1", service_id: "5", order: 1, title: "Fill Out E1 Form", description: "Accomplish the SSS Personal Record form", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s5-2", service_id: "5", order: 2, title: "Submit Requirements", description: "Submit to any SSS branch", duration: null, fee: null, location: "SSS Branch", created_at: now, updated_at: now },
  { id: "s5-3", service_id: "5", order: 3, title: "Receive SS Number", description: "Get your SS Number immediately", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s5-4", service_id: "5", order: 4, title: "Activate My.SSS", description: "Register on My.SSS portal for online services", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  // PhilHealth
  { id: "s6-1", service_id: "6", order: 1, title: "Accomplish PMRF", description: "Fill out PhilHealth Member Registration Form", duration: null, fee: null, location: null, created_at: now, updated_at: now },
  { id: "s6-2", service_id: "6", order: 2, title: "Submit to Branch", description: "Submit form and requirements to any PhilHealth office", duration: null, fee: null, location: "PhilHealth Branch", created_at: now, updated_at: now },
  { id: "s6-3", service_id: "6", order: 3, title: "Receive PhilHealth Number", description: "Get your PhilHealth Identification Number (PIN)", duration: null, fee: null, location: null, created_at: now, updated_at: now },
];

export const requirements: RequirementRow[] = [
  // Passport (service-level)
  { id: "r1-1", service_id: "1", step_id: null, label: "PSA Birth Certificate", description: "Original and photocopy", is_optional: false, copies: 2, created_at: now, updated_at: now },
  { id: "r1-2", service_id: "1", step_id: null, label: "Valid Government ID", description: "Any two valid IDs", is_optional: false, copies: 2, created_at: now, updated_at: now },
  { id: "r1-3", service_id: "1", step_id: null, label: "Accomplished Application Form", description: "DFA Passport Application Form", is_optional: false, copies: 1, created_at: now, updated_at: now },
  // Driver's License
  { id: "r2-1", service_id: "2", step_id: null, label: "Student Permit", description: "Valid student permit", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r2-2", service_id: "2", step_id: null, label: "Medical Certificate", description: "From accredited clinic", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r2-3", service_id: "2", step_id: null, label: "TIN Card or Number", description: "Required for application", is_optional: false, copies: 1, created_at: now, updated_at: now },
  // NBI
  { id: "r3-1", service_id: "3", step_id: null, label: "Valid Government ID", description: "One primary or two secondary IDs", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r3-2", service_id: "3", step_id: null, label: "Payment Receipt", description: "Online payment confirmation", is_optional: false, copies: 1, created_at: now, updated_at: now },
  // PSA
  { id: "r4-1", service_id: "4", step_id: null, label: "Valid ID", description: "One government-issued ID", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r4-2", service_id: "4", step_id: null, label: "Accomplished Request Form", description: "PSA SERBILIS form", is_optional: false, copies: 1, created_at: now, updated_at: now },
  // SSS
  { id: "r5-1", service_id: "5", step_id: null, label: "E1 Form", description: "Personal Record form", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r5-2", service_id: "5", step_id: null, label: "Birth Certificate", description: "PSA-issued birth certificate", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r5-3", service_id: "5", step_id: null, label: "Valid ID", description: "Any government-issued ID", is_optional: false, copies: 1, created_at: now, updated_at: now },
  // PhilHealth
  { id: "r6-1", service_id: "6", step_id: null, label: "PMRF Form", description: "PhilHealth Member Registration Form", is_optional: false, copies: 1, created_at: now, updated_at: now },
  { id: "r6-2", service_id: "6", step_id: null, label: "Two Valid IDs", description: "Government-issued IDs", is_optional: false, copies: 2, created_at: now, updated_at: now },
  { id: "r6-3", service_id: "6", step_id: null, label: "2x2 Photo", description: "Recent ID photo", is_optional: false, copies: 2, created_at: now, updated_at: now },
];

export const userProgress: UserProgressRow[] = [];

// ── ID generator ─────────────────────────────────────────────────────────────

let counter = 1000;
export function generateId(): string {
  return `${++counter}-${Date.now()}`;
}
