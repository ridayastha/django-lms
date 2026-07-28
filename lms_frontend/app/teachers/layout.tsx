import StudentSidebar from "@/components/student/StudentSidebar";
import StudentNavbar from "@/components/student/StudentNavbar";
import AppSidebar from "@/components/teacher/AppSidebar";
import Navbar from "@/components/teacher/Navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}