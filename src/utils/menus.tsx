// icons
import { MdBrowseGallery } from "react-icons/md";
import { FcEditImage } from "react-icons/fc";
import { GrBlog, GrDashboard, GrServices } from "react-icons/gr";
import { FaCircleQuestion, FaFireExtinguisher } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";

import {
  FiBook,
  FiGlobe,
  FiPaperclip,
  FiTag,
  FiMail,
  FiUsers,
  FiEdit3,
  FiUser,
  FiShuffle,
  FiStar,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import { IoSchoolOutline } from "react-icons/io5";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SlEvent } from "react-icons/sl";

export const useMenu = () => {
  const t = useTranslations("menus");

  const menus = [
    {
      name: "dashboard",
      list: "/dashboard",
      icon: <GrDashboard />,
      meta: {
        canAccess: ["admin"],
        label: "Dashboard",
      },
    },
    {
      name: "role-switcher",
      list: "/dashboard/role-switcher",
      icon: <FiShuffle />,
      meta: {
        canAccess: ["admin"],
        label: "Role Switcher",
        isSpecial: true, // Mark as special component
      },
    },
    {
      name: "meta-data",
      list: "/dashboard/meta-management",
      create: "/dashboard/meta-management/create",
      edit: "/dashboard/meta-management/edit/:id",
      show: "/dashboard/meta-management/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "SEO Meta Management",
      },
      icon: <FiEdit3 />,
    },
    {
      name: "posts",
      list: "/dashboard/blog-posts",
      create: "/dashboard/blog-posts/create",
      edit: "/dashboard/blog-posts/edit/:id",
      show: "/dashboard/blog-posts/show/:id",
      meta: {
        canAccess: ["admin", "creator"],
        label: "Posts",
      },
      icon: <GrBlog />,
    },
    {
      name: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Settings",
      },
    },
    {
      name: "categories",
      list: "/dashboard/categories",
      create: "/dashboard/categories/create",
      edit: "/dashboard/categories/edit/:id",
      show: "/dashboard/categories/show/:id",
      icon: <TbCategoryPlus />,
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Categories",
        parent: "settings",
      },
    },
    {
      name: "tags",
      list: "/dashboard/tags",
      create: "/dashboard/tags/create",
      edit: "/dashboard/tags/edit/:id",
      show: "/dashboard/tags/show/:id",
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Tags",
        parent: "settings",
      },
      icon: <FiTag />,
    },
    {
      name: "banners",
      list: "/dashboard/banners",
      create: "/dashboard/banners/create",
      edit: "/dashboard/banners/edit/:id",
      show: "/dashboard/banners/show/:id",
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Banners",
        parent: "settings",
      },
      icon: <FcEditImage />,
    },

    {
      name: "events",
      list: "/dashboard/events",
      create: "/dashboard/events/create",
      edit: "/dashboard/events/edit/:id",
      show: "/dashboard/events/show/:id",
      meta: {
        canAccess: ["admin", "creator"],
        label: "Events",
      },
      icon: <SlEvent />,
    },
    {
      name: "services",
      list: "/dashboard/services",
      create: "/dashboard/services/create",
      edit: "/dashboard/services/edit/:id",
      show: "/dashboard/services/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Services",
      },
      icon: <GrServices />,
    },
    {
      name: "projects",
      list: "/dashboard/projects",
      create: "/dashboard/projects/create",
      edit: "/dashboard/projects/edit/:id",
      show: "/dashboard/projects/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Projects",
      },
      icon: <AiOutlineFundProjectionScreen />,
    },
    {
      name: "users",
      list: "/dashboard/users",
      create: "/dashboard/users/create",
      edit: "/dashboard/users/edit/:id",
      show: "/dashboard/users/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Users",
      },
      icon: <IoSchoolOutline />,
    },
    {
      name: "opportunities",
      list: "/dashboard/opportunities",
      create: "/dashboard/opportunities/create",
      edit: "/dashboard/opportunities/edit/:id",
      show: "/dashboard/opportunities/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Opportunities",
      },
      icon: <FiGlobe />,
    },
    {
      name: "lms",
      list: "/dashboard/lms",
      meta: {
        canAccess: ["admin", "creator"],
        label: "LMS",
      },
      icon: <IoSchoolOutline />,
    },
    // Student Dashboard
    {
      name: "student",
      list: "/dashboard/student",
      meta: {
        canAccess: ["student"],
        label: "Student Dashboard",
      },
      icon: <FiUser />,
    },
    {
      name: "student-courses",
      list: "/dashboard/student/courses",
      parentName: "student",
      meta: {
        canAccess: ["student"],
        label: "Browse Courses",
        parent: "student",
      },
      icon: <FiBook />,
    },
    // Content Creator Dashboard
    {
      name: "creator",
      list: "/dashboard/creator",
      meta: {
        canAccess: ["creator", "admin"],
        label: "Creator Dashboard",
      },
      icon: <FiEdit3 />,
    },
    // {
    {
      name: "courses",
      list: "/dashboard/courses",
      create: "/dashboard/courses/create",
      edit: "/dashboard/courses/edit/:id",
      show: "/dashboard/courses/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin", "creator"],
        label: "Courses",
        parent: "lms",
      },
      icon: <FiBook />,
    },
    {
      name: "lessons",
      list: "/dashboard/lessons",
      create: "/dashboard/lessons/create",
      edit: "/dashboard/lessons/edit/:id",
      show: "/dashboard/lessons/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin", "creator"],
        label: "Lessons",
        parent: "lms",
      },
      icon: <FiPaperclip />,
    },
    {
      name: "quizes",
      list: "/dashboard/quizes",
      create: "/dashboard/quizes/create",
      edit: "/dashboard/quizes/edit/:id",
      show: "/dashboard/quizes/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin", "creator"],
        label: "Quizzes",
        parent: "lms",
      },
      icon: <FaCircleQuestion />,
    },
    {
      name: "enrollments",
      list: "/dashboard/enrollments",
      create: "/dashboard/enrollments/create",
      edit: "/dashboard/enrollments/edit/:id",
      show: "/dashboard/enrollments/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "Enrollments",
        parent: "lms",
      },
      icon: <FiUsers />,
    },
    {
      name: "professionals",
      list: "/dashboard/professionals",
      create: "/dashboard/professionals/create",
      edit: "/dashboard/professionals/edit/:id",
      show: "/dashboard/professionals/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Professionals",
      },
      icon: <FiUsers />,
    },
    {
      name: "subscribers",
      list: "/dashboard/subscribers",
      create: "/dashboard/subscribers/create",
      edit: "/dashboard/subscribers/edit/:id",
      show: "/dashboard/subscribers/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Subscribers",
      },
      icon: <FiMail />,
    },
    {
      name: "mailing-list",
      list: "/dashboard/admin/mailing-list",
      meta: {
        canAccess: ["admin"],
        label: "Mailing List",
      },
      icon: <FiMail />,
    },
    {
      name: "partners",
      list: "/dashboard/partners",
      create: "/dashboard/partners/create",
      edit: "/dashboard/partners/edit/:id",
      show: "/dashboard/partners/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Partners",
      },
      icon: <FiUsers />,
    },
    {
      name: "referrals",
      list: "/dashboard/referrals",
      create: "/dashboard/referrals/create",
      edit: "/dashboard/referrals/edit/:id",
      show: "/dashboard/referrals/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Referrals Management",
      },
      icon: <FiStar />,
    },
  ];

  return { menus };
};
