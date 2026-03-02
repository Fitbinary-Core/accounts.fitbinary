import { X, AlertCircle, CheckCircle } from "lucide-react";

interface SkipConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FreeTrailDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: SkipConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg max-h-[95vh] w-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Start Free Trial?
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                No payment required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 mb-4 text-lg">
            You are about to start a{" "}
            <span className="font-bold text-red-600">14-day free trial</span>{" "}
            with our Basic plan. No credit card required.
          </p>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What's Included
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✓</span>
                <span>Full access to all Basic plan features</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✓</span>
                <span>No payment required for 14 days</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✓</span>
                <span>Upgrade, downgrade, or cancel anytime</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-600 font-bold mt-1">✓</span>
                <span>24/7 customer support included</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onConfirm}
              className="w-full cursor-pointer bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              Start Free Trial Now
            </button>
            <button
              onClick={onClose}
              className="w-full cursor-pointer bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Back to Plans
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Cancel anytime during your trial period
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeTrailDialog;
