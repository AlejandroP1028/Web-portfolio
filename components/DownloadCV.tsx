"use client";

import { useRef } from "react";
import {
  Download,
  FileText,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

export default function DownloadCV() {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, handleSubmit] = useForm("mdkdneoz");
  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }
  return (
    <section id="cv" ref={sectionRef} className="py-24 bg-gray-50/30">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
        {/* Heading */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-600">
            <FileText size={20} />
            <h2 className="text-2xl font-medium text-gray-900">
              Download My CV
            </h2>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            A quick overview of my education, experience, and skills.
          </p>
        </div>

        {/* Contact Info Preview */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-8 shadow-sm text-left space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Alejandro A. Prado
          </h3>
          <p className="text-sm text-gray-600">
            Software Developer & Computer Science Graduate (Cum Laude)
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <MapPin size={14} />
              Pasig, Metro Manila, PH
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} />
              alejandroprado885@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} />
              09939270565
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/alejandro-prado-cv.pdf"
            download="Alejandro_Prado_CV.pdf"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Download size={18} className="mr-2" />
            Download PDF
          </a>
          <button
            onClick={() => window.open("/alejandro-prado-cv.pdf", "_blank")}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <FileText size={18} className="mr-2" />
            Preview CV
            <ArrowUpRight size={14} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
