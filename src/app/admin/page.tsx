import { Navbar } from "@/components/shared/Navbar"; import { AdminGate } from "@/components/admin/AdminGate"; import { AdminDashboard } from "@/components/admin/AdminDashboard";
export default function Admin(){return <><Navbar/><AdminGate><AdminDashboard/></AdminGate></>}
