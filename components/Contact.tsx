"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Coffee,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, ValidationError } from "@formspree/react";
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   message: "",
  // });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  // };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const [sent, setSent] = useState(false);
  const [state, handleSubmit] = useForm("mdkdneoz");
  useEffect(() => {
    if (state.succeeded) {
      toast.success("Message successfully sent.");
      setSent(true); // ← you can leave this or remove it if not used elsewhere
    }
  }, [state.succeeded]);

  return (
    <section id="contact" ref={sectionRef} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Let's Connect
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm always interested in discussing new projects, sharing ideas
            about technology, or just having a conversation about development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="fade-in">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Get in Touch
                </h3>
                <div className="prose prose-gray">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Whether you have a project in mind, want to collaborate on
                    something interesting, or just want to chat about
                    technology, I'd love to hear from you.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    I'm particularly excited about opportunities involving
                    modern web technologies, real-time applications, or
                    interesting technical challenges that push the boundaries of
                    what's possible.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-gray-600" />
                  <span className="text-gray-700">
                    alejandroprado885@gmail.com
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Coffee size={18} className="text-gray-600" />
                  <span className="text-gray-700">
                    Always up for a coffee chat about tech
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Find me online
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/AlejandroP1028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-600 hover:text-gray-900 group"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://linkedin.com/in/aliprado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-600 hover:text-gray-900 group"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-in">
            <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    // value={formData.name}
                    // onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all bg-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    // value={formData.email}
                    // onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all bg-white"
                    placeholder="your@email.com"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    // value={formData.message}
                    // onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all resize-none bg-white"
                    placeholder="Tell me about your project, or just say hi..."
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting || sent}
                  className={`w-full px-6 py-3  text-white rounded-lg  flex items-center justify-center space-x-2 group ${
                    sent
                      ? "bg-gray-400"
                      : "bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                  }`}
                >
                  <span>
                    {state.submitting ? "Sending..." : "Send Message"}
                  </span>
                  <Send size={16} />
                  {(!sent || !state.submitting) && (
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
