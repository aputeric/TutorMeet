import {
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";

// JSON data for features
export const features = [
  {
    icon: <User className="h-6 w-6 text-emerald-400" />,
    title: "Create Your Profile",
    description:
      "Sign up and complete your profile to get personalized learning recommendations and services.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    title: "Book Appointments",
    description:
      "Browse tutor profiles, check availability, and book appointments that fit your schedule.",
  },
  {
    icon: <Video className="h-6 w-6 text-emerald-400" />,
    title: "Video Consultation",
    description:
      "Connect with tutors through secure, high-quality video consultations from the comfort of your home.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-emerald-400" />,
    title: "Consultation Credits",
    description:
      "Purchase credit packages that fit your learning needs with our simple subscription model.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    title: "Verified Tutors",
    description:
      "All tutors are carefully vetted and verified to ensure quality.",
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-400" />,
    title: "Learning Documentation",
    description:
      "Access and manage your appointment history, tutor's notes, and any recommendations.",
  },
];

// JSON data for testimonials
export const testimonials = [
  {
    initials: "SP",
    name: "Sarah P.",
    role: "Student",
    quote:
      "The video consultation feature saved me so much time. I was able to learn without taking time off work or traveling to a school.",
  },
  {
    initials: "TR",
    name: "Tr. Robert M.",
    role: "Math tutor",
    quote:
      "This platform has revolutionized how i teach. I can now reach more students without the constraints of a physical school setting.",
  },
  {
    initials: "JT",
    name: "James T.",
    role: "Parent",
    quote:
      "The credit system is so convenient. I purchased a package for my kids, and they've been able to study with specialists whenever needed.",
  },
];

// JSON data for credit system benefits
export const creditBenefits = [
  "Each consultation requires <strong class='text-emerald-400'>2 credits</strong> regardless of duration",
  "Credits <strong class='text-emerald-400'>never expire</strong> - use them whenever you need",
  "Monthly subscriptions give you <strong class='text-emerald-400'>fresh credits every month</strong>",
  "Cancel or change your subscription <strong class='text-emerald-400'>anytime</strong> without penalties",
];
