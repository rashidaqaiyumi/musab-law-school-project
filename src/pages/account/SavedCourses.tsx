import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CourseCard from "../../components/courses/CourseCard";

const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCourses = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError.message);
        return;
      }

      const user = session?.user;
      if (!user) {
        console.error("User is not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("saved_courses")
        .select("course_id")
        .eq("user_id", user.id); // Adjust based on current user

      if (error) {
        console.error(error);
        return;
      }

      const courseIds = data.map((item: { course_id: string }) => item.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

      if (coursesError) {
        console.error(coursesError);
        return;
      }

      setSavedCourses(courses);
      setLoading(false);
    };

    fetchSavedCourses();
  }, []);

  return (
    <div>
      <h1>Saved Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {savedCourses.map((course: any) => (
            <CourseCard key={course.id} c={course} context="saved" />

          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCourses;
