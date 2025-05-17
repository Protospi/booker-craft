import React, { useState } from 'react';
import { Language, useLanguage } from '@/context/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  onClose: () => void;
}

export function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const { language, t, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleSave = () => {
    changeLanguage(selectedLanguage);
    onClose();
  };

  return (
    <div className="py-4 px-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t.languageSelection.title}</h3>
        <p className="text-sm text-gray-500">{t.languageSelection.description}</p>
      </div>

      <RadioGroup 
        value={selectedLanguage} 
        onValueChange={handleLanguageChange}
        className="space-y-4"
      >
        <div className={cn(
          "flex items-center space-x-3 rounded-md border p-4",
          selectedLanguage === 'en' ? 'border-primary bg-primary/5' : 'border-gray-200'
        )}>
          <RadioGroupItem value="en" id="en" className="sr-only" />
          <Label htmlFor="en" className="flex flex-1 cursor-pointer items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="font-medium">English</div>
            </div>
            {selectedLanguage === 'en' && <Check className="h-5 w-5 text-primary" />}
          </Label>
        </div>

        <div className={cn(
          "flex items-center space-x-3 rounded-md border p-4",
          selectedLanguage === 'pt' ? 'border-primary bg-primary/5' : 'border-gray-200'
        )}>
          <RadioGroupItem value="pt" id="pt" className="sr-only" />
          <Label htmlFor="pt" className="flex flex-1 cursor-pointer items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="font-medium">Português</div>
            </div>
            {selectedLanguage === 'pt' && <Check className="h-5 w-5 text-primary" />}
          </Label>
        </div>

        <div className={cn(
          "flex items-center space-x-3 rounded-md border p-4",
          selectedLanguage === 'es' ? 'border-primary bg-primary/5' : 'border-gray-200'
        )}>
          <RadioGroupItem value="es" id="es" className="sr-only" />
          <Label htmlFor="es" className="flex flex-1 cursor-pointer items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="font-medium">Español</div>
            </div>
            {selectedLanguage === 'es' && <Check className="h-5 w-5 text-primary" />}
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-6 flex space-x-4 justify-end">
        <Button variant="outline" onClick={onClose}>
          {t.languageSelection.cancel}
        </Button>
        <Button onClick={handleSave}>
          {t.languageSelection.save}
        </Button>
      </div>
    </div>
  );
}