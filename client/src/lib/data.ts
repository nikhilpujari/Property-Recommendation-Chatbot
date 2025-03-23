import { ChatUser, ConversationMessage, Property, Project } from "@shared/schema";

// Chatbot option types
export type ChatbotOption = 
  | "Browse properties"
  | "Search by location" 
  | "Check out ongoing projects" 
  | "Get details on a specific property" 
  | "Get help with financing options";

// Property category options
export type PropertyCategory = 
  | "Apartments"
  | "Villas"
  | "Commercial Spaces"
  | "Plots/Lands";

// Price range filter options
export type PriceRangeFilter = 
  | "Below $500k"
  | "$500k - $1M"
  | "Above $1M";

// Property filter options
export type PropertyFilter = 
  | "Filter by price range"
  | "Filter by location"
  | "Filter by size"
  | "Show all options";

// Financing option types
export type FinancingOption = 
  | "Mortgage calculator"
  | "Connect with financial advisor";

// Visit scheduling options
export type VisitScheduleOption = 
  | "Today - Available time slots"
  | "Tomorrow - Available time slots"
  | "Choose a specific date";

// End interaction options
export type EndInteractionOption = 
  | "Yes, show me more properties."
  | "No, I'm done for now.";

// Chatbot responses based on selected option
export const chatbotResponses: Record<ChatbotOption, string> = {
  "Browse properties": "Great choice! We have properties in multiple categories. Let me show you what we offer. Please choose from the following:",
  "Search by location": "Perfect! Which area or neighborhood are you interested in?",
  "Check out ongoing projects": "We have several exciting projects in development! Are you interested in Sunset Villas or Urban Heights?",
  "Get details on a specific property": "I'd be happy to provide details on a specific property. Do you have a property ID or address in mind?",
  "Get help with financing options": "We can help you find financing solutions for your new home! Do you need help with mortgage calculations or connecting with a financial advisor?"
};

// Property categories with descriptions
export const propertyCategories: Array<{value: PropertyCategory, description: string}> = [
  { value: "Apartments", description: "Modern living spaces in prime locations" },
  { value: "Villas", description: "Luxurious standalone homes with premium amenities" },
  { value: "Commercial Spaces", description: "Office and retail spaces for your business" },
  { value: "Plots/Lands", description: "Vacant lots ready for your dream construction" }
];

// Property filter options with descriptions
export const propertyFilters: Array<{value: PropertyFilter, description: string}> = [
  { value: "Filter by price range", description: "Find properties that match your budget" },
  { value: "Filter by location", description: "Search in your preferred neighborhoods" },
  { value: "Filter by size", description: "Filter by square footage or number of rooms" },
  { value: "Show all options", description: "View all available properties" }
];

// Price range filters with value ranges
export const priceRangeFilters: Array<{value: PriceRangeFilter, min: number, max: number | null}> = [
  { value: "Below $500k", min: 0, max: 500000 },
  { value: "$500k - $1M", min: 500000, max: 1000000 },
  { value: "Above $1M", min: 1000000, max: null }
];

// Financing options with descriptions
export const financingOptions: Array<{value: FinancingOption, description: string}> = [
  { value: "Mortgage calculator", description: "Calculate your monthly payments" },
  { value: "Connect with financial advisor", description: "Get personalized financing advice" }
];

// Visit scheduling options with availability
export const visitScheduleOptions: Array<{value: VisitScheduleOption, slots?: string[]}> = [
  { 
    value: "Today - Available time slots", 
    slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] 
  },
  { 
    value: "Tomorrow - Available time slots", 
    slots: ["9:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "5:00 PM"] 
  },
  { value: "Choose a specific date" }
];

// End interaction options with next steps
export const endInteractionOptions: Array<{value: EndInteractionOption, nextStep: string}> = [
  { value: "Yes, show me more properties.", nextStep: "browseProperties" },
  { value: "No, I'm done for now.", nextStep: "endSession" }
];

// Property types for filtering
export const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" }
];

// Location options for filtering
export const locationOptions = [
  { value: "downtown", label: "Downtown" },
  { value: "suburb", label: "Suburban Area" },
  { value: "beachfront", label: "Beachfront" },
  { value: "countryside", label: "Countryside" }
];

// Price range options for filtering
export const priceRangeOptions = [
  { value: "0-200000", label: "$0 - $200,000" },
  { value: "200000-500000", label: "$200,000 - $500,000" },
  { value: "500000-1000000", label: "$500,000 - $1,000,000" },
  { value: "1000000+", label: "$1,000,000+" }
];

// Bedroom and bathroom options for filtering
export const bedroomOptions = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" }
];

export const bathroomOptions = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" }
];

// Mortgage calculator helper
export const calculateMortgage = (
  homePrice: number, 
  downPayment: number, 
  loanTerm: number, 
  interestRate: number
): { 
  monthlyPayment: number;
  principalInterest: number;
  taxes: number;
  insurance: number;
} => {
  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Monthly payment = principal * monthlyRate * (1 + monthlyRate)^numberOfPayments / ((1 + monthlyRate)^numberOfPayments - 1)
  const x = Math.pow(1 + monthlyRate, numberOfPayments);
  const monthlyPrincipalInterest = principal * (monthlyRate * x) / (x - 1);
  
  // Estimate taxes (0.5% of home value annually) and insurance (0.2% of home value annually)
  const monthlyTaxes = (homePrice * 0.005) / 12;
  const monthlyInsurance = (homePrice * 0.002) / 12;
  
  return {
    monthlyPayment: Math.round(monthlyPrincipalInterest + monthlyTaxes + monthlyInsurance),
    principalInterest: Math.round(monthlyPrincipalInterest),
    taxes: Math.round(monthlyTaxes),
    insurance: Math.round(monthlyInsurance)
  };
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format a property query string
export const formatPropertyQueryString = (params: Record<string, string>): string => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      urlParams.append(key, value);
    }
  });
  
  return urlParams.toString() ? `?${urlParams.toString()}` : '';
};
