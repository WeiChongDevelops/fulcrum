export default function Navbar() {
    return (
        <nav className="bg-gray-500 text-white p-4">
            <div className="mx-auto flex flex-row justify-between items-center">
                <b>Fulcrum</b>
                <ul className="flex">
                    <li className="mx-2">
                        <a href="/about" className="hover:text-gray-300">About</a>
                    </li>
                    <li className="mx-2">
                        <a href="/expenses" className="hover:text-gray-300">Expenses</a>
                    </li>
                    <li className="mx-2">
                        <a href="/budget" className="hover:text-gray-300">Budget</a>
                    </li>
                    <li className="mx-2">
                        <a href="/tools" className="hover:text-gray-300">Tools</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}