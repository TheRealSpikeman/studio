// src/components/tools/FidgetSimulator.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Puzzle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FidgetSimulator() {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [sliderValue, setSliderValue] = useState([50]);
  const [clickCount, setClickCount] = useState(0);

  const handleReset = () => {
    setSwitch1(false);
    setSwitch2(true);
    setSliderValue([50]);
    setClickCount(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-6 w-6 text-primary" />
          Fidget Simulator
        </CardTitle>
        <CardDescription>
          Een digitale toolkit om je handen bezig te houden en je geest te focussen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-2 gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Switch id="fidget-switch-1" checked={switch1} onCheckedChange={setSwitch1} />
            <Label htmlFor="fidget-switch-1">Schakelaar 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="fidget-switch-2" checked={switch2} onCheckedChange={setSwitch2} />
            <Label htmlFor="fidget-switch-2">Schakelaar 2</Label>
          </div>
        </div>

        <div>
          <Label>Schuifregelaar</Label>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="text-center">
            <Button
                onClick={() => setClickCount(prev => prev + 1)}
                className="relative w-24 h-24 rounded-full text-lg font-bold transition-transform duration-75 active:scale-95"
            >
                Klik
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {clickCount}
                </span>
            </Button>
        </div>
        
        <div className="text-center border-t pt-4">
            <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
