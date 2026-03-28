import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CreditCard, Lock, X } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Auto-format card number
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    // Auto-format expiry date
    if (name === "expiryDate") {
      value = value.replace(/\D/g, "").substring(0, 4);
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2);
      }
    }
    // Limit CVV
    if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 3);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      onPaymentSuccess({
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardHolder: formData.cardHolder
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
        <Card className="overflow-hidden border-none bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
                <p className="text-sm text-gray-500">Fast & Encrypted Transaction</p>
              </div>
            </div>

            {/* Visual Card Display */}
            <div className="relative h-48 w-full mb-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-lg font-medium tracking-widest uppercase italic">CareNexa Pay</span>
                  <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm"></div>
                </div>
                
                <div className="text-2xl font-mono tracking-[0.2em] my-4">
                  {formData.cardNumber || "•••• •••• •••• ••••"}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase opacity-60 mb-0.5">Card Holder</p>
                    <p className="text-sm font-medium tracking-wide truncate w-40">
                      {formData.cardHolder || "YOUR NAME"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase opacity-60 mb-0.5">Expires</p>
                    <p className="text-sm font-medium">{formData.expiryDate || "MM/YY"}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="h-12 border-gray-200 focus:ring-blue-500 placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Card Holder Name
                </Label>
                <Input
                  id="cardHolder"
                  name="cardHolder"
                  placeholder="ADITI SHARMA"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  required
                  className="h-12 border-gray-200 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="h-12 border-gray-200 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    placeholder="•••"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="h-12 border-gray-200 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${amount}`
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                <Lock className="w-3 h-3" />
                256-bit SSL encrypted
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentModal;
