import { BellIcon, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div
      className="h-[80px] bg-white flex items-center justify-between px-6"
      style={{
        borderBottom: "1px solid #E4F0E4",
      }}
    >
      <InputGroup className="bg-[#F5F9F2] max-w-[384px]">
        <InputGroupInput placeholder="Buscar huéspedes, dueños o servicios" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="w-4 h-4" />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex gap-6 items-center">
        <Button
          variant="outline"
          className="bg-[#FFF] hover:bg-[#F5F9F2] border-[#F3F4F6] rounded-full w-[36px]"
        >
          <BellIcon className="w-4 h-4" />
        </Button>
        <Button size="lg" variant="secondary" className="rounded-full">
          {/* <PlusCircleIcon className="w-4 h-4" /> */}
          <span className="text-base mb-[1px]">Check-In</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
