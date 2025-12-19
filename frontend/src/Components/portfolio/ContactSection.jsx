import React from "react";
import { Mail, Phone, Github, Linkedin, Twitter } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="relative py-16 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Ready to collaborate on your next project or discuss opportunities
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Get In Touch Card */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-10 border border-slate-700/50">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Get In Touch
            </h3>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <ul className="list-disc list-inside text-white text-base space-y-1">
                    <li>
                      <a
                        href="mailto:omkatiyar123hash@gmail.com"
                        className="hover:underline"
                      >
                        omkatiyar123hash@gmail.com
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:okatiyar@ec.iitr.ac.in"
                        className="hover:underline"
                      >
                        okatiyar@ec.iitr.ac.in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+919027834290"
                className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-0.5">Phone</p>
                  <p className="text-white font-medium text-base">
                    +91-9027834290
                  </p>
                </div>
              </a>
            </div>

            {/* Social Icons INSIDE Get In Touch */}
            <div className="mt-10 flex justify-center space-x-6">
              {[
                {
                  icon: Github,
                  label: "GitHub",
                  href: "https://github.com/omkatiyar",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href:
                    "https://www.linkedin.com/in/om-katiyar-277a301ba/",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://twitter.com/OmKatiyar23",
                },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="relative group">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 transition-all duration-300 hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </a>

                  {/* Tooltip */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

  
        </div>
      </div>
    </div>
  );
}
