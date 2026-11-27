import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ContactData, ContactInquiry } from '../types/portfolio';

interface ContactSectionProps {
  contact: ContactData;
  onSubmitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection({ contact, onSubmitInquiry }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    if (name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }
    if (message.trim().length < 10) {
      errors.message = 'Please include a short message (at least 10 characters).';
    }
    return errors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmitInquiry({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'Portfolio Inquiry',
      message: message.trim(),
    });

    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setFieldErrors({});
    setSubmitted(true);
  };

  const whatsappDigits = contact.whatsapp.replace(/[^\d]/g, '');
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : '';

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#FAFAFB]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Direct Contact Details & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-3">
                {contact.sectionTitle}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight text-balance mb-4">
                Let’s collaborate on your next project or workshop.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {contact.introText}
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              <a
                href={`mailto:${contact.email}`}
                className="min-h-[56px] flex items-center justify-between gap-4 py-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-slate-500 group-hover:text-blue-700 shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate transition-colors">
                      {contact.email}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 shrink-0 transition-colors" />
              </a>

              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="min-h-[56px] flex items-center justify-between gap-4 py-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Phone className="w-4 h-4 text-slate-500 group-hover:text-blue-700 shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 font-mono-tabular transition-colors">
                      {contact.phone}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 shrink-0 transition-colors" />
              </a>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[56px] flex items-center justify-between gap-4 py-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-blue-700 shrink-0 transition-colors" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">WhatsApp Direct</p>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 font-mono-tabular transition-colors">
                        {contact.whatsapp}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 shrink-0 transition-colors" />
                </a>
              )}

              <div className="flex items-center gap-3 py-4">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Location & Availability</p>
                  <p className="text-sm font-medium text-slate-900">
                    {contact.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {contact.availabilityNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {contact.socials.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-3">
                  Elsewhere Online
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contact.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[52px] flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:text-blue-700 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                          {social.platform}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {social.handle}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clean Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">
                Send an Inquiry
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Fields marked with <span className="text-rose-600">*</span> are required.
              </p>

              {submitted ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-800 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Inquiry received — thank you for reaching out.</span>
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed">
                    Your message has been saved for Miss Sobia and can be reviewed inside
                    the Admin Dashboard under Contact &amp; Settings.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="min-h-[40px] px-4 py-2 text-xs font-medium rounded-lg border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        aria-invalid={Boolean(fieldErrors.name)}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) {
                            setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Dr. Ayesha Tariq"
                        className={`w-full min-h-[42px] px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                          fieldErrors.name
                            ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600/15'
                            : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/15'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 text-xs text-rose-700" role="alert">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        aria-invalid={Boolean(fieldErrors.email)}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="ayesha@university.edu"
                        className={`w-full min-h-[42px] px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                          fieldErrors.email
                            ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600/15'
                            : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/15'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-rose-700" role="alert">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Curriculum Workshop / UI Design Collaboration"
                      className="w-full min-h-[42px] px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Message <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      aria-invalid={Boolean(fieldErrors.message)}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (fieldErrors.message) {
                          setFieldErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder="Tell Miss Sobia about your timeline, goals, or cohort details..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y ${
                        fieldErrors.message
                          ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600/15'
                          : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/15'
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="mt-1.5 text-xs text-rose-700" role="alert">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
