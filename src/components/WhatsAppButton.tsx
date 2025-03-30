
import React, { useEffect, useState } from 'react';
import { WhatsApp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const phoneNumber = '+919301499921';
  const message = 'Hello! I visited your website and would like to know more about your services.';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  useEffect(() => {
    // Show the WhatsApp button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation for popup entry
  useEffect(() => {
    if (isVisible) {
      // Show popover/dialog/drawer after button appears with a delay
      const timer = setTimeout(() => {
        if (isMobile) {
          setIsDrawerOpen(true);
        } else {
          setIsPopoverOpen(true);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isMobile]);

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, '_blank');
    
    if (isMobile) {
      setIsDrawerOpen(false);
    } else {
      setIsPopoverOpen(false);
      setIsDialogOpen(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isMobile ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg animate-bounce"
              onClick={() => setIsDrawerOpen(true)}
            >
              <WhatsApp className="h-7 w-7 text-white" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <WhatsApp className="h-12 w-12 text-green-500" />
              <h3 className="font-bold text-xl">Chat with us on WhatsApp</h3>
              <p className="text-gray-600">Get quick answers to your questions!</p>
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 mt-2 w-full max-w-xs"
              >
                Start Chat
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-transform shadow-lg animate-bounce"
              onClick={() => isPopoverOpen ? setIsPopoverOpen(false) : setIsPopoverOpen(true)}
            >
              <WhatsApp className="h-7 w-7 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" side="left">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-t-md border-b border-green-200">
              <div className="flex items-center space-x-2">
                <WhatsApp className="h-6 w-6 text-green-600" />
                <h3 className="font-medium text-green-800">Chat with us on WhatsApp</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-gray-700">Get quick answers to your questions about our services!</p>
              <Button 
                onClick={handleWhatsAppClick} 
                className="w-full bg-green-500 hover:bg-green-600 gap-2"
              >
                <WhatsApp className="h-5 w-5" />
                Start Chat
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default WhatsAppButton;
