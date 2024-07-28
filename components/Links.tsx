import { User } from "@prisma/client";
import Link from "next/link";

function Links({ user }: { user: User | null }) {
  return (
    <>
      {user && (
        // Logged in user links
        <>
          <Link className="py-2" href="/schedule">
            Schedule
          </Link>
          <Link className="py-2" href="/explore">
            Explore
          </Link>
          <Link className="py-2" href="/calendar">
            Calendar
          </Link>
          <Link className="py-2" href="/listings">
            My listings
          </Link>
        </>
      )}

      {/* Links for unlogged in user */}
      {user == null && (
        <>
          <Link className="py-2" href="/about-us">
            About us
          </Link>
          <Link className="py-2" href="/contact-us">
            Contact us
          </Link>
          <Link className="py-2" href="/explore">
            Explore
          </Link>
        </>
      )}
    </>
  );
}

export default Links;
