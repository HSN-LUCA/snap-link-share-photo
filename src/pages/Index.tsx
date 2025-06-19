
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Link, Shield, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  const generateShareLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 15);
    return `${window.location.origin}/download/${uniqueId}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a photo and provide phone number",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      
      setTimeout(() => {
        const link = generateShareLink();
        setShareLink(link);
        
        // Store the photo data in localStorage
        const photoData = {
          imageData: base64Data,
          fileName: selectedFile.name,
          phoneNumber,
          timestamp: Date.now(),
        };
        localStorage.setItem(link.split('/').pop() || '', JSON.stringify(photoData));
        
        setIsUploading(false);
        toast({
          title: "Photo Uploaded Successfully!",
          description: "Share link has been generated",
        });
      }, 2000);
    };
    
    reader.readAsDataURL(selectedFile);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied!",
      description: "Share link has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CloudShare
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Securely share photos with phone number verification. Upload once, share safely.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!shareLink ? (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Upload Your Photo</CardTitle>
                <CardDescription className="text-base">
                  Share photos securely with phone number verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-sm font-medium">
                    Select Photo
                  </Label>
                  <div className="relative">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Receiver's Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Generate Share Link</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Link className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-600">Photo Uploaded Successfully!</CardTitle>
                <CardDescription className="text-base">
                  Share this secure link with the receiver
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Secure Share Link:</p>
                  <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                    {shareLink}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button onClick={copyToClipboard} className="flex-1">
                    <Link className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShareLink("");
                      setSelectedFile(null);
                      setPhoneNumber("");
                    }}
                    className="flex-1"
                  >
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Upload</h3>
              <p className="text-sm text-gray-600">Simply paste your image URL and enter the receiver's phone number</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Sharing</h3>
              <p className="text-sm text-gray-600">Phone number verification ensures only intended recipients can access</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Simple Download</h3>
              <p className="text-sm text-gray-600">Recipients just need to enter their phone number to download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
