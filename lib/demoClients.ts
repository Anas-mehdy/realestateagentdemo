import { DemoClientConfig, DemoPromptGroup } from '@/types/demo';

const defaultPromptGroups: DemoPromptGroup[] = [
  {
    title: 'Buying',
    icon: 'Buy',
    prompts: [
      "I want to buy a 2-bedroom apartment in Bucharest, budget EUR 140k.",
      "I'm looking for a 2-bedroom apartment in Floreasca with a budget around EUR 140,000.",
      "Looking to purchase a family home in Pipera, 3 bedrooms, budget up to EUR 300k.",
      "I want a premium 2-bedroom apartment near Herastrau Park, budget around EUR 220k.",
      "Do you have a 2-bedroom apartment in Cluj-Napoca around EUR 150k?",
    ],
  },
  {
    title: 'Renting',
    icon: 'Rent',
    prompts: [
      "We need to rent a 3-bedroom family house in Bucharest, up to EUR 1,600/month.",
      "I'm looking to rent a studio in central Bucharest, budget around EUR 600/month.",
      "Do you have a 2-bedroom apartment for rent in Dorobanti?",
      "I need a furnished studio in Cluj near the university, budget around EUR 550/month.",
      "We are looking for a luxury villa for rent in Pipera, around EUR 2,500/month.",
    ],
  },
  {
    title: 'Investing',
    icon: 'ROI',
    prompts: [
      "I'm looking for an investment property in Bucharest around EUR 100k.",
      "Do you have a buy-to-let property in Militari with rental yield?",
      "I want a property that already has a tenant and generates rental income.",
      "Show me an Airbnb-style investment apartment in Bucharest around EUR 130k.",
      "I care mostly about ROI and rental yield. What options do you have?",
    ],
  },
  {
    title: 'Viewing & Leads',
    icon: 'Lead',
    prompts: [
      "I'd like to schedule a viewing.",
      "My name is Sam and my phone number is +40712345678.",
      "Tomorrow afternoon works for me.",
      "Can I speak with an agent about this property?",
    ],
    note: 'Use these after the assistant shows a property card.',
  },
  {
    title: 'Selling',
    icon: 'Sell',
    prompts: [
      "I want to sell my apartment in Floreasca. Can you help me get a valuation?",
      "I have a 2-bedroom apartment in Bucharest and I want to know how much it is worth.",
      "Can your team help me sell my house in Pipera?",
    ],
  },
  {
    title: 'No Match',
    icon: 'Test',
    prompts: [
      "I need a 5-bedroom house in Bucharest for EUR 80,000.",
      "I want to rent a 4-bedroom villa in Cluj for EUR 500/month.",
      "I want to buy a beachfront villa in Bucharest under EUR 100k.",
    ],
    note: 'Use these to test unavailable requests.',
  },
];

export const demoClients: Record<string, DemoClientConfig> = {
  default: {
    clientId: 'default',
    companyName: 'PropAssist Demo',
    assistantName: 'Sofia',
    websiteUrl: 'https://example.com',
    initials: 'PA',
    market: 'Romania',
    serviceAreas: ['Bucharest'],
    companyStrengths: [
      'local real estate expertise',
      'fast viewing coordination',
      'support for buyers, renters, sellers, and investors',
    ],
    propertyTypes: ['apartments', 'houses', 'investment properties'],
    welcomeMessage:
      "Hi there. I'm Sofia, the property assistant for PropAssist Demo. I can help qualify what you need, suggest the closest matching properties, and connect you with the team for viewings, valuations, or follow-up. What are you looking for today?",
    demoPromptGroups: defaultPromptGroups,
    n8nClientId: 'default',
  },
  company_a: {
    clientId: 'company_a',
    companyName: 'Company A Real Estate',
    assistantName: 'Sofia',
    websiteUrl: 'https://example.com/company-a',
    initials: 'CA',
    market: 'Romania',
    serviceAreas: ['Bucharest'],
    companyStrengths: [
      'local real estate expertise',
      'fast viewing coordination',
      'support for buyers, renters, sellers, and investors',
    ],
    propertyTypes: ['apartments', 'houses', 'investment properties'],
    welcomeMessage:
      "Welcome to Company A Real Estate. I'm Sofia, your property assistant. Tell me what you want to buy, rent, sell, or invest in, and I will qualify your needs and guide you toward the strongest next step.",
    demoPromptGroups: defaultPromptGroups,
    n8nClientId: 'company_a',
  },
  company_b: {
    clientId: 'company_b',
    companyName: 'Company B Properties',
    assistantName: 'Sofia',
    websiteUrl: 'https://example.com/company-b',
    initials: 'CB',
    market: 'Romania',
    serviceAreas: ['Bucharest'],
    companyStrengths: [
      'local real estate expertise',
      'fast viewing coordination',
      'support for buyers, renters, sellers, and investors',
    ],
    propertyTypes: ['apartments', 'houses', 'investment properties'],
    welcomeMessage:
      "Hi, I'm Sofia, the property assistant for Company B Properties. Share your budget, location, and goal, and I will help narrow the options and connect you with the team when you are ready.",
    demoPromptGroups: defaultPromptGroups,
    n8nClientId: 'company_b',
  },
  godubai: {
    clientId: 'godubai',
    companyName: 'GoDubai Portal',
    assistantName: 'Sofia',
    websiteUrl: 'https://www.godubai.estate/',
    logoUrl: 'https://www.godubai.estate/wp-content/uploads/2025/08/godubai-logo.png',
    initials: 'GD',
    market: 'Dubai & UAE',
    serviceAreas: ['Dubai', 'UAE', 'Business Bay', 'Dubai South', 'Dubai Design District (D3)'],
    companyStrengths: [
      'verified Dubai and UAE off-plan project listings',
      'personalized Dubai investment plan flow',
      'support for brokers, investors, and property buyers',
      'human-verified exclusive real estate leads for brokers',
      'fast support and sales follow-up',
    ],
    propertyTypes: ['off-plan apartments', 'villas', 'penthouses', 'townhouses', 'investment properties'],
    welcomeMessage:
      "Welcome to GoDubai Portal. I'm Sofia, your property assistant for GoDubai. I can help narrow down Dubai off-plan projects, understand your budget and investment goal, and connect you with the team for a shortlist or follow-up. What are you looking for today?",
    demoPromptGroups: [
      {
        title: 'Dubai Investment',
        icon: 'ROI',
        prompts: [
          'I want an off-plan investment property in Dubai with a budget around AED 900k.',
          'Can you help me find a Dubai project that may fit a Golden Visa plan?',
          'I am comparing Dubai South and D3 for an off-plan purchase.',
          'Show me options for international investors looking at Dubai property.',
        ],
      },
      {
        title: 'Property Search',
        icon: 'Buy',
        prompts: [
          'I am looking for a studio or 1-bedroom off-plan apartment in Dubai.',
          'Do you have apartments, villas, or penthouses in Dubai Design District?',
          'I want a Dubai South project with handover around 2028.',
          'My budget is AED 1.5M and I want a strong shortlist.',
        ],
      },
      {
        title: 'Broker Leads',
        icon: 'Lead',
        prompts: [
          'I am a Dubai broker and want verified real estate leads.',
          'How do your guaranteed real estate leads work?',
          'Can someone explain the subscription plans for brokers?',
          'I want to talk to sales about investor leads.',
        ],
      },
      {
        title: 'Follow-up',
        icon: 'Next',
        prompts: [
          'Please send me a shortlist.',
          'I would like to speak with the GoDubai team.',
          'My name is Sam and my WhatsApp number is +971501234567.',
          'Tomorrow afternoon works for a call.',
        ],
        note: 'Use these after Sofia qualifies the visitor.',
      },
      {
        title: 'No Match',
        icon: 'Test',
        prompts: [
          'I want a beachfront villa in Dubai for AED 300k.',
          'Can you guarantee my ROI?',
          'Can you confirm my Golden Visa approval?',
        ],
        note: 'Use these to test factual, compliant handling.',
      },
    ],
    n8nClientId: 'godubai',
  },
};

export function getDemoClient(clientId?: string | null): DemoClientConfig {
  if (!clientId) return demoClients.godubai;
  return demoClients[clientId] ?? demoClients.godubai;
}
