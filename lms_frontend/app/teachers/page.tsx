import { DynamicBreadcrumb } from "@/components/DynamicBreadCrumb"
import AppAreaChart from "@/components/teacher/AppAreaChart"
import AppBarChart from "@/components/teacher/AppBarChart"
import AppPieChart from "@/components/teacher/AppPieChart"
import CardList from "@/components/teacher/CardList"
import TodoList from "@/components/TodoList"


export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
    <div>
        <DynamicBreadcrumb/>
      </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart/>
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Enrollments" />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg"><TodoList /></div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Courses" />
      </div>
    </div>
    </div>
  )
}
