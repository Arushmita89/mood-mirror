import React, { useRef, useEffect, useState } from 'react';
import * as tmImage from '@teachablemachine/image'; // Teachable Machine library
import { DetectionResult } from '../models';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmotionDetectorProps {
  onEmotionDetected: (result: DetectionResult) => void;
  isActive: boolean;
  onToggleActive: () => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  onEmotionDetected,
  isActive,
  onToggleActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);  // Teachable Machine model
  const [useBackupMode, setUseBackupMode] = useState(false);
  const { toast } = useToast();
  const streamRef = useRef<MediaStream | null>(null);
  const backupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load the Teachable Machine model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setError(null); // Reset error state
        console.log('Loading Teachable Machine model...');

        const modelURL = '/models/model.json'; // Ensure the correct model path
        const metadataURL = '/models/metadata.json'; // Ensure metadata file path

        // Load the Teachable Machine model
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);

        console.log('Teachable Machine model loaded successfully');
        setModelsLoaded(true);

        toast({
          title: "Model Loaded",
          description: "Emotion detection model is now ready.",
        });
      } catch (err) {
        console.error('Error loading Teachable Machine model:', err);
        setUseBackupMode(true);
        setModelsLoaded(false);
        setError('Failed to load emotion detection model. Please check your internet connection and try again.');
        
        toast({
          title: "Model Loading Failed",
          description: "Switching to demo mode.",
          variant: "destructive"
        });
      }
    };

    loadModel();

    return () => {
      if (backupTimerRef.current) {
        clearInterval(backupTimerRef.current);
      }
    };
  }, [retryCount, toast]);

  // Start video feed
  useEffect(() => {
    const startVideo = async () => {
      if (!isActive) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        return;
      }

      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }
        });

        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setError(null);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Couldn't access your camera. Please check permissions and try again.");

        toast({
          title: "Camera error",
          description: "Couldn't access your camera. Please check permissions and try again.",
          variant: "destructive",
        });
      }
    };

    startVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, toast]);

  // Detect emotions on video feed
  useEffect(() => {
    if (!isActive || !modelsLoaded || !videoRef.current || !canvasRef.current || useBackupMode) return;

    let animationFrameId: number;
    let lastDetectionTime = 0;
    const DETECTION_INTERVAL = 500; // ms between detection attempts

    const detectEmotions = async () => {
      if (!videoRef.current || !canvasRef.current || !model) return;

      const now = Date.now();
      if (now - lastDetectionTime >= DETECTION_INTERVAL) {
        try {
          if (videoRef.current.readyState === 4) {
            const prediction = await model.predict(videoRef.current);
            if (prediction) {
              const emotions = prediction.map(({ className, probability }) => ({
                emotion: className,
                probability,
              }));

              emotions.sort((a, b) => b.probability - a.probability);

              const result: DetectionResult = {
                emotions,
                dominantEmotion: emotions[0],
                faceDetected: true,
                timestamp: Date.now(),
              };

              onEmotionDetected(result);
            }
          }

          lastDetectionTime = now;
        } catch (err) {
          console.error("Error during emotion detection:", err);
        }
      }

      animationFrameId = requestAnimationFrame(detectEmotions);
    };

    detectEmotions();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, modelsLoaded, onEmotionDetected, useBackupMode, model]);

  const handleRetryLoading = () => {
    setRetryCount(prev => prev + 1);
  };

  const toggleBackupMode = () => {
    setUseBackupMode(prev => !prev);
    setModelsLoaded(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <Card className="overflow-hidden relative">
      <div className={`aspect-video bg-black relative ${!isActive ? 'opacity-50' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <VideoOff size={48} className="text-white opacity-75" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleBackupMode}
              >
                {useBackupMode ? "Try Real Detection" : "Use Demo Mode"}
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleRetryLoading}
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {useBackupMode && (
        <Alert className="mt-2 bg-amber-50 border-amber-200">
          <AlertDescription>
            Running in demo mode. Facial detection models couldn't be loaded, using sample data instead.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={toggleBackupMode}
            >
              Try Real Detection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full w-10 h-10 p-0 bg-white/50 backdrop-blur-sm hover:bg-white/80"
          onClick={onToggleActive}
        >
          {isActive ? <Video size={18} /> : <VideoOff size={18} />}
        </Button>
      </div>
    </Card>
  );
};

export default EmotionDetector;
