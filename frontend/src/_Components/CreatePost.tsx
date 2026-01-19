import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export const CreatePost = () => {
    return (
        <div className="absolute right-10 bottom-10 
        bg-main rounded-full p-2 hover:bg-main/80 duration-300">
            <Link href="postCreation/"><FaPlus size={35} /></Link>
        </div>
    );
}
