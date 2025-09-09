export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-playfair text-xl">Musab Law School</p>
            <p className="mt-1 text-sm text-gray-600">Practical, case-based legal education.</p>
          </div>
          <div>
            <p className="font-medium">Explore</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="/courses" className="hover:underline">Courses</a></li>
              <li><a href="/faculty" className="hover:underline">Faculty</a></li>
              <li><a href="/insights" className="hover:underline">Legal Insights</a></li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Support</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Musab Law School
          </div>
        </div>
      </div>
    </footer>
  );
}

