import Link from 'next/link';
import Navbar from './Navbar';

export default function Header() {
  return (
    <>
      <header className="flex items-center flex-wrap bg-green-400 p-3">
        <Link href="/" className="inline-flex items-center p-2 mr-8">
          <h1 className="text-xl text-white font-bold tracking-wide">
            Finance
          </h1>
        </Link>
        <Navbar />
      </header>
    </>
  );
}
