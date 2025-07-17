'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, RefreshCw, X } from '@/lib/icons';

interface FidgetItem {
  id: string;
  type: 'button' | 'switch';
  state: boolean;
}

const FidgetSimulator = () => {
  const [fidgetItems, setFidgetItems] = useState<FidgetItem[]>([
    { id: 'button1', type: 'button', state: false },
    { id: 'switch1', type: 'switch', state: false },
  ]);
  const [newItemType, setNewItemType] = useState<'button' | 'switch'>('button');
  const [newItemId, setNewItemId] = useState<string>('');

  const handleItemClick = (id: string) => {
    setFidgetItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === 'button' ? { ...item, state: !item.state } : item
      )
    );
  };

  const handleSwitchToggle = (id: string) => {
    setFidgetItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === 'switch' ? { ...item, state: !item.state } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newItemId) {
      const newItem: FidgetItem = { id: newItemId, type: newItemType, state: false };
      setFidgetItems([...fidgetItems, newItem]);
      setNewItemId('');
    }
  };

  const handleRemoveItem = (id: string) => {
    setFidgetItems(fidgetItems.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setFidgetItems([
        { id: 'button1', type: 'button', state: false },
        { id: 'switch1', type: 'switch', state: false },
      ]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md space-y-4 p-4">
        <CardHeader>
          <CardTitle>Fidget Simulator</CardTitle>
          <CardDescription>Een verzameling digitale fidgets om je handen bezig te houden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {fidgetItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                {item.type === 'button' ? (
                  <Button variant="outline" onClick={() => handleItemClick(item.id)} className={item.state ? 'bg-blue-500 text-white' : ''}>
                    {item.id}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`switch-${item.id}`}>{item.id}</Label>
                    <Switch id={`switch-${item.id}`} checked={item.state} onCheckedChange={() => handleSwitchToggle(item.id)} />
                  </div>
                )}
                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="new-item-id">Nieuwe Fidget ID:</Label>
            <Input id="new-item-id" value={newItemId} onChange={(e) => setNewItemId(e.target.value)} />
            <select value={newItemType} onChange={(e) => setNewItemType(e.target.value as 'button' | 'switch')}>
                <option value="button">Button</option>
                <option value="switch">Switch</option>
            </select>
            <Button variant="secondary" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Toevoegen
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FidgetSimulator;
