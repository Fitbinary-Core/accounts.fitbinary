"use client";

import { useEffect, useState } from "react";
import CategorySelector from "@/components/common/CategorySelector";
import type { Category } from "@/schemas/categories";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import {
  getOnboardingCategories,
  getTenantSelectedCategories,
  updateTenantCategories,
} from "@/services/categories/categories.service";

const Categories = ({
  onStepComplete,
  app_id,
}: {
  onStepComplete?: () => void;
  app_id?: string;
}) => {
  const [currentCategories, setCurrentCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialCategories = async () => {
      try {
        const data = await getOnboardingCategories(app_id);
        setCurrentCategories(data);
        setSelectedCategories(data);
        setSelectedIds(data.map((cat: any) => cat._id));
      } catch (error) {
        console.error("Failed to fetch initial categories:", error);
      }
    };
    fetchInitialCategories();
  }, []);

  const handleSaveCategories = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    try {
      setLoading(true);
      await updateTenantCategories(selectedIds, app_id);
      toast.success("Business categories updated successfully");
      if (onStepComplete) {
        onStepComplete();
      }
      const updatedData = await getTenantSelectedCategories();
      setCurrentCategories(updatedData);
    } catch (error: any) {
      toast.error(error.message || "Failed to update categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-red-500 pb-2 inline-block">
          Manage Business Categories
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Update the categories that define your business. Changes will be
          synced to your profile.
        </p>
      </div>

      {currentCategories.length > 0 && (
        <div className="space-y-3 p-4 bg-gray-900 text-white rounded-md shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Current Active Categories
            </h4>
            <span className="text-[10px] font-bold bg-red-600 px-2 py-0.5 rounded text-white italic">
              LIVE
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-xs font-semibold rounded border border-gray-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Section */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Select New Categories
        </label>
        <CategorySelector
          isMulti
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          asDialog={false}
          onlyTopLevelSelectable
        />
      </div>

      {selectedCategories.length > 0 && (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Your New Selection
            </h4>
            <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {selectedCategories.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <div
                key={cat._id}
                className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {cat.name}
                <button
                  type="button"
                  onClick={() => {
                    const newCategories = selectedCategories.filter(
                      (c) => c._id !== cat._id,
                    );
                    setSelectedCategories(newCategories);
                    setSelectedIds(newCategories.map((c) => c._id));
                  }}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSaveCategories}
        disabled={loading}
        className="py-6 rounded-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white w-full font-bold shadow-md transform active:scale-[0.98] transition-all"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Saving...
          </div>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Categories
          </>
        )}
      </Button>
    </div>
  );
};

export default Categories;
