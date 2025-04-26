
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface HeaderProps {
  onOpenInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenInfo }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3"></div>
        <h1 className="text-2xl font-bold">Mood Mirror</h1>
      </div>
      
      <Button variant="ghost" size="sm" onClick={onOpenInfo}>
        <Info size={18} className="mr-2" />
        How it works
      </Button>
    </header>
  );
};

export default Header;
