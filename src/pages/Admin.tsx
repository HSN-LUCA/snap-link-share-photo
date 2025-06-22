import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Eye, Upload, Camera, Image, FileImage, CloudUpload, FolderOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AdminSettings {
  buttonColor: string;
  buttonText: string;
  pageTitle: string;
  logoUrl: string;
  headerText: string;
  uploadIcon: string;
  iconColor: string;
}

const iconOptions = [
  { value: "Upload", label: "Upload", icon: Upload },
  { value: "CloudUpload", label: "Cloud Upload", icon: CloudUpload },
  { value: "Camera", label: "Camera", icon: Camera },
  { value: "Image", label: "Image", icon: Image },
  { value: "FileImage", label: "File Image", icon: FileImage },
  { value: "FolderOpen", label: "Folder Open", icon: FolderOpen },
  { value: "Plus", label: "Plus", icon: Plus },
];

const Admin = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    buttonColor: "#92722A",
    buttonText: "Upload Photo",
    pageTitle: "CloudShare",
    logoUrl: "",
    headerText: "Upload your photo securely with phone number verification",
    uploadIcon: "CloudUpload",
    iconColor: "#ffffff"
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Add default iconColor if it doesn't exist in saved settings
      setSettings({
        iconColor: "#ffffff",
        uploadIcon: "CloudUpload",
        ...parsed
      });
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        handleInputChange('logoUrl', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSelectedIcon = () => {
    const selectedOption = iconOptions.find(option => option.value === settings.uploadIcon);
    return selectedOption ? selectedOption.icon : CloudUpload;
  };

  const SelectedIcon = getSelectedIcon();

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
                <Label htmlFor="headerText" className="text-sm font-medium">
                  Header Description Text
                </Label>
                <Input
                  id="headerText"
                  value={settings.headerText}
                  onChange={(e) => handleInputChange('headerText', e.target.value)}
                  placeholder="Enter header description"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUpload" className="text-sm font-medium">
                  Logo Upload
                </Label>
                <Input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {settings.logoUrl && (
                  <div className="mt-2">
                    <img src={settings.logoUrl} alt="Logo preview" className="h-12 w-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="uploadIcon" className="text-sm font-medium">
                  Upload Icon Style
                </Label>
                <Select value={settings.uploadIcon} onValueChange={(value) => handleInputChange('uploadIcon', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select upload icon style" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconColor" className="text-sm font-medium">
                  Upload Icon Color
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="iconColor"
                    type="color"
                    value={settings.iconColor}
                    onChange={(e) => handleInputChange('iconColor', e.target.value)}
                    className="h-12 w-20"
                  />
                  <Input
                    value={settings.iconColor}
                    onChange={(e) => handleInputChange('iconColor', e.target.value)}
                    placeholder="#ffffff"
                    className="h-12 flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">This color will be applied to the upload icon</p>
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
                {settings.logoUrl && (
                  <div className="mb-4">
                    <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto mx-auto object-contain" />
                  </div>
                )}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {settings.pageTitle}
                </h2>
                <p className="text-gray-600 mb-6">
                  {settings.headerText}
                </p>
                
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <SelectedIcon className="w-8 h-8" style={{ color: settings.iconColor }} />
                  </div>
                </div>
                
                <Button 
                  className="h-12 text-white font-medium px-8"
                  style={{ backgroundColor: settings.buttonColor }}
                  disabled
                >
                  {settings.buttonText}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Title:</strong> {settings.pageTitle}</p>
                <p><strong>Header Text:</strong> {settings.headerText}</p>
                <p><strong>Upload Icon:</strong> {settings.uploadIcon}</p>
                <p><strong>Icon Color:</strong> {settings.iconColor}</p>
                <p><strong>Button Text:</strong> {settings.buttonText}</p>
                <p><strong>Button Color:</strong> {settings.buttonColor}</p>
                <p><strong>Logo:</strong> {settings.logoUrl ? 'Uploaded' : 'None'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
