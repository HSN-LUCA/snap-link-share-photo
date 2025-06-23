import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Shield, Download, Settings, Camera, Image, FileImage, CloudUpload, FolderOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadPhoto } from "@/lib/photoStorage";
import { validateImageFile, detectFaces, loadImageFromFile } from "@/lib/faceDetection";
import { Link } from "react-router-dom";

interface AdminSettings {
  buttonColor: string;
  buttonText: string;
  pageTitle: string;
  logoUrl: string;
  headerText: string;
  uploadIcon: string;
  iconColor: string;
  iconBackgroundColor: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    buttonColor: "#92722A",
    buttonText: "Upload Photo",
    pageTitle: "CloudShare",
    logoUrl: "",
    headerText: "Upload your photo securely with phone number verification",
    uploadIcon: "CloudUpload",
    iconColor: "#ffffff",
    iconBackgroundColor: "#ffffff"
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load admin settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Add default values if they don't exist in saved settings
      setAdminSettings({
        iconColor: "#ffffff",
        uploadIcon: "CloudUpload",
        iconBackgroundColor: "#ffffff",
        ...parsed
      });
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic file validation
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      toast({
        title: "Invalid File",
        description: fileValidation.error,
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Load image and perform face detection
      const imageElement = await loadImageFromFile(file);
      const faceValidation = await detectFaces(imageElement);
      
      if (!faceValidation.isValid) {
        toast({
          title: "Photo Validation Failed",
          description: faceValidation.error,
          variant: "destructive",
        });
        setIsValidating(false);
        return;
      }

      // If validation passes, set the file
      setSelectedFile(file);
      toast({
        title: "Photo Validated",
        description: "Face detected successfully! Photo is ready for upload.",
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Failed to validate photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-digits
    value = value.replace(/\D/g, '');
    
    // Ensure it starts with 05
    if (value.length > 0 && !value.startsWith('05')) {
      if (value.startsWith('5')) {
        value = '0' + value;
      } else if (!value.startsWith('0')) {
        value = '05' + value;
      } else if (value.startsWith('0') && value.length > 1 && value[1] !== '5') {
        value = '05' + value.substring(1);
      }
    }
    
    // Limit to 10 digits total (05 + 8 digits)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    setPhoneNumber(value);
  };

  const isValidPhoneNumber = (phone: string) => {
    return phone.startsWith('05') && phone.length === 10;
  };

  const handleUpload = async () => {
    if (!selectedFile || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a validated photo and provide phone number",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be 05 followed by 8 digits",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      await uploadPhoto(selectedFile, phoneNumber);
      
      setIsUploading(false);
      setIsUploaded(true);
      toast({
        title: "Photo Uploaded Successfully!",
        description: "Your photo has been saved and can be downloaded using your phone number",
      });
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  const handleUploadAnother = () => {
    setIsUploaded(false);
    setSelectedFile(null);
    setPhoneNumber("");
  };

  const getUploadIcon = () => {
    switch (adminSettings.uploadIcon) {
      case "CloudUpload":
        return CloudUpload;
      case "Camera":
        return Camera;
      case "Image":
        return Image;
      case "FileImage":
        return FileImage;
      case "FolderOpen":
        return FolderOpen;
      case "Plus":
        return Plus;
      case "Upload":
      default:
        return Upload;
    }
  };

  const UploadIcon = getUploadIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-8 sm:mb-12 relative">
          {adminSettings.logoUrl && (
            <div className="mb-3 sm:mb-4">
              <img src={adminSettings.logoUrl} alt="Logo" className="h-12 sm:h-16 w-auto mx-auto object-contain" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            {adminSettings.pageTitle}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {adminSettings.headerText}
          </p>
          
          {/* Admin Panel Link */}
          <Link 
            to="/admin" 
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          {!isUploaded ? (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center px-4 sm:px-6">
                <div 
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: adminSettings.iconBackgroundColor }}
                >
                  <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: adminSettings.iconColor }} />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Upload Your Photo</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Select your photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-sm font-medium">
                    Select Photo
                  </Label>
                  <div className="relative">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="h-10 sm:h-12 text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isValidating}
                    />
                  </div>
                  {isValidating && (
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-600 mt-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Validating photo and detecting face...</span>
                    </div>
                  )}
                  {selectedFile && !isValidating && (
                    <p className="text-xs sm:text-sm text-green-600 mt-2 break-all">
                      ✓ {selectedFile.name} - Face detected and validated
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Your Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="05xxxxxxxx"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="h-10 sm:h-12 text-base"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                    <p className="text-xs sm:text-sm text-red-600">
                      Phone number must be 05 followed by 8 digits
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || isValidating || !selectedFile || !isValidPhoneNumber(phoneNumber)}
                  className="w-full h-10 sm:h-12 text-white font-medium text-sm sm:text-base"
                  style={{ backgroundColor: adminSettings.buttonColor }}
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UploadIcon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: adminSettings.iconColor }} />
                      <span>{adminSettings.buttonText}</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center px-4 sm:px-6">
                <div 
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: adminSettings.iconBackgroundColor }}
                >
                  <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: adminSettings.iconColor }} />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-green-600">Photo Uploaded Successfully!</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your photo has been saved and can be downloaded using your phone number
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Your phone number:</p>
                  <p className="font-mono text-sm sm:text-base bg-white p-2 sm:p-3 rounded border break-all">
                    {phoneNumber}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    Use this phone number to find and download your photo
                  </p>
                </div>
                
                <Button 
                  onClick={handleUploadAnother}
                  className="w-full h-10 sm:h-12 text-sm sm:text-base"
                  variant="outline"
                >
                  Upload Another Photo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
