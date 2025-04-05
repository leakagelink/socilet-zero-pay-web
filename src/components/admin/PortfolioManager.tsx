
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { PortfolioItem, loadPortfolioItems, savePortfolioItems, permanentlyDeleteItem } from './portfolioData';
import PortfolioItemCard from './portfolio/PortfolioItemCard';
import AddPortfolioItemDialog from './portfolio/AddPortfolioItemDialog';
import EditPortfolioItemDialog from './portfolio/EditPortfolioItemDialog';
import { PORTFOLIO_CATEGORIES } from './portfolio/portfolioConstants';

const PortfolioManager = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);

  // Load items when component mounts
  useEffect(() => {
    setPortfolioItems(loadPortfolioItems());
    
    // Add listener for storage events to update when changes occur in other components
    const handleStorageChange = () => {
      setPortfolioItems(loadPortfolioItems());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAddItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const id = portfolioItems.length > 0 
      ? Math.max(0, ...portfolioItems.map(item => item.id)) + 1 
      : 1;
    const updatedItems = [...portfolioItems, { id, ...newItem }];
    setPortfolioItems(updatedItems);
    savePortfolioItems(updatedItems); // Save to localStorage
    setIsAddDialogOpen(false);
    toast.success('Portfolio item added successfully');
  };

  const handleEditItem = () => {
    if (!currentItem) return;
    
    const updatedItems = portfolioItems.map(item => 
      item.id === currentItem.id ? currentItem : item
    );
    
    setPortfolioItems(updatedItems);
    savePortfolioItems(updatedItems); // Save to localStorage
    setIsEditDialogOpen(false);
    setCurrentItem(null);
    toast.success('Portfolio item updated successfully');
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item? This will permanently remove it and prevent it from reappearing.')) {
      // Use the new permanently delete function
      permanentlyDeleteItem(id);
      setPortfolioItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Portfolio item permanently deleted');
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setCurrentItem({ ...item });
    setIsEditDialogOpen(true);
  };

  // Get category label from category id
  const getCategoryLabel = (categoryId: string) => {
    const category = PORTFOLIO_CATEGORIES.find(c => c.id === categoryId);
    return category?.label || categoryId;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portfolio Items</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Item
        </Button>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">No portfolio items found.</p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioItemCard
              key={item.id}
              item={item}
              categoryLabel={getCategoryLabel(item.category)}
              onEdit={openEditDialog}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      <AddPortfolioItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddItem}
      />

      <EditPortfolioItemDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentItem={currentItem}
        onCurrentItemChange={setCurrentItem}
        onSave={handleEditItem}
      />
    </div>
  );
};

export default PortfolioManager;
