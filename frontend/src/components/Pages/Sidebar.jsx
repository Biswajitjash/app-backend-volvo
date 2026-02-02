import { Link } from "react-router-dom";

const Sidebar = ({ isLogin, onLogin, onLogout }) => {
  const menuItems = [
                      "Admin",
                      "Approver Matix", 
                      "Site PR Tracking",
                      "Standard PR", 
                      "RFQ Creation",
                      "RFQ Maintain",
                      "Approver Status", 
                      "PO Followup", 
                      "PO-GR History", 
                      "VoLvo Truck Score",
                      "Volvo API Hub",
                      "SkyWise Techonologies",
                      "Api Testing",                      
                      "Vendor Return", 
                      "Vendor Payment", 
                      "Vendor Evalution", 
                      "Reports"
                    ];
  return (


  <aside className=" py-2.5 cursor-pointer color-change  text-black font-italy  w-full h-full flex flex-col p-1 space-y-5">
          { menuItems.map((item) => (
      <Link 
      key={item} 
      to={ `/${item.toLowerCase().replace(/\s+/g, "-") }`} 
      className=" 
                  transition-transform duration-800 ease-in-out transform
                  hover:scale-[1.2] hover:shadow-xl
                  hover:bg-red-400 transition px-4 hover:text-white" >
          {item}
        </Link>
      ))}
    </aside>

  );
};

export default Sidebar;