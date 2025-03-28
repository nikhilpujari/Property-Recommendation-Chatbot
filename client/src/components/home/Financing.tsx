import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Financing = () => {
  const [homePrice, setHomePrice] = useState('400000');
  const [downPayment, setDownPayment] = useState('80000');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('4.5');
  const [monthlyPayment, setMonthlyPayment] = useState({
    total: 1520,
    principal: 1267,
    taxes: 180,
    insurance: 73
  });

  const handleCalculate = () => {
    // Simple mortgage calculation
    const principal = parseFloat(homePrice) - parseFloat(downPayment);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;
    
    // Monthly payment = principal * monthlyRate * (1 + monthlyRate)^numberOfPayments / ((1 + monthlyRate)^numberOfPayments - 1)
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPrincipalInterest = principal * (monthlyRate * x) / (x - 1);
    
    // Estimate taxes (0.5% of home value annually) and insurance (0.2% of home value annually)
    const monthlyTaxes = (parseFloat(homePrice) * 0.005) / 12;
    const monthlyInsurance = (parseFloat(homePrice) * 0.002) / 12;
    
    setMonthlyPayment({
      total: Math.round(monthlyPrincipalInterest + monthlyTaxes + monthlyInsurance),
      principal: Math.round(monthlyPrincipalInterest),
      taxes: Math.round(monthlyTaxes),
      insurance: Math.round(monthlyInsurance)
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2">Financing Options</h2>
            <p className="text-gray-600">
              We partner with trusted financial institutions to provide you with the best mortgage options
            </p>
          </div>
          
          <Card className="bg-white rounded-lg shadow-md p-8">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Mortgage Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Price
                      </Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          $
                        </span>
                        <Input
                          type="text"
                          className="pl-8 bg-gray-50"
                          value={homePrice}
                          onChange={(e) => setHomePrice(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Down Payment
                      </Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          $
                        </span>
                        <Input
                          type="text"
                          className="pl-8 bg-gray-50"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Term
                      </Label>
                      <Select value={loanTerm} onValueChange={setLoanTerm}>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 years</SelectItem>
                          <SelectItem value="20">20 years</SelectItem>
                          <SelectItem value="15">15 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Interest Rate
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          className="bg-gray-50"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    
                    <Button type="button" className="w-full" onClick={handleCalculate}>
                      Calculate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Estimated Payment</h3>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-primary">
                        ${monthlyPayment.total}
                      </span>
                      <p className="text-gray-600">per month</p>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Principal & Interest</span>
                        <span className="font-medium">${monthlyPayment.principal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Taxes</span>
                        <span className="font-medium">${monthlyPayment.taxes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Home Insurance</span>
                        <span className="font-medium">${monthlyPayment.insurance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Button
                      variant="outline"
                      className="block w-full text-center border border-primary text-primary hover:bg-gray-50 mb-3"
                    >
                      Pre-qualify Now
                    </Button>
                    <a href="#" className="block text-center text-gray-600 hover:text-primary">
                      Learn more about financing options
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Financing;
