import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export const CreateArticle = () => {
    return (
        <div className="fixed right-10 bottom-10 
        bg-main rounded-full p-2 hover:bg-main/80 duration-300">
            <Link href="articleCreator/"><FaPlus size={35} /></Link>
        </div>
    );
}
