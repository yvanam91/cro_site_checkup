"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Plus, 
  X, 
  Laptop, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface ProjectForm {
  url: string;
  name: string;
  category: string;
}

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    url: "",
    name: "",
    category: "saas",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide a project name.");
      return;
    }
    if (!formData.url.trim() || !validateUrl(formData.url)) {
      setError("Please enter a valid website URL (e.g. example.com).");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        // Reset form
        setFormData({ url: "", name: "", category: "saas" });
      }, 1500);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 relative">
      {/* Centered Empty State Card */}
      <div className="max-w-md w-full bg-gradient-to-b from-slate-950/60 to-slate-950/20 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        {/* Floating Scan Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-pulse" />
          <div className="absolute inset-2 rounded-full border border-dashed border-indigo-500/20 animate-spin [animation-duration:10s]" />
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
            <Globe className="w-7 h-7 text-indigo-400 flex-shrink-0" />
          </div>
        </div>

        {/* Description Header */}
        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          No websites to audit yet
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Connect your first website to let CRO-Brain scan for layout shifts, accessibility errors, loading performance, and automated conversion optimization insights.
        </p>

        {/* Action Call */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          Add website to audit
        </button>
      </div>

      {/* Slide-out/Modal Onboarding Dialog */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 p-6 md:p-8 shadow-2xl transition-all duration-300 scale-100 opacity-100 text-left">
            {/* Close Button */}
            {!isSubmitting && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-150 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 flex-shrink-0" />
              </button>
            )}

            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Project Connected!
                </h3>
                <p className="text-xs text-slate-400">
                  Initializing optimization scans in the background...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    Add Website Project
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Set up your site&apos;s target metrics. We will perform layout stability, performance, and SEO checks.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor="project-name" 
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Project Name
                    </label>
                    <input
                      id="project-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. My E-commerce App"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-150 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="project-url" 
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Website URL
                    </label>
                    <input
                      id="project-url"
                      type="text"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="e.g. https://mywebsite.com"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-150 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="project-category" 
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                    >
                      Domain Type
                    </label>
                    <select
                      id="project-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-150 disabled:opacity-50"
                    >
                      <option value="saas">SaaS Platform</option>
                      <option value="ecommerce">E-Commerce Store</option>
                      <option value="landing">Marketing Landing Page</option>
                      <option value="blog">Content / Blog Site</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-850 text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                        Connecting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Start Audit Scan
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
