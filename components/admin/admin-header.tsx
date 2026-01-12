import { SidebarTrigger } from "../ui/sidebar";


const AdminHeader = () => {
  return (
    <header className="flex justify-between">
        <SidebarTrigger/>
        <div>
            <h1>Admin</h1>
        </div>
        <div>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    </header>
  )
}

export default AdminHeader;