import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import CourseCard from '../../components/courses/CourseCard';

// Define the type for the course data
export type Course = {
  id: string;
  title: string;
  description: string | null;
  fee: number;
  price?: number | null;
  language?: string | null;
  specialization?: string | null;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All specializations');

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, price, fee, language, specialization')
          .eq('status', 'published')
          .limit(50); // Limit the number of courses to prevent overload

        if (error) {
          console.error('Error fetching courses:', error);
          setLoading(false);
          return;
        }

        // Normalize the data to handle missing `fee`
        const normalizedCourses: Course[] = (data || []).map((course) => ({
          ...course,
          fee: course.fee || course.price || 0, // Fallback to 0 if missing
        }));

        setCourses(normalizedCourses);
        setFilteredCourses(normalizedCourses); // Initially show all courses
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and specialization
  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All specializations') {
      filtered = filtered.filter((course) => course.specialization === selectedSpecialization);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedSpecialization]);

  const specializations = [
    'All specializations',
    ...new Set(courses.map((course) => course.specialization).filter(Boolean)),
  ];

  if (loading) {
    return <div className="text-center">Loading courses...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-64">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-right mb-4 text-gray-600">{filteredCourses.length} result(s)</div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No matching courses.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} c={course} context="courses" />
          ))}
        </div>
      )}
    </div>
  );
}
