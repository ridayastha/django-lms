import StudentSidebar from "@/components/student/StudentSidebar";
import StudentNavbar from "@/components/student/StudentNavbar";
import Navbar from "@/components/teacher/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}