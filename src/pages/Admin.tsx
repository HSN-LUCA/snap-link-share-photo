
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Settings, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AdminSettings {
  buttonColor: string;
  buttonText: string;
  pageTitle: string;
}

const Admin = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    buttonColor: "#92722A",
    buttonText: "Upload Photo",
    pageTitle: "CloudShare"
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Save settings to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved!",
        description: "Your changes have been applied successfully",
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof AdminSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-600 text-lg">
            Control your application's appearance and content
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Customize Settings</CardTitle>
              <CardDescription className="text-base">
                Modify the appearance and content of your main page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pageTitle" className="text-sm font-medium">
                  Page Title
                </Label>
                <Input
                  id="pageTitle"
                  value={settings.pageTitle}
                  onChange={(e) => handleInputChange('pageTitle', e.target.value)}
                  placeholder="Enter page title"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText" className="text-sm font-medium">
                  Button Text
                </Label>
                <Input
                  id="buttonText"
                  value={settings.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="Enter button text"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonColor" className="text-sm font-medium">
                  Button Color
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={settings.buttonColor}
                    onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                    className="h-12 w-20"
                  />
                  <Input
                    value={settings.buttonColor}
                    onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                    placeholder="#92722A"
                    className="h-12 flex-1"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full h-12 text-white font-medium"
                style={{ backgroundColor: settings.buttonColor }}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>

              <Button 
                asChild
                variant="outline"
                className="w-full h-12"
              >
                <Link to="/">
                  <Eye className="w-4 h-4 mr-2" />
                  View Main Page
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Live Preview</CardTitle>
              <CardDescription className="text-base">
                See how your changes will look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {settings.pageTitle}
                </h2>
                <p className="text-gray-600 mb-6">
                  Upload your photo securely with phone number verification
                </p>
                
                <Button 
                  className="h-12 text-white font-medium px-8"
                  style={{ backgroundColor: settings.buttonColor }}
                  disabled
                >
                  {settings.buttonText}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Title:</strong> {settings.pageTitle}</p>
                <p><strong>Button Text:</strong> {settings.buttonText}</p>
                <p><strong>Button Color:</strong> {settings.buttonColor}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
