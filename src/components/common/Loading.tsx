"use client";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-brand-red/20 opacity-75"></div>

          <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-100 border-t-brand-red"></div>

          <div className="absolute flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red text-lg font-black text-white shadow-lg shadow-brand-red/20">
            F
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
            Fitbinary
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
            Synchronizing...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
