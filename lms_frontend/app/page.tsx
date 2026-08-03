import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Star,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  BarChart3,
  Globe,
  Clock,
  ClipboardList,
} from "lucide-react";

// Mock Data for Scrolling Logos
const partnerLogos = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Meta",
  "Harvard",
  "MIT",
  "Stanford",
];

// Mock Featured Courses
const featuredCourses = [
  {
    title: "Full-Stack Web Development Bootcamp",
    category: "Development",
    level: "Beginner",
    rating: 4.9,
    students: "2,400+",
    instructor: "Sarah Jenkins",
    price: "$49.99",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Advanced Data Science & Machine Learning",
    category: "Data Science",
    level: "Intermediate",
    rating: 4.8,
    students: "1,850+",
    instructor: "Dr. Alex Rivera",
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "UI/UX Design Masterclass 2026",
    category: "Design",
    level: "All Levels",
    rating: 4.9,
    students: "3,100+",
    instructor: "Elena Rostova",
    price: "$39.99",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2 font-bold text-xl" href="/">
            <div className="bg-primary text-primary-foreground p-1.5 rounded">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span>HridayaLMS</span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-background dark:from-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <Badge variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5 text-primary rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                The Next-Gen Learning Management System
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                Master New Skills with World-Class Education
              </h1>

              <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Empowering teachers to build engaging courses and students to accelerate their careers with interactive quizzes and certified paths.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 min-w-[280px]">
                <Link href="/students" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-8 gap-2">
                    Student Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/teachers" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full px-8">
                    Teacher Portal
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Metrics */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Free Trial Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>4.9/5 Rating (10k+ Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Horizontal Scrolling Company Logos (Marquee) */}
        <section className="w-full py-10 bg-muted/40 border-y overflow-hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Trusted by teams & students from global leaders
          </p>

          <div className="relative w-full overflow-hidden">
            {/* CSS Keyframe Animation for Infinite Scroll */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: 200%;
                animation: marquee 25s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="animate-marquee items-center justify-around gap-8">
              {/* Duplicate array twice for seamless loop */}
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-w-[140px] text-muted-foreground/60 font-bold text-xl tracking-wider uppercase hover:text-foreground transition-colors"
                >
                  <Globe className="h-5 w-5 mr-2 opacity-50" />
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Platform Statistics */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 border rounded-xl bg-card">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">10,000+</p>
                <p className="text-sm text-muted-foreground mt-1">Active Students</p>
              </div>
              <div className="p-6 border rounded-xl bg-card">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">500+</p>
                <p className="text-sm text-muted-foreground mt-1">Expert Courses</p>
              </div>
              <div className="p-6 border rounded-xl bg-card">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">98%</p>
                <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
              </div>
              <div className="p-6 border rounded-xl bg-card">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">15,000+</p>
                <p className="text-sm text-muted-foreground mt-1">Certificates Earned</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Courses Section */}
        <section id="courses" className="w-full py-16 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-between md:flex-row mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
                <p className="text-muted-foreground mt-1">
                  Explore top-rated courses taught by industry leaders.
                </p>
              </div>
              <Link href="/courses">
                <Button variant="outline" className="gap-2">
                  View All Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course, idx) => (
                <Card key={idx} className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/90 text-foreground hover:bg-background">
                        {course.level}
                      </Badge>
                    </div>

                    <CardHeader className="p-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span className="font-semibold text-primary">{course.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-medium text-foreground">{course.rating}</span>
                          <span>({course.students})</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="text-xs mt-2">
                        Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between border-t mt-4 pt-4">
                    <span className="text-xl font-bold text-primary">{course.price}</span>
                    <Link href="/courses">
                      <Button size="sm" variant="secondary" className="gap-1">
                        Enroll Now <PlayCircle className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. How It Works */}
        <section id="how-it-works" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight">How Hridaya Soft Works</h2>
              <p className="text-muted-foreground mt-2">
                Start learning or teaching in three effortless steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Explore & Enroll</h3>
                <p className="text-sm text-muted-foreground">
                  Browse through hundreds of curated course categories and enroll instantly.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Learn at Your Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Watch HD video lessons, download source materials, and attempt quizzes.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Certification</h3>
                <p className="text-sm text-muted-foreground">
                  Pass your final assessments to receive verifiable completion certificates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Key Features */}
        <section id="features" className="w-full py-16 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground mt-2">
                Designed for both modern educators and ambitious learners.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <BookOpen className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Comprehensive Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Organized by chapters, lessons, video streaming, and downloadable attachments.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <ClipboardList className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Interactive Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Test student knowledge with automated pass mark criteria and instant scores.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <Award className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Verified Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate unique UUID certificates upon successful completion.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <BarChart3 className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track completed lessons, quiz pass rates, and overall student progression.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <Star className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Reviews & Ratings</h3>
                <p className="text-sm text-muted-foreground">
                  Honest student feedback and rating metrics for continuous course improvement.
                </p>
              </div>

              <div className="flex flex-col space-y-3 p-6 border rounded-xl bg-card">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Role-Based Portals</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated user interfaces tailored specifically for Admins, Teachers, and Students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Loved by Students & Educators</h2>
              <p className="text-muted-foreground mt-2">
                See what our community has to say about their learning experience.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "The structured courses and instant certificate generation helped me showcase my web development skills directly on LinkedIn."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                    <AvatarFallback>HS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Hridaya Shrestha</p>
                    <p className="text-xs text-muted-foreground">Frontend Student</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "As an instructor, publishing my chapters, attachments, and quizzes in one unified dashboard has saved me hours every week."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=47" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Sarah Jenkins</p>
                    <p className="text-xs text-muted-foreground">Senior Tech Instructor</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "The progress tracking kept me motivated to complete my Data Science course. The quiz retakes helped reinforce key concepts."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Aarav Patel</p>
                    <p className="text-xs text-muted-foreground">Data Science Student</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 9. CTA Call To Action Banner */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Join thousands of students and teachers today. Gain instant access to interactive courses and professional certifications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8 font-semibold">
                  Get Started For Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="px-8 bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Multi-column Footer */}
      <footer className="w-full border-t bg-background py-12">
        <div className="container px-4 md:px-6 mx-auto grid gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Link className="flex items-center gap-2 font-bold text-xl" href="/">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>HridayaSoft LMS</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Empowering learners worldwide through modern course management, automated quizzes, and verifiable certifications.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold">Platform</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground">Browse Courses</Link></li>
              <li><Link href="/categories" className="hover:text-foreground">Categories</Link></li>
              <li><Link href="/teachers" className="hover:text-foreground">For Teachers</Link></li>
              <li><Link href="/students" className="hover:text-foreground">For Students</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground">Press</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>© 2026 Janaki Soft LMS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}