import React, { forwardRef } from 'react';

const Certificate = forwardRef(({ user, course }, ref) => {
  return (
    <div className="absolute -left-[9999px]"> {/* Hidden from view */}
      <div 
        ref={ref}
        className="w-[1000px] h-[700px] bg-white p-16 border-[20px] border-stone-900 flex flex-col items-center justify-between text-center relative"
      >
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[10px] border-l-[10px] border-amber-500" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[10px] border-r-[10px] border-amber-500" />

        <div className="space-y-6">
          <p className="text-stone-400 font-black uppercase tracking-[0.4em] text-sm">Certificate of Completion</p>
          <h1 className="text-7xl font-black text-stone-900 uppercase italic tracking-tighter">MINILMS</h1>
        </div>

        <div className="space-y-4">
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">This is to certify that</p>
          <h2 className="text-5xl font-black text-stone-900 underline decoration-amber-500 underline-offset-8">
            {user.name}
          </h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-6">has successfully mastered the course</p>
          <h3 className="text-3xl font-black text-amber-600 uppercase italic">
            {course.title}
          </h3>
        </div>

        <div className="w-full flex justify-between items-end pt-12">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Date Issued</p>
            <p className="text-sm font-bold text-stone-900">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
             <p className="text-2xl font-black text-stone-900 italic">Verify: #LMS-{course._id.slice(-5)}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;