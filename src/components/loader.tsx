import { Loader } from "lucide-react";

export default function LoaderAnimation(){
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Loader className="w-20 h-20 animate-spin text-bgGray" />
        </div>
    )
}