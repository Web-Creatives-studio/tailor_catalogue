import "../globals.css";
import Wrap from "../components/dashboard/Wrap";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Wrap>{children}</Wrap>
    </>
  );
}
