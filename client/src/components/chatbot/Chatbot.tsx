import { useState, useRef, useEffect } from "react";
import { Bot, Minus, X, Send, User, Home, MapPin, Building, Banknote, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ConversationMessage } from "@shared/schema";
import axios from "axios";
import { 
  chatbotResponses,
  propertyCategories,
  propertyFilters,
  priceRangeFilters,
  financingOptions,
  visitScheduleOptions,
  endInteractionOptions,
  calculateMortgage,
  formatCurrency,
  locationOptions
} from "@/lib/data";

// Enhanced chatbot step type with all possible steps from the flow document
type ChatbotStep = 
  | 'greeting'
  | 'name' 
  | 'contact' 
  | 'options' 
  | 'propertyCategories'
  | 'propertyFilters'
  | 'filterPrice'
  | 'filterLocation'
  | 'filterSize'
  | 'displayProperties'
  | 'propertyDetails'
  | 'scheduleVisit'
  | 'financingOptions'
  | 'mortgageCalculator'
  | 'contactAgent'
  | 'agentInteraction'
  | 'endInteraction'
  | 'conversation';

// Property data interface for displaying selected properties
interface PropertyData {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  details?: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    amenities: string[];
  };
}

const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<ChatbotStep>('name');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [calculatorInputs, setCalculatorInputs] = useState({
    loanAmount: '',
    interestRate: '4.5',
    loanTerm: '30'
  });
  const [mortgageResults, setMortgageResults] = useState<{
    monthlyPayment: number;
    principalInterest: number;
    taxes: number;
    insurance: number;
  } | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Initialize conversation with welcome message that asks for name directly
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      role: 'bot',
      message: "Hello! Welcome to PrimeEstate. I'm your virtual assistant. Could you please share your name?",
      timestamp: Date.now()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const minimize = () => {
    setIsOpen(false);
  };

  const maximize = () => {
    setIsOpen(true);
  };

  // Go back to main menu
  const backToMainMenu = () => {
    addMessage('bot', `${name}, what else can I help you with today?`);
    setStep('options');
  };
  
  // Restart the chat from name input
  const restartChat = () => {
    setConversation([{
      role: 'bot',
      message: "Hello! Welcome to PrimeEstate. I'm your virtual assistant. Could you please share your name?",
      timestamp: Date.now()
    }]);
    setName('');
    setContact('');
    setUserId(null);
    setSelectedProperties([]);
    setSelectedPropertyId(null);
    setSelectedCategory('');
    setSelectedFilter('');
    setSelectedPriceRange('');
    setSelectedTimeSlot('');
    setSelectedDate('');
    setMortgageResults(null);
    setStep('name');
  };
  
  // Handle initial greeting and move to name input
  const handleGreeting = (input: string) => {
    addMessage('user', input);
    
    setTimeout(() => {
      addMessage('bot', "I'm here to help you find your perfect property. Could you please share your name?");
      setStep('name');
    }, 500);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    // Simple validation for name (at least 2 characters)
    if (name.trim().length < 2) {
      toast({
        title: "Invalid Name",
        description: "Please enter your full name (at least 2 characters)",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message to the conversation
    addMessage('user', name);
    
    // Add bot response
    setTimeout(() => {
      addMessage('bot', `Nice to meet you, ${name}! Could you please share your email or phone number so we can better assist you?`);
      setStep('contact');
    }, 500);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact.trim()) return;
    
    // Validate contact as email or phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; // Simple validation for 10-15 digit phone numbers
    
    if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
      toast({
        title: "Invalid Contact",
        description: "Please enter a valid email address or phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message to the conversation
    addMessage('user', contact);
    
    try {
      // Save user to the database
      const response = await apiRequest(
        'POST',
        '/api/chat/users',
        {
          name,
          contact,
          conversation
        }
      );
      
      const data = await response.json();
      setUserId(data.id);
      
      // Add bot response with main options
      setTimeout(() => {
        addMessage('bot', `Thank you, ${name}! How can I help you today?`);
        setStep('options');
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle main options selection
  const handleOptionClick = async (option: string) => {
    addMessage('user', option);
    
    // Add bot response based on selected option
    const botResponse = chatbotResponses[option as keyof typeof chatbotResponses] || "How can I assist you with that?";
    
    // Log this interaction to Google Sheets
    await logCustomerLead(option);
    
    setTimeout(() => {
      addMessage('bot', botResponse);
      
      // Set next step based on selected option
      switch(option) {
        case 'Browse properties':
          setStep('propertyCategories');
          break;
        case 'Search by location':
          setStep('filterLocation');
          break;
        case 'Check out ongoing projects':
          // Get projects data here - for now using mock data
          setTimeout(() => {
            addMessage('bot', "Here are our current projects: \n\n1. Sunset Villas - Luxury homes with oceanfront views\n2. Urban Heights - Modern apartments in downtown");
            setStep('conversation');
          }, 800);
          break;
        case 'Get details on a specific property':
          setStep('conversation');
          break;
        case 'Get help with financing options':
          setStep('financingOptions');
          break;
        default:
          setStep('conversation');
      }
    }, 500);
  };

  // Handle property category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    addMessage('user', category);
    
    setTimeout(() => {
      addMessage('bot', `Great choice! We have several ${category.toLowerCase()} available. How would you like to filter them?`);
      setStep('propertyFilters');
    }, 500);
  };

  // Handle property filter selection
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    addMessage('user', filter);
    
    setTimeout(() => {
      switch(filter) {
        case 'Filter by price range':
          addMessage('bot', "Please select your preferred price range.");
          setStep('filterPrice');
          break;
        case 'Filter by location':
          addMessage('bot', "Which area are you interested in?");
          setStep('filterLocation');
          break;
        case 'Filter by size':
          addMessage('bot', "What size are you looking for?");
          setStep('filterSize');
          break;
        case 'Show all options':
          // Simulate loading properties
          setTimeout(() => {
            const mockProperties = [
              {
                id: 1,
                title: "Modern Family Home",
                description: "Beautiful 4-bedroom house with modern finishes",
                price: 750000,
                location: "Downtown",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
                details: {
                  bedrooms: 4,
                  bathrooms: 3,
                  squareFeet: 2500,
                  amenities: ["Swimming Pool", "Garden", "Garage"]
                }
              },
              {
                id: 2,
                title: "Luxury Apartment",
                description: "High-end apartment with city views",
                price: 450000,
                location: "Urban Center",
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
                details: {
                  bedrooms: 2,
                  bathrooms: 2,
                  squareFeet: 1200,
                  amenities: ["Gym", "Concierge", "Rooftop Terrace"]
                }
              }
            ];
            
            setSelectedProperties(mockProperties);
            addMessage('bot', "Here are the properties that match your criteria:");
            setStep('displayProperties');
          }, 800);
          break;
      }
    }, 500);
  };

  // Handle price range selection
  const handlePriceRangeSelect = (range: string) => {
    setSelectedPriceRange(range);
    addMessage('user', range);
    
    // Simulate property loading based on price range
    setTimeout(() => {
      // In a real app, you would filter properties by the selected price range
      const mockProperties = [
        {
          id: 1,
          title: "Modern Family Home",
          description: "Beautiful 4-bedroom house with modern finishes",
          price: 750000,
          location: "Downtown",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
          details: {
            bedrooms: 4,
            bathrooms: 3,
            squareFeet: 2500,
            amenities: ["Swimming Pool", "Garden", "Garage"]
          }
        }
      ];
      
      setSelectedProperties(mockProperties);
      addMessage('bot', "Here are the properties that match your price range:");
      setStep('displayProperties');
    }, 800);
  };

  // Handle property selection for detailed view
  const handlePropertySelect = async (id: number) => {
    setSelectedPropertyId(id);
    const property = selectedProperties.find(p => p.id === id);
    addMessage('user', `I'd like to know more about ${property?.title}`);
    
    // Log this property interest to Google Sheets
    if (property) {
      await logCustomerLead(`Interested in property: ${property.title}`, property);
    }
    
    setTimeout(() => {
      if (property) {
        const details = `Here are the detailed specifications for ${property.title}:
        
Location: ${property.location}
Price: ${formatCurrency(property.price)}
Size: ${property.details?.squareFeet} sq ft
Bedrooms: ${property.details?.bedrooms}
Bathrooms: ${property.details?.bathrooms}
Amenities: ${property.details?.amenities.join(', ')}

${property.description}`;

        addMessage('bot', details);
        setTimeout(() => {
          addMessage('bot', 'Would you like to schedule a visit, request a brochure, or contact an agent?');
          setStep('propertyDetails');
        }, 500);
      } else {
        addMessage('bot', "I'm sorry, I couldn't find details for that property.");
        setStep('conversation');
      }
    }, 500);
  };

  // Handle visit scheduling
  const handleScheduleVisit = () => {
    addMessage('user', "I'd like to schedule a visit");
    
    setTimeout(() => {
      addMessage('bot', "Please select a time slot for your visit.");
      setStep('scheduleVisit');
    }, 500);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (option: string) => {
    addMessage('user', option);
    
    if (option === "Choose a specific date") {
      setTimeout(() => {
        addMessage('bot', "Please enter your preferred date (MM/DD/YYYY):");
        setStep('conversation');
      }, 500);
    } else {
      // Extract available slots
      const selectedOption = visitScheduleOptions.find(o => o.value === option);
      if (selectedOption && selectedOption.slots) {
        setSelectedTimeSlot(option);
        
        setTimeout(() => {
          const slots = selectedOption.slots || [];
          const slotsMessage = `Available times for ${option.split(' - ')[0]}:\n\n${slots.join('\n')}`;
          addMessage('bot', slotsMessage);
          
          setTimeout(() => {
            addMessage('bot', "Please type the time you prefer.");
            setStep('conversation');
          }, 800);
        }, 500);
      }
    }
  };

  // Handle financing options
  const handleFinancingOptionSelect = async (option: string) => {
    addMessage('user', option);
    
    // Log the financing option selection to Google Sheets
    await logCustomerLead(`Selected financing option: ${option}`);
    
    setTimeout(() => {
      if (option === "Mortgage calculator") {
        addMessage('bot', "Please enter your loan amount and other details to calculate your EMI.");
        setStep('mortgageCalculator');
      } else if (option === "Connect with financial advisor") {
        addMessage('bot', "I can connect you with one of our expert financial advisors. Please confirm if you'd like to be contacted by a financial advisor.");
        setStep('contactAgent');
      }
    }, 500);
  };

  // Handle mortgage calculator submission
  const handleMortgageCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loanAmount = parseFloat(calculatorInputs.loanAmount);
    const interestRate = parseFloat(calculatorInputs.interestRate);
    const loanTerm = parseInt(calculatorInputs.loanTerm);
    
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
      addMessage('bot', "Please ensure all values are valid numbers.");
      return;
    }
    
    // Calculate mortgage
    const results = calculateMortgage(loanAmount, 0, loanTerm, interestRate);
    setMortgageResults(results);
    
    // Log mortgage calculator usage to Google Sheets
    await logCustomerLead(`Used mortgage calculator - Loan Amount: ${formatCurrency(loanAmount)}, Monthly Payment: ${formatCurrency(results.monthlyPayment)}`);
    
    setTimeout(() => {
      const resultMessage = `Based on your inputs:
      
Loan Amount: ${formatCurrency(loanAmount)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years

Monthly Payment: ${formatCurrency(results.monthlyPayment)}
  - Principal & Interest: ${formatCurrency(results.principalInterest)}
  - Estimated Taxes: ${formatCurrency(results.taxes)}
  - Estimated Insurance: ${formatCurrency(results.insurance)}`;

      addMessage('bot', resultMessage);
      
      setTimeout(() => {
        addMessage('bot', "Would you like to explore properties within this budget or connect with a financial advisor?");
        setStep('endInteraction');
      }, 800);
    }, 500);
  };

  // Handle contact agent form submission
  const handleContactAgentSubmit = async () => {
    addMessage('user', "I'd like to contact an agent");
    
    // Log this agent contact request to Google Sheets
    const currentProperty = selectedProperties.find(p => p.id === selectedPropertyId);
    await logCustomerLead("Requested agent contact", currentProperty);
    
    setTimeout(() => {
      addMessage('bot', "I can connect you with one of our expert agents. Please share your contact details, and one of our agents will reach out to you shortly.");
      
      if (userId) {
        setTimeout(() => {
          addMessage('bot', `We already have your contact information (${contact}). An agent will be in touch with you soon.`);
          
          setTimeout(() => {
            addMessage('bot', "Would you like to explore more properties or get assistance with something else?");
            setStep('endInteraction');
          }, 800);
        }, 500);
      } else {
        setStep('contactAgent');
      }
    }, 500);
  };

  // Handle end interaction options
  const handleEndInteractionSelect = (option: string) => {
    addMessage('user', option);
    
    const selected = endInteractionOptions.find(o => o.value === option);
    
    setTimeout(() => {
      if (selected && selected.nextStep === 'endSession') {
        addMessage('bot', "Thank you for visiting PrimeEstate. Have a great day!");
        setStep('conversation');
      } else {
        addMessage('bot', "What kind of properties would you like to explore?");
        setStep('propertyCategories');
      }
    }, 500);
  };

  // Handle regular message submission
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to the conversation
    addMessage('user', message);
    
    // Clear the input field
    setMessage('');
    
    // Process the message based on context
    if (step === 'greeting') {
      handleGreeting(message);
    } else if (step === 'conversation') {
      // Default conversation flow
      setTimeout(() => {
        addMessage('bot', "Thank you for the information. One of our real estate experts will follow up with more details soon. Is there anything else you'd like to know?");
        setStep('endInteraction');
      }, 1000);
    }
    
    // Update the conversation in the database
    if (userId) {
      try {
        await apiRequest(
          'PATCH',
          `/api/chat/users/${userId}`,
          { conversation }
        );
      } catch (error) {
        console.error('Failed to update conversation:', error);
      }
    }
  };

  // Add a message to the conversation
  const addMessage = (role: 'user' | 'bot', message: string) => {
    const newMessage: ConversationMessage = {
      role,
      message,
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev, newMessage]);
  };
  
  // Store interaction history for the current session
  const [interactionHistory, setInteractionHistory] = useState<string[]>([]);
  const [leadLogged, setLeadLogged] = useState(false);
  
  // Log customer lead to Google Sheets
  const logCustomerLead = async (interest: string, propertyDetails?: any) => {
    try {
      if (!name || !contact) return false;
      
      // Add this interaction to history
      const newInteraction = `${interest}${propertyDetails ? ` - ${propertyDetails.title || ''}` : ''}`;
      setInteractionHistory(prev => [...prev, newInteraction]);
      
      // Create a consolidated notes field with all interactions
      const allInteractions = [...interactionHistory, newInteraction];
      const notes = allInteractions.map((item, i) => `${i+1}. ${item}`).join('\n');
      
      const leadData = {
        name,
        contact,
        interest,
        propertyInterest: propertyDetails?.title || selectedCategory || '',
        locationInterest: propertyDetails?.location || '',
        budgetRange: selectedPriceRange || '',
        notes: notes
      };
      
      // Only send to Google Sheets if this is the first interaction or if it's a significant action
      const isSignificantAction = interest.includes("Mortgage calculator") || 
                                 interest.includes("Requested agent") ||
                                 interest.includes("Used mortgage calculator");
      
      if (!leadLogged || isSignificantAction) {
        const response = await axios.post('/api/sheets/log-lead', leadData);
        if (response.status === 201) {
          setLeadLogged(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error logging lead to Google Sheets:', error);
      return false;
    }
  };

  // Render messages in the chatbot
  const renderChatbotMessages = () => {
    return conversation.map((msg, index) => (
      <div 
        key={index} 
        className={`flex items-start mb-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
      >
        {msg.role === 'bot' && (
          <div className="flex-shrink-0 mr-2">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <div className={`rounded-lg py-2 px-4 max-w-[85%] ${
          msg.role === 'user' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="whitespace-pre-line">{msg.message}</p>
        </div>
        
        {msg.role === 'user' && (
          <div className="flex-shrink-0 ml-2">
            <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        )}
      </div>
    ));
  };

  // Render property cards when displaying property results
  const renderPropertyCards = () => {
    return selectedProperties.map(property => (
      <div key={property.id} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-36 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <p className="text-primary font-bold">{formatCurrency(property.price)}</p>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> {property.location}
          </p>
          <p className="text-sm mt-1 text-gray-700 line-clamp-2">{property.description}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full"
            onClick={() => handlePropertySelect(property.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div id="chatbot" className="fixed bottom-6 right-6 z-50 flex justify-end">
      {isOpen ? (
        <div className="chatbot-container bg-white rounded-lg shadow-lg w-80 md:w-96 overflow-hidden">
          {/* Chatbot Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              <h3 className="font-semibold">PrimeEstate Assistant</h3>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-primary/90" 
                onClick={restartChat}
                title="Restart chat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-primary/90" 
                onClick={minimize}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-primary/90" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chatbot Messages */}
          <div className="p-4 h-80 overflow-y-auto">
            {renderChatbotMessages()}
            
            {/* Display property cards in message area when in displayProperties step */}
            {step === 'displayProperties' && (
              <div className="mt-2">
                {renderPropertyCards()}
                <div className="mt-4 p-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-1/2"
                        onClick={backToMainMenu}
                      >
                        Back to Main Menu
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-1/2"
                        onClick={() => {
                          const prevStep = selectedFilter === 'Filter by price range' ? 'filterPrice' :
                                          selectedFilter === 'Filter by location' ? 'filterLocation' :
                                          selectedFilter === 'Filter by size' ? 'filterSize' : 'propertyFilters';
                          setStep(prevStep);
                        }}
                      >
                        Back to Filters
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        addMessage('user', 'Continue browsing');
                        addMessage('bot', 'What else would you like to explore?');
                        setStep('options');
                      }}
                    >
                      Continue Browsing
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chatbot Forms and Interaction Elements */}
          {step === 'greeting' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleMessageSubmit} className="flex">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border border-gray-300 rounded-l-md w-full focus:ring-primary"
                  placeholder="Type 'hi' to start..."
                />
                <Button type="submit" className="rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
          
          {step === 'name' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleNameSubmit}>
                <Label htmlFor="chatbot-name" className="block text-gray-700 text-sm font-medium mb-2">
                  Your Name
                </Label>
                <p className="text-gray-500 text-xs mb-2">Please enter your full name (at least 2 characters)</p>
                <Input
                  id="chatbot-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-md w-full p-2.5 mb-3 focus:ring-primary"
                  placeholder="Full name (e.g., John Smith)"
                  required
                />
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          )}
          
          {step === 'contact' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleContactSubmit}>
                <Label htmlFor="chatbot-contact" className="block text-gray-700 text-sm font-medium mb-2">
                  Contact Information
                </Label>
                <p className="text-gray-500 text-xs mb-2">Please enter a valid email address or phone number (10-15 digits)</p>
                <Input
                  id="chatbot-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="border border-gray-300 rounded-md w-full p-2.5 mb-3 focus:ring-primary"
                  placeholder="Email (user@example.com) or phone (10-15 digits)"
                  required
                />
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </div>
          )}
          
          {step === 'options' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                How can I help you today?
              </div>
              <div className="space-y-2">
                {[
                  { option: 'Browse properties', icon: Home },
                  { option: 'Search by location', icon: MapPin },
                  { option: 'Check out ongoing projects', icon: Building },
                  { option: 'Get details on a specific property', icon: Home },
                  { option: 'Get help with financing options', icon: Banknote }
                ].map(({ option, icon: Icon }, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleOptionClick(option)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {step === 'propertyCategories' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Please choose a property type:
              </div>
              <div className="space-y-2">
                {propertyCategories.map((category, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleCategorySelect(category.value)}
                  >
                    {category.value}
                    <span className="text-[10px] text-gray-500 block">{category.description}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={backToMainMenu}
                >
                  Back to Main Menu
                </Button>
              </div>
            </div>
          )}
          
          {step === 'propertyFilters' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                How would you like to filter properties?
              </div>
              <div className="space-y-2">
                {propertyFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleFilterSelect(filter.value)}
                  >
                    {filter.value}
                    <span className="text-[10px] text-gray-500 block">{filter.description}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={backToMainMenu}
                >
                  Back to Main Menu
                </Button>
              </div>
            </div>
          )}
          
          {step === 'filterPrice' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Select your preferred price range:
              </div>
              <div className="space-y-2">
                {priceRangeFilters.map((price, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 text-sm"
                    onClick={() => handlePriceRangeSelect(price.value)}
                  >
                    {price.value}
                  </Button>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={backToMainMenu}
                  >
                    Back to Main Menu
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={() => {
                      setStep('propertyFilters');
                    }}
                  >
                    Back to Previous
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 'filterLocation' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Select an area you're interested in:
              </div>
              <div className="space-y-2">
                {locationOptions.map((location: {value: string, label: string}, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 text-sm"
                    onClick={() => {
                      addMessage('user', location.label);
                      // Load properties for the selected location
                      setTimeout(() => {
                        // In a real app, you would fetch properties by location from API
                        const mockProperties = [
                          {
                            id: 1,
                            title: "Modern Family Home",
                            description: "Beautiful 4-bedroom house with modern finishes",
                            price: 750000,
                            location: location.label,
                            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
                            details: {
                              bedrooms: 4,
                              bathrooms: 3,
                              squareFeet: 2500,
                              amenities: ["Swimming Pool", "Garden", "Garage"]
                            }
                          }
                        ];
                        
                        setSelectedProperties(mockProperties);
                        addMessage('bot', `Here are properties in ${location.label}:`);
                        setTimeout(() => {
                          addMessage('bot', "Would you like to continue browsing or go back to the main menu?");
                          setStep('displayProperties');
                        }, 500);
                      }, 800);
                    }}
                  >
                    {location.label}
                  </Button>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={backToMainMenu}
                  >
                    Back to Main Menu
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={() => {
                      setStep('propertyFilters');
                    }}
                  >
                    Back to Previous
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 'filterSize' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                What size are you looking for?
              </div>
              <div className="space-y-2">
                {[
                  "Less than 1000 sq ft",
                  "1000-2000 sq ft",
                  "2000-3000 sq ft",
                  "More than 3000 sq ft"
                ].map((size, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 text-sm"
                    onClick={() => {
                      addMessage('user', size);
                      // Load properties for the selected size
                      setTimeout(() => {
                        // In a real app, you would fetch properties by size from API
                        const mockProperties = [
                          {
                            id: 1,
                            title: "Modern Family Home",
                            description: "Beautiful 4-bedroom house with modern finishes",
                            price: 750000,
                            location: "Downtown",
                            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
                            details: {
                              bedrooms: 4,
                              bathrooms: 3,
                              squareFeet: 2500,
                              amenities: ["Swimming Pool", "Garden", "Garage"]
                            }
                          }
                        ];
                        
                        setSelectedProperties(mockProperties);
                        addMessage('bot', `Here are properties with size ${size}:`);
                        setTimeout(() => {
                          addMessage('bot', "Would you like to continue browsing or go back to the main menu?");
                          setStep('displayProperties');
                        }, 500);
                      }, 800);
                    }}
                  >
                    {size}
                  </Button>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={backToMainMenu}
                  >
                    Back to Main Menu
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-1/2"
                    onClick={() => {
                      setStep('propertyFilters');
                    }}
                  >
                    Back to Previous
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 'propertyDetails' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                What would you like to do next?
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                  onClick={handleScheduleVisit}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a visit
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                  onClick={() => {
                    addMessage('user', "Request a brochure");
                    setTimeout(() => {
                      addMessage('bot', `We've sent a brochure to your email (${contact}). Would you like to schedule a visit or talk to an agent?`);
                      setStep('agentInteraction');
                    }, 500);
                  }}
                >
                  Request a brochure
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                  onClick={handleContactAgentSubmit}
                >
                  Contact an agent
                </Button>
              </div>
            </div>
          )}
          
          {step === 'scheduleVisit' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                When would you like to visit?
              </div>
              <div className="space-y-2">
                {visitScheduleOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleTimeSlotSelect(option.value)}
                  >
                    {option.value}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {step === 'financingOptions' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Financing options:
              </div>
              <div className="space-y-2">
                {financingOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleFinancingOptionSelect(option.value)}
                  >
                    {option.value}
                    <span className="text-[10px] text-gray-500 block">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {step === 'mortgageCalculator' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleMortgageCalculate}>
                <div className="mb-3">
                  <Label htmlFor="loan-amount" className="block text-gray-700 text-sm font-medium mb-1">
                    Loan Amount ($)
                  </Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={calculatorInputs.loanAmount}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, loanAmount: e.target.value})}
                    className="border border-gray-300 rounded-md w-full p-2.5 mb-2 focus:ring-primary"
                    placeholder="e.g., 300000"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor="interest-rate" className="block text-gray-700 text-sm font-medium mb-1">
                      Interest Rate (%)
                    </Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={calculatorInputs.interestRate}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, interestRate: e.target.value})}
                      className="border border-gray-300 rounded-md w-full p-2.5 focus:ring-primary"
                      placeholder="e.g., 4.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="loan-term" className="block text-gray-700 text-sm font-medium mb-1">
                      Loan Term (years)
                    </Label>
                    <Input
                      id="loan-term"
                      type="number"
                      value={calculatorInputs.loanTerm}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, loanTerm: e.target.value})}
                      className="border border-gray-300 rounded-md w-full p-2.5 focus:ring-primary"
                      placeholder="e.g., 30"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Calculate
                </Button>
              </form>
            </div>
          )}
          
          {step === 'agentInteraction' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Would you like to schedule a visit or talk to an agent?
              </div>
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full justify-center text-center"
                  onClick={() => {
                    addMessage('user', "Yes, I'd like to schedule a visit");
                    handleScheduleVisit();
                  }}
                >
                  Yes, schedule a visit
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center text-center"
                  onClick={() => {
                    addMessage('user', "Yes, I'd like to talk to an agent");
                    handleContactAgentSubmit();
                  }}
                >
                  Yes, talk to an agent
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-center"
                  onClick={() => {
                    addMessage('user', "No, I'd like to continue browsing");
                    addMessage('bot', "Sure! Let's continue browsing. What would you like to explore next?");
                    backToMainMenu();
                  }}
                >
                  No, continue browsing
                </Button>
              </div>
            </div>
          )}
          
          {step === 'contactAgent' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-3">
                An agent will contact you soon at {contact || 'your provided contact details'}.
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  addMessage('bot', "Thank you! An agent will be in touch with you soon. Would you like to explore more properties?");
                  setStep('endInteraction');
                }}
              >
                Confirm
              </Button>
            </div>
          )}
          
          {step === 'endInteraction' && (
            <div className="border-t border-gray-200 p-4">
              <div className="text-gray-700 text-sm font-medium mb-3">
                Would you like to continue?
              </div>
              <div className="space-y-2">
                {endInteractionOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3 chatbot-text-wrap"
                    onClick={() => handleEndInteractionSelect(option.value)}
                  >
                    {option.value}
                    {index === 0 && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {step === 'conversation' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleMessageSubmit} className="flex mb-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border border-gray-300 rounded-l-md w-full focus:ring-primary"
                  placeholder="Type your message..."
                />
                <Button type="submit" className="rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {/* Navigation buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1" 
                  onClick={backToMainMenu}
                >
                  Back to Main Menu
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button 
          onClick={maximize}
          className="rounded-full p-4 h-14 w-14 flex items-center justify-center shadow-lg"
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Chat with us</span>
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
