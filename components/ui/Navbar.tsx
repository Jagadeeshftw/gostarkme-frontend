import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConnectWallet from "../ui/ConnectWalletButton";
import PriceBox from "./PriceBox";  

interface NavItem {
    label: string;
    href: string;
}

interface NavbarProps {
    logoSrc: string;
    logoAlt: string;
    title: string;
    navItems: NavItem[];
}

export const Navbar = ({
    logoSrc,
    logoAlt,
    title,
    navItems,
}: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky bg-white top-0 w-full z-20 border-b-[1px] border-gray-300">
            <div className="max-w-screen-2xl mx-auto w-full px-4 py-3 flex justify-between items-center">
                {/* Left section: Logo, Title and Desktop Menu */}
                <div className="flex items-center space-x-6">
                    {/* Logo and Title */}
                    <Link href={"/app"} className="flex items-center space-x-2">
                        <Image src={logoSrc} alt={logoAlt} width={30} height={30} />
                        <span className="text-lg font-semibold">{title}</span>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link 
                                key={item.href} 
                                href={item.href} 
                                className="text-gray-700 hover:text-gray-900"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right section: Price Box, Wallet Button and Mobile Menu */}
                <div className="flex items-center space-x-4">
                    {/* Price Box */}
                    <div className="hidden md:block">
                        <PriceBox />
                    </div>

                    {/* Wallet Button (mobile) */}
                    <div className="bottom-4 right-4 md:hidden">
                        <ConnectWallet />
                    </div>

                    {/* Hamburger Icon */}
                    <button
                        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                            />
                        </svg>
                    </button>

                    {/* Connect Wallet Button (desktop) */}
                    <div className="hidden md:block">
                        <ConnectWallet />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="flex flex-col space-y-2 py-3 px-4">
                        {/* Price Box in mobile menu */}
                        <div className="py-2">
                            <PriceBox />
                        </div>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;