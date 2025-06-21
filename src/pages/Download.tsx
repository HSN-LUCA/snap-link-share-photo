
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download as DownloadIcon, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { findPhotoByPhoneNumber, getPhotoUrl, PhotoData } from "@/lib/photoStorage";

const Download = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [photoFound, setPhotoFound] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to find your photo",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const data = await findPhotoByPhoneNumber(phoneNumber);
      
      if (data) {
        setPhotoData(data);
        setPhotoFound(true);
        toast({
          title: "Photo Found!",
          description: "Your photo is ready for viewing and download",
        });
      } else {
        setPhotoFound(false);
        toast({
          title: "No Photo Found",
          description: "No photo found for this phone number. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPhotoFound(false);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search for photo",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = () => {
    if (photoData?.filePath && photoData?.fileName) {
      const photoUrl = getPhotoUrl(photoData.filePath);
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = photoData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your photo is being downloaded",
      });
    }
  };

  const handleSearchAgain = () => {
    setPhoneNumber("");
    setPhotoData(null);
    setPhotoFound(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Photo
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your phone number to find and download your photo
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {photoFound === null || photoFound === false ? (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Find Your Photo</CardTitle>
                <CardDescription className="text-base">
                  Enter your phone number to locate your uploaded photo
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
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                >
                  {isSearching ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Find Photo</span>
                    </div>
                  )}
                </Button>

                {photoFound === false && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-sm text-red-700">
                        No photo found for this phone number. Please check and try again.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <DownloadIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-600">Photo Found!</CardTitle>
                <CardDescription className="text-base">
                  Your photo is ready for viewing and download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {photoData?.filePath && (
                  <div className="space-y-4">
                    <div className="aspect-video w-full overflow-hidden rounded-lg border">
                      <img 
                        src={getPhotoUrl(photoData.filePath)} 
                        alt="Your photo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleDownload}
                        className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium"
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download Photo
                      </Button>
                      <Button 
                        onClick={handleSearchAgain}
                        variant="outline"
                        className="flex-1 h-12"
                      >
                        Find Another
                      </Button>
                    </div>
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
