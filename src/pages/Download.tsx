
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download as DownloadIcon, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Download = () => {
  const { id } = useParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [photoData, setPhotoData] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [photoExists, setPhotoExists] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if photo exists
    const data = localStorage.getItem(id || '');
    if (data) {
      setPhotoData(JSON.parse(data));
    } else {
      setPhotoExists(false);
    }
  }, [id]);

  const handleVerification = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to access the photo",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate phone verification
    setTimeout(() => {
      if (phoneNumber === photoData?.phoneNumber) {
        setIsVerified(true);
        toast({
          title: "Verification Successful!",
          description: "You can now view and download the photo",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Phone number doesn't match. Please check and try again.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (photoData?.imageUrl) {
      const link = document.createElement('a');
      link.href = photoData.imageUrl;
      link.download = 'shared-photo.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your photo is being downloaded",
      });
    }
  };

  if (!photoExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-600">Photo Not Found</CardTitle>
            <CardDescription>
              This link is invalid or the photo has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CloudShare
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your phone number to access the shared photo
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {!isVerified ? (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Phone Verification</CardTitle>
                <CardDescription className="text-base">
                  Enter your phone number to access the shared photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Your Phone Number
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
                  onClick={handleVerification} 
                  disabled={isVerifying}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Verify & Access Photo</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <DownloadIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-600">Access Granted!</CardTitle>
                <CardDescription className="text-base">
                  Your photo is ready for viewing and download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {photoData?.imageUrl && (
                  <div className="space-y-4">
                    <div className="aspect-video w-full overflow-hidden rounded-lg border">
                      <img 
                        src={photoData.imageUrl} 
                        alt="Shared photo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleDownload}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
