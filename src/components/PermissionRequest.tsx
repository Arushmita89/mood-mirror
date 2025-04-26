
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface PermissionRequestProps {
  onRequestPermission: () => void;
  error?: string;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({ 
  onRequestPermission,
  error 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto text-center">
      <Camera size={48} className="mb-4 text-primary animate-pulse-emotion" />
      <h2 className="text-2xl font-bold mb-2">Camera Access Required</h2>
      <p className="text-gray-600 mb-6">
        To reflect your emotions in art, Mood Mirror needs permission to access your camera.
        Your facial data is processed locally and never leaves your device.
      </p>
      
      {error && (
        <div className="bg-red-50 p-3 rounded-md text-red-700 mb-6 w-full">
          <p className="font-medium">Error accessing camera</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <Button 
        size="lg"
        onClick={onRequestPermission}
        className="flex items-center"
      >
        <Camera size={18} className="mr-2" />
        Enable Camera
      </Button>
      
      <p className="mt-6 text-xs text-gray-500">
        Privacy note: All emotion analysis happens in your browser.
        No images or data are sent to any server.
      </p>
    </div>
  );
};

export default PermissionRequest;
