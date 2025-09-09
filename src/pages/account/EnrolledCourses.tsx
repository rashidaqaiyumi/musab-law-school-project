import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CourseCard from "../../components/courses/CourseCard";

type Course = {
  id: string;
  title: string;
  description: string | null;
  fee: number | null;
  language: string | null;
  specialization: string | null;
};

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]); // Using correct type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
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
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      const courseIds = data.map((item: { course_id: number }) => item.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

      if (coursesError) {
        console.error(coursesError);
        return;
      }

      setEnrolledCourses(courses); // Ensure courses have the correct structure
      setLoading(false);
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div>
      <h1>Enrolled Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {enrolledCourses.length === 0 ? (
            <p>No enrolled courses found.</p>
          ) : (
            enrolledCourses.map((course) => (
              <CourseCard key={course.id} c={course} context="saved" />

            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
