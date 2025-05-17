import React, { useState, useEffect } from 'react';
import { Language, useLanguage } from '@/context/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Check, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LanguageSelectorProps {
  onClose: () => void;
}

export function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const { language, t, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState('api-key');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSave = () => {
    // Save language selection
    changeLanguage(selectedLanguage);
    
    // Save API key to localStorage
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey);
    }
    
    onClose();
  };

  return (
    <div className="py-4 px-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Application Settings</h3>
        <p className="text-sm text-gray-500">Configure your application preferences</p>
      </div>

      <Tabs 
        defaultValue="api-key" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-key">API Key</TabsTrigger>
          <TabsTrigger value="language">{t.languageSelection.title}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-key" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Key className="h-4 w-4 mr-2" /> 
                OpenAI API Key
              </CardTitle>
              <CardDescription>
                Enter your OpenAI API key to use the application's AI features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="sk-..." 
                  value={apiKey} 
                  onChange={handleApiKeyChange}
                />
                <p className="text-xs text-gray-500">
                  Your API key is stored securely in your browser and is only used for requests to OpenAI.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language" className="space-y-4 pt-4">
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
        </TabsContent>
      </Tabs>

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