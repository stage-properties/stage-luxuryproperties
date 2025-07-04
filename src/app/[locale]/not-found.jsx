import Image from 'next/image';
import { Link } from '@/i18n/routing';

export const metadata = {
  title: 'Not Found (404) | Stage Properties'
};

export default function NotFound() {
  return (
    <div className="notFound">
      <div className="container">
        <Image
          src="/404.webp"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="overlay"></div> {/* Gradient overlay */}
        <Link href='/' className="globalBtn backHomeBtn">
          back to homepage
        </Link>
      </div>
    </div>
  );
}