import { useEffect, useState } from "react"; 
import { supabase } from "../../lib/supabase";
import CourseCard from "../../components/courses/CourseCard";

export default function PurchasedCourses() {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) {
        window.location.href = "/login?next=/account/purchased";
        return;
      }

      const { data, error } = await supabase
        .from("v_purchased_courses_by_user")
        .select("*")
        .eq("user_id", uid);

      if (error) console.log(error.message);
      else setPurchasedCourses(data);

      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl mb-6">Purchased Courses</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedCourses.map((course) => (
            <CourseCard key={course.course_id} course={course} context="purchased" />
          ))}
        </div>
      )}
    </div>
  );
}
