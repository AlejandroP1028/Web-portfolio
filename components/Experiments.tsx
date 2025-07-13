// "use client";

// import { useRef } from "react";
// import { ExternalLink, Github, Beaker, Clock, Lightbulb } from "lucide-react";

// const experiments = [
//   {
//     title: "Real-time Collaborative Editor",
//     description:
//       "Experimenting with operational transforms and WebRTC for real-time document collaboration.",
//     tech: ["React", "WebRTC", "Operational Transforms"],
//     status: "In Progress",
//     type: "exploration",
//     github: "#",
//   },
//   // {
//   //   title: "Performance Monitoring Dashboard",
//   //   description:
//   //     "Building a lightweight performance monitoring tool for web applications.",
//   //   tech: ["Next.js", "Web Vitals API", "Chart.js"],
//   //   status: "Prototype",
//   //   type: "tool",
//   //   github: "#",
//   // },
//   // {
//   //   title: "Component Playground",
//   //   description:
//   //     "Interactive playground for testing and documenting React components with live code editing.",
//   //   tech: ["React", "Monaco Editor", "Babel"],
//   //   status: "Side Project",
//   //   type: "tool",
//   //   github: "#",
//   //   live: "#",
//   // },
//   // {
//   //   title: "API Rate Limiter",
//   //   description:
//   //     "Exploring different rate limiting algorithms and their implementations in Node.js.",
//   //   tech: ["Node.js", "Redis", "Express"],
//   //   status: "Learning",
//   //   type: "exploration",
//   //   github: "#",
//   // },
//   // {
//   //   title: "CSS Animation Library",
//   //   description:
//   //     "Creating a collection of smooth, performant CSS animations for web interfaces.",
//   //   tech: ["CSS", "GSAP", "TypeScript"],
//   //   status: "Active",
//   //   type: "library",
//   //   github: "#",
//   //   live: "#",
//   // },
//   // {
//   //   title: "Micro Frontend Experiment",
//   //   description:
//   //     "Testing micro frontend architecture patterns with module federation.",
//   //   tech: ["Webpack", "React", "Module Federation"],
//   //   status: "Research",
//   //   type: "exploration",
//   //   github: "#",
//   // },
// ];

// const statusColors = {
//   "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
//   Prototype: "bg-yellow-100 text-yellow-700 border-yellow-200",
//   "Side Project": "bg-green-100 text-green-700 border-green-200",
//   Learning: "bg-purple-100 text-purple-700 border-purple-200",
//   Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
//   Research: "bg-orange-100 text-orange-700 border-orange-200",
// };

// const typeIcons = {
//   exploration: Lightbulb,
//   tool: Clock,
//   library: Beaker,
// };

// export default function Experiments() {
//   const sectionRef = useRef<HTMLElement>(null);

//   return (
//     <section id="experiments" ref={sectionRef} className="py-24 relative">
//       <div className="max-w-5xl mx-auto px-6">
//         <div className="text-center mb-16 fade-in">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <Beaker size={24} className="text-gray-600" />
//             <h2 className="text-3xl font-light text-gray-900">
//               Labs & Experiments
//             </h2>
//           </div>
//           <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Side projects and experiments where I explore new technologies, test
//             ideas, and learn by building
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {experiments.map((experiment, index) => (
//             <div
//               key={index}
//               className="p-6 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-300 fade-in group"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-2">
//                   {typeIcons[experiment.type as keyof typeof typeIcons] && (
//                     <div className="p-1.5 bg-gray-100 rounded">
//                       {(() => {
//                         const Icon =
//                           typeIcons[experiment.type as keyof typeof typeIcons];
//                         return <Icon size={14} className="text-gray-600" />;
//                       })()}
//                     </div>
//                   )}
//                   <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
//                     {experiment.title}
//                   </h3>
//                 </div>
//                 <span
//                   className={`px-2 py-1 border rounded-full text-xs font-medium ${
//                     statusColors[experiment.status as keyof typeof statusColors]
//                   }`}
//                 >
//                   {experiment.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//                 {experiment.description}
//               </p>

//               <div className="flex flex-wrap gap-1 mb-4">
//                 {experiment.tech.map((tech, techIndex) => (
//                   <span
//                     key={techIndex}
//                     className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>

//               <div className="flex space-x-3">
//                 <a
//                   href={experiment.github}
//                   className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded"
//                 >
//                   <Github size={16} />
//                 </a>
//                 {experiment.live && (
//                   <a
//                     href={experiment.live}
//                     className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded"
//                   >
//                     <ExternalLink size={16} />
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-12 text-center fade-in">
//           <p className="text-sm text-gray-500 mb-4">
//             These experiments help me stay curious and explore the boundaries of
//             what's possible with code.
//           </p>
//           <a
//             href="#"
//             className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm group"
//           >
//             View all experiments on GitHub
//             <ExternalLink
//               size={14}
//               className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
//             />
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }
