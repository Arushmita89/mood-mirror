import React, { useState } from 'react';
import { DetectionResult } from '../models';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmotionDetector from '../components/EmotionDetector';
import EmotionDisplay from '../components/EmotionDisplay';
import TherapistChatbot from '../components/TherapistChatbot';  // Import TherapistChatbot
import PermissionRequest from '../components/PermissionRequest';
import Header from '../components/Header';

const Index: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  
  const handleRequestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setCameraActive(true);
      setPermissionError(null);
    } catch (err: any) {
      console.error("Permission error:", err);
      setHasPermission(false);
      setPermissionError(err.message || "Could not access camera");
    }
  };
  
  const handleToggleCamera = () => {
    setCameraActive(prev => !prev);
  };
  
  const handleEmotionDetected = (result: DetectionResult) => {
    setDetectionResult(result);
  };

  const emotion = detectionResult ? detectionResult.emotion : null;  // Get emotion from detection result
  
  // Show permission request if permission hasn't been granted yet
  if (hasPermission === null || hasPermission === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
        <Header onOpenInfo={() => setInfoOpen(true)} />
        
        <main className="flex-grow flex items-center justify-center p-6">
          <PermissionRequest 
            onRequestPermission={handleRequestPermission}
            error={permissionError || undefined}
          />
        </main>
        
        <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <Header onOpenInfo={() => setInfoOpen(true)} />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <EmotionDetector 
                onEmotionDetected={handleEmotionDetected}
                isActive={cameraActive}
                onToggleActive={handleToggleCamera}
              />
            </div>
            <div>
              <EmotionDisplay detectionResult={detectionResult} />
            </div>
          </div>
          
          {/* Pass detected emotion to TherapistChatbot */}
          <div className="h-64 md:h-96">
            <TherapistChatbot emotion={emotion} />
          </div>
        </div>
      </main>
      
      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </div>
  );
};

// Info modal component
const InfoDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>About Mood Mirror</DialogTitle>
          <DialogDescription>
            How this emotion-powered art generator works
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium mb-1">How it works</h3>
            <p className="text-sm text-muted-foreground">
              Mood Mirror uses facial expression analysis to detect your emotions and 
              transform them into unique visual art. The app processes your facial 
              features locally in your browser - no images are sent to any server.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Your privacy is important. All processing happens directly in your browser.
              No images, video, or emotion data are ever stored or transmitted.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Tips for best results</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              <li>Ensure good lighting on your face</li>
              <li>Position yourself directly in front of the camera</li>
              <li>Try different emotional expressions for varied art</li>
              <li>Save your favorite generated pieces</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Index;
