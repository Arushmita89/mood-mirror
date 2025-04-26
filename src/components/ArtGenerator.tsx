import React, { useState, useEffect } from 'react';
import { Emotion, DetectionResult, GeneratedArt } from '../models';
import { generateArt, emotionDescriptionMap } from '../utils/emotionUtils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";

interface ArtGeneratorProps {
  detectionResult: DetectionResult | null;
}

const ArtGenerator: React.FC<ArtGeneratorProps> = ({ detectionResult }) => {
  const [currentArt, setCurrentArt] = useState<GeneratedArt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate art when dominant emotion changes significantly
  useEffect(() => {
    if (!detectionResult?.faceDetected) return;

    const dominantEmotion = detectionResult.dominantEmotion.emotion as Emotion;
    const currentEmotion = currentArt?.emotion;

    // Regenerate only if dominant emotion changes or if it's the first time generating
    if (
      !currentArt || 
      currentEmotion !== dominantEmotion ||
      detectionResult.dominantEmotion.probability > 0.7 // Check if there's a significant probability increase
    ) {
      handleGenerateArt(dominantEmotion);
    }
  }, [detectionResult, currentArt]);

  const handleGenerateArt = (emotion: Emotion) => {
    setIsGenerating(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      const art = generateArt(emotion);
      setCurrentArt(art);
      setIsGenerating(false);
    }, 500); // Simulate a slight delay for generating art
  };

  const handleRegenerateArt = () => {
    if (!detectionResult?.faceDetected) return;
    
    const emotion = detectionResult.dominantEmotion.emotion as Emotion;
    handleGenerateArt(emotion);
  };

  const handleDownloadArt = () => {
    if (!currentArt) return;

    // Create downloadable SVG
    const blob = new Blob([currentArt.svgContent], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob); // Use window.URL to be explicit

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-mirror-${currentArt.emotion}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);
  };

  if (!detectionResult?.faceDetected && !currentArt) {
    return (
      <Card className="h-full flex flex-col justify-center items-center bg-muted/20 border-dashed">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">
            Position yourself in front of the camera to generate emotion-based art
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Your Emotional Art</span>
          {currentArt && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full capitalize">
              {currentArt.emotion}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow relative">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : currentArt ? (
          <div className={`h-full rounded-md overflow-hidden ${currentArt.style.backgroundStyles}`}>
            <div 
              className="w-full h-full" 
              dangerouslySetInnerHTML={{ __html: currentArt.svgContent }} 
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No art generated yet</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 flex justify-between gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleRegenerateArt}
          disabled={isGenerating || !detectionResult?.faceDetected}
        >
          <RefreshCw size={16} className="mr-2" />
          Regenerate
        </Button>

        <Button
          className="flex-1"
          onClick={handleDownloadArt}
          disabled={isGenerating || !currentArt}
        >
          <Download size={16} className="mr-2" />
          Save Art
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtGenerator;
